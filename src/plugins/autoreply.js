'use strict'

const fs = require('fs')

const config = require('../internals/config')

function validateMessage(message) {
    if (!message.text) return false;
    // Is in a public channel? ignore
    if (message.channel.indexOf('C') === 0) return false;
    // It's a message from a bot? ignore
    if (message.bot_id) return false;

    return true;
}

function slackRules(services, message) {
    fs.readFile('./assets/rules.md', 'utf8', function (err, data) {
        if (err) {
            return console.log(err);
        }
        services.slack.sendMessage(message.channel, data)
    });
}

function cantUnderstand(services, message) {
    services.slack.sendMessage(message.channel, 'Lo siento, no entiendo ese comando. Te dejo una lista de las cosas que puedes pedirme:');
    setTimeout(function() {
        help(services, message);
    }, 2000);
}

function help(services, message) {
    services.slack.sendMessage(message.channel, '`reglas slack` -> Las reglas de este slack');
}

const autoreplyPlugin = {
    id: 'jamses.autoreply',
    name: 'Autoreply',
    run(services) {
        services.slack.listenMessages((message) => {
            if (!validateMessage(message)) {
                return;
            }
            var parsedMessage = message.text.toLowerCase();
            switch(parsedMessage) {
                case "reglas slack":
                    slackRules(services, message);
                    break;
                default:
                    cantUnderstand(services, message);
                    break;
            }
        })
    }
}

module.exports = autoreplyPlugin
