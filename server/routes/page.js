const uuidv4 = require('uuid/v4')
const express = require(`express`)
const fs = require(`fs`)
const rimraf = require(`rimraf`)

const Ajv = require('ajv')
const pageSchema = require('../schema/page.schema.json')
let ajv = new Ajv()

let router = express.Router()

router.get('/', (req, res) => {
    // get all pages or if given a query string get a page based on that query string
    // test if pageIndex file exists

    fs.access(`${__dirname}/../../pages/pageIndex.json`, (err) => {
        if (err) {
            // handle error
            // this should only happen if the pageIndex.json file doesn't exist
            // 500 error

            return
        }

        let pageIndex = JSON.parse(fs.readFileSync(`${__dirname}/../../pages/pageIndex.json`))

        return res.status(200).json(pageIndex)

    })
})

router.get('/:pageId', (req, res) => {
    let pid = req.params.pageId

    fs.access(`${__dirname}/../../pages/pageIndex.json`, (err) => {
        if (err) {
            // handle error
            // this should only happen if the pageIndex.json file doesn't exist
            // 500 error

            return
        }

        let pageIndex = {}

        pageIndex = JSON.parse(fs.readFileSync(`${__dirname}/../../pages/pageIndex.json`))

        let target = pageIndex[pid]

        fs.readFile(`${__dirname}/../../pages/${target.filename}/${target.filename}.json`, (err, data) => {
            if (err) {
                // handle error
            }

            return res.status(200).json(JSON.parse(data))
        })

    })
})


router.get('/:pageId/revision/', (req, res) => {
    let pid = req.params.pageId

    fs.access(`${__dirname}/../../pages/pageIndex.json`, (err) => {
        if (err) {
            // handle error
            // this should only happen if the pageIndex.json file doesn't exist
            // 500 error

            return
        }

        let pageIndex = {}

        pageIndex = JSON.parse(fs.readFileSync(`${__dirname}/../../pages/pageIndex.json`))

        let target = pageIndex[pid]

        fs.readFile(`${__dirname}/../../pages/${target.filename}/${target.filename}.json`, (err, data) => {
            if (err) {
                // handle error
            }

            let pageData = JSON.parse(data)

            return res.status(200).json(pageData.revisions)
        })

    })
})


