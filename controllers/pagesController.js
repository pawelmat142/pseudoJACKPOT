const {db_config} = require('../config')
const path = require('path')

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
    const knex = require('knex')(db_config)
    const rows = await knex
        .from('spins')
        .select('id', 'session_id', 'time', 'score', 'bet')
        .where('session_id', sessionId)
    knex.destroy()
    return rows.length > 0 ? rows : false
}