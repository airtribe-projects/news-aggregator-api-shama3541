const express = require('express');
const router = express.Router();
const { verifyJwt } = require('../middleware/Middleware'); // Ensure correct path
const {getNews} = require('../controller/User');


router.get('/',verifyJwt,getNews)

module.exports = router;