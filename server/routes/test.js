const methods = require('../methods.js')

const express = require(`express`)
const Ajv = require('ajv')
const fs = require('fs')
let ajv = new Ajv()

const pageSchema = require('../schema/page.schema.json')

let router = express.Router()

router.get('/', (req, res) => {
    res.status(200).send('All good')
})

router.post('/user', (req, res) => {
    let schema = JSON.parse(fs.readFileSync(`${__dirname}/../schema/user.schema.json`))
    let valid = ajv.validate(schema, req.body)

    if (!valid) {
        return res.status(422).send('Invalid format')
    }

    res.status(200).send('All good')
})

router.post('/page', (req, res) => {
    let schema = JSON.parse(fs.readFileSync(`${__dirname}/../schema/page.schema.json`))
    let valid = ajv.validate(schema, req.body)

    if (!valid) {
        console.log(ajv.errors)
        return res.status(400).send('Invalid format')
    }

    res.status(200).send('All good')
})

router.post('/template', (req, res) => {
    let schema = JSON.parse(fs.readFileSync(`${__dirname}/../schema/template.schema.json`))
    let valid = ajv.validate(schema, req.body)

    if (!valid) {
        console.log(ajv.errors)
        return res.status(422).send('Invalid format')
    }

    res.status(200).send('All good')
})

router.post('/methods', (req, res) => {
    // console.log(req.body.user_id)
    console.log(methods.verifyUser(req.body.user_id))
    res.status(200).send('All good')
})

module.exports = router