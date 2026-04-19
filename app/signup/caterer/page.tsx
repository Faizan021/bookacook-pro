"use client";

import { useState } from "react";
import Link from "next/link";
import { useT } from "@/lib/i18n/context";
import { LanguageSwitcher } from "@/components/i18n/language-switcher";
import { createClient } from "@/lib/supabase/client";

type FormFields = {
  businessName: string;
  contactPerson: string;
  email: string;
  phone: string;
  businessAddress: string;
  licenseNumber: string;
  password: string;
};

type FormErrors = Partial<Record<keyof FormFields, string>>;

const EMPTY: FormFields = {
  business
