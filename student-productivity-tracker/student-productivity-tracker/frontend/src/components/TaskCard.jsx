// src/components/TaskCard.jsx
import { useState } from "react";
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
  const { toggleTask, deleteTask, updateTask } = useApp();
  const [showActivities, setShowActivities] = useState(false);
  const [newActivity, setNewActivity] = useState("");

  const timerMinutes = Math.floor(task.timerSeconds / 60);
  const timerSeconds = task.timerSeconds % 60;
  const timerDisplay = task.completed
    ? "✅ Completed"
    : task.timerRunning
      ? `⏳ ${String(timerMinutes).padStart(2, "0")}:${String(timerSeconds).padStart(2, "0")}`
      : task.timerExpired
        ? "✅ Completed"
        : `⏱ ${task.durationMinutes || 0}m`;

  // Calculate activity completion percentage
  const activities = task.activities || [];
  const completedActivities = activities.filter((a) => a.completed).length;
  const activityPercent =
    activities.length > 0
      ? Math.round((completedActivities / activities.length) * 100)
      : 0;

  const addActivity = () => {
    if (!newActivity.trim()) return;
    const updatedActivities = [
      ...activities,
      { id: Date.now().toString(), title: newActivity, completed: false },
    ];
    updateTask(task.id, { activities: updatedActivities });
    setNewActivity("");
  };

  const toggleActivity = (activityId) => {
    const updatedActivities = activities.map((a) =>
      a.id === activityId ? { ...a, completed: !a.completed } : a
    );
    updateTask(task.id, { activities: updatedActivities });
  };

  const removeActivity = (activityId) => {
    const updatedActivities = activities.filter((a) => a.id !== activityId);
    updateTask(task.id, { activities: updatedActivities });
  };

  return (
    <div
      className={`card space-y-3 group transition-all duration-200 ${
        task.completed ? "opacity-60" : ""
      }`}
      style={{ borderLeft: `4px solid ${task.color || "#6366f1"}` }}
    >
      {/* Main task row */}
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <button
          onClick={() => toggleTask(task.id)}
          disabled={task.timerRunning && !task.completed}
          className={`mt-0.5 w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
            task.completed
              ? "bg-indigo-600 border-indigo-600 text-white"
              : task.timerRunning
                ? "border-gray-300 dark:border-gray-600 opacity-50 cursor-not-allowed"
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
            <span className={PRIORITY_STYLES[task.priority]}>
              {task.priority}
            </span>
            <span className="text-xs text-gray-400">{timerDisplay}</span>
            {task.dueDate && (
              <span className="text-xs text-gray-400">📅 {task.dueDate}</span>
            )}
            {activities.length > 0 && (
              <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400">
                {activityPercent}% activities done
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
          <button
            onClick={() => setShowActivities(!showActivities)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors"
            title="Activities"
          >
            ⋮
          </button>
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

      {/* Activities Section */}
      {showActivities && (
        <div className="ml-8 pt-3 border-t border-gray-200 dark:border-gray-700 space-y-2 animate-slide-up">
          <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300">
            Activities ({completedActivities}/{activities.length})
          </h4>

          {/* Activities list */}
          {activities.length > 0 && (
            <div className="space-y-1.5 mb-2">
              {activities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-900 rounded-lg group/item"
                >
                  <input
                    type="checkbox"
                    checked={activity.completed}
                    onChange={() => toggleActivity(activity.id)}
                    className="w-4 h-4 rounded border-gray-300 text-indigo-600 cursor-pointer"
                  />
                  <span
                    className={`text-xs flex-1 ${
                      activity.completed
                        ? "text-gray-400 line-through"
                        : "text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    {activity.title}
                  </span>
                  <button
                    onClick={() => removeActivity(activity.id)}
                    className="opacity-0 group-item/hover:opacity-100 text-gray-400 hover:text-red-500 transition-all text-xs"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Activity progress bar */}
          {activities.length > 0 && (
            <div className="mb-2">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                <div
                  className="h-1.5 rounded-full bg-indigo-500 transition-all"
                  style={{ width: `${activityPercent}%` }}
                />
              </div>
            </div>
          )}

          {/* Add activity form */}
          <div className="flex gap-2">
            <input
              type="text"
              value={newActivity}
              onChange={(e) => setNewActivity(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") addActivity();
              }}
              placeholder="Add activity..."
              className="input text-xs py-1.5 flex-1"
            />
            <button
              onClick={addActivity}
              className="btn-primary text-xs px-3 py-1.5"
            >
              Add
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
