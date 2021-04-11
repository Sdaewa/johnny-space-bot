const Twitter = require('twitter');
const config = require('./config.js');
const Twtr = new Twitter(config);

//set search params
let params = {
    q: '#spaceX',
    count: 10,
    result_type: 'recent',
    lang: 'en'
}

Twtr.get('search/tweets', params, function (err, data, response) {
    if (!err) {
        // Loop through tweets
        for (let i = 0; i < data.statuses.length; i++) {
            // Get tweet ID
            let id = {
                id: data.statuses[i].id_str
            }
            // favorite the tweet
            T.post('favorites/create', id, function (err, response) {
                if (err) {
                    console.log(err[0].message);
                } else {
                    let username = response.user.screen_name;
                    let tweetId = response.id_str;
                    console.log('Favorited: ', `https://twitter.com/${username}/status/${tweetId}`)
                }
            });
        }
    } else {
        console.log(err);
    }
});