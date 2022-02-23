const express = require('express')
const router = express.Router()

const pagesController = require('./controllers/pagesController')
const gameController = require('./controllers/gameController')

router.get('/', pagesController.home)

router.get('/session', gameController.newSession)
router.get('/session/:sessionId', gameController.getSession)
router.get('/session/stop/:sessionId', gameController.stopSession)

router.get('/betup/:sessionId', gameController.betUp)
router.get('/betdown/:sessionId', gameController.betDown)

router.post('/transfer/:sessionId', gameController.transfer)

router.get('/spin/:sessionId', gameController.spin)

router.get('/testing', gameController.testing)

module.exports = router