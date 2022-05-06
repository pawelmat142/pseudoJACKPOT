const express = require('express')
const router = express.Router()

const pagesController = require('./controllers/pagesController')
const sessionController = require('./controllers/sessionController')
const gameController = require('./controllers/gameController')

router.get('/', pagesController.home)
router.get('/scores-page', pagesController.scoresPage)
router.get('/session/:sessionId/spins', 
    sessionController.sessionData,
    pagesController.sessionSpins
)

router.get('/session', sessionController.newSession)
router.get('/session/:sessionId', sessionController.getSession)
router.get('/sessions/:sessionsIds', sessionController.getSessions)
router.get('/session/stop/:sessionId', sessionController.stopSession)

router.get('/betup/:sessionId', 
    sessionController.sessionData,
    gameController.betUp
)
    
router.get('/betdown/:sessionId', 
    sessionController.sessionData,
    gameController.betDown
)
    
router.post('/transfer/:sessionId', 
    sessionController.sessionData,
    gameController.transfer
)
    
router.get('/spin/:sessionId', 
    sessionController.sessionData,
    gameController.spin
)
    
module.exports = router