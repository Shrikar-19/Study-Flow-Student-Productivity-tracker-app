// backend/models/Goal.js
const mongoose = require("mongoose");

const goalSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    target: { type: Number, required: true, min: 1 },
    current: { type: Number, default: 0 },
    unit: { type: String, default: "%" },
    deadline: { type: String, default: "" },
    color: { type: String, default: "#6366f1" },
    userId: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Goal", goalSchema);
