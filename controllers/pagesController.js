const path = require('path')

const Session = require('../model/Session')
const Spin = require('../model/Spin')

exports.home = (req, res) => {
    const _path = path.resolve() + '/public/html/home.html'
    res.sendFile(_path)
}


exports.scoresPage = async (req, res) => {
    const _path = path.resolve() + '/public/html/scoresPage.html'
    res.sendFile(_path)
}


exports.sessionSpins = async (req, res) => {
    try {
        const sessionId = req.params.sessionId
        const spins = await getSpinsBySessionId(sessionId)
        if (spins) res.json(spins)
        else res.status(201).json({})
    } catch (error) { 
        console.error(error)
    }
}

const getSpinsBySessionId = async (sessionId) => {
    const result = await Spin.find({ session_id: sessionId })
    return result.length > 0 ? result : false
}