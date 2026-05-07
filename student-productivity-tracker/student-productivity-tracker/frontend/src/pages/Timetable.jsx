// src/pages/Timetable.jsx
import { useState } from "react";
import { useApp } from "../context/AppContext";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#3b82f6", "#8b5cf6", "#ec4899"];

const EMPTY = { subject: "", time: "", color: COLORS[0] };

export default function Timetable() {
  const { timetable, setTimetable } = useApp();
  const [activeDay, setActiveDay] = useState("Monday");
  const [form, setForm] = useState(EMPTY);
  const [showForm, setShowForm] = useState(false);

  const addSlot = () => {
    if (!form.subject.trim() || !form.time) return;
    setTimetable((prev) => ({
      ...prev,
      [activeDay]: [
        ...(prev[activeDay] || []),
        { ...form, id: Date.now().toString() },
      ].sort((a, b) => a.time.localeCompare(b.time)),
    }));
    setForm(EMPTY);
    setShowForm(false);
  };

  const removeSlot = (day, id) => {
    setTimetable((prev) => ({
      ...prev,
      [day]: prev[day].filter((s) => s.id !== id),
    }));
  };

  const today = new Date().toLocaleDateString("en", { weekday: "long" });

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      {/* Day tabs */}
      <div className="flex gap-1.5 overflow-x-auto pb-1">
        {DAYS.map((day) => (
          <button
            key={day}
            onClick={() => setActiveDay(day)}
            className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              activeDay === day
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-200 dark:shadow-indigo-900"
                : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:border-indigo-300"
            } ${day === today ? "ring-2 ring-orange-400 ring-offset-1" : ""}`}
          >
            {day.slice(0, 3)}
            {day === today && <span className="ml-1 text-[10px]">●</span>}
          </button>
        ))}
      </div>

      {/* Active day schedule */}
      <div className="card">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-bold text-gray-800 dark:text-white text-lg">{activeDay}</h2>
            <p className="text-xs text-gray-400">
              {(timetable[activeDay] || []).length} classes scheduled
            </p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn-primary text-sm"
          >
            + Add Class
          </button>
        </div>

        {/* Add form */}
        {showForm && (
          <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl p-4 mb-4 space-y-3 animate-slide-up">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                placeholder="Subject name"
                className="input"
                autoFocus
              />
              <input
                type="time"
                value={form.time}
                onChange={(e) => setForm({ ...form, time: e.target.value })}
                className="input"
              />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">Color</p>
              <div className="flex gap-2">
                {COLORS.map((c) => (
                  <button
                    key={c}
                    onClick={() => setForm({ ...form, color: c })}
                    className={`w-6 h-6 rounded-full transition-transform hover:scale-110 ${
                      form.color === c ? "ring-2 ring-offset-2 ring-gray-400 scale-110" : ""
                    }`}
                    style={{ background: c }}
                  />
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={addSlot} className="btn-primary text-sm">Add</button>
              <button onClick={() => setShowForm(false)} className="btn-secondary text-sm">Cancel</button>
            </div>
          </div>
        )}

        {/* Time slots */}
        {(timetable[activeDay] || []).length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <p className="text-3xl mb-2">📅</p>
            <p className="text-sm">No classes scheduled for {activeDay}.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {(timetable[activeDay] || []).map((slot) => (
              <div
                key={slot.id}
                className="flex items-center gap-4 p-3 rounded-xl bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
              >
                <div
                  className="w-1.5 h-12 rounded-full flex-shrink-0"
                  style={{ background: slot.color }}
                />
                <div className="flex-1">
                  <p className="font-semibold text-gray-800 dark:text-gray-100 text-sm">
                    {slot.subject}
                  </p>
                  <p className="text-xs text-gray-400 font-mono">{slot.time}</p>
                </div>
                <button
                  onClick={() => removeSlot(activeDay, slot.id)}
                  className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Weekly overview */}
      <div className="grid grid-cols-7 gap-2">
        {DAYS.map((day) => (
          <div
            key={day}
            onClick={() => setActiveDay(day)}
            className={`card cursor-pointer p-3 text-center hover:border-indigo-300 transition-colors ${
              activeDay === day ? "border-indigo-500 dark:border-indigo-500" : ""
            }`}
          >
            <p className="text-xs font-bold text-gray-700 dark:text-gray-300">{day.slice(0, 3)}</p>
            <p className="text-lg font-black text-indigo-600 dark:text-indigo-400 mt-1">
              {(timetable[day] || []).length}
            </p>
            <p className="text-[10px] text-gray-400">classes</p>
          </div>
        ))}
      </div>
    </div>
  );
}
