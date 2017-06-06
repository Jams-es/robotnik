'use strict'

const express = require('express')
const plugins = require('../../internals/plugins')

const authMW = require('../middlewares/authMiddleware')

var router = express.Router()

router.get('/plugins', authMW.requireAuthentication, (req, res) => {
    res.render('plugins', { req, plugins: plugins.list() });
})

module.exports = router
