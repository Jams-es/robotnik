'use strict'

const fs = require('fs')

const config = require('../internals/config')

function validateMessage(message) {
    if (!message.text) return false;
    // Is in a public channel? ignore
    if (message.channel.indexOf('C') === 0) return false;
    // It's a message from a bot? ignore
    if (message.bot_id) return false;
    if (message.subtype === 'bot_message') return false;

    return true;
}

function readFile(path) {
    return new Promise((resolve, reject) => {
        fs.readFile(path, 'utf8', function (err, data) {
            if (err) {
                reject(err);
            }
            resolve(data);
        });
    });
}

const getSlackRules = () => readFile('./assets/rules.md')
const getHelp = () => readFile('./assets/help.md')

function slackRules(services, message) {
    getSlackRules()
        .then((data) => {
            services.slack.sendMessage(message.channel, data)
        }, console.log)
}

function cantUnderstand(services, message) {
    getHelp()
        .then((data) => {
            var text = `Lo siento, no entiendo ese comando. Te dejo una lista de las cosas que puedes pedirme:\n\n${data}`
            services.slack.sendMessage(message.channel, text);
        }, console.log);
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
