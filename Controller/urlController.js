const shortid = require('shortid')
const config = require('config')
const UrlModel = require('../Model/UrlModel')

let createShortUrl = async (req,res) => {
    try{
    const {longUrl} = req.body
    const baseUrl = config.get('baseUrl')
    if (!Object.keys(req.body).includes('longUrl')) {
        return res.status(400).send({ status: false, msg: "Please enter long Url" })
    }   
    if (!(/(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi.test(longUrl))) {
        return res.status(400).send({ status: false, msg: ` 'Please give a valid longUrl' ` })
    }
    let url = await UrlModel.findOne({longUrl})
    if(url){
        return res.status(200).send({ status: true, data : url })
    }else{
        const urlCode = shortid.generate()
        const shortUrl = baseUrl + '/' + urlCode
        url = {
            longUrl,
            shortUrl,
            urlCode
        }

        let newUrl = await UrlModel.create(url)
        return res.status(200).send({ status: true, data : newUrl })

    }
}catch(err){
    return res.status(400).send({ status: false, msg : err.message})
}
   
}


let redirectUrl = async (req,res) => {
    try{
        const url = await UrlModel.findOne({urlCode : req.params.urlCode})
        if(url){
            return res.redirect(url.longUrl)
        }else{
            return res.status(404).send({status :false, msg : "no url found"})
        }
    }catch(err){
        return res.status(404).send({status :false, msg : err.message})
    }
}
module.exports = {
    createShortUrl,
    redirectUrl}