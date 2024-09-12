const UserTask = require("../db/schemas/userTaskSchema");

const insertManyUserTask = async (data) => {
  return await UserTask.insertMany(data);
};

module.exports = { insertManyUserTask };
