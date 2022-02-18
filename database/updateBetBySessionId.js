

module.exports = async (sessionId, bet) => {

    const {db_config} = require('../config')
    const knex = require('knex')(db_config)

    let result = false

    const row = await knex('sessions')
        .where('id', sessionId)
        .update('bet', bet)

    if (row) result = bet

    knex.destroy()

    return result

}