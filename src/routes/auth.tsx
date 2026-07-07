import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { checkEmailRole } from "@/lib/auth/get-user-profile.functions";
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { trackEvent } from "@/utils/posthog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Utensils, ChefHat, CalendarHeart, User, ArrowLeft } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";
import { LanguageToggle } from "@/components/LanguageToggle";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PasswordChecklist } from "@/components/auth/PasswordChecklist";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import { InputPassword } from "@/components/auth/InputPassword";

type Role = "customer" | "restaurant_owner" | "caterer" | "planner" | "partner";

export const Route = createFileRoute("/auth")({
  ssr: false,
  validateSearch: (s: Record<string, unknown>) => ({
    signup: typeof s.signup === "string" ? (s.signup as string) : undefined,
    message: typeof s.message === "string" ? (s.message as string) : undefined,
    logout: typeof s.logout === "string" ? (s.logout as string) : undefined,
  }),
  head: () => ({ meta: [{ title: "Login — Speisely" }, { name: "robots", content: "noindex" }] }),
  component: AuthPage,
});

const passwordSchema = z
  .string()
  .min(8, "Das Passwort muss mindestens 8 Zeichen lang sein.")
  .regex(/[A-Z]/, "Mindestens ein Großbuchstabe.")
  .regex(/[0-9]/, "Mindestens eine Zahl.")
  .regex(/[^A-Za-z0-9]/, "Mindestens ein Sonderzeichen.");

