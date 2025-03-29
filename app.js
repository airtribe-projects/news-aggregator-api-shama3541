const express = require("express");
const app = express();
require("dotenv").config();
const router = require("./routes/UserRoutes");
const newsRoute = require("./routes/NewsRoutes");
const mongoose = require("mongoose");
const port = 3000;

app.use(express.json()); // Ensure JSON parsing middleware is added
app.use(express.urlencoded({ extended: true }));
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB", err));

app.use("/users", router);
app.use("/news", newsRoute);

app.listen(port, (err) => {
  if (err) {
    return console.log(`Something bad happened: ${err}`);
  }
  console.log(`Server is listening on ${port}`);
});

module.exports = app;

