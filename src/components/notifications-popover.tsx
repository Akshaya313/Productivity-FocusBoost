"use client";

import React, { useState, useEffect, useRef } from "react";
import { useProductivityStore } from "@/store/useProductivityStore";
import { 
  Bell, 
  CheckSquare, 
  Flame, 
  Trophy, 
  Check, 
  X, 
  ExternalLink,
  Sparkles,
  AlertTriangle,
  Clock
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  type: "task" | "streak" | "achievement" | "timer" | "system";
  time: string;
  unread: boolean;
  href?: string;
}

export default function NotificationsPopover() {
  const router = useRouter();
  const { tasks, streak, level, xp, achievements, timerHistory } = useProductivityStore();
  const [isOpen, setIsOpen] = useState(false);
  const [readIds, setReadIds] = useState<string[]>([]);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Derive dynamic notifications based on real app state
  const notifications: NotificationItem[] = [];

  // 1. High priority or pending task alerts
  const highPriorityTask = tasks.find((t) => t.status !== "done" && t.priority === "high");
  if (highPriorityTask) {
    notifications.push({
      id: `task-high-${highPriorityTask.id}`,
      title: "High Priority Task Pending",
      description: `"${highPriorityTask.title}" requires your attention.`,
      type: "task",
      time: "Just now",
      unread: !readIds.includes(`task-high-${highPriorityTask.id}`),
      href: "/dashboard/tasks"
    });
  }

  const activeTaskCount = tasks.filter((t) => t.status !== "done").length;
  if (activeTaskCount > 0) {
    notifications.push({
      id: "tasks-active-summary",
      title: "Smart Backlog Status",
      description: `You have ${activeTaskCount} active ${activeTaskCount === 1 ? "task" : "tasks"} waiting in your workspace.`,
      type: "task",
      time: "Today",
      unread: !readIds.includes("tasks-active-summary"),
      href: "/dashboard/tasks"
    });
  }

  // 2. Streak notification
  if (streak > 0) {
    notifications.push({
      id: "streak-status",
      title: "Focus Streak Active!",
      description: `🔥 You are on a ${streak}-day productivity streak. Complete tasks today to keep it burning!`,
      type: "streak",
      time: "Active",
      unread: !readIds.includes("streak-status"),
      href: "/dashboard/profile"
    });
  }

  // 3. Level & RPG notification
  notifications.push({
    id: "level-rpg-status",
    title: `Level ${level} Explorer`,
    description: `Currently at ${xp} XP. Complete Pomodoro sessions and tasks to ascend levels!`,
    type: "achievement",
    time: "Ongoing",
    unread: !readIds.includes("level-rpg-status"),
    href: "/dashboard/profile"
  });

  // 4. Focus Session history log notification
  const focusSessions = timerHistory.filter((s) => s.mode === "focus");
  if (focusSessions.length > 0) {
    notifications.push({
      id: "timer-summary",
      title: "Focus Pomodoro Logged",
      description: `You have completed ${focusSessions.length} deep focus sessions so far!`,
      type: "timer",
      time: "Recent",
      unread: !readIds.includes("timer-summary"),
      href: "/dashboard/timer"
    });
  }

  const unreadCount = notifications.filter((n) => n.unread).length;

  const handleMarkAllRead = () => {
    setReadIds(notifications.map((n) => n.id));
  };

  const handleItemClick = (item: NotificationItem) => {
    if (!readIds.includes(item.id)) {
      setReadIds((prev) => [...prev, item.id]);
    }
    setIsOpen(false);
    if (item.href) {
      router.push(item.href);
    }
  };

  const getIcon = (type: NotificationItem["type"]) => {
    switch (type) {
      case "task":
        return <CheckSquare size={14} className="text-purple-400" />;
      case "streak":
        return <Flame size={14} className="text-orange-400" />;
      case "achievement":
        return <Trophy size={14} className="text-yellow-400" />;
      case "timer":
        return <Clock size={14} className="text-sky-400" />;
      default:
        return <Sparkles size={14} className="text-[var(--accent)]" />;
    }
  };

  return (
    <div className="relative" ref={popoverRef}>
      {/* Bell Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-[var(--text-muted)] hover:text-white transition-colors cursor-pointer relative"
        title="Notifications"
      >
        <Bell size={15} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 px-1.5 py-0.2 min-w-[14px] h-[14px] rounded-full bg-accent-gradient text-white font-bold text-[9px] flex items-center justify-center border border-black shadow">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Popover Menu Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-80 sm:w-96 glass-panel rounded-2xl border border-white/10 bg-black/90 shadow-2xl overflow-hidden z-50 text-left select-none"
          >
            {/* Header */}
            <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/2">
              <div className="flex items-center gap-2">
                <Bell size={14} className="text-[var(--accent)]" />
                <span className="text-xs font-bold text-white">Notifications & Activity</span>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-white/10 text-[10px] font-mono text-[var(--accent)]">
                    {unreadCount} new
                  </span>
                )}
              </div>

              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="text-[10px] text-[var(--accent)] font-semibold hover:underline cursor-pointer flex items-center gap-1"
                >
                  <Check size={11} />
                  <span>Mark all read</span>
                </button>
              )}
            </div>

            {/* Notification items list */}
            <div className="max-h-80 overflow-y-auto no-scrollbar p-2 flex flex-col gap-1">
              {notifications.length > 0 ? (
                notifications.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleItemClick(item)}
                    className={cn(
                      "p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 relative group",
                      item.unread
                        ? "bg-white/5 border-white/10 hover:bg-white/10"
                        : "bg-transparent border-transparent hover:bg-white/5 opacity-70"
                    )}
                  >
                    <div className="p-2 rounded-lg bg-black/30 border border-white/5 shrink-0 mt-0.5">
                      {getIcon(item.type)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-white truncate">{item.title}</span>
                        <span className="text-[9px] text-[var(--text-muted)] font-mono shrink-0">{item.time}</span>
                      </div>
                      <p className="text-[11px] text-[var(--text-muted)] mt-0.5 leading-snug">
                        {item.description}
                      </p>
                    </div>

                    {item.unread && (
                      <span className="w-2 h-2 rounded-full bg-[var(--accent)] shrink-0 mt-2" />
                    )}
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-xs text-[var(--text-muted)] flex flex-col items-center gap-2">
                  <Bell size={20} className="opacity-30" />
                  <span>No notifications right now</span>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-white/5 bg-black/20 text-center">
              <span className="text-[10px] text-[var(--text-muted)] flex items-center justify-center gap-1">
                <Sparkles size={10} className="text-[var(--accent)]" />
                <span>FocusBoost Smart Workspace Alerts</span>
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
