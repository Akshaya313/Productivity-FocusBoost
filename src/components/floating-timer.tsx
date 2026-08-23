"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { useProductivityStore } from "@/store/useProductivityStore";
import { Timer, Play, Pause, RotateCcw, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export default function FloatingTimer() {
  const pathname = usePathname();
  const router = useRouter();
  const { duration, isRunning, timerMode, timerDirection, startTimer, pauseTimer, resetTimer } = useProductivityStore();

  // Hide when on full timer page
  if (pathname === "/dashboard/timer") return null;

  // Only show if running or duration active
  if (!isRunning && duration === 0) return null;

  const minutes = Math.floor(duration / 60);
  const seconds = duration % 60;
  const formattedTime = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.9 }}
        className="fixed bottom-6 left-6 z-40 flex items-center gap-3 p-2.5 px-4 rounded-2xl glass-panel border border-white/10 bg-black/80 shadow-2xl backdrop-blur-xl select-none"
      >
        {/* Clickable time block */}
        <div
          onClick={() => router.push("/dashboard/timer")}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className={cn(
            "w-8 h-8 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110",
            isRunning ? "bg-accent-gradient text-white animate-pulse" : "bg-white/10 text-[var(--text-muted)]"
          )}>
            <Timer size={16} />
          </div>

          <div className="flex flex-col text-left">
            <div className="flex items-center gap-1">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--accent)]">
                {timerDirection === "up" ? "Stopwatch" : timerMode.replace("_", " ")}
              </span>
            </div>
            <span className="text-sm font-black font-mono text-white tracking-wider leading-none mt-0.5">
              {formattedTime}
            </span>
          </div>
        </div>

        <div className="w-[1px] h-6 bg-white/10 mx-1" />

        {/* Action Controls */}
        <div className="flex items-center gap-1">
          <button
            onClick={isRunning ? pauseTimer : startTimer}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-white transition-colors cursor-pointer"
            title={isRunning ? "Pause Timer" : "Start Timer"}
          >
            {isRunning ? <Pause size={13} /> : <Play size={13} />}
          </button>
          
          <button
            onClick={() => router.push("/dashboard/timer")}
            className="p-1.5 rounded-lg bg-accent-gradient hover:opacity-90 text-white transition-all cursor-pointer flex items-center gap-1 text-[10px] font-bold px-2"
            title="Open Focus Timer module"
          >
            <span>Open</span>
            <ArrowRight size={10} />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
