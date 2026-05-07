// src/components/PomodoroTimer.jsx
import { useState } from "react";
import { useApp } from "../context/AppContext";

export default function PomodoroTimer() {
  const {
    pomodoro,
    startPomodoro,
    pausePomodoro,
    resetPomodoro,
    setPomodoroMode,
    updatePomodoroTime,
  } = useApp();
  const [showSettings, setShowSettings] = useState(false);

  const MODES = {
    focus: { label: "Focus", minutes: pomodoro.focusTime, color: "#6366f1" },
    short: { label: "Short Break", minutes: pomodoro.shortBreakTime, color: "#10b981" },
    long: { label: "Long Break", minutes: pomodoro.longBreakTime, color: "#3b82f6" },
  };

  const currentMode = MODES[pomodoro.mode];
  const total = currentMode.minutes * 60;
  const progress = total ? ((total - pomodoro.seconds) / total) * 100 : 0;
  const mins = String(Math.floor(pomodoro.seconds / 60)).padStart(2, "0");
  const secs = String(pomodoro.seconds % 60).padStart(2, "0");

  const handleMode = (mode) => {
    setShowSettings(false);
    setPomodoroMode(mode);
  };

  const reset = () => {
    resetPomodoro();
  };

  const updateTime = (type, value) => {
    const numValue = Math.max(1, Math.min(120, parseInt(value) || 0));
    updatePomodoroTime(type, numValue);
  };

  const toggleRunning = () => {
    if (pomodoro.running) {
      pausePomodoro();
    } else {
      startPomodoro();
    }
  };

  // SVG ring
  const r = 54;
  const circ = 2 * Math.PI * r;
  const dash = circ - (progress / 100) * circ;

  return (
    <div className="card flex flex-col items-center gap-4">
      <div className="flex items-center justify-between w-full">
        <h2 className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
          🍅 Pomodoro Timer
        </h2>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="text-lg hover:scale-110 transition-transform"
          title="Settings"
        >
          ⚙️
        </button>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="w-full bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 space-y-3">
          <h3 className="font-semibold text-sm text-gray-700 dark:text-gray-300">Customize Times (minutes)</h3>
          
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-medium text-gray-600 dark:text-gray-400 block mb-1">Focus</label>
              <input
                type="number"
                min="1"
                max="120"
                value={pomodoro.focusTime}
                onChange={(e) => updateTime("focus", e.target.value)}
                disabled={pomodoro.running}
                className="w-full px-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-center font-semibold disabled:opacity-50"
              />
            </div>
            
            <div>
              <label className="text-xs font-medium text-gray-600 dark:text-gray-400 block mb-1">Short Break</label>
              <input
                type="number"
                min="1"
                max="120"
                value={pomodoro.shortBreakTime}
                onChange={(e) => updateTime("short", e.target.value)}
                disabled={pomodoro.running}
                className="w-full px-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-center font-semibold disabled:opacity-50"
              />
            </div>
            
            <div>
              <label className="text-xs font-medium text-gray-600 dark:text-gray-400 block mb-1">Long Break</label>
              <input
                type="number"
                min="1"
                max="120"
                value={pomodoro.longBreakTime}
                onChange={(e) => updateTime("long", e.target.value)}
                disabled={pomodoro.running}
                className="w-full px-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-center font-semibold disabled:opacity-50"
              />
            </div>
          </div>
          
          <p className="text-xs text-gray-500 dark:text-gray-400">⚠️ Cannot edit while timer is running</p>
        </div>
      )}

      {/* Mode selector */}
      <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-xl p-1 w-full">
        {Object.entries(MODES).map(([key, val]) => (
          <button
            key={key}
            onClick={() => handleMode(key)}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              pomodoro.mode === key
                ? "bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow-sm"
                : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            {val.label}
          </button>
        ))}
      </div>

      {/* Ring timer */}
      <div className="relative">
        <svg width="140" height="140" className="-rotate-90">
          <circle cx="70" cy="70" r={r} stroke="#e5e7eb" strokeWidth="8" fill="none" className="dark:stroke-gray-700" />
          <circle
            cx="70" cy="70" r={r}
            stroke={MODES[pomodoro.mode].color}
            strokeWidth="8"
            fill="none"
            strokeDasharray={circ}
            strokeDashoffset={dash}
            strokeLinecap="round"
            className="transition-all duration-1000"
            style={{ filter: pomodoro.running ? `drop-shadow(0 0 8px ${MODES[pomodoro.mode].color}80)` : "none" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-mono text-3xl font-bold text-gray-900 dark:text-white">
            {mins}:{secs}
          </span>
          <span className="text-xs text-gray-400 mt-0.5">{MODES[pomodoro.mode].label}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-2">
        <button onClick={reset} className="btn-secondary px-4 py-2 text-sm">
          ↺ Reset
        </button>
        <button
          onClick={toggleRunning}
          className="btn-primary px-6 py-2 text-sm"
          style={{ background: pomodoro.running ? "#ef4444" : undefined }}
        >
          {pomodoro.running ? "⏸ Pause" : "▶ Start"}
        </button>
      </div>

      {/* Session count */}
      <div className="flex items-center gap-1.5">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full ${
              i < pomodoro.sessions % 4
                ? "bg-indigo-500"
                : "bg-gray-200 dark:bg-gray-700"
            }`}
          />
        ))}
        <span className="text-xs text-gray-400 ml-1">{pomodoro.sessions} sessions today</span>
      </div>
    </div>
  );
}
