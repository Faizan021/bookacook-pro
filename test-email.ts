import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const RESEND_API_KEY = process.env.RESEND_API_KEY;

if (!RESEND_API_KEY) {
  console.error("RESEND_API_KEY not found in .env.local");
  process.exit(1);
}

const resend = new Resend(RESEND_API_KEY);

async function runTest() {
  console.log("Testing with replyTo...");
  try {
    const { data, error } = await resend.emails.send({
      from: "Speisely Contact <noreply@send.speisely.de>",
      to: "faizan.ahmed01213@gmail.com", // This is the contact form destination
      replyTo: "test_replyTo@example.com", // Testing camelCase
      subject: "Test replyTo",
      text: "This is a test to see if replyTo works.",
    } as any);

    if (error) {
      console.error("replyTo error:", error);
    } else {
      console.log("replyTo success:", data);
    }
  } catch (err: any) {
    console.error("replyTo caught error:", err.message);
  }

  console.log("\nTesting with reply_to...");
  try {
    const { data, error } = await resend.emails.send({
      from: "Speisely Contact <noreply@send.speisely.de>",
      to: "faizan.ahmed01213@gmail.com",
      reply_to: "test_reply_to@example.com", // Testing snake_case
      subject: "Test reply_to",
      text: "This is a test to see if reply_to works.",
    } as any);

    if (error) {
      console.error("reply_to error:", error);
    } else {
      console.log("reply_to success:", data);
    }
  } catch (err: any) {
    console.error("reply_to caught error:", err.message);
  }
}

runTest();
