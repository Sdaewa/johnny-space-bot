const config = require("./config.js");
const twit = require("twit");

const tweetApod = require("./tweetApod");
const reTweet = require("./reTweet");
const tweetNews = require("./tweetNews");
const tweetReport = require("./tweetReport");

const T = new twit(config);

// RETWEET
reTweet(
  "#spaceX OR #Mars OR #Nasa OR #blueOrigin OR #spaceExploration #blackHole"
);
setInterval(() => {
  reTweet(
    "#spaceX OR #Mars OR #Nasa OR #blueOrigin OR #spaceExploration #blackHole"
  ); //every 5 hours
}, 18000000);

// NEWS
setInterval(tweetNews, 28800000); //every 8 hour

// ISS DAILY REPORT
setInterval(tweetReport, 28800000); //every 8 hour

// ASTRONOMY IMAGE OF THE DAY
setInterval(tweetApod, 86, 400, 000); //every 24 hour
