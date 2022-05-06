const express = require('express')


const connection = {
    client: 'mysql2',
    connection: {
        host: 'localhost',
        user: 'pseudojackpot',
        password: 'st*ZkPRfh}WQ(6!xx',
        database: 'spins'
    }
}

const knex = require('knex')(connection)

const spin = {
    session_id: 22,
    score: 22,
    bet: 22
}

const f = async () => {
    const spinId = await knex('spins').insert(spin)
    
    if (spinId) {
        console.log(spinId)
    }
    
}

f()


const port = 80

console.log(knex)

const app = express()

// routes
app.use('/', (req,res)=> {
    res.send('aaaa')
})

// server 
app.listen(port, () => console.log('listening on port: ' + port))
