import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { checkEmailRole } from "@/lib/auth/get-user-profile.functions";
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { trackEvent } from "@/utils/posthog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Utensils, ChefHat, CalendarHeart, User } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";
import { LanguageToggle } from "@/components/LanguageToggle";

type Role = "customer" | "restaurant_owner" | "caterer" | "planner";

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

function AuthPage() {
  const navigate = useNavigate();
  const checkEmailRoleFn = useServerFn(checkEmailRole);
  const { signup, message, logout } = Route.useSearch();
  const { lang } = useI18n();
  const tt = (de: string, en: string) => (lang === "de" ? de : en);

  const initialMode = signup ? "signup" : "signin";
  const initialRole: Role = signup === "caterer" ? "caterer" : signup === "partner" ? "restaurant_owner" : "customer";
  const [mode, setMode] = useState<"signin" | "signup" | "check-email">(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState<Role>(initialRole);
  const [biz, setBiz] = useState({
    business_name: "",
    contact_person: "",
    phone: "",
    business_address: "",
    license_number: "",
    service_city: "",
    service_area: "",
  });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const [marketingOptIn, setMarketingOptIn] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const signupStartedRef = useRef(false);
  const triggerSignupStarted = (selectedRole: Role) => {
    if (mode === "signup" && !signupStartedRef.current) {
      signupStartedRef.current = true;
      trackEvent("signup_started", { role: selectedRole });
    }
  };

  const isPartner = role !== "customer";

  const ROLES: { value: Role; label: string; desc: string; Icon: any }[] = [
    { value: "customer", label: tt("Kunde", "Customer"), desc: tt("Essen bestellen & Caterer anfragen", "Order food & book caterers"), Icon: User },
    { value: "restaurant_owner", label: "Restaurant", desc: tt("Kostenlose Kontoerstellung. 0% Provision. 100% Deins — €34.99/Monat.", "Free account creation. 0% commission. 100% yours — €34.99/month."), Icon: Utensils },
    { value: "caterer", label: "Caterer", desc: tt("Catering-Anfragen erhalten", "Receive catering briefs"), Icon: ChefHat },
    { value: "planner", label: tt("Event Planner", "Event Planner"), desc: tt("Event-Services anbieten", "List your event services"), Icon: CalendarHeart },
  ];

  useEffect(() => {
    if (logout === "true") {
      supabase.auth.signOut().then(() => {
        // Clear logout from URL, keeping the warning message
        navigate({ to: "/auth", search: { message }, replace: true });
      });
      return;
    }

    supabase.auth.getUser().then(({ data }) => {
      if (data.user) navigate({ to: "/dashboard" });
    });
  }, [navigate, logout, message]);

  function setBizField<K extends keyof typeof biz>(k: K, v: string) {
    setBiz((b) => ({ ...b, [k]: v }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    if (mode === "signup" && !termsAccepted) {
      setErr(tt("Bitte akzeptieren Sie die Nutzungsbedingungen.", "Please accept the Terms of Service."));
      return;
    }
    setLoading(true);
    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin + "/dashboard",
            data: { full_name: fullName, role, biz: isPartner ? biz : undefined },
          },
        });
        if (error) throw error;
        
        trackEvent("signup_completed", { role });

        // Upsert consent record
        const { upsertConsentRecord } = await import("@/lib/consent.functions");
        await upsertConsentRecord({
          data: {
            email,
            audience_type: role === "restaurant_owner" ? "restaurant" : role,
            user_id: data.user?.id || null,
            marketing_opt_in: marketingOptIn,
            terms_acknowledged: termsAccepted,
            source: "auth_signup",
            source_detail: window.location.pathname,
            metadata: { role, isPartner },
            pref_language: lang,
            pref_interests: ['general'],
          }
        });

        if (!data.session) {
          setMode("check-email");
          return;
        }
      } else {
        // Sign In Flow: Pre-check email exists and get its roles
        let checkResult = { exists: false, primaryRole: null as string | null };
        try {
          checkResult = await checkEmailRoleFn({ data: { email } });
        } catch (checkErr) {
          console.error("Error pre-checking email role:", checkErr);
          // Fall back to direct sign-in if server check fails
          checkResult = { exists: true, primaryRole: null };
        }

        if (!checkResult.exists) {
          throw new Error("profile_does_not_exist");
        }

        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          // If login fails with invalid credentials, but we know the email exists, it means the password is wrong!
          if (error.message?.includes("Invalid login credentials") || error.message?.includes("invalid_credentials")) {
            throw new Error(`incorrect_password_with_role:${checkResult.primaryRole}`);
          }
          throw error;
        }
      }
      navigate({ to: "/dashboard" });
    } catch (e: any) {
      // SEC-3: Map known Supabase/auth error codes to safe user-facing messages.
      // Never expose e.message directly — it can contain DB constraint names,
      // table names, or internal stack context.
      const safeMessage = sanitizeAuthError(e, lang);
      setErr(safeMessage);
    } finally {
      setLoading(false);
    }
  }

  // ---------------------------------------------------------------------------
  // Maps raw Supabase / network errors to safe, localised user-facing strings.
  // All unknown errors fall through to a generic message.
  // ---------------------------------------------------------------------------
  function sanitizeAuthError(e: any, lang: string): string {
    const de = (msg: string) => (lang === "de" ? msg : undefined);
    const code: string = e?.code ?? e?.message ?? "";

    if (code === "profile_does_not_exist") {
      return de("Ein Profil mit dieser E-Mail-Adresse existiert nicht. Bitte registrieren Sie sich zuerst.") ?? "No profile exists with this email. Please sign up first.";
    }

    if (code.startsWith("incorrect_password_with_role:")) {
      const roleKey = code.split(":")[1];
      const roleName = roleKey === "caterer" ? "Caterer" : roleKey === "restaurant_owner" ? "Restaurant" : roleKey === "planner" ? "Event Planner" : "Customer";
      return de(`Falsches Passwort für dieses Konto. Dieses E-Mail ist als ${roleName} registriert.`) ?? `Incorrect password for this account. This email is registered as a ${roleName}.`;
    }

    // Supabase Auth error codes (https://supabase.com/docs/reference/javascript/auth-error-codes)
    if (code.includes("invalid_credentials") || code.includes("Invalid login credentials")) {
      return de("E-Mail oder Passwort ist falsch.") ?? "Incorrect email or password.";
    }
    if (code.includes("email_not_confirmed")) {
      return de("Bitte bestätige zuerst deine E-Mail-Adresse.") ?? "Please confirm your email address first.";
    }
    if (code.includes("user_already_exists") || code.includes("already registered")) {
      return de("Diese E-Mail-Adresse ist bereits registriert.") ?? "An account with this email already exists.";
    }
    if (code.includes("weak_password") || code.includes("Password should be")) {
      return de("Das Passwort ist zu schwach. Bitte mindestens 8 Zeichen verwenden.") ?? "Password is too weak. Use at least 8 characters.";
    }
    if (code.includes("over_email_send_rate_limit") || code.includes("rate limit")) {
      return de("Zu viele Anfragen. Bitte warte einen Moment.") ?? "Too many requests. Please wait a moment.";
    }
    if (code.includes("network") || code.includes("fetch")) {
      return de("Netzwerkfehler. Bitte Internetverbindung prüfen.") ?? "Network error. Please check your internet connection.";
    }

    // Generic fallback — no internal detail exposed
    return de("Ein Fehler ist aufgetreten. Bitte erneut versuchen.") ?? "Something went wrong. Please try again.";
  }



  if (mode === "check-email") {
    return (
      <div className="min-h-screen bg-mint-dotted flex items-center justify-center px-4 py-16">
        <div className="surface-card w-full max-w-md p-8 text-center space-y-4">
          <div className="mx-auto bg-forest/10 text-forest w-16 h-16 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-3xl font-display text-forest">{tt("Bitte überprüfe deine E-Mails", "Please check your email")}</h1>
          <p className="text-forest/70">
            {tt("Wir haben dir einen Bestätigungslink an", "We sent a confirmation link to")} <strong>{email}</strong> {tt("gesendet. Klicke darauf, um dein Konto zu aktivieren und fortzufahren.", "sent. Click it to activate your account and continue.")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-mint-dotted flex items-center justify-center px-4 py-16">
      <div className={`surface-card w-full ${mode === "signup" && isPartner ? "max-w-2xl" : "max-w-md"} p-8`}>
        <div className="flex items-center justify-between">
          <Link to="/" className="text-xs uppercase tracking-widest text-forest/70 hover:text-forest">
            ← Speisely
          </Link>
          <LanguageToggle />
        </div>
        <h1 className="mt-4 text-3xl font-display text-forest">
          {mode === "signup" ? tt("Konto erstellen", "Create an account") : tt("Willkommen zurück", "Welcome back")}
        </h1>
        <p className="mt-1 text-sm text-forest/70">
          {mode === "signup"
            ? tt("Bestelle Essen oder verwalte dein Geschäft.", "Start ordering or manage your storefront.")
            : tt("Melde dich in deinem Dashboard an.", "Sign in to your dashboard.")}
        </p>

        {message && (
          <div className="mt-4 p-3 rounded-md bg-amber-50 border border-amber-200 text-sm text-amber-700">
            {message}
          </div>
        )}

        <form onSubmit={submit} className="mt-6 space-y-4">
          {mode === "signup" && (
            <>
              <div className="space-y-1.5">
                <Label className="text-forest">{tt("Ich registriere mich als", "I'm signing up as")}</Label>
                <div className="grid grid-cols-2 gap-2">
                  {ROLES.map(({ value, label, desc, Icon }) => {
                    const active = role === value;
                    return (
                      <button
                        type="button"
                        key={value}
                        onClick={() => {
                          setRole(value);
                          triggerSignupStarted(value);
                        }}
                        className={`flex flex-col items-start gap-1 rounded-xl border p-3 text-left transition ${
                          active
                            ? "border-[#b28a3c] bg-[#b28a3c]/10 ring-2 ring-[#b28a3c]/30"
                            : "border-[#eadfce] hover:border-forest/40"
                        }`}
                      >
                        <Icon className={`h-4 w-4 ${active ? "text-[#b28a3c]" : "text-forest"}`} />
                        <span className={`text-sm font-medium ${active ? "text-[#16372f]" : "text-forest"}`}>{label}</span>
                        <span className="text-[11px] text-forest/60 leading-tight">{desc}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-forest">{tt("Vollständiger Name", "Full name")}</Label>
                <Input
                  id="name"
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    triggerSignupStarted(role);
                  }}
                  required
                  className="border-[#eadfce] focus-visible:ring-[#b28a3c]/40"
                />
              </div>
            </>
          )}
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-forest">{tt("E-Mail", "Email")}</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                triggerSignupStarted(role);
              }}
              required
              className="border-[#eadfce] focus-visible:ring-[#b28a3c]/40"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-forest">{tt("Passwort", "Password")}</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                triggerSignupStarted(role);
              }}
              minLength={6}
              required
              className="border-[#eadfce] focus-visible:ring-[#b28a3c]/40"
            />
          </div>

          {mode === "signup" && isPartner && (
            <div className="rounded-xl border border-forest/20 bg-forest/5 p-4 space-y-4">
              <p className="text-sm font-medium text-forest">{tt("Geschäftsdetails", "Business details")}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field label={tt("Unternehmensname", "Business name")} value={biz.business_name} onChange={(v) => setBizField("business_name", v)} />
                <Field label={tt("Ansprechpartner", "Contact person")} value={biz.contact_person} onChange={(v) => setBizField("contact_person", v)} />
                <Field label={tt("Telefonnummer", "Phone number")} type="tel" value={biz.phone} onChange={(v) => setBizField("phone", v)} />
                <Field label={tt("Gewerbeanmeldung / HRB", "License / Registration #")} value={biz.license_number} onChange={(v) => setBizField("license_number", v)} hint={tt("Erforderlich für die Verifizierung", "Required for German business verification")} />
                <div className="sm:col-span-2">
                  <Field label={tt("Geschäftsadresse", "Business address")} value={biz.business_address} onChange={(v) => setBizField("business_address", v)} />
                </div>
                <Field label={tt("Stadt", "Service city")} value={biz.service_city} onChange={(v) => setBizField("service_city", v)} placeholder={tt("z.B. Berlin", "e.g. Berlin")} />
                <Field label={tt("Stadtteil / Bezirk", "Service area / district")} value={biz.service_area} onChange={(v) => setBizField("service_area", v)} placeholder={tt("z.B. Mitte, Kreuzberg", "e.g. Mitte, Kreuzberg")} />
              </div>
            </div>
          )}
          {err && <p className="text-sm text-red-600">{err}</p>}

          {mode === "signup" && (
            <div className="space-y-4 py-2 border-t border-[#eadfce]/60 mt-4 pt-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  required
                  className="mt-1 h-4 w-4 rounded border-[#eadfce] text-[#b28a3c] focus:ring-[#b28a3c]"
                />
                <span className="text-sm text-forest/80">
                  {tt(
                    "Ich verstehe und akzeptiere die Speisely-Nutzungsbedingungen und die Datenschutzrichtlinie.",
                    "I understand and agree to the Speisely Terms of Service and Privacy Policy."
                  )}
                  <span className="text-red-500 ml-1">*</span>
                </span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={marketingOptIn}
                  onChange={(e) => setMarketingOptIn(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-[#eadfce] text-[#b28a3c] focus:ring-[#b28a3c]"
                />
                <span className="text-sm text-forest/80">
                  {tt(
                    "Ja, ich möchte Produktupdates, Angebote und Werbe-E-Mails von Speisely erhalten. Ich kann mich jederzeit wieder abmelden.",
                    "Yes, I want to receive product updates, offers, and promotional emails from Speisely. I can unsubscribe at any time."
                  )}
                </span>
              </label>
            </div>
          )}

          <Button type="submit" className="w-full bg-[#b28a3c] hover:opacity-90 text-[#16372f] font-semibold" disabled={loading}>
            {loading ? tt("Bitte warten…", "Please wait…") : mode === "signup" ? tt("Konto erstellen", "Create account") : tt("Anmelden", "Sign in")}
          </Button>
        </form>

        <button
          type="button"
          className="mt-6 w-full text-sm text-forest/70 hover:text-forest"
          onClick={() => setMode(mode === "signup" ? "signin" : "signup")}
        >
          {mode === "signup"
            ? tt("Du hast bereits ein Konto? Anmelden", "Already have an account? Sign in")
            : tt("Neu bei Speisely? Konto erstellen", "New to Speisely? Create an account")}
        </button>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  hint?: string;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-forest/80">{label}</Label>
      <Input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required
        className="border-[#eadfce] focus-visible:ring-[#b28a3c]/40"
      />
      {hint && <p className="text-[11px] text-forest/50">{hint}</p>}
    </div>
  );
}
