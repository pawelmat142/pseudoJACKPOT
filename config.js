require('dotenv').config()

module.exports = {

    port: process.env.PORT || 3000, 

    db_config: {
        client: 'mysql2',
        connection: {
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'spins'
        }
    }
    
}
