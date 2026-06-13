"use client";

import { motion } from "framer-motion";
import { User, CalendarDays, Store } from "lucide-react";

export function UserSegmentGuide() {
  const segments = [
    {
      title: "For Customers",
      desc: "Daily ordering, premium dining, and effortless discovery.",
      icon: User,
      href: "/caterers"
    },
    {
      title: "For Event Planners",
      desc: "AI-assisted catering matching for large-scale events.",
      icon: CalendarDays,
      href: "/request/new"
    },
    {
      title: "For Restaurants",
      desc: "Run your hospitality business on Speisely infrastructure.",
      icon: Store,
      href: "/onboarding"
    }
  ];

  return (
    <section className="max-w-7xl mx-auto px-6 py-24 grid md:grid-cols-3 gap-8">
      {segments.map((s, i) => (
        <motion.div 
          key={s.title}
          whileHover={{ y: -10 }}
          className="bg-white p-8 rounded-[2rem] border border-[#eadfce] shadow-sm hover:shadow-xl transition-all"
        >
          <s.icon className="text-[#b28a3c] mb-6" size={32} />
          <h3 className="text-2xl font-serif text-[#16372f] mb-3">{s.title}</h3>
          <p className="text-[#5c6f68] mb-8 leading-relaxed">{s.desc}</p>
          <a href={s.href} className="text-[#16372f] font-bold flex items-center gap-2 hover:gap-3 transition-all">
            Get Started →
          </a>
        </motion.div>
      ))}
    </section>
  );
}
