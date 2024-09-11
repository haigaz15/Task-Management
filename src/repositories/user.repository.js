const { User } = require("../db/schemas/userSchema");

const insertManyUsers = async (data) => {
  return await User.insertMany(data);
};

const updateManyUsers = async (query, data) => {
  return User.updateMany(query, data);
};

module.exports = { insertManyUsers, updateManyUsers };
