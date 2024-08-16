const Session = require('../model/Session')
const Spin = require('../model/Spin')

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
        const sessionId = req.params.sessionId
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
        const update = await Session.findByIdAndUpdate(sessionId, { stop_time: new Date() })
        if (!update) throw new Error('update session error')
        res.json(true)
    } catch (error) { res.status(400).json({message: error.message}) }
}


const newSession = async () => {
    const session = getNewSession()
    const result = await session.save()
    return result._id.toString()
}


const getSessionById = async (sessionId) => {
    const session = await Session.findById(sessionId);
    if (!session) throw new Error('Get session by id error')
    return session
}


const getLastSpinBySessionId = async (sessionId) => {
    const spins = await Spin.findById(sessionId)
    return spins ? spins.pop() : null
}


const getNewSession = () => {
    const session = new Session()
    session.start_time = new Date()
    session.stop_time = new Date()
    session.coins = 100
    session.bet = 1
    session.win = 0
    return session
}







