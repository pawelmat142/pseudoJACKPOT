module.exports = async (sessionId, coins) => {

    const {db_config} = require('../config')
    const knex = require('knex')(db_config)

    try {
        await knex('sessions')
            .where('id', sessionId)
            .update('coins', coins)
        return coins
    }
    
    catch (err) { return err }

    finally { knex.destroy() }
}
