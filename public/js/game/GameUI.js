import config from '../../gameConfig.json' assert { type: "json" }
import { DisplayItem } from './DisplayItem.js'
import { Modal } from '../Modal.js'

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1)
}

export class GameUI {

    constructor(gameBoard, httpClient) {

        this.board = gameBoard
        this.http = httpClient

        this.modal = new Modal()

        this.coins = new DisplayItem(config.DOMids.coins, 100)
        this.bet = new DisplayItem(config.DOMids.bet, 1)
        this.win = new DisplayItem(config.DOMids.win, 0)

        this.constrolsInit()
        this.sessionInit()

    }


    constrolsInit = () => {
        for (let item in config.DOMids.controls) 
            document.getElementById(config.DOMids.controls[item])
                .addEventListener('click', 
                () => eval(`this.on${item.capitalize()}()`))
    }

    sessionInit = async () => {
        let sessionId = localStorage.getItem('sessionId')
        if (!sessionId) 
            localStorage.setItem('sessionId', await this.http.newSession())

        const sessions = localStorageSetSessions()
        console.log(sessions)

        this.setDisplayState(await this.http.getSessionData())
    }

    onBetUp = async () => this.bet.set(await this.http.betUp())
    
    onBetDown = async () => this.bet.set(await this.http.betDown())
    

    onTransfer = async () => {
        console.log('ontransfer')

        this.modal.open()

    }


    onReset = async () => {
        const res = await this.http.stopSession()
        if (res === 'ok') {
            const sessionId = await this.http.newSession()
            localStorage.setItem('sessionId', sessionId)
            this.setDisplayState(await this.http.getSessionData())
        }
    }


    setDisplayState = (state) => {
        this.coins.set(state.coins)
        this.bet.set(state.bet)
        this.win.set(state.win)
    }


    onSpin = async () => {
        if (!this.board.isRolling) {
            this.board.start()
            const response = await this.http.spin()
    
            this.board.setNewState(response.board)
            this.coins.set(response.coins)
            
            setTimeout(() => {
                this.board.stop()
                this.win.set(response.win)
            }, 2000)
        }
    }
    
}

const localStorageSetSessions = () => {
    const sessionId = localStorage.getItem('sessionId')
    let sessions = localStorage.getItem('sessions')
    if (sessions) {
        sessions = sessions.split(',')
        const isSessionInLocalStorageArr = () => (sessions.indexOf(sessionId) !== -1)
        if (!isSessionInLocalStorageArr()) {
            let newSessions = [...sessions]
            newSessions.push(sessionId)
            localStorage.setItem('sessions', newSessions)
        }
        return localStorage.getItem('sessions').split(',')
    }

    else localStorage.setItem('sessions', sessionId)
    return localStorage.getItem('sessions').split(',')
}

