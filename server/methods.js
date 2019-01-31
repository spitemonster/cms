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

function findUserByUsername(username) {
    let b = Buffer.from(fs.readFileSync(`${__dirname}/../private/users.json`))
}

// something similar with this. i'm uncertain about loading the entire user into the user variable but
// i also don't know enough about it at this point to say whether it makes a difference
// still emptying the buffer of data regardless
function verifyPassword(username, password) {
    let b = Buffer.from(fs.readFileSync(`${__dirname}/../private/users.json`))


    for (let user in JSON.parse(b)) {
        let u = JSON.parse(b)[user]
        if (u.username === username) {
            bcrypt.compare(password, u.password, (err, ver) => {

                if (err) {
                    console.log(err)
                    b.fill(0)
                    return false
                }

                console.log(ver)
                b.fill(0)
                return true
            })
        }
    }
}

function handleErrors (err) {
    console.log('There was an error')
}

module.exports.handleErrors = handleErrors
module.exports.verifyUser = verifyUser
module.exports.verifyPassword = verifyPassword