const express = require("express");
const TaskController = require("../modules/task/task.controller");
const ReportController = require("../modules/report/report.controller");
const route = express.Router();

route.post("/task", TaskController.createTask);

route.post("/tasks", TaskController.createTasks);

route.get("/task/report", ReportController.taskCompletionReport);

route.get("/task/:taskId", TaskController.getTaskDetails);

route.put("/task/:taskId", TaskController.updateTaskStatus);

module.exports = route;
