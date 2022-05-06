require('dotenv').config()

module.exports = {

    port: process.env.PORT || 3333,

    db_config: {
        client: 'mysql2',
        connection: {
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: 'spins'
        }
    }
    
}
