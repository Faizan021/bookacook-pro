"use client";

import { useState, useEffect } from "react";
import { useCartStore } from "./store";

export const useHydratedCart = () => {
  const [isHydrated, setIsHydrated] = useState(false);
  const cartStore = useCartStore();

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return { ...cartStore, isHydrated };
};
