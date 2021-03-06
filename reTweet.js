const config = require("./config.js");
const twit = require("twit");

const T = new twit(config);

const reTweet = () => {
  // set search params
  const searchText =
    "#spaceX OR #Mars OR #Nasa OR #blueOrigin OR #spaceExploration OR #blackHole";

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
                console.log("Error:", err_rt);
              }
            }
          );
        }
      } else {
        console.log("Error searching:", err_search);
        process.exit(1);
      }
    }
  );
};

module.exports = reTweet;
