// selects session by id and returns whole row or false

module.exports = async (sessionId) => {

    const {db_config} = require('../config')
    const knex = require('knex')(db_config)

    let result = false

    const rows = await knex
        .from('sessions')
        .select('id', 'start_time', 'stop_time', 'coins', 'bet', 'win')
        .where('id', sessionId)
        
    if (Array.isArray(rows) && !!rows.length) result = rows[0]

    knex.destroy()

    return result

}