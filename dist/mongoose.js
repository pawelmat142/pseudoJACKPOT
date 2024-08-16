require('dotenv').config({path: '.env'})
const mongoose = require('mongoose')
const dbpassword = process.env.DB_PASSWORD
// const url = `mongodb+srv://clustertest:${dbpassword}@test.8puis.mongodb.net/?retryWrites=true&w=majority&appName=majority`
const url = `mongodb+srv://clustertest:${encodeURIComponent(dbpassword)}@test.8puis.mongodb.net`
console.log(url)
mongoose.connect(url).then(() => {
    console.log('mongo connected')
})