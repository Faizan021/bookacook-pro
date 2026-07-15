import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import posthog from "posthog-js";
import { motion, AnimatePresence } from "framer-motion";
import { submitLeadCapture } from "../../lib/api/leads.functions";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

const leadSchema = z.object({
  // Step 1: Event Details
  eventType: z.string().min(1, "Event type is required"),
  eventDate: z.string().min(1, "Event date is required"),
  guestCount: z.coerce.number().min(1, "Guest count is required"),
  
  // Step 2: Location & Budget
  city: z.string().min(1, "City is required"),
  venueAddress: z.string().optional(),
  budgetRange: z.string().optional(),
  
  // Step 3: Contact
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  notes: z.string().optional(),
  
  // Anti-abuse Honeypot
  honeypot: z.string().max(0).optional(),
});

type LeadFormData = z.infer<typeof leadSchema>;

interface LeadCaptureFormProps {
  defaultCity?: string;
  defaultEventType?: string;
  sourceRoute: string;
}

export function LeadCaptureForm({ defaultCity = "", defaultEventType = "", sourceRoute }: LeadCaptureFormProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [serverError, setServerError] = useState("");

  const { register, handleSubmit, trigger, formState: { errors } } = useForm<LeadFormData>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      city: defaultCity,
      eventType: defaultEventType,
      honeypot: "",
    }
  });

  const nextStep = async (currentStep: 1 | 2) => {
    let fieldsToValidate: any[] = [];
    if (currentStep === 1) {
      fieldsToValidate = ["eventType", "eventDate", "guestCount"];
    } else if (currentStep === 2) {
      fieldsToValidate = ["city", "venueAddress", "budgetRange"];
    }
    
    const isValid = await trigger(fieldsToValidate as any);
    if (isValid) {
      posthog.capture("lead_step_completed", { step: currentStep, source_route: sourceRoute });
      setStep((prev) => (prev + 1) as 1 | 2 | 3);
    }
  };

  const prevStep = () => setStep((prev) => (prev - 1) as 1 | 2 | 3);

  const onSubmit = async (data: LeadFormData) => {
    try {
      setIsSubmitting(true);
      setServerError("");
      
      const result = await submitLeadCapture({
        data: {
          ...data,
          sourceRoute,
          sourceChannel: "organic_geo", // Can be read from URL params if SEA
        }
      });

      if (result.success) {
        setIsSuccess(true);
        posthog.capture("lead_submitted", { 
          city: data.city, 
          eventType: data.eventType, 
          guest_count: data.guestCount,
          budget_range: data.budgetRange,
          source_route: sourceRoute 
        });
      }
    } catch (err: any) {
      setServerError(err.message || "Failed to submit request.");
    } finally {
      setIsSubmitting(false);
    }
  };

  React.useEffect(() => {
    posthog.capture("lead_started", { source_route: sourceRoute, default_city: defaultCity, default_event_type: defaultEventType });
  }, []);

  if (isSuccess) {
    return (
      <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md mx-auto border border-green-100">
        <h3 className="text-2xl font-bold text-green-700 mb-4">Anfrage erfolgreich gesendet!</h3>
        <p className="text-gray-600">
          Vielen Dank. Unser Team wird Ihre Anfrage umgehend prüfen und sich bei Ihnen melden.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 md:p-8 rounded-xl shadow-xl max-w-lg mx-auto border border-gray-100">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className={`h-2 flex-1 mx-1 rounded-full ${step >= i ? 'bg-primary' : 'bg-gray-200'}`} />
          ))}
        </div>
        <p className="text-sm text-gray-500 text-center font-medium">
          Schritt {step} von 3
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Anti-spam honeypot */}
        <input type="text" {...register("honeypot")} className="hidden" tabIndex={-1} autoComplete="off" />

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <h3 className="text-xl font-semibold mb-4">Event Details</h3>
              <div>
                <label className="block text-sm font-medium mb-1">Event Art *</label>
                <Input {...register("eventType")} placeholder="z.B. Hochzeit, Firmenfeier" />
                {errors.eventType && <p className="text-red-500 text-sm mt-1">{errors.eventType.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Datum *</label>
                <Input type="date" {...register("eventDate")} min={new Date().toISOString().split("T")[0]} />
                {errors.eventDate && <p className="text-red-500 text-sm mt-1">{errors.eventDate.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Anzahl Gäste *</label>
                <Input type="number" {...register("guestCount")} min="1" placeholder="z.B. 50" />
                {errors.guestCount && <p className="text-red-500 text-sm mt-1">{errors.guestCount.message}</p>}
              </div>
              <Button type="button" className="w-full mt-4" onClick={() => nextStep(1)}>Weiter</Button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <h3 className="text-xl font-semibold mb-4">Ort & Budget</h3>
              <div>
                <label className="block text-sm font-medium mb-1">Stadt *</label>
                <Input {...register("city")} placeholder="z.B. Berlin" />
                {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Location / Adresse (optional)</label>
                <Input {...register("venueAddress")} placeholder="Falls bereits bekannt" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Budget (optional)</label>
                <select {...register("budgetRange")} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                  <option value="">Bitte wählen...</option>
                  <option value="< 1000€">Unter 1.000€</option>
                  <option value="1000-3000€">1.000€ - 3.000€</option>
                  <option value="3000-5000€">3.000€ - 5.000€</option>
                  <option value="> 5000€">Über 5.000€</option>
                </select>
              </div>
              <div className="flex gap-3 mt-4">
                <Button type="button" variant="outline" className="w-1/3" onClick={prevStep}>Zurück</Button>
                <Button type="button" className="w-2/3" onClick={() => nextStep(2)}>Weiter</Button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <h3 className="text-xl font-semibold mb-4">Kontakt</h3>
              <div>
                <label className="block text-sm font-medium mb-1">Name *</label>
                <Input {...register("name")} placeholder="Ihr Name" />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">E-Mail *</label>
                <Input type="email" {...register("email")} placeholder="ihre@email.de" />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Telefonnummer (optional)</label>
                <Input type="tel" {...register("phone")} placeholder="Für Rückfragen" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Besondere Wünsche (optional)</label>
                <Textarea {...register("notes")} placeholder="Allergien, Besonderheiten..." className="h-20" />
              </div>
              
              {serverError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">
                  {serverError}
                </div>
              )}

              <div className="flex gap-3 mt-4">
                <Button type="button" variant="outline" className="w-1/3" onClick={prevStep} disabled={isSubmitting}>Zurück</Button>
                <Button type="submit" className="w-2/3" disabled={isSubmitting}>
                  {isSubmitting ? "Wird gesendet..." : "Anfrage absenden"}
                </Button>
              </div>
              <p className="text-xs text-gray-400 text-center mt-3">
                Ihre Daten werden sicher übertragen und nicht direkt veröffentlicht.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </div>
  );
}
