'use strict'

const _ = require('lodash')

var logHistory = []
var state = {}

module.exports = (contextId) => {
    function log(message) {
        logHistory.push({
            message: message instanceof Error ? message.stack : message,
            date: new Date(),
            context: contextId
        })
        console.log(`[${contextId}] ${message}`)
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

    return { log, setState, getState, getLogHistory }
}
