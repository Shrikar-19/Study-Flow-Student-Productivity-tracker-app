// src/context/AppContext.jsx
// WHY: We need global state so Tasks, Dashboard, Analytics can all share the same data
// without prop-drilling. This is the "single source of truth".

import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";

const AppContext = createContext(null);

const QUOTES = [
  "The secret of getting ahead is getting started. — Mark Twain",
  "Focus on being productive instead of busy. — Tim Ferriss",
  "Small daily improvements lead to staggering long-term results.",
  "Don't watch the clock; do what it does. Keep going. — Sam Levenson",
  "Success is the sum of small efforts repeated day in and day out.",
  "Your future is created by what you do today, not tomorrow.",
  "Study hard what interests you the most, in the most undisciplined way possible.",
];

// Helper: get today's date string YYYY-MM-DD
const today = () => new Date().toISOString().split("T")[0];

function load(key, fallback) {
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : fallback;
  } catch {
    return fallback;
  }
}

function save(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function AppProvider({ children }) {
  // Auth
  const [user, setUser] = useState(() => load("spt_user", null));
  const [darkMode, setDarkMode] = useState(() => load("spt_dark", false));

  // Tasks
  const [tasks, setTasks] = useState(() => load("spt_tasks", []));

  // Goals
  const [goals, setGoals] = useState(() => load("spt_goals", []));

  // Timetable: { Monday: [{subject, time, color}], ... }
  const [timetable, setTimetable] = useState(() =>
    load("spt_timetable", {
      Monday: [],
      Tuesday: [],
      Wednesday: [],
      Thursday: [],
      Friday: [],
      Saturday: [],
      Sunday: [],
    })
  );

  // Study sessions: [{date, minutes}]
  const [studySessions, setStudySessions] = useState(() =>
    load("spt_sessions", [])
  );

  // Pomodoro state (persistent across navigation)
  const defaultPomodoro = {
    mode: "focus",
    focusTime: 25,
    shortBreakTime: 5,
    longBreakTime: 15,
    seconds: 25 * 60,
    running: false,
    sessions: 0,
    hasLoggedSession: false,
  };
  const [pomodoro, setPomodoro] = useState(() =>
    load("spt_pomodoro", defaultPomodoro)
  );

  // Daily quote (changes per day)
  const [quote] = useState(
    () => QUOTES[new Date().getDay() % QUOTES.length]
  );

  // Persist to localStorage whenever state changes
  useEffect(() => { save("spt_tasks", tasks); }, [tasks]);
  useEffect(() => { save("spt_goals", goals); }, [goals]);
  useEffect(() => { save("spt_timetable", timetable); }, [timetable]);
  useEffect(() => { save("spt_sessions", studySessions); }, [studySessions]);
  useEffect(() => { save("spt_pomodoro", pomodoro); }, [pomodoro]);
  useEffect(() => { save("spt_dark", darkMode); }, [darkMode]);

  // Apply dark mode to <html>
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const audioContextRef = useRef(null);
  const alarmTimeoutRef = useRef(null);
  const alarmOscRef = useRef(null);

  const getAudioContext = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioContextRef.current.state === "suspended") {
      audioContextRef.current.resume();
    }
    return audioContextRef.current;
  };

  const stopAlarm = () => {
    if (alarmTimeoutRef.current) {
      clearTimeout(alarmTimeoutRef.current);
      alarmTimeoutRef.current = null;
    }
    if (alarmOscRef.current) {
      alarmOscRef.current.stop();
      alarmOscRef.current.disconnect();
      alarmOscRef.current = null;
    }
  };

  const playBeep = (frequency = 880, duration = 0.12) => {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.frequency.value = frequency;
    osc.type = "sine";
    osc.connect(gain);
    gain.connect(ctx.destination);
    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    osc.start();
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
    osc.stop(ctx.currentTime + duration + 0.02);
  };

  const playAlarm = () => {
    stopAlarm();
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    alarmOscRef.current = osc;
    osc.frequency.value = 440;
    osc.type = "sine";
    osc.connect(gain);
    gain.connect(ctx.destination);
    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + 10);
    osc.start();
    osc.stop(ctx.currentTime + 10.05);
    alarmTimeoutRef.current = window.setTimeout(() => {
      alarmTimeoutRef.current = null;
      alarmOscRef.current = null;
    }, 10000);
  };

  // ── Task Actions ──────────────────────────────────────
  const addTask = useCallback((task) => {
    setTasks((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        title: task.title,
        subject: task.subject || "",
        priority: task.priority || "medium",
        dueDate: task.dueDate || today(),
        durationMinutes: Number(task.durationMinutes) || 0,
        timerSeconds: Number(task.durationMinutes) ? Number(task.durationMinutes) * 60 : 0,
        timerRunning: Boolean(Number(task.durationMinutes)),
        timerExpired: false,
        color: task.color || "#6366f1",
        completed: false,
        loggedCompletion: false,
        createdAt: today(),
        activities: [], // New: track subtasks/activities
      },
    ]);
  }, []);

  const updateTask = useCallback((id, updates) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );
  }, []);

  const deleteTask = useCallback((id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toggleTask = useCallback((id) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        if (!t.completed) {
          const updated = {
            ...t,
            completed: true,
          };
          if (!t.loggedCompletion) {
            logStudySession(Number(t.durationMinutes) || 0);
            updated.loggedCompletion = true;
          }
          if (t.timerRunning) {
            updated.timerRunning = false;
          }
          return updated;
        }
        return { ...t, completed: false };
      })
    );
  }, []);

  // ── Goal Actions ──────────────────────────────────────
  const addGoal = useCallback((goal) => {
    setGoals((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        title: goal.title,
        target: 100,
        current: Number(goal.current) || 0,
        unit: goal.unit || "%",
        deadline: goal.deadline || "",
        color: goal.color || "#6366f1",
      },
    ]);
  }, []);

  const updateGoal = useCallback((id, updates) => {
    setGoals((prev) =>
      prev.map((g) => (g.id === id ? { ...g, ...updates } : g))
    );
  }, []);

  const deleteGoal = useCallback((id) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
  }, []);

  // ── Study Session (Pomodoro) ──────────────────────────
  const logStudySession = useCallback((minutes) => {
    if (!minutes || minutes <= 0) return;
    setStudySessions((prev) => {
      const existing = prev.find((s) => s.date === today());
      if (existing) {
        return prev.map((s) =>
          s.date === today() ? { ...s, minutes: s.minutes + minutes } : s
        );
      }
      return [...prev, { date: today(), minutes }];
    });
  }, []);

  const getPomodoroSeconds = (state) => {
    if (state.mode === "focus") return state.focusTime * 60;
    if (state.mode === "short") return state.shortBreakTime * 60;
    return state.longBreakTime * 60;
  };

  const startPomodoro = useCallback(() => {
    setPomodoro((prev) => ({
      ...prev,
      running: true,
      hasLoggedSession: false,
    }));
  }, []);

  const pausePomodoro = useCallback(() => {
    stopAlarm();
    setPomodoro((prev) => ({ ...prev, running: false }));
  }, []);

  const resetPomodoro = useCallback(() => {
    stopAlarm();
    setPomodoro((prev) => ({
      ...prev,
      seconds: getPomodoroSeconds(prev),
      running: false,
      hasLoggedSession: false,
    }));
  }, []);

  const setPomodoroMode = useCallback((mode) => {
    stopAlarm();
    setPomodoro((prev) => ({
      ...prev,
      mode,
      seconds: getPomodoroSeconds({ ...prev, mode }),
      running: false,
      hasLoggedSession: false,
    }));
  }, []);

  const updatePomodoroTime = useCallback((type, minutes) => {
    setPomodoro((prev) => ({
      ...prev,
      [`${type}Time`]: minutes,
      seconds: prev.mode === type ? minutes * 60 : prev.seconds,
    }));
  }, []);

  useEffect(() => {
    if (!pomodoro.running) return;
    const interval = window.setInterval(() => {
      setPomodoro((prev) => {
        const nextSeconds = Math.max(prev.seconds - 1, 0);
        return nextSeconds === prev.seconds
          ? prev
          : { ...prev, seconds: nextSeconds };
      });
    }, 1000);
    return () => window.clearInterval(interval);
  }, [pomodoro.running]);

  useEffect(() => {
    if (pomodoro.seconds > 0 && pomodoro.seconds <= 5 && pomodoro.running) {
      playBeep();
    }
    if (pomodoro.seconds === 0 && !pomodoro.hasLoggedSession) {
      if (pomodoro.mode === "focus") {
        logStudySession(pomodoro.focusTime);
      }
      setPomodoro((prev) => ({
        ...prev,
        running: false,
        hasLoggedSession: true,
        sessions: prev.mode === "focus" ? prev.sessions + 1 : prev.sessions,
      }));
      playAlarm();
    }
  }, [pomodoro.seconds, pomodoro.hasLoggedSession, pomodoro.running, pomodoro.mode, pomodoro.focusTime]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setTasks((prev) => {
        let changed = false;
        let shouldBeep = false;
        let shouldAlarm = false;

        const nextTasks = prev.map((task) => {
          if (!task.timerRunning || task.timerSeconds <= 0) return task;

          const nextSeconds = task.timerSeconds - 1;
          let updated = { ...task, timerSeconds: nextSeconds };
          changed = true;

          if (nextSeconds <= 0) {
            updated.timerSeconds = 0;
            updated.timerRunning = false;
            updated.timerExpired = true;
            updated.completed = true;
            if (!updated.loggedCompletion && Number(updated.durationMinutes) > 0) {
              logStudySession(Number(updated.durationMinutes));
              updated.loggedCompletion = true;
            }
            shouldAlarm = true;
          } else if (nextSeconds <= 5) {
            shouldBeep = true;
          }

          return updated;
        });

        if (!changed) return prev;
        if (shouldBeep) playBeep();
        if (shouldAlarm) playAlarm();
        return nextTasks;
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, []);

  // ── Computed Stats ────────────────────────────────────
  const stats = (() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.completed).length;
    const pending = total - completed;
    const productivity = total > 0 ? Math.round((completed / total) * 100) : 0;

    const todayMinutes =
      studySessions.find((s) => s.date === today())?.minutes || 0;

    // Study streak: consecutive days with sessions
    const sortedDates = [...new Set(studySessions.map((s) => s.date))].sort().reverse();
    let streak = 0;
    const d = new Date();
    for (const dateStr of sortedDates) {
      const check = d.toISOString().split("T")[0];
      if (dateStr === check) {
        streak++;
        d.setDate(d.getDate() - 1);
      } else break;
    }

    return { total, completed, pending, productivity, todayMinutes, streak };
  })();

  const login = useCallback((userData) => {
    // Clear previous user's data for fresh start
    localStorage.removeItem("spt_tasks");
    localStorage.removeItem("spt_goals");
    localStorage.removeItem("spt_timetable");
    localStorage.removeItem("spt_sessions");
    localStorage.removeItem("spt_pomodoro");
    // Reset states
    setTasks([]);
    setGoals([]);
    setTimetable({
      Monday: [],
      Tuesday: [],
      Wednesday: [],
      Thursday: [],
      Friday: [],
      Saturday: [],
      Sunday: [],
    });
    setStudySessions([]);
    setPomodoro(defaultPomodoro);
    // Save new user
    save("spt_user", userData);
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("spt_user");
    setUser(null);
  }, []);

  return (
    <AppContext.Provider
      value={{
        user, login, logout,
        darkMode, setDarkMode,
        tasks, addTask, updateTask, deleteTask, toggleTask,
        goals, addGoal, updateGoal, deleteGoal,
        timetable, setTimetable,
        studySessions, logStudySession,
        pomodoro, startPomodoro, pausePomodoro, resetPomodoro,
        setPomodoroMode, updatePomodoroTime,
        stats,
        quote,
        today,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

// Custom hook — import this in every component that needs global state
export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}
