'use strict'

const controlPanel = require('./src/controlPanel/index')
const runPlugin = require('./src/internals/runPlugin')
const pixelDailiesPlugin = require('./src/plugins/pixelDailies')

runPlugin(pixelDailiesPlugin)

controlPanel()
