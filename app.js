const express = require('express')
const router = require('./router')
const path = require('path')
const {port} = require('./config')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const flash = require('connect-flash')

const app = express()

// app configuration
app.set('view engine', 'hbs')
app.set('views', path.join(__dirname, 'public/views'))
app.use(express.static(path.join(__dirname, 'public')))

// parsery
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// routes
app.use('/', router)

// server 
app.listen(port, () => console.log('listening on port: ' + port))






// another app
const app2 = express()
app2.use(express.static(path.join(__dirname, 'todo_app')))
app2.use(bodyParser.urlencoded({ extended: false }));
app2.use(bodyParser.json());
app2.use('/', (req, res) => res.sendFile(path.resolve(__dirname + '/todo_app/index.html')) )
app2.listen(443, () => console.log('listening on port: ' + 443))
// end another app