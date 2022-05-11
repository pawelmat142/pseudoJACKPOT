const {db_config} = require('../config')


// SESSION

exports.sessionData = async (req, res, next) => {
    try {
        const sessionId = req.params.sessionId
        if (!sessionId) throw new Error('session id error')
        const data = await getSessionById(sessionId)
        if (!data) throw new Error('session data error')
        req.data = data
        next()
    }
    catch (error) { res.status(400).json({message: error.message}) }
}

exports.newSession = async (req, res) => {
    try {
        const sessionId = await newSession()
        res.json(sessionId)
    }
    catch (error) { res.status(400).json({message: error.message}) }
}


exports.getSession = async (req, res) => {
    try {
        const sessionId = parseInt(req.params.sessionId)
        let session = await getSessionById(sessionId)
        if (session) {
            const lastSpin = await getLastSpinBySessionId(sessionId)
            if (lastSpin) {
                const minutesAgo = parseInt( ( Date.now() - new Date(lastSpin.time).getTime() ) / 1000 / 60 )
                if (minutesAgo > 10) {
                    const newSessionId = await newSession()
                    session = await getSessionById(newSessionId)
                }
            }
            res.json(session)
        } else res.json(await newSession())
    }
    catch (error) { res.status(400).json({message: error.message}) }
}


exports.getSessions = async (req, res) => {
    try {
        const sessionsIds = req.params.sessionsIds.split(',')
        const promises = sessionsIds.map(async id => getSessionById(id))
        const result = await Promise.all(promises)
        res.status(200).json(result)
    } catch (error) { 
        console.log(error)
        res.status(400).json({message: error.message}) 
    }
}


exports.stopSession = async (req, res) => {
    try {
        const sessionId = req.params.sessionId
        const update = await updateSessionById(sessionId)
        if (!update) throw new Error('update session error')
        res.json(true)
    } catch (error) { res.status(400).json({message: error.message}) }
}



exports.updateSession = async (newSessionObj) => {
    console.log(newSessionObj.session_id)
    console.log(newSessionObj.bet)
    console.log(newSessionObj.score)
    // let newCoins = 
    // const result = await updateSessionById(sessionId)
    // return result
    return true 
}

// exports.updateSession = async (sessionId) => {
//     const result = await updateSessionById(sessionId)
//     return result
// }

const updateSessionById = async (sessionId) => {
    const knex = require('knex')(db_config)
    const rows = await knex('sessions')
        .where('id', sessionId)
        .update('stop_time', new Date().toLocaleDateString())
    knex.destroy()
    return rows
}


const newSession = async () => {
    const knex = require('knex')(db_config)
    const sessionId = (await knex('sessions').insert(getNewSession())).pop()
    knex.destroy()
    if (!sessionId) throw new Error('Get new session id error')
    return sessionId
}


const getSessionById = async (sessionId) => {
    const knex = require('knex')(db_config)
    const session = (await knex
        .from('sessions')
        .select('id', 'start_time', 'stop_time', 'coins', 'bet', 'win')
        .where('id', sessionId)).pop()
    knex.destroy()
    if (!session) throw new Error('Get session by id error')
    return session
}


const getLastSpinBySessionId = async (sessionId) => {
    const knex = require('knex')(db_config)
    const spin = (await knex
        .from('spins')
        .select('id', 'session_id', 'time')
        .where('session_id', sessionId)).pop()
    knex.destroy()
    return spin
}


const getNewSession = () => {
    return {
        start_time: new Date().toLocaleDateString(),
        stop_time: new Date().toLocaleDateString(),
        coins: 100,
        bet: 1,
        win: 0
    }
}







