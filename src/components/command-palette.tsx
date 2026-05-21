"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useProductivityStore, ThemeType } from "@/store/useProductivityStore";
import { Search, Compass, Palette, ShieldAlert, Sparkles, CheckSquare, Plus, RefreshCw, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export default function CommandPalette() {
  const router = useRouter();
  const { theme, setTheme, resetAllData, addTask } = useProductivityStore();
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Monitor toggle shortcut (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Autofocus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSearch("");
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const items = [
    // Navigation
    { id: "nav-dash", label: "Go to Focus Dashboard", category: "Navigation", icon: <Compass size={16} />, action: () => router.push("/dashboard") },
    { id: "nav-tasks", label: "Go to Smart Tasks Board", category: "Navigation", icon: <Compass size={16} />, action: () => router.push("/dashboard/tasks") },
    { id: "nav-timer", label: "Go to Advanced Pomodoro", category: "Navigation", icon: <Compass size={16} />, action: () => router.push("/dashboard/timer") },
    { id: "nav-analytics", label: "Go to Productivity Analytics", category: "Navigation", icon: <Compass size={16} />, action: () => router.push("/dashboard/analytics") },
    { id: "nav-notes", label: "Go to Markdown Notes & Brain Dump", category: "Navigation", icon: <Compass size={16} />, action: () => router.push("/dashboard/notes") },
    { id: "nav-cal", label: "Go to Calendar Planner", category: "Navigation", icon: <Compass size={16} />, action: () => router.push("/dashboard/calendar") },
    { id: "nav-settings", label: "Go to Visual Settings", category: "Navigation", icon: <Compass size={16} />, action: () => router.push("/dashboard/settings") },
    { id: "nav-profile", label: "Go to Gamification Profile", category: "Navigation", icon: <Compass size={16} />, action: () => router.push("/dashboard/profile") },

    // Themes
    { id: "theme-mid", label: "Switch to Theme: Midnight Nebula", category: "Appearance", icon: <Palette size={16} />, action: () => setTheme("midnight") },
    { id: "theme-sun", label: "Switch to Theme: Sunset Synth", category: "Appearance", icon: <Palette size={16} />, action: () => setTheme("sunset") },
    { id: "theme-cyber", label: "Switch to Theme: Cyberpunk Grid", category: "Appearance", icon: <Palette size={16} />, action: () => setTheme("cyberpunk") },
    { id: "theme-aura", label: "Switch to Theme: Aura Glow", category: "Appearance", icon: <Palette size={16} />, action: () => setTheme("aura") },

    // Actions
    {
      id: "act-task",
      label: "Create Quick High-Priority Task",
      category: "Actions",
      icon: <Plus size={16} />,
      action: () => {
        addTask({
          title: "Quick Scheduled Flow Task",
          description: "Created via Command Palette trigger.",
          status: "todo",
          priority: "high",
          dueDate: new Date().toISOString().split("T")[0],
          tags: ["Inbox"],
          subtasks: [],
          recurrence: "none"
        });
        alert("Quick high-priority task created!");
      }
    },
    {
      id: "act-reset",
      label: "Reset All Local Storage Settings & Data",
      category: "System",
      icon: <RefreshCw size={16} />,
      action: () => {
        if (confirm("Are you sure you want to restore default demo configurations? This will wipe your active database.")) {
          resetAllData();
          window.location.reload();
        }
      }
    }
  ];

  // Filter items based on search
  const filtered = items.filter((item) =>
    item.label.toLowerCase().includes(search.toLowerCase()) ||
    item.category.toLowerCase().includes(search.toLowerCase())
  );

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsOpen(false);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filtered.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filtered.length) % filtered.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filtered[selectedIndex]) {
        filtered[selectedIndex].action();
        setIsOpen(false);
      }
    }
  };

  // Scroll active item into view
  useEffect(() => {
    const listElement = scrollContainerRef.current;
    if (listElement) {
      const activeElement = listElement.children[selectedIndex] as HTMLElement;
      if (activeElement) {
        const listHeight = listElement.clientHeight;
        const activeTop = activeElement.offsetTop;
        const activeHeight = activeElement.clientHeight;

        if (activeTop + activeHeight > listElement.scrollTop + listHeight) {
          listElement.scrollTop = activeTop + activeHeight - listHeight;
        } else if (activeTop < listElement.scrollTop) {
          listElement.scrollTop = activeTop;
        }
      }
    }
  }, [selectedIndex]);

  return (
    <>
      {/* Visual Keyboard Indicator floating bottom right */}
      <div
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 px-3 py-2 rounded-lg glass-panel text-[11px] text-[var(--text-muted)] hover:text-white flex items-center gap-1.5 cursor-pointer shadow-xl z-40 select-none hidden md:flex"
      >
        <span className="font-mono bg-white/5 border border-white/10 px-1.5 py-0.5 rounded text-[10px]">Ctrl</span>
        <span>+</span>
        <span className="font-mono bg-white/5 border border-white/10 px-1.5 py-0.5 rounded text-[10px]">K</span>
        <span className="ml-1 text-[var(--accent)] font-medium">Command Bar</span>
      </div>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-28 px-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.2 }}
              onKeyDown={handleKeyDown}
              className="relative w-full max-w-xl glass-panel rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[460px] border border-white/10 bg-black/40"
            >
              {/* Search input header */}
              <div className="flex items-center px-4 py-3.5 border-b border-white/5">
                <Search className="text-[var(--text-muted)] mr-3" size={18} />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Type a command or search pages..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setSelectedIndex(0);
                  }}
                  className="w-full bg-transparent border-0 outline-none text-white text-sm placeholder-white/30"
                />
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded bg-white/5 hover:bg-white/10 text-[var(--text-muted)] hover:text-white transition-colors cursor-pointer"
                >
                  <X size={14} />
                </button>
              </div>

              {/* Items List */}
              <div
                ref={scrollContainerRef}
                className="flex-1 overflow-y-auto p-2 no-scrollbar"
              >
                {filtered.length > 0 ? (
                  filtered.map((item, idx) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        item.action();
                        setIsOpen(false);
                      }}
                      className={cn(
                        "w-full px-3 py-2.5 rounded-lg flex items-center justify-between cursor-pointer transition-all text-xs font-medium select-none mb-0.5",
                        idx === selectedIndex
                          ? "bg-accent-gradient text-white shadow-md"
                          : "text-[var(--foreground)] hover:bg-white/5 hover:text-white"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <span className={cn(idx === selectedIndex ? "text-white" : "text-[var(--accent)]")}>
                          {item.icon}
                        </span>
                        <span>{item.label}</span>
                      </div>
                      <span className={cn(
                        "text-[10px] uppercase tracking-wider px-2 py-0.5 rounded",
                        idx === selectedIndex
                          ? "bg-white/20 text-white"
                          : "bg-white/5 text-[var(--text-muted)]"
                      )}>
                        {item.category}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-xs text-[var(--text-muted)] flex flex-col items-center gap-2">
                    <ShieldAlert size={24} className="text-white/20" />
                    <span>No commands matching &ldquo;{search}&rdquo; found.</span>
                  </div>
                )}
              </div>

              {/* Navigation Footer footer */}
              <div className="px-4 py-2 border-t border-white/5 text-[10px] text-[var(--text-muted)] flex items-center justify-between bg-black/20 select-none">
                <div className="flex items-center gap-4">
                  <span>
                    <kbd className="font-mono bg-white/5 px-1 py-0.5 rounded border border-white/10">↑↓</kbd> Navigate
                  </span>
                  <span>
                    <kbd className="font-mono bg-white/5 px-1 py-0.5 rounded border border-white/10">Enter</kbd> Select
                  </span>
                  <span>
                    <kbd className="font-mono bg-white/5 px-1 py-0.5 rounded border border-white/10">Esc</kbd> Close
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Sparkles size={10} className="text-[var(--accent)]" />
                  <span>AntiGravity Flow OS</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
