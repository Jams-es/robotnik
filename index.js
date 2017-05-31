'use strict'

const fs = require('fs')
const Twitter = require('twitter')
const SlackClient = require('@slack/client')
const SlackWebClient = SlackClient.WebClient

var configRaw = fs.readFileSync('./config.json')
var config = JSON.parse(configRaw)

var client = new Twitter({
  consumer_key: config.Twitter.ConsumerKey,
  consumer_secret: config.Twitter.ConsumerSecret,
  access_token_key: config.Twitter.AccessToken,
  access_token_secret: config.Twitter.AccessTokenSecret
})

client.stream('statuses/filter', { follow: config.Twitter.UserIDs.Pixel_Dailies },  function(stream) {
    console.log('Created stream')
    stream.on('data', function(tweet) {
        console.log('Received tweet')
        var normalizedTwit = tweet.text.toLowerCase().trim()
        if (normalizedTwit.indexOf('today') === 0) {
            console.log('Twit is valid, publishing.')
            var web = new SlackWebClient(config.Slack.APIToken)
            web.chat.postMessage('art', 'Pixel_Dailies: ' + tweet.text, function(err, res) {
                if (err) {
                    console.log('Error:', err);
                } else {
                    console.log('Message sent: ', res);
                }
            })
        }
    })

    stream.on('error', function(error) {
        console.log(error)
    })
})
