module.exports = async (sessionId) => {

    const {db_config} = require('../config')
    const knex = require('knex')(db_config)

    try {
        await knex('sessions')
            .where('id', sessionId)
            .update('stop_time', new Date())
        return true
    }

    catch (err) { return err }

    finally { knex.destroy() }
}
