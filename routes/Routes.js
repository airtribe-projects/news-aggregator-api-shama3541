const express = require('express');
const router = express.Router();
const { verifyJwt,zodValidator,checkdbforexistinguser } = require('../middleware/Middleware'); // Ensure correct path
const { registerUser,loginUser,getUserPreferences,updateUserPreferences} = require('../controller/User'); // Ensure correct path

router.post('/signup',zodValidator,checkdbforexistinguser,registerUser);
router.post('/login',zodValidator, loginUser);
router.get('/preferences',verifyJwt,getUserPreferences);
router.put('/preferences',verifyJwt,updateUserPreferences);

module.exports = router;