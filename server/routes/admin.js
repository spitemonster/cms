
const express = require(`express`)

let router = express.Router()

router.get(`/`, (req, res) => {
    res.render(`panel.hbs`)
})

router.get(`/*`, (req, res) => {
    res.redirect(`/admin`)
})

module.exports = router