const express = require('express')
const connectDB = require('./config/db')

const app = express()

//Connect to database
connectDB()
app.use(express.json({extended:false}))


// Define route

app.use('/', require('./routes/route'))
const PORT = 3000

app.listen(PORT, () => console.log(`server running on port ${PORT}`))