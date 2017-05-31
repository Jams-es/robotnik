'use strict'

const fs = require('fs')
const Twitter = require('twitter')
const SlackClient = require('@slack/client')
const http = require('http')
const SlackWebClient = SlackClient.WebClient

const hostname = '0.0.0.0';
const port = 8989;

var restartCounter = 0

var configRaw = fs.readFileSync('./config.json')
var config = JSON.parse(configRaw)

var client = new Twitter({
    consumer_key: config.Twitter.ConsumerKey,
    consumer_secret: config.Twitter.ConsumerSecret,
    access_token_key: config.Twitter.AccessToken,
    access_token_secret: config.Twitter.AccessTokenSecret
})

function listenStream() {
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
            restartCounter++
            listenStream()
        })
    })
}

listenStream()

const server = http.createServer((req, res) => {
    res.statusCode = 200
    res.setHeader('Content-Type', 'text/plain')
    res.end(`Restarts: ${restartCounter}\n`)
})

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`)
})
