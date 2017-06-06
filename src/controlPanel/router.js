'use strict'

const authController = require('./controllers/authController')
const homeController = require('./controllers/homeController')

module.exports = (app) =>  {
    app.use(authController)
    app.use(homeController)
}
