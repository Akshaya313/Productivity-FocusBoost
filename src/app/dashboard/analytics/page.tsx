"use client";

import React, { useEffect, useState } from "react";
import { useProductivityStore } from "@/store/useProductivityStore";
import { BarChart, Bar, AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Sparkles, Calendar, TrendingUp, Award, Clock, CheckSquare, Zap, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock datasets for analytics showcase
const WEEKLY_DISTRIBUTION = [
  { name: "Mon", focus: 150, break: 30 },
  { name: "Tue", focus: 220, break: 45 },
  { name: "Wed", focus: 180, break: 35 },
  { name: "Thu", focus: 260, break: 50 },
  { name: "Fri", focus: 210, break: 40 },
  { name: "Sat", focus: 90, break: 20 },
  { name: "Sun", focus: 120, break: 25 }
];

const PEAK_HOURS = [
  { hour: "08 AM", sessions: 2 },
  { hour: "10 AM", sessions: 5 },
  { hour: "12 PM", sessions: 3 },
  { hour: "02 PM", sessions: 4 },
  { hour: "04 PM", sessions: 6 },
  { hour: "06 PM", sessions: 2 },
  { hour: "08 PM", sessions: 1 }
];

export default function InteractiveAnalytics() {
  const { timerHistory, tasks, habits } = useProductivityStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Calculate high-fidelity metrics
  const totalFocusSessions = timerHistory.filter((s) => s.mode === "focus").length;
  const totalFocusMinutes = timerHistory
    .filter((s) => s.mode === "focus")
    .reduce((acc, curr) => acc + curr.duration / 60, 0);

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === "done").length;
  const taskRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const todayStr = new Date().toISOString().split("T")[0];
  const totalHabitCompletions = habits.reduce((acc, curr) => acc + curr.completedDays.length, 0);

  // Focus Heatmap contribution grid mapping (last 14 days)
  const getHeatmapGrid = () => {
    const grid = [];
    const today = new Date();
    for (let i = 13; i >= 0; i--) {
      const date = new Date(today.getTime() - i * 86400000);
      const dateStr = date.toISOString().split("T")[0];
      const count = timerHistory.filter((s) => s.timestamp.split("T")[0] === dateStr).length;
      grid.push({ dateStr, count, label: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }) });
    }
    return grid;
  };

  const heatmap = getHeatmapGrid();

  if (!mounted) {
    return <div className="text-center text-xs text-[var(--text-muted)] py-12">Loading visual analytics data...</div>;
  }

  return (
    <div className="flex flex-col gap-6 select-none relative h-full">
      {/* Header controls controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white">Visual Analytics Dashboard</h2>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            Understand your focus rhythms. Discover peaks, tracks streaks, and measure flow rates.
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-white bg-white/5 border border-white/10 px-3 py-1 rounded-xl">
          <Activity size={14} className="text-[var(--accent)] animate-pulse" />
          <span className="font-bold">Realtime Insights Active</span>
        </div>
      </div>

      {/* Metrics Row Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="glass-panel p-4 rounded-xl border border-white/5 flex flex-col gap-1 text-left">
          <span className="text-[10px] uppercase font-bold tracking-wider text-[var(--text-muted)]">Total Focused Hours</span>
          <span className="text-xl font-black text-white">{(totalFocusMinutes / 60).toFixed(1)} hrs</span>
          <span className="text-[9px] text-emerald-400 mt-1 flex items-center gap-0.5">
            <TrendingUp size={10} />
            <span>+12.4% vs last week</span>
          </span>
        </div>
        
        {/* Metric 2 */}
        <div className="glass-panel p-4 rounded-xl border border-white/5 flex flex-col gap-1 text-left">
          <span className="text-[10px] uppercase font-bold tracking-wider text-[var(--text-muted)]">Attention Blocks</span>
          <span className="text-xl font-black text-white">{totalFocusSessions} intervals</span>
          <span className="text-[9px] text-[var(--text-muted)] mt-1">Average 25-min durations</span>
        </div>

        {/* Metric 3 */}
        <div className="glass-panel p-4 rounded-xl border border-white/5 flex flex-col gap-1 text-left">
          <span className="text-[10px] uppercase font-bold tracking-wider text-[var(--text-muted)]">Task Clearance Rate</span>
          <span className="text-xl font-black text-white">{taskRate}%</span>
          <span className="text-[9px] text-emerald-400 mt-1 flex items-center gap-0.5">
            <TrendingUp size={10} />
            <span>{completedTasks} tasks archived</span>
          </span>
        </div>

        {/* Metric 4 */}
        <div className="glass-panel p-4 rounded-xl border border-white/5 flex flex-col gap-1 text-left">
          <span className="text-[10px] uppercase font-bold tracking-wider text-[var(--text-muted)]">Habit Compliance</span>
          <span className="text-xl font-black text-white">{totalHabitCompletions} logs</span>
          <span className="text-[9px] text-[var(--text-muted)] mt-1">Streaks maintained daily</span>
        </div>
      </div>

      {/* Main charts split block */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Area Chart & Peak Hours */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* Curved Area Chart: Weekly focus times */}
          <div className="glass-panel p-5 rounded-2xl border border-white/5 h-80 flex flex-col bg-black/10">
            <h3 className="text-xs uppercase font-bold tracking-widest text-[var(--text-muted)] mb-4 flex items-center gap-1.5">
              <TrendingUp size={14} className="text-[var(--accent)]" />
              <span>Weekly Focus Distribution (min)</span>
            </h3>

            <div className="flex-1 w-full h-full text-xs">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={WEEKLY_DISTRIBUTION} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorFocus" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="var(--accent)" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorBreak" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="5%" stopColor="var(--accent-secondary)" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="var(--accent-secondary)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={10} tickLine={false} />
                  <YAxis stroke="var(--text-muted)" fontSize={10} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      background: "rgba(10, 8, 20, 0.95)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      borderRadius: "8px",
                      fontSize: "11px",
                      color: "white"
                    }}
                  />
                  <Area type="monotone" dataKey="focus" stroke="var(--accent)" strokeWidth={2.5} fillOpacity={1} fill="url(#colorFocus)" name="Focus Min" />
                  <Area type="monotone" dataKey="break" stroke="var(--accent-secondary)" strokeWidth={2} fillOpacity={1} fill="url(#colorBreak)" name="Break Min" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Peak Productive Hours: Bar chart */}
          <div className="glass-panel p-5 rounded-2xl border border-white/5 h-64 flex flex-col bg-black/10">
            <h3 className="text-xs uppercase font-bold tracking-widest text-[var(--text-muted)] mb-4 flex items-center gap-1.5">
              <Clock size={14} className="text-[var(--accent)]" />
              <span>Peak Focus Intervals by Time Slots</span>
            </h3>

            <div className="flex-1 w-full h-full text-xs">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={PEAK_HOURS} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="hour" stroke="var(--text-muted)" fontSize={10} tickLine={false} />
                  <YAxis stroke="var(--text-muted)" fontSize={10} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      background: "rgba(10, 8, 20, 0.95)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      borderRadius: "8px",
                      fontSize: "11px",
                      color: "white"
                    }}
                  />
                  <Bar dataKey="sessions" radius={[4, 4, 0, 0]} name="Sessions">
                    {PEAK_HOURS.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 4 ? "var(--accent)" : "rgba(255, 255, 255, 0.15)"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Github-style heatmaps density map */}
        <div className="glass-panel p-5 rounded-2xl border border-white/5 flex flex-col gap-5 bg-black/10 h-full">
          <h3 className="text-xs uppercase font-bold tracking-widest text-[var(--text-muted)] flex items-center gap-1.5">
            <Calendar size={14} className="text-[var(--accent)]" />
            <span>Focus Activity Heatmap</span>
          </h3>
          <p className="text-[10px] text-[var(--text-muted)] leading-relaxed">
            Inspection matrix of focus completions completed over the last 14 days. Darker shades indicate heavy concentration slots.
          </p>

          {/* Density Heatmap Grid */}
          <div className="grid grid-cols-7 gap-2 my-2 text-center">
            {heatmap.map((cell, idx) => {
              // density shade colors
              let shade = "bg-white/5 border border-white/5 text-[var(--text-muted)]";
              if (cell.count === 1) shade = "bg-purple-950/40 border border-purple-500/25 text-purple-300";
              else if (cell.count === 2) shade = "bg-purple-800/40 border border-purple-500/45 text-purple-200";
              else if (cell.count >= 3) shade = "bg-accent-gradient border border-white/10 text-white shadow shadow-purple-500/10";
              
              return (
                <div
                  key={idx}
                  className={cn(
                    "aspect-square rounded-lg flex flex-col items-center justify-center text-[10px] font-bold cursor-help group transition-all relative",
                    shade
                  )}
                  title={`${cell.count} focus sessions completed on ${cell.label}`}
                >
                  <span>{cell.label.split(" ")[1]}</span>
                  
                  {/* Hover tooltip overlay */}
                  <div className="absolute bottom-8 scale-0 group-hover:scale-100 px-2 py-1 bg-black text-white text-[8px] font-bold rounded border border-white/10 shadow whitespace-nowrap pointer-events-none transition-transform z-10">
                    {cell.count} sessions ({cell.label})
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-[8px] uppercase font-bold text-[var(--text-muted)] px-1 border-t border-white/5 pt-3 mt-1 select-none">
            <span>Low Intensity</span>
            <div className="flex gap-1 items-center">
              <span className="w-2.5 h-2.5 rounded bg-white/5 border border-white/5" />
              <span className="w-2.5 h-2.5 rounded bg-purple-950/40 border border-purple-500/25" />
              <span className="w-2.5 h-2.5 rounded bg-purple-800/40 border border-purple-500/45" />
              <span className="w-2.5 h-2.5 rounded bg-accent-gradient" />
            </div>
            <span>High Flow</span>
          </div>
        </div>
      </div>
    </div>
  );
}
