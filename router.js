const express = require('express')
const router = express.Router()
const path = require('path')

const pagesController = require('./controllers/pagesController')
const gameController = require('./controllers/gameController')

router.get('/', pagesController.home)
router.get('/scores-page', pagesController.scoresPage)
router.get('/session/:sessionId/spins', pagesController.sessionSpins)

router.get('/session', gameController.newSession)
router.get('/session/:sessionId', gameController.getSession)
router.get('/sessions/:sessionsIds', gameController.getSessions)
router.get('/session/stop/:sessionId', gameController.stopSession)
router.get('/betup/:sessionId', gameController.betUp)
router.get('/betdown/:sessionId', gameController.betDown)
router.post('/transfer/:sessionId', gameController.transfer)
router.get('/spin/:sessionId', gameController.spin)

module.exports = router