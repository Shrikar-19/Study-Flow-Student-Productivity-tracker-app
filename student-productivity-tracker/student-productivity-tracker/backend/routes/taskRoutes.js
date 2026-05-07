// backend/routes/taskRoutes.js
// WHY: Routes define the URL pattern. Controllers handle the logic.
// Express Router lets us group related routes together.

const express = require("express");
const router = express.Router();
const {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");

router.get("/", getTasks);          // GET  /api/tasks
router.post("/", createTask);       // POST /api/tasks
router.put("/:id", updateTask);     // PUT  /api/tasks/:id
router.delete("/:id", deleteTask);  // DEL  /api/tasks/:id

module.exports = router;
