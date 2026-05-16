"use client";

import { motion } from "framer-motion";

export function PremiumNavbar() {
  return (
    <nav className="fixed top-0 w-full z-[100] backdrop-blur-md bg-[#fbf7ef]/80 border-b border-[#eadfce]">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="text-2xl font-serif text-[#16372f] tracking-tight">Speisely</div>
        
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-[#16372f]">
          {["AI Catering", "Browse Caterers", "Restaurants", "About"].map((item) => (
            <a key={item} href="#" className="hover:text-[#b28a3c] transition-colors">
              {item}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <button className="text-sm text-[#16372f]">DE / EN</button>
          <button className="bg-[#16372f] text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-[#0f2f27] transition-all">
            Login
          </button>
        </div>
      </div>
    </nav>
  );
}
