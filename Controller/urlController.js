const shortid = require('shortid')
const config = require('config')
const UrlModel = require('../Model/UrlModel')
const validator = require('../validator/validator')

let createShortUrl = async (req, res) => {
    try {
        let data = req.body
        const { longUrl } = req.body
        const baseUrl = config.get('baseUrl')
        if (!validator.longUrlPresent(data)) {
            return res.status(400).send({ status: false, msg: "Please enter long Url" })
        }
        if (!validator.isValidUrl(longUrl)) {
            return res.status(400).send({ status: false, msg: ` 'Please give a valid longUrl' ` })
        }
        const urlCode = shortid.generate().toLowerCase()
        const shortUrl = baseUrl + '/' + urlCode
        let url = {
            longUrl,
            shortUrl,
            urlCode
        }
        let uniqueUrl = await UrlModel.findOne({ urlCode })
        while (uniqueUrl) {
            const urlCode = shortid.generate().toLowerCase()
            const shortUrl = baseUrl + '/' + urlCode
            url = {
                longUrl,
                shortUrl,
                urlCode
            }
        }

        let newUrl = await UrlModel.create(url)
        return res.status(200).send({ status: true, data: newUrl })

    } catch (err) {
        return res.status(400).send({ status: false, msg: err.message })
    }

}


let redirectUrl = async (req, res) => {
    try {
        const url = await UrlModel.findOne({ urlCode: req.params.urlCode })
        if (url) {
            return res.redirect(url.longUrl)
        } else {
            return res.status(404).send({ status: false, msg: "no url found" })
        }
    } catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }
}
module.exports = {
    createShortUrl,
    redirectUrl
}