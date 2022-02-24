
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



exports.scoresPage = async (req, res, next) => {
    const sessionsIds = req.body.data.split(',')
    try{
        if (Array.isArray(sessionsIds) && sessionsIds.length>0) {
            const promises = sessionsIds.map(async id => query.getSpinsBySessionId(id))
            const sessionsSpins = await Promise.all(promises)
            if (Array.isArray(sessionsSpins) && sessionsSpins.length>0) {
                console.log(sessionsSpins)
                res.render('scoresPage', {
                    // sessions: sessionsSpins
                    sessions: sessionsSpins.map(session => session.map(spin => {
                        const time = new Date(spin.time)
                        spin.time = time.toLocaleTimeString()
                        spin.color = spin.score > 0 ? 'green' : 'red'
                        return spin
                    }))
                })
            } else throw new Error('scores page error')
        } else throw new Error('scores page error')
    }
    catch(error){ next(error) }
}