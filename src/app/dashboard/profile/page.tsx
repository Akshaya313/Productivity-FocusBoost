"use client";

import React from "react";
import { useProductivityStore } from "@/store/useProductivityStore";
import { Award, Trophy, Flame, Sparkles, CheckSquare, Zap, Clock, ShieldAlert } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function GamifiedProfile() {
  const { userName, level, xp, streak, achievements, tasks, timerHistory } = useProductivityStore();

  const levelXPNeeded = Math.pow(level, 2) * 100;
  const currentLevelXPStart = Math.pow(level - 1, 2) * 100;
  const xpInCurrentLevel = xp - currentLevelXPStart;
  const xpNeededForNextLevel = levelXPNeeded - currentLevelXPStart;
  const levelPercentage = Math.min(100, Math.max(0, (xpInCurrentLevel / xpNeededForNextLevel) * 100));

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === "done").length;

  const totalFocusSessions = timerHistory.filter((s) => s.mode === "focus").length;
  const totalFocusHrs = timerHistory.filter((s) => s.mode === "focus").reduce((acc, curr) => acc + curr.duration / 3600, 0);

  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <div className="flex flex-col gap-6 select-none relative h-full">
      {/* Header controls controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white">Gamification Profile</h2>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            Your attention RPG accomplishments. Earn XP by tracking habits and completing focus sessions.
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl text-xs font-bold text-[var(--accent)]">
          <Award size={14} />
          <span>{unlockedCount} / {achievements.length} Badges Unlocked</span>
        </div>
      </div>

      {/* Main Split: Level progression cards vs Badge grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: XP Level progressing card & summaries */}
        <div className="flex flex-col gap-6">
          {/* Level Progress capsule */}
          <div className="glass-panel p-6 rounded-2xl border border-white/5 flex flex-col items-center justify-center text-center relative overflow-hidden bg-black/10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--card-glow),transparent_65%)] pointer-events-none" />
            
            <div className="w-16 h-16 rounded-full bg-accent-gradient flex items-center justify-center border border-white/20 shadow-xl border-accent-glow text-white font-black text-xl mb-4 animate-float z-10">
              {level}
            </div>

            <span className="text-sm font-black text-white z-10">{userName}</span>
            <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--text-muted)] mt-0.5 z-10">Elite Focus Catalyst</span>

            {/* Progress Bar */}
            <div className="w-full mt-6 z-10 text-left">
              <div className="flex justify-between text-[10px] text-[var(--text-muted)] font-mono mb-1.5">
                <span>XP Progress</span>
                <span>{Math.round(xpInCurrentLevel)} / {xpNeededForNextLevel} XP</span>
              </div>
              <div className="w-full h-2 bg-white/5 border border-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-accent-gradient transition-all duration-500"
                  style={{ width: `${levelPercentage}%` }}
                />
              </div>
              <span className="text-[9px] text-[var(--text-muted)] mt-2 block text-center">
                Earn {Math.round(xpNeededForNextLevel - xpInCurrentLevel)} more XP to reach Level {level + 1}!
              </span>
            </div>
          </div>

          {/* Productivity metrics breakdown summary */}
          <div className="glass-panel p-5 rounded-2xl border border-white/5 flex flex-col gap-3.5 bg-black/10">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--text-muted)] border-b border-white/5 pb-2">
              Backlog Overview
            </span>

            <div className="flex items-center justify-between text-xs">
              <span className="text-[var(--text-muted)] flex items-center gap-1.5">
                <CheckSquare size={14} className="text-purple-400" />
                <span>Completed Tasks</span>
              </span>
              <span className="font-bold text-white">{completedTasks} / {totalTasks}</span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-[var(--text-muted)] flex items-center gap-1.5">
                <Clock size={14} className="text-sky-400" />
                <span>Deep Focus Time</span>
              </span>
              <span className="font-bold text-white">{totalFocusHrs.toFixed(1)} hrs</span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-[var(--text-muted)] flex items-center gap-1.5">
                <Flame size={14} className="text-orange-400" />
                <span>Productivity Streak</span>
              </span>
              <span className="font-bold text-orange-400 flex items-center gap-0.5">
                <Zap size={11} className="fill-orange-400 animate-pulse" />
                {streak} days
              </span>
            </div>
          </div>
        </div>

        {/* Right 2 Cols: Badges & Achievements Grid */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-white/5 flex flex-col gap-4 bg-black/10 h-full">
          <span className="text-xs uppercase font-bold tracking-widest text-[var(--text-muted)] border-b border-white/5 pb-3 flex items-center gap-1.5">
            <Trophy size={14} className="text-yellow-400" />
            <span>Unlocked Milestone Accomplishments</span>
          </span>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 overflow-y-auto no-scrollbar max-h-[420px]">
            {achievements.map((ach) => (
              <div
                key={ach.id}
                className={cn(
                  "p-4 rounded-xl border flex items-center gap-4 transition-all relative overflow-hidden",
                  ach.unlocked
                    ? "bg-white/5 border-purple-500/25 hover:bg-white/10"
                    : "bg-white/2 border-transparent opacity-45 grayscale select-none"
                )}
              >
                {/* Glowing glow effect on unlocked badges */}
                {ach.unlocked && (
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--card-glow),transparent_75%)] pointer-events-none" />
                )}

                <div className="w-11 h-11 rounded-lg bg-black/30 border border-white/5 flex items-center justify-center text-xl shrink-0 z-10">
                  {ach.icon}
                </div>

                <div className="flex flex-col gap-0.5 z-10 text-left">
                  <span className="text-xs font-bold text-white">{ach.title}</span>
                  <span className="text-[10px] text-[var(--text-muted)] leading-normal max-w-[200px]">{ach.description}</span>
                  {ach.unlocked && ach.unlockedAt && (
                    <span className="text-[8px] text-[var(--accent)] font-mono uppercase tracking-wider font-bold mt-1">
                      Unlocked {ach.unlockedAt}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
