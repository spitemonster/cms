const uuidv4 = require('uuid/v4')
const express = require(`express`)
const fs = require(`fs`)
const rimraf = require('rimraf')
const methods = require('../methods.js')

const Ajv = require('ajv')
let ajv = new Ajv()

let router = express.Router()

router.get('/', (req, res) => {
    res.status(200).send('List of all posts')
})

router.get('/:post_id', (req, res) => {
    res.status(200).send('Get a specific post')
})

router.post('/', (req, res) => {
    res.status(200).send('Create a new post')
})

router.patch('/:post_id', (req, res) => {
    res.status(200).send('Update a post')
})

router.delete('/:post_id', (req, res) => {
    res.status(200).send('Delete a post')
})

module.exports = router