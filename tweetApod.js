const Twit = require("twit");
const request = require("request");
const fs = require("fs");
const config = require("./config");
const path = require("path");

const T = new Twit(config);

const os = require("os");
const tmpDir = os.tmpdir();

const getPhoto = () => {
  const parameters = {
    url: "https://api.nasa.gov/planetary/apod",
    qs: {
      api_key: process.env.NASA_API_KEY,
    },
    encoding: "binary",
  };
  request.get(parameters, (err, respone, body) => {
    body = JSON.parse(body);
    saveFile(body);
  });
};

const saveFile = (body) => {
  const fileName =
    body.media_type === "image/jpeg" || "image/jpg" ? "nasa.jpg" : "nasa.mp4";
  const filePath = path.join(tmpDir + `/${fileName}`);

  if (body.media_type === "video") {
    // tweet the link
    const params = {
      status: "NASA video: " + body.url,
    };
    postStatus(params);
    return;
  }
  const file = fs.createWriteStream(filePath);

  request(body)
    .pipe(file)
    .on("close", (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Media saved!");
        const descriptionText = body.title;
        uploadMedia(descriptionText, filePath);
      }
    });
};

const uploadMedia = (descriptionText, fileName) => {
  T.postMediaChunked(
    {
      file_path: fileName,
    },
    (err, data, respone) => {
      if (err) {
        console.log(err);
      } else {
        console.log(data);
        const params = {
          status: descriptionText,
          media_ids: data.media_id_string,
        };
        postStatus(params);
      }
    }
  );
};

const postStatus = (params) => {
  T.post("statuses/update", params, (err, data, respone) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Status posted!");
    }
  });
};

module.exports = getPhoto;
