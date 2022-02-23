
import config from '../gameConfig.json' assert { type: "json" }


export class AudioManager {
    
    constructor (vol) {

        this._volume = vol || 1

        this.it = {
            spinning: new Audio(`./audio/smp7.mp3`),
            spin: new Audio(`./audio/smp8.mp3`),
            moneyTransfer: new Audio(`./audio/moneyTransfer.mp3`),
            money: new Audio(`./audio/money.mp3`),
            notEnough: new Audio(`./audio/smp13.mp3`),
            openModal: new Audio(`./audio/smp11.mp3`),
            closeModal: new Audio(`./audio/smp1.mp3`),
            highlights: new AudioArray('smp3', this._volume),
            highlightAll: new AudioArray('smp9', this._volume),
            betUp: new AudioArray('betup', this._volume),
            betDown: new AudioArray('betdown', this._volume),
            colsStop: new AudioArray('smp10', this._volume),
            changeVolume: new AudioArray('smp14', this._volume),
        }

        this.init = {
            spinning: 1,
            spin: 0.4,
            moneyTransfer: 1,
            money: 1,
            notEnough: 1,
            openModal: 0.4,
            closeModal: 0.4,
            highlights: 1,
            highlightAll: 1,
            betUp: 0.5,
            betDown: 0.5,
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



        // this.spinning = new Audio(`./audio/smp7.mp3`)
        // this.spinning.volume = this.volume * 0.6

        // this.spin = new Audio(`./audio/smp8.mp3`)
        // this.spin.volume = this.volume * 0.6

        // this.moneyTransfer = new Audio(`./audio/moneyTransfer.mp3`)

        // this.money = new Audio(`./audio/money.mp3`)
        // this.money.volume = this.volume * 0.6

        // this.highlights = new AudioArray('smp3')

        // this.highlightAll = new AudioArray('smp9')

        // this.betUp = new AudioArray('betup')
        // this.betUp.volume = this.volume * 0.6
        
        // this.betDown = new AudioArray('betdown')
        // this.betDown.volume = this.volume * 0.4

        // this.colsStop = new AudioArray('smp10')

        // this.openModal = new Audio(`./audio/smp11.mp3`)
        // this.openModal.volume = this.volume * 0.6
        // this.closeModal = new Audio(`./audio/smp1.mp3`)
        // this.closeModal.volume = this.volume * 0.6

    
}

class AudioArray {

    constructor(filename, vol) {
        this.path = `./audio/${filename}.mp3`
        this.arr5 = [1,2,3,4,5]
        this.array = this.arr5.map(x => new Audio(this.path))
        this.counter = 0
        this._volume = vol || 1
    }

    // set volume(vol) {
    //     this.volume = vol
    //     this.array.forEach(audio => audio.volume = vol)
    // }

    play = () => {
        this.array[this.counter].play()
        this.counter++
        if (this.counter > 4) this.counter = 0
    }

    get volume() {
        // this.array.forEach(x => console.log(x.volume))
        return this.array[0].volume
    }

    set volume(vol) {
        this._volume = vol
        this.array.forEach(x => x.volume = vol)
    }



}
