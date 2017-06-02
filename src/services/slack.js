'use strict'

const SlackClient = require('@slack/client')

const config = require('../internals/config')

class SlackService {
    _createWebClient() {
        return new SlackClient.WebClient(config.Slack.APIToken)
    }

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
