"use client";

import React, { useEffect, useState } from "react";
import Sidebar from "@/components/sidebar";
import { useProductivityStore } from "@/store/useProductivityStore";
import { Sparkles, Trophy, Plus, Settings, Compass, Search, Calendar, CheckSquare, Bell } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { userName, level, xp, isDeepFocus, addTask } = useProductivityStore();
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState<"low" | "medium" | "high">("medium");

  const levelXPNeeded = Math.pow(level, 2) * 100;
  const currentLevelXPStart = Math.pow(level - 1, 2) * 100;
  const xpInCurrentLevel = xp - currentLevelXPStart;
  const xpNeededForNextLevel = levelXPNeeded - currentLevelXPStart;
  const levelPercentage = Math.min(100, Math.max(0, (xpInCurrentLevel / xpNeededForNextLevel) * 100));

  const handleQuickAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    addTask({
      title: newTaskTitle,
      description: "Quick created task from dashboard header",
      status: "inbox",
      priority: newTaskPriority,
      dueDate: new Date().toISOString().split("T")[0],
      tags: ["Quick-Add"],
      subtasks: [],
      recurrence: "none"
    });

    setNewTaskTitle("");
    setNewTaskPriority("medium");
    setQuickAddOpen(false);
    
    // Dispatch small custom notification or sound? 
    alert("New task added to Inbox!");
  };

  // If in deep focus mode, hide the sidebar and header completely to maintain absolute distraction-free focus!
  if (isDeepFocus) {
    return (
      <main className="flex-1 w-full h-screen overflow-hidden bg-[#05030d] relative select-none">
        {children}
      </main>
    );
  }

  return (
    <div className="flex w-full h-screen overflow-hidden relative">
      {/* Dynamic collapsing sidebar */}
      <Sidebar />

      {/* Main Container */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-[var(--background)]">
        {/* Top Header Dashboard Dashboard */}
        <header className="h-16 border-b border-white/5 bg-black/10 backdrop-blur-md px-6 flex items-center justify-between shrink-0 select-none z-20">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
              AntiGravity OS
            </span>
            <span className="text-white/10 text-xs">/</span>
            <div className="flex items-center gap-1.5 text-xs text-white bg-white/5 border border-white/10 px-2 py-0.5 rounded-full">
              <Sparkles size={11} className="text-[var(--accent)]" />
              <span>Workspace Active</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* XP Level Counter Capsule */}
            <div 
              onClick={() => router.push("/dashboard/profile")}
              className="flex items-center gap-2.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer text-xs"
            >
              <Trophy size={13} className="text-yellow-400" />
              <span className="font-bold text-white">Lvl {level}</span>
              <div className="w-16 h-1 bg-white/10 rounded-full overflow-hidden hidden sm:block">
                <div 
                  className="h-full bg-accent-gradient"
                  style={{ width: `${levelPercentage}%` }}
                />
              </div>
              <span className="text-[10px] font-mono text-[var(--text-muted)] hidden sm:inline">
                {Math.round(xpInCurrentLevel)}/{xpNeededForNextLevel} XP
              </span>
            </div>

            {/* Quick Add Button */}
            <button
              onClick={() => setQuickAddOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-accent-gradient hover:opacity-90 transition-opacity text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer border border-white/5 shadow-md"
            >
              <Plus size={14} />
              <span className="hidden sm:inline">Quick Add</span>
            </button>

            {/* Visual notification bell placeholder */}
            <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-[var(--text-muted)] hover:text-white transition-colors cursor-pointer relative">
              <Bell size={14} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-pulse" />
            </button>
          </div>
        </header>

        {/* Dynamic page frame */}
        <main className="flex-1 overflow-y-auto no-scrollbar relative p-6">
          {children}
        </main>
      </div>

      {/* Quick Add Modal */}
      <AnimatePresence>
        {quickAddOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setQuickAddOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-sm glass-panel p-5 rounded-2xl border border-white/10 bg-black/50 shadow-2xl flex flex-col gap-4 text-left"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-white">Create Quick Task</span>
                <button
                  onClick={() => setQuickAddOpen(false)}
                  className="text-xs text-[var(--text-muted)] hover:text-white cursor-pointer"
                >
                  Close
                </button>
              </div>

              <form onSubmit={handleQuickAddSubmit} className="flex flex-col gap-3.5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider font-bold">Task Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter title (e.g. Schedule design reviews)..."
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[var(--accent)] transition-colors"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider font-bold">Priority Level</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(["low", "medium", "high"] as const).map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setNewTaskPriority(p)}
                        className={`py-1.5 rounded-lg text-xs font-semibold capitalize cursor-pointer border transition-all ${
                          newTaskPriority === p
                            ? "bg-accent-gradient text-white border-white/10"
                            : "bg-white/5 text-[var(--text-muted)] border-transparent hover:bg-white/10"
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2 bg-accent-gradient text-white rounded-xl text-xs font-bold border border-white/10 shadow-lg shadow-purple-500/10 hover:opacity-90 active:scale-98 transition-all cursor-pointer mt-1"
                >
                  Create Inbox Task (+50 XP)
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
