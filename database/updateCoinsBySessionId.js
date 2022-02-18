module.exports = async (sessionId, coins) => {
    const {db_config} = require('../config')
    const knex = require('knex')(db_config)
    let result = false

    const rows = await knex('sessions')
        .where('id', sessionId)
        .update('coins', coins)

    if (rows) result = coins

    knex.destroy() 
    return result
}
