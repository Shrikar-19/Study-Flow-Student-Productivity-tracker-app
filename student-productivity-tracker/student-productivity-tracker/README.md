# 🎓 StudyFlow — Student Productivity Tracker

---

## 🚀 Quick Start

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (free tier)

---

## ⚡ Run Locally (5 minutes)

### 1. Clone / Extract the project
```bash
cd student-productivity-tracker
```

### 2. Setup Backend
```bash
cd backend
cp .env.example .env
# Edit .env and add your MongoDB Atlas URI
npm install
npm run dev
# → Server runs on http://localhost:5000
```

### 3. Setup Frontend
```bash
cd ../frontend
npm install
npm run dev
# → App runs on http://localhost:5173
```

Open http://localhost:5173 in your browser. Done! 🎉

---

## 📁 Project Structure

```
student-productivity-tracker/
├── frontend/
│   └── src/
│       ├── components/     ← Reusable UI (Sidebar, Navbar, TaskCard...)
│       ├── pages/          ← Full page components
│       ├── context/        ← Global state (AppContext)
│       └── main.jsx        ← Entry point
└── backend/
    ├── models/             ← MongoDB schemas
    ├── controllers/        ← Business logic
    ├── routes/             ← API endpoints
    ├── config/             ← DB connection
    └── server.js           ← Entry point
```

---

## 🔌 API Endpoints

```
GET    /api/tasks?userId=xxx    → Get all tasks
POST   /api/tasks               → Create task
PUT    /api/tasks/:id           → Update task
DELETE /api/tasks/:id           → Delete task

GET    /api/goals?userId=xxx    → Get all goals
POST   /api/goals               → Create goal
PUT    /api/goals/:id           → Update goal
DELETE /api/goals/:id           → Delete goal

GET    /api/health              → Health check
```

---

## 🌐 Deployment

### Frontend → Vercel
```bash
cd frontend
npm run build
# 1. Push to GitHub
# 2. Connect repo on vercel.com
# 3. Set framework to Vite
# 4. Deploy!
```

### Backend → Render
```
1. Push backend/ to GitHub
2. Create Web Service on render.com
3. Set environment variables:
   - MONGODB_URI = your Atlas URI
   - FRONTEND_URL = https://your-app.vercel.app
4. Start command: node server.js
5. Deploy!
```

---

## ⚠️ Common Errors & Fixes

| Error | Fix |
|-------|-----|
| `ECONNREFUSED` on MongoDB | Check MONGODB_URI in .env |
| CORS error | Add Vercel URL to FRONTEND_URL in backend .env |
| `Cannot find module` | Run `npm install` in that folder |
| Port already in use | Change PORT in .env |
| Blank screen on Vercel | Set `base: '/'` in vite.config.js |

---

## ✨ Features

- 📝 Task management with priorities
- 📅 Weekly timetable editor  
- 🎯 Goal tracking with progress bars
- 📊 Analytics (Pie, Bar, Line charts)
- 🍅 Pomodoro timer (logs study sessions)
- 📋 Daily report generator
- 🌙 Dark / Light mode
- 📱 Fully responsive

---

