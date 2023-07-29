const mongoose = require('mongoose')

const sessionSchema = new mongoose.Schema({
    start_time: {
        type: Date,
    },
    stop_time: {
        type: Date,
    },
    coins: {
        type: Number
    },
    bet: {
        type: Number
    },
    win: {
        type: Number
    }
})

const Session = mongoose.model('Session', sessionSchema)

module.exports = Session