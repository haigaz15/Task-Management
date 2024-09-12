const { User } = require("../db/schemas/userSchema");

const findOne = async (query) => {
  return await User.findOne(query);
};

const find = async (query) => {
  return await User.find(query);
};

const createUser = async (data) => {
  return await User.create(data);
};

const insertManyUsers = async (data) => {
  return await User.insertMany(data);
};

const updateManyUsers = async (query, data) => {
  return User.updateMany(query, data);
};

module.exports = {
  findOne,
  find,
  createUser,
  insertManyUsers,
  updateManyUsers,
};
