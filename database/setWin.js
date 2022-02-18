module.exports = async (sessionId, win) => {

    const {db_config} = require('../config')
    const knex = require('knex')(db_config)

    try {
        await knex('sessions')
            .where('id', sessionId)
            .update('win', win)
        return win
    }
    
    catch (err) { return err }

    finally { knex.destroy() }
}
