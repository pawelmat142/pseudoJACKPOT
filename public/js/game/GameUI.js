import config from '../../gameConfig.json' assert { type: "json" }
import { DisplayItem } from './DisplayItem.js'
import { Modal } from '../Modal.js'

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1)
}

export class GameUI {


    constructor(sessionManager, gameBoard, httpClient, audioManager) {

        this.session = sessionManager
        this.board = gameBoard
        this.http = httpClient
        this.audio = audioManager.it
        this.audioManager = audioManager

        this.modal = new Modal(this.audio, this.transferAction)

        this.coins = new DisplayItem(config.DOMids.coins, 100, this.audio)
        this.bet = new DisplayItem(config.DOMids.bet, 1, this.audio)
        this.win = new DisplayItem(config.DOMids.win, 0, this.audio)
        this.topScreen = new DisplayItem(config.DOMids.topScreen, '000', this.audio)
        
        this.spinButton = document.getElementById('spin')
        this.autoplayButton = document.getElementById('autoplay')
        this._autoplay = false

        this.constrolsInit()
        this.session.init().then(state => this.setDisplayState(state))
    }



    set autoplay(input) {
        this._autoplay = input
        if (this._autoplay) this.autoplayButton.classList.add('active')
        else this.autoplayButton.classList.remove('active')
    }


    get autoplay() { return this._autoplay }



    // INIT

    constrolsInit = () => {
        
        document.getElementById('scores').addEventListener('click', this.onScores)
        document.getElementById('reset').addEventListener('click', this.onReset)
        document.getElementById('autoplay').addEventListener('click', this.onAutoplay)
        document.getElementById('transfer').addEventListener('click', this.onTransfer)
        
        document.getElementById('betUp').addEventListener('click', this.onBetUp)
        document.getElementById('betDown').addEventListener('click', this.onBetDown)
        
        document.getElementById('spin').addEventListener('click', this.onSpin)
        this.board.board.addEventListener('click', this.onSpin)
        window.addEventListener('keydown', (event) => event.key === ' ' ? this.onSpace():{})
    }



    setDisplayState = (state) => {
        this.coins.set(state.coins)
        this.bet.set(state.bet)
        this.win.set(state.win)
        this.board.bet = state.bet
        this.board.spinFlag = true
    }



    // BUTTONS

    onBetUp = async () => {
        const newBet = await this.http.betUp()
        if (newBet !== this.bet.get()) {
            this.audio.betUp.play()
            this.bet.set(newBet)
            this.board.bet = newBet
        }
    }
    
    

    onBetDown = async () => {
        const newBet = await this.http.betDown()
        if (newBet !== this.bet.get()) {
            this.audio.betDown.play()
            this.bet.set(newBet)
            this.board.bet = newBet
        } else this.audio.clickFail.play()
    }
    


    onReset = async () => {
        if (this.board.spinFlag) {
            this.board.spinFlag = false
            this.audio.reset.play()
            const sessionData = await this.session.reset()
            this.setDisplayState(sessionData)
        } else this.audio.clickFail.play()
    }



    onScores = async () => window.location.href = 'scores-page'



    onAutoplay = async () => {
        this.autoplay = !this.autoplay
        if (this.autoplay) for(;;) if (this.autoplay) {
            if (!await this.onSpin()) break
        } else break
    }
    

    
    onSpin = async () => {
        if (this.board.spinFlag) {
            let spinPromises = this.spinStart()
            try {
                let spinResponse = await this.http.spin()
                if (spinResponse === 204) this.notEnoughCoins()
                else await this.spinStop(spinPromises, spinResponse) 
                return true
            } catch (error) {
                this.errorSpinStop()
                console.log(error)
            }
        } else this.audio.clickFail.play() 
    }



    // SPIN ACTIONS

    onSpace = () => this.autoplayButton.classList.contains('active') ? this.onAutoplay() : this.onSpin()



    spinStart = () => {
        this.audio.spin.play()
        this.audio.spinning.play()
        this.spinButton.classList.add('active') 
        this.board.spinFlag = false
        return this.board.spinStart()
    }
    


    spinStop = async (spinPromises, score) => {
        this.board.setCurrentState(score)

        let win = this.win.get()
        let coins = this.coins.get() - this.bet.get()
        this.coins.animateTo(coins, config.ui.transferTime, false)

        
        await sleep(config.spin.spinTime) 
        await this.board.spinStop(spinPromises)

        this.audio.spinning.pause()
        this.audio.spinning.load()

        await this.board.highlightScore(this.topSceenShow)

        if (score !== 0) {
            win += this.bet.get()*score
            await sleep(300)
            this.topScreen.animateTo(0, config.ui.transferTime, false)
            let a = score > 20 ? 5 : 2
            await this.win.animateTo(win, config.ui.transferTime*a, true)
        }

        this.spinButton.classList.remove('active')
        this.board.spinFlag = true
    }
    

    errorSpinStop = () => {
        this.audio.clickFail.play()
        this.audio.spinning.pause()
        this.audio.spinning.load()
        this.board.columns.forEach((col, i) => col.stopFlag = true)
        this.spinButton.classList.remove('active')
        this.board.spinFlag = true
    }



    notEnoughCoins = () => {
        this.errorSpinStop()
        this.coins.active()
        this.coins.deactive()
        this.autoplay = false
        this.modal.open()
        this.modal.setHeader("not enough coins")
    }



    topSceenShow = (_value) => {
        const value = parseInt(this.topScreen.get()) +  _value * this.bet.get()
        this.topScreen.set(value)
        this.topScreen.active()
        this.topScreen.deactive()
    }




    // transfer actions

    onTransfer = async () => {
        this.modal.open()
        this.modal.setHeader(`Transfer WIN > COINS`)
        this.modal.addOkButton()
        this.modal.put(this.transferModalInput())
    }



    transferModalInput = () => {
        const input = document.createElement('input')
        input.classList.add('transfer-input')
        if (this.win.get() < 100) input.value = this.win.get()
        else input.value = 100
        input.type = 'number'
        input.addEventListener('input', (event) => this.onInputTransfer(event, input))
        return input
    }



    transferAction = async (e) => {
        this.board.spinFlag = false
        const input = document.getElementById('modal').querySelector('input')
        const response = await this.http.transfer({"transfer": input.value})
        this.modal.close()
        if (parseInt(response.win) !== this.win.get()) {
            this.coins.animateTo(response.coins, config.ui.transferTime, true)
            await this.win.animateTo(response.win, config.ui.transferTime, false)
        }
        this.board.spinFlag = true
    }



    onInputTransfer = (e, input) => {
        if (input.value > this.win.get()) input.value = this.win.get()
        if (input.value < 0) input.value = 0
    }

}


const sleep = (ms) => new Promise(resolve => setTimeout(()=>resolve(), ms))