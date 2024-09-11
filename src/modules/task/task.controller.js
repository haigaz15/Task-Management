const TaskService = require("./task.service");

const createTasks = async (req, res, next) => {
  try {
    await TaskService.createTasks(req, res);
    res.status(201).json({ message: "Tasks sucessfully created!" });
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

const updateTaskStatus = (req, res, next) => {};

module.exports = { createTasks, getTaskDetails, updateTaskStatus };
