
const {getNews} = require("../controller/News");
const cron = require('node-cron');


cron.schedule("0 * * * *", async () => {
    console.log("Cron job started: Fetching and caching news...");
    await getNews();
    console.log("Cron job completed: News updated.");
  });
