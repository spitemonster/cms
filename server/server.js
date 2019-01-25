// import methods from './methods.js'
const express = require(`express`)
const fs = require(`fs`)
const hbs = require('hbs')
const bodyParser = require('body-parser')

let server = express()
let PORT = process.env.PORT ? process.env.PORT : 8888

let page = require('./routes/page.js')
let template = require('./routes/template.js')
let admin = require('./routes/admin.js')

hbs.registerPartials(`./views/partials/`)
server.set('view engine', 'hbs')

server.use('/public', express.static('public'))
server.use(bodyParser.json())
server.use(express.urlencoded({ extended: false }))

server.use('/page', page)
server.use('/template', template)
server.use('/admin', admin)



server.get(`/:slug?`, (req, res) => {
    let pageIndex = JSON.parse(fs.readFileSync(`${__dirname}/../pages/pageIndex.json`))
    let slug = req.params.slug

    if (typeof slug === 'undefined') {
        for (let page in pageIndex) {
            let p = pageIndex[page]

            if (p.url === '/') {
                let pageData = JSON.parse(fs.readFileSync(`${__dirname}/../pages/${p.filename}/${p.filename}.json`))

                let pd = {}

                pageData.fields.forEach((field) => {
                    pd[field.name.toLowerCase()] = field
                })

                return res.render(pageData.templateUrl, { pd })
            }
        }
    } else {
        for (let page in pageIndex) {
            let p = pageIndex[page]

            if (p.url === `/${slug}`) {
                let pageData = JSON.parse(fs.readFileSync(`${__dirname}/../pages/${p.filename}/${p.filename}.json`))

                let pd = {}

                pageData.fields.forEach((field) => {
                    pd[field.name.toLowerCase()] = field
                })

                return res.render(pageData.templateUrl, { pd })
            }
        }
    }
})

server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})
