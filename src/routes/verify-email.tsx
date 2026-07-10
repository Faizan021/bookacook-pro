import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { CheckCircle2, XCircle, Loader2, Mail } from "lucide-react";
import { verifyOptInToken } from "@/lib/consent.functions";
import { z } from "zod";

export const Route = createFileRoute("/verify-email")({
  validateSearch: z.object({
    email: z.string().email().optional(),
    token: z.string().optional(),
  }),
  component: VerifyEmailPage,
});

function VerifyEmailPage() {
  const { email, token } = Route.useSearch();
  const navigate = useNavigate();
  const verifyFn = useServerFn(verifyOptInToken);

  const [status, setStatus] = useState<
    "loading" | "success" | "expired" | "invalid" | "already_verified" | "error"
  >("loading");
  const [message, setMessage] = useState("Verifying your email...");

  useEffect(() => {
    if (!email || !token) {
      setStatus("error");
      setMessage("Missing verification parameters.");
      return;
    }

    let isMounted = true;
    verifyFn({ data: { email, token } })
      .then((res) => {
        if (!isMounted) return;
        setStatus(res.status as any);
        setMessage(res.message);
      })
      .catch((err) => {
        if (!isMounted) return;
        console.error("Verification error:", err);
        setStatus("error");
        setMessage("An unexpected error occurred during verification.");
      });

    return () => {
      isMounted = false;
    };
  }, [email, token, verifyFn]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center bg-[#fdfaf5] p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl shadow-forest/5 p-8 text-center border border-[#eadfce]">
        {status === "loading" && (
          <div className="flex flex-col items-center animate-in fade-in zoom-in duration-300">
            <Loader2 className="h-16 w-16 text-forest animate-spin mb-4" />
            <h1 className="text-2xl font-display font-bold text-forest mb-2">Verifying Email</h1>
            <p className="text-forest/70">{message}</p>
          </div>
        )}

        {status === "success" && (
          <div className="flex flex-col items-center animate-in fade-in zoom-in duration-300">
            <div className="h-16 w-16 bg-[#22C55E]/10 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="h-8 w-8 text-[#22C55E]" />
            </div>
            <h1 className="text-2xl font-display font-bold text-forest mb-2">Email Verified!</h1>
            <p className="text-forest/70 mb-6">
              Thank you for subscribing to our updates. Your email has been successfully verified.
            </p>
            <button
              onClick={() => navigate({ to: "/" })}
              className="w-full bg-forest text-white rounded-full py-3 font-bold hover:opacity-90 transition"
            >
              Return Home
            </button>
          </div>
        )}

        {status === "already_verified" && (
          <div className="flex flex-col items-center animate-in fade-in zoom-in duration-300">
            <div className="h-16 w-16 bg-[#22C55E]/10 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="h-8 w-8 text-[#22C55E]" />
            </div>
            <h1 className="text-2xl font-display font-bold text-forest mb-2">Already Verified</h1>
            <p className="text-forest/70 mb-6">This email address has already been verified.</p>
            <button
              onClick={() => navigate({ to: "/" })}
              className="w-full bg-forest text-white rounded-full py-3 font-bold hover:opacity-90 transition"
            >
              Return Home
            </button>
          </div>
        )}

        {(status === "expired" || status === "invalid" || status === "error") && (
          <div className="flex flex-col items-center animate-in fade-in zoom-in duration-300">
            <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
            <h1 className="text-2xl font-display font-bold text-forest mb-2">
              Verification Failed
            </h1>
            <p className="text-forest/70 mb-6">{message}</p>
            <div className="flex flex-col gap-3 w-full">
              {status === "expired" && (
                <p className="text-sm text-forest/60 mb-2">
                  Tokens expire after 24 hours for your security. Please submit a new inquiry or
                  sign up again to receive a fresh verification link.
                </p>
              )}
              <button
                onClick={() => navigate({ to: "/" })}
                className="w-full border-2 border-forest text-forest rounded-full py-3 font-bold hover:bg-forest hover:text-white transition"
              >
                Return Home
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
