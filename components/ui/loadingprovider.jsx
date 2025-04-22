"use client";


import { useState, useEffect } from "react";
import { SurfLoader } from "./loader";

export function LoadingProvider({ children }) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 6000);

    return () => clearTimeout(timer);
  }, []);

  return isLoading ? <SurfLoader /> : children;
}