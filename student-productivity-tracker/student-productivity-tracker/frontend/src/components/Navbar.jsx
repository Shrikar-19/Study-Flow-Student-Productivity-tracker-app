// src/components/Navbar.jsx
import { useLocation } from "react-router-dom";
import { useApp } from "../context/AppContext";

const PAGE_TITLES = {
  "/": "Dashboard",
  "/tasks": "Task Manager",
  "/timetable": "Weekly Timetable",
  "/goals": "Goal Tracker",
  "/analytics": "Analytics",
  "/report": "Daily Report",
};

export default function Navbar({ onMenuClick }) {
  const { darkMode, setDarkMode } = useApp();
  const location = useLocation();
  const title = PAGE_TITLES[location.pathname] || "StudyFlow";
  const now = new Date();
  const dateStr = now.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <header className="sticky top-0 z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur border-b border-gray-100 dark:border-gray-800 px-4 md:px-6 h-14 flex items-center justify-between gap-4">
      {/* Mobile menu button */}
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Title */}
      <div className="flex-1">
        <h1 className="text-base font-bold text-gray-900 dark:text-white">{title}</h1>
        <p className="text-xs text-gray-400 hidden sm:block">{dateStr}</p>
      </div>

      {/* Dark mode toggle */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors"
        title="Toggle dark mode"
      >
        {darkMode ? "☀️" : "🌙"}
      </button>
    </header>
  );
}
