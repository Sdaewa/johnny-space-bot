const express = require("express");
const config = require("./config.js");
const axios = require("axios");
const http = require("http");
const twit = require("twit");
const fs = require("fs");
const request = require("request");
const os = require("os");
const tmpDir = os.tmpdir();
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");
const imageToBase64 = require("image-to-base64");
const { res } = require("express");
const getAPOD = require("./getpic");

const app = express();

const T = new twit(config);

// cloudinary.config({
//   cloud_name: process.env.CLOUD_NAME,
//   api_key: process.env.CLOUD_API_KEY,
//   api_secret: process.env.CLOUD_API_SECRET,
// });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
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
}

// ISS DAILY REPORT

function tweetReport() {
  axios.get("https://api.spaceflightnewsapi.net/v3/reports").then((res) => {
    let articleTitle = res.data[0].title;
    let articleSite = res.data[0].newsSite;
    let articleUrl = res.data[0].url;

    const tweet = {
      status: articleSite + " - " + articleTitle + " " + articleUrl,
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
}

// ASTRONOMY IMAGE OF THE DAY

// function tweetImage() {
//   axios
//     .get(
//       `https://api.nasa.gov/planetary/apod?api_key=${process.env.NASA_API_KEY}`
//     )
//     .then((res) => {
//       let imageTitle = res.data.title.split("//")[1];
//       let imageUrl = res.data.url;
//       let imageDate = res.data.date;
//       let imageCopyright = res.data.copyright;

//       axios
//         .get(imageUrl)
//         .then((res) => {
//           imageToBase64(res.config.url)
//             .then((res) => {
//               const imageData = `data:image/jpg;base64,${res}`;
//               T.postMediaChunked(
//                 "media/upload",
//                 { media_data: imageData },
//                 function (err, data, res) {
//                   console.log(data);
//                   // now we can assign alt text to the media, for use by screen readers and
//                   // other text-based presentations and interpreters
//                   var mediaIdStr = data.media_id_string;
//                   var altText = imageTitle;
//                   var meta_params = {
//                     media_id: mediaIdStr,
//                     alt_text: { text: altText },
//                   };

//                   T.post(
//                     "media/metadata/create",
//                     meta_params,
//                     function (err, data, response) {
//                       if (!err) {
//                         // now we can reference the media and post a tweet (media will attach to the tweet)
//                         var params = {
//                           status:
//                             imageTitle + " " + imageDate + " " + imageCopyright,
//                           media_ids: [mediaIdStr],
//                         };

//                         T.post(
//                           "statuses/update",
//                           params,
//                           function (err, data, response) {
//                             console.log(data);
//                           }
//                         );
//                       }
//                     }
//                   );
//                 }
//               );
//               // cloudinary.uploader
//               //   .upload(imageData)
//               //   .then((result) => {
//               //     console.log("succes");
//               //     res.status(200).send({
//               //       message: "success",
//               //       result,
//               //     });
//               //   })
//               //   .catch((error) => {
//               //     res.status(500).send({
//               //       message: "failure",
//               //       error,
//               //     });
//               //   });
//             })
//             .catch((error) => {
//               console.log(error);
//             });
//         })
//         .catch((err) => {
//           console.log(err);
//         });
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// }

// setInterval(function () {
//   tweetImage();
// }, 10000);

// setInterval(() => {
//   reTweet("#spaceX OR #Mars OR #Nasa OR #blueOrigin OR #spaceExploration #blackHole"); // Run every 5 hours
// }, 18000000);

// setInterval(tweetReport, 28800000); //every 8 hour

// setInterval(tweetNews, 28800000); //every 8 hour

// tweetImage();

getAPOD();
