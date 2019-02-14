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

function getUserData(username) {
    let b = Buffer.from(fs.readFileSync(`${__dirname}/../private/users.json`))
    let userData = {}
    for (let user in JSON.parse(b)) {
        if (username === JSON.parse(b)[user]['username']) {
            userData.username = username
            userData.firstName = JSON.parse(b)[user]['firstName']
            userData.lastName = JSON.parse(b)[user]['lastName']
            userData.id = JSON.parse(b)[user]['id']

            break
        }
    }

    b.fill(0)
    return userData
}

function findPasswordByUsername(username) {
    let b = Buffer.from(fs.readFileSync(`${__dirname}/../private/users.json`))

    for (let user in JSON.parse(b)) {
        let u = JSON.parse(b)[user]

        if (u.username === username) {
            b.fill(0)
            return u.password
        }
    }
}

function verifyPassword(username, password, req, res) {
    bcrypt.compare(password, findPasswordByUsername(username), (err, ver) => {
        if (err) {
            handleError(err)
        }
        let userData = getUserData(username)

        req.session.user = userData
        res.status(200).redirect('/admin')
    })
}

function handleError (err) {
    let date = Date(Date.now()).toString()
    let error = ''
    error += '<------------------------------>\r\n'
    error += date + '\r\n'
    error += err + '\r\n'

    fs.stat(`./logs/err.log`, (err, stats) => {
        if (err) {
            if (err) { handleError(err); return console.log('Error writing to error log') }
        }

        if (stats.size > 10000) {
            return fs.writeFile(`./server/logs/err.log`, error, (err) => {
                if (err) { handleError(err); return console.log('Error writing to error log') }
            })
        }

        fs.appendFile('./server/logs/err.log', error, (err) => {
            if (err) { handleError(err); return console.log('Error writing to error log') }
        })

    })
}

function initialize() {
    // list necessary files and directories
    let paths = [
        `${__dirname}/logs`,
        `${__dirname}/../views/templates`,
        `${__dirname}/../pages`
    ]

    let files = [
        `${__dirname}/logs/err.log`,
        `${__dirname}/../views/templates/templateIndex.json`,
        `${__dirname}/../pages/pageIndex.json`,
        `${__dirname}/../private/users.json`,
    ]

    // test both directories and files
    paths.forEach((dirPath) => {
        testDir(dirPath)
    })

    files.forEach((filePath) => {
        testFile(filePath)
    })
}

function testDir(path) {
    fs.access(path, (err) => {
        if (err) {
            return fs.mkdirSync(path)
        }

        return
    })
}

function testFile(path) {
    fs.access(path, (err) => {
        if (err) {
            return fs.writeFileSync(path)
        }

        return
    })
}

module.exports.initialize = initialize
module.exports.handleErrors = handleError
module.exports.verifyUser = verifyUser
module.exports.verifyPassword = verifyPassword