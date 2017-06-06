'use strict'

const express = require('express')
const randomstring = require('randomstring')

const config = require('../../internals/config')
const SlackService = require('../../services/slack')
const slack = SlackService()

var router = express.Router()

const authTokens = {}

const namespace = 'auth'

router.get(`/${namespace}/login`, (req, res) => {
    res.render('auth/login', { req })
})

router.post(`/${namespace}/login`, (req, res) => {
    var username = req.body.username
    if (config.Auth.AllowedUsers.indexOf(username) >= 0) {
        authTokens[username] = randomstring.generate()
        slack.sendMessage('@' + username, `Your auth token is \`${authTokens[username]}\``)
        res.render('auth/confirmToken', { username: username })
    } else {
        res.render('error', { message: `The username ${username} isn't authorized to login here.` })
    }
    
})

router.post(`/${namespace}/confirm_token`, (req, res) => {
    var username = req.body.username
    if (config.Auth.AllowedUsers.indexOf(username) >= 0) {
        if (authTokens[req.body.username] === req.body.token) {
            req.session.authenticated = true
            res.redirect('/')
        } else {
            res.send('Wrong token')
        }
    } else {
        res.send('Nope')
    }
})

module.exports = router
