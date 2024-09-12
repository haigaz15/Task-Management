const UserTask = require("../db/schemas/userTaskSchema");

const insertManyUserTask = async (data) => {
  return await UserTask.insertMany(data);
};

const find = async (query) => {
  return await UserTask.find(query);
};

const updateUserTask = async (query, data) => {
  return await UserTask.findOneAndUpdate(query, data, { new: true });
};

module.exports = { insertManyUserTask, find, updateUserTask };
