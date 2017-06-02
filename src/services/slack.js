'use strict'

const SlackClient = require('@slack/client')

const config = require('../internals/config')

/**
 * Provides functionality to interact with the connected Slack.
 */
class SlackService {
    _createWebClient() {
        return new SlackClient.WebClient(config.Slack.APIToken)
    }

    /**
     * Sends a message to the specified channel
     * @param {string} channel - The channel name.
     * @param {string} message - The message to send.
     */
    sendMessage(channel, message) {
        return new Promise((resolve, reject) => {
            var web = this._createWebClient()
            web.chat.postMessage(channel, message, { as_user: true },(err, res) => {
                if (err) return reject(err)
                resolve()
            })
        })
    }
}

module.exports = () => new SlackService()
