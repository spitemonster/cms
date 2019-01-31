const fs = require('fs')
const express = require(`express`)
const bcrypt = require(`bcryptjs`)
const methods = require('../methods.js')

let router = express.Router()

router.get('/', (req, res) => {
    if (req.session.user_id) {
        return res.redirect('/admin')
    }

    res.render('login.hbs')
})

router.post('/', (req, res) => {

    if (!methods.verifyPassword(req.body.username, req.body.password)) {
        return res.status(401).send('Username or password was incorrect. Please try again.')
    }

    res.status(200).redirect('/admin')
})

module.exports = router