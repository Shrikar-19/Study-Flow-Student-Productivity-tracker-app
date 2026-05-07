// src/components/Sidebar.jsx
import { NavLink } from "react-router-dom";
import { useApp } from "../context/AppContext";

const NAV = [
  { to: "/", label: "Dashboard", icon: "⊞", end: true },
  { to: "/tasks", label: "Tasks", icon: "✓" },
  { to: "/timetable", label: "Timetable", icon: "📅" },
  { to: "/goals", label: "Goals", icon: "🎯" },
  { to: "/analytics", label: "Analytics", icon: "📊" },
  { to: "/report", label: "Daily Report", icon: "📋" },
];

export default function Sidebar({ open, onClose }) {
  const { user, logout, stats } = useApp();

  return (
    <aside
      className={`
        fixed top-0 left-0 h-full w-60 z-30
        bg-white dark:bg-gray-900
        border-r border-gray-100 dark:border-gray-800
        flex flex-col
        transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0
      `}
    >
      {/* Logo */}
      <div className="p-5 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
            SF
          </div>
          <span className="font-bold text-gray-900 dark:text-white text-lg tracking-tight">
            StudyFlow
          </span>
        </div>
      </div>

      {/* User info */}
      <div className="p-4 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-300 font-bold text-sm">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-800 dark:text-white truncate">
              {user?.name}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {user?.education}
            </p>
          </div>
        </div>
        {/* Streak badge */}
        <div className="mt-3 flex items-center gap-2 bg-orange-50 dark:bg-orange-900/20 rounded-xl p-2.5">
          <span className="text-lg">🔥</span>
          <div>
            <p className="text-xs font-bold text-orange-600 dark:text-orange-400">
              {stats.streak} day streak
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500">Keep it going!</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {NAV.map(({ to, label, icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onClose}
            className={({ isActive }) =>
              `nav-link ${isActive ? "nav-link-active" : ""}`
            }
          >
            <span className="text-base w-5 text-center">{icon}</span>
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-gray-100 dark:border-gray-800">
        <button
          onClick={logout}
          className="nav-link w-full text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600"
        >
          <span>🚪</span>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
