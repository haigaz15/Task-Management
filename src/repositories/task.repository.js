const Task = require("../db/schemas/taskSchema");

const find = async (query) => {
  return await Task.find(query);
};
const findTaskById = async (query) => {
  return await Task.findById(query);
};
const insertManyTasks = async (data) => {
  return await Task.insertMany(data);
};
const createTask = async (data) => {
  return await Task.create(data);
};

const updateTask = async (query, data, options) => {
  await Task.findByIdAndUpdate(query, data, options);
};

module.exports = {
  findTaskById,
  createTask,
  updateTask,
  insertManyTasks,
  find,
};
