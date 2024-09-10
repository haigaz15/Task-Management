const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  descriptino: { type: String, required: true },
  dueData: { type: Date, required: true },
  priority: { type: Number, required: true },
  assignedMember: { type: Number, required: true },
});


const Task = mongoose.model("task",TaskSchema);

module.exports = Task;