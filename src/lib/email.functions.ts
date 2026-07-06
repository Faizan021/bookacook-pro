import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { Resend } from "resend";

// RESEND_API_KEY is server-only. If absent, log a structured warning — do NOT
// fall back to logging the verification URL, which contains a one-time token.
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

const APP_URL =
  process.env.VITE_APP_URL ||
  process.env.NEXT_PUBLIC_SITE_URL ||
  "http://localhost:5173";

export const sendDoubleOptInEmail = createServerFn({ method: "POST" })
  .validator((input: { email: string; token: string }) =>
    z.object({ email: z.string().email(), token: z.string().min(1) }).parse(input)
  )
  .handler(async ({ data }) => {
    // Build verification URL — never log this value, it contains a one-time token
    const verificationUrl = `${APP_URL}/verify-email?email=${encodeURIComponent(
      data.email
    )}&token=${encodeURIComponent(data.token)}`;

    const subject = "Please verify your email for Speisely updates";
    const text = `
Hello,

You recently requested to receive updates from Speisely.
Please verify your email address by clicking the link below:

${verificationUrl}

If you did not request this, you can safely ignore this email.

Best,
The Speisely Team
    `.trim();

    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #16372f;">
        <h2 style="color: #16372f;">Verify your email address</h2>
        <p>You recently requested to receive updates from Speisely.</p>
        <p>Please click the button below to verify your email address:</p>
        <div style="margin: 30px 0;">
          <a href="${verificationUrl}" style="background-color: #22C55E; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Verify Email</a>
        </div>
        <p style="font-size: 12px; color: #666;">Or copy and paste this link into your browser:<br/>
        <a href="${verificationUrl}" style="color: #22C55E;">${verificationUrl}</a></p>
        <hr style="border: none; border-top: 1px solid #eadfce; margin: 30px 0;" />
        <p style="font-size: 12px; color: #999;">If you did not request this, you can safely ignore this email.</p>
      </div>
    `;

    if (resend) {
      try {
        await resend.emails.send({
          from: "Speisely <noreply@speisely.de>",
          to: data.email,
          subject,
          text,
          html,
        });
        // SEC-4: Log delivery confirmation only — never log the token or URL
        console.log(`[Email] Double opt-in email dispatched to ${data.email}`);
      } catch (err: any) {
        // Log the error category, not the full object which may contain request headers
        console.error(`[Email Error] Failed to dispatch double opt-in email: ${err?.code ?? err?.message ?? "unknown"}`);
      }
    } else {
      // SEC-4: In dev/test with no Resend key, log intent only — NOT the URL or token.
      // Use `stripe listen` / Supabase email dev mode for local token testing.
      console.log(
        `[Email Dev] RESEND_API_KEY not set. Double opt-in email NOT sent to ${data.email}. ` +
        `Check the database user_consents.double_opt_in_token to retrieve the token for local testing.`
      );
    }

    return { success: true };
  });

export const sendContactEmail = createServerFn({ method: "POST" })
  .validator((input: { name: string; email: string; message: string; reason: string; company?: string; phone?: string }) =>
    z.object({
      name: z.string().min(1, "Name is required"),
      email: z.string().email("Valid email is required"),
      reason: z.string().min(1, "Contact reason is required"),
      company: z.string().optional(),
      phone: z.string().optional(),
      message: z.string().min(10, "Message must be at least 10 characters")
    }).parse(input)
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
        await resend.emails.send({
          from: "Speisely Contact <noreply@speisely.de>",
          to: "faizan.ahmed01213@gmail.com",
          replyTo: data.email,
          subject,
          text,
          html,
        });
        console.log(`[Email] Contact form submitted by ${data.email}`);
      } catch (err: any) {
        console.error(`[Email Error] Failed to send contact email: ${err?.code ?? err?.message ?? "unknown"}`);
        throw new Error("Failed to send message. Please try again later.");
      }
    } else {
      console.log(`[Email Dev] Contact form email NOT sent (no Resend key) from ${data.email}. Message: ${data.message}`);
    }

    return { success: true };
  });
