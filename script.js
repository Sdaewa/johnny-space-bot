const Twitter = require('twitter');
const config = require('./config.js');
const Twtr = new Twitter(config);


let params = {
    q: '#spaceX',
    count: 10,
    result_type: 'recent',
    lang: 'en'
}