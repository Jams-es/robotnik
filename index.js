'use strict'

const http = require('http')
const moment = require('moment')

const logger = require('./src/internals/logger')
const runPlugin = require('./src/internals/runPlugin')
const pixelDailiesPlugin = require('./src/plugins/pixelDailies')

runPlugin(pixelDailiesPlugin)

const hostname = '0.0.0.0';
const port = 8989;

const server = http.createServer((req, res) => {
    res.statusCode = 200
    res.setHeader('Content-Type', 'text/plain')
    var state = logger.getState()
    var log = logger.getLogHistory().map((entry) => {
        return `[${moment(entry.date).format('YYYY-MM-DD HH:mm:ss')}] ${entry.message}`
    }).join('\n')
    res.end(`Restarts: ${state.restartCounter}\nLast ping: ${moment(state.lastPing).format('YYYY-MM-DD HH:mm:ss')}\n\nLog:\n` + log)
})

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`)
})
