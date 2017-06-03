'use strict'

const express = require('express')
const session = require('express-session')
const bodyParser = require('body-parser')
const randomstring = require('randomstring')
const moment = require('moment')

const logger = require('../internals/logger')
const config = require('../internals/config')
const SlackService = require('../services/slack')
const slack = SlackService()

const checkAuth = (req, res, next) => {
    if (!req.session.authenticated) {
        res.redirect('/login')
    } else {
        next()
    }
}

const authTokens = {}

module.exports = () => {
    var app = express()
    app.use(session({ secret: config.Auth.Secret || 'secret', resave: true, saveUninitialized: true }))
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({
        extended: true
    }))

    app.get('/', checkAuth, (req, res) => {
        var state = logger.getState()
        var log = logger.getLogHistory().map((entry) => {
            return `[${moment(entry.date).format('YYYY-MM-DD HH:mm:ss')}] ${entry.message}`
        }).join('\n')
        res.send(`Restarts: ${state.restartCounter}<br>Last ping: ${moment(state.lastPing).format('YYYY-MM-DD HH:mm:ss')}<br><br>Log:<br>` + log)
    })

    app.get('/login', (req, res) => {
        res.send(`
            <form method="post">
                <p>What's your username?</p>
                <label>@</label><input type="text" name="username" />
            </form>
        `)
    })

    app.post('/login', (req, res) => {
        var username = req.body.username
        if (config.Auth.AllowedUsers.indexOf(username) >= 0) {
            authTokens[username] = randomstring.generate()
            slack.sendMessage('@' + username, `Your auth token is \`${authTokens[username]}\``)
            res.send(`
                <form method="post" action="/confirm_token">
                    <p>You'll receive a token from robotnik, paste it here:</p>
                    <input type="hidden" name="username" value="${username}" />
                    <input type="text" name="token" />
                </form>
            `)
        } else {
            res.send('Not authorized')
        }
        
    })

    app.post('/confirm_token', (req, res) => {
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

    app.listen(8989, '0.0.0.0')
}
