const mongoose = require('mongoose')
const config = require('config')
// to get global variable
const db = config.get('mongoURI')

//connect to database
const connectDB = async() => {
    try{
        await mongoose.connect(db,{
            useNewUrlParser : true
        })
        console.log('MongoDB connected')
    }catch(err){
        console.error(err.message)
        process.exit(1)

    }
}
module.exports = connectDB