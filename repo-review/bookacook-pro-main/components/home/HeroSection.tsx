"use client";

import { motion } from "framer-motion";
import { Mic, Search, ArrowRight } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center text-center px-6 overflow-hidden">
      {/* Ambient background orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#d8ccb9]/20 rounded-full blur-[128px]" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#173f35]/10 rounded-full blur-[128px]" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 max-w-4xl"
      >
        <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-[#16372f] tracking-tight mb-8">
          Describe your event.<br />
          <span className="text-[#b28a3c]">Let AI find the perfect catering.</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-[#5c6f68] mb-12 font-light max-w-2xl mx-auto">
          Speisely AI connects premium catering, event planning, and hospitality experiences in seconds.
        </p>

        {/* AI Input Interface */}
        <div className="relative max-w-2xl mx-auto group">
          <div className="absolute inset-0 bg-white rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
          <div className="relative flex items-center bg-white rounded-full p-2 shadow-2xl border border-[#eadfce]">
            <input 
              type="text" 
              placeholder="E.g. A corporate dinner for 50 people in Berlin..."
              className="flex-1 px-6 py-4 bg-transparent outline-none text-lg"
            />
            <button className="p-4 hover:bg-[#faf6ee] rounded-full transition-colors text-[#5c6f68]">
              <Mic size={24} />
            </button>
            <button className="bg-[#16372f] text-white p-4 rounded-full hover:bg-[#0f2f27] transition-all">
              <ArrowRight size={24} />
            </button>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
