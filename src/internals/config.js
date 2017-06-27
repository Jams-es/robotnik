'use strict'

const fs = require('fs')
var configRaw = fs.readFileSync(process.env.ROBOTNIK_CONFIG || './config.json')
var config = JSON.parse(configRaw)
module.exports = config
