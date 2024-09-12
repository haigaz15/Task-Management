const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  firstName: { type: String },
  lastName: { type: String },
});

const User = mongoose.model("user", UserSchema);

module.exports = { User, UserSchema };
