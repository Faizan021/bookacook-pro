import { useState, useMemo, useEffect } from "react";
import { Building } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useServerFn } from "@tanstack/react-start";
import { submitB2bBriefFromLanding } from "@/lib/caterer/menu.functions";
import { trackEvent } from "@/utils/posthog";
import type { Caterer } from "@/data/caterers";

interface B2bCateringDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultCatererSlug?: string;
  corporateCaterers?: Caterer[];
}

export function B2bCateringDialog({
  open,
  onOpenChange,
  defaultCatererSlug = "",
  corporateCaterers = [],
}: B2bCateringDialogProps) {
  const { lang } = useI18n();
  const [submittingB2b, setSubmittingB2b] = useState(false);
  const [b2bForm, setB2bForm] = useState({
    companyName: "",
    employees: "30",
    pattern: "daily",
    startDate: "",
    catererSlug: defaultCatererSlug,
    notes: "",
  });

  useEffect(() => {
    if (open) {
      setB2bForm((prev) => ({
        ...prev,
        catererSlug: defaultCatererSlug,
      }));
    }
  }, [open, defaultCatererSlug]);

  const submitB2bFn = useServerFn(submitB2bBriefFromLanding);

  const handleB2bSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingB2b(true);
    try {
      await submitB2bFn({
        data: {
          catererSlug: b2bForm.catererSlug,
          companyName: b2bForm.companyName,
          employees: parseInt(b2bForm.employees),
          pattern: b2bForm.pattern,
          startDate: b2bForm.startDate || new Date().toISOString().split("T")[0],
          notes: b2bForm.notes,
        }
      });

      trackEvent("reservation_submitted", {
        catererSlug: b2bForm.catererSlug,
        type: "catering",
        isB2b: true,
        isRecurring: true,
      });

      alert(
        lang === "de"
          ? "Ihre Anfrage für ein wiederkehrendes Catering-Programm wurde erfolgreich übermittelt! Der ausgewählte Partner wird sich in Kürze mit einem Angebot bei Ihnen melden."
          : "Your recurring catering program request has been successfully submitted! The chosen partner will get in touch with an offer shortly."
      );
      onOpenChange(false);
      setB2bForm({
        companyName: "",
        employees: "30",
        pattern: "daily",
        startDate: "",
        catererSlug: defaultCatererSlug,
        notes: "",
      });
    } catch (err: any) {
      if (err.message?.includes("Unauthorized") || err.message?.includes("authorization header")) {
        alert(
          lang === "de"
            ? "Bitte melde dich an oder registriere dich, um eine Anfrage zu senden."
            : "Please sign in or register to submit your request."
        );
      } else {
        alert("Error: " + err.message);
      }
    } finally {
      setSubmittingB2b(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-[#fdfaf5] text-forest border-[#eadfce] rounded-3xl">
        <DialogHeader className="space-y-1">
          <DialogTitle className="font-display text-2xl font-bold text-forest flex items-center gap-2">
            <Building className="h-6 w-6 text-emerald-600" />{" "}
            {lang === "de" ? "B2B Firmen-Catering" : "Corporate Catering"}
          </DialogTitle>
          <p className="text-xs text-forest/70">
            {lang === "de"
              ? "Richten Sie regelmäßige Mittagstische oder ein Catering-Konzept für Ihr Büro ein."
              : "Set up regular lunch programs or a custom catering plan for your workspace."}
          </p>
        </DialogHeader>
        <form onSubmit={handleB2bSubmit} className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <Label htmlFor="companyName" className="text-xs font-semibold text-forest/80">
              {lang === "de" ? "Firmenname" : "Company Name"}
            </Label>
            <Input
              id="companyName"
              required
              className="bg-white border-[#eadfce] focus-visible:ring-emerald-500 rounded-xl"
              value={b2bForm.companyName}
              onChange={(e) =>
                setB2bForm((prev) => ({ ...prev, companyName: e.target.value }))
              }
              placeholder="Acme Corp GmbH"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="employees" className="text-xs font-semibold text-forest/80">
                {lang === "de" ? "Mitarbeiteranzahl" : "Employees"}
              </Label>
              <Input
                id="employees"
                type="number"
                required
                min="1"
                className="bg-white border-[#eadfce] focus-visible:ring-emerald-500 rounded-xl"
                value={b2bForm.employees}
                onChange={(e) =>
                  setB2bForm((prev) => ({ ...prev, employees: e.target.value }))
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="pattern" className="text-xs font-semibold text-forest/80">
                {lang === "de" ? "Frequenz" : "Frequency"}
              </Label>
              <Select
                value={b2bForm.pattern}
                onValueChange={(v) =>
                  setB2bForm((prev) => ({ ...prev, pattern: v }))
                }
              >
                <SelectTrigger
                  id="pattern"
                  className="bg-white border-[#eadfce] focus:ring-emerald-500 rounded-xl"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#fdfaf5] border-[#eadfce] text-forest">
                  <SelectItem value="daily">
                    {lang === "de" ? "Täglich (Mo-Fr)" : "Daily (Mon-Fri)"}
                  </SelectItem>
                  <SelectItem value="weekly">
                    {lang === "de" ? "Einmal pro Woche" : "Once a week"}
                  </SelectItem>
                  <SelectItem value="biweekly">
                    {lang === "de" ? "Alle zwei Wochen" : "Bi-weekly"}
                  </SelectItem>
                  <SelectItem value="monthly">
                    {lang === "de" ? "Einmal pro Monat" : "Once a month"}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="catererSelect" className="text-xs font-semibold text-forest/80">
              {lang === "de" ? "Partner / Wunsch-Caterer" : "Preferred Partner"}
            </Label>
            <Select
              value={b2bForm.catererSlug || undefined}
              onValueChange={(v) =>
                setB2bForm((prev) => ({ ...prev, catererSlug: v }))
              }
            >
              <SelectTrigger
                id="catererSelect"
                className="bg-white border-[#eadfce] focus:ring-emerald-500 rounded-xl"
              >
                <SelectValue placeholder={lang === "de" ? "Bitte wählen..." : "Please select..."} />
              </SelectTrigger>
              <SelectContent className="bg-[#fdfaf5] border-[#eadfce] text-forest">
                {corporateCaterers.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name} ({c.area})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="startDate" className="text-xs font-semibold text-forest/80">
              {lang === "de" ? "Gewünschter Start" : "Desired Start Date"}
            </Label>
            <Input
              id="startDate"
              type="date"
              required
              className="bg-white border-[#eadfce] focus-visible:ring-emerald-500 rounded-xl"
              value={b2bForm.startDate}
              onChange={(e) =>
                setB2bForm((prev) => ({ ...prev, startDate: e.target.value }))
              }
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="notes" className="text-xs font-semibold text-forest/80">
              {lang === "de" ? "Zusätzliche Wünsche" : "Additional Requests"}
            </Label>
            <Textarea
              id="notes"
              rows={3}
              className="bg-white border-[#eadfce] focus-visible:ring-emerald-500 rounded-xl"
              value={b2bForm.notes}
              onChange={(e) =>
                setB2bForm((prev) => ({ ...prev, notes: e.target.value }))
              }
              placeholder={
                lang === "de"
                  ? "z.B. vegetarische/vegane Anteile, Budgetvorgaben..."
                  : "e.g., vegetarian/vegan ratios, budget parameters..."
              }
            />
          </div>
          <button
            disabled={submittingB2b}
            type="submit"
            className="mt-4 w-full rounded-full bg-forest text-white py-3.5 font-semibold hover:opacity-90 disabled:opacity-50 transition cursor-pointer shadow-sm"
          >
            {submittingB2b
              ? lang === "de"
                ? "Wird gesendet..."
                : "Sending..."
              : lang === "de"
              ? "B2B-Anfrage absenden"
              : "Submit B2B Request"}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
