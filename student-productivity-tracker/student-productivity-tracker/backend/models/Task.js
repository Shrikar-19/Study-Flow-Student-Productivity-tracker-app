// backend/models/Task.js
// WHY: Mongoose schema defines the shape of our data in MongoDB.
// Adding validation here means bad data never reaches the DB.

const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Task title is required"],
      trim: true,
      maxlength: [200, "Title too long"],
    },
    subject: { type: String, trim: true, default: "" },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    dueDate: { type: String, default: "" },
    completed: { type: Boolean, default: false },
    userId: { type: String, required: true }, // localStorage user identifier
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);
