"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Check, Truck, Clock } from "lucide-react";

export function NotificationCenter() {
  const [notifications, setNotifications] = useState([
    { id: 1, title: "Order Confirmed", message: "Your order #1042 is confirmed.", type: "success" },
    { id: 2, title: "Delivery Update", message: "Your meal is prepared.", type: "info" }
  ]);

  return (
    <div className="fixed top-24 right-6 z-50 w-80 space-y-3">
      <AnimatePresence>
        {notifications.map(n => (
          <motion.div 
            key={n.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="bg-white p-4 rounded-2xl border border-[#eadfce] shadow-lg flex items-start gap-3"
          >
            <div className={`p-2 rounded-full ${n.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'}`}>
              {n.type === 'success' ? <Check size={16} /> : <Truck size={16} />}
            </div>
            <div>
              <p className="font-bold text-sm text-[#16372f]">{n.title}</p>
              <p className="text-xs text-[#5c6f68]">{n.message}</p>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
