const express = require('express');
const app = express();
require('dotenv').config()
const router = require('./routes/Routes');
const newsRoute = require('./routes/news')
const mongoose = require('mongoose');
const port = 3000;

app.use(express.json()); // Ensure JSON parsing middleware is added
app.use(express.urlencoded({ extended: true }));
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("Connected to MongoDB successfully!"))
.catch((error) => {
    console.error("MongoDB connection error:", error);
    process.exit(1); // Exit the process if DB connection fails
});

app.use('/users', router);
app.use('/news',newsRoute)

app.listen(port, (err) => {
    if (err) {
        return console.log('Something bad happened', err);
    }
    console.log(`Server is listening on ${port}`);
});

module.exports = app;