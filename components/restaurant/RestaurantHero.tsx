"use client";

import { motion } from "framer-motion";

export function RestaurantHero({ title, subtitle }: { title: string, subtitle: string }) {
  return (
    <section className="relative h-screen w-full flex items-center justify-center text-center overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1599084993091-1cb5c0721cc6?auto=format&fit=crop&q=80')] bg-cover bg-center brightness-[0.7]" />
      
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="relative z-10 px-6"
      >
        <h1 className="font-serif text-6xl md:text-8xl text-white tracking-tight mb-6">{title}</h1>
        <p className="text-xl md:text-2xl text-white/90 font-light mb-10">{subtitle}</p>
        
        <div className="flex gap-4 justify-center">
          <button className="px-8 py-4 bg-white text-[#173f35] rounded-full font-bold hover:bg-[#faf6ee] transition-all">
            Order Now
          </button>
          <button className="px-8 py-4 border border-white/30 text-white rounded-full font-medium hover:bg-white/10 transition-all">
            View Menu
          </button>
        </div>
      </motion.div>
    </section>
  );
}
