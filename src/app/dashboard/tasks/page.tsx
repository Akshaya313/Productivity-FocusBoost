"use client";

import React, { useState } from "react";
import { useProductivityStore, Task, Subtask } from "@/store/useProductivityStore";
import {
  Plus,
  Search,
  Filter,
  CheckCircle,
  Tag,
  ArrowRight,
  Trash2,
  List,
  Kanban,
  Sparkles,
  AlertCircle,
  FolderPlus,
  Calendar,
  Layers,
  ChevronDown,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedCheckbox from "@/components/animated-checkbox";
import { cn } from "@/lib/utils";

export default function SmartTasks() {
  const {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    toggleSubtask,
    addSubtask,
    moveTask
  } = useProductivityStore();

  const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban");
  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  
  // Quick task modal state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newPriority, setNewPriority] = useState<Task["priority"]>("medium");
  const [newDueDate, setNewDueDate] = useState(new Date().toISOString().split("T")[0]);
  const [newTagInput, setNewTagInput] = useState("");

  // Edit task details state
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [subtaskTitleInput, setSubtaskTitleInput] = useState("");

  const allTags = Array.from(new Set(tasks.flatMap((t) => t.tags)));

  // Filtered tasks
  const filteredTasks = tasks.filter((t) => {
    const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase()) ||
                          t.description.toLowerCase().includes(search.toLowerCase());
    const matchesTag = activeTag ? t.tags.includes(activeTag) : true;
    return matchesSearch && matchesTag;
  });

  const columns: { title: string; status: Task["status"]; color: string }[] = [
    { title: "Inbox", status: "inbox", color: "border-sky-500/20 text-sky-300" },
    { title: "To Do", status: "todo", color: "border-purple-500/20 text-purple-300" },
    { title: "In Progress", status: "in_progress", color: "border-yellow-500/20 text-yellow-300" },
    { title: "Completed", status: "done", color: "border-emerald-500/20 text-emerald-300" }
  ];

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const tags = newTagInput
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t !== "");

    addTask({
      title: newTitle,
      description: newDesc,
      status: "todo",
      priority: newPriority,
      dueDate: newDueDate,
      tags: tags.length > 0 ? tags : ["Task"],
      subtasks: [],
      recurrence: "none"
    });

    // Reset inputs
    setNewTitle("");
    setNewDesc("");
    setNewPriority("medium");
    setNewDueDate(new Date().toISOString().split("T")[0]);
    setNewTagInput("");
    setIsCreateOpen(false);
  };

  const handleAddSubtaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTask || !subtaskTitleInput.trim()) return;

    addSubtask(activeTask.id, subtaskTitleInput);
    
    // Sync local details state
    const currentTask = useProductivityStore.getState().tasks.find((t) => t.id === activeTask.id);
    if (currentTask) setActiveTask(currentTask);
    
    setSubtaskTitleInput("");
  };

  const handleSubtaskToggleAction = (taskId: string, subId: string) => {
    toggleSubtask(taskId, subId);
    // sync activeTask details panel
    const currentTask = useProductivityStore.getState().tasks.find((t) => t.id === taskId);
    if (currentTask) setActiveTask(currentTask);
  };

  // Premium AI Task Breakdown generator simulator
  const handleAIBreakdown = (task: Task) => {
    const aiPresets: Record<string, string[]> = {
      default: ["Analyze system dependencies", "Write functional code blocks", "Run compiling validations", "Perform accessibility checks"],
      visual: ["Establish typography scale", "Define custom color palette", "Configure dark-first glass components", "Animate layout with Framer Motion"],
      dev: ["Verify Next.js compiler parameters", "Configure Zustand local storage persistence", "Audit Tailwind config dependencies", "Run code verification build"]
    };

    let selectedKey = "default";
    const title = task.title.toLowerCase();
    if (title.includes("design") || title.includes("layout") || title.includes("visual")) {
      selectedKey = "visual";
    } else if (title.includes("build") || title.includes("typescript") || title.includes("compile") || title.includes("dev")) {
      selectedKey = "dev";
    }

    const items = aiPresets[selectedKey];
    items.forEach((item) => {
      addSubtask(task.id, `🤖 [AI] ${item}`);
    });

    const currentTask = useProductivityStore.getState().tasks.find((t) => t.id === task.id);
    if (currentTask) setActiveTask(currentTask);

    alert("AI successfully generated custom subtasks breakdown for this milestone!");
  };

  return (
    <div className="flex flex-col gap-6 select-none relative h-full">
      {/* Header controls controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white">Smart Task Management</h2>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            Visualize your productivity backlog. Track subtasks and toggle between Kanban or List views.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="flex bg-black/35 p-1 rounded-xl border border-white/5 gap-1">
            <button
              onClick={() => setViewMode("kanban")}
              className={cn(
                "p-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer",
                viewMode === "kanban" ? "bg-accent-gradient text-white" : "text-[var(--text-muted)] hover:text-white"
              )}
            >
              <Kanban size={15} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={cn(
                "p-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer",
                viewMode === "list" ? "bg-accent-gradient text-white" : "text-[var(--text-muted)] hover:text-white"
              )}
            >
              <List size={15} />
            </button>
          </div>

          {/* New Task CTA */}
          <button
            onClick={() => setIsCreateOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-accent-gradient hover:opacity-90 transition-opacity text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer border border-white/5 shadow-md"
          >
            <Plus size={14} />
            <span>Create Task</span>
          </button>
        </div>
      </div>

      {/* Filters Search/Tags bar */}
      <div className="glass-panel p-4 rounded-xl border border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:max-w-xs">
          <Search className="absolute left-3 top-2.5 text-[var(--text-muted)]" size={14} />
          <input
            type="text"
            placeholder="Search backlog titles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-black/20 border border-white/5 rounded-lg pl-9 pr-4 py-2 text-xs text-white outline-none focus:border-[var(--accent)] transition-colors"
          />
        </div>

        {/* Tag Filters list list */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full md:w-auto">
          <button
            onClick={() => setActiveTag(null)}
            className={cn(
              "px-2.5 py-1 rounded-full text-[10px] font-semibold transition-all cursor-pointer border",
              !activeTag
                ? "bg-accent-gradient border-white/10 text-white"
                : "bg-white/5 border-transparent text-[var(--text-muted)] hover:text-white"
            )}
          >
            All Tags
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              className={cn(
                "px-2.5 py-1 rounded-full text-[10px] font-semibold transition-all cursor-pointer border flex items-center gap-1",
                activeTag === tag
                  ? "bg-accent-gradient border-white/10 text-white"
                  : "bg-white/5 border-transparent text-[var(--text-muted)] hover:text-white"
              )}
            >
              <Tag size={8} />
              <span>{tag}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Backlog Display Frame Layout */}
      {viewMode === "kanban" ? (
        // Kanban Columns layout
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
          {columns.map((col) => {
            const colTasks = filteredTasks.filter((t) => t.status === col.status);
            return (
              <div key={col.status} className="flex flex-col gap-4 bg-black/10 rounded-2xl p-4 border border-white/5 min-h-[300px]">
                {/* Column header */}
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <span className={cn("text-xs font-bold uppercase tracking-wider", col.color)}>
                    {col.title}
                  </span>
                  <span className="text-[10px] bg-white/5 border border-white/5 text-white font-mono px-2 py-0.5 rounded-full font-bold">
                    {colTasks.length}
                  </span>
                </div>

                {/* Cards stack */}
                <div className="flex flex-col gap-3 overflow-y-auto max-h-[480px] no-scrollbar">
                  {colTasks.map((task) => {
                    const completedSubs = task.subtasks.filter((s) => s.completed).length;
                    const subPercent = task.subtasks.length > 0 ? Math.round((completedSubs / task.subtasks.length) * 100) : 0;
                    return (
                      <div
                        key={task.id}
                        onClick={() => setActiveTask(task)}
                        className="p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-[var(--accent)]/30 transition-all cursor-pointer flex flex-col gap-3 group"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className={cn(
                            "text-xs font-bold leading-relaxed",
                            task.status === "done" ? "text-[var(--text-muted)] line-through" : "text-white group-hover:text-[var(--accent)]"
                          )}>
                            {task.title}
                          </span>
                        </div>

                        {/* Card metadata bar */}
                        <div className="flex flex-wrap items-center gap-1.5 text-[9px]">
                          <span className={cn(
                            "px-1.5 py-0.5 rounded font-bold uppercase",
                            task.priority === "high" ? "bg-red-500/10 text-red-400" : task.priority === "medium" ? "bg-yellow-500/10 text-yellow-400" : "bg-green-500/10 text-green-400"
                          )}>
                            {task.priority}
                          </span>
                          <span className="bg-white/5 text-[var(--text-muted)] px-1.5 py-0.5 rounded flex items-center gap-0.5">
                            <Calendar size={8} />
                            {task.dueDate}
                          </span>
                        </div>

                        {/* Subtask micro meter */}
                        {task.subtasks.length > 0 && (
                          <div>
                            <div className="flex justify-between text-[8px] text-[var(--text-muted)] font-bold mb-1">
                              <span>Subtasks</span>
                              <span>{completedSubs}/{task.subtasks.length} ({subPercent}%)</span>
                            </div>
                            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-accent-gradient"
                                style={{ width: `${subPercent}%` }}
                              />
                            </div>
                          </div>
                        )}

                        {/* Action select move toggles */}
                        <div className="flex items-center justify-between border-t border-white/5 pt-2.5 mt-1 text-[9px] text-[var(--text-muted)]">
                          <span>Actions</span>
                          <div className="flex items-center gap-1.5">
                            {col.status !== "inbox" && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const prevMap: Record<Task["status"], Task["status"]> = { todo: "inbox", in_progress: "todo", done: "in_progress", inbox: "inbox" };
                                  moveTask(task.id, prevMap[col.status]);
                                }}
                                className="hover:text-white"
                                title="Move Left"
                              >
                                &larr;
                              </button>
                            )}
                            {col.status !== "done" && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const nextMap: Record<Task["status"], Task["status"]> = { inbox: "todo", todo: "in_progress", in_progress: "done", done: "done" };
                                  moveTask(task.id, nextMap[col.status]);
                                }}
                                className="hover:text-white"
                                title="Move Right"
                              >
                                &rarr;
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {colTasks.length === 0 && (
                    <div className="text-center text-[10px] text-[var(--text-muted)] py-8 border border-dashed border-white/5 rounded-xl">
                      Column Empty
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        // List Layout Layout
        <div className="glass-panel p-5 rounded-2xl border border-white/5 flex flex-col gap-3 max-h-[460px] overflow-y-auto no-scrollbar">
          {filteredTasks.map((task) => (
            <div
              key={task.id}
              onClick={() => setActiveTask(task)}
              className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all flex items-center justify-between cursor-pointer group gap-4"
            >
              <div className="flex items-center gap-3">
                <AnimatedCheckbox
                  checked={task.status === "done"}
                  onChange={() => updateTask(task.id, { status: task.status === "done" ? "todo" : "done" })}
                  triggerConfetti={true}
                />
                <span className={cn(
                  "text-xs font-semibold truncate max-w-xs sm:max-w-md",
                  task.status === "done" ? "text-[var(--text-muted)] line-through" : "text-white"
                )}>
                  {task.title}
                </span>
              </div>

              <div className="flex items-center gap-3 text-[10px]">
                <span className={cn(
                  "px-2 py-0.5 rounded font-bold uppercase",
                  task.priority === "high" ? "bg-red-500/10 text-red-400" : task.priority === "medium" ? "bg-yellow-500/10 text-yellow-400" : "bg-green-500/10 text-green-400"
                )}>
                  {task.priority}
                </span>
                <span className="bg-white/5 text-[var(--text-muted)] px-2 py-0.5 rounded hidden sm:inline">
                  {task.dueDate}
                </span>
                <span className="text-[var(--accent)] font-bold text-[9px] uppercase">
                  {task.status.replace("_", " ")}
                </span>
              </div>
            </div>
          ))}

          {filteredTasks.length === 0 && (
            <div className="text-center text-xs text-[var(--text-muted)] py-12">
              No tasks match active search parameters.
            </div>
          )}
        </div>
      )}

      {/* Creation Modal Modal */}
      <AnimatePresence>
        {isCreateOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsCreateOpen(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-sm glass-panel p-5 rounded-2xl border border-white/10 bg-black/50 shadow-2xl flex flex-col gap-4 text-left"
            >
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <span className="text-sm font-bold text-white">Create Smart Task</span>
                <button onClick={() => setIsCreateOpen(false)} className="text-xs text-[var(--text-muted)] hover:text-white cursor-pointer">
                  Close
                </button>
              </div>

              <form onSubmit={handleCreateSubmit} className="flex flex-col gap-3.5">
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] text-[var(--text-muted)] uppercase font-bold tracking-wider">Title</label>
                  <input
                    type="text"
                    required
                    placeholder="Task summary..."
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[var(--accent)]"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] text-[var(--text-muted)] uppercase font-bold tracking-wider">Description</label>
                  <textarea
                    placeholder="Provide description context..."
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[var(--accent)] resize-none h-16"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] text-[var(--text-muted)] uppercase font-bold tracking-wider">Due Date</label>
                    <input
                      type="date"
                      value={newDueDate}
                      onChange={(e) => setNewDueDate(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-3 py-2 text-xs outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] text-[var(--text-muted)] uppercase font-bold tracking-wider">Priority</label>
                    <select
                      value={newPriority}
                      onChange={(e) => setNewPriority(e.target.value as Task["priority"])}
                      className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-3 py-2 text-xs outline-none appearance-none"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] text-[var(--text-muted)] uppercase font-bold tracking-wider">Tags (comma-separated)</label>
                  <input
                    type="text"
                    placeholder="e.g. Design, UI, Backend..."
                    value={newTagInput}
                    onChange={(e) => setNewTagInput(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[var(--accent)]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2 bg-accent-gradient text-white rounded-xl text-xs font-bold border border-white/10 shadow-lg mt-2 cursor-pointer"
                >
                  Create Task Board Element
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Task Details Side Drawer Modal */}
      <AnimatePresence>
        {activeTask && (
          <div className="fixed inset-0 z-50 flex items-center justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveTask(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-full max-w-md h-full bg-black/40 glass-panel border-l border-white/10 shadow-2xl flex flex-col p-6 text-left overflow-y-auto no-scrollbar"
            >
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <span className="text-xs uppercase font-black tracking-widest text-[var(--text-muted)] flex items-center gap-1">
                  <Layers size={12} className="text-[var(--accent)]" />
                  <span>Backlog Details</span>
                </span>
                <button
                  onClick={() => setActiveTask(null)}
                  className="text-xs text-[var(--text-muted)] hover:text-white cursor-pointer flex items-center gap-1"
                >
                  <X size={14} />
                </button>
              </div>

              {/* Task title & description */}
              <div className="mt-5 flex flex-col gap-2">
                <span className="text-lg font-black text-white leading-tight">
                  {activeTask.title}
                </span>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed bg-white/5 p-3 rounded-xl border border-white/5">
                  {activeTask.description || "No description provided."}
                </p>
              </div>

              {/* Quick actions status move options */}
              <div className="grid grid-cols-2 gap-3 mt-4 text-xs font-semibold">
                <div className="p-3 bg-white/5 border border-white/5 rounded-xl flex flex-col gap-1">
                  <span className="text-[9px] uppercase tracking-wider text-[var(--text-muted)] font-bold">Priority Status</span>
                  <span className="text-white capitalize font-bold">{activeTask.priority} Priority</span>
                </div>
                <div className="p-3 bg-white/5 border border-white/5 rounded-xl flex flex-col gap-1">
                  <span className="text-[9px] uppercase tracking-wider text-[var(--text-muted)] font-bold">Board Column</span>
                  <span className="text-white capitalize font-bold">{activeTask.status.replace("_", " ")}</span>
                </div>
              </div>

              {/* Subtasks listing checklist checklist */}
              <div className="mt-6 flex flex-col gap-4 border-t border-white/5 pt-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">Subtask Breakdown</span>
                  <button
                    onClick={() => handleAIBreakdown(activeTask)}
                    className="text-[10px] text-[var(--accent)] font-bold flex items-center gap-1 hover:text-white transition-colors cursor-pointer bg-[var(--accent)]/10 px-2 py-1 rounded"
                    title="Generate subtasks automatically based on card title"
                  >
                    <Sparkles size={11} className="animate-pulse" />
                    <span>Break Down with AI</span>
                  </button>
                </div>

                <div className="flex flex-col gap-2 max-h-[220px] overflow-y-auto no-scrollbar">
                  {activeTask.subtasks.map((sub) => (
                    <div
                      key={sub.id}
                      className="flex items-center gap-3 p-2.5 rounded-lg bg-white/5 border border-white/5 text-xs font-medium cursor-pointer"
                      onClick={() => handleSubtaskToggleAction(activeTask.id, sub.id)}
                    >
                      <AnimatedCheckbox
                        checked={sub.completed}
                        onChange={() => handleSubtaskToggleAction(activeTask.id, sub.id)}
                        triggerConfetti={true}
                      />
                      <span className={sub.completed ? "text-[var(--text-muted)] line-through" : "text-white"}>
                        {sub.title}
                      </span>
                    </div>
                  ))}

                  {activeTask.subtasks.length === 0 && (
                    <div className="text-center text-[10px] text-[var(--text-muted)] py-6">
                      No subtasks configured yet. Add subtasks below or use AI breakdown.
                    </div>
                  )}
                </div>

                {/* Subtask quick creator input */}
                <form onSubmit={handleAddSubtaskSubmit} className="flex gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Add breakdown point (+15 XP)..."
                    value={subtaskTitleInput}
                    onChange={(e) => setSubtaskTitleInput(e.target.value)}
                    className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[var(--accent)]"
                  />
                  <button
                    type="submit"
                    className="px-3 rounded-lg bg-accent-gradient text-white border border-white/10 cursor-pointer flex items-center justify-center font-bold text-xs"
                  >
                    Add
                  </button>
                </form>
              </div>

              {/* Bottom Delete controls */}
              <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                <button
                  onClick={() => {
                    if (confirm("Are you sure you want to delete this task?")) {
                      deleteTask(activeTask.id);
                      setActiveTask(null);
                    }
                  }}
                  className="px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-bold border border-red-500/20 flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Trash2 size={13} />
                  <span>Delete Task</span>
                </button>

                <div className="flex gap-2">
                  {(["todo", "in_progress", "done"] as const).map((s) => {
                    if (s === activeTask.status) return null;
                    return (
                      <button
                        key={s}
                        onClick={() => {
                          moveTask(activeTask.id, s);
                          const updated = useProductivityStore.getState().tasks.find((t) => t.id === activeTask.id);
                          if (updated) setActiveTask(updated);
                        }}
                        className="px-2.5 py-1.5 rounded bg-white/5 hover:bg-white/10 text-[10px] text-white border border-white/5 cursor-pointer capitalize"
                      >
                        Set: {s.replace("_", " ")}
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
