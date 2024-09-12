const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  dueData: { type: Date, required: true },
  priority: { type: Number, required: true },
  status: {
    type: String,
    enum: ["in-complete", "in-progress", "completed"],
    default: "in-complete",
  },
  progressLevel: { type: Number, default: 0 },
});

const Task = mongoose.model("task", TaskSchema);

module.exports = Task;
