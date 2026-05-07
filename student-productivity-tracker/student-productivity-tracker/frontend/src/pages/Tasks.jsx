// src/pages/Tasks.jsx
import { useState } from "react";
import { useApp } from "../context/AppContext";
import TaskCard from "../components/TaskCard";

const EMPTY_FORM = { title: "", subject: "", priority: "medium", dueDate: "", durationMinutes: 25, color: "#6366f1" };

export default function Tasks() {
  const { tasks, addTask, updateTask } = useApp();
  const [form, setForm] = useState(EMPTY_FORM);
  const [editing, setEditing] = useState(null); // task being edited
  const [filter, setFilter] = useState("all"); // all | active | completed
  const [showForm, setShowForm] = useState(false);

  const filtered = tasks.filter((t) => {
    if (filter === "active") return !t.completed;
    if (filter === "completed") return t.completed;
    return true;
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    if (editing) {
      updateTask(editing.id, form);
      setEditing(null);
    } else {
      addTask(form);
    }
    setForm(EMPTY_FORM);
    setShowForm(false);
  };

  const handleEdit = (task) => {
    setEditing(task);
    setForm({
      title: task.title,
      subject: task.subject,
      priority: task.priority,
      dueDate: task.dueDate,
      durationMinutes: task.durationMinutes || 25,
      color: task.color || "#6366f1",
    });
    setShowForm(true);
  };

  const cancelEdit = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setShowForm(false);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-400">{tasks.length} total tasks</p>
        </div>
        <button
          onClick={() => { setShowForm(!showForm); setEditing(null); setForm(EMPTY_FORM); }}
          className="btn-primary text-sm"
        >
          + New Task
        </button>
      </div>

      {/* Add / Edit form */}
      {showForm && (
        <div className="card animate-slide-up border-2 border-indigo-100 dark:border-indigo-800">
          <h3 className="font-bold text-gray-800 dark:text-white mb-4">
            {editing ? "✏️ Edit Task" : "➕ Add Task"}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Task title *"
              className="input"
              autoFocus
              required
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                placeholder="Subject (optional)"
                className="input"
              />
              <input
                type="number"
                min="1"
                max="480"
                value={form.durationMinutes}
                onChange={(e) => setForm({ ...form, durationMinutes: Number(e.target.value) })}
                placeholder="Duration (mins)"
                className="input"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <select
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value })}
                className="input"
              >
                <option value="low">🟢 Low Priority</option>
                <option value="medium">🟡 Medium Priority</option>
                <option value="high">🔴 High Priority</option>
              </select>
              <input
                type="date"
                value={form.dueDate}
                onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                className="input"
              />
            </div>
            <div className="flex items-center gap-3">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Task Color:
              </label>
              <div className="flex gap-2 flex-wrap">
                {["#6366f1", "#ef4444", "#eab308", "#22c55e", "#3b82f6", "#8b5cf6", "#ec4899", "#f97316"].map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setForm({ ...form, color })}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      form.color === color ? "border-gray-800 dark:border-white scale-110" : "border-gray-300 dark:border-gray-600"
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
            <div className="flex gap-2 pt-1">
              <button type="submit" className="btn-primary text-sm">
                {editing ? "Update" : "Add Task"}
              </button>
              <button type="button" onClick={cancelEdit} className="btn-secondary text-sm">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filter tabs */}
      <div className="flex gap-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl w-fit">
        {["all", "active", "completed"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium capitalize transition-all ${
              filter === f
                ? "bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow-sm"
                : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            {f} {f === "all" ? `(${tasks.length})` : f === "active" ? `(${tasks.filter(t=>!t.completed).length})` : `(${tasks.filter(t=>t.completed).length})`}
          </button>
        ))}
      </div>

      {/* Task list */}
      <div className="space-y-2">
        {filtered.length === 0 ? (
          <div className="card text-center py-10 text-gray-400">
            <p className="text-3xl mb-2">📭</p>
            <p className="text-sm">No tasks here. Add one above!</p>
          </div>
        ) : (
          filtered
            .sort((a, b) => {
              const order = { high: 0, medium: 1, low: 2 };
              return order[a.priority] - order[b.priority];
            })
            .map((t) => (
              <TaskCard key={t.id} task={t} onEdit={handleEdit} />
            ))
        )}
      </div>
    </div>
  );
}
