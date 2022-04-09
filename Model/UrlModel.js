const mongoose = require('mongoose');
const urlSchema = new mongoose.Schema({

    urlCode: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true
    },
    longUrl: {
        type: String,
        trim: true,
        required: [true, 'longUrl is required'],
        validate: {
            validator: function (link) {
              return /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(link)
            },
            message: 'Please give a valid link',
            isAsync: false
          }

    },
    shortUrl:{
        type:String,
        unique:true,
        required: true, 
        
    }

}, { timestamps: true })
module.exports = mongoose.model('Url', urlSchema)