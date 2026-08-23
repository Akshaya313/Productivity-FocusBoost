"use client";

import React, { useState } from "react";
import { useProductivityStore, Task } from "@/store/useProductivityStore";
import { Calendar as CalendarIcon, Clock, ChevronLeft, ChevronRight, Plus, Sparkles, AlertCircle, Trash2, Edit, Check, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { showToast } from "@/lib/toast";

interface PlannerEvent {
  id: string;
  title: string;
  time: string;
  duration: string;
  type: "focus" | "meeting" | "review";
  dateStr?: string;
}

const INITIAL_EVENTS: PlannerEvent[] = [
  { id: "e-1", title: "🌅 Morning Mindful Alignment", time: "09:00 AM", duration: "15 min", type: "review" },
  { id: "e-2", title: "🤿 Deep Core Coding Block", time: "10:00 AM", duration: "90 min", type: "focus" },
  { id: "e-3", title: "🤝 Sync Alignment Session", time: "02:00 PM", duration: "45 min", type: "meeting" },
  { id: "e-4", title: "🔥 Sunset Review", time: "05:30 PM", duration: "15 min", type: "review" }
];

export default function IntegratedCalendar() {
  const { tasks, addTask, updateTask, deleteTask } = useProductivityStore();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<PlannerEvent[]>(INITIAL_EVENTS);
  const [activeDateStr, setActiveDateStr] = useState(new Date().toISOString().split("T")[0]);
  
  // Schedule Creator state
  const [createOpen, setCreateOpen] = useState(false);
  const [scheduleCategory, setScheduleCategory] = useState<"task" | "event">("task");
  const [newTitle, setNewTitle] = useState("");
  const [newPriority, setNewPriority] = useState<Task["priority"]>("medium");
  const [newTime, setNewTime] = useState("10:00 AM");
  const [newDur, setNewDur] = useState("30 min");
  const [newType, setNewType] = useState<PlannerEvent["type"]>("focus");

  // Task Editor Modal state
  const [editTaskOpen, setEditTaskOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editTaskTitle, setEditTaskTitle] = useState("");
  const [editTaskPriority, setEditTaskPriority] = useState<Task["priority"]>("medium");
  const [editTaskStatus, setEditTaskStatus] = useState<Task["status"]>("todo");
  const [editTaskDueDate, setEditTaskDueDate] = useState("");

  // Event Editor Modal state
  const [editEventOpen, setEditEventOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<PlannerEvent | null>(null);
  const [editEvtTitle, setEditEvtTitle] = useState("");
  const [editEvtTime, setEditEvtTime] = useState("");
  const [editEvtDur, setEditEvtDur] = useState("");
  const [editEvtType, setEditEvtType] = useState<PlannerEvent["type"]>("focus");

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

  // Creator handler
  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    if (scheduleCategory === "task") {
      addTask({
        title: newTitle,
        description: `Scheduled via Calendar for ${activeDateStr}`,
        status: "todo",
        priority: newPriority,
        dueDate: activeDateStr,
        tags: ["Calendar"],
        subtasks: [],
        recurrence: "none"
      });
      showToast("Task Scheduled", `"${newTitle}" added to ${activeDateStr}`, "success");
    } else {
      const newEvent: PlannerEvent = {
        id: `evt-${Date.now()}`,
        title: newTitle,
        time: newTime,
        duration: newDur,
        type: newType,
        dateStr: activeDateStr
      };
      setEvents((prev) => [...prev, newEvent]);
      showToast("Time Block Scheduled", `"${newTitle}" added to daily planner.`, "success");
    }

    setNewTitle("");
    setCreateOpen(false);
  };

  // Open Task Editor
  const handleOpenEditTask = (task: Task) => {
    setEditingTask(task);
    setEditTaskTitle(task.title);
    setEditTaskPriority(task.priority);
    setEditTaskStatus(task.status);
    setEditTaskDueDate(task.dueDate);
    setEditTaskOpen(true);
  };

  // Save Task Edits
  const handleSaveTaskEdits = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTask || !editTaskTitle.trim()) return;

    updateTask(editingTask.id, {
      title: editTaskTitle,
      priority: editTaskPriority,
      status: editTaskStatus,
      dueDate: editTaskDueDate
    });

    showToast("Task Updated", `"${editTaskTitle}" customized successfully.`, "success");
    setEditTaskOpen(false);
  };

  // Delete Task
  const handleDeleteTask = () => {
    if (!editingTask) return;
    deleteTask(editingTask.id);
    showToast("Task Deleted", `"${editingTask.title}" removed.`, "info");
    setEditTaskOpen(false);
  };

  // Open Event Editor
  const handleOpenEditEvent = (evt: PlannerEvent) => {
    setEditingEvent(evt);
    setEditEvtTitle(evt.title);
    setEditEvtTime(evt.time);
    setEditEvtDur(evt.duration);
    setEditEvtType(evt.type);
    setEditEventOpen(true);
  };

  // Save Event Edits
  const handleSaveEventEdits = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent || !editEvtTitle.trim()) return;

    setEvents((prev) =>
      prev.map((item) =>
        item.id === editingEvent.id
          ? { ...item, title: editEvtTitle, time: editEvtTime, duration: editEvtDur, type: editEvtType }
          : item
      )
    );

    showToast("Time Block Updated", `"${editEvtTitle}" updated.`, "success");
    setEditEventOpen(false);
  };

  // Delete Event
  const handleDeleteEvent = () => {
    if (!editingEvent) return;
    setEvents((prev) => prev.filter((item) => item.id !== editingEvent.id));
    showToast("Time Block Removed", `"${editingEvent.title}" deleted.`, "info");
    setEditEventOpen(false);
  };

  // Filter tasks & events for current active date
  const tasksOnActiveDate = tasks.filter((t) => t.dueDate === activeDateStr);
  const eventsOnActiveDate = events.filter((e) => !e.dateStr || e.dateStr === activeDateStr);

  return (
    <div className="flex flex-col gap-6 select-none relative h-full">
      {/* Header controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <span>Dynamic Calendar Planner</span>
            <Sparkles size={18} className="text-amber-400" />
          </h2>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            Coordinate milestones. Click any task or event to customize and edit schedule details.
          </p>
        </div>

        <button
          onClick={() => setCreateOpen(true)}
          className="px-3.5 py-2 rounded-xl bg-accent-gradient hover:opacity-90 transition-opacity text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer border border-white/5 shadow-md"
        >
          <Plus size={14} />
          <span>Schedule Task / Block</span>
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

              // Check if date has tasks scheduled
              const dateTasks = tasks.filter((t) => t.dueDate === dateStr);
              const hasTask = dateTasks.length > 0;
              
              return (
                <div
                  key={`day-${dayNum}`}
                  onClick={() => setActiveDateStr(dateStr)}
                  className={cn(
                    "p-2 rounded-xl flex flex-col items-center justify-between border cursor-pointer select-none transition-all relative aspect-square",
                    isActive 
                      ? "bg-accent-gradient border-white/10 text-white shadow-lg scale-105"
                      : isToday
                        ? "bg-white/10 border-[var(--accent)]/40 text-white"
                        : "bg-white/5 border-transparent text-[var(--foreground)] hover:bg-white/10 hover:border-white/5"
                  )}
                >
                  <span className="font-bold text-xs">{dayNum}</span>
                  
                  {/* Indicator bullet dots */}
                  {hasTask && (
                    <div className="flex items-center gap-0.5">
                      <span className={cn(
                        "w-1.5 h-1.5 rounded-full shrink-0",
                        isActive ? "bg-white" : "bg-[var(--accent)] border-accent-glow"
                      )} />
                      {dateTasks.length > 1 && (
                        <span className="text-[8px] font-mono font-bold opacity-80">+{dateTasks.length - 1}</span>
                      )}
                    </div>
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
            <span className="text-[10px] text-[var(--text-muted)] font-mono uppercase font-bold bg-white/5 px-2 py-0.5 rounded border border-white/5">
              {activeDateStr}
            </span>
          </div>

          {/* Agenda time blocks stack */}
          <div className="flex-1 overflow-y-auto pr-1 no-scrollbar flex flex-col gap-3 max-h-[380px]">
            {/* Scheduled Deadlines tasks block */}
            <span className="text-[9px] uppercase font-black tracking-widest text-[var(--text-muted)] mb-1 flex items-center justify-between">
              <span>Tasks Due ({tasksOnActiveDate.length})</span>
              <span className="text-[8px] font-normal text-[var(--accent)]">Click to Edit</span>
            </span>
            
            {tasksOnActiveDate.length > 0 ? (
              tasksOnActiveDate.map((t) => (
                <div
                  key={t.id}
                  onClick={() => handleOpenEditTask(t)}
                  className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-[var(--accent)]/30 transition-all flex items-center justify-between text-xs cursor-pointer group"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] border-accent-glow animate-pulse" />
                    <span className={cn("font-semibold transition-colors", t.status === "done" ? "line-through text-[var(--text-muted)]" : "text-white group-hover:text-[var(--accent)]")}>
                      {t.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className={cn(
                      "text-[8px] font-bold px-1.5 py-0.5 rounded uppercase",
                      t.priority === "high" ? "bg-red-500/10 text-red-400" : t.priority === "medium" ? "bg-yellow-500/10 text-yellow-400" : "bg-green-500/10 text-green-400"
                    )}>
                      {t.priority}
                    </span>
                    <Edit size={12} className="text-[var(--text-muted)] group-hover:text-white transition-colors" />
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-[10px] text-[var(--text-muted)] py-3 bg-white/5 rounded-xl border border-dashed border-white/5">
                No tasks scheduled for this date.
              </div>
            )}

            {/* Time Blocks */}
            <span className="text-[9px] uppercase font-black tracking-widest text-[var(--text-muted)] mt-3 mb-1 flex items-center justify-between">
              <span>Time Blocks ({eventsOnActiveDate.length})</span>
              <span className="text-[8px] font-normal text-[var(--accent)]">Click to Edit</span>
            </span>
            
            {eventsOnActiveDate.map((evt) => (
              <div
                key={evt.id}
                onClick={() => handleOpenEditEvent(evt)}
                className={cn(
                  "p-3 rounded-xl border flex items-start justify-between text-xs transition-all bg-white/5 hover:bg-white/10 cursor-pointer group",
                  evt.type === "focus" 
                    ? "border-l-2 border-l-purple-500 border-white/5" 
                    : evt.type === "meeting"
                      ? "border-l-2 border-l-sky-500 border-white/5"
                      : "border-l-2 border-l-yellow-500 border-white/5"
                )}
              >
                <div className="flex flex-col gap-0.5">
                  <span className="font-semibold text-white group-hover:text-[var(--accent)] transition-colors">{evt.title}</span>
                  <span className="text-[9px] text-[var(--text-muted)] flex items-center gap-1">
                    <Clock size={8} />
                    {evt.time} ({evt.duration})
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
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
                  <Edit size={12} className="text-[var(--text-muted)] group-hover:text-white transition-colors" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Schedule Creator Modal */}
      <AnimatePresence>
        {createOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setCreateOpen(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-sm glass-panel p-5 rounded-2xl border border-white/10 bg-black/80 shadow-2xl flex flex-col gap-4 text-left select-none"
            >
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <span className="text-sm font-bold text-white">Schedule Task or Time Block</span>
                <button onClick={() => setCreateOpen(false)} className="text-xs text-[var(--text-muted)] cursor-pointer">
                  <X size={14} />
                </button>
              </div>

              {/* Selector Category */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setScheduleCategory("task")}
                  className={cn(
                    "py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer border",
                    scheduleCategory === "task"
                      ? "bg-accent-gradient text-white border-white/10"
                      : "bg-white/5 text-[var(--text-muted)] border-transparent hover:bg-white/10"
                  )}
                >
                  Create Task
                </button>
                <button
                  type="button"
                  onClick={() => setScheduleCategory("event")}
                  className={cn(
                    "py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer border",
                    scheduleCategory === "event"
                      ? "bg-accent-gradient text-white border-white/10"
                      : "bg-white/5 text-[var(--text-muted)] border-transparent hover:bg-white/10"
                  )}
                >
                  Time Block
                </button>
              </div>

              <form onSubmit={handleScheduleSubmit} className="flex flex-col gap-3.5">
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] text-[var(--text-muted)] uppercase font-bold tracking-wider">Title</label>
                  <input
                    type="text"
                    required
                    placeholder={scheduleCategory === "task" ? "Task title..." : "Focus session / meeting title..."}
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[var(--accent)]"
                  />
                </div>

                {scheduleCategory === "task" ? (
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] text-[var(--text-muted)] uppercase font-bold tracking-wider">Priority Level</label>
                    <div className="grid grid-cols-3 gap-2">
                      {(["low", "medium", "high"] as const).map((p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setNewPriority(p)}
                          className={cn(
                            "py-1.5 rounded-lg text-xs font-semibold capitalize cursor-pointer border transition-all",
                            newPriority === p
                              ? "bg-accent-gradient text-white border-white/10"
                              : "bg-white/5 text-[var(--text-muted)] border-transparent hover:bg-white/10"
                          )}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <>
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
                      <label className="text-[9px] text-[var(--text-muted)] uppercase font-bold tracking-wider">Block Category</label>
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
                  </>
                )}

                <button
                  type="submit"
                  className="w-full py-2 bg-accent-gradient text-white rounded-xl text-xs font-bold border border-white/10 shadow-lg cursor-pointer mt-2"
                >
                  Confirm Schedule
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Task Customizer Modal */}
      <AnimatePresence>
        {editTaskOpen && editingTask && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setEditTaskOpen(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-sm glass-panel p-5 rounded-2xl border border-white/10 bg-black/80 shadow-2xl flex flex-col gap-4 text-left select-none"
            >
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <span className="text-sm font-bold text-white">Customize Calendar Task</span>
                <button onClick={() => setEditTaskOpen(false)} className="text-xs text-[var(--text-muted)] cursor-pointer">
                  <X size={14} />
                </button>
              </div>

              <form onSubmit={handleSaveTaskEdits} className="flex flex-col gap-3.5">
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] text-[var(--text-muted)] uppercase font-bold tracking-wider">Title</label>
                  <input
                    type="text"
                    required
                    value={editTaskTitle}
                    onChange={(e) => setEditTaskTitle(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[var(--accent)]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] text-[var(--text-muted)] uppercase font-bold tracking-wider">Priority</label>
                    <select
                      value={editTaskPriority}
                      onChange={(e) => setEditTaskPriority(e.target.value as Task["priority"])}
                      className="bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white outline-none focus:border-[var(--accent)] capitalize"
                    >
                      <option value="low" className="bg-gray-900">Low</option>
                      <option value="medium" className="bg-gray-900">Medium</option>
                      <option value="high" className="bg-gray-900">High</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] text-[var(--text-muted)] uppercase font-bold tracking-wider">Status</label>
                    <select
                      value={editTaskStatus}
                      onChange={(e) => setEditTaskStatus(e.target.value as Task["status"])}
                      className="bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white outline-none focus:border-[var(--accent)] capitalize"
                    >
                      <option value="inbox" className="bg-gray-900">Inbox</option>
                      <option value="todo" className="bg-gray-900">To Do</option>
                      <option value="in_progress" className="bg-gray-900">In Progress</option>
                      <option value="done" className="bg-gray-900">Done</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[9px] text-[var(--text-muted)] uppercase font-bold tracking-wider">Assigned Date</label>
                  <input
                    type="date"
                    value={editTaskDueDate}
                    onChange={(e) => setEditTaskDueDate(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white outline-none focus:border-[var(--accent)]"
                  />
                </div>

                <div className="flex items-center gap-2 mt-2">
                  <button
                    type="button"
                    onClick={handleDeleteTask}
                    className="px-3 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-bold cursor-pointer transition-colors flex items-center gap-1"
                  >
                    <Trash2 size={13} />
                    <span>Delete</span>
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-accent-gradient text-white rounded-xl text-xs font-bold border border-white/10 shadow-lg cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Event Customizer Modal */}
      <AnimatePresence>
        {editEventOpen && editingEvent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setEditEventOpen(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-sm glass-panel p-5 rounded-2xl border border-white/10 bg-black/80 shadow-2xl flex flex-col gap-4 text-left select-none"
            >
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <span className="text-sm font-bold text-white">Customize Time Block</span>
                <button onClick={() => setEditEventOpen(false)} className="text-xs text-[var(--text-muted)] cursor-pointer">
                  <X size={14} />
                </button>
              </div>

              <form onSubmit={handleSaveEventEdits} className="flex flex-col gap-3.5">
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] text-[var(--text-muted)] uppercase font-bold tracking-wider">Title</label>
                  <input
                    type="text"
                    required
                    value={editEvtTitle}
                    onChange={(e) => setEditEvtTitle(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[var(--accent)]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] text-[var(--text-muted)] uppercase font-bold tracking-wider">Time</label>
                    <input
                      type="text"
                      required
                      value={editEvtTime}
                      onChange={(e) => setEditEvtTime(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[var(--accent)]"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] text-[var(--text-muted)] uppercase font-bold tracking-wider">Duration</label>
                    <input
                      type="text"
                      required
                      value={editEvtDur}
                      onChange={(e) => setEditEvtDur(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[var(--accent)]"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[9px] text-[var(--text-muted)] uppercase font-bold tracking-wider">Category</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(["focus", "meeting", "review"] as const).map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setEditEvtType(t)}
                        className={cn(
                          "py-1.5 rounded-lg text-xs font-semibold capitalize cursor-pointer border transition-all",
                          editEvtType === t
                            ? "bg-accent-gradient text-white border-white/10 shadow"
                            : "bg-white/5 text-[var(--text-muted)] border-transparent hover:bg-white/10"
                        )}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-2">
                  <button
                    type="button"
                    onClick={handleDeleteEvent}
                    className="px-3 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-bold cursor-pointer transition-colors flex items-center gap-1"
                  >
                    <Trash2 size={13} />
                    <span>Delete</span>
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-accent-gradient text-white rounded-xl text-xs font-bold border border-white/10 shadow-lg cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
