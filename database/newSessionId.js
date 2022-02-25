// generates new session data
// inserts new session in db 
// returns new session id as number or false

module.exports = async () => {

    const {db_config} = require('../config')
    const knex = require('knex')(db_config)

    let result = false

    const sessionId = await knex('sessions').insert(newSession)
    
    if (sessionId) result = sessionId.pop()

    knex.destroy()

    return result
}

const newSession = {
    coins: 100,
    bet: 1,
    win: 0
}