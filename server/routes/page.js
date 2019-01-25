const uuidv4 = require('uuid/v4')
const express = require(`express`)
const fs = require(`fs`)

let router = express.Router()

router.get('/', (req, res) => {
    // get all pages or if given a query string get a page based on that query string
    // test if pageIndex file exists
    fs.access(`${__dirname}/../../pages/pageIndex.json`, (err) => {
        let pageIndex = {}
        let q = req.query
        let ql = Object.keys(q).length
        let qs = Object.keys(q)

        if (err) {
            return res.status(400).send('No pages exist')
        }

        pageIndex = JSON.parse(fs.readFileSync(`${__dirname}/../../pages/pageIndex.json`)).pages

        if (ql !== 0 && ql === 1) {
            for (let page in pageIndex) {
                if (pageIndex[page][qs].toUpperCase() == q[qs].toUpperCase()) {
                    res.status(200).json(pageIndex[page])
                }
            }
        } else if (ql > 1) {
            res.status(400).send('Too many query fields. Please search just by name or id.')
        } else {
            return res.status(200).json(pageIndex)
        }
    })
})

router.post('/', (req, res) => {
    // create a page

    // create empty object for page data
    let pageData = {}

    // create empty object for page metadata to be stored in the page index file
    let pageMeta = {}

    // generate id for new page and add created and upated at fields
    pageData.id = pageMeta.id = uuidv4()
    pageData.createdAt = pageMeta.createdAt = pageData.updatedAt = pageMeta.updatedAt = Date.now()

    // combine pageData with req.body
    pageData = {...pageData, ...req.body}

    // add some data to both pageData and pageMeta...this will probably change over time
    pageData.filename = pageMeta.filename = pageData.name.replace(/[^A-Z0-9]/ig, '_').toLowerCase()
    pageMeta.name = pageData.name

    fs.access(`${__dirname}/../../pages/pageIndex.json`, (err) => {
        if (err) {
            let z = {
                pages: {

                }
            }
            fs.writeFileSync(`${__dirname}/../../pages/pageIndex.json`, JSON.stringify(z, undefined, 2), 'utf8')
        }

        let pageIndex = JSON.parse(fs.readFileSync(`${__dirname}/../../pages/pageIndex.json`))
        pageIndex.pages[pageData.id] = pageMeta

        fs.writeFileSync(`${__dirname}/../../pages/pageIndex.json`, JSON.stringify(pageIndex, undefined, 2), 'utf8')
        fs.mkdirSync(`${__dirname}/../../pages/${pageData.filename}`)
        fs.writeFileSync(`${__dirname}/../../pages/${pageData.filename}/${pageData.filename}.json`, JSON.stringify(pageData, undefined, 2), 'utf8')
    })

    res.status(200).send('Post Received')
})

module.exports = router
