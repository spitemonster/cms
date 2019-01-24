// import methods from './methods.js'

const express = require(`express`)
const fs = require(`fs`)
const MarkDownIt = require(`markdown-it`)
const hbs = require('hbs')
const bodyParser = require('body-parser')
const urlencodedParser = bodyParser.urlencoded({extended: false})
const path = require('path')

let app = express()
let md = new MarkDownIt()
let PORT = process.env.PORT ? process.env.PORT : 8888

hbs.registerPartials(`./views/partials/`)
app.set('view engine', 'hbs')

app.use('/public', express.static('public'))
app.use(bodyParser.json())
app.use(express.urlencoded({ extended: false }))

app.get(`/`, (req, res) => {
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

// app.get(`/:page`, (req, res) => {
//   let page = req.params.page

//   if (page === `admin`) {
//     return res.render('panel.hbs')
//   } else {
//     // console.log('running')
//     let menu = JSON.parse(fs.readFileSync(`./views/menu.json`))

//     fs.readFile(`./pages/${page}/${page}.md`, `utf8`, (err, data) => {
//       if (err) {
//         res.send(`There was an error.`)
//       }

//       let markdown = md.render(data)
//       res.render(`page.hbs`, {
//         content: markdown,
//         menu: menu
//       })
//     })
//   }
// })

app.get(`/admin`, (req, res) => {
  res.render(`panel.hbs`)
})

app.get('/templates', (req, res) => {
  let templates = fs.readFileSync(`${__dirname}/../views/templates/templateIndex.json`)

  res.send(templates)
})

app.post(`/newpage`, (req, res) => {
  let pageName = req.body.pageName
  let headline = req.body.headline
  let body = req.body.body

  let data = `# ${headline}\n\n${body}`

  fs.mkdirSync(`./pages/${pageName}`)

  fs.writeFileSync(`./pages/${pageName}/${pageName}.md`, data)

  res.redirect(`/${pageName}`)
})

app.post(`/create/template`, (req, res) => {
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
      id: templateData.id,
      templateUrl: templateData.templateUrl,
      dataUrl: templateData.dataUrl,
      loc: templateData.loc,
      createdAt: templateData.createdAt,
      updatedAt: templateData.updatedAt,
      revisions: templateData.revisions
    }

    templateIndex.templates[templateData.name] = templateIndexData

    fs.writeFileSync(`${__dirname}/../views/templates/templateIndex.json`, JSON.stringify(templateIndex, undefined, 2), 'utf8')
    fs.writeFileSync(`${__dirname}/../views/templates/${templateFileName}/${templateFileName}.json`, JSON.stringify(templateData, undefined, 2), 'utf8')
    fs.writeFileSync(`${__dirname}/../views/templates/${templateFileName}/${templateFileName}.hbs`, '', 'utf8')

    res.status(200).send('a ok')
  })
})

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})
