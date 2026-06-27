import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useI18n } from "@/i18n/I18nProvider";

export interface CustomerIdentityState {
  name: string;
  email: string;
  phone: string;
  marketingOptIn: boolean;
  termsAccepted: boolean;
}

interface UnifiedCustomerFieldsProps {
  value: CustomerIdentityState;
  onChange: (fields: Partial<CustomerIdentityState>) => void;
  hidePhone?: boolean; // Sometimes phone isn't strictly required, but usually it is for these forms
}

export function UnifiedCustomerFields({ value, onChange, hidePhone = false }: UnifiedCustomerFieldsProps) {
  const { lang } = useI18n();
  const t = (de: string, en: string) => (lang === "de" ? de : en);

  return (
    <div className="space-y-4">
      {/* Name Input */}
      <div className="space-y-1.5">
        <Label htmlFor="customer-name">{t("Vollständiger Name", "Full Name")}</Label>
        <Input
          id="customer-name"
          required
          className="bg-white border-[#eadfce]"
          value={value.name}
          onChange={(e) => onChange({ name: e.target.value })}
          placeholder="Max Mustermann"
        />
      </div>

      {/* Email & Phone Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="customer-email">{t("E-Mail Adresse", "Email Address")}</Label>
          <Input
            id="customer-email"
            type="email"
            required
            className="bg-white border-[#eadfce]"
            value={value.email}
            onChange={(e) => onChange({ email: e.target.value })}
            placeholder="max@example.com"
          />
        </div>
        {!hidePhone && (
          <div className="space-y-1.5">
            <Label htmlFor="customer-phone">{t("Telefonnummer", "Phone Number")}</Label>
            <Input
              id="customer-phone"
              type="tel"
              required
              className="bg-white border-[#eadfce]"
              value={value.phone}
              onChange={(e) => onChange({ phone: e.target.value })}
              placeholder="+49 123 456789"
            />
          </div>
        )}
      </div>

      {/* Consents */}
      <div className="space-y-3 mt-4 pt-4 border-t border-[oklch(0.85_0.05_152)]">
        <div className="flex items-start space-x-2">
          <Checkbox
            id="terms-accept"
            checked={value.termsAccepted}
            onCheckedChange={(c) => onChange({ termsAccepted: !!c })}
            className="border-[#eadfce] mt-0.5"
          />
          <Label htmlFor="terms-accept" className="text-sm text-forest/80 leading-tight">
            {t(
              "Ich akzeptiere die Nutzungsbedingungen und Datenschutzbestimmungen.",
              "I accept the Terms of Service and Privacy Policy."
            )}
            <span className="text-red-500 ml-1">*</span>
          </Label>
        </div>
        <div className="flex items-start space-x-2">
          <Checkbox
            id="marketing-optin"
            checked={value.marketingOptIn}
            onCheckedChange={(c) => onChange({ marketingOptIn: !!c })}
            className="border-[#eadfce] mt-0.5"
          />
          <Label htmlFor="marketing-optin" className="text-sm text-forest/80 leading-tight">
            {t(
              "Ja, ich möchte gelegentliche Updates und Angebote von Speisely erhalten (Jederzeit widerrufbar).",
              "Yes, I would like to receive occasional updates and offers from Speisely (unsubscribe at any time)."
            )}
          </Label>
        </div>
      </div>
    </div>
  );
}
