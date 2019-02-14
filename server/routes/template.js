const uuidv4 = require('uuid/v4')
const express = require(`express`)
const fs = require(`fs`)
const rimraf = require('rimraf')

const Ajv = require('ajv')
const templateSchema = require('../schema/template.schema.json')
let ajv = new Ajv()

let router = express.Router()

router.get('/', (req, res) => {
    fs.access(`${__dirname}/../../views/templates/templateIndex.json`, (err) => {
        let templateIndex = {}
        let q = req.query
        let ql = Object.keys(q).length
        let qs = Object.keys(q)

        if (err) {
            let z = {}
            fs.writeFileSync(`${__dirname}/../../views/templates/templateIndex.json`, JSON.stringify(z, undefined, 2), 'utf8')
        }

        templateIndex = JSON.parse(fs.readFileSync(`${__dirname}/../../views/templates/templateIndex.json`))

        if (ql === 0) {
            return res.status(200).json(templateIndex)
        } else if (ql === 1) {
            for (let template in templateIndex) {
                if (templateIndex[template][qs].toUpperCase() == q[qs].toUpperCase()) {
                    let td = templateIndex[template]

                    let templateData = JSON.parse(fs.readFileSync(td.dataUrl))

                    res.status(200).json(templateData)
                }
            }
        } else if (ql > 1) {
            // i initially wanted to allow queries for more than one field but I don't really think it's necessary. this route is going to be mostly for getting page data for the front end or admin editor
            res.status(400).send('Too many query fields. Please search just by name or id.')
        }
    })
})

router.get('/:templateId', (req, res) => {
    fs.readFile(`${__dirname}/../../views/templates/templateIndex.json`, (err, data) => {
        if (err) {
            return res.status(400).send('No templates.')
        }

        let templates = JSON.parse(data)
        let targetTemplate = templates[req.params.templateId].dataUrl

        fs.readFile(`${targetTemplate}`, (err, data) => {
            if (err) {
                return res.status(404).send('Template not found')
            }

            let template = JSON.parse(data)

            res.status(200).json(template)
        })
    })
})

router.post('/', (req, res) => {
    // get template data from submit, create folder for template files, update template index file, write template json and hbs template view file
    let templateData = req.body
    let templateFileName = req.body.name.replace(/[^A-Z0-9]/ig, '_').toLowerCase()

    fs.mkdirSync(`${__dirname}/../../views/templates/${templateFileName}`)

    templateData.fileName = templateFileName
    templateData.templateUrl = `${__dirname}/../../views/templates/${templateFileName}/${templateFileName}.hbs`
    templateData.dataUrl = `${__dirname}/../../views/templates/${templateFileName}/${templateFileName}.json`
    templateData.loc = `/${templateFileName}`
    templateData.createdAt = Date.now()
    templateData.updatedAt = templateData.createdAt
    templateData.revisions = []
    templateData.pages = []

    let valid = ajv.validate(templateSchema, templateData)

    if (!valid) {
        console.log(ajv.errors)
        return res.status(422).send('There was an error formatting your data. Please try again.')
    }

    fs.readFile(`${__dirname}/../../views/templates/templateIndex.json`, (err, data) => {
        if (err) {
            // handle error
        }

        let templateIndex = JSON.parse(data)

        console.log(templateIndex)

        let templateIndexData = {
            name: templateData.name,
            id: templateData.id,
            templateUrl: templateData.templateUrl,
            templateFileName: `${templateFileName}.hbs`,
            dataUrl: templateData.dataUrl,
            dataFileName: `${templateFileName}.json`,
            loc: templateData.loc,
            createdAt: templateData.createdAt,
            updatedAt: templateData.updatedAt,
            revisions: templateData.revisions,
            pages: []
        }

        templateIndex[templateData.id] = templateIndexData

        fs.writeFileSync(`${__dirname}/../../views/templates/templateIndex.json`, JSON.stringify(templateIndex, undefined, 2), 'utf8')
        fs.writeFileSync(`${__dirname}/../../views/templates/${templateFileName}/${templateFileName}.json`, JSON.stringify(templateData, undefined, 2), 'utf8')
        fs.writeFileSync(`${__dirname}/../../views/templates/${templateFileName}/${templateFileName}.hbs`, '', 'utf8')

        res.status(200).send('a ok')
    })
})

router.patch('/:templateId', (req, res) => {
    let tid = req.params.templateId

    fs.readFile(`${__dirname}/../../views/templates/templateIndex.json`, (err, data) => {
        if (err) {
            return res.status(400).send('No templates')
        }

        let templateIndex = JSON.parse(data)

        fs.readFile(`${templateIndex[tid].dataUrl}`, (err, data) => {
            if (err) {
                return res.status(404).send('Template not found')
            }

            let templateData = JSON.parse(data)

            return res.status(200).json(templateData)
        })
    })
})

router.delete('/:templateId', (req, res) => {
    let templateId = req.params.templateId
    let templateIndex = JSON.parse(fs.readFileSync(`${__dirname}/../../views/templates/templateIndex.json`))
    let piu = templateIndex[templateId].pages.length
    let sent

    if ( piu > 0) {
        if (piu === 1) {
            sent = `There is currently ${piu} page`
        } else {
            sent = `There are currently ${piu} pages`
        }

        res.status(401).send(`${sent} using this template. Please delete or archive those pages first.`)
    } else {
        rimraf(`${__dirname}/../../views/templates/${templateIndex[templateId].filename}`, () => {
            delete templateIndex[templateId]

            fs.writeFileSync(`${__dirname}/../../views/templates/templateIndex.json`, JSON.stringify(templateIndex, undefined, 2), 'utf8')

            res.status(200).send('Deleted')
        })
    }
})

module.exports = router