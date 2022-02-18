module.exports = async () => {

    const {db_config} = require('../config')
    const knex = require('knex')(db_config)

    try { return await knex('sessions').insert(newSession) }
    catch (err) { return err }
    finally { knex.destroy() }
}

const newSession = {
    coins: 100,
    bet: 1,
    win: 0
}