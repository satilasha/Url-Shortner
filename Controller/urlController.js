const shortid = require('shortid')
const config = require('config')
const UrlModel = require('../Model/UrlModel')
const validator = require('../validator/validator')
const redis = require('redis')
const { promisify } = require("util");


const redisClient = redis.createClient({ host: 'redis-12707.c16.us-east-1-3.ec2.cloud.redislabs.com', port: 12707, username: 'swati-free-db', password: 'UWMKEh5UTrLlOvtO6y6jSKItLOp0W9Ly' });

redisClient.on('connect', () => {
    console.log('connected to redis successfully!');
})

redisClient.on('error', (error) => {
    console.log('Redis connection error :', error);
})

const SET_ASYNC = promisify(redisClient.SET).bind(redisClient);
const GET_ASYNC = promisify(redisClient.GET).bind(redisClient);

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

        const cahcedUrlData = await GET_ASYNC(`${longUrl}`)
        if (cahcedUrlData) {
            return res.status(200).send({ status: "true", data: cahcedUrlData })

        }

        let url = await UrlModel.findOne({ longUrl }).select({_id:0, createdAt: 0, updatedAt: 0, __v: 0 })
        if (url) {
            await SET_ASYNC(`${longUrl}`, JSON.stringify(url))
            return res.status(200).send({ status: true, data: url })
        } else {
            const urlCode = shortid.generate().toLowerCase()
            const shortUrl = baseUrl + '/' + urlCode
            url = {
                longUrl,
                shortUrl,
                urlCode
            }
            await UrlModel.create(url)
            await SET_ASYNC(`${longUrl}`, JSON.stringify(url))
            return res.status(201).send({ status: true, data: url })

        }
       
    } catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }

}


let redirectUrl = async (req, res) => {
    try {
        let cachedData = await GET_ASYNC(req.params.urlCode);
        if (cachedData) {
            console.log("Data from cache memory")
            return res.status(302).redirect((JSON.parse(cachedData)).longUrl);
        }
        const url = await UrlModel.findOne({ urlCode: req.params.urlCode })
        if (url) {
            await SET_ASYNC(`${req.params.urlCode}`, JSON.stringify(url))
            return res.status(302).redirect(url.longUrl)
        } else {
            return res.status(404).send({ status: false, msg: "No url found" })
        }
    } catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }
}
module.exports = {
    createShortUrl,
    redirectUrl
}




