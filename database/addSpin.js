module.exports = async (_sessionId, _score, _bet) => {
    const {db_config} = require('../config')
    const knex = require('knex')(db_config)
    
    let result = false

    const spin = {
        session_id: _sessionId,
        score: _score,
        bet: _bet
    }

    const spinId = await knex('spins').insert(spin)

    if (spinId) result = spin

    knex.destroy()
    return result
}
