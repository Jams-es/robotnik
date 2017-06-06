'use strict'

const express = require('express')
const session = require('express-session')
const bodyParser = require('body-parser')
const exphbs  = require('express-handlebars')
const path = require('path')
require('handlebars-helpers')()

const config = require('../internals/config')
const router = require('./router')

var viewsPath = `${__dirname}${path.sep}views${path.sep}`

module.exports = () => {
    var app = express()

    app.engine('.hbs', exphbs({
        defaultLayout: 'main',
        extname: '.hbs',
        layoutsDir: `${viewsPath}layouts`,
        partialsDir: `${viewsPath}partials`
    }))
    app.set('view engine', '.hbs')
    app.set('views', viewsPath)

    app.use(session({
        secret: config.Auth.Secret || 'secret',
        resave: true,
        saveUninitialized: true
    }))
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({ extended: true }))

    app.use('/static', express.static(`${__dirname}${path.sep}static`))

    app.get('/static/bulma.css', (req, res) => 
        res.sendFile(path.normalize(`${process.cwd()}/node_modules/bulma/css/bulma.css`)))

    router(app)

    app.listen(8989, '0.0.0.0')
}
