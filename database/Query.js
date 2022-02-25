
class Query {
    constructor() {
        this.addSpin = require('./addSpin')
        this.newSessionId = require('./newSessionId')
        this.getSessionById = require('./getSessionById')
        this.stopSessionById = require('./stopSessionById')
        this.updateCoinsBySessionId = require('./updateCoinsBySessionId')
        this.updateBetBySessionId = require('./updateBetBySessionId')
        this.updateWinBySessionId = require('./updateWinBySessionId')
        this.getLastSpinBySessionId = require('./getLastSpinBySessionId')
        this.getSpinsBySessionId = require('./getSpinsBySessionId')
        this.hasSession = require('./hasSession')
    }
}

module.exports = new Query()
