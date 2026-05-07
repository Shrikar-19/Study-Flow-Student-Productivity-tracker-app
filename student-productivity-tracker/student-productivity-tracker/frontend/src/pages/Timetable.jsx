// src/pages/Timetable.jsx
import { useState } from "react";
import { useApp } from "../context/AppContext";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const TIME_SLOTS = [
  "09:00-10:00",
  "10:00-11:00",
  "11:00-12:00",
  "12:00-13:00",
  "Lunch",
  "13:00-14:00",
  "14:00-15:00",
  "15:00-16:00",
];
const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#3b82f6", "#8b5cf6", "#ec4899"];

const EMPTY = { subject: "", timeSlot: TIME_SLOTS[0], color: COLORS[0] };

export default function Timetable() {
  const { timetable, setTimetable } = useApp();
  const [form, setForm] = useState({ ...EMPTY, day: "Monday" });
  const [showForm, setShowForm] = useState(false);

  const addSlot = () => {
    if (!form.subject.trim() || !form.day || !form.timeSlot) return;
    setTimetable((prev) => ({
      ...prev,
      [form.day]: {
        ...prev[form.day],
        [form.timeSlot]: {
          subject: form.subject,
          color: form.color,
          attendance: null,
        },
      },
    }));
    setForm({ ...EMPTY, day: "Monday" });
    setShowForm(false);
  };

  const removeSlot = (day, timeSlot) => {
    setTimetable((prev) => {
      const newDay = { ...prev[day] };
      delete newDay[timeSlot];
      return { ...prev, [day]: newDay };
    });
  };

  const markAttendance = (day, timeSlot, status) => {
    setTimetable((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [timeSlot]: {
          ...prev[day][timeSlot],
          attendance: status,
        },
      },
    }));
  };

  const getDayStats = (day) => {
    const slots = timetable[day] || {};
    const total = Object.keys(slots).filter(ts => ts !== 'Lunch').length;
    const attended = Object.values(slots).filter(slot => slot.attendance === 'present').length;
    const percentage = total > 0 ? Math.round((attended / total) * 100) : 0;
    return { total, attended, percentage };
  };

  const getWeeklyStats = () => {
    let totalClasses = 0;
    let totalAttended = 0;
    DAYS.forEach(day => {
      const { total, attended } = getDayStats(day);
      totalClasses += total;
      totalAttended += attended;
    });
    const percentage = totalClasses > 0 ? Math.round((totalAttended / totalClasses) * 100) : 0;
    return { totalClasses, totalAttended, percentage };
  };

  const today = new Date().toLocaleDateString("en", { weekday: "long" });

  return (
    <div className="max-w-7xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Weekly Timetable</h1>
          <p className="text-sm text-gray-400">Manage your class schedule and attendance</p>
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
        <div className="card animate-slide-up">
          <h3 className="font-bold text-gray-800 dark:text-white mb-4">Add New Class</h3>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <select
              value={form.day}
              onChange={(e) => setForm({ ...form, day: e.target.value })}
              className="input"
            >
              {DAYS.map((day) => (
                <option key={day} value={day}>{day}</option>
              ))}
            </select>
            <select
              value={form.timeSlot}
              onChange={(e) => setForm({ ...form, timeSlot: e.target.value })}
              className="input"
            >
              {TIME_SLOTS.map((slot) => (
                <option key={slot} value={slot}>{slot}</option>
              ))}
            </select>
            <input
              type="text"
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              placeholder="Subject name"
              className="input"
              autoFocus
            />
            <div className="flex gap-2">
              {COLORS.slice(0, 4).map((c) => (
                <button
                  key={c}
                  onClick={() => setForm({ ...form, color: c })}
                  className={`w-8 h-8 rounded-full transition-transform hover:scale-110 ${
                    form.color === c ? "ring-2 ring-offset-2 ring-gray-400 scale-110" : ""
                  }`}
                  style={{ background: c }}
                />
              ))}
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={addSlot} className="btn-primary text-sm">Add Class</button>
            <button onClick={() => setShowForm(false)} className="btn-secondary text-sm">Cancel</button>
          </div>
        </div>
      )}

      {/* Timetable Grid */}
      <div className="card overflow-x-auto">
        <div className="min-w-[800px]">
          {/* Header Row */}
          <div className="grid grid-cols-8 gap-2 mb-4">
            <div className="font-bold text-gray-800 dark:text-white text-sm p-2">Time</div>
            {DAYS.map((day) => (
              <div
                key={day}
                className={`font-bold text-gray-800 dark:text-white text-sm p-2 text-center ${
                  day === today ? "text-orange-600" : ""
                }`}
              >
                {day.slice(0, 3).toUpperCase()}
              </div>
            ))}
          </div>

          {/* Time Slots Rows */}
          {TIME_SLOTS.map((timeSlot) => (
            <div key={timeSlot} className="grid grid-cols-8 gap-2 mb-2">
              <div className="font-medium text-gray-600 dark:text-gray-400 text-xs p-2 flex items-center">
                {timeSlot}
              </div>
              {DAYS.map((day) => {
                const slot = timetable[day]?.[timeSlot];
                return (
                  <div
                    key={`${day}-${timeSlot}`}
                    className="relative p-2 min-h-[60px] border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 group"
                  >
                    {slot ? (
                      <div className="h-full flex flex-col justify-between">
                        <div className="text-xs font-medium text-gray-800 dark:text-gray-100 truncate">
                          {slot.subject}
                        </div>
                        {slot.attendance === 'present' && (
                          <div className="text-green-500 text-lg">✓</div>
                        )}
                        {slot.attendance === 'absent' && (
                          <div className="text-red-500 text-lg">✗</div>
                        )}
                        {/* Hover buttons */}
                        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                          <button
                            onClick={() => markAttendance(day, timeSlot, 'present')}
                            className="bg-green-500 text-white px-2 py-1 rounded text-xs hover:bg-green-600"
                          >
                            Present
                          </button>
                          <button
                            onClick={() => markAttendance(day, timeSlot, 'absent')}
                            className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
                          >
                            Absent
                          </button>
                          <button
                            onClick={() => removeSlot(day, timeSlot)}
                            className="bg-gray-500 text-white px-2 py-1 rounded text-xs hover:bg-gray-600"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-gray-300 dark:text-gray-600 text-xs flex items-center justify-center h-full">
                        -
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}

          {/* Day Stats Row */}
          <div className="grid grid-cols-8 gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="font-bold text-gray-800 dark:text-white text-sm p-2">Attendance</div>
            {DAYS.map((day) => {
              const { total, attended, percentage } = getDayStats(day);
              return (
                <div key={day} className="p-2 text-center">
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    {attended}/{total}
                  </div>
                  <div className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                    {percentage}%
                  </div>
                </div>
              );
            })}
          </div>

          {/* Weekly Stats */}
          <div className="mt-4 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
            <div className="text-center">
              <h3 className="font-bold text-gray-800 dark:text-white mb-2">Weekly Attendance</h3>
              {(() => {
                const { totalClasses, totalAttended, percentage } = getWeeklyStats();
                return (
                  <div className="text-lg">
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">{totalAttended}/{totalClasses}</span>
                    <span className="text-gray-600 dark:text-gray-400 ml-2">({percentage}%)</span>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
