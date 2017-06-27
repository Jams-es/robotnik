'use strict'

const config = require('../internals/config')

const autoreplyPlugin = {
    id: 'jamses.autoreply',
    name: 'Autoreply',
    run(services) {
        services.twitter.listenUserActivity(config.Twitter.UserIDs.Pixel_Dailies, (data) => {
            var normalizedText = data.text.toLowerCase().trim()
            if (normalizedText.indexOf('today') === 0) {
                services.slack.sendMessage('art', 'Pixel_Dailies: ' + data.text)
            }
        })
    }
}

module.exports = autoreplyPlugin
