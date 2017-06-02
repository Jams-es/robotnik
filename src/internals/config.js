'use strict'

const fs = require('fs')
var configRaw = fs.readFileSync('./config.json')
var config = JSON.parse(configRaw)
module.exports = config
