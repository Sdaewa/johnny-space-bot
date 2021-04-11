require('dotenv').config()

module.exports = {
    oauth_consumer_key: process.env.TWITTER_CONSUMER_KEY,
    oauth_consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    oauth_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
    oauth_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
}