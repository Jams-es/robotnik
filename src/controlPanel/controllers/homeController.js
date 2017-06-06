'use strict'

const express = require('express')
const moment = require('moment')
const logger = require('../../internals/logger')()
const plugins = require('../../internals/plugins')

const authMW = require('../middlewares/authMiddleware')

var router = express.Router()

router.get('/', authMW.requireAuthentication, (req, res) => {
    var state = logger.getState()

    var log = logger.getLogHistory().map((entry) => {
        return {
            date: moment(entry.date).format('YYYY-MM-DD HH:mm:ss'),
            message: entry.message,
            context: entry.context
        }
    })

    var restartCounter = state.restartCounter
    var lastPing = moment(state.lastPing).format('YYYY-MM-DD HH:mm:ss')

    res.render('home', { req, log, restartCounter, lastPing, plugins: plugins.list() });
})

module.exports = router
