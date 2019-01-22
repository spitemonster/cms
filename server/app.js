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

app.get('/admin', (req, res) => {
  res.sendFile(path.resolve(`${__dirname}/../admin/public/index.html`))
})

app.get(`/:page`, (req, res) => {
  let page = req.params.page

  console.log(req.params)

  if (page === `panel`) {
    return res.render('panel.hbs')
  } else if (page === 'admin') {
    return res.render('./admin/public/index.html')
  } else {
    // console.log('running')
    let menu = JSON.parse(fs.readFileSync(`./views/menu.json`))

    fs.readFile(`./pages/${page}/${page}.md`, `utf8`, (err, data) => {
      if (err) {
        res.send(`There was an error.`)
      }

      let markdown = md.render(data)
      res.render(`page.hbs`, {
        content: markdown,
        menu: menu
      })
    })
  }
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

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})
