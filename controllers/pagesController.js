
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

    // const sessionsIds = req.body.data.split(',')
    // try{
    //     if (Array.isArray(sessionsIds) && sessionsIds.length>0) {
    //         const promises = sessionsIds.map(async id => query.getSessionById(id))
    //         const sessions = await Promise.all(promises)
    //         let sessionsOnPage = []
    //         if (Array.isArray(sessions) && sessions.length>0) {
    //             sessions.forEach(async session => {
    //                 let totalWin = 0
    //                 const spins = await query.getSpinsBySessionId(session.id)
    //                 if (!!spins) spins.forEach(spin => totalWin += spin.bet * spin.score)
    //                 const sessionOnPage = {
    //                     id: session.id,
    //                     date: new Date(session.start_time).toLocaleDateString(),
    //                     start: new Date(session.start_time).toLocaleTimeString(),
    //                     stop: new Date(session.stop_time).toLocaleTimeString(),
    //                     totalCoins: 100,
    //                     totalWin: totalWin
    //                 }
    //                 sessionsOnPage.unshift(sessionOnPage)
    //             })
    //             console.log(sessionsOnPage.length)
    //             res.render('scoresPage', {sessions: sessionsOnPage})
    //         } else throw new Error('scores page error')


    //     } else throw new Error('scores page error')
    // } catch(error){ next(error) }


exports.sessionSpins = async (req, res, next) => {
    try {
        const sessionId = req.params.sessionId
        const spins = await query.getSpinsBySessionId(sessionId)
        if (spins) res.json(spins)
        else res.status(201).json({})
    } catch (error) { next(error) }
}