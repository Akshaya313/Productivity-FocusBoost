"use client";

import React, { useState } from "react";
import { useProductivityStore, Task } from "@/store/useProductivityStore";
import { Calendar as CalendarIcon, Clock, ChevronLeft, ChevronRight, Plus, Sparkles, AlertCircle, MapPin, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface PlannerEvent {
  id: string;
  title: string;
  time: string;
  duration: string;
  type: "focus" | "meeting" | "review";
}

const INITIAL_EVENTS: PlannerEvent[] = [
  { id: "e-1", title: "🌅 Morning Mindful Alignment", time: "09:00 AM", duration: "15 min", type: "review" },
  { id: "e-2", title: "🤿 Deep Core Coding Block", time: "10:00 AM", duration: "90 min", type: "focus" },
  { id: "e-3", title: "🤝 Sync Alignment Sync Session", time: "02:00 PM", duration: "45 min", type: "meeting" },
  { id: "e-4", title: "🔥 Sunset Review Review", time: "05:30 PM", duration: "15 min", type: "review" }
];

export default function IntegratedCalendar() {
  const { tasks, addTask } = useProductivityStore();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<PlannerEvent[]>(INITIAL_EVENTS);
  const [activeDateStr, setActiveDateStr] = useState(new Date().toISOString().split("T")[0]);
  
  // Event creator state
  const [createOpen, setCreateOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newTime, setNewTime] = useState("10:00 AM");
  const [newDur, setNewDur] = useState("30 min");
  const [newType, setNewType] = useState<PlannerEvent["type"]>("focus");

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();
    return { firstDay, totalDays };
  };

  const { firstDay, totalDays } = getDaysInMonth(currentDate);

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const handleEventCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newEvent: PlannerEvent = {
      id: `evt-${Date.now()}`,
      title: newTitle,
      time: newTime,
      duration: newDur,
      type: newType
    };

    setEvents((prev) => [...prev, newEvent]);
    setNewTitle("");
    setCreateOpen(false);
  };

  // Find tasks due on specific active date
  const tasksOnActiveDate = tasks.filter((t) => t.dueDate === activeDateStr);

  return (
    <div className="flex flex-col gap-6 select-none relative h-full">
      {/* Header controls controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <span>Dynamic Calendar Planner</span>
            <Sparkles size={18} className="text-amber-400" />
          </h2>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            Coordinate milestones. Lock in focus periods side-by-side with meetings.
          </p>
        </div>

        <button
          onClick={() => setCreateOpen(true)}
          className="px-3.5 py-2 rounded-xl bg-accent-gradient hover:opacity-90 transition-opacity text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer border border-white/5 shadow-md"
        >
          <Plus size={14} />
          <span>Schedule Block</span>
        </button>
      </div>

      {/* Main Split: Calendar grid vs Daily agenda planner */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Monthly grid calendar */}
        <div className="lg:col-span-2 glass-panel p-5 rounded-2xl border border-white/5 flex flex-col gap-4 h-full bg-black/10">
          
          {/* Calendar top controls */}
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <span className="text-sm font-bold text-white uppercase tracking-wider">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={prevMonth}
                className="p-1 rounded bg-white/5 hover:bg-white/10 text-[var(--text-muted)] hover:text-white cursor-pointer"
              >
                <ChevronLeft size={14} />
              </button>
              <button
                onClick={nextMonth}
                className="p-1 rounded bg-white/5 hover:bg-white/10 text-[var(--text-muted)] hover:text-white cursor-pointer"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>

          {/* Days of week header */}
          <div className="grid grid-cols-7 text-center text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">
            {daysOfWeek.map((day) => (
              <span key={day} className="py-2">{day}</span>
            ))}
          </div>

          {/* Days grid */}
          <div className="grid grid-cols-7 gap-1.5 text-xs text-center flex-1">
            {/* Empty slots before first day */}
            {Array.from({ length: firstDay }).map((_, idx) => (
              <div key={`empty-${idx}`} className="p-3 bg-transparent rounded-lg opacity-0 pointer-events-none" />
            ))}

            {/* Total days of month */}
            {Array.from({ length: totalDays }).map((_, idx) => {
              const dayNum = idx + 1;
              const dateStr = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, "0")}-${dayNum.toString().padStart(2, "0")}`;
              const isToday = new Date().toISOString().split("T")[0] === dateStr;
              const isActive = activeDateStr === dateStr;

              // Check if date has tasks or events scheduled
              const hasTask = tasks.some((t) => t.dueDate === dateStr);
              
              return (
                <div
                  key={`day-${dayNum}`}
                  onClick={() => setActiveDateStr(dateStr)}
                  className={cn(
                    "p-2 rounded-xl flex flex-col items-center justify-between border cursor-pointer select-none transition-all relative aspect-square",
                    isActive 
                      ? "bg-accent-gradient border-white/10 text-white shadow-lg"
                      : isToday
                        ? "bg-white/10 border-[var(--accent)]/40 text-white"
                        : "bg-white/5 border-transparent text-[var(--foreground)] hover:bg-white/10 hover:border-white/5"
                  )}
                >
                  <span className="font-bold text-xs">{dayNum}</span>
                  
                  {/* Indicator bullet dots */}
                  {hasTask && (
                    <span className={cn(
                      "w-1.5 h-1.5 rounded-full shrink-0",
                      isActive ? "bg-white" : "bg-[var(--accent)] border-accent-glow"
                    )} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 1 Col: Day Planner Agenda */}
        <div className="glass-panel p-5 rounded-2xl border border-white/5 flex flex-col gap-4 bg-black/10">
          <div className="border-b border-white/5 pb-2.5 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Clock size={14} className="text-[var(--accent)]" />
              <span className="text-xs uppercase font-bold tracking-widest text-white">Daily Planner</span>
            </div>
            <span className="text-[10px] text-[var(--text-muted)] font-mono uppercase font-bold">
              {activeDateStr}
            </span>
          </div>

          {/* Agenda time blocks stack stack */}
          <div className="flex-1 overflow-y-auto pr-1 no-scrollbar flex flex-col gap-3 max-h-[360px]">
            <span className="text-[9px] uppercase font-black tracking-widest text-[var(--text-muted)] mb-1">Time Blocks</span>
            
            {events.map((evt) => (
              <div
                key={evt.id}
                className={cn(
                  "p-3 rounded-xl border border-white/5 flex items-start justify-between text-xs transition-all bg-white/5 hover:bg-white/10",
                  evt.type === "focus" 
                    ? "border-l-2 border-l-purple-500" 
                    : evt.type === "meeting"
                      ? "border-l-2 border-l-sky-500"
                      : "border-l-2 border-l-yellow-500"
                )}
              >
                <div className="flex flex-col gap-0.5">
                  <span className="font-semibold text-white leading-relaxed">{evt.title}</span>
                  <span className="text-[9px] text-[var(--text-muted)] flex items-center gap-1">
                    <Clock size={8} />
                    {evt.time} ({evt.duration})
                  </span>
                </div>

                <span className={cn(
                  "text-[8px] px-1.5 py-0.5 rounded font-bold uppercase",
                  evt.type === "focus" 
                    ? "bg-purple-500/10 text-purple-400" 
                    : evt.type === "meeting"
                      ? "bg-sky-500/10 text-sky-400"
                      : "bg-yellow-500/10 text-yellow-400"
                )}>
                  {evt.type}
                </span>
              </div>
            ))}

            {/* Scheduled Deadlines tasks block */}
            <span className="text-[9px] uppercase font-black tracking-widest text-[var(--text-muted)] mt-4 mb-1">Deadlines Due</span>
            
            {tasksOnActiveDate.length > 0 ? (
              tasksOnActiveDate.map((t) => (
                <div
                  key={t.id}
                  className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] border-accent-glow animate-pulse" />
                    <span className="text-white font-semibold">{t.title}</span>
                  </div>
                  <span className={cn(
                    "text-[8px] font-bold px-1.5 py-0.5 rounded uppercase",
                    t.priority === "high" ? "bg-red-500/10 text-red-400" : "bg-yellow-500/10 text-yellow-400"
                  )}>
                    {t.priority}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center text-[10px] text-[var(--text-muted)] py-4 bg-white/5 rounded-xl border border-dashed border-white/5">
                No major milestones scheduled.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Block Scheduler Creator Modal */}
      <AnimatePresence>
        {createOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setCreateOpen(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-sm glass-panel p-5 rounded-2xl border border-white/10 bg-black/50 shadow-2xl flex flex-col gap-4 text-left"
            >
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <span className="text-sm font-bold text-white">Block Time Slot</span>
                <button onClick={() => setCreateOpen(false)} className="text-xs text-[var(--text-muted)] cursor-pointer">
                  Close
                </button>
              </div>

              <form onSubmit={handleEventCreateSubmit} className="flex flex-col gap-3.5">
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] text-[var(--text-muted)] uppercase font-bold tracking-wider">Title</label>
                  <input
                    type="text"
                    required
                    placeholder="Focus code session / Review slot..."
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[var(--accent)]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] text-[var(--text-muted)] uppercase font-bold tracking-wider">Start Time</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 10:00 AM..."
                      value={newTime}
                      onChange={(e) => setNewTime(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[var(--accent)]"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] text-[var(--text-muted)] uppercase font-bold tracking-wider">Duration</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 45 min..."
                      value={newDur}
                      onChange={(e) => setNewDur(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[var(--accent)]"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[9px] text-[var(--text-muted)] uppercase font-bold tracking-wider">Focus Block Category</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(["focus", "meeting", "review"] as const).map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setNewType(t)}
                        className={cn(
                          "py-1.5 rounded-lg text-xs font-semibold capitalize cursor-pointer border transition-all",
                          newType === t
                            ? "bg-accent-gradient text-white border-white/10 shadow"
                            : "bg-white/5 text-[var(--text-muted)] border-transparent hover:bg-white/10"
                        )}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2 bg-accent-gradient text-white rounded-xl text-xs font-bold border border-white/10 shadow-lg cursor-pointer mt-2"
                >
                  Confirm Appointment Block
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
