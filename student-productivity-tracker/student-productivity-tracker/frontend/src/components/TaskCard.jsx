// src/components/TaskCard.jsx
import { useApp } from "../context/AppContext";

export const PRIORITY_COLORS = {
  high: "#ef4444",
  medium: "#eab308",
  low: "#22c55e",
};

const PRIORITY_STYLES = {
  high: "badge bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  medium: "badge bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  low: "badge bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
};

export default function TaskCard({ task, onEdit }) {
  const { toggleTask, deleteTask } = useApp();
  const timerMinutes = Math.floor(task.timerSeconds / 60);
  const timerSeconds = task.timerSeconds % 60;
  const timerDisplay = task.completed
    ? "✅ Completed"
    : task.timerRunning
      ? `⏳ ${String(timerMinutes).padStart(2, "0")}:${String(timerSeconds).padStart(2, "0")}`
      : task.timerExpired
        ? "✅ Completed"
        : `⏱ ${task.durationMinutes || 0}m`;

  return (
    <div
      className={`card flex items-start gap-3 group transition-all duration-200 ${
        task.completed ? "opacity-60" : ""
      }`}
      style={{ borderLeft: `4px solid ${task.color || "#6366f1"}` }}
    >
      {/* Checkbox */}
      <button
        onClick={() => toggleTask(task.id)}
        className={`mt-0.5 w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
          task.completed
            ? "bg-indigo-600 border-indigo-600 text-white"
            : "border-gray-300 dark:border-gray-600 hover:border-indigo-500"
        }`}
      >
        {task.completed && (
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p
          className={`text-sm font-medium text-gray-800 dark:text-gray-100 ${
            task.completed ? "line-through text-gray-400" : ""
          }`}
        >
          {task.title}
        </p>
        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
          {task.subject && (
            <span className="text-xs text-gray-400">{task.subject}</span>
          )}
          <span className={PRIORITY_STYLES[task.priority]}>{task.priority}</span>
          <span className="text-xs text-gray-400">{timerDisplay}</span>
          {task.dueDate && (
            <span className="text-xs text-gray-400">📅 {task.dueDate}</span>
          )}
        </div>
      </div>

      {/* Actions (visible on hover) */}
      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {onEdit && (
          <button
            onClick={() => onEdit(task)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors"
          >
            ✏️
          </button>
        )}
        <button
          onClick={() => deleteTask(task.id)}
          className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
        >
          🗑️
        </button>
      </div>
    </div>
  );
}
