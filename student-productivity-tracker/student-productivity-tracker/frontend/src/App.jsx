// src/App.jsx
// WHY: This is the router. It decides WHICH page to show based on the URL.
// If no user is logged in, always redirect to /login.

import { Routes, Route, Navigate } from "react-router-dom";
import { useApp } from "./context/AppContext";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
import Timetable from "./pages/Timetable";
import Analytics from "./pages/Analytics";
import Goals from "./pages/Goals";
import DailyReport from "./pages/DailyReport";

function ProtectedRoute({ children }) {
  const { user } = useApp();
  return user ? children : <Navigate to="/login" replace />;
}

export default function App() {
  const { user } = useApp();

  return (
    <Routes>
      <Route
        path="/login"
        element={user ? <Navigate to="/" replace /> : <Login />}
      />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="tasks" element={<Tasks />} />
        <Route path="timetable" element={<Timetable />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="goals" element={<Goals />} />
        <Route path="report" element={<DailyReport />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
