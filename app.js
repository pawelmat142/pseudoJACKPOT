const express = require('express')
const router = require('./router')
const path = require('path')
const {port} = require('./config')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const flash = require('connect-flash')
const {db_config} = require('./config')

const app = express()

// app configuration
app.set('view engine', 'hbs')
app.set('views', path.join(__dirname, 'public/views'))
app.use(express.static(path.join(__dirname, 'public')))

// parser
// app.use(bodyParser.json())
// app.use(cookieParser())

console.log(db_config.connection)

// routes
app.use('/', router)

// server 
app.listen(port, () => console.log('listening on port: ' + port))
