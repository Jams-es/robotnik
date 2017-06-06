'use strict'

const Twitter = require('twitter')

/**
 * Provides functionality to interact with Twitter
 */
function TwitterService(ctx) {
    
    ctx.logger.setState({
        restartCounter: 0,
        lastPing: null
    })

    const _createClient = () => new Twitter({
        consumer_key: ctx.config.Twitter.ConsumerKey,
        consumer_secret: ctx.config.Twitter.ConsumerSecret,
        access_token_key: ctx.config.Twitter.AccessToken,
        access_token_secret: ctx.config.Twitter.AccessTokenSecret
    })

    /**
     * Starts to listen all the user's activity, which includes twits, retweets, direct messages, etc.
     * Check the Twitter Streaming API for more info (section statuses/filter)
     * @param {string} userId - The userId to follow (not the username, the userId isn't the same thing).
     * @param {function} callback  - This callback will be called with each new data received.
     */
    function listenUserActivity(userId, callback) {

        const retry = () => {
            ctx.logger.log('Restarting in 60s')
            setTimeout(() => {
                ctx.logger.setState({
                    restartCounter: ctx.logger.getState().restartCounter + 1
                })
                listenUserActivity(userId, callback)
            }, 60000)
        }

        var client = _createClient()
        ctx.logger.log('Listening ' + userId)

        client.stream('statuses/filter', { follow: userId }, (stream) => {

            stream.on('data', (data) => {
                callback(data)
            })

            stream.on('error', (error) => {
                ctx.logger.log(error.source ? error.source : error)
            })

            stream.on('end', () => {
                ctx.logger.log('Finished ' + userId)
                retry()
            })

            stream.on('ping', () => {
                ctx.logger.setState({ lastPing: new Date() })
            })
        })
    }

    return { listenUserActivity }
}

module.exports = TwitterService
