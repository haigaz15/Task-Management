const Task = require("../db/schemas/taskSchema");

const findTaskById = async (query) => {
  return await Task.findById(query).exec();
};
const insertManyTasks = async (data) => {
  return await Task.insertMany(data);
};
const createTask = async (data) => {
  await Task.create(data);
};

const updateTask = async (query, data, options) => {
  await Task.findByIdAndUpdate(query, data, options);
};

module.exports = { findTaskById, createTask, updateTask, insertManyTasks };
