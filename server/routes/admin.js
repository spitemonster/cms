const express = require(`express`)
const session = require('express-session')
const methods = require('../methods.js')

let router = express.Router()

var sessionChecker = (req, res, next) => {
    // if there is no session data, or if the user id is undefined on the session data, redirect the user to log in
    if (typeof req.session.user === 'undefined' || !req.session.user.id) {
        return res.redirect('/login')
    }

    next()
}

// below is the route with authentication. this is frustrating in dev so leaving it here but commenting it out
router.get(`/`, sessionChecker, (req, res) => {
    res.render(`panel.hbs`)
})

router.get(`/*`, (req, res) => {
    res.redirect(`/admin`)
})

module.exports = router