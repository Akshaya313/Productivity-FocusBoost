"use client";

import React, { useState, useEffect, useRef } from "react";
import { Sparkles, MessageSquare, X, Send, Bot, User, BrainCircuit, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useProductivityStore } from "@/store/useProductivityStore";

interface Message {
  id: string;
  sender: "ai" | "user";
  text: string;
  timestamp: string;
}

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const { tasks, timerHistory, streak, level, userName } = useProductivityStore();

  // Scroll to bottom on message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Initial welcome message
  useEffect(() => {
    setMessages([
      {
        id: "msg-init",
        sender: "ai",
        text: `Greetings ${userName}! I am your FlowZone AI attention coach. I analyze your productivity patterns to prevent burnout and maximize focus. How can I guide you today?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  }, [userName]);

  const generateAIResponse = async (userText: string) => {
    setIsTyping(true);
    await new Promise((resolve) => setTimeout(resolve, 1200)); // Network delay simulation

    const textLower = userText.toLowerCase();
    let reply = "";

    const activeTasks = tasks.filter((t) => t.status !== "done");
    const completedTasks = tasks.filter((t) => t.status === "done");
    const totalFocusSecs = timerHistory.filter((s) => s.mode === "focus").reduce((acc, curr) => acc + curr.duration, 0);
    const totalFocusHrs = (totalFocusSecs / 3600).toFixed(1);

    if (textLower.includes("analyze") || textLower.includes("productivity") || textLower.includes("stats")) {
      reply = `Based on my analysis, you have completed **${completedTasks.length}** tasks out of **${tasks.length}** on your board. You have accumulated **${totalFocusHrs} hours** of deep focus. You are currently at **Level ${level}** with a **${streak}-day streak**. I recommend tackling one of your ${activeTasks.length} active tasks next to maintain your flow.`;
    } else if (textLower.includes("plan") || textLower.includes("focus") || textLower.includes("session")) {
      if (activeTasks.length > 0) {
        reply = `I've analyzed your backlog! You should start a **25-minute Pomodoro** session to work on your task: **"${activeTasks[0].title}"**. I suggest turning on the *Rain* ambient mixer sound and *Lo-Fi Study Beats* for maximum cognitive focus.`;
      } else {
        reply = `Your task board is completely cleared! Excellent job. I recommend setting up a short **15-minute Refuel Break** to let your mind wander before outlining new goals.`;
      }
    } else if (textLower.includes("critique") || textLower.includes("task") || textLower.includes("backlog")) {
      const highPriority = activeTasks.filter((t) => t.priority === "high");
      if (highPriority.length > 0) {
        reply = `Warning: You have **${highPriority.length} high-priority** tasks lingering in your backlog (including *"${highPriority[0].title}"*). I strongly recommend moving them to the 'In Progress' column immediately to prevent context-switching fatigue.`;
      } else {
        reply = `Your task prioritization is excellent! No urgent blockages. You have a balanced list of tasks with clean priorities.`;
      }
    } else {
      reply = `I hear you! To optimize your performance, remember that micro-breaks prevent focus fatigue. Would you like me to **analyze your stats**, **plan a focus session**, or **critique your backlog**?`;
    }

    setMessages((prev) => [
      ...prev,
      {
        id: `msg-${Date.now()}`,
        sender: "ai",
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    setIsTyping(false);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      sender: "user",
      text: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    generateAIResponse(userMessage.text);
  };

  return (
    <>
      {/* Floating Toggle Bubble Bubble */}
      <div className="fixed bottom-6 right-6 z-40 select-none">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-12 h-12 rounded-full bg-accent-gradient text-white flex items-center justify-center shadow-xl border border-white/20 hover:scale-105 active:scale-95 transition-all cursor-pointer border-accent-glow"
        >
          {isOpen ? <X size={20} /> : <BrainCircuit size={20} className="animate-pulse" />}
        </button>
      </div>

      {/* Assistant panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-20 right-6 w-[340px] h-[450px] bg-black/45 glass-panel border border-white/10 rounded-2xl shadow-2xl z-40 flex flex-col overflow-hidden text-left"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,var(--card-glow),transparent_65%)] pointer-events-none" />

            {/* Header info info */}
            <div className="p-4 border-b border-white/5 flex items-center justify-between z-10 bg-black/20">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-[var(--accent)]/15 text-[var(--accent)] border border-[var(--accent)]/20 animate-float">
                  <Bot size={16} />
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">Attention Catalyst Coach</span>
                  <span className="text-[9px] uppercase tracking-wider font-mono text-emerald-400 font-bold block mt-0.5">
                    ● Real-Time AI Synced
                  </span>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-[var(--text-muted)] hover:text-white cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Messages box */}
            <div className="flex-1 p-4 overflow-y-auto no-scrollbar flex flex-col gap-3 z-10">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 max-w-[85%] ${msg.sender === "user" ? "self-end flex-row-reverse" : "self-start"}`}
                >
                  <div className={`p-1.5 h-7 w-7 rounded-lg flex items-center justify-center shrink-0 border text-xs font-bold ${
                    msg.sender === "user" ? "bg-purple-500/10 text-purple-300 border-purple-500/20" : "bg-white/5 text-[var(--accent)] border-white/5"
                  }`}>
                    {msg.sender === "user" ? "U" : "AI"}
                  </div>
                  <div className={`p-3 rounded-xl text-[11px] leading-relaxed border ${
                    msg.sender === "user" 
                      ? "bg-purple-500/15 border-purple-500/20 text-purple-100 rounded-tr-none" 
                      : "bg-white/5 border-white/5 text-white rounded-tl-none"
                  }`}>
                    {msg.text}
                    <span className="text-[8px] text-[var(--text-muted)] block mt-1 text-right font-mono">
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex gap-2.5 max-w-[80%] self-start">
                  <div className="p-1.5 h-7 w-7 rounded-lg flex items-center justify-center bg-white/5 text-[var(--accent)] border border-white/5 text-xs">
                    AI
                  </div>
                  <div className="p-3 bg-white/5 border border-white/5 rounded-xl rounded-tl-none text-[11px] text-[var(--text-muted)] flex items-center gap-1.5">
                    <Loader2 size={12} className="animate-spin" />
                    <span>Analyzing FlowZone...</span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Quick Suggestion buttons */}
            <div className="px-4 py-2 border-t border-white/5 bg-black/15 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0 z-10 text-[9px] font-bold">
              <button
                onClick={() => generateAIResponse("Analyze my productivity stats")}
                disabled={isTyping}
                className="px-2.5 py-1 rounded bg-white/5 border border-white/5 text-[var(--text-muted)] hover:text-white hover:bg-white/10 cursor-pointer shrink-0 transition-colors"
              >
                📊 Analyze Stats
              </button>
              <button
                onClick={() => generateAIResponse("Plan focus session")}
                disabled={isTyping}
                className="px-2.5 py-1 rounded bg-white/5 border border-white/5 text-[var(--text-muted)] hover:text-white hover:bg-white/10 cursor-pointer shrink-0 transition-colors"
              >
                💡 Plan Session
              </button>
              <button
                onClick={() => generateAIResponse("Critique task backlog")}
                disabled={isTyping}
                className="px-2.5 py-1 rounded bg-white/5 border border-white/5 text-[var(--text-muted)] hover:text-white hover:bg-white/10 cursor-pointer shrink-0 transition-colors"
              >
                🎯 Critique Backlog
              </button>
            </div>

            {/* Input form */}
            <form onSubmit={handleSend} className="p-3 border-t border-white/5 bg-black/25 flex gap-2 shrink-0 z-10">
              <input
                type="text"
                required
                disabled={isTyping}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask your AI attention coach..."
                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white outline-none focus:border-[var(--accent)] transition-colors disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={isTyping}
                className="p-1.5 rounded-lg bg-accent-gradient text-white border border-white/10 cursor-pointer flex items-center justify-center transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                <Send size={13} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
