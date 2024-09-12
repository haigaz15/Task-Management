const mongoose = require("mongoose");

const UserTaskSchema = new mongoose.Schema({
  userContribution: { type: Number, default: 0 },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  taskId: { type: mongoose.Schema.Types.ObjectId, ref: "Task", required: true },
});

const UserTask = mongoose.model("UserTask", UserTaskSchema);

module.exports = UserTask;
