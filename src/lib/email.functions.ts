import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { Resend } from "resend";

// RESEND_API_KEY is server-only. If absent, log a structured warning — do NOT
// fall back to logging the verification URL, which contains a one-time token.
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

const APP_URL =
  process.env.VITE_APP_URL || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:5173";

export const sendDoubleOptInEmail = createServerFn({ method: "POST" })
  .validator((input: { email: string; token: string }) =>
    z.object({ email: z.string().email(), token: z.string().min(1) }).parse(input),
  )
  .handler(async ({ data }) => {
    // Build verification URL — never log this value, it contains a one-time token
    const verificationUrl = `${APP_URL}/verify-email?email=${encodeURIComponent(
      data.email,
    )}&token=${encodeURIComponent(data.token)}`;

    const subject = "Bitte bestätige deine E-Mail für Speisely-Updates 🍽️";
    const text = `
Hallo,

Wir freuen uns sehr, dass du über Speisely auf dem Laufenden bleiben möchtest!
Bitte bestätige kurz deine E-Mail-Adresse, indem du auf den untenstehenden Link klickst:

${verificationUrl}

Falls du diese E-Mail versehentlich erhalten hast, kannst du sie einfach ignorieren.

Herzliche Grüße,
Dein Speisely Team
    `.trim();

    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #16372f;">
        <h2 style="color: #16372f;">Willkommen in der Speisely-Familie! 🎉</h2>
        <p>Wir freuen uns riesig, dass du über unsere neuesten Features, Restaurants und Angebote auf dem Laufenden bleiben möchtest.</p>
        <p>Um deine Anmeldung abzuschließen, klicke einfach auf den grünen Button:</p>
        <div style="margin: 30px 0;">
          <a href="${verificationUrl}" style="background-color: #1A4D2E; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">E-Mail jetzt bestätigen</a>
        </div>
        <hr style="border: none; border-top: 1px solid #eadfce; margin: 30px 0;" />
        <p style="font-size: 12px; color: #999;">Falls du dich nicht für Updates angemeldet hast, kannst du diese E-Mail sicher ignorieren.</p>
      </div>
    `;

    if (resend) {
      try {
        await resend.emails.send({
          from: "Speisely <noreply@send.speisely.de>",
          to: data.email,
          subject,
          text,
          html,
        });
        // SEC-4: Log delivery confirmation only — never log the token or URL
        console.log(`[Email] Double opt-in email dispatched to ${data.email}`);
      } catch (err: any) {
        // Log the error category, not the full object which may contain request headers
        console.error(
          `[Email Error] Failed to dispatch double opt-in email: ${err?.code ?? err?.message ?? "unknown"}`,
        );
      }
    } else {
      // SEC-4: In dev/test with no Resend key, log intent only — NOT the URL or token.
      // Use `stripe listen` / Supabase email dev mode for local token testing.
      console.log(
        `[Email Dev] RESEND_API_KEY not set. Double opt-in email NOT sent to ${data.email}. ` +
          `Check the database user_consents.double_opt_in_token to retrieve the token for local testing.`,
      );
    }

    return { success: true };
  });

export const sendContactEmail = createServerFn({ method: "POST" })
  .validator(
    (input: {
      name: string;
      email: string;
      message: string;
      reason: string;
      company?: string;
      phone?: string;
    }) =>
      z
        .object({
          name: z.string().min(1, "Name is required"),
          email: z.string().email("Valid email is required"),
          reason: z.string().min(1, "Contact reason is required"),
          company: z.string().optional(),
          phone: z.string().optional(),
          message: z.string().min(10, "Message must be at least 10 characters"),
        })
        .parse(input),
  )
  .handler(async ({ data }) => {
    const subject = `[${data.reason}] Contact Form Submission from ${data.name}`;
    const text = `
You have received a new message from the Speisely Contact Form.

Reason: ${data.reason}
Name: ${data.name}
Email: ${data.email}
${data.company ? `Company: ${data.company}\n` : ""}${data.phone ? `Phone: ${data.phone}\n` : ""}
Message:
${data.message}
    `.trim();

    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #16372f;">
        <h2 style="color: #16372f;">New Contact Form Submission</h2>
        <p><strong>Reason:</strong> <span style="background-color: #eadfce; padding: 4px 8px; border-radius: 4px;">${data.reason}</span></p>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        ${data.company ? `<p><strong>Company:</strong> ${data.company}</p>` : ""}
        ${data.phone ? `<p><strong>Phone:</strong> ${data.phone}</p>` : ""}
        <hr style="border: none; border-top: 1px solid #eadfce; margin: 20px 0;" />
        <p><strong>Message:</strong></p>
        <p style="white-space: pre-wrap;">${data.message}</p>
        <hr style="border: none; border-top: 1px solid #eadfce; margin: 30px 0;" />
        <p style="font-size: 12px; color: #999;">Sent from the Speisely.de Contact Form.</p>
      </div>
    `;

    if (resend) {
      try {
        const response = await resend.emails.send({
          from: "Speisely Contact <noreply@send.speisely.de>",
          to: "faizan.ahmed01213@gmail.com",
          replyTo: data.email,
          subject,
          text,
          html,
        });
        if (response.error) {
          console.error(`[Email Error] Resend API error:`, response.error);
          throw new Error(response.error.message);
        }
        console.log(`[Email] Contact form submitted by ${data.email}`);
      } catch (err: any) {
        console.error(
          `[Email Error] Failed to send contact email: ${err?.code ?? err?.message ?? "unknown"}`,
        );
        throw new Error("Failed to send message. Please try again later.");
      }
    } else {
      console.log(
        `[Email Dev] Contact form email NOT sent (no Resend key) from ${data.email}. Message: ${data.message}`,
      );
    }

    return { success: true };
  });

export const sendPartnerNotificationEmail = createServerFn({ method: "POST" })
  .validator((input: { to: string; subject: string; text: string; html: string }) =>
    z
      .object({
        to: z.string().email(),
        subject: z.string().min(1),
        text: z.string().min(1),
        html: z.string().min(1),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    if (resend) {
      try {
        const response = await resend.emails.send({
          from: "Speisely Orders <noreply@send.speisely.de>",
          to: data.to,
          subject: data.subject,
          text: data.text,
          html: data.html,
        });
        if (response.error) {
          console.error(`[Email Error] Resend API error:`, response.error);
          throw new Error(response.error.message);
        }
        console.log(`[Email] Partner notification sent to ${data.to}`);
      } catch (err: any) {
        console.error(
          `[Email Error] Failed to send partner notification: ${err?.code ?? err?.message ?? "unknown"}`,
        );
      }
    } else {
      console.log(
        `[Email Dev] Partner notification NOT sent (no Resend key) to ${data.to}. Subject: ${data.subject}`,
      );
    }
    return { success: true };
  });
