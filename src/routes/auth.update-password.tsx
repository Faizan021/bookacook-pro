import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useI18n } from "@/i18n/I18nProvider";
import { LanguageToggle } from "@/components/LanguageToggle";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PasswordChecklist } from "@/components/auth/PasswordChecklist";
import { InputPassword } from "@/components/auth/InputPassword";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/auth/update-password")({
  ssr: false,
  component: UpdatePasswordPage,
});

const passwordSchema = z.string()
  .min(8, "Das Passwort muss mindestens 8 Zeichen lang sein.")
  .regex(/[A-Z]/, "Mindestens ein Großbuchstabe.")
  .regex(/[0-9]/, "Mindestens eine Zahl.")
  .regex(/[^A-Za-z0-9]/, "Mindestens ein Sonderzeichen.");

function UpdatePasswordPage() {
  const navigate = useNavigate();
  const { lang } = useI18n();
  const tt = (de: string, en: string) => (lang === "de" ? de : en);

  const [loading, setLoading] = useState(false);
  const [globalErr, setGlobalErr] = useState<string | null>(null);
  const [globalSuccess, setGlobalSuccess] = useState<string | null>(null);
  const [hasSession, setHasSession] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        setHasSession(true);
      } else {
        // If no session is found, they probably didn't come from an email link or it expired.
        // We'll let them stay on the page but warn them, or redirect.
      }
    });

    // Listen for auth state changes (e.g. they click the email link and the tab updates)
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "PASSWORD_RECOVERY" || session) {
        setHasSession(true);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const formSchema = z.object({
    password: passwordSchema,
    confirmPassword: z.string(),
  }).superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: tt("Passwörter stimmen nicht überein.", "Passwords do not match."),
        path: ["confirmPassword"],
      });
    }
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { password: "", confirmPassword: "" }
  });

  const { register, handleSubmit, formState: { errors }, watch } = form;
  const currentPassword = watch("password");

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setGlobalErr(null);
    setGlobalSuccess(null);
    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({ password: values.password });
      if (error) throw error;
      setGlobalSuccess(tt("Passwort erfolgreich aktualisiert!", "Password updated successfully!"));
      setTimeout(() => navigate({ to: "/dashboard" }), 2000);
    } catch (e: any) {
      setGlobalErr(e.message || tt("Ein Fehler ist aufgetreten. Bitte erneut versuchen.", "Something went wrong. Please try again."));
    } finally {
      setLoading(false);
    }
  }

  if (!hasSession) {
    return (
      <div className="min-h-screen bg-mint-dotted flex items-center justify-center px-4 py-16">
        <div className="surface-card w-full max-w-md p-8 text-center space-y-4">
          <h1 className="text-3xl font-display text-forest">{tt("Link ungültig oder abgelaufen", "Link invalid or expired")}</h1>
          <p className="text-forest/70">
            {tt("Bitte fordere einen neuen Link zum Zurücksetzen des Passworts an.", "Please request a new password reset link.")}
          </p>
          <Link to="/auth" search={{ signup: undefined, message: undefined, logout: undefined }} className="block w-full">
            <Button variant="outline" className="w-full mt-4">
              {tt("Zurück zur Anmeldung", "Back to Login")}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-mint-dotted flex items-center justify-center px-4 py-16">
      <div className="surface-card w-full max-w-md p-8">
        <div className="flex items-center justify-between">
          <Link to="/auth" search={{ signup: undefined, message: undefined, logout: undefined }} className="text-xs uppercase tracking-widest text-forest/70 hover:text-forest">
            ← Speisely
          </Link>
          <LanguageToggle />
        </div>
        
        <h1 className="mt-4 text-3xl font-display text-forest">{tt("Neues Passwort vergeben", "Set new password")}</h1>
        <p className="mt-1 text-sm text-forest/70 mb-6">
          {tt("Bitte gib unten dein neues Passwort ein.", "Please enter your new password below.")}
        </p>

        {globalErr && <div className="mb-4 p-3 rounded-md bg-red-50 border border-red-200 text-sm text-red-700">{globalErr}</div>}
        {globalSuccess && <div className="mb-4 p-3 rounded-md bg-green-50 border border-green-200 text-sm text-green-700">{globalSuccess}</div>}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-forest">{tt("Neues Passwort", "New Password")} <span className="text-red-500">*</span></Label>
            <InputPassword id="password" {...register("password")} hasError={!!errors.password} />
            {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
            <PasswordChecklist password={currentPassword} tt={tt} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="confirmPassword" className="text-forest">{tt("Passwort bestätigen", "Confirm Password")} <span className="text-red-500">*</span></Label>
            <InputPassword id="confirmPassword" {...register("confirmPassword")} hasError={!!errors.confirmPassword} />
            {errors.confirmPassword && <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>}
          </div>

          <Button type="submit" className="w-full bg-[#b28a3c] hover:opacity-90 text-[#16372f] font-semibold mt-6" disabled={loading}>
            {loading ? tt("Bitte warten…", "Please wait…") : tt("Passwort speichern", "Save password")}
          </Button>
        </form>
      </div>
    </div>
  );
}
