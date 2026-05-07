// src/pages/Analytics.jsx
import { useApp } from "../context/AppContext";
import { PRIORITY_COLORS } from "../components/TaskCard";
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  LineChart, Line,
} from "recharts";

export default function Analytics() {
  const { tasks, studySessions, stats } = useApp();

  // Pie: task status by priority (showing completed tasks by priority)
  const completedTasks = tasks.filter((t) => t.completed);
  const pieData = completedTasks.map((task) => ({
    name: task.title,
    value: 1,
    color: task.color || "#6366f1",
  }));
  
  // Fallback if no completed tasks
  const displayPieData = pieData.length > 0 
    ? pieData 
    : [
        { name: "Completed", value: stats.completed, color: "#6366f1" },
        { name: "Pending", value: stats.pending, color: "#d1d5db" },
      ].filter((d) => d.value > 0);

  // Bar: priority breakdown
  const priorities = ["high", "medium", "low"];
  const barData = priorities.map((p) => ({
    priority: p.charAt(0).toUpperCase() + p.slice(1),
    total: tasks.filter((t) => t.priority === p).length,
    done: tasks.filter((t) => t.priority === p && t.completed).length,
  }));

  // Line: last 14 days study
  const line14 = Array.from({ length: 14 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (13 - i));
    const dateStr = d.toISOString().split("T")[0];
    const session = studySessions.find((s) => s.date === dateStr);
    return {
      date: d.toLocaleDateString("en", { day: "numeric", month: "short" }),
      minutes: session?.minutes || 0,
    };
  });

  // Subject breakdown
  const subjectMap = {};
  tasks.forEach((t) => {
    if (t.subject) {
      subjectMap[t.subject] = (subjectMap[t.subject] || 0) + 1;
    }
  });
  const subjectData = Object.entries(subjectMap).map(([name, value]) => ({ name, value }));

  const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#3b82f6", "#8b5cf6"];
  
  const getPriorityColor = (priority) => PRIORITY_COLORS[priority] || "#6366f1";

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload?.length) {
      return (
        <div className="bg-gray-900 text-white text-xs px-3 py-2 rounded-xl shadow-xl">
          <p className="font-semibold">{label}</p>
          {payload.map((p, i) => (
            <p key={i} style={{ color: p.color }}>{p.name}: {p.value}</p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="max-w-5xl mx-auto space-y-5">
      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Completion Rate", value: `${stats.productivity}%`, icon: "📈" },
          { label: "Total Study Time", value: `${Math.floor(studySessions.reduce((s,n)=>s+n.minutes,0)/60)}h`, icon: "⏰" },
          { label: "Study Days", value: studySessions.length, icon: "📅" },
          { label: "Avg/Day", value: `${studySessions.length ? Math.round(studySessions.reduce((s,n)=>s+n.minutes,0)/studySessions.length) : 0}m`, icon: "📊" },
        ].map((s) => (
          <div key={s.label} className="card text-center">
            <div className="text-2xl mb-1">{s.icon}</div>
            <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400">{s.value}</div>
            <div className="text-xs text-gray-400 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Pie chart */}
        <div className="card">
          <h3 className="font-bold text-gray-800 dark:text-gray-200 text-sm mb-4">
            🥧 Completed Tasks
          </h3>
          {displayPieData.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-gray-400 text-sm">
              No tasks yet
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={displayPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {displayPieData.map((item, i) => (
                    <Cell key={i} fill={item.color || COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Bar: priority */}
        <div className="card">
          <h3 className="font-bold text-gray-800 dark:text-gray-200 text-sm mb-4">
            📊 Tasks by Priority
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={barData} barSize={22}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="priority" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="total" name="Total" radius={[4,4,0,0]}>
                {barData.map((item) => (
                  <Cell key={item.priority} fill={getPriorityColor(item.priority.toLowerCase())} opacity={0.5} />
                ))}
              </Bar>
              <Bar dataKey="done" name="Done" radius={[4,4,0,0]}>
                {barData.map((item) => (
                  <Cell key={item.priority} fill={getPriorityColor(item.priority.toLowerCase())} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Line chart: 14 day study */}
      <div className="card">
        <h3 className="font-bold text-gray-800 dark:text-gray-200 text-sm mb-4">
          📈 Study Minutes — Last 14 Days
        </h3>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={line14}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="date" tick={{ fontSize: 10 }} interval={1} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="minutes"
              name="Minutes"
              stroke="#6366f1"
              strokeWidth={2.5}
              dot={{ fill: "#6366f1", r: 3 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Subject distribution */}
      {subjectData.length > 0 && (
        <div className="card">
          <h3 className="font-bold text-gray-800 dark:text-gray-200 text-sm mb-4">
            📚 Tasks by Subject
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={subjectData} layout="vertical" barSize={16}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={100} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" name="Tasks" fill="#6366f1" radius={[0,4,4,0]}>
                {subjectData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
