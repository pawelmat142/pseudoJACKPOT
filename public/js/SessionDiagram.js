
export class SessionDiagram {

    constructor(canvas, id) {

        this.id = id
        this.canvas = canvas
        this.ctx = canvas.getContext('2d')

        this.isOpen = false
        this.drawn = false

        this.isWin = true
        this.isCoins = true
        this.isBet = true

        this.resize()
        window.addEventListener('resize', this.resize)
    }


    open = () => {
        this.isOpen = true
        this.resize()
    } 
    

    close = () => {
        this.isOpen = false
        this.resize()
    } 


    resize = () => {
        this.canvas.width = getWidth()
        this.canvas.height = this.isOpen ? getHeight() : 0
        if (!!this.steps) this.printSteps(this.steps)
    }


    drawSpins = (spins) => {
        if (Array.isArray(spins)) {
            if (!this.drawn) {
                this.drawn = true
                this.steps = getSteps(spins)
            }
            this.printSteps(this.steps)
        } else console.log('not array')
    }


    printSteps = (steps) => {
        if (this.isWin) this.printWin(steps.map(step => step.win))
        if (this.isCoins) this.printCoins(steps.map(step => step.coins))

    } 
    
    printWin = (wins) => {
        const height = getHeight()
        const stepX = getWidth() / (wins.length-1)
        const stepY = height/max(wins)
        this.ctx.moveTo(0, height)
        this.ctx.strokeStyle = '#008000'
        this.ctx.lineWidth = 4
        wins.forEach((win, i) => this.ctx.lineTo(i*stepX, height - (win * stepY)))
        this.ctx.stroke()
    }
    
    printCoins = (coinsArr) => {
        const height = getHeight() / 2
        const stepX = getWidth() / (coinsArr.length-1)
        const stepY = height/max(coinsArr)
        this.ctx.moveTo(0, height)
        this.ctx.strokeStyle = '#0077d8'
        this.ctx.lineWidth = 2
        coinsArr.forEach((coins, i) => this.ctx.lineTo(i*stepX, getHeight() - (coins * stepY)))
        this.ctx.stroke()
    }
    


}


const getSteps = (spins) => {
    let currentCoins = 100
    let currentWin = 0
    const steps = spins.map(spin => {
        currentCoins = spin.bet < 0 ? currentCoins + spin.score : currentCoins - spin.bet
        currentWin += spin.bet * spin.score
        return {
            coins: currentCoins,
            bet: spin.bet,
            win: currentWin
        }
    })
    const zero = { coins: 100, bet: 1, win: 0 }
    return [zero, ...steps]
}


const max = (arr) => Math.max(...arr)


const getWidth = () => {
    if (window.innerWidth > 1920) return parseInt(1920 * 0.96)
    else return parseInt(window.innerWidth * 0.96)
} 

const getHeight = () => window.innerWidth > 768 ? 500 : 200