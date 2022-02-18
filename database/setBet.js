module.exports = async (sessionId, bet) => {

    const {db_config} = require('../config')
    const knex = require('knex')(db_config)

    try {
        await knex('sessions')
            .where('id', sessionId)
            .update('bet', bet)
        return bet
    }

    catch (err) { return err }

    finally { knex.destroy() }
}
