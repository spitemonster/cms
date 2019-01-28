const uuidv4 = require('uuid/v4')
const express = require(`express`)
const fs = require(`fs`)
const rimraf = require(`rimraf`)

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

        let pageIndex = {}
        let q = req.query
        let ql = Object.keys(q).length

        if (ql > 1 || (Object.keys(q)[0] !== 'id' && ql !== 0)) {
            return res.status(403).send('Query pages only by ID.')
        }

        pageIndex = JSON.parse(fs.readFileSync(`${__dirname}/../../pages/pageIndex.json`))

        if (ql === 0) {
            return res.status(200).json(pageIndex)
        }

        let target = pageIndex[q['id']]

        fs.readFile(`${__dirname}/../../pages/${target.filename}/${target.filename}.json`, (err, data) => {
            if (err) {
                // handle error
            }

            return res.status(200).json(JSON.parse(data))
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

    // console.log(req.body)

    let pageIndex = JSON.parse(fs.readFileSync(`${__dirname}/../../pages/pageIndex.json`))
    let targetFile = pageIndex[t].filename
    let targetPage = JSON.parse(fs.readFileSync(`${__dirname}/../../pages/${targetFile}/${targetFile}.json`))

    // save a draft of the page
    // fs.copyFile(`${__dirname}/../../pages/${targetFile}/${targetFile}.json`, `${__dirname}/../../pages/${targetFile}/${targetFile}-revision-${Date.now()}.json`, (err) => {
    //     if (err) {
    //         // handle error
    //     }
    // })

    // overwrite data of data file
    let newData = {...targetPage, ...req.body}

    console.log(newData)

    //
})

router.delete('/:pageId', (req, res) => {
    let pageId = req.params.pageId

    let pageIndex = JSON.parse(fs.readFileSync(`${__dirname}/../../pages/pageIndex.json`))
    let templateIndex = JSON.parse(fs.readFileSync(`${__dirname}/../../views/templates/templateIndex.json`))

    let targetTemplate = pageIndex[pageId].templateId

    console.log(templateIndex[targetTemplate].pages.indexOf(pageId))

    templateIndex[targetTemplate].pages.splice(templateIndex[targetTemplate].pages.indexOf(pageId), 1)

    rimraf(`${__dirname}/../../pages/${pageIndex[pageId].filename}`, () => {
        delete pageIndex[pageId]
        fs.writeFileSync(`${__dirname}/../../views/templates/templateIndex.json`, JSON.stringify(templateIndex, undefined, 2), 'utf8')
        fs.writeFileSync(`${__dirname}/../../pages/pageIndex.json`, JSON.stringify(pageIndex, undefined, 2), 'utf8')
    })

    res.status(200).send('Deleted')
})

module.exports = router
