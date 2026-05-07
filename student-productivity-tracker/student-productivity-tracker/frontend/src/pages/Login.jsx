// src/pages/Login.jsx
import { useState } from "react";
import { useApp } from "../context/AppContext";

export default function Login() {
  const { login } = useApp();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [education, setEducation] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return setError("Please enter your name.");
    if (!email.trim()) return setError("Please enter your email address.");
    if (!education.trim()) return setError("Please enter your educational qualification.");
    login({ name: name.trim(), email: email.trim(), education: education.trim() });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-indigo-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-slide-up">
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white text-2xl font-black mx-auto mb-4 shadow-lg shadow-indigo-200">
            SF
          </div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
            StudyFlow
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
            Your personal productivity companion
          </p>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl shadow-indigo-100/50 dark:shadow-none border border-gray-100 dark:border-gray-800 p-8">
          <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-6">
            👋 Welcome! Let's get started.
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                Your Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => { setName(e.target.value); setError(""); }}
                placeholder="e.g. Shrikar Sharma"
                className="input"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(""); }}
                placeholder="e.g. yourname@example.com"
                className="input"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                Educational Qualification
              </label>
              <input
                type="text"
                value={education}
                onChange={(e) => { setEducation(e.target.value); setError(""); }}
                placeholder="e.g. B.Tech in Computer Science"
                className="input"
              />
            </div>

            {error && (
              <p className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">
                {error}
              </p>
            )}

            <button type="submit" className="btn-primary w-full py-3 text-base mt-2">
              Continue to Dashboard →
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
