"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Clock, Truck } from "lucide-react";

export function LiveActivityFeed() {
  const activities = [
    { id: 1, type: "order", message: "New order from Table 5", time: "2 min ago", status: "New" },
    { id: 2, type: "delivery", message: "Schnitzel delivery in transit", time: "15 min ago", status: "En Route" },
    { id: 3, type: "review", message: "5-star rating for Schnitzel Haus", time: "45 min ago", status: "Feedback" }
  ];

  return (
    <div className="bg-white p-8 rounded-[2rem] border border-[#eadfce] shadow-sm">
      <h3 className="text-xl font-bold mb-6 text-[#16372f]">Live Activity</h3>
      <div className="space-y-6">
        {activities.map((act) => (
          <motion.div 
            key={act.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-start gap-4"
          >
            <div className={`p-2 rounded-full ${act.type === 'order' ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'}`}>
                {act.type === 'order' ? <Clock size={16} /> : <Truck size={16} />}
            </div>
            <div>
              <p className="text-sm font-semibold text-[#16372f]">{act.message}</p>
              <p className="text-xs text-[#5c6f68] mt-1">{act.time}</p>
            </div>
            <span className="ml-auto text-[10px] font-bold uppercase tracking-wider bg-[#faf6ee] px-2 py-1 rounded-md">{act.status}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
