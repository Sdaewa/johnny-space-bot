const config = require("./config.js");
const axios = require("axios");
const twit = require("twit");

const T = new twit(config);

const tweetNews = () => {
  axios.get("https://api.spaceflightnewsapi.net/v3/articles").then((res) => {
    let articleTitle = res.data[0].title;
    let articleUrl = res.data[0].url;

    const tweet = {
      status: articleTitle + " " + articleUrl,
    };

    function tweeted(err, data, res) {
      if (err) {
        console.log("Error:", err);
      } else {
        console.log("Done");
      }
    }

    T.post("statuses/update", tweet, tweeted);
  });
};

module.exports = tweetNews;
