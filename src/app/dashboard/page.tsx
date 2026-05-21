"use client";

import React, { useEffect, useState } from "react";
import { useProductivityStore } from "@/store/useProductivityStore";
import {
  Sparkles,
  Flame,
  CheckCircle,
  Timer,
  AlertCircle,
  FileText,
  Calendar,
  Trophy,
  ArrowRight,
  Plus
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import AnimatedCheckbox from "@/components/animated-checkbox";

export default function FocusDashboard() {
  const {
    userName,
    streak,
    level,
    xp,
    tasks,
    habits,
    toggleHabit,
    weeklyGoals,
    toggleWeeklyGoal,
    timerMode,
    duration,
    isRunning,
    timerHistory,
    notes,
    addWeeklyGoal
  } = useProductivityStore();

  const [greeting, setGreeting] = useState("Hello");
  const [newGoalTitle, setNewGoalTitle] = useState("");
  const [goalOpen, setGoalOpen] = useState(false);

  // Calculate dynamic greeting based on hour
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === "done").length;
  const activeTasks = tasks.filter((t) => t.status !== "done");
  const taskCompletionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const todayStr = new Date().toISOString().split("T")[0];
  const habitsCompletedTodayCount = habits.filter((h) => h.completedDays.includes(todayStr)).length;
  const habitCompletionPercentage = habits.length > 0 ? Math.round((habitsCompletedTodayCount / habits.length) * 100) : 0;

  // focus score: weight tasks (40%), habits (40%), and pomodoro (20%)
  const dailyFocusSessionsCompleted = timerHistory.filter(
    (s) => s.mode === "focus" && s.timestamp.split("T")[0] === todayStr
  ).length;

  const focusScore = Math.min(
    100,
    Math.round(
      (taskCompletionRate * 0.4) +
      (habitCompletionPercentage * 0.4) +
      (Math.min(4, dailyFocusSessionsCompleted) * 25 * 0.2)
    )
  );

  const formatCountdown = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins}:${s.toString().padStart(2, "0")}`;
  };

  const handleWeeklyGoalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoalTitle.trim()) return;
    addWeeklyGoal(newGoalTitle);
    setNewGoalTitle("");
    setGoalOpen(false);
  };

  return (
    <div className="flex flex-col gap-6 select-none">
      {/* Dynamic Greetings & Motivational Quote */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <span>{greeting}, {userName}</span>
            <motion.span
              animate={{ rotate: [0, 15, -10, 15, 0] }}
              transition={{ repeat: Infinity, duration: 2.5, repeatDelay: 3 }}
              className="origin-bottom-right inline-block text-lg"
            >
              👋
            </motion.span>
          </h2>
          <p className="text-xs text-[var(--text-muted)] mt-1 flex items-center gap-1.5">
            <Sparkles size={12} className="text-amber-400" />
            <span>&ldquo;The best way to predict the future is to create it.&rdquo; — Defy gravity.</span>
          </p>
        </div>

        {/* Quick streak banner */}
        <div className="flex items-center gap-4 bg-white/5 border border-white/5 px-4 py-2.5 rounded-xl text-xs font-semibold shadow-inner">
          <div className="flex items-center gap-1.5 text-orange-500">
            <Flame size={16} className="fill-orange-500 animate-pulse" />
            <span>{streak} Day Streak</span>
          </div>
          <span className="text-white/10">|</span>
          <div className="flex items-center gap-1.5 text-[var(--accent)]">
            <Trophy size={16} />
            <span>Level {level}</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Focus Score Circle + Overview Widget Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Core Daily Focus Score Progress Ring Card */}
        <div className="glass-panel p-6 rounded-2xl border border-white/5 flex flex-col items-center justify-center text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--card-glow),transparent_65%)] pointer-events-none" />
          <h3 className="text-xs uppercase font-bold tracking-widest text-[var(--text-muted)] mb-6 z-10">Daily Focus Index</h3>

          <div className="relative w-40 h-40 flex items-center justify-center mb-4 z-10">
            {/* SVG Progress Circle */}
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="80"
                cy="80"
                r="70"
                className="stroke-white/5"
                strokeWidth="10"
                fill="transparent"
              />
              <motion.circle
                cx="80"
                cy="80"
                r="70"
                className="stroke-accent-gradient"
                strokeWidth="10"
                fill="transparent"
                strokeDasharray={440}
                initial={{ strokeDashoffset: 440 }}
                animate={{ strokeDashoffset: 440 - (440 * focusScore) / 100 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                style={{ stroke: "url(#accentGrad)" }}
              />
              <defs>
                <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="var(--accent)" />
                  <stop offset="100%" stopColor="var(--accent-secondary)" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-3xl font-black text-white">{focusScore}%</span>
              <span className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] font-bold mt-0.5">Flow Index</span>
            </div>
          </div>
          <p className="text-xs text-[var(--text-muted)] leading-relaxed max-w-[200px] z-10">
            Combine Pomodoros, habits, and tasks completion to lift your score.
          </p>
        </div>

        {/* Quick active timer status card */}
        <div className="glass-panel p-6 rounded-2xl border border-white/5 flex flex-col justify-between relative">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <span className="text-xs uppercase font-bold tracking-widest text-[var(--text-muted)]">Active Timer</span>
            <div className={`px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${
              timerMode === "focus" ? "bg-purple-500/15 text-purple-300" : "bg-emerald-500/15 text-emerald-300"
            }`}>
              {timerMode.replace("_", " ")}
            </div>
          </div>

          <div className="py-6 flex flex-col items-center justify-center text-center">
            <span className="text-4xl font-black font-mono text-white tracking-widest leading-none">
              {formatCountdown(duration)}
            </span>
            <span className="text-[10px] text-[var(--text-muted)] font-mono uppercase tracking-wider mt-2.5">
              {isRunning ? "Interval active — Keep focused" : "Timer paused"}
            </span>
          </div>

          <Link href="/dashboard/timer" className="w-full">
            <div className="w-full py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-semibold text-white flex items-center justify-center gap-1.5 cursor-pointer transition-colors">
              <Timer size={14} className="text-[var(--accent)]" />
              <span>Configure Timer Environment</span>
            </div>
          </Link>
        </div>

        {/* Tasks progress widget card */}
        <div className="glass-panel p-6 rounded-2xl border border-white/5 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <span className="text-xs uppercase font-bold tracking-widest text-[var(--text-muted)]">Task Progress</span>
            <span className="text-xs font-bold text-[var(--accent)]">{taskCompletionRate}% Rate</span>
          </div>

          <div className="flex-1 py-4 flex flex-col justify-center gap-4">
            <div>
              <div className="flex justify-between text-xs font-medium mb-1">
                <span className="text-[var(--text-muted)]">Completed Tasks</span>
                <span className="text-white">{completedTasks}/{totalTasks}</span>
              </div>
              <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                <div 
                  className="h-full bg-accent-gradient transition-all duration-300"
                  style={{ width: `${taskCompletionRate}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-center text-xs">
              <div className="p-2.5 bg-white/5 border border-white/5 rounded-xl flex flex-col gap-0.5">
                <span className="text-lg font-bold text-white">
                  {activeTasks.length}
                </span>
                <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider font-bold">Remaining</span>
              </div>
              <div className="p-2.5 bg-white/5 border border-white/5 rounded-xl flex flex-col gap-0.5">
                <span className="text-lg font-bold text-emerald-400">
                  {completedTasks}
                </span>
                <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider font-bold">Done</span>
              </div>
            </div>
          </div>

          <Link href="/dashboard/tasks" className="w-full">
            <div className="w-full py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-semibold text-white flex items-center justify-center gap-1.5 cursor-pointer transition-colors">
              <CheckCircle size={14} className="text-[var(--accent)]" />
              <span>Go to Kanban Boards</span>
            </div>
          </Link>
        </div>
      </div>

      {/* Habits Tracker + Weekly Goals split row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Habits Checklist tracker card */}
        <div className="glass-panel p-5 rounded-2xl border border-white/5 flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 border border-emerald-500/30 animate-pulse" />
              <span className="text-xs uppercase font-bold tracking-widest text-white">Daily Habits & Streaks</span>
            </div>
            <span className="text-xs font-semibold text-[var(--text-muted)] font-mono">
              {habitsCompletedTodayCount}/{habits.length} Done
            </span>
          </div>

          <div className="flex flex-col gap-2.5 max-h-[220px] overflow-y-auto pr-1 no-scrollbar">
            {habits.length > 0 ? (
              habits.map((habit) => {
                const completedToday = habit.completedDays.includes(todayStr);
                return (
                  <div
                    key={habit.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all text-xs font-medium cursor-pointer"
                    onClick={() => toggleHabit(habit.id, todayStr)}
                  >
                    <div className="flex items-center gap-3">
                      <AnimatedCheckbox
                        checked={completedToday}
                        onChange={() => toggleHabit(habit.id, todayStr)}
                        triggerConfetti={true}
                      />
                      <span className={completedToday ? "text-[var(--text-muted)] line-through" : "text-white"}>
                        {habit.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 bg-orange-500/10 text-orange-400 px-2 py-0.5 rounded-full font-bold text-[10px]">
                      <Flame size={12} className="fill-orange-400 animate-bounce" />
                      <span>{habit.streak}d streak</span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center text-xs text-[var(--text-muted)] py-6">
                No habits configured. Create habits in Settings page.
              </div>
            )}
          </div>
        </div>

        {/* Weekly Goals list card */}
        <div className="glass-panel p-5 rounded-2xl border border-white/5 flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-pink-500 border border-pink-500/30 animate-pulse" />
              <span className="text-xs uppercase font-bold tracking-widest text-white">Weekly Goals Checklist</span>
            </div>
            <button
              onClick={() => setGoalOpen(true)}
              className="p-1 rounded bg-white/5 hover:bg-white/10 text-[var(--text-muted)] hover:text-white transition-colors cursor-pointer"
            >
              <Plus size={14} />
            </button>
          </div>

          <div className="flex flex-col gap-2.5 max-h-[220px] overflow-y-auto pr-1 no-scrollbar">
            {weeklyGoals.map((goal) => (
              <div
                key={goal.id}
                className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all text-xs font-medium cursor-pointer"
                onClick={() => toggleWeeklyGoal(goal.id)}
              >
                <AnimatedCheckbox
                  checked={goal.completed}
                  onChange={() => toggleWeeklyGoal(goal.id)}
                  triggerConfetti={true}
                />
                <span className={goal.completed ? "text-[var(--text-muted)] line-through" : "text-white"}>
                  {goal.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Goal Add Modal */}
      {goalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setGoalOpen(false)} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-full max-w-sm glass-panel p-5 rounded-2xl border border-white/10 bg-black/50 shadow-2xl flex flex-col gap-4 text-left"
          >
            <span className="text-sm font-bold text-white">Add Weekly Goal</span>
            <form onSubmit={handleWeeklyGoalSubmit} className="flex flex-col gap-3">
              <input
                type="text"
                required
                placeholder="Enter goal description..."
                value={newGoalTitle}
                onChange={(e) => setNewGoalTitle(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[var(--accent)]"
              />
              <button
                type="submit"
                className="w-full py-2 bg-accent-gradient text-white rounded-xl text-xs font-bold border border-white/10"
              >
                Create Goal (+30 XP)
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
