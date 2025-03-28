const express = require("express");
const router = express.Router();
const { verifyJwt } = require("../middleware/Middleware"); // Ensure correct path
const {
  getNews,
  markAsRead,
  markAsFavourite,
  getFavourites,
  getRead,
  searchNews
} = require("../controller/ NewsController");

router.post("/", verifyJwt, getNews);
router.post("/:id/read", verifyJwt, markAsRead);
router.post("/:id/favourite", verifyJwt, markAsFavourite);
router.get("/favourites", verifyJwt, getFavourites);
router.get("/read", verifyJwt, getRead);
router.get("/search/:keyword",verifyJwt, searchNews);

module.exports = router;
