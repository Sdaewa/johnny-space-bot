const tweetApod = require("./tweetApod");
const reTweet = require("./reTweet");
const tweetNews = require("./tweetNews");
const tweetReport = require("./tweetReport");

// RETWEET

// setInterval(() => {
//   reTweet(); //every 5 hours
// }, 18000000);
reTweet();

// NEWS

// setInterval(tweetNews, 28800000); //every 8 hour
tweetNews();

// ISS DAILY REPORT

// setInterval(tweetReport, 86400000); //every 24 hour
tweetReport();

// ASTRONOMY IMAGE OF THE DAY

// setInterval(tweetApod, 86400000); //every 24 hour
tweetApod();
