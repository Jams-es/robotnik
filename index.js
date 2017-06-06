'use strict'

const controlPanel = require('./src/controlPanel/index')
const plugins = require('./src/internals/plugins')
const pixelDailiesPlugin = require('./src/plugins/pixelDailies')

plugins.load()
plugins.runAll()

controlPanel()
