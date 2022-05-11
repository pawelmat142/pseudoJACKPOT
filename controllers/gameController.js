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
        const sessionData = req.data
        const score = scoreGenerator.getScore()

        if ((sessionData.coins < sessionData.bet)) {
            res.status(204).json({board: "not enough coins"})
            return
        }

        let a = updateStateServerSide(score, sessionData)
        res.status(200).json(score)
    }
    catch (error) {
        console.log(error)
        res.status(400).json({message: error.message})
    }
}


const updateStateServerSide = (score, sessionData) => new Promise(async (resolve, reject) => {

    sessionData.coins -= sessionData.bet
    sessionData.win += score*sessionData.bet
    sessionData.stop_time = new Date().toLocaleDateString()

    const knex = require('knex')(db_config)

    const row = await knex('sessions')
        .where('id', sessionData.id)
        .update('coins', sessionData.coins)
        .update('win', sessionData.win)

    knex.destroy()

    console.log(`sessionId: ${sessionData.id}, score: ${score}, coins: ${sessionData.coins}, win: ${sessionData.win}`)

    if (row) resolve()
    else reject()

})


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
