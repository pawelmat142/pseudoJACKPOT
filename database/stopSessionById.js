// finds session by id in db and sets stop time
// returns true if succes, false otherwise

module.exports = async (sessionId) => {

    const {db_config} = require('../config')
    const knex = require('knex')(db_config)

    let result = false

    const rows = await knex('sessions')
        .where('id', sessionId)
        .update('stop_time', new Date())

    console.log(rows)

    if (rows) result = true

    knex.destroy()

    return result
}
