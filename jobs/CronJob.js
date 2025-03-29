const cron = require("node-cron");
const axios = require("axios");
const NodeCache = require("node-cache");
const newsCache = new NodeCache({ stdTTL: 3600, checkperiod: 600 });
const NEWSAPI_KEY = process.env.NEWSAPI_APIKEY;
async function fetchandcache() {
  try {
    console.log("Running scheduled job: Fetching top headlines...");

    const cacheKey = "top_headlines";

    const newsResponse = await axios.get(
      "https://newsapi.org/v2/top-headlines",
      {
        params: {
          country: "us",
          pageSize: 20,
        },
        headers: {
          "X-Api-Key": NEWSAPI_KEY,
        },
      }
    );

    newsCache.set(cacheKey, newsResponse.data.articles);
    console.log("Top headlines cache updated successfully.");
  } catch (err) {
    console.error("Error fetching top headlines:", err);
  }
}
cron.schedule("* * * *", async () => {
  console.log("Cron job started: Fetching and caching news...");
  await fetchandcache();
  console.log("Cron job completed: News updated.");
});
