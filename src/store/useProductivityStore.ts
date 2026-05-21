import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: "inbox" | "todo" | "in_progress" | "done";
  priority: "low" | "medium" | "high";
  dueDate: string;
  tags: string[];
  subtasks: Subtask[];
  recurrence: "none" | "daily" | "weekly";
  completedAt: string | null;
}

export interface Habit {
  id: string;
  title: string;
  completedDays: string[]; // array of "YYYY-MM-DD"
  streak: number;
  lastCompleted: string | null;
}

export interface WeeklyGoal {
  id: string;
  title: string;
  completed: boolean;
}

export interface FocusSession {
  id: string;
  timestamp: string;
  duration: number; // in seconds
  mode: "focus" | "short_break" | "long_break";
  completed: boolean;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  pinned: boolean;
  updatedAt: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt: string | null;
}

export type ThemeType = "midnight" | "sunset" | "cyberpunk" | "aura";

interface ProductivityState {
  // Profile & Gamification
  userName: string;
  xp: number;
  level: number;
  streak: number;
  lastActiveDate: string | null;
  achievements: Achievement[];
  
  // Tasks
  tasks: Task[];
  
  // Checklist & Habits
  habits: Habit[];
  weeklyGoals: WeeklyGoal[];
  
  // Pomodoro Timer
  timerMode: "focus" | "short_break" | "long_break";
  duration: number;
  isRunning: boolean;
  isDeepFocus: boolean;
  presets: {
    focus: number; // in minutes
    short_break: number;
    long_break: number;
  };
  ambientSound: "none" | "rain" | "cafe" | "white_noise" | "ocean" | "forest";
  audioVolume: number;
  timerHistory: FocusSession[];

  // Notes
  notes: Note[];
  activeNoteId: string | null;

  // Configuration
  theme: ThemeType;
  cursorEffect: boolean;

  // Actions - Gamification
  setUserName: (name: string) => void;
  addXP: (amount: number) => void;
  checkStreak: () => void;
  unlockAchievement: (id: string) => void;

  // Actions - Tasks
  addTask: (task: Omit<Task, "id" | "completedAt">) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleSubtask: (taskId: string, subtaskId: string) => void;
  addSubtask: (taskId: string, title: string) => void;
  moveTask: (id: string, status: Task["status"]) => void;

  // Actions - Habits & Weekly Goals
  addHabit: (title: string) => void;
  toggleHabit: (id: string, dateStr: string) => void;
  deleteHabit: (id: string) => void;
  addWeeklyGoal: (title: string) => void;
  toggleWeeklyGoal: (id: string) => void;
  deleteWeeklyGoal: (id: string) => void;

  // Actions - Pomodoro Timer
  setTimerMode: (mode: "focus" | "short_break" | "long_break") => void;
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  tickTimer: () => void;
  setPresets: (presets: { focus: number; short_break: number; long_break: number }) => void;
  setAmbientSound: (sound: ProductivityState["ambientSound"]) => void;
  setAudioVolume: (volume: number) => void;
  setDeepFocus: (isDeep: boolean) => void;
  logSession: (session: Omit<FocusSession, "id">) => void;

  // Actions - Notes
  addNote: (title: string, content: string, tags?: string[]) => void;
  updateNote: (id: string, title: string, content: string, tags?: string[]) => void;
  deleteNote: (id: string) => void;
  togglePinNote: (id: string) => void;
  setActiveNoteId: (id: string | null) => void;

  // Actions - Global
  setTheme: (theme: ThemeType) => void;
  setCursorEffect: (enabled: boolean) => void;
  resetAllData: () => void;
}

const INITIAL_ACHIEVEMENTS: Achievement[] = [
  { id: "first_task", title: "First Step", description: "Complete your first task", icon: "🚀", unlocked: false, unlockedAt: null },
  { id: "deep_dive", title: "Deep Diver", description: "Complete a Pomodoro session in Deep Focus mode", icon: "🤿", unlocked: false, unlockedAt: null },
  { id: "streak_3", title: "Consistency is Key", description: "Maintain a 3-day productivity streak", icon: "🔥", unlocked: false, unlockedAt: null },
  { id: "habit_master", title: "Habit Builder", description: "Complete a habit 5 times", icon: "💪", unlocked: false, unlockedAt: null },
  { id: "level_5", title: "Ascended Scholar", description: "Reach Level 5", icon: "👑", unlocked: false, unlockedAt: null }
];

