const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  preferences: {
    type: [String], 
    default: ["movies", "comics"],
  },
});

module.exports = mongoose.model("User", userSchema);
