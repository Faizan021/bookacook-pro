import { Check, X } from "lucide-react";

export function PasswordChecklist({ password = "", tt }: { password?: string, tt: (de:string, en:string) => string }) {
  const reqs = [
    { label: tt("Mindestens 8 Zeichen", "At least 8 characters"), valid: password.length >= 8 },
    { label: tt("Ein Großbuchstabe", "One uppercase letter"), valid: /[A-Z]/.test(password) },
    { label: tt("Eine Zahl", "One number"), valid: /[0-9]/.test(password) },
    { label: tt("Ein Sonderzeichen", "One special character"), valid: /[^A-Za-z0-9]/.test(password) },
  ];

  return (
    <div className="mt-2 space-y-1">
      {reqs.map((req, i) => (
        <div key={i} className={`flex items-center gap-2 text-xs ${req.valid ? "text-green-600" : "text-forest/50 transition-colors"}`}>
          {req.valid ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
          <span>{req.label}</span>
        </div>
      ))}
    </div>
  );
}
