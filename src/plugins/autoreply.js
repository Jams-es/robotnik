'use strict'

const fs = require('fs')

const config = require('../internals/config')

const autoreplyPlugin = {
    id: 'jamses.autoreply',
    name: 'Autoreply',
    run(services) {
        services.slack.listenMessages((message) => {
            // Empty message? ignore
            if (!message.text) return
            // Is in a public channel? ignore
            if (message.channel.indexOf('C') === 0) return
            // It's a message from a bot? ignore
            if (message.bot_id) return

            if (message.text.toLowerCase() === "reglas slack") {
                fs.readFile('./assets/rules.md', 'utf8', function (err, data) {
                    if (err) {
                        return console.log(err);
                    }
                    services.slack.sendMessage(message.channel, data)
                });
            }
        })
    }
}

module.exports = autoreplyPlugin
