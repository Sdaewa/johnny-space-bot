const tweetApod = require("./tweetApod");
const reTweet = require("./reTweet");
const tweetNews = require("./tweetNews");
const tweetReport = require("./tweetReport");

// RETWEET

setInterval(() => {
  reTweet(); //every 5 hours
}, 18000000);

// NEWS

setInterval(tweetNews, 28800000); //every 8 hour

// ISS DAILY REPORT

setInterval(tweetReport, 86400000); //every 24 hour

// ASTRONOMY IMAGE OF THE DAY

setInterval(tweetApod, 86400000); //every 24 hour
