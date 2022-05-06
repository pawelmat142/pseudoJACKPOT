const scoreGenerator = require('../modules/ScoreGenerator')
const sessionController = require('./sessionController')
const {db_config} = require('../config')

// BET

exports.betUp = async (req, res) => {
    try {
        const sessionId = req.params.sessionId
        const sessionData = req.data
        let bet = parseInt(sessionData.bet)
        await updateBetBySessionId(sessionId, bet + 1)
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
            await updateBetBySessionId(sessionId, bet - 1)
            res.json(bet - 1)
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
        if (transfer <= sessionData.win) {
            let win = await updateWinBySessionId(sessionId, sessionData.win - transfer) 
            let coins = await updateCoinsBySessionId(sessionId, sessionData.coins + transfer)
            if (win && coins || parseInt(win) === 0) {
                const spin = await addSpin(sessionId, transfer, -1)
                console.log(`session: ${sessionId} - transfering: ${transfer} coins`)
                if (spin) res.json({
                    coins: coins,
                    bet: sessionData.bet,
                    win: win
                })
                else throw new Error('spin error')
            } else throw new Error('transfer - pdate win, coins error')
        } else throw new Error('not enough win')
    }
    catch (error) { res.status(400).json({message: error.message}) }
}



// SPIN

exports.spin = async (req, res) => {
    try {
        const time = Date.now()
        console.log('start spin')
        const score = scoreGenerator.getScore()
        console.log('score', score)
        console.log(Date.now() - time, 'ms')
        const sessionId = req.params.sessionId
        const sessionData = req.data
        const bet = parseInt(sessionData.bet)
        if ((sessionData.coins < sessionData.bet)) {
            res.status(204).json({board: "not enough coins"})
            return
        }
        const spin = await addSpin(sessionId, score, bet)
        console.log('spin', spin)
        console.log(Date.now() - time, 'ms')
        if (!spin) throw new Error('add spin error')
        const coins = await updateCoinsBySessionId(sessionId, parseInt(sessionData.coins - bet))
        console.log('coins', coins)
        console.log(Date.now() - time, 'ms')
        if (typeof coins !== 'number') throw new Error('update coins error')
        const win = await updateWinBySessionId(sessionId, parseInt(sessionData.win + parseInt(spin.score) * bet))
        console.log('win', win)
        console.log(Date.now() - time, 'ms')
        if (typeof win !== 'number') throw new Error('update win error')
        const update = await sessionController.updateSession(sessionId)
        console.log('update', update)
        console.log(Date.now() - time, 'ms')
        
        res.status(200).json({
            coins: coins,
            bet: bet,
            win: win,
            score: score
        })
        console.log(`session: ${sessionId}, score: ${score}, bet: ${bet} `)
        console.log(Date.now() - time, 'ms')
    }
    catch (error) {
        console.log(error)
        res.status(400).json({message: error.message})
    }
}


const updateBetBySessionId = async (sessionId, bet) => {
    const knex = require('knex')(db_config)
    const row = await knex('sessions')
        .where('id', sessionId)
        .update('bet', bet)
    knex.destroy()
    if (row) return bet
    else throw new Error('update bet error')
}

const updateWinBySessionId = async (sessionId, win) => {
    const knex = require('knex')(db_config)
    const rows = await knex('sessions')
        .where('id', sessionId)
        .update('win', win)
    knex.destroy()
    return rows? win : false
}

const updateCoinsBySessionId = async (sessionId, coins) => {
    const knex = require('knex')(db_config)
    const rows = await knex('sessions')
        .where('id', sessionId)
        .update('coins', coins)
    knex.destroy()
    return rows? coins : false
}

const addSpin = async (_sessionId, _score, _bet) => {
    const spin = {
        session_id: _sessionId,
        score: _score,
        bet: _bet
    }
    const knex = require('knex')(db_config)
    const spinId = await knex('spins').insert(spin)
    knex.destroy()
    return spinId? spin : false
}
