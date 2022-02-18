module.exports = async (sessionId) => {

    const {db_config} = require('../config')
    const knex = require('knex')(db_config)

    try {
        const rows = await knex
            .from('sessions')
            .select('coins', 'bet', 'win')
            .where('id', sessionId)
        return rows[0]
    }

    catch (err) { return err }

    finally { knex.destroy() }
}
