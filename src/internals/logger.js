'use strict'

const _ = require('lodash')

var logHistory = []
var state = {}

function log(message) {
    if (message instanceof Error) {
        logHistory.push({ message: message.stack, date: new Date() });
    } else {
        logHistory.push({ message, date: new Date() });
    }
    console.log(message)
    
}

function setState(newState) {
    state = _.assign(state, newState)
}

function getState() {
    return state
}

function getLogHistory() {
    return logHistory
}

module.exports = { log, setState, getState, getLogHistory }
