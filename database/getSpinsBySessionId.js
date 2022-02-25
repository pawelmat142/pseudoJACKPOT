// selects session by id and returns whole row or false

module.exports = async (sessionId) => {

    const {db_config} = require('../config')
    const knex = require('knex')(db_config)

    let result = false

    const rows = await knex
        .from('spins')
        .select('id', 'session_id', 'time', 'score', 'bet')
        .where('session_id', sessionId)

    if (Array.isArray(rows) && rows.length) result = rows

    knex.destroy()

    return result

}