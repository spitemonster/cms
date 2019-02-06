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
    methods.verifyPassword(req.body.username, req.body.password, req, res)
})

module.exports = router