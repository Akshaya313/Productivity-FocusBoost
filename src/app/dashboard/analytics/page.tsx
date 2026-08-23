"use client";

import React, { useEffect, useState } from "react";
import { useProductivityStore } from "@/store/useProductivityStore";
import { BarChart, Bar, AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Sparkles, Calendar, TrendingUp, Award, Clock, CheckSquare, Zap, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

export default function InteractiveAnalytics() {
  const { timerHistory, tasks, habits, xp, level, streak } = useProductivityStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Calculate high-fidelity metrics from actual user store data
  const focusSessions = timerHistory.filter((s) => s.mode === "focus");
  const totalFocusSessions = focusSessions.length;
  const totalFocusMinutes = focusSessions.reduce((acc, curr) => acc + curr.duration / 60, 0);

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === "done").length;
  const taskRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const totalHabitCompletions = habits.reduce((acc, curr) => acc + curr.completedDays.length, 0);

  // Compute actual weekly focus distribution (Mon-Sun) from timerHistory
  const computeWeeklyDistribution = () => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const result = days.map((day) => ({ name: day, focus: 0, break: 0 }));

    const now = new Date();
    const currentDay = now.getDay(); // 0 is Sun
    const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay;
    const mondayDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + mondayOffset);

    timerHistory.forEach((s) => {
      if (!s.timestamp) return;
      const sDate = new Date(s.timestamp);
      const diffDays = Math.floor((sDate.getTime() - mondayDate.getTime()) / (86400000));
      if (diffDays >= 0 && diffDays < 7) {
        const index = (sDate.getDay() + 6) % 7; // Convert Sun-Sat (0-6) to Mon-Sun (0-6)
        const mins = Math.round(s.duration / 60);
        if (s.mode === "focus") {
          result[index].focus += mins;
        } else {
          result[index].break += mins;
        }
      }
    });

    return result;
  };

  // Compute actual peak focus hours from timerHistory
  const computePeakHours = () => {
    const slots = [
      { label: "08 AM", start: 7, end: 9 },
      { label: "10 AM", start: 9, end: 11 },
      { label: "12 PM", start: 11, end: 13 },
      { label: "02 PM", start: 13, end: 15 },
      { label: "04 PM", start: 15, end: 17 },
      { label: "06 PM", start: 17, end: 19 },
      { label: "08 PM", start: 19, end: 21 },
    ];

    const counts: Record<string, number> = {};
    slots.forEach((s) => (counts[s.label] = 0));

    focusSessions.forEach((s) => {
      if (!s.timestamp) return;
      const hour = new Date(s.timestamp).getHours();
      const matched = slots.find((slot) => hour >= slot.start && hour < slot.end);
      if (matched) {
        counts[matched.label] += 1;
      }
    });

    return slots.map((s) => ({ hour: s.label, sessions: counts[s.label] }));
  };

  const weeklyData = computeWeeklyDistribution();
  const peakData = computePeakHours();

  // Focus Heatmap contribution grid mapping (last 14 days)
  const getHeatmapGrid = () => {
    const grid = [];
    const today = new Date();
    for (let i = 13; i >= 0; i--) {
      const date = new Date(today.getTime() - i * 86400000);
      const dateStr = date.toISOString().split("T")[0];
      const count = timerHistory.filter((s) => s.timestamp && s.timestamp.split("T")[0] === dateStr).length;
      grid.push({ dateStr, count, label: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }) });
    }
    return grid;
  };

  const heatmap = getHeatmapGrid();

  if (!mounted) {
    return <div className="text-center text-xs text-[var(--text-muted)] py-12">Loading visual analytics data...</div>;
  }

  // Find index of maximum peak hour for highlighted bar
  const maxPeakSessions = Math.max(...peakData.map((p) => p.sessions), 1);

  return (
    <div className="flex flex-col gap-6 select-none relative h-full">
      {/* Header controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <span>Visual Analytics Dashboard</span>
            <Sparkles size={18} className="text-purple-400" />
          </h2>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            Realtime metrics calculated live from your actual tasks, focus sessions, habits, and level progress.
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-white bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl">
          <Activity size={14} className="text-emerald-400 animate-pulse" />
          <span className="font-bold text-emerald-400">Live Data Active</span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="glass-panel p-4 rounded-xl border border-white/5 flex flex-col gap-1 text-left">
          <span className="text-[10px] uppercase font-bold tracking-wider text-[var(--text-muted)]">Total Focused Time</span>
          <span className="text-xl font-black text-white">{(totalFocusMinutes / 60).toFixed(1)} hrs</span>
          <span className="text-[9px] text-[var(--accent)] mt-1 font-mono">
            {totalFocusMinutes} total focus minutes
          </span>
        </div>
        
        {/* Metric 2 */}
        <div className="glass-panel p-4 rounded-xl border border-white/5 flex flex-col gap-1 text-left">
          <span className="text-[10px] uppercase font-bold tracking-wider text-[var(--text-muted)]">Focus Sessions</span>
          <span className="text-xl font-black text-white">{totalFocusSessions} completed</span>
          <span className="text-[9px] text-[var(--text-muted)] mt-1">Pomodoro intervals</span>
        </div>

        {/* Metric 3 */}
        <div className="glass-panel p-4 rounded-xl border border-white/5 flex flex-col gap-1 text-left">
          <span className="text-[10px] uppercase font-bold tracking-wider text-[var(--text-muted)]">Task Clearance Rate</span>
          <span className="text-xl font-black text-white">{taskRate}%</span>
          <span className="text-[9px] text-emerald-400 mt-1 flex items-center gap-0.5">
            <TrendingUp size={10} />
            <span>{completedTasks} / {totalTasks} tasks done</span>
          </span>
        </div>

        {/* Metric 4 */}
        <div className="glass-panel p-4 rounded-xl border border-white/5 flex flex-col gap-1 text-left">
          <span className="text-[10px] uppercase font-bold tracking-wider text-[var(--text-muted)]">Habits Logged</span>
          <span className="text-xl font-black text-white">{totalHabitCompletions} logs</span>
          <span className="text-[9px] text-orange-400 mt-1 flex items-center gap-0.5 font-bold">
            <Zap size={10} />
            <span>{streak}-day streak</span>
          </span>
        </div>
      </div>

      {/* Main charts split block */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Area Chart & Peak Hours */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* Curved Area Chart: Weekly focus times */}
          <div className="glass-panel p-5 rounded-2xl border border-white/5 h-80 flex flex-col bg-black/10">
            <h3 className="text-xs uppercase font-bold tracking-widest text-[var(--text-muted)] mb-4 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <TrendingUp size={14} className="text-[var(--accent)]" />
                <span>Weekly Focus Distribution (min)</span>
              </span>
              <span className="text-[9px] font-mono text-emerald-400 font-bold">Actual Weekly Data</span>
            </h3>

            <div className="flex-1 w-full h-full text-xs">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
            <h3 className="text-xs uppercase font-bold tracking-widest text-[var(--text-muted)] mb-4 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Clock size={14} className="text-[var(--accent)]" />
                <span>Peak Focus Intervals by Time Slots</span>
              </span>
              <span className="text-[9px] font-mono text-[var(--text-muted)] font-bold">{totalFocusSessions} Total Sessions</span>
            </h3>

            <div className="flex-1 w-full h-full text-xs">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={peakData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
                    {peakData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.sessions === maxPeakSessions && entry.sessions > 0 ? "var(--accent)" : "rgba(255, 255, 255, 0.15)"}
                      />
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
            Live matrix of focus session completions over the last 14 days.
          </p>

          {/* Density Heatmap Grid */}
          <div className="grid grid-cols-7 gap-2 my-2 text-center">
            {heatmap.map((cell, idx) => {
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
