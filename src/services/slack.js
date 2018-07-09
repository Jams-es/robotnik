'use strict'

const SlackClient = require('@slack/client')
const CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS;

const config = require('../internals/config')

/**
 * Provides functionality to interact with the connected Slack.
 * @constructor
 */
function SlackService (ctx) {
    const _createWebClient = () => new SlackClient.WebClient(config.Slack.APIToken)
    const _createRtmClient = () => new SlackClient.RTMClient(config.Slack.APIToken)

    const _log = (msg) => {
        if (ctx) {
            ctx.logger.log(msg)
        }
    }

    /**
     * Get the user's ID given the Username
     * @param {string} username - The username
     * @returns {Promise}
     * @inner
     */
    function _getUserIdByUsername(_username) {
        var username = _username.replace('@', '')
        return new Promise((resolve, reject) => {
            var web = _createWebClient()
            web.users.list({}, (err, res) => {
                if (err || !res.ok) return reject(err || new Error('Couldnt get user list'))
                var found = null
                res.members.forEach((user) => {
                    if (user.name === username) {
                        found = user
                    }
                })
                if (found) {
                    resolve(found.id)
                } else {
                    reject(new Error('Couldnt find username'))
                }
            })
        })
    }

    /**
     * Get the direct message channel of the specified user
     * @param {string} userId - The user ID
     * @returns {Promise}
     * @inner
     */
    function _getUserDirectMessageChannel(userId) {
        return new Promise((resolve, reject) => {
            var web = _createWebClient()
            web.im.list({}, (err, res) => {
                if (err || !res.ok) return reject(err || new Error('Couldnt get im list'))
                var found = null
                res.ims.forEach((channel) => {
                    if (channel.user === userId) {
                        found = channel
                    }
                })
                if (found) {
                    resolve(found.id)
                } else {
                    reject(new Error('Couldnt im channel'))
                }
            })
        })
    }

    /**
     * Sends a message to the specified channel
     * @param {string} channel - The channel (public, private or direct message channel).
     * @param {string} message - The message to send.
     * @returns {Promise}
     * @inner
     */
    function _sendMessageToChannel(channel, message) {
        return new Promise((resolve, reject) => {
            var web = _createWebClient()
            web.chat.postMessage({ channel, text: message, as_user: true }, (err, res) => {
                if (err) return reject(err)
                resolve()
            })
        })
    }

    /**
     * Sends a message to the specified username
     * @param {string} username - The username (can start with @ or not).
     * @param {string} message - The message to send.
     * @return {Promise}
     * @inner
     */
    function _sendMessageToUser(username, message) {
        return _getUserIdByUsername(username)
            .then(_getUserDirectMessageChannel)
            .then((userId) => _sendMessageToChannel(userId, message))
    }

    /**
     * Sends a message to the specified channel
     * @param {string} channel - The channel name OR user (starting with @).
     * @param {string} message - The message to send.
     * @return {Promise}
     * @memberof SlackService
     */
    function sendMessage(channel, message) {
        _log(`Sending message to channel \`${channel}\``)
        return channel.indexOf('@') === 0
            ? _sendMessageToUser(channel, message)
            : _sendMessageToChannel(channel, message)
    }

    function listenMessages(callback) {
        _log('Listening messages from Slack')
        var rtm = _createRtmClient()
        rtm.on('message', (data) => {
            callback(data)
        })
        rtm.start()
    }

    return { sendMessage, listenMessages }
}

module.exports = SlackService
