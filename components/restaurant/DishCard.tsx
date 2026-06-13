"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { toast } from "sonner";

interface Dish {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
}

export function DishCard({ dish }: { dish: Dish }) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="group bg-white rounded-[2rem] p-6 border border-[#eadfce] shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden"
    >
      <div className="relative h-48 w-full mb-6 overflow-hidden rounded-[1.5rem]">
        <Image src={dish.image} alt={dish.name} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
      </div>
      
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-serif text-2xl text-[#16372f]">{dish.name}</h3>
        <span className="text-lg font-bold text-[#b28a3c]">€{dish.price.toFixed(2)}</span>
      </div>
      
      <p className="text-[#5c6f68] text-sm leading-relaxed mb-6 line-clamp-2">{dish.description}</p>
      
      <button 
        onClick={() => toast.success(`${dish.name} added to cart`)}
        className="w-full flex items-center justify-center gap-2 py-3 bg-[#fbf7ef] text-[#16372f] rounded-full font-bold hover:bg-[#16372f] hover:text-white transition-all"
      >
        <Plus size={18} /> Add to Order
      </button>
    </motion.div>
  );
}
