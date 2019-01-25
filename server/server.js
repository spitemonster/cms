// import methods from './methods.js'

const express = require(`express`)
const fs = require(`fs`)
const MarkDownIt = require(`markdown-it`)
const hbs = require('hbs')
const bodyParser = require('body-parser')
const urlencodedParser = bodyParser.urlencoded({extended: false})
const path = require('path')

let server = express()
let md = new MarkDownIt()
let PORT = process.env.PORT ? process.env.PORT : 8888

let page = require('./routes/page.js')

hbs.registerPartials(`./views/partials/`)
server.set('view engine', 'hbs')

server.use('/public', express.static('public'))
server.use(bodyParser.json())
server.use(express.urlencoded({ extended: false }))

server.use('/page', page)

//

server.get(`/`, (req, res) => {
    let menu = JSON.parse(fs.readFileSync(`./views/menu.json`))

    let file = fs.readFile(`./pages/home/home.md`, `utf8`, (err, data) => {
        if (err) {
            res.send(`There was an error.`)
        }

        let markdown = md.render(data)
        res.render(`home.hbs`, {
            content: markdown,
            menu: menu
        })
    })
})

server.get(`/admin`, (req, res) => {
    res.render(`panel.hbs`)
})

server.get('/templates/', (req, res) => {
    let templates = fs.readFileSync(`${__dirname}/../views/templates/templateIndex.json`)

    res.send(templates)
})

server.get('/templates/:templateId', (req, res) => {
    let templateId = req.params.templateId
    let targetTemplate = JSON.parse(fs.readFileSync(`${__dirname}/../views/templates/templateIndex.json`)).templates[templateId]
    let templateData = JSON.parse(fs.readFileSync(`${__dirname}/../views/templates/${targetTemplate.loc}/${targetTemplate.dataFileName}`))

    res.send(templateData)
})

server.post(`/create/template`, (req, res) => {
    // get template data from submit, create folder for template files, update template index file, write template json and hbs template view file

    let templateData = req.body

    let templateFileName = req.body.name.replace(/[^A-Z0-9]/ig, '_').toLowerCase()

    fs.mkdirSync(`${__dirname}/../views/templates/${templateFileName}`)

    templateData.templateUrl = `${__dirname}/../views/templates/${templateFileName}/${templateFileName}.hbs`
    templateData.dataUrl = `${__dirname}/../views/templates/${templateFileName}/${templateFileName}.json`
    templateData.loc = `/${templateFileName}`
    templateData.createdAt = Date.now()
    templateData.updatedAt = templateData.createdAt
    templateData.revisions = 0

    fs.access(`${__dirname}/../views/templates/templateIndex.json`, (err) => {
        if (err) {
            let o = {
                templates: {}
            }
            fs.writeFileSync(`${__dirname}/../views/templates/templateIndex.json`, JSON.stringify(o), 'utf8')
        }
        let templateIndex = JSON.parse(fs.readFileSync(`${__dirname}/../views/templates/templateIndex.json`))

        let templateIndexData = {
            name: templateData.name,
            templateUrl: templateData.templateUrl,
            templateFileName: `${templateFileName}.hbs`,
            dataUrl: templateData.dataUrl,
            dataFileName: `${templateFileName}.json`,
            loc: templateData.loc,
            createdAt: templateData.createdAt,
            updatedAt: templateData.updatedAt,
            revisions: templateData.revisions
        }

        templateIndex.templates[templateData.id] = templateIndexData

        fs.writeFileSync(`${__dirname}/../views/templates/templateIndex.json`, JSON.stringify(templateIndex, undefined, 2), 'utf8')
        fs.writeFileSync(`${__dirname}/../views/templates/${templateFileName}/${templateFileName}.json`, JSON.stringify(templateData, undefined, 2), 'utf8')
        fs.writeFileSync(`${__dirname}/../views/templates/${templateFileName}/${templateFileName}.hbs`, '', 'utf8')

        res.status(200).send('a ok')
    })
})

server.post('/create/page', (req, res) => {
})

server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})
