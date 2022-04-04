const express =require('express')
const router = express.Router()
const UrlController = require('../Controller/urlController')

router.get("/test-me", function (req, res) {
    res.send("My first ever api!")
})


router.post('/url/shorten', UrlController.createShortUrl)
router.get('/:urlCode', UrlController.redirectUrl)


module.exports = router