require('dotenv').config({path: '.env'})
const mongoose = require('mongoose')
const url = process.env.MONGO_URI
console.log(url)
mongoose.connect(url).then(() => {
    console.log('mongo connected')
})