const express = require('express')
const connectDB = require('./config/db')

//initialize app with express function
const app = express()


//Connect to database
connectDB()

// middleware
//allows us to except JSON data into our api
app.use(express.json({extended:false}))


// Define route
app.use('/', require('./routes/route'))

const PORT = 3000

//listen on port
app.listen(PORT, () => console.log(`server running on port ${PORT}`))