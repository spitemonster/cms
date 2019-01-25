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
let template = require('./routes/template.js')

hbs.registerPartials(`./views/partials/`)
server.set('view engine', 'hbs')

server.use('/public', express.static('public'))
server.use(bodyParser.json())
server.use(express.urlencoded({ extended: false }))

server.use('/page', page)
server.use('/template', template)

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

server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})
