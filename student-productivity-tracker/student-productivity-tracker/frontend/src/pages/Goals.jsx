// src/pages/Goals.jsx
import { useState } from "react";
import { useApp } from "../context/AppContext";

const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#3b82f6", "#8b5cf6"];
const EMPTY = { title: "", target: 100, current: "", unit: "%", deadline: "", color: COLORS[0] };

export default function Goals() {
  const { goals, addGoal, updateGoal, deleteGoal } = useApp();
  const [form, setForm] = useState(EMPTY);
  const [showForm, setShowForm] = useState(false);
  const [progressInput, setProgressInput] = useState({});

  const handleAdd = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    addGoal({ ...form });
    setForm(EMPTY);
    setShowForm(false);
  };

  const handleProgressUpdate = (id) => {
    const val = Number(progressInput[id]);
    if (!isNaN(val)) {
      updateGoal(id, { current: val });
      setProgressInput((p) => ({ ...p, [id]: "" }));
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-400">{goals.length} goals set</p>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary text-sm">
          + New Goal
        </button>
      </div>

      {/* Add form */}
      {showForm && (
        <form onSubmit={handleAdd} className="card border-2 border-indigo-100 dark:border-indigo-800 animate-slide-up space-y-3">
          <h3 className="font-bold text-gray-800 dark:text-white">🎯 Add New Goal</h3>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Goal title *"
            className="input"
            required
            autoFocus
          />
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">Target *</label>
              <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">100%</p>
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">Current</label>
              <input
                type="number"
                value={form.current}
                onChange={(e) => setForm({ ...form, current: e.target.value })}
                placeholder="0"
                className="input"
                min="0"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">Unit</label>
              <input
                type="text"
                value={form.unit}
                onChange={(e) => setForm({ ...form, unit: e.target.value })}
                placeholder="%"
                className="input"
              />
            </div>
          </div>
          <input
            type="date"
            value={form.deadline}
            onChange={(e) => setForm({ ...form, deadline: e.target.value })}
            className="input"
          />
          <div>
            <p className="text-xs font-medium text-gray-500 mb-1.5">Color</p>
            <div className="flex gap-2">
              {COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setForm({ ...form, color: c })}
                  className={`w-7 h-7 rounded-full transition-transform hover:scale-110 ${
                    form.color === c ? "ring-2 ring-offset-2 ring-gray-400 scale-110" : ""
                  }`}
                  style={{ background: c }}
                />
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            <button type="submit" className="btn-primary text-sm">Add Goal</button>
            <button type="button" onClick={() => setShowForm(false)} className="btn-secondary text-sm">Cancel</button>
          </div>
        </form>
      )}

      {/* Goals list */}
      {goals.length === 0 ? (
        <div className="card text-center py-14 text-gray-400">
          <p className="text-4xl mb-3">🎯</p>
          <p className="font-medium">No goals yet. Set your first goal!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {goals.map((g) => {
            const pct = Math.min(Math.round(((g.current || 0) / g.target) * 100), 100);
            const done = pct >= 100;

            return (
              <div key={g.id} className="card group hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ background: g.color }}
                    />
                    <div>
                      <h3 className="font-bold text-gray-800 dark:text-gray-100 text-sm">
                        {g.title}
                        {done && " ✅"}
                      </h3>
                      {g.deadline && (
                        <p className="text-xs text-gray-400">
                          Deadline: {g.deadline}
                        </p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => deleteGoal(g.id)}
                    className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-500 transition-all text-sm"
                  >
                    🗑️
                  </button>
                </div>

                {/* Progress bar */}
                <div className="mb-2">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-500">
                      {(g.current || 0)} / {g.target} {g.unit}
                    </span>
                    <span className="font-bold" style={{ color: g.color }}>
                      {pct}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-3">
                    <div
                      className="h-3 rounded-full transition-all duration-700 relative overflow-hidden"
                      style={{ width: `${pct}%`, background: g.color }}
                    >
                      {done && (
                        <div className="absolute inset-0 bg-white/20 animate-pulse" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Update progress */}
                {!done && (
                  <div className="flex gap-2 mt-3">
                    <input
                      type="number"
                      value={progressInput[g.id] || ""}
                      onChange={(e) =>
                        setProgressInput((p) => ({ ...p, [g.id]: e.target.value }))
                      }
                      placeholder={`Update (current: ${g.current || 0})`}
                      className="input text-xs py-1.5 flex-1"
                      min="0"
                      max={g.target}
                    />
                    <button
                      onClick={() => handleProgressUpdate(g.id)}
                      className="btn-primary text-xs px-3 py-1.5"
                    >
                      Update
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
