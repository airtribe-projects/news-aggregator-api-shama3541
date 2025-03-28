require("dotenv").config();
const NodeCache = require("node-cache");
const crypto = require("crypto");
const axios = require("axios");
const News = require("../models/NewsModel");
const User = require("../models/UserModel");
const newsCache = new NodeCache({ stdTTL: 3600, checkperiod: 600 });
require("../jobs/CronJob");
const NEWSAPI_KEY = process.env.NEWSAPI_APIKEY;

function generateUniqueId(name) {
    return crypto.createHash("md5").update(name).digest("hex").slice(0, 8);
}



async function getNews(req, res) {
  try {
    const email = req.user.email;
    const Findpreference = await User.findOne({ email: email })
    console.log(Findpreference.preferences)
    
  for (let i = 0; i < Findpreference.preferences.length; i++) {
    const cachedNews = newsCache.get(Findpreference.preferences[i]);
    if (cachedNews) {
      console.log("Fetching from Cache...");
      return res.json({ news: cachedNews });
    }
  }

   
    const newsResponse = await axios.get("https://newsapi.org/v2/everything", {
      params: {
        q: Findpreference.preferences[1], 
        sortBy: "publishedAt",
        pageSize: 20,
      },
      headers: {
        "X-Api-Key": NEWSAPI_KEY,
      },
    });

    const articles = newsResponse.data.articles.map((article) => ({
      source: { id: generateUniqueId(article.source.name) },
      title: article.title,
      url: article.url,
      publishedAt: article.publishedAt,
      author: article.author,
      description: article.description,
      urlToImage: article.urlToImage,
    }));

    // Store in cache
    Findpreference.preferences.map((preference)=>newsCache.set(preference, articles));

    console.log("Fetching from API...");
    return res.json({ news: articles });
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


async function searchNews(req, res) {
  const query = req.params.keyword
  try {
    const news = await News.find({title: { $regex: query, $options: "i" }} )
      .sort({ publishedAt: -1 })
      .limit(20)
      .select("source.id title url publishedAt author description urlToImage");
    if(news.length > 0){
      return  res.json({ news });
    }
    const Latestnews= await await axios.get("https://newsapi.org/v2/everything", {
      params: {
          q: query,
      },
      headers: {
          "X-Api-Key": NEWSAPI_KEY,
      }
   });
        const articles = Latestnews.data.articles;
        return res.json({ news: articles });
    
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
  generateUniqueId,
  searchNews
};