router.get('/:pageId/revision/:revId', (req, res) => {
    let pid = req.params.pageId
    let rid = req.params.revId

    fs.access(`${__dirname}/../../pages/pageIndex.json`, (err) => {
        if (err) {
            // handle error
            // this should only happen if the pageIndex.json file doesn't exist
            // 500 error

            return
        }

        let pageIndex = {}

        pageIndex = JSON.parse(fs.readFileSync(`${__dirname}/../../pages/pageIndex.json`))

        let target = pageIndex[pid]

        fs.readFile(`${__dirname}/../../pages/${target.filename}/${target.filename}-revision-${rid}.json`, (err, data) => {
            if (err) {
                // handle error
            }

            let pageData = JSON.parse(data)

            return res.status(200).json(pageData)
        })

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
    pageData.createdBy = pageData.updatedBy = req.session.username
    pageData.createdAt = pageMeta.createdAt = pageData.updatedAt = pageMeta.updatedAt = Date.now()

    // combine pageData with req.body
    pageData = {...pageData, ...req.body}

    // add some data to both pageData and pageMeta...this will probably change over time
    pageData.filename = pageMeta.filename = pageData.name.replace(/[^A-Z0-9]/ig, '_').toLowerCase()
    pageMeta.name = pageData.name
    pageMeta.url = pageData.url
    pageMeta.templateUrl = pageData.templateUrl
    pageMeta.templateId = pageData.templateId

    let templateIndex = JSON.parse(fs.readFileSync(`${__dirname}/../../views/templates/templateIndex.json`))

    templateIndex[pageData.templateId].pages.push(pageData.id)

    let valid = ajv.validate(pageSchema, pageData)

    if (!valid) {
        return res.status(400).send('error creating page')
    }

    fs.access(`${__dirname}/../../pages/pageIndex.json`, (err) => {
        if (err) {
            let z = {
            }
            fs.writeFileSync(`${__dirname}/../../pages/pageIndex.json`, JSON.stringify(z, undefined, 2), 'utf8')
        }

        let pageIndex = JSON.parse(fs.readFileSync(`${__dirname}/../../pages/pageIndex.json`))
        pageIndex[pageData.id] = {...pageMeta}

        fs.writeFileSync(`${__dirname}/../../pages/pageIndex.json`, JSON.stringify(pageIndex, undefined, 2), 'utf8')
        fs.mkdirSync(`${__dirname}/../../pages/${pageData.filename}`)
        fs.writeFileSync(`${__dirname}/../../views/templates/templateIndex.json`, JSON.stringify(templateIndex, undefined, 2), 'utf8')
        fs.writeFileSync(`${__dirname}/../../pages/${pageData.filename}/${pageData.filename}.json`, JSON.stringify(pageData, undefined, 2), 'utf8')
    })

    res.status(200).send('Post Received')
})

router.patch('/:pageId', (req, res) => {
    // get the data of the requested page
    let  t = req.params.pageId

    // read the index file and get data
    let pageIndex = JSON.parse(fs.readFileSync(`${__dirname}/../../pages/pageIndex.json`))

    // get the target filename from pageIndex data
    let targetFile = pageIndex[t].filename

    // get target page data
    let targetPage = JSON.parse(fs.readFileSync(`${__dirname}/../../pages/${targetFile}/${targetFile}.json`))

    // overwrite data of data file
    let newData = {...targetPage, ...req.body}

    if (!newData.revisions) {
        newData.revisions = []
    }

    let revId = uuidv4()
    let r = {}

    r.id = revId

    targetPage.revisionId = revId

    // update 'updated at' of both index data and page data
    newData.updatedBy = r.updatedBy = req.session.username
    newData.updatedAt = pageIndex[t].updatedAt = r.createdAt = Date.now()
    r.name = newData.name

    newData.revisions.push(r)

    let valid = ajv.validate(pageSchema, newData)

    if (!valid) {
        return res.status(400).send('error creating page')
    }

    // save a draft of the page
    fs.writeFileSync(`${__dirname}/../../pages/${targetFile}/${targetFile}-revision-${revId}.json`, JSON.stringify(targetPage, undefined, 2), 'utf8')

    // write new data to page data file and updated data to
    fs.writeFileSync(`${__dirname}/../../pages/${targetFile}/${targetFile}.json`, JSON.stringify(newData, undefined, 2), 'utf8')
    fs.writeFileSync(`${__dirname}/../../pages/pageIndex.json`, JSON.stringify(pageIndex, undefined, 2), 'utf8')

    res.status(200).send('Page Updated')
})

router.delete('/:pageId', (req, res) => {
    let pageId = req.params.pageId

    let pageIndex = JSON.parse(fs.readFileSync(`${__dirname}/../../pages/pageIndex.json`))
    let templateIndex = JSON.parse(fs.readFileSync(`${__dirname}/../../views/templates/templateIndex.json`))

    let targetTemplate = pageIndex[pageId].templateId

    templateIndex[targetTemplate].pages.splice(templateIndex[targetTemplate].pages.indexOf(pageId), 1)

    rimraf(`${__dirname}/../../pages/${pageIndex[pageId].filename}`, () => {
        delete pageIndex[pageId]
        fs.writeFileSync(`${__dirname}/../../views/templates/templateIndex.json`, JSON.stringify(templateIndex, undefined, 2), 'utf8')
        fs.writeFileSync(`${__dirname}/../../pages/pageIndex.json`, JSON.stringify(pageIndex, undefined, 2), 'utf8')
    })

    res.status(200).send('Deleted')
})

module.exports = router
