const Task = require("../db/schemas/taskSchema");

const findById = async (query) => {
  return await Task.findById(query);
};

const create = async (data) => {
  await Task.create(data);
};

const update = async (query, data, options) => {
  await Task.findByIdAndUpdate(query, data, options);
};

module.exports = { findById, create, update };
