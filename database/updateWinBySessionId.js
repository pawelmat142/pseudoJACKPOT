module.exports = async (sessionId, win) => {
    const {db_config} = require('../config')
    const knex = require('knex')(db_config)
    let result = false

    const rows = await knex('sessions')
        .where('id', sessionId)
        .update('win', win)

    if (rows) result = win
    
    knex.destroy()
    return result
}
