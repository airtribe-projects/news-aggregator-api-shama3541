require("dotenv").config();
const crypto = require("crypto");
const axios = require("axios");
const News = require("../models/NewsModel");
const cron = require("node-cron");

cron.schedule("* * * * * *",() => {console.log("Running a task every second");});

const generateUniqueId = (name) => {
  return crypto.createHash("md5").update(name).digest("hex").slice(0, 8);
};


async function getNews(req, res) {
  try {
    const existingNews = await News.find({
      cachedAt: { $gte: new Date(Date.now() - 3600 * 1000) },
    })
      .sort({ publishedAt: -1 })
      .limit(20)
      .select("source.id title url publishedAt author description urlToImage");

    if (existingNews.length > 0) {
      console.log("Fetching from Cache...");
      return res.json({ news: existingNews });
    }

    console.log("Fetching from API...");
    const newsResponse = await axios.get(
      `https://newsapi.org/v2/everything?q=horror&apiKey=${process.env.NEWSAPI_APIKEY}`
    );

    const articles = newsResponse.data.articles;
    const updateid = articles.map((article, index) => {
      article.source.id = generateUniqueId(article.source.name);
    });

    const bulkOps = articles.map((article) => ({
      updateOne: {
        filter: { url: article.url },
        update: {
          $set: {
            ...article,
            cachedAt: new Date(),
          }, // Ensures "source.id" is correctly set
        },
        upsert: true,
      },
    }));

    await News.bulkWrite(bulkOps);

    const updatedNews = await News.find()
      .sort({ publishedAt: -1 })
      .limit(20)
      .select("source.id title url publishedAt author description urlToImage");

    res.json({ news: updatedNews });
  } catch (err) {
    console.error(err);
    return res.status(500).send("An error occurred");
  }
}

async function markAsRead(req, res) {
  const id = req.params.id;
  try {
    const news = await News.findOneAndUpdate(
      { "source.id": id },
      { read: true }
    );
    if (!news) {
      return res.status(404).send("News not found");
    }
    return res.send("News marked as read");
  } catch (err) {
    console.error(err);
    return res.status(500).send("An error occurred");
  }
}

async function markAsFavourite(req, res) {
  const id = req.params.id;
  try {
    const news = await News.findOneAndUpdate(
      { "source.id": id },
      { favourite: true }
    );
    if (!news) {
      return res.status(404).send("News not found");
    }
    return res.send("News marked as read");
  } catch (err) {
    console.error(err);
    return res.status(500).send("An error occurred");
  }
}

async function getFavourites(req, res) {
  try {
    const favourites = await News.find({ favourite: true })
      .sort({ publishedAt: -1 })
      .limit(20)
      .select("source.id title url publishedAt author description urlToImage");

    res.json({ favourites });
  } catch (err) {
    console.error(err);
    return res.status(500).send("An error occurred");
  }
}

async function getRead(req, res) {
  try {
    const favourites = await News.find({ read: true })
      .sort({ publishedAt: -1 })
      .limit(20)
      .select("source.id title url publishedAt author description urlToImage");

    res.json({ favourites });
  } catch (err) {
    console.error(err);
    return res.status(500).send("An error occurred");
  }
}

module.exports = {
  getNews,
  markAsRead,
  getFavourites,
  getRead,
  markAsFavourite,
};
