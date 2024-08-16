const scoreGenerator = require('../modules/ScoreGenerator')
const sessionController = require('./sessionController')
const Session = require('../model/Session')
const Spin = require('../model/Spin')

// BET

exports.betUp = async (req, res) => {
    try {
        const sessionId = req.params.sessionId
        const sessionData = req.data
        let bet = parseInt(sessionData.bet)
        updateBetBySessionId(sessionId, bet + 1)
        res.status(200).json(bet + 1)
    }
    catch (error) { res.status(400).json({message: error.message}) }
}


exports.betDown = async (req, res) => {
    try {
        const sessionId = req.params.sessionId
        const sessionData = req.data
        let bet = parseInt(sessionData.bet)
        if (bet > 1) {
            updateBetBySessionId(sessionId, bet - 1)
            res.status(200).json(bet - 1)
        } else res.json(bet)
    }
    catch (error) { res.status(400).json({message: error.message}) }
}

// TRANSFER

exports.transfer = async (req, res) => {
    try {
        const sessionId = req.params.sessionId
        const sessionData = req.data
        const transfer = parseInt(req.body.transfer)
        if (!transfer) throw new Error('transfer error')
        if (transfer > sessionData.win) throw new Error('not enough win')
        const state = {
            coins: sessionData.coins + transfer,
            bet: sessionData.bet,
            win: sessionData.win - transfer
        }
        updateState(state, sessionId)
        res.status(200).json(true)
    }
    catch (error) { res.status(400).json({message: error.message}) }
}


// SPIN

exports.spin = async (req, res) => {
    try {
        const sessionId = req.params.sessionId
        let sessionData = req.data
        const score = scoreGenerator.getScore()
        if ((sessionData.coins < sessionData.bet)) {
            res.status(204).json({board: "not enough coins"})
            return
        }
        const state = {
            coins: sessionData.coins - sessionData.bet,
            bet: sessionData.bet,
            win: sessionData.win + score*sessionData.bet
        }
        addSpin(sessionId, score, state.bet)
        updateState(state, sessionId)
        res.status(200).json(score)
    }
    catch (error) {
        console.log(error)
        res.status(400).json({message: error.message})
    }
}


const updateState = (state, sessionId) =>
    new Promise(async (resolve, reject) => {
        const newState = await Session.findByIdAndUpdate(sessionId, state)
        if (newState) resolve()
        else reject()
    })


const  updateBetBySessionId = async (sessionId, bet) => {
    const result = await Session.findByIdAndUpdate(sessionId, { bet })
    if (result) return true
    else throw new Error('update bet error')
}

const addSpin = async (_sessionId, _score, _bet) => {
    const spin = new Spin()
    spin.session_id = _sessionId
    spin.score = _score
    spin.bet = _bet
    const result = await spin.save()
    return result ? spin : false
}
