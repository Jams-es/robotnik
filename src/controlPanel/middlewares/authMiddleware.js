'use strict'

function requireAuthentication (req, res, next) {
    if (!req.session.authenticated) {
        res.redirect('/auth/login')
    } else {
        next()
    }
}

module.exports = { requireAuthentication }
