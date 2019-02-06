'use strict'
const fs = require('fs')
const bcrypt = require(`bcryptjs`)
// make sure user id is valid and refers to an acual user
// to the best of my knowledge, this the safest way to read the users file and check if a user exists
// b.fill empties the buffer of data so, ideally, no sensitive information is stored in memory this way
function verifyUser(userId) {
    let b = Buffer.from(fs.readFileSync(`${__dirname}/../private/users.json`))

    if (!JSON.parse(b)[userId]) {
        b.fill(0)
        return false
    }

    b.fill(0)
    return true
}

function findUserIdByUsername(username) {
    let b = Buffer.from(fs.readFileSync(`${__dirname}/../private/users.json`))

    for (let user in JSON.parse(b)) {
        if (username === JSON.parse(b)[user]['username']) {
            return JSON.parse(b)[user]['id']
        }
    }
}

function findPasswordByUsername(username) {
    let b = Buffer.from(fs.readFileSync(`${__dirname}/../private/users.json`))

    for (let user in JSON.parse(b)) {
        let u = JSON.parse(b)[user]

        if (u.username === username) {
            return u.password
        }
    }
}

// something similar with this. i'm uncertain about loading the entire user into the user variable but
// i also don't know enough about it at this point to say whether it makes a difference
// still emptying the buffer of data regardless
function verifyPassword(username, password, req, res) {
    bcrypt.compare(password, findPasswordByUsername(username), (err, ver) => {
        if (err) {
            console.log('wrong')
            console.log(err)
        }
        req.session.user_id = findUserIdByUsername(username)
        req.session.username = username
        res.status(200).redirect('/admin')
    })
}

function handleErrors (err) {
    console.log('There was an error')
}

module.exports.handleErrors = handleErrors
module.exports.verifyUser = verifyUser
module.exports.verifyPassword = verifyPassword