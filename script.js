const config = require("./config.js");
const twit = require("twit");
const T = new twit(config);

// RETWEET

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

// NEWS

function tweetNews() {
  const statsArray = ["hello", "How ya doin", "I love node"];
  //selects random tweets from the array
  const stat = statsArray[Math.floor(Math.random() * statsArray.length)];

  const tweet = {
    status:
      "https://mars.nasa.gov/mars2020-raw-images/pub/ods/surface/sol/00002/ids/fdr/browse/zcam/ZRF_0002_0667131195_000FDR_N0010052AUT_04096_0260LUJ01_1200.jpg",
  };

  function tweeted(err, data, response) {
    if (err) {
      console.log("Error:", err);
    } else {
      console.log("Done");
    }
  }

  T.post("statuses/update", tweet, tweeted);
}

// ASTRONOMY IMAGE OF THE DAY

function tweetImage() {
  /* Then pick a random image from the images object. */

  const image = randomFromArray(images);
  console.log("opening an image...", image);

  const imagePath = path.join(__dirname, "/images/" + image.file);
  const imageSource = image.source;
  const imageData = fs.readFileSync(imagePath, { encoding: "base64" });

  /* Upload the image to Twitter. */

  console.log("Uploading...", imagePath);

  T.post(
    "media/upload",
    { media_data: imageData },
    function (err, data, response) {
      if (err) {
        console.log("error:", err);
      } else {
        /* Add image description. */

        const image = data;
        console.log("Image uploaded, adding description...");

        T.post(
          "media/metadata/create",
          {
            media_id: image.media_id_string,
            alt_text: {
              text: "Describe the image",
            },
          },
          function (err, data, response) {
            /* And finally, post a tweet with the image. */

            T.post(
              "statuses/update",
              {
                status: `Image source: ${imageSource}`,
                media_ids: [image.media_id_string],
              },
              function (err, data, response) {
                if (err) {
                  console.log("Error:", err);
                } else {
                  console.log("Done");
                }
              }
            );
          }
        );
      }
    }
  );
}

// setInterval(function () {
//   tweetImage();
// }, 10000);

// setInterval(() => {
//   reTweet("#spaceX OR #Mars OR #Nasa OR #blueOrigin");     // Run every 5 hours
// }, 18000000);

setInterval(tweetNews, 60000); //every 1 hour
