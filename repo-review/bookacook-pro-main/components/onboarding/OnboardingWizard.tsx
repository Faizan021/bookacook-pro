"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronRight } from "lucide-react";

const steps = ["Brand", "Details", "Menu"];

export function OnboardingWizard() {
  const [currentStep, setCurrentStep] = useState(0);

  return (
    <div className="max-w-2xl mx-auto py-20 px-6">
      <div className="mb-12">
        <div className="flex justify-between mb-4">
          {steps.map((step, i) => (
            <div key={step} className={`text-xs font-bold uppercase tracking-widest ${i <= currentStep ? "text-[#16372f]" : "text-gray-300"}`}>
              {step}
            </div>
          ))}
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-[#16372f]"
            initial={{ width: "33%" }}
            animate={{ width: `${(currentStep + 1) * 33.3}%` }}
          />
        </div>
      </div>

      <div className="bg-white p-8 rounded-[2rem] border border-[#eadfce] shadow-sm">
        <AnimatePresence mode="wait">
          {currentStep === 0 && (
            <motion.div key="brand" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <h2 className="text-3xl font-serif mb-6 text-[#16372f]">Brand your restaurant</h2>
              <div className="space-y-4">
                <input placeholder="Restaurant Name" className="w-full p-4 rounded-xl border border-[#eadfce]" />
                <input type="color" className="w-full h-12 rounded-xl" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-8 flex justify-end">
          {currentStep < steps.length - 1 ? (
            <button 
              onClick={() => setCurrentStep(prev => prev + 1)}
              className="bg-[#16372f] text-white px-8 py-4 rounded-full font-bold flex items-center gap-2 hover:bg-[#0f2f27] transition"
            >
              Continue <ChevronRight size={18} />
            </button>
          ) : (
            <button className="bg-[#b28a3c] text-white px-8 py-4 rounded-full font-bold flex items-center gap-2">
              <Check size={18} /> Finish Setup
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
