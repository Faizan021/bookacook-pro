"use client";

import { motion, useScroll, useTransform } from "framer-motion";

export function FloatingAmbientBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <motion.div 
        animate={{ 
          x: [0, 100, 0],
          y: [0, -50, 0],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-0 left-0 w-[600px] h-[600px] bg-[#d8ccb9]/10 rounded-full blur-[150px]" 
      />
      <motion.div 
        animate={{ 
          x: [0, -100, 0],
          y: [0, 100, 0],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#173f35]/5 rounded-full blur-[150px]" 
      />
    </div>
  );
}
