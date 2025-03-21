const express = require('express');
const router = express.Router();
const { verifyjwt } = require('../middleware/Middleware'); // Ensure correct path
const {getNews} = require('../controller/User');


router.get('/',verifyjwt,getNews)

module.exports = router;