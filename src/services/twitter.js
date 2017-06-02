'use strict'

const Twitter = require('twitter')
const logger = require('../internals/logger')

const config = require('../internals/config')

class TwitterService {
    constructor() {
        logger.setState({
            restartCounter: 0,
            lastPing: null
        })
    }

    _createClient() {
        return new Twitter({
            consumer_key: config.Twitter.ConsumerKey,
            consumer_secret: config.Twitter.ConsumerSecret,
            access_token_key: config.Twitter.AccessToken,
            access_token_secret: config.Twitter.AccessTokenSecret
        })
    }

    listenUserActivity(userId, callback) {

        const retry = () => {
            logger.log('Restarting in 60s')
            setTimeout(() => {
                logger.setState({
                    restartCounter: logger.getState().restartCounter + 1
                })
                this.listenUserActivity(userId, callback)
            }, 60000)
        }

        var client = this._createClient()
        logger.log('Listening ' + userId)
        client.stream('statuses/filter', { follow: userId }, (stream) => {

            stream.on('data', (data) => {
                callback(data)
            })

            stream.on('error', (error) => {
                logger.log(error.source ? error.source : error)
            })

            stream.on('end', () => {
                logger.log('Finished ' + userId)
                retry()
            })

            stream.on('ping', () => {
                logger.setState({ lastPing: new Date() })
            })
        })
    }
}

module.exports = () => new TwitterService()