function AuthPage() {
  const navigate = useNavigate();
  const checkEmailRoleFn = useServerFn(checkEmailRole);
  const { signup, message, logout } = Route.useSearch();
  const { lang } = useI18n();
  const tt = (de: string, en: string) => (lang === "de" ? de : en);

  const initialMode = signup ? "signup" : "signin";
  const initialRole: Role =
    signup === "caterer" ||
    signup === "partner" ||
    signup === "restaurant_owner" ||
    signup === "planner"
      ? "partner"
      : "customer";

  const [mode, setMode] = useState<"signin" | "signup" | "check-email" | "forgot-password">(
    initialMode,
  );
  const [role, setRole] = useState<Role>(initialRole);
  const [loading, setLoading] = useState(false);
  const [globalErr, setGlobalErr] = useState<string | null>(null);
  const [globalSuccess, setGlobalSuccess] = useState<string | null>(null);

  const isPartner = role !== "customer";

  const ROLES: { value: Role; label: string; desc: string; Icon: React.ElementType }[] = [
    {
      value: "customer",
      label: tt("Kunde", "Customer"),
      desc: tt("Essen bestellen & Caterer anfragen", "Order food & book caterers"),
      Icon: User,
    },
    {
      value: "partner",
      label: tt("Business Partner", "Business Partner"),
      desc: tt("Restaurants, Caterer & Event-Planer", "Restaurants, Caterers & Event Planners"),
      Icon: Utensils,
    },
  ];

  useEffect(() => {
    if (logout === "true") {
      supabase.auth.signOut().then(() => {
        navigate({
          to: "/auth",
          search: { message, signup: undefined, logout: undefined },
          replace: true,
        });
      });
      return;
    }
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) navigate({ to: "/dashboard" });
    });
  }, [navigate, logout, message]);

  // Unified Form Schema
  const formSchema = z
    .object({
      email: z.string().email(tt("Gültige E-Mail erforderlich.", "Valid email required.")),
      password:
        mode === "signup"
          ? passwordSchema
          : z.string().min(1, tt("Passwort erforderlich.", "Password required.")),
      confirmPassword: z.string().optional(),
      fullName:
        mode === "signup"
          ? z.string().min(2, tt("Name erforderlich.", "Name required."))
          : z.string().optional(),
      termsAccepted: z.boolean().optional(),
      marketingOptIn: z.boolean().optional(),
      // Biz fields
      business_name: z.string().optional(),
      contact_person: z.string().optional(),
      phone: z.string().optional(),
      license_number: z.string().optional(),
      business_address: z.string().optional(),
      service_city: z.string().optional(),
      service_area: z.string().optional(),
    })
    .superRefine((data, ctx) => {
      if (mode === "signup") {
        if (data.password !== data.confirmPassword) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: tt("Passwörter stimmen nicht überein.", "Passwords do not match."),
            path: ["confirmPassword"],
          });
        }
        if (!data.termsAccepted) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: tt(
              "Bitte akzeptieren Sie die Nutzungsbedingungen.",
              "Please accept the Terms of Service.",
            ),
            path: ["termsAccepted"],
          });
        }
        if (isPartner) {
          if (!data.business_name)
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "Erforderlich",
              path: ["business_name"],
            });
          if (!data.contact_person)
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "Erforderlich",
              path: ["contact_person"],
            });
          if (!data.business_address)
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "Erforderlich",
              path: ["business_address"],
            });
        }
      }
    });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      fullName: "",
      termsAccepted: false,
      marketingOptIn: false,
      business_name: "",
      contact_person: "",
      phone: "",
      license_number: "",
      business_address: "",
      service_city: "",
      service_area: "",
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = form;
  const currentPassword = watch("password");
  const currentEmail = watch("email");

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setGlobalErr(null);
    setGlobalSuccess(null);
    setLoading(true);

    try {
      if (mode === "forgot-password") {
        const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
          redirectTo: window.location.origin + "/auth/update-password",
        });
        if (error) throw error;
        setGlobalSuccess(
          tt(
            "Wenn diese E-Mail existiert, haben wir einen Link zum Zurücksetzen gesendet.",
            "If this email exists, we have sent a reset link.",
          ),
        );
        return;
      }

      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email: values.email,
          password: values.password,
          options: {
            emailRedirectTo: window.location.origin + "/dashboard",
            data: {
              full_name: values.fullName,
              role,
              biz: isPartner
                ? {
                    business_name: values.business_name,
                    contact_person: values.contact_person,
                    phone: values.phone,
                    business_address: values.business_address,
                    license_number: values.license_number,
                    service_city: values.service_city,
                    service_area: values.service_area,
                  }
                : undefined,
            },
          },
        });
        if (error) throw error;

        // Prevent silent failure on signup with an existing email when email confirmations are enabled
        if (data.user && data.user.identities && data.user.identities.length === 0) {
          throw new Error("user_already_exists");
        }

        trackEvent("signup_completed", { role });
        const { upsertConsentRecord } = await import("@/lib/consent.functions");
        await upsertConsentRecord({
          data: {
            email: values.email,
            audience_type: role === "restaurant_owner" || role === "partner" ? "restaurant" : role,
            user_id: data.user?.id || null,
            marketing_opt_in: !!values.marketingOptIn,
            terms_acknowledged: !!values.termsAccepted,
            source: "auth_signup",
            source_detail: window.location.pathname,
            metadata: { role, isPartner },
            pref_language: lang,
            pref_interests: ["general"],
          },
        });

        if (!data.session) {
          setMode("check-email");
          return;
        }
      } else if (mode === "signin") {
        let checkResult = { exists: false, primaryRole: null as string | null };
        try {
          checkResult = await checkEmailRoleFn({ data: { email: values.email } });
        } catch (e) {
          checkResult = { exists: true, primaryRole: null };
        }

        if (!checkResult.exists) throw new Error("profile_does_not_exist");

        const { error } = await supabase.auth.signInWithPassword({
          email: values.email,
          password: values.password,
        });
        if (error) {
          if (
            error.message?.includes("Invalid login credentials") ||
            error.message?.includes("invalid_credentials")
          ) {
            throw new Error(`incorrect_password_with_role:${checkResult.primaryRole}`);
          }
          throw error;
        }
      }
      navigate({ to: "/dashboard" });
    } catch (e: unknown) {
      setGlobalErr(sanitizeAuthError(e, lang));
    } finally {
      setLoading(false);
    }
  }

  const handleResendEmail = async () => {
    setLoading(true);
    setGlobalErr(null);
    setGlobalSuccess(null);
    try {
      const { error } = await supabase.auth.resend({ type: "signup", email: currentEmail });
      if (error) throw error;
      setGlobalSuccess(
        tt("Bestätigungs-E-Mail wurde erneut gesendet.", "Verification email resent."),
      );
    } catch (e: unknown) {
      setGlobalErr(sanitizeAuthError(e, lang));
    } finally {
      setLoading(false);
    }
  };

  function sanitizeAuthError(e: unknown, lang: string): string {
    const de = (msg: string) => (lang === "de" ? msg : undefined);
    const err = e as Record<string, string>;
    const code: string = err?.code ?? err?.message ?? String(e);
    if (code === "profile_does_not_exist")
      return (
        de(
          "Ein Profil mit dieser E-Mail-Adresse existiert nicht. Bitte registrieren Sie sich zuerst.",
        ) ?? "No profile exists with this email. Please sign up first."
      );
    if (code.startsWith("incorrect_password_with_role:"))
      return de("Falsches Passwort für dieses Konto.") ?? "Incorrect password for this account.";
    if (code.includes("invalid_credentials") || code.includes("Invalid login credentials"))
      return de("E-Mail oder Passwort ist falsch.") ?? "Incorrect email or password.";
    if (code.includes("email_not_confirmed"))
      return (
        de("Bitte bestätige zuerst deine E-Mail-Adresse.") ??
        "Please confirm your email address first."
      );
    if (code.includes("user_already_exists") || code.includes("already registered"))
      return (
        de("Diese E-Mail-Adresse ist bereits registriert.") ??
        "An account with this email already exists."
      );
    if (code.includes("over_email_send_rate_limit") || code.includes("rate limit"))
      return (
        de("Zu viele Anfragen. Bitte warte einen Moment.") ??
        "Too many requests. Please wait a moment."
      );
    return (
      de("Ein Fehler ist aufgetreten. Bitte erneut versuchen.") ??
      "Something went wrong. Please try again."
    );
  }

  if (mode === "check-email") {
    return (
      <div className="min-h-screen bg-mint-dotted flex items-center justify-center px-4 py-16">
        <div className="surface-card w-full max-w-md p-8 text-center space-y-4">
          <div className="mx-auto bg-forest/10 text-forest w-16 h-16 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-display text-forest">
            {tt("Bitte überprüfe deine E-Mails", "Please check your email")}
          </h1>
          <p className="text-forest/70">
            {tt("Wir haben dir einen Bestätigungslink an", "We sent a confirmation link to")}{" "}
            <strong>{currentEmail}</strong> {tt("gesendet.", "sent.")}
          </p>
          {globalSuccess && <p className="text-sm text-green-600 font-medium">{globalSuccess}</p>}
          {globalErr && <p className="text-sm text-red-600 font-medium">{globalErr}</p>}
          <Button
            variant="outline"
            onClick={handleResendEmail}
            disabled={loading}
            className="w-full mt-4"
          >
            {loading
              ? tt("Wird gesendet...", "Sending...")
              : tt("E-Mail erneut senden", "Resend Email")}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-mint-dotted flex items-center justify-center px-4 py-16">
      <div
        className={`surface-card w-full ${mode === "signup" && isPartner ? "max-w-2xl" : "max-w-md"} p-8`}
      >
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="text-xs uppercase tracking-widest text-forest/70 hover:text-forest"
          >
            ← Speisely
          </Link>
          <LanguageToggle />
        </div>

        {mode === "forgot-password" && (
          <button
            onClick={() => {
              form.reset();
              setMode("signin");
              setGlobalErr(null);
              setGlobalSuccess(null);
            }}
            className="mt-4 flex items-center gap-1 text-sm text-forest/70 hover:text-forest"
          >
            <ArrowLeft className="w-4 h-4" /> {tt("Zurück", "Back")}
          </button>
        )}

        <h1 className="mt-4 text-3xl font-display text-forest">
          {mode === "signup"
            ? tt("Konto erstellen", "Create an account")
            : mode === "forgot-password"
              ? tt("Passwort zurücksetzen", "Reset Password")
              : tt("Willkommen zurück", "Welcome back")}
        </h1>
        <p className="mt-1 text-sm text-forest/70 mb-6">
          {mode === "signup"
            ? tt(
                "Bestelle Essen oder verwalte dein Geschäft.",
                "Start ordering or manage your storefront.",
              )
            : mode === "forgot-password"
              ? tt(
                  "Gib deine E-Mail ein, um dein Passwort zurückzusetzen.",
                  "Enter your email to reset your password.",
                )
              : tt("Melde dich in deinem Dashboard an.", "Sign in to your dashboard.")}
        </p>

        {message && (
          <div className="mb-4 p-3 rounded-md bg-amber-50 border border-amber-200 text-sm text-amber-700">
            {message}
          </div>
        )}
        {globalErr && (
          <div className="mb-4 p-3 rounded-md bg-red-50 border border-red-200 text-sm text-red-700">
            {globalErr}
          </div>
        )}
        {globalSuccess && (
          <div className="mb-4 p-3 rounded-md bg-green-50 border border-green-200 text-sm text-green-700">
            {globalSuccess}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {mode === "signup" && (
            <div className="space-y-1.5">
              <Label className="text-forest">
                {tt("Ich registriere mich als", "I'm signing up as")}
              </Label>
              <div className="grid grid-cols-2 gap-2">
                {ROLES.map(({ value, label, desc, Icon }) => {
                  const active = role === value;
                  return (
                    <button
                      type="button"
                      key={value}
                      onClick={() => setRole(value)}
                      className={`flex flex-col items-start gap-1 rounded-xl border p-3 text-left transition ${
                        active
                          ? "border-[#b28a3c] bg-[#b28a3c]/10 ring-2 ring-[#b28a3c]/30"
                          : "border-[#eadfce] hover:border-forest/40"
                      }`}
                    >
                      <Icon className={`h-4 w-4 ${active ? "text-[#b28a3c]" : "text-forest"}`} />
                      <span
                        className={`text-sm font-medium ${active ? "text-[#16372f]" : "text-forest"}`}
                      >
                        {label}
                      </span>
                      <span className="text-[11px] text-forest/60 leading-tight">{desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {mode === "signup" && (
            <div className="space-y-1.5">
              <Label htmlFor="fullName" className="text-forest">
                {tt("Vollständiger Name", "Full name")} <span className="text-red-500">*</span>
              </Label>
              <Input
                id="fullName"
                {...register("fullName")}
                className={`${errors.fullName ? "border-red-500" : "border-[#eadfce]"}`}
              />
              {errors.fullName && <p className="text-xs text-red-500">{errors.fullName.message}</p>}
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-forest">
              {tt("E-Mail", "Email")} <span className="text-red-500">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              {...register("email")}
              className={`${errors.email ? "border-red-500" : "border-[#eadfce]"}`}
            />
            {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
          </div>

          {mode !== "forgot-password" && (
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-forest">
                {tt("Passwort", "Password")} <span className="text-red-500">*</span>
              </Label>
              <InputPassword id="password" {...register("password")} hasError={!!errors.password} />
              {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
              {mode === "signup" && <PasswordChecklist password={currentPassword} tt={tt} />}
            </div>
          )}

          {mode === "signup" && (
            <div className="space-y-1.5">
              <Label htmlFor="confirmPassword" className="text-forest">
                {tt("Passwort bestätigen", "Confirm Password")}{" "}
                <span className="text-red-500">*</span>
              </Label>
              <InputPassword
                id="confirmPassword"
                {...register("confirmPassword")}
                hasError={!!errors.confirmPassword}
              />
              {errors.confirmPassword && (
                <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>
              )}
            </div>
          )}

          {mode === "signup" && isPartner && (
            <div className="rounded-xl border border-forest/20 bg-forest/5 p-4 space-y-4">
              <p className="text-sm font-medium text-forest">
                {tt("Geschäftsdetails", "Business details")}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">{tt("Unternehmensname", "Business name")}*</Label>
                  <Input
                    {...register("business_name")}
                    className={errors.business_name ? "border-red-500" : "border-[#eadfce]"}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">{tt("Ansprechpartner", "Contact person")}*</Label>
                  <Input
                    {...register("contact_person")}
                    className={errors.contact_person ? "border-red-500" : "border-[#eadfce]"}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">{tt("Telefonnummer", "Phone number")}</Label>
                  <Input type="tel" {...register("phone")} className="border-[#eadfce]" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">
                    {tt("Gewerbeanmeldung / HRB", "License / Registration #")}
                  </Label>
                  <Input {...register("license_number")} className="border-[#eadfce]" />
                </div>
                <div className="sm:col-span-2 space-y-1">
                  <Label className="text-xs">{tt("Geschäftsadresse", "Business address")}*</Label>
                  <Input
                    {...register("business_address")}
                    className={errors.business_address ? "border-red-500" : "border-[#eadfce]"}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">{tt("Stadt", "Service city")}</Label>
                  <Input {...register("service_city")} className="border-[#eadfce]" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">{tt("Stadtteil", "Service area")}</Label>
                  <Input {...register("service_area")} className="border-[#eadfce]" />
                </div>
              </div>
            </div>
          )}

          {mode === "signup" && (
            <div className="space-y-3 py-2 border-t border-[#eadfce]/60 mt-4 pt-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  {...register("termsAccepted")}
                  className="mt-1 h-4 w-4 rounded border-[#eadfce] text-[#b28a3c] focus:ring-[#b28a3c]"
                />
                <span className="text-sm text-forest/80">
                  {lang === "de" ? (
                    <>
                      Ich akzeptiere die{" "}
                      <Link
                        to="/impressum"
                        target="_blank"
                        className="underline hover:text-forest font-medium"
                      >
                        Nutzungsbedingungen
                      </Link>
                      .
                    </>
                  ) : (
                    <>
                      I agree to the{" "}
                      <Link
                        to="/impressum"
                        target="_blank"
                        className="underline hover:text-forest font-medium"
                      >
                        Terms of Service
                      </Link>
                      .
                    </>
                  )}{" "}
                  <span className="text-red-500">*</span>
                </span>
              </label>
              {errors.termsAccepted && (
                <p className="text-xs text-red-500 ml-7">{errors.termsAccepted.message}</p>
              )}
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  {...register("marketingOptIn")}
                  className="mt-1 h-4 w-4 rounded border-[#eadfce] text-[#b28a3c] focus:ring-[#b28a3c]"
                />
                <span className="text-sm text-forest/80">
                  {tt("Ich möchte Produktupdates erhalten.", "I want to receive product updates.")}
                </span>
              </label>
            </div>
          )}

          {mode === "signin" && (
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => {
                  form.reset();
                  setMode("forgot-password");
                  setGlobalErr(null);
                  setGlobalSuccess(null);
                }}
                className="text-sm text-[#b28a3c] hover:underline"
              >
                {tt("Passwort vergessen?", "Forgot Password?")}
              </button>
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-[#b28a3c] hover:opacity-90 text-[#16372f] font-semibold"
            disabled={loading}
          >
            {loading
              ? tt("Bitte warten…", "Please wait…")
              : mode === "signup"
                ? tt("Konto erstellen", "Create account")
                : mode === "forgot-password"
                  ? tt("Link senden", "Send Reset Link")
                  : tt("Anmelden", "Sign in")}
          </Button>
        </form>

        {mode !== "forgot-password" && (
          <>
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-[#eadfce]" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-[#fcf8f2] px-2 text-forest/50">Oder</span>
              </div>
            </div>
            <GoogleSignInButton tt={tt} role={role} onError={setGlobalErr} />

            <button
              type="button"
              className="mt-6 w-full text-sm text-forest/70 hover:text-forest"
              onClick={() => {
                form.reset();
                setGlobalErr(null);
                setGlobalSuccess(null);
                setMode(mode === "signup" ? "signin" : "signup");
              }}
            >
              {mode === "signup"
                ? tt("Du hast bereits ein Konto? Anmelden", "Already have an account? Sign in")
                : tt("Neu bei Speisely? Konto erstellen", "New to Speisely? Create an account")}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
