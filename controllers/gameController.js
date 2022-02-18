const scoreGenerator = require('./ScoreGenerator')

const addSpin = require('../database/addSpin')
const newSession = require('../database/newSession')
const getSession = require('../database/getSession')
const stopSession = require('../database/stopSession')
const setCoins = require('../database/setCoins')
const setBet = require('../database/setBet')
const setWin = require('../database/setWin')


// SESSION

exports.newSession = async (req, res) => {
    const sessionData = await newSession()
    res.json(sessionData)
}


exports.getSessionById = async (req, res) => {
    const sessionId = req.params.sessionId
    const sessionData = await getSession(sessionId)
    res.json(sessionData)
}


exports.stopSessionById = async (req, res) => {
    const sessionId = req.params.sessionId
    const sessionData = await stopSession(sessionId)
    if (sessionData) res.json('ok')
    else res.status(401).json('stop session error')
}


// BET

exports.betUp = async (req, res) => {
    const sessionId = req.params.sessionId
    const sessionData = await getSession(sessionId)
    let bet = parseInt(sessionData.bet)
    const result = await setBet(sessionId, bet + 1)
    if (result) res.json(bet + 1)
    else res.status(401).json('bet up error')
}


exports.betDown = async (req, res) => {
    const sessionId = req.params.sessionId
    const sessionData = await getSession(sessionId)
    let bet = parseInt(sessionData.bet)
    if (bet > 1) {
        const result = await setBet(sessionId, bet - 1)
        if (result) res.json(bet - 1)
        else res.status(401).json('bet down error')
    } 
    else res.json(bet)
}


// SPIN

exports.spin = async (req, res) => {
    const score = scoreGenerator.getScore()
    const board = scoreGenerator.getBoard(score)

    const sessionId = req.params.sessionId
    const sessionData = await getSession(sessionId)

    const bet = parseInt(sessionData.bet)
    const spin = await addSpin(sessionId, score, bet)
    const coins = await setCoins(sessionId, parseInt(sessionData.coins - bet))
    const win = await setWin(sessionId, parseInt(sessionData.win + parseInt(spin.score) * bet))

    console.log(`session: ${sessionId}, score: ${score}, bet: ${bet} `)
    console.log(board)

    res.json({
        board: board,
        coins: coins,
        bet: bet,
        win: win
    })
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