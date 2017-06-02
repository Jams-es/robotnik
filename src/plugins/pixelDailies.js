'use strict'

const config = require('../internals/config')

function pixelDailiesPlugin(services) {

    services.twitter.listenUserActivity(config.Twitter.UserIDs.Pixel_Dailies, (data) => {
        var normalizedText = data.text.toLowerCase().trim()
        if (normalizedText.indexOf('today') === 0) {
            services.slack.sendMessage('art', 'Pixel_Dailies: ' + data.text)
        }
    })

}

module.exports = pixelDailiesPlugin
