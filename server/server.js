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

app.post(`/newpage`, (req, res) => {
  let pageName = req.body.pageName
  let headline = req.body.headline
  let body = req.body.body

  let data = `# ${headline}\n\n${body}`

  fs.mkdirSync(`./pages/${pageName}`)

  fs.writeFileSync(`./pages/${pageName}/${pageName}.md`, data)

  res.redirect(`/${pageName}`)
})

app.post(`/template`, (req, res) => {
  // console.log(req.body.name)
  let templateData = req.body
  let templateFieldData = Object.assign(templateData.fields)

  let templateFileName = req.body.name.replace(/[^A-Z0-9]/ig, '_')

  // commented out lines below are for the (eventual) overwrite/revision system that I have not put in place because as of right now, not entirely certain how i want to do it.
  // TODO: implement overwrite/revision system. ideal scenario:
  // user edits template -> option for overwrite/revision -> overwrite just writes over template JSON file

  // fs.access(`${__dirname}/../views/templates/${templateFileName}.json`, (err) => {
    // if (!err) {
    //   return console.log('file exists')
    // }

  fs.writeFile(`${__dirname}/../views/templates/${templateFileName}.hbs`, '', 'utf8', (err) => {
    if (err) {
        // do something
    }

    templateData.url = `${__dirname}/../views/templates/${templateFileName}.hbs`
    templateData.createdAt = Date.now()

    fs.writeFileSync(`${__dirname}/../views/templates/${templateFileName}.json`, JSON.stringify(templateData, undefined, 2), 'utf8')
  })

  res.status(200).send('a ok')
  // })
})

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})
