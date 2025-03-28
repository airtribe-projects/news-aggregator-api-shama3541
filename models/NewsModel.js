const mongoose = require("mongoose");
const { any } = require("zod");
const NewsSchema = new mongoose.Schema({
  source: {
    id: { type: mongoose.Schema.Types.Mixed, default: null },
    name: { type: String, required: true },
  },
  author: { type: String, default: "Unknown" },
  title: { type: String, required: true },
  description: { type: String },
  url: { type: String, required: true, unique: true },
  urlToImage: { type: String },
  publishedAt: { type: Date, required: true },
  content: { type: String },
  favourite: { type: Boolean, default: false },
  read: { type: Boolean, default: false },
  cachedAt: { type: Date, default: Date.now, expires: 3600 }, 
});

const News = mongoose.model("News", NewsSchema);

module.exports = News;
