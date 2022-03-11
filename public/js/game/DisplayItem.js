export class DisplayItem {

    constructor (DOMid, initValue, audio) {
        this.DOM = document.getElementById(DOMid)
        this.DOM.innerHTML = initValue
        this.value = initValue
        this.audio = audio
    }

    set = (newValue) => {
        this.DOM.innerHTML = newValue
        this.value = newValue
    }

    get = () => this.value

    
    animateTo = (_to, _duration, soundFlag) => {
        this.active()
        return new Promise(resolve => {
            const from = this.get()
            const to = parseInt(_to)
            const interval = parseInt(_duration) / Math.abs(to - from) 
            let a = setInterval(() => {
                if (soundFlag) this.audio.moneyTransfer.play()
                let step = 1
                if (Math.abs(to - from) > 500) step = 3
                if (Math.abs(to - from) > 1000) step = 10
                if (to > from) this.set(this.get()+step)
                if (to < from) this.set(this.get()-step)
                if ((to - from) > 0 && this.get() >= to || (to - from) < 0 && this.get() <= to) {
                    this.set(_to)
                    this.audio.moneyTransfer.pause()
                    if (soundFlag) this.audio.money.play()
                    clearInterval(a)
                    this.deactive()
                    resolve()
                }
            }, interval)
        })
    }

    active = () => this.DOM.classList.add("active")
    
    deactive = () => setTimeout(() => this.DOM.classList.remove("active"), 100)
    
}