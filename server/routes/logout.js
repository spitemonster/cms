const express = require('express')
const methods = require('../methods.js')

let router = express.Router()

router.get('/', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            methods.handleError(err)
        }

        res.redirect('/login')
    })
})

router.post('/', (req, res) => {

})

module.exports = router