const express = require("express")
const TaskController = require("../modules/task/task.controller")
const route = express.Router()

route.post("/tasks",TaskController.createTasks)

route.get("/task/:id",TaskController.getTaskDetails)

route.put("task/:id",TaskController.updateTaskStatus)

module.exports = route