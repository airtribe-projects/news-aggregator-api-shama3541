const express = require('express');
const router = express.Router();
const { verifyjwt,zodValidator } = require('../middleware/Middleware'); // Ensure correct path
const { registerUser,loginUser,getUserPreferences,updateUserPreferences,getNews} = require('../controller/User'); // Ensure correct path

router.post('/signup',registerUser);
router.post('/login', loginUser);
router.get('/preferences',verifyjwt,getUserPreferences);
router.get('/news',verifyjwt,getNews)
router.put('/preferences',verifyjwt,updateUserPreferences);

module.exports = router;