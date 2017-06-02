'use strict'

function runPlugin(plugin) {
    plugin({
        twitter: require('../services/twitter')(),
        slack: require('../services/slack')()
    })
}

module.exports = runPlugin
