"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useProductivityStore } from "@/store/useProductivityStore";
import {
  Compass,
  CheckSquare,
  Timer,
  BarChart2,
  FileText,
  Calendar,
  User,
  Settings,
  Menu,
  ChevronLeft,
  ChevronRight,
  Flame,
  Award,
  Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import AmbientSoundPlayer from "./ambient-sound";

export default function Sidebar() {
  const pathname = usePathname();
  const { userName, level, xp, streak, tasks, timerHistory } = useProductivityStore();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { name: "Dashboard", href: "/dashboard", icon: <Compass size={18} /> },
    { name: "Focus Timer", href: "/dashboard/timer", icon: <Timer size={18} /> },
    { name: "Smart Tasks", href: "/dashboard/tasks", icon: <CheckSquare size={18} /> },
    { name: "Brain Notes", href: "/dashboard/notes", icon: <FileText size={18} /> },
    { name: "Calendar", href: "/dashboard/calendar", icon: <Calendar size={18} /> },
    { name: "Analytics", href: "/dashboard/analytics", icon: <BarChart2 size={18} /> },
    { name: "Profile", href: "/dashboard/profile", icon: <User size={18} /> },
    { name: "Settings", href: "/dashboard/settings", icon: <Settings size={18} /> }
  ];

  const levelXPNeeded = Math.pow(level, 2) * 100;
  const currentLevelXPStart = Math.pow(level - 1, 2) * 100;
  const xpInCurrentLevel = xp - currentLevelXPStart;
  const xpNeededForNextLevel = levelXPNeeded - currentLevelXPStart;
  const levelPercentage = Math.min(100, Math.max(0, (xpInCurrentLevel / xpNeededForNextLevel) * 100));

  const activeTasksCount = tasks.filter((t) => t.status !== "done").length;

  return (
    <motion.aside
      animate={{ width: isCollapsed ? 76 : 260 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="h-screen sticky top-0 flex flex-col border-r border-white/5 bg-black/25 backdrop-blur-xl shrink-0 z-30 select-none overflow-hidden"
    >
      {/* Brand Header Header */}
      <div className="p-5 flex items-center justify-between border-b border-white/5 h-16 shrink-0">
        <Link href="/" className="flex items-center gap-2.5 overflow-hidden">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="w-7 h-7 rounded-lg bg-accent-gradient flex items-center justify-center text-white font-black text-sm border border-white/20 border-accent-glow"
          >
            A
          </motion.div>
          {!isCollapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="font-bold text-sm tracking-widest text-gradient"
            >
              ANTIGRAVITY
            </motion.span>
          )}
        </Link>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[var(--text-muted)] hover:text-white transition-colors cursor-pointer"
        >
          {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      {/* Navigation List List */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto no-scrollbar">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.name} href={item.href}>
              <div
                className={cn(
                  "flex items-center gap-3.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group relative cursor-pointer",
                  isActive
                    ? "bg-accent-gradient text-white shadow-lg border border-white/5"
                    : "text-[var(--text-muted)] hover:bg-white/5 hover:text-white"
                )}
              >
                <span className={cn("shrink-0", isActive ? "text-white" : "text-[var(--accent)] group-hover:scale-110 transition-transform")}>
                  {item.icon}
                </span>
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="truncate"
                  >
                    {item.name}
                  </motion.span>
                )}

                {/* Task counter notification badge */}
                {item.name === "Smart Tasks" && activeTasksCount > 0 && !isCollapsed && (
                  <span className="ml-auto px-2 py-0.5 rounded-full text-[10px] bg-white/10 border border-white/5 font-semibold text-white">
                    {activeTasksCount}
                  </span>
                )}

                {/* Tooltip on hover when collapsed */}
                {isCollapsed && (
                  <div className="absolute left-16 px-2.5 py-1.5 rounded bg-black/90 border border-white/10 text-white text-[11px] font-medium hidden group-hover:block whitespace-nowrap shadow-2xl z-50">
                    {item.name}
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Ambient Audio Widget integrated in sidebar bottom */}
      {!isCollapsed && (
        <div className="px-4 py-3 border-t border-white/5 shrink-0">
          <AmbientSoundPlayer />
        </div>
      )}

      {/* User profile details at the absolute bottom */}
      <div className="p-4 border-t border-white/5 shrink-0 bg-black/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-accent-gradient flex items-center justify-center text-white border border-white/10 border-accent-glow font-bold text-xs shrink-0 select-none">
            {userName.slice(0, 2).toUpperCase()}
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="truncate text-white">{userName}</span>
                <span className="text-[var(--accent)] shrink-0 flex items-center gap-0.5">
                  <Flame size={12} className="fill-[var(--accent)] text-orange-500 animate-pulse" />
                  {streak}d
                </span>
              </div>
              
              {/* Level XP Progress details */}
              <div className="mt-1">
                <div className="flex items-center justify-between text-[9px] text-[var(--text-muted)] font-mono">
                  <span>Lvl {level}</span>
                  <span>{Math.round(xpInCurrentLevel)} / {xpNeededForNextLevel} XP</span>
                </div>
                <div className="w-full h-1 bg-white/5 rounded-full mt-0.5 overflow-hidden border border-white/5">
                  <div
                    className="h-full bg-accent-gradient transition-all duration-300"
                    style={{ width: `${levelPercentage}%` }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.aside>
  );
}
