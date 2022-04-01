
const config = require('../public/gameConfig.json')
const query = require('../database/Query')

exports.home = (req, res) => {

    let columns = []
    for(let c = 0; c < config.board.cols; c++) {
        const column = []
        for(let r = 0; r < config.board.rows+1; r++)
            column.push(r)
        columns.push(column)
    }

    res.render('home', {
        controls: config.DOMids.controls,
        columns: columns,
    })
}


exports.scoresPage = async (req, res, next) => res.render('scoresPage')


exports.sessionSpins = async (req, res, next) => {
    try {
        const sessionId = req.params.sessionId
        const spins = await query.getSpinsBySessionId(sessionId)
        if (spins) res.json(spins)
        else res.status(201).json({})
    } catch (error) { next(error) }
}