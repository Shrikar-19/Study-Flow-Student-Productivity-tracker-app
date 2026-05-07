// src/pages/Dashboard.jsx
import { useApp } from "../context/AppContext";
import StatCard from "../components/StatCard";
import TaskCard from "../components/TaskCard";
import PomodoroTimer from "../components/PomodoroTimer";
import { Link } from "react-router-dom";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

export default function Dashboard() {
  const { user, stats, tasks, goals, studySessions, quote } = useApp();

  // Today's tasks (due today or no date)
  const today = new Date().toISOString().split("T")[0];
  const todayTasks = tasks.filter(
    (t) => !t.dueDate || t.dueDate === today
  ).slice(0, 5);

  // Last 7 days study data for chart
  const last7 = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toISOString().split("T")[0];
    const session = studySessions.find((s) => s.date === dateStr);
    return {
      day: d.toLocaleDateString("en", { weekday: "short" }),
      minutes: session?.minutes || 0,
    };
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Greeting */}
      <div className="animate-slide-up">
        <h2 className="text-2xl font-black text-gray-900 dark:text-white">
          Good {getGreeting()}, {user?.name?.split(" ")[0]}! 👋
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{quote}</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
        <StatCard label="Total Tasks" value={stats.total} icon="📝" color="indigo" />
        <StatCard label="Completed" value={stats.completed} icon="✅" color="green" />
        <StatCard label="Pending" value={stats.pending} icon="⏳" color="orange" />
        <StatCard
          label="Productivity"
          value={`${stats.productivity}%`}
          icon="📈"
          color="purple"
        />
        <StatCard
          label="Study Streak"
          value={`${stats.streak}d`}
          icon="🔥"
          color="red"
        />
        <StatCard
          label="Today's Study"
          value={`${stats.todayMinutes}m`}
          icon="⏱️"
          color="blue"
          sub={`${Math.floor(stats.todayMinutes / 60)}h ${stats.todayMinutes % 60}m`}
        />
      </div>

      {/* Middle row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Today's tasks */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-gray-800 dark:text-gray-200">Today's Tasks</h3>
            <Link
              to="/tasks"
              className="text-xs text-indigo-500 hover:text-indigo-700 font-medium"
            >
              View all →
            </Link>
          </div>
          {todayTasks.length === 0 ? (
            <div className="card text-center py-8 text-gray-400">
              <p className="text-2xl mb-2">🎉</p>
              <p className="text-sm">No tasks for today! Add some.</p>
              <Link to="/tasks" className="btn-primary mt-3 inline-block text-sm">
                + Add Task
              </Link>
            </div>
          ) : (
            todayTasks.map((t) => <TaskCard key={t.id} task={t} />)
          )}

          {/* Productivity progress */}
          <div className="card">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-gray-800 dark:text-gray-200 text-sm">
                Overall Progress
              </h3>
              <span className="text-sm font-bold text-indigo-600">{stats.productivity}%</span>
            </div>
            <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-indigo-500 to-purple-500 h-3 rounded-full transition-all duration-700"
                style={{ width: `${stats.productivity}%` }}
              />
            </div>
            <p className="text-xs text-gray-400 mt-2">
              {stats.completed} of {stats.total} tasks completed
            </p>
          </div>
        </div>

        {/* Pomodoro */}
        <PomodoroTimer />
      </div>

      {/* Bottom row: chart + goals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Study chart */}
        <div className="card">
          <h3 className="font-bold text-gray-800 dark:text-gray-200 mb-4 text-sm">
            📊 Weekly Study (minutes)
          </h3>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={last7}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" className="dark:stroke-gray-700" />
              <XAxis dataKey="day" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  background: "#1f2937",
                  border: "none",
                  borderRadius: "12px",
                  color: "#fff",
                  fontSize: "12px",
                }}
              />
              <Line
                type="monotone"
                dataKey="minutes"
                stroke="#6366f1"
                strokeWidth={2.5}
                dot={{ fill: "#6366f1", r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Goals preview */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-800 dark:text-gray-200 text-sm">🎯 Goals</h3>
            <Link to="/goals" className="text-xs text-indigo-500 hover:text-indigo-700 font-medium">
              Manage →
            </Link>
          </div>
          {goals.length === 0 ? (
            <div className="text-center py-6 text-gray-400">
              <p className="text-sm">No goals set yet.</p>
              <Link to="/goals" className="btn-primary mt-3 inline-block text-sm">
                + Add Goal
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {goals.slice(0, 4).map((g) => {
                const pct = Math.min(
                  Math.round((g.current / g.target) * 100),
                  100
                );
                return (
                  <div key={g.id}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-medium text-gray-700 dark:text-gray-300 truncate max-w-[70%]">
                        {g.title}
                      </span>
                      <span className="text-gray-400">
                        {g.current}/{g.target} {g.unit}
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all duration-500"
                        style={{ width: `${pct}%`, background: g.color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Morning";
  if (h < 17) return "Afternoon";
  return "Evening";
}
