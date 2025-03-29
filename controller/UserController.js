require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const saltRounds = 10;
const axios = require("axios");
const User = require("../models/UserModel");
const NEWSAPI_KEY = process.env.NEWSAPI_APIKEY;

async function registerUser(req, res) {
  const username = req.body.name;
  const password = req.body.password;
  const email = req.body.email;

  const preferences = req.body.preferences;
  if (!email) {
    return res.status(400).send("Please enter email");
  }
  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newUser = new User({
      name: username,
      password: hashedPassword,
      email: email,
      preferences: preferences,
    });
    await newUser.save();
    return res.send("User registered successfully");
  } catch (err) {
    console.log(err);
    return res.status(500).send("An error occurred");
  }
}

async function loginUser(req, res) {
  const email = req.body.email;
  const password = req.body.password;
  const foundUser = await User.findOne({ email: email });
  if (!foundUser) {
    return res.status(400).send("User not found");
  }
  const match = await bcrypt.compare(password, foundUser.password);
  if (match) {
    const token = jwt.sign({ email: email }, process.env.JWTSECRETKEY);
    return res.json({ token: token });
  } else {
    return res.status(401).send("Invalid credentials");
  }
}

async function getUserPreferences(req, res) {
  const email = req.user.email;
  try {
    const foundPreference = await User.findOne({ email: email });
    return res.json({ preferences: foundPreference.preferences });
  } catch (err) {
    console.log(err);
    return res.status(500).send("An error occurred");
  }
}

async function updateUserPreferences(req, res) {
  const email = req.user.email;
  const newpreferences = req.body.preferences;

  try {
    const updatedUserPreferences = await User.findOneAndUpdate(
      { email: email },
      { preferences: newpreferences }
    );
    return res.send("Preferences updated successfully");
  } catch (err) {
    console.log(err);
    return res.status(500).send("An error occurred");
  }
}

module.exports = {
  registerUser,
  loginUser,
  getUserPreferences,
  updateUserPreferences
};
