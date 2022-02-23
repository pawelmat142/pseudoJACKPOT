
export class AudioManager {
    
    constructor () {

        this.spinning = new Audio(`./audio/smp7.mp3`)

        this.spin = new Audio(`./audio/smp8.mp3`)
        this.spin.volume = 0.6

        this.moneyTransfer = new Audio(`./audio/moneyTransfer.mp3`)

        this.money = new Audio(`./audio/money.mp3`)
        this.money.volume = 0.6

        this.highlights = new AudioArray('smp3')

        this.highlightAll = new AudioArray('smp9')

        this.betUp = new AudioArray('betup')
        this.betUp.volume = 0.6
        
        this.betDown = new AudioArray('betdown')
        this.betDown.volume = 0.4

        this.colsStop = new AudioArray('smp10')

        this.openModal = new Audio(`./audio/smp11.mp3`)
        this.openModal.volume = 0.6
        this.closeModal = new Audio(`./audio/smp1.mp3`)
        this.closeModal.volume = 0.6

    }
    
}

class AudioArray {

    constructor(filename) {
        this.path = `./audio/${filename}.mp3`
        this.arr5 = [1,2,3,4,5]
        this.array = this.arr5.map(x => new Audio(this.path))
        this.counter = 0
    }

    play = () => {
        this.array[this.counter].play()
        this.counter++
        if (this.counter > 4) this.counter = 0
    }

}
