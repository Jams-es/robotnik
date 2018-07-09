'use strict'

const express = require('express')
const randomstring = require('randomstring')

const config = require('../../internals/config')
const SlackService = require('../../services/slack')
const slack = SlackService()

var router = express.Router()

const authTokens = {}

const namespace = 'auth'

function userIsAllowed(username) {
    return config.Auth.AllowedUsers.indexOf(username) >= 0;
}

function generateTokenForUser(username) {
    authTokens[username] = randomstring.generate()
    return authTokens[username];
}

function validateToken(username, token) {
    return authTokens[username] === token
}

router.get(`/${namespace}/login`, (req, res) => {
    res.render('auth/login', { req })
})

router.post(`/${namespace}/login`, (req, res) => {
    var username = req.body.username
    if (userIsAllowed(username)) {
        var authToken = generateTokenForUser(username);
        slack.sendMessage(`@${username}`, `Your auth token is \`${authToken}\``)
            .then(() => {
                res.render('auth/confirmToken', { username: username })
            }, (err) => {
                res.render('error', { message: `Unexpected error: ${err}` })
            });
    } else {
        res.render('error', { message: `The username ${username} isn't authorized to login here.` })
    }
})

router.post(`/${namespace}/confirm_token`, (req, res) => {
    var username = req.body.username
    if (userIsAllowed(username)) {
        if (validateToken(username, req.body.token)) {
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
