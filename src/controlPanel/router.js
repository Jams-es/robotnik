'use strict'

const authController = require('./controllers/authController')
const homeController = require('./controllers/homeController')
const pluginsController = require('./controllers/pluginsController')

module.exports = (app) =>  {
    app.use(authController)
    app.use(homeController)
    app.use(pluginsController)
}
