const express = require('express')
const session = require('express-session')

let router = express.Router()

router.get('/', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            // handle error
            console.log(err)
        }

        res.redirect('/login')
    })
})

router.post('/', (req, res) => {

})

module.exports = router