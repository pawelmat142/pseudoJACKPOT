const express = require('express')
const router = require('./router')
const path = require('path')
const { port } = require('./config')
const bodyParser = require('body-parser')
const cors = require('cors')

require('./mongoose')

const app = express()

app.use(cors())
app.use(express.static(path.join(__dirname + '/public')))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/', router)

app.listen(port, () => console.log('listening on port: ' + port))
