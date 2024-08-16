require('dotenv').config({path: '.env'})
const mongoose = require('mongoose')
const dbpassword = process.env.DB_PASSWORD
const url = `mongodb+srv://clustertest:${dbpassword}@test.8puis.mongodb.net/?retryWrites=true&w=majority&appName=majority`
console.log(url)
mongoose.connect(url).then(() => {
    console.log('mongo connected')
})