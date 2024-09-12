const TaskService = require("./task.service");

const createTask = async (req, res, next) => {
  try {
    const userTasks = await TaskService.createTask(req, res);
    res
      .status(201)
      .json({ message: "Task sucessfully created!", userTasks: userTasks });
  } catch (err) {
    next(err);
  }
};

const createTasks = async (req, res, next) => {
  try {
    const userTasks = await TaskService.createTasks(req, res);
    res
      .status(201)
      .json({ message: "Tasks sucessfully created!", userTasks: userTasks });
  } catch (err) {
    next(err);
  }
};

const getTaskDetails = async (req, res, next) => {
  try {
    const task = await TaskService.getTaskDetails(req, res);
    res.status(200).json(task);
  } catch (err) {
    next(err);
  }
};

const updateTaskStatus = async (req, res, next) => {
  try {
    const updatedTask = await TaskService.updateTaskStatus(req, res);
    res.status(200).json({ message: "Task updated sucessfully!", updatedTask });
  } catch (err) {
    next(err);
  }
};

module.exports = { createTasks, getTaskDetails, updateTaskStatus, createTask };
