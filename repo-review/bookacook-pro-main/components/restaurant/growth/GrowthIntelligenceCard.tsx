"use client";

import { motion } from "framer-motion";
import { TrendingUp, BarChart3, Users, Zap } from "lucide-react";

export function GrowthIntelligenceCard() {
  return (
    <motion.div 
      whileHover={{ scale: 1.02 }}
      className="bg-gradient-to-br from-[#16372f] to-[#0f2f27] text-white p-8 rounded-[2.5rem] shadow-2xl overflow-hidden relative"
    >
      <div className="absolute top-0 right-0 p-8 opacity-10">
        <Sparkles size={120} />
      </div>
      
      <div className="relative z-10">
        <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-[#b28a3c] mb-4 flex items-center gap-2">
          <Zap size={16} /> Speisely AI Insight
        </h3>
        <p className="text-2xl font-serif mb-6 leading-snug">
          "Your Schnitzel menu is outperforming by 22% on weekends. Consider bundling it with a seasonal side."
        </p>
        <button className="bg-white text-[#16372f] px-6 py-3 rounded-full text-sm font-bold hover:bg-[#faf6ee] transition">
          Apply recommendation
        </button>
      </div>
    </motion.div>
  );
}

// Minimalist placeholder for Sparkles
function Sparkles({ size }: { size: number }) {
    return <div style={{width: size, height: size}} className="bg-white rounded-full"></div>
}
