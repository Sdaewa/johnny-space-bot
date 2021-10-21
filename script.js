const config = require("./config.js");
const twit = require("twit");
const T = new twit(config);

const reTweet = (searchText) => {
  // set search params
  const params = {
    q: searchText + "",
    result_type: "recent",
    lang: "en",
    count: 10,
  };

  T.get(
    "search/tweets",
    params,
    function (err_search, data_search, response_search) {
      let tweets = data_search.statuses;

      if (!err_search) {
        let tweetIDList = [];

        for (let tweet of tweets) {
          //avoid duplicates
          if (tweet.text.startsWith("RT @")) {
            if (tweet.retweeted_status) {
              tweetIDList.push(tweet.retweeted_status.id_str);
            } else {
              tweetIDList.push(tweet.id_str);
            }
          } else {
            tweetIDList.push(tweet.id_str);
          }
        }

        // unique elements from an array
        const onlyUnique = (value, index, self) => {
          return self.indexOf(value) === index;
        };

        // unique entries
        tweetIDList = tweetIDList.filter(onlyUnique);

        // retweeting EACH of the tweetID
        for (let tweetID of tweetIDList) {
          T.post(
            "statuses/retweet/:id",
            {
              id: tweetID,
            },
            (err_rt, data_rt, response_rt) => {
              if (!err_rt) {
                console.log("\n\nRetweeted! ID - " + tweetID);
              } else {
                console.log("Duplication found ID => " + tweetID);
                console.log("Error = " + err_rt);
              }
            }
          );
        }
      } else {
        console.log("Error searching" + err_search);
        process.exit(1);
      }
    }
  );
};

function tweetThis() {
  var statsArray = ["hello", "How ya doin", "I love node"];
  //selects random tweets from the array
  var stat = statsArray[Math.floor(Math.random() * statsArray.length)];

  var tweet = {
    status: stat,
  };

  T.post("statuses/update", tweet, tweeted);

  function tweeted(err, data, response) {
    if (err) {
      console.log("Something is wrong");
    } else {
      console.log("Works fine");
    }
  }
}

// Run every 5 hours
setInterval(() => {
  reTweet("#spaceX OR #Mars OR #Nasa OR #blueOrigin");
}, 18000000);

setInterval(tweetThis, 60000); //every 1 hour
