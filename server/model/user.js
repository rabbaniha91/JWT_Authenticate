const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  userName: { type: String, required: true },
  role: {
    user: { type: Boolean, default: true },
    Editor: { type: Boolean, default: false },
    Admin: { type: Boolean, default: false },
  },
  password: { type: String, required: true },
  refreshToken: [String],
});

const User = mongoose.model("User", userSchema);

module.exports = User;
