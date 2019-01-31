const express = require(`express`)
const session = require('express-session')

let router = express.Router()

var sessionChecker = (req, res, next) => {
    if (req.session.user_id) {
        next()
    } else {
        res.redirect('/login')
    }
}

// router.get(`/`, (req, res) => {
//     res.render(`panel.hbs`)
// })

// below is the route with authentication. this is frustrating in dev so leaving it here but commenting it out
router.get(`/`, sessionChecker, (req, res) => {
    res.render(`panel.hbs`)
})

router.get(`/*`, (req, res) => {
    res.redirect(`/admin`)
})

module.exports = router