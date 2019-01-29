const express = require(`express`)
const fs = require(`fs`)
const hbs = require('hbs')
const bodyParser = require('body-parser')
const methods = require('./methods.js')

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

    fs.readFile(`${__dirname}/../pages/pageIndex.json`, (err, data) => {
        let pages = JSON.parse(data)
        let pd = {}

        if (err) {
            methods.handleErrors(err)
        }

        for (let page in pages) {
            let p = pages[page]

            if (p.url !== req.path) {
                continue
            }

            fs.readFile(`${__dirname}/../pages/${p.filename}/${p.filename}.json`, (err, data) => {
                let pageData = JSON.parse(data)

                if (err) {
                    return res.redirect('/')
                }

                pageData.fields.forEach((field) => {
                    pd[field.name.toLowerCase()] = field.content
                })

                return res.render(pageData.templateUrl, pd)
            })
        }
    })
})

server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})
