module.exports = async (_sessionId, _score, _bet) => {

    const {db_config} = require('../config')
    const knex = require('knex')(db_config)

    try {
        const spin = {
            session_id: _sessionId,
            score: _score,
            bet: _bet
        }

        await knex('spins').insert(spin)
        return spin
    }

    catch (err) { return err }
    
    finally { knex.destroy() }
}
