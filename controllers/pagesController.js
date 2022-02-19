
const config = require('../public/gameConfig.json')

exports.home = (req, res) => {

    let columns = []
    for(let c = 0; c < config.board.cols; c++) {
        const column = []
        for(let r = 0; r < config.board.rows+1; r++)
            column.push(`r${r}-c${c}`)
        columns.push(column)
    }


    res.render('home', {
        controls: config.DOMids.controls,
        columns: columns,
    })
}