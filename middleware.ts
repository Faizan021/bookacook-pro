import { next } from "@vercel/edge";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Only initialize if Redis env vars are present
const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      })
    : null;

// Normal routes (100 req per 10s)
const globalRatelimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(100, "10 s"),
    })
  : null;

// Auth endpoints (10 req per minute)
const authRatelimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(10, "1 m"),
    })
  : null;

export const config = {
  matcher: [
    "/api/:path*",
    "/_server/:path*", // Tanstack Start RPC endpoints
  ],
};

export default async function middleware(request: Request) {
  // If Redis is not configured, bypass
  if (!redis || !globalRatelimit || !authRatelimit) {
    return next();
  }

  const ip = request.headers.get("x-forwarded-for") || "127.0.0.1";
  const url = new URL(request.url);
  const pathname = url.pathname;

  // Exclude Stripe webhooks (they rely on signature validation and shouldn't be blocked by IP)
  if (pathname.startsWith("/api/webhooks/stripe")) {
    return next();
  }

  // Determine which limiter to use
  let limiter = globalRatelimit;

  // Use stricter limits for auth-related functions or endpoints
  if (
    pathname.includes("/auth") ||
    pathname.includes("/login") ||
    pathname.includes("/signup") ||
    pathname.includes("register")
  ) {
    limiter = authRatelimit;
  }

  const { success, limit, reset, remaining } = await limiter.limit(ip);

  if (!success) {
    return new Response("Too Many Requests", {
      status: 429,
      headers: {
        "X-RateLimit-Limit": limit.toString(),
        "X-RateLimit-Remaining": remaining.toString(),
        "X-RateLimit-Reset": reset.toString(),
        "Content-Type": "text/plain",
      },
    });
  }

  const response = next();
  response.headers.set("X-RateLimit-Limit", limit.toString());
  response.headers.set("X-RateLimit-Remaining", remaining.toString());
  response.headers.set("X-RateLimit-Reset", reset.toString());

  return response;
}
