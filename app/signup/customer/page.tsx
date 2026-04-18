"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useT, useIsRTL } from "@/lib/i18n/context"; // Assuming this is your path

export default function CatererSignupPage() {
  const t = useT();
  const isRTL = useIsRTL();
  const [formData, setFormData] = useState({
    companyName: "",
    contactPerson: "",
    email: "",
    phone: "",
    address: "",
    license: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form Submitted:", formData);
    // Handle your API call here
  };

  return (
    <main 
      className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-2" 
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* LEFT SIDE: HERO SECTION */}
      <section className="relative hidden lg:block overflow-hidden">
        <Image
          src="/images/speisely-catering-bg.png" // Make sure this image exists
          alt={t("signup.hero.alt")}
          fill
          priority
          className="object-cover"
        />
        {/* Dark overlay to make text readable */}
        <div className="absolute inset-0 bg-black/40" />
        
        <div className="absolute bottom-12 left-12 right-12 text-white">
          <h1 className="text-4xl font-bold leading-tight">
            {t("signup.hero.title")}
          </h1>
          <p className="mt-4 text-lg text-white/80">
            {t("signup.hero.subtitle")}
          </p>
        </div>
      </section>

      {/* RIGHT SIDE: FORM SECTION */}
      <section className="flex items-center justify-center bg-[#0a1a14] p-6 lg:p-12">
        {/* The White Card */}
        <div className="w-full max-w-[550px] rounded-[2rem] bg-white p-8 md:p-12 shadow-2xl">
          
          {/* Back Link */}
          <Link 
            href="/signup" 
            className="mb-6 inline-flex items-center text-sm text-slate-500 hover:text-black transition-colors"
          >
            ← {t("signup.backToSelection")}
          </Link>

          <header className="mb-8">
            <h2 className="text-3xl font-semibold text-slate-900">
              {t("signup.form.title")}
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              {t("signup.form.subtitle")}
            </p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Grid for two-column fields */}
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  {t("signup.fields.companyName")} <span className="text-red-500">*</span>
                </label>
                <input
                  name="companyName"
                  required
                  className="rounded-lg border border-slate-200 p-3 text-sm text-slate-900 focus:border-primary focus:outline-none"
                  onChange={handleChange}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  {t("signup.fields.contactPerson")} <span className="text-red-500">*</span>
                </label>
                <input
                  name="contactPerson"
                  required
                  className="rounded-lg border border-slate-200 p-3 text-sm text-slate-900 focus:border-primary focus:outline-none"
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  {t("signup.fields.email")} <span className="text-red-500">*</span>
                </label>
                <input
                  name="email"
                  type="email"
                  required
                  className="rounded-lg border border-slate-200 p-3 text-sm text-slate-900 focus:border-primary focus:outline-none"
                  onChange={handleChange}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  {t("signup.fields.phone")} <span className="text-red-500">*</span>
                </label>
                <input
                  name="phone"
                  required
                  className="rounded-lg border border-slate-200 p-3 text-sm text-slate-900 focus:border-primary focus:outline-none"
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                {t("signup.fields.address")} <span className="text-red-500">*</span>
              </label>
              <input
                name="address"
                required
                className="rounded-lg border border-slate-200 p-3 text-sm text-slate-900 focus:border-primary focus:outline-none"
                onChange={handleChange}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  {t("signup.fields.license")} <span className="text-red-500">*</span>
                </label>
                <span className="text-[10px] font-bold text-amber-600 uppercase">{t("signup.fields.requiredLabel")}</span>
              </div>
              <input
                name="license"
                required
                className="rounded-lg border border-slate-200 p-3 text-sm text-slate-900 focus:border-primary focus:outline-none"
                placeholder="e.g. HRB-12345"
                onChange={handleChange}
              />
              <p className="text-[10px] text-slate-400 italic">
                {t("signup.fields.licenseNote")}
              </p>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                {t("signup.fields.password")} <span className="text-red-500">*</span>
              </label>
              <input
                name="password"
                type="password"
                required
                className="rounded-lg border border-slate-200 p-3 text-sm text-slate-900 focus:border-primary focus:outline-none"
                onChange={handleChange}
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-[#c5a059] py-4 text-sm font-semibold text-white transition hover:bg-[#b38f4a] active:scale-[0.98]"
            >
              {t("signup.form.submitButton")}
            </button>
          </form>

          <footer className="mt-8 text-center">
            <p className="text-sm text-slate-500">
              {t("signup.footer.alreadyHaveAccount")} 
              <Link href="/login" className="ml-1 font-semibold text-slate-900 underline">
                {t("signup.footer.loginLink")}
              </Link>
            </p>
          </footer>
        </div>
      </section>
    </main>
  );
}
