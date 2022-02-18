export class AudioManager {
    
    constructor () {
        console.log('audio manager init')

        this.path = ('./audio/')

        this.smp1 = new Audio(`${this.path}sample-1.mp3`)

    }

    play = () => {
        start(this.smp1)
    }

    click = (duration) => {
        this.smp1.play()
        setTimeout(() => {
            this.smp1.pause()
            this.smp1.load()
        }, duration)
    }

    
}


const start = (track) => {
    track.play()
    stop(track)
}

const stop = (input) => {
    setTimeout(() => {
        input.pause()
        input.load()
    },500)
}