
const {getNews} = require("../controller/ NewsController");
const cron = require('node-cron');


// cron.schedule("0 * * * *", async () => {
//     console.log("Cron job started: Fetching and caching news...");
//     await getNews();
//     console.log("Cron job completed: News updated.");
//   });

cron.schedule("*/1 * * * * *", async () => {
    console.log("Cron job started: Fetching and caching news...");
    await getNews();
    console.log("Cron job completed: News updated.");
  });

