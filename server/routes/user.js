const fs = require('fs')
const express = require(`express`)
const bcrypt = require(`bcryptjs`)
const uuidv4 = require('uuid/v4')

let router = express.Router()

router.post('/', (req, res) => {
    let newUser = req.body

    fs.readFile(`${__dirname}/../../private/users.json`, (err, data) => {
        if (err) {
            // handle error
        }

        let users = JSON.parse(data)

        for (let user in users) {
            let u = users[user]
            if (u.username === req.body.username || u.email === req.body.email) {
                return res.send('User with these credentials exists')
            }
        }

        newUser.id = uuidv4()
        newUser.password = bcrypt.hashSync(newUser.password, 10)

        users[newUser.id] = newUser

        fs.writeFile(`${__dirname}/../../private/users.json`, JSON.stringify(users, undefined, 2), 'utf8', (err) => {
            if (err) {
                // handle error
            }

            res.status(200).send(users)
        })
    })
})

router.get('/', (req, res) => {
    if (!req.session.user_id) {
        return res.status(403).send('You must be logged in to access this.')
    }

    res.status(200).send('Logged in.')
})

module.exports = router