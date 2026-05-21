"use client";

import React, { useEffect, useState } from "react";
import { useProductivityStore } from "@/store/useProductivityStore";
import { Play, Pause, RotateCcw, Volume2, Sparkles, Monitor, Maximize2, Minimize2, Eye, ShieldAlert, Award, FileMusic, Settings } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AmbientSoundPlayer from "@/components/ambient-sound";
import { cn } from "@/lib/utils";

export default function AdvancedTimer() {
  const {
    timerMode,
    duration,
    isRunning,
    isDeepFocus,
    presets,
    startTimer,
    pauseTimer,
    resetTimer,
    tickTimer,
    setTimerMode,
    setPresets,
    setDeepFocus,
    timerHistory
  } = useProductivityStore();

  const [focusInput, setFocusInput] = useState(presets.focus);
  const [shortInput, setShortInput] = useState(presets.short_break);
  const [longInput, setLongInput] = useState(presets.long_break);

  // Synchronous countdown timer tick logic
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning) {
      interval = setInterval(() => {
        tickTimer();
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, tickTimer]);

  // Handle Spacebar to Pause/Play and Escape to Exit Deep Focus
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" && e.target === document.body) {
        e.preventDefault();
        if (isRunning) pauseTimer();
        else startTimer();
      } else if (e.code === "Escape" && isDeepFocus) {
        e.preventDefault();
        setDeepFocus(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isRunning, isDeepFocus]);

  const activePresetLength = presets[timerMode] * 60;
  const elapsed = activePresetLength - duration;
  const progressPercent = activePresetLength > 0 ? (elapsed / activePresetLength) * 100 : 0;

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handlePresetSave = (e: React.FormEvent) => {
    e.preventDefault();
    setPresets({
      focus: Number(focusInput),
      short_break: Number(shortInput),
      long_break: Number(longInput)
    });
    alert("Presets customized successfully!");
  };

  return (
    <div className="flex flex-col gap-6 select-none relative h-full">
      <AnimatePresence>
        {/* Fullscreen Deep Focus Overlay */}
        {isDeepFocus && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#04020a] z-50 flex flex-col items-center justify-center select-none"
          >
            {/* Shifting ambient glow spheres */}
            <div className="absolute top-[30%] left-[30%] w-[350px] h-[350px] bg-[var(--card-glow)] rounded-full blur-[80px] opacity-40 animate-pulse-slow" />

            <div className="relative flex flex-col items-center justify-center text-center z-10 gap-6 max-w-sm">
              <span className="text-[10px] uppercase font-black tracking-widest text-[var(--text-muted)] flex items-center gap-1.5">
                <Sparkles size={11} className="text-[var(--accent)] animate-spin" />
                <span>Deep Work Mode</span>
              </span>

              {/* Large Immersive Fullscreen circular visualizer */}
              <div className="relative w-64 h-64 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="128"
                    cy="128"
                    r="114"
                    className="stroke-white/5"
                    strokeWidth="4"
                    fill="transparent"
                  />
                  <motion.circle
                    cx="128"
                    cy="128"
                    r="114"
                    className="stroke-purple-500"
                    strokeWidth="6"
                    fill="transparent"
                    strokeDasharray={716}
                    strokeDashoffset={716 - (716 * progressPercent) / 100}
                    style={{ stroke: "var(--accent)" }}
                    transition={{ ease: "linear" }}
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-5xl font-black font-mono text-white tracking-widest">
                    {formatTime(duration)}
                  </span>
                  <span className="text-[9px] uppercase tracking-wider text-[var(--text-muted)] font-bold mt-2">
                    {timerMode.replace("_", " ")}
                  </span>
                </div>
              </div>

              {/* Distraction-free actions */}
              <div className="flex items-center gap-4 mt-2">
                <button
                  onClick={isRunning ? pauseTimer : startTimer}
                  className="p-3.5 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all cursor-pointer"
                >
                  {isRunning ? <Pause size={18} /> : <Play size={18} />}
                </button>
                <button
                  onClick={resetTimer}
                  className="p-3 rounded-full bg-white/5 border border-white/10 text-[var(--text-muted)] hover:text-white transition-all cursor-pointer"
                >
                  <RotateCcw size={16} />
                </button>
              </div>

              <div className="text-[10px] text-[var(--text-muted)] font-mono flex flex-col gap-1 items-center bg-white/5 p-3 rounded-xl border border-white/5 w-full mt-4">
                <span>Press SPACE to Pause/Resume</span>
                <span>Press ESC to return to workspace</span>
              </div>
            </div>

            <button
              onClick={() => setDeepFocus(false)}
              className="absolute top-6 right-6 px-3 py-1.5 rounded-lg border border-white/15 bg-white/5 text-xs text-white hover:bg-white/10 flex items-center gap-1.5 cursor-pointer"
            >
              <Minimize2 size={12} />
              <span>Exit Deep Focus</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Standard Screen Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white">Focus Timer</h2>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            Optimize your attention slots. Avoid multitasking fatigue.
          </p>
        </div>

        <button
          onClick={() => setDeepFocus(true)}
          className="px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-white hover:bg-white/10 flex items-center gap-2 cursor-pointer shadow-lg"
        >
          <Maximize2 size={13} className="text-[var(--accent)]" />
          <span>Deep Focus Mode</span>
        </button>
      </div>

      {/* Main Center Panel Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Timer Ring Visualizer */}
        <div className="lg:col-span-2 glass-panel p-8 rounded-3xl border border-white/5 flex flex-col items-center justify-center gap-8 relative">
          
          {/* Mode Selector Preset Tabs */}
          <div className="flex bg-black/35 p-1 rounded-xl border border-white/5 gap-1.5">
            {(["focus", "short_break", "long_break"] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setTimerMode(mode)}
                className={cn(
                  "px-4 py-2 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer border border-transparent",
                  timerMode === mode
                    ? "bg-accent-gradient text-white shadow"
                    : "text-[var(--text-muted)] hover:text-white"
                )}
              >
                {mode.replace("_", " ")}
              </button>
            ))}
          </div>

          {/* Standard Circular SVG visual Countdown ring */}
          <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="144"
                cy="144"
                r="128"
                className="stroke-white/5"
                strokeWidth="6"
                fill="transparent"
              />
              <motion.circle
                cx="144"
                cy="144"
                r="128"
                className="stroke-purple-500"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={804}
                initial={{ strokeDashoffset: 804 }}
                animate={{ strokeDashoffset: 804 - (804 * progressPercent) / 100 }}
                style={{ stroke: "var(--accent)" }}
                transition={{ ease: "linear" }}
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-5xl sm:text-6xl font-black font-mono text-white tracking-widest">
                {formatTime(duration)}
              </span>
              <span className="text-[10px] uppercase tracking-widest text-[var(--text-muted)] font-bold mt-3.5">
                {timerMode === "focus" ? "Attention Block" : "Refuel Break"}
              </span>
            </div>
          </div>

          {/* Player controls */}
          <div className="flex items-center gap-5">
            <button
              onClick={resetTimer}
              className="p-3 rounded-full bg-white/5 border border-white/5 hover:bg-white/10 text-[var(--text-muted)] hover:text-white transition-colors cursor-pointer"
              title="Reset countdown"
            >
              <RotateCcw size={16} />
            </button>
            <button
              onClick={isRunning ? pauseTimer : startTimer}
              className="w-16 h-16 rounded-full bg-accent-gradient text-white flex items-center justify-center shadow-lg border border-white/10 hover:opacity-90 hover:scale-105 active:scale-95 transition-all cursor-pointer border-accent-glow"
              title={isRunning ? "Pause Session" : "Start Focus (+100 XP)"}
            >
              {isRunning ? <Pause size={24} /> : <Play size={24} fill="white" className="ml-1" />}
            </button>
            <button
              onClick={() => setTimerMode(timerMode === "focus" ? "short_break" : "focus")}
              className="p-3 rounded-full bg-white/5 border border-white/5 hover:bg-white/10 text-[var(--text-muted)] hover:text-white transition-colors cursor-pointer"
              title="Skip Interval"
            >
              <Play size={16} className="rotate-90" />
            </button>
          </div>
        </div>

        {/* Right 1 Col: Presets customizer & Ambient synth player */}
        <div className="flex flex-col gap-6">
          {/* Ambient noise player */}
          <AmbientSoundPlayer />

          {/* Presets Custom Input Form */}
          <div className="glass-panel p-5 rounded-2xl border border-white/5">
            <h3 className="text-xs uppercase font-bold tracking-widest text-[var(--text-muted)] mb-4 flex items-center gap-1.5">
              <Settings size={12} className="text-[var(--accent)]" />
              <span>Interval Customizer</span>
            </h3>

            <form onSubmit={handlePresetSave} className="flex flex-col gap-3.5">
              <div className="grid grid-cols-3 gap-2">
                <div className="flex flex-col gap-1 text-center">
                  <label className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-wider">Focus</label>
                  <input
                    type="number"
                    min="1"
                    max="180"
                    value={focusInput}
                    onChange={(e) => setFocusInput(Number(e.target.value))}
                    className="bg-white/5 border border-white/10 text-white rounded-lg py-1.5 text-center text-xs outline-none focus:border-[var(--accent)] font-semibold"
                  />
                </div>
                <div className="flex flex-col gap-1 text-center">
                  <label className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-wider">Short</label>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={shortInput}
                    onChange={(e) => setShortInput(Number(e.target.value))}
                    className="bg-white/5 border border-white/10 text-white rounded-lg py-1.5 text-center text-xs outline-none focus:border-[var(--accent)] font-semibold"
                  />
                </div>
                <div className="flex flex-col gap-1 text-center">
                  <label className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-wider">Long</label>
                  <input
                    type="number"
                    min="1"
                    max="120"
                    value={longInput}
                    onChange={(e) => setLongInput(Number(e.target.value))}
                    className="bg-white/5 border border-white/10 text-white rounded-lg py-1.5 text-center text-xs outline-none focus:border-[var(--accent)] font-semibold"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-xs text-white font-bold cursor-pointer transition-colors"
              >
                Apply Custom Intervals
              </button>
            </form>
          </div>

          {/* Lo-fi Music Card Placeholder */}
          <div className="glass-panel p-4 rounded-xl border border-white/5 flex items-center gap-3 bg-indigo-950/10">
            <div className="p-2.5 rounded-lg bg-indigo-500/10 text-indigo-400">
              <FileMusic size={18} />
            </div>
            <div>
              <span className="text-xs font-bold text-white block">Focus Lo-Fi Beats</span>
              <span className="text-[10px] text-[var(--text-muted)] block mt-0.5">Spotify integrated audio placeholder</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
