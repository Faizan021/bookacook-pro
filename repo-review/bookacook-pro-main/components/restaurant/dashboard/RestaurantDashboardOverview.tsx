"use client";

import { motion } from "framer-motion";
import { DollarSign, Package, TrendingUp, Users } from "lucide-react";

export function RestaurantDashboardOverview() {
  const stats = [
    { label: "Active Orders", value: "14", icon: Package },
    { label: "Monthly Revenue", value: "€12,450", icon: DollarSign },
    { label: "Customers Served", value: "842", icon: Users },
    { label: "Growth", value: "+12%", icon: TrendingUp },
  ];

  return (
    <div className="p-8 space-y-8 bg-[#fbf7ef] min-h-screen">
      <header className="flex justify-between items-center mb-12">
        <h1 className="text-3xl font-serif text-[#16372f]">Restaurant Operations</h1>
        <button className="bg-[#16372f] text-white px-6 py-3 rounded-full font-bold">New Order</button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((s, i) => (
          <div key={i} className="bg-white p-6 rounded-[2rem] border border-[#eadfce] shadow-sm">
            <s.icon className="text-[#b28a3c] mb-4" size={24} />
            <p className="text-sm text-[#5c6f68] font-medium uppercase tracking-widest">{s.label}</p>
            <p className="text-3xl font-bold text-[#16372f] mt-2">{s.value}</p>
          </div>
        ))}
      </div>

      <section className="bg-white p-8 rounded-[2rem] border border-[#eadfce] shadow-sm">
        <h2 className="text-xl font-bold mb-6">Recent Order Queue</h2>
        <div className="space-y-4">
          {[1, 2, 3].map((order) => (
            <div key={order} className="flex justify-between items-center p-4 bg-[#faf6ee] rounded-xl border border-[#eadfce]">
              <div>
                <p className="font-semibold text-[#16372f]">Order #{1000 + order}</p>
                <p className="text-xs text-[#5c6f68]">Prepared by Kitchen - 10 min ago</p>
              </div>
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase">Preparing</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