const INITIAL_TASKS: Task[] = [
  {
    id: "task-1",
    title: "Configure AntiGravity visual workspace layouts",
    description: "Structure layout, CSS properties, variables and glassmorphism elements.",
    status: "in_progress",
    priority: "high",
    dueDate: new Date().toISOString().split("T")[0],
    tags: ["UI", "Design"],
    subtasks: [
      { id: "sub-1-1", title: "Define custom HSL color palettes for Midnight, Sunset, and Cyberpunk themes", completed: true },
      { id: "sub-1-2", title: "Implement smooth sidebar collapsing animations", completed: false },
      { id: "sub-1-3", title: "Build glassmorphic navigation header component", completed: false }
    ],
    recurrence: "none",
    completedAt: null
  },
  {
    id: "task-2",
    title: "Verify Next.js build compilation pipeline",
    description: "Ensure zero lint or typescript errors inside our modern App Router workspace.",
    status: "todo",
    priority: "medium",
    dueDate: new Date(Date.now() + 86400000).toISOString().split("T")[0],
    tags: ["Dev", "Quality"],
    subtasks: [
      { id: "sub-2-1", title: "Test dev server locally using standard commands", completed: false },
      { id: "sub-2-2", title: "Run npm run lint to identify layout problems", completed: false }
    ],
    recurrence: "none",
    completedAt: null
  },
  {
    id: "task-3",
    title: "Prepare detailed productivity analytics presentation",
    description: "Generate structured datasets representing total focus hours and weekly completion distributions.",
    status: "done",
    priority: "low",
    dueDate: new Date(Date.now() - 86400000).toISOString().split("T")[0],
    tags: ["Business", "Reports"],
    subtasks: [
      { id: "sub-3-1", title: "Consolidate charts using Recharts responsive tools", completed: true }
    ],
    recurrence: "none",
    completedAt: new Date().toISOString()
  }
];

const INITIAL_HABITS: Habit[] = [
  { id: "habit-1", title: "45-min Deep Focus Block", completedDays: [], streak: 0, lastCompleted: null },
  { id: "habit-2", title: "Plan Out Daily Planner Agenda", completedDays: [], streak: 0, lastCompleted: null },
  { id: "habit-3", title: "Perform 15-min Evening Review", completedDays: [], streak: 0, lastCompleted: null }
];

const INITIAL_GOALS: WeeklyGoal[] = [
  { id: "goal-1", title: "Complete 10 focused Pomodoro intervals", completed: false },
  { id: "goal-2", title: "Clear out all inbox tasks", completed: true },
  { id: "goal-3", title: "Synthesize 3 distinct Markdown notes", completed: false }
];

const INITIAL_NOTES: Note[] = [
  {
    id: "note-1",
    title: "🚀 AntiGravity Core Concepts & Design Spec",
    content: `# AntiGravity Productivity OS

Welcome to your bespoke workspace. This system relies on continuous tracking:
- **XP gamification mechanisms** keeping focus motivating.
- **Glassmorphic ambient layout design** minimizing visual noise.
- **Deep Focus Mode** shutting out external triggers.

## Keyboard Shortcuts
- \`Cmd / Ctrl + K\` opens the Command Palette
- \`Spacebar\` pauses or plays the Pomodoro countdown
- \`Esc\` exits fullscreen Deep Focus overlays
`,
    tags: ["Info", "Guide"],
    pinned: true,
    updatedAt: new Date().toISOString()
  },
  {
    id: "note-2",
    title: "💡 Future Features Brainstorming",
    content: `# Ideas for Next Updates
1. Add Spotify Web SDK authorization triggers.
2. Synchronize active state indices with a backend.
3. Incorporate a real-time focus buddy leaderboard mockup.
`,
    tags: ["Ideas"],
    pinned: false,
    updatedAt: new Date(Date.now() - 3600000).toISOString()
  }
];

