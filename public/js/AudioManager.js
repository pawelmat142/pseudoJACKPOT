
import config from '../gameConfig.json' assert { type: "json" }

export class AudioManager {
    
    constructor (vol) {

        this._volume = vol || 1

        this.dir = `./audio/`

        this.it = {
            spinning: new Audio(`${this.dir}spinning.mp3`),
            spin: new Audio(`${this.dir}spin.mp3`),
            moneyTransfer: new Audio(`${this.dir}moneyTransfer.mp3`),
            money: new Audio(`${this.dir}money.mp3`),
            notEnough: new Audio(`${this.dir}notEnough.mp3`),
            openModal: new Audio(`${this.dir}openModal.mp3`),
            closeModal: new Audio(`${this.dir}closeModal.mp3`),
            reset: new Audio(`${this.dir}notEnough.mp3`),
            highlights: new AudioArray(`${this.dir}highlights.mp3`, this._volume),
            highlightsAll: new AudioArray(`${this.dir}highlightsAll.mp3`, this._volume),
            betUp: new AudioArray(`${this.dir}betUp.mp3`, this._volume),
            betDown: new AudioArray(`${this.dir}betDown.mp3`, this._volume),
            colsStop: new AudioArray(`${this.dir}colsStop.mp3`, this._volume),
            changeVolume: new AudioArray(`${this.dir}changeVolume.mp3`, this._volume),
            clickFail: new AudioArray(`${this.dir}clickFail.mp3`, this._volume)
        }

        this.init = {
            spinning: 1,
            spin: 0.4,
            moneyTransfer: 1,
            money: 1,
            notEnough: 1,
            openModal: 0.4,
            closeModal: 0.4,
            reset: 1,
            highlights: 1,
            highlightsAll: 1,
            betUp: 0.6,
            betDown: 0.6,
            colsStop: 1,
            changeVolume: 1,
            clickFail: 1
        }
        this.setVolume(this._volume)
    }

    
    get volume() {
        return this._volume
    }


    setVolume = (vol) => {
        this._volume = vol
        for (let soundName in this.it) {
            // console.log(eval(`this.it.${soundName}.volume`))
            let _init = eval(`this.init.${soundName}`)
            eval(`this.it.${soundName}`).volume = vol*_init*config.ui.volume
        }
    }


    volumeUp = () => {
        let _volume = this.volume + 0.05
        if (_volume > 1) {
            _volume = 1
            this.it.clickFail.play()
        }else this.it.changeVolume.play()
        this.setVolume(_volume)
        return _volume
    }
    
    
    volumeDown = () => {
        let _volume = this.volume - 0.05
        if (_volume < 0) _volume = 0
        this.it.changeVolume.play()
        this.setVolume(_volume)
        return _volume
    }
    
}

class AudioArray {

    constructor(src, vol) {
        this.arr5 = [1,2,3,4,5]
        this.array = this.arr5.map(x => new Audio(src))
        this.counter = 0
        this._volume = vol || 1
    }

    play = () => {
        this.array[this.counter].play()
        this.counter++
        if (this.counter > 4) this.counter = 0
    }

    get volume() {
        return this.array[0].volume
    }

    set volume(vol) {
        this._volume = vol
        this.array.forEach(x => x.volume = vol)
    }


}
