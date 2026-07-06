import Stripe from 'stripe';
import { createHmac, randomBytes } from 'crypto';

// ─── Hard-fail on missing secrets ───────────────────────────────────────────
// Never fall back to mock/placeholder values. If a required secret is absent
// in any environment, the application must throw immediately so the
// misconfiguration is visible rather than silently producing broken behavior.

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `[Stripe] Missing required environment variable: ${name}. ` +
      `Set this in your Vercel project environment variables.`
    );
  }
  return value;
}

function getStripeSecretKey(): string {
  return requireEnv('STRIPE_SECRET_KEY');
}

function getStripeConnectClientId(): string {
  return requireEnv('STRIPE_CONNECT_CLIENT_ID');
}

function getStripeStateSecret(): string {
  return requireEnv('STRIPE_CONNECT_STATE_SECRET');
}

// Initialize stripe lazily to avoid loading issues in client contexts
let stripeInstance: Stripe | null = null;
function getStripe() {
  if (!stripeInstance) {
    stripeInstance = new Stripe(getStripeSecretKey(), {
      apiVersion: '2025-02-24' as any,
    });
  }
  return stripeInstance;
}

// ─── CSRF-protected OAuth state ──────────────────────────────────────────────
// The `state` parameter in OAuth must be an unguessable token, not a plain
// slug. We use HMAC-SHA256 to create a signed, time-limited token that encodes
// the restaurant slug. The callback verifies this signature before trusting
// the slug or processing the code exchange.

const STATE_TTL_MS = 15 * 60 * 1000; // 15 minutes

export function createConnectState(restaurantSlug: string): string {
  const secret = getStripeStateSecret();
  const nonce = randomBytes(16).toString('hex');
  const ts = Date.now().toString();
  const payload = `${restaurantSlug}:${ts}:${nonce}`;
  const sig = createHmac('sha256', secret).update(payload).digest('hex');
  // Encode as base64 so it survives URL transit safely
  return Buffer.from(`${payload}:${sig}`).toString('base64url');
}

export function verifyConnectState(
  state: string
): { valid: true; slug: string } | { valid: false; reason: string } {
  try {
    const secret = getStripeStateSecret();
    const decoded = Buffer.from(state, 'base64url').toString('utf8');
    const parts = decoded.split(':');
    if (parts.length !== 4) return { valid: false, reason: 'Malformed state' };

    const [slug, ts, nonce, sig] = parts;
    const payload = `${slug}:${ts}:${nonce}`;
    const expectedSig = createHmac('sha256', secret).update(payload).digest('hex');

    // Constant-time comparison to prevent timing attacks
    const sigBuf = Buffer.from(sig, 'hex');
    const expectedBuf = Buffer.from(expectedSig, 'hex');
    if (sigBuf.length !== expectedBuf.length) return { valid: false, reason: 'Invalid signature' };

    let mismatch = 0;
    for (let i = 0; i < sigBuf.length; i++) {
      mismatch |= sigBuf[i] ^ expectedBuf[i];
    }
    if (mismatch !== 0) return { valid: false, reason: 'Invalid signature' };

    // Check token age
    const issuedAt = parseInt(ts, 10);
    if (isNaN(issuedAt) || Date.now() - issuedAt > STATE_TTL_MS) {
      return { valid: false, reason: 'State token expired' };
    }

    return { valid: true, slug };
  } catch {
    return { valid: false, reason: 'State verification error' };
  }
}

export function getConnectOAuthUrl(restaurantSlug: string, origin: string): string {
  const clientId = getStripeConnectClientId();
  const redirectUri = `${origin}/api/stripe/connect/callback`;
  const state = createConnectState(restaurantSlug);
  return (
    `https://connect.stripe.com/oauth/authorize` +
    `?response_type=code` +
    `&client_id=${clientId}` +
    `&scope=read_write` +
    `&state=${encodeURIComponent(state)}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}`
  );
}

export async function exchangeCodeForUser(code: string) {
  const stripe = getStripe();
  const response = await stripe.oauth.token({
    grant_type: 'authorization_code',
    code,
  });
  return {
    stripeUserId: response.stripe_user_id,
  };
}

export async function createSubscriptionCheckoutSession(
  restaurantId: string,
  restaurantName: string,
  customerEmail: string,
  origin: string
) {
  const stripe = getStripe();
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'eur',
          product_data: {
            name: `Speisely Restaurant Starter Plan - ${restaurantName}`,
            description: 'starter subscription for direct orders (0% commission)',
          },
          unit_amount: 3499, // €34.99
          recurring: {
            interval: 'month',
          },
        },
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: `${origin}/_authenticated/restaurant?billing_success=true&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/_authenticated/restaurant?billing_cancel=true`,
    customer_email: customerEmail,
    metadata: {
      restaurant_id: restaurantId,
      type: 'restaurant_subscription',
    },
  });

  return { url: session.url };
}

export async function createBillingPortalSession(
  stripeCustomerId: string,
  origin: string
) {
  const stripe = getStripe();
  const session = await stripe.billingPortal.sessions.create({
    customer: stripeCustomerId,
    return_url: `${origin}/_authenticated/restaurant#profile`,
  });

  return { url: session.url };
}

export async function createDepositCheckoutSession(
  bookingId: string,
  amountCents: number,
  vendorName: string,
  customerEmail: string,
  origin: string
) {
  const stripe = getStripe();
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'eur',
          product_data: {
            name: `Booking Deposit for ${vendorName}`,
            description: '10% Platform Service Fee paid to Speisely',
          },
          unit_amount: amountCents,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${origin}/checkout/deposit/success?booking_id=${bookingId}&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/checkout/deposit/cancel?booking_id=${bookingId}`,
    customer_email: customerEmail,
    metadata: {
      booking_id: bookingId,
      type: 'booking_deposit',
    },
  });

  return { url: session.url };
}

export async function createStorefrontCheckoutSession(
  restaurantStripeUserId: string,
  amountCents: number,
  restaurantName: string,
  successUrl: string,
  cancelUrl: string,
  orderId: string
) {
  const stripe = getStripe();
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'eur',
          product_data: {
            name: `Order from ${restaurantName}`,
          },
          unit_amount: amountCents,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: {
      type: 'storefront_order',
      order_id: orderId,
    },
  }, {
    stripeAccount: restaurantStripeUserId, // Direct Charge model: money goes directly to restaurant, fees paid by restaurant
  });

  return session;
}

