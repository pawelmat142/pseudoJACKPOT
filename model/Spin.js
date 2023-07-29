const mongoose = require('mongoose')

const spinSchema = new mongoose.Schema({
    session_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Session'
    },
    score: {
        type: Number,
    },
    bet: {
        type: Number,
    }
})

const Spin = mongoose.model('Spin', spinSchema)

module.exports = Spin