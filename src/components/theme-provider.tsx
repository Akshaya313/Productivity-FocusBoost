"use client";

import React, { useEffect, useState } from "react";
import { useProductivityStore } from "@/store/useProductivityStore";
import { Sparkles, Trophy, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import CommandPalette from "./command-palette";

interface ToastMessage {
  id: string;
  type: "level-up" | "achievement";
  title: string;
  description: string;
}

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme, cursorEffect, checkStreak } = useProductivityStore();
  const [mounted, setMounted] = useState(false);
  const [mousePos, setMousePos] = useState({ x: -100, y: -100 });
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Track mouse coordinates for premium cursor trail
  useEffect(() => {
    if (!cursorEffect) return;
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [cursorEffect]);

  // Set active theme variables and sync daily streaks
  useEffect(() => {
    setMounted(true);
    checkStreak();
  }, []);

  // Sync stateful theme class with root HTML
  useEffect(() => {
    if (!mounted) return;
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme, mounted]);

  // Listen to custom store alert triggers
  useEffect(() => {
    if (!mounted) return;

    const handleLevelUp = (e: any) => {
      const { level } = e.detail;
      const newToast: ToastMessage = {
        id: `lvl-${Date.now()}`,
        type: "level-up",
        title: "Level Ascended!",
        description: `Congratulations! You have reached Level ${level}.`
      };
      setToasts((prev) => [...prev, newToast]);
      setTimeout(() => removeToast(newToast.id), 5000);
    };

    const handleAchievement = (e: any) => {
      const { title } = e.detail;
      const newToast: ToastMessage = {
        id: `ach-${Date.now()}`,
        type: "achievement",
        title: "Achievement Unlocked!",
        description: `Unlocked badge: "${title}"`
      };
      setToasts((prev) => [...prev, newToast]);
      setTimeout(() => removeToast(newToast.id), 5000);
    };

    window.addEventListener("level-up", handleLevelUp);
    window.addEventListener("achievement-unlocked", handleAchievement);

    return () => {
      window.removeEventListener("level-up", handleLevelUp);
      window.removeEventListener("achievement-unlocked", handleAchievement);
    };
  }, [mounted]);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Prevent SSR hydration mismatch
  if (!mounted) {
    return <div className="opacity-0">{children}</div>;
  }

  return (
    <>
      {/* Visual Cursor Trail */}
      {cursorEffect && typeof window !== "undefined" && window.innerWidth > 768 && (
        <>
          <div
            className="custom-cursor hidden md:block"
            style={{
              left: `${mousePos.x}px`,
              top: `${mousePos.y}px`,
            }}
          />
          <div
            className="custom-cursor-dot hidden md:block"
            style={{
              left: `${mousePos.x}px`,
              top: `${mousePos.y}px`,
            }}
          />
        </>
      )}

      {/* Children content */}
      {children}

      {/* Global Command palette wrapper */}
      <CommandPalette />

      {/* Dynamic Toast Alert Portal Overlay */}
      <div className="fixed top-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full select-none pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              onClick={() => removeToast(toast.id)}
              className="glass-panel p-4 rounded-xl border border-white/10 shadow-2xl flex items-start gap-3 pointer-events-auto cursor-pointer w-full"
              style={{
                background: toast.type === "level-up" 
                  ? "rgba(168, 85, 247, 0.25)" 
                  : "rgba(236, 72, 153, 0.25)"
              }}
            >
              <div className="p-2 rounded-lg bg-black/25 text-white">
                {toast.type === "level-up" ? (
                  <Trophy size={18} className="text-yellow-400 animate-bounce" />
                ) : (
                  <Star size={18} className="text-pink-400 animate-spin" />
                )}
              </div>
              <div className="flex-1">
                <span className="text-sm font-bold text-white block">
                  {toast.title}
                </span>
                <span className="text-xs text-white/80 block mt-0.5">
                  {toast.description}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </>
  );
}
