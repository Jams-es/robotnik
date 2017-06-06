'use strict'

const config = require('../internals/config')

const pixelDailiesPlugin = {
    id: 'jamses.pixel-dailies',
    name: 'Pixel_Dailies',
    run(services) {
        services.twitter.listenUserActivity(config.Twitter.UserIDs.Pixel_Dailies, (data) => {
            var normalizedText = data.text.toLowerCase().trim()
            if (normalizedText.indexOf('today') === 0) {
                services.slack.sendMessage('art', 'Pixel_Dailies: ' + data.text)
            }
        })
    }
}

module.exports = pixelDailiesPlugin