export const useProductivityStore = create<ProductivityState>()(
  persist(
    (set, get) => ({
      userName: "Creative Innovator",
      xp: 0,
      level: 1,
      streak: 3,
      lastActiveDate: new Date().toISOString().split("T")[0],
      achievements: INITIAL_ACHIEVEMENTS,
      tasks: INITIAL_TASKS,
      habits: INITIAL_HABITS,
      weeklyGoals: INITIAL_GOALS,
      timerMode: "focus",
      duration: 25 * 60,
      isRunning: false,
      isDeepFocus: false,
      presets: {
        focus: 25,
        short_break: 5,
        long_break: 15
      },
      ambientSound: "none",
      audioVolume: 0.5,
      timerHistory: [],
      notes: INITIAL_NOTES,
      activeNoteId: "note-1",
      theme: "midnight",
      cursorEffect: true,

      // Gamification Actions
      setUserName: (userName) => set({ userName }),
      
      addXP: (amount) => {
        const currentXP = get().xp + amount;
        // Level formula: floor(sqrt(xp / 100)) + 1
        const newLevel = Math.floor(Math.sqrt(currentXP / 100)) + 1;
        const currentLevel = get().level;
        
        let levelUpTriggered = false;
        if (newLevel > currentLevel) {
          levelUpTriggered = true;
          // check achievements
          if (newLevel >= 5) {
            get().unlockAchievement("level_5");
          }
        }
        
        set({
          xp: currentXP,
          level: newLevel
        });

        // Trigger standard browser window custom event for level up toasts
        if (levelUpTriggered && typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("level-up", { detail: { level: newLevel } }));
        }
      },

      checkStreak: () => {
        const todayStr = new Date().toISOString().split("T")[0];
        const lastActive = get().lastActiveDate;
        if (!lastActive) {
          set({ lastActiveDate: todayStr, streak: 1 });
          return;
        }

        if (lastActive === todayStr) return;

        const lastDate = new Date(lastActive);
        const todayDate = new Date(todayStr);
        const diffTime = Math.abs(todayDate.getTime() - lastDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
          const newStreak = get().streak + 1;
          set({ streak: newStreak, lastActiveDate: todayStr });
          get().addXP(10 * newStreak); // Streak streak bonus!
          if (newStreak >= 3) {
            get().unlockAchievement("streak_3");
          }
        } else if (diffDays > 1) {
          set({ streak: 1, lastActiveDate: todayStr });
        }
      },

      unlockAchievement: (id) => {
        const todayStr = new Date().toISOString().split("T")[0];
        const updated = get().achievements.map((ach) => {
          if (ach.id === id && !ach.unlocked) {
            if (typeof window !== "undefined") {
              window.dispatchEvent(new CustomEvent("achievement-unlocked", { detail: { title: ach.title } }));
            }
            return { ...ach, unlocked: true, unlockedAt: todayStr };
          }
          return ach;
        });
        set({ achievements: updated });
      },

      // Tasks Actions
      addTask: (taskData) => {
        const newTask: Task = {
          ...taskData,
          id: `task-${Date.now()}`,
          completedAt: null
        };
        set((state) => ({
          tasks: [newTask, ...state.tasks]
        }));
      },

      updateTask: (id, updates) => {
        set((state) => {
          const wasCompleted = state.tasks.find(t => t.id === id)?.status === "done";
          const updatedTasks = state.tasks.map((task) => {
            if (task.id === id) {
              const newStatus = updates.status !== undefined ? updates.status : task.status;
              const isCompletedNow = newStatus === "done";
              let completedAt = task.completedAt;

              if (isCompletedNow && !wasCompleted) {
                completedAt = new Date().toISOString();
                // Add XP!
                setTimeout(() => {
                  get().addXP(50);
                  get().unlockAchievement("first_task");
                }, 0);
              } else if (!isCompletedNow && wasCompleted) {
                completedAt = null;
              }

              return { ...task, ...updates, completedAt };
            }
            return task;
          });
          return { tasks: updatedTasks };
        });
      },

      deleteTask: (id) => {
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== id)
        }));
      },

      toggleSubtask: (taskId, subtaskId) => {
        set((state) => {
          const updatedTasks = state.tasks.map((task) => {
            if (task.id === taskId) {
              const updatedSubtasks = task.subtasks.map((sub) => {
                if (sub.id === subtaskId) {
                  const nowCompleted = !sub.completed;
                  if (nowCompleted) {
                    setTimeout(() => get().addXP(15), 0);
                  }
                  return { ...sub, completed: nowCompleted };
                }
                return sub;
              });
              
              // Automatically mark task complete if all subtasks are complete and it wasn't done yet?
              // Let's keep it manual, but update state
              return { ...task, subtasks: updatedSubtasks };
            }
            return task;
          });
          return { tasks: updatedTasks };
        });
      },

      addSubtask: (taskId, title) => {
        const newSub: Subtask = {
          id: `sub-${Date.now()}`,
          title,
          completed: false
        };
        set((state) => ({
          tasks: state.tasks.map((task) => {
            if (task.id === taskId) {
              return { ...task, subtasks: [...task.subtasks, newSub] };
            }
            return task;
          })
        }));
      },

      moveTask: (id, status) => {
        get().updateTask(id, { status });
      },

      // Habits Actions
      addHabit: (title) => {
        const newHabit: Habit = {
          id: `habit-${Date.now()}`,
          title,
          completedDays: [],
          streak: 0,
          lastCompleted: null
        };
        set((state) => ({
          habits: [...state.habits, newHabit]
        }));
      },

      toggleHabit: (id, dateStr) => {
        set((state) => {
          const updatedHabits = state.habits.map((habit) => {
            if (habit.id === id) {
              const isCompleted = habit.completedDays.includes(dateStr);
              let completedDays = [...habit.completedDays];
              let streak = habit.streak;
              
              if (isCompleted) {
                completedDays = completedDays.filter((d) => d !== dateStr);
                // recalculate streak (simple reset or backtrace)
                streak = Math.max(0, streak - 1);
              } else {
                completedDays.push(dateStr);
                
                // Add XP!
                setTimeout(() => {
                  get().addXP(25);
                }, 0);

                // calculate streak
                const yesterday = new Date(new Date(dateStr).getTime() - 86400000).toISOString().split("T")[0];
                if (habit.lastCompleted === yesterday || habit.streak === 0) {
                  streak += 1;
                } else if (habit.lastCompleted !== dateStr) {
                  streak = 1;
                }
                
                if (streak >= 5) {
                  setTimeout(() => get().unlockAchievement("habit_master"), 0);
                }
              }

              return {
                ...habit,
                completedDays,
                streak,
                lastCompleted: isCompleted ? (completedDays.length > 0 ? completedDays[completedDays.length - 1] : null) : dateStr
              };
            }
            return habit;
          });
          return { habits: updatedHabits };
        });
      },

      deleteHabit: (id) => {
        set((state) => ({
          habits: state.habits.filter((h) => h.id !== id)
        }));
      },

      addWeeklyGoal: (title) => {
        const newGoal: WeeklyGoal = {
          id: `goal-${Date.now()}`,
          title,
          completed: false
        };
        set((state) => ({
          weeklyGoals: [...state.weeklyGoals, newGoal]
        }));
      },

      toggleWeeklyGoal: (id) => {
        set((state) => {
          const updated = state.weeklyGoals.map((g) => {
            if (g.id === id) {
              const nextVal = !g.completed;
              if (nextVal) {
                setTimeout(() => get().addXP(30), 0);
              }
              return { ...g, completed: nextVal };
            }
            return g;
          });
          return { weeklyGoals: updated };
        });
      },

      deleteWeeklyGoal: (id) => {
        set((state) => ({
          weeklyGoals: state.weeklyGoals.filter((g) => g.id !== id)
        }));
      },

      // Pomodoro Timer Actions
      setTimerMode: (timerMode) => {
        const presets = get().presets;
        let duration = presets.focus * 60;
        if (timerMode === "short_break") duration = presets.short_break * 60;
        if (timerMode === "long_break") duration = presets.long_break * 60;

        set({
          timerMode,
          duration,
          isRunning: false
        });
      },

      startTimer: () => set({ isRunning: true }),
      
      pauseTimer: () => set({ isRunning: false }),
      
      resetTimer: () => {
        const { timerMode, presets } = get();
        let duration = presets.focus * 60;
        if (timerMode === "short_break") duration = presets.short_break * 60;
        if (timerMode === "long_break") duration = presets.long_break * 60;

        set({
          duration,
          isRunning: false
        });
      },

      tickTimer: () => {
        const { duration, isRunning, timerMode } = get();
        if (!isRunning) return;

        if (duration <= 1) {
          // Timer finished!
          const logItem: FocusSession = {
            id: `session-${Date.now()}`,
            timestamp: new Date().toISOString(),
            duration: get().presets[timerMode === "focus" ? "focus" : timerMode === "short_break" ? "short_break" : "long_break"] * 60,
            mode: timerMode,
            completed: true
          };

          get().logSession(logItem);

          if (timerMode === "focus") {
            // Reward focus XP
            setTimeout(() => {
              get().addXP(100);
              if (get().isDeepFocus) {
                get().unlockAchievement("deep_dive");
              }
            }, 0);

            // Auto-switch to break
            get().setTimerMode("short_break");
          } else {
            // Switch back to focus
            get().setTimerMode("focus");
          }

          if (typeof window !== "undefined") {
            // Dispatch window sound alerts
            window.dispatchEvent(new CustomEvent("timer-complete", { detail: { mode: timerMode } }));
          }
        } else {
          set({ duration: duration - 1 });
        }
      },

      setPresets: (presets) => {
        const currentMode = get().timerMode;
        let nextDuration = presets.focus * 60;
        if (currentMode === "short_break") nextDuration = presets.short_break * 60;
        if (currentMode === "long_break") nextDuration = presets.long_break * 60;

        set({
          presets,
          duration: nextDuration,
          isRunning: false
        });
      },

      setAmbientSound: (ambientSound) => set({ ambientSound }),
      
      setAudioVolume: (audioVolume) => set({ audioVolume }),
      
      setDeepFocus: (isDeepFocus) => set({ isDeepFocus }),
      
      logSession: (session) => {
        const newSession: FocusSession = {
          ...session,
          id: `session-${Date.now()}`
        };
        set((state) => ({
          timerHistory: [newSession, ...state.timerHistory]
        }));
      },

      // Notes Actions
      addNote: (title, content, tags = []) => {
        const newNote: Note = {
          id: `note-${Date.now()}`,
          title,
          content,
          tags,
          pinned: false,
          updatedAt: new Date().toISOString()
        };
        set((state) => ({
          notes: [newNote, ...state.notes],
          activeNoteId: newNote.id
        }));
      },

      updateNote: (id, title, content, tags) => {
        set((state) => ({
          notes: state.notes.map((note) => {
            if (note.id === id) {
              return {
                ...note,
                title,
                content,
                tags: tags !== undefined ? tags : note.tags,
                updatedAt: new Date().toISOString()
              };
            }
            return note;
          })
        }));
      },

      deleteNote: (id) => {
        set((state) => {
          const nextNotes = state.notes.filter((n) => n.id !== id);
          let nextActiveId = state.activeNoteId;
          if (nextActiveId === id) {
            nextActiveId = nextNotes.length > 0 ? nextNotes[0].id : null;
          }
          return {
            notes: nextNotes,
            activeNoteId: nextActiveId
          };
        });
      },

      togglePinNote: (id) => {
        set((state) => ({
          notes: state.notes.map((note) => {
            if (note.id === id) {
              return { ...note, pinned: !note.pinned };
            }
            return note;
          })
        }));
      },

      setActiveNoteId: (activeNoteId) => set({ activeNoteId }),

      // Global Config
      setTheme: (theme) => set({ theme }),
      setCursorEffect: (cursorEffect) => set({ cursorEffect }),

      resetAllData: () => {
        set({
          userName: "Creative Innovator",
          xp: 0,
          level: 1,
          streak: 0,
          lastActiveDate: new Date().toISOString().split("T")[0],
          achievements: INITIAL_ACHIEVEMENTS.map(a => ({ ...a, unlocked: false, unlockedAt: null })),
          tasks: INITIAL_TASKS,
          habits: INITIAL_HABITS,
          weeklyGoals: INITIAL_GOALS,
          timerMode: "focus",
          duration: 25 * 60,
          isRunning: false,
          isDeepFocus: false,
          presets: { focus: 25, short_break: 5, long_break: 15 },
          ambientSound: "none",
          audioVolume: 0.5,
          timerHistory: [],
          notes: INITIAL_NOTES,
          activeNoteId: "note-1",
          theme: "midnight",
          cursorEffect: true
        });
      }
    }),
    {
      name: "antigravity-productivity-state",
      partialize: (state) => ({
        userName: state.userName,
        xp: state.xp,
        level: state.level,
        streak: state.streak,
        lastActiveDate: state.lastActiveDate,
        achievements: state.achievements,
        tasks: state.tasks,
        habits: state.habits,
        weeklyGoals: state.weeklyGoals,
        presets: state.presets,
        ambientSound: state.ambientSound,
        audioVolume: state.audioVolume,
        timerHistory: state.timerHistory,
        notes: state.notes,
        activeNoteId: state.activeNoteId,
        theme: state.theme,
        cursorEffect: state.cursorEffect
      })
    }
  )
);
