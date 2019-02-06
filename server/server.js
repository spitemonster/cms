const express = require(`express`)
const fs = require(`fs`)
const hbs = require('hbs')
const bodyParser = require('body-parser')
const methods = require('./methods.js')
const helmet = require('helmet')
const session = require('express-session')
const uuidv4 = require('uuid/v4')
const cookieParser = require('cookie-parser')

let server = express()
let PORT = process.env.PORT ? process.env.PORT : 8888

let page = require('./routes/page.js')
let template = require('./routes/template.js')
let admin = require('./routes/admin.js')
let login = require('./routes/login.js')
let logout = require('./routes/logout.js')
let user = require('./routes/user.js')
let test = require('./routes/test.js')

let hour = 3600000

hbs.registerPartials(`./views/partials/`)
server.set('view engine', 'hbs')

server.use('/public', express.static('public'))
server.use(bodyParser.json())
server.use(express.urlencoded({ extended: false }))
server.use(helmet())
server.use(session({
    genid: (req) => {
        return uuidv4() // use UUIDs for session IDs
    },
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    expires: new Date(Date.now() + hour)
}))
server.use(cookieParser())

server.use('/page', page)
server.use('/template', template)
server.use('/admin', admin)
server.use('/login', login)
server.use('/logout', logout)
server.use('/user', user)
server.use('/test', test)

server.get(`/*`, (req, res) => {
    // let path = req.path
    // let
    // // fs.readFile

    // fs.readFile(`${__dirname}/../pages/pageIndex.json`, (err, data) => {
    //     let pages = JSON.parse(data)
    //     let pageNum = Object.keys(pages).length
    //     let index = 1

    //     if (err) {
    //         methods.handleErrors(err)
    //     }

    //     for (let page in pages) {

    //         let p = pages[page]

    //         if (p.url !== path) {
    //             console.log('bouncing')
    //             index = index + 1
    //             console.log(index)
    //             return
    //         }

    //         res.send(p.name)

    //         fs.readFile(`${__dirname}/../pages/${p.filename}/${p.filename}.json`, (err, data) => {
    //             let pageData = JSON.parse(data)

    //             if (err) {
    //                 return res.redirect('/')
    //             }

    //             pageData.fields.forEach((field) => {
    //                 pd[field.name.toLowerCase()] = field.content
    //             })

    //             return res.render(pageData.templateUrl, pd)
    //         })
    //     }
    // })

    // return res.status(404).send('no page found')

    let path = req.path
    let pd = {}
    let pname

    fs.readFile(`${__dirname}/../pages/pageIndex.json`, (err, data) => {
        let pageData = JSON.parse(data)
        let k = Object.keys(pageData)
        let l = k.length
        let i = 0

        while (i < l) {
            let p = pageData[k[i]]
            if (p.url === path) {
                pname = p.filename
                break
            }
            i++
        }

        if (!pname) {
            return res.status(404).send('Not found')
        }

        fs.readFile(`${__dirname}/../pages/${pname}/${pname}.json`, (err, data) => {
            let pageData = JSON.parse(data)

            if (err) {
                return res.status(404).send('Not found')
            }

            pageData.fields.forEach((field) => {
                pd[field.name.toLowerCase()] = field.content
            })

            return res.render(pageData.templateUrl, pd)
        })
    })
})

server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})
