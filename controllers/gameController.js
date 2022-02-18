const scoreGenerator = require('./ScoreGenerator')

const addSpin = require('../database/addSpin')
const newSessionId = require('../database/newSessionId')
const getSessionById = require('../database/getSessionById')
const stopSessionById = require('../database/stopSessionById')
const updateCoinsBySessionId = require('../database/updateCoinsBySessionId')
const updateBetBySessionId = require('../database/updateBetBySessionId')
const updateWinBySessionId = require('../database/updateWinBySessionId')


// SESSION

exports.newSession = async (req, res, next) => {
    try {
        const session = await newSessionId()
        if (session) res.json(session)
        else throw new Error('db response error')
    }
    catch (error) { next(error) }
}


exports.getSession = async (req, res, next) => {
    try {
        const sessionId = req.params.sessionId
        const session = await getSessionById(sessionId)
        if (session) { res.json(session) }
        else throw new Error('db response error')
    }
    catch (error) { next(error) }
}


exports.stopSession = async (req, res, next) => {
    try {
        const sessionId = req.params.sessionId
        const sessionData = await stopSessionById(sessionId)
        if (sessionData) { res.json(sessionData) }
        else throw new Error('db response error')
    }
    catch (error) { next(error) }
}


// BET

exports.betUp = async (req, res, next) => {
    try {
        const sessionId = req.params.sessionId
        const sessionData = await getSessionById(sessionId)
        if (sessionData) { 
            let bet = parseInt(sessionData.bet)
            const result = await updateBetBySessionId(sessionId, bet + 1)
            if (result) res.json(bet + 1)
            else throw new Error('db response error')
        }
        else throw new Error('db response error')
    }
    catch (error) { next(error) }
}


exports.betDown = async (req, res, next) => {
    try {
        const sessionId = req.params.sessionId
        const sessionData = await getSessionById(sessionId)
        if (sessionData) {
            let bet = parseInt(sessionData.bet)
            if (bet > 1) {
                const result = await updateBetBySessionId(sessionId, bet - 1)
                if (result) res.json(bet - 1)
                else throw new Error('db response error')
            }
        }
        else throw new Error('db response error')
    }
    catch (error) { next(error) }
}


// SPIN

exports.spin = async (req, res, next) => {
    try {
        const score = scoreGenerator.getScore()
        const board = scoreGenerator.getBoard(score)
        const sessionId = req.params.sessionId
        const sessionData = await getSessionById(sessionId)
        if (sessionData) {
            const bet = parseInt(sessionData.bet)
            const spin = await addSpin(sessionId, score, bet)
            if (spin) {
                const coins = await updateCoinsBySessionId(sessionId, parseInt(sessionData.coins - bet))
                const win = await updateWinBySessionId(sessionId, parseInt(sessionData.win + parseInt(spin.score) * bet))
                if (coins && win) {
                    res.json({
                        board: board,
                        coins: coins,
                        bet: bet,
                        win: win
                    })
                    console.log(`session: ${sessionId}, score: ${score}, bet: ${bet} `)
                    console.log(board)
                }
                else throw new Error('db response error')
            }
            else throw new Error('db response error')
        }
        else throw new Error('db response error')
    }
    catch (error) { next(error) }
}



// TEST

exports.test = async (req, res) => {
    console.log('test')
    const a = await countSpins()
    console.log(`There are ${a} items`)
    res.json('test')
}


let scoreSum = 0
let shotCounter = 0
let totalScore = 0
exports.testing = (req, res) => {
    const testOnce = () => {
        const shot = scoreGenerator.getShot()
        const score = scoreGenerator.getScore(shot)
        scoreSum += score
        shotCounter++
        totalScore += score
        totalScore--
        console.log(`shot: ${shot}, score: ${score}`)
        console.log(`shotCounter: ${shotCounter}, totalScore: ${totalScore}, scoreSum: ${scoreSum}`)
    }
    for(let i = 0; i < 100000; i++) {
        testOnce()
    }
    res.json({testing: "testing"})
}