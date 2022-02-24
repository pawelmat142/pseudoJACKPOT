
import config from '../gameConfig.json' assert { type: "json" }


export class AudioManager {
    
    constructor (vol) {

        this._volume = vol || 1

        this.it = {
            spinning: new Audio(`./audio/spinning.mp3`),
            spin: new Audio(`./audio/spin.mp3`),
            moneyTransfer: new Audio(`./audio/moneyTransfer.mp3`),
            money: new Audio(`./audio/money.mp3`),
            notEnough: new Audio(`./audio/notEnough.mp3`),
            openModal: new Audio(`./audio/openModal.mp3`),
            closeModal: new Audio(`./audio/closeModal.mp3`),
            reset: new Audio(`./audio/notEnough.mp3`),
            highlights: new AudioArray('highlights', this._volume),
            highlightsAll: new AudioArray('highlightsAll', this._volume),
            betUp: new AudioArray('betUp', this._volume),
            betDown: new AudioArray('betDown', this._volume),
            colsStop: new AudioArray('colsStop', this._volume),
            changeVolume: new AudioArray('changeVolume', this._volume),
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
        if (_volume > 1) _volume = 1
        this.setVolume(_volume)
        this.it.changeVolume.play()
        return _volume
    }
    
    volumeDown = () => {
        let _volume = this.volume - 0.05
        if (_volume < 0) _volume = 0
        this.setVolume(_volume)
        this.it.changeVolume.play()
        return _volume
    }
    
}

class AudioArray {

    constructor(filename, vol) {
        this.path = `./audio/${filename}.mp3`
        this.arr5 = [1,2,3,4,5]
        this.array = this.arr5.map(x => new Audio(this.path))
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
