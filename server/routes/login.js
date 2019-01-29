const fs = require('fs')
const express = require(`express`)
const bcrypt = require(`bcryptjs`)

let router = express.Router()

router.get('/', (req, res) => {
    res.render('login.hbs')
})

router.post('/', (req, res) => {
    let login = req.body

    fs.readFile(`${__dirname}/../../private/users.json`, (err, data) => {
        if (err) {
            // handle err
        }

        let users = JSON.parse(data)

        for (let user in users) {
            let u = users[user]

            if (u.username === login.username) {
                bcrypt.compare(login.password, u.password, (err, ver) => {

                    if (err) {
                        // handle error
                    }

                    req.session.user_id = u.id
                    res.status(200).redirect('/admin')
                })
            }
        }
    })
})

module.exports = router