// src/pages/DailyReport.jsx
import { useApp } from "../context/AppContext";

function getProductivityMessage(pct) {
  if (pct >= 90) return { emoji: "🏆", text: "Outstanding performance! You're on fire!", color: "text-yellow-500" };
  if (pct >= 70) return { emoji: "🚀", text: "Great job! Keep up the momentum.", color: "text-green-500" };
  if (pct >= 50) return { emoji: "👍", text: "Good progress. Push a little harder tomorrow!", color: "text-blue-500" };
  if (pct >= 25) return { emoji: "💪", text: "Room to grow. Small steps lead to big wins.", color: "text-orange-500" };
  return { emoji: "🌱", text: "Every day is a fresh start. Begin with one task!", color: "text-purple-500" };
}

export default function DailyReport() {
  const { user, tasks, studySessions, goals, stats } = useApp();

  const today = new Date().toISOString().split("T")[0];
  const todaySession = studySessions.find((s) => s.date === today);
  const studyMinutes = todaySession?.minutes || 0;

  const todayCompleted = tasks.filter(
    (t) => t.completed && t.dueDate === today
  );
  const todayPending = tasks.filter(
    (t) => !t.completed && t.dueDate === today
  );

  const msg = getProductivityMessage(stats.productivity);
  const completedGoals = goals.filter((g) => g.current >= g.target);

  const date = new Date();
  const dateStr = date.toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      {/* Report header */}
      <div className="card bg-gradient-to-br from-indigo-600 to-purple-600 text-white border-0">
        <div className="flex items-center justify-between mb-2">
          <div>
            <p className="text-indigo-200 text-xs font-medium uppercase tracking-wider">Daily Report</p>
            <h2 className="text-xl font-black mt-0.5">{user?.name}</h2>
            <p className="text-indigo-200 text-sm">{user?.education}</p>
          </div>
          <div className="text-right">
            <p className="text-4xl font-black">{stats.productivity}%</p>
            <p className="text-indigo-200 text-xs">Productivity</p>
          </div>
        </div>
        <p className="text-indigo-200 text-xs mt-3 border-t border-white/20 pt-3">{dateStr}</p>
      </div>

      {/* Motivational message */}
      <div className="card flex items-center gap-4">
        <span className="text-4xl">{msg.emoji}</span>
        <p className={`font-bold text-base ${msg.color}`}>{msg.text}</p>
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-3 gap-3">
        <div className="card text-center">
          <p className="text-3xl font-black text-indigo-600 dark:text-indigo-400">{studyMinutes}</p>
          <p className="text-xs text-gray-400 mt-1">Minutes Studied</p>
        </div>
        <div className="card text-center">
          <p className="text-3xl font-black text-green-600 dark:text-green-400">{stats.completed}</p>
          <p className="text-xs text-gray-400 mt-1">Tasks Done</p>
        </div>
        <div className="card text-center">
          <p className="text-3xl font-black text-orange-500">🔥{stats.streak}</p>
          <p className="text-xs text-gray-400 mt-1">Day Streak</p>
        </div>
      </div>

      {/* Today's completed tasks */}
      <div className="card">
        <h3 className="font-bold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
          ✅ <span>Completed Today ({todayCompleted.length})</span>
        </h3>
        {todayCompleted.length === 0 ? (
          <p className="text-sm text-gray-400">No tasks marked complete for today's due date.</p>
        ) : (
          <ul className="space-y-1.5">
            {todayCompleted.map((t) => (
              <li key={t.id} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                <span className="text-green-500">✓</span>
                <span className="line-through text-gray-400">{t.title}</span>
                {t.subject && <span className="badge bg-gray-100 dark:bg-gray-700 text-gray-500">{t.subject}</span>}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Pending */}
      {todayPending.length > 0 && (
        <div className="card border-l-4 border-orange-400">
          <h3 className="font-bold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
            ⏳ <span>Still Pending ({todayPending.length})</span>
          </h3>
          <ul className="space-y-1.5">
            {todayPending.map((t) => (
              <li key={t.id} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                <span className="text-orange-400">○</span>
                {t.title}
                <span className={`badge ${t.priority === 'high' ? 'bg-red-100 text-red-600' : t.priority === 'medium' ? 'bg-yellow-100 text-yellow-600' : 'bg-green-100 text-green-600'}`}>
                  {t.priority}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Goals achieved */}
      {completedGoals.length > 0 && (
        <div className="card border-l-4 border-yellow-400 bg-yellow-50 dark:bg-yellow-900/10">
          <h3 className="font-bold text-yellow-700 dark:text-yellow-400 mb-2">🏅 Goals Achieved!</h3>
          {completedGoals.map((g) => (
            <p key={g.id} className="text-sm text-gray-700 dark:text-gray-300">✅ {g.title}</p>
          ))}
        </div>
      )}

      {/* Study time breakdown */}
      <div className="card">
        <h3 className="font-bold text-gray-800 dark:text-gray-200 mb-4">⏱️ Study Time Today</h3>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-4">
              <div
                className="bg-gradient-to-r from-indigo-500 to-purple-500 h-4 rounded-full transition-all"
                style={{ width: `${Math.min((studyMinutes / 60) * 100, 100)}%` }}
              />
            </div>
            <p className="text-xs text-gray-400 mt-1.5">
              {studyMinutes} / 60 min goal
            </p>
          </div>
          <div className="text-right">
            <p className="text-xl font-black text-indigo-600 dark:text-indigo-400">
              {Math.floor(studyMinutes / 60)}h {studyMinutes % 60}m
            </p>
          </div>
        </div>
      </div>

      {/* Overall summary */}
      <div className="card bg-gray-50 dark:bg-gray-900">
        <h3 className="font-bold text-gray-800 dark:text-gray-200 mb-3">📊 Overall Summary</h3>
        <div className="grid grid-cols-2 gap-3 text-sm">
          {[
            ["Total Tasks", stats.total],
            ["Completed", stats.completed],
            ["Pending", stats.pending],
            ["Productivity", `${stats.productivity}%`],
            ["Study Streak", `${stats.streak} days`],
            ["Goals Set", goals.length],
          ].map(([label, val]) => (
            <div key={label} className="flex justify-between items-center py-1.5 border-b border-gray-100 dark:border-gray-800">
              <span className="text-gray-500 dark:text-gray-400">{label}</span>
              <span className="font-bold text-gray-800 dark:text-gray-100">{val}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Print button */}
      <button
        onClick={() => window.print()}
        className="btn-secondary w-full text-sm"
      >
        🖨️ Print / Save Report
      </button>
    </div>
  );
}
