const { generateUniqueId } = require("../controller/ NewsController");
const cron = require("node-cron");
require("dotenv").config();
const axios = require("axios");
const NodeCache = require("node-cache");
const newsCache = new NodeCache({ stdTTL: 3600, checkperiod: 600 });
const NEWSAPI_KEY = process.env.NEWSAPI_APIKEY;
async function fetchandcache(){
  try {
    console.log("Running scheduled job: Fetching top headlines...");

    const cacheKey = "top_headlines";

    // Fetch top headlines
    const newsResponse = await axios.get("https://newsapi.org/v2/top-headlines", {
      params: {
        country: "us", // Change to preferred country
        pageSize: 20,
      },
      headers: {
        "X-Api-Key": NEWSAPI_KEY,
      },
    });



    // Store in cache
    newsCache.set(cacheKey, newsResponse.data.articles);
    console.log("Top headlines cache updated successfully.");
  } catch (err) {
    console.error("Error fetching top headlines:", err);
  }
}
cron.schedule("*/1 * * * * *", async () => {
  console.log("Cron job started: Fetching and caching news...");
  await fetchandcache();
  console.log("Cron job completed: News updated.");
});
