
import config from '../../gameConfig.json' assert { type: "json" }

export class GameColumn {

    constructor(state, board, index, boardGenerator, audioManager) {
        
        this.board = board
        this.index = index
        this.boardGenerator = boardGenerator
        this.audio = audioManager
        this.state = appendRandomItem(state, this.boardGenerator)  // np: ['A', 'S', 'W']

        this.rows = config.board.rows
        this.cols = config.board.cols
        this.minInterval = config.roll.minInterval
        this.maxInterval = config.roll.maxInterval
        this.stopInterval = config.roll.stopInterval
        this.step = config.roll.step
        this.highLightTime = config.spin.highLightTime    //should be same as css:root{--high-light-time}

        this.isRolling = false
        this.stopFlag = false

        this.columnInit()
    }


    get column() {
        return document.getElementById(config.DOMids.board)
            .querySelectorAll('.column')[this.index]
    }


    columnInit = async () => {
        this.itemsImages = await loadImages()
        this.state.forEach((item, i) => 
            this.column.querySelectorAll('.item-wrapper')[i]
            .appendChild(getImgElement(item, this.itemsImages)))
    }


    setState = (state) => this.state = [...state]


    // SPIN

    spinStart = async () => {
        this.stopFlag = false
        await sleep(this.index * config.roll.startDelay)
        const rollData =  await this.startRoll()
        return this.constRoll(rollData)
    }


    spinStop = async (spinPromise) => {
        await sleep(this.index*config.roll.stopDelay)
        this.stopFlag = true
        return await this.stopRoll(await spinPromise)
    }


    // ROLLING ANIMATION

    startRoll() {
        return new Promise(resolve => {
            let column = this.column
            let offset = 0
            let interval = this.maxInterval
            const delta = (this.maxInterval - this.minInterval) / 100 * this.step
    
            this.isRolling = true
    
            const frame = () => {
                if (offset >= (100/this.rows)) {
                    this.rollTrigger()
                    offset = 0
                }
                if (interval <= this.minInterval) resolve({"interval": interval, "offset": offset})
                else setTimeout(frame, interval)
                column.style.transform = `translateY(${offset}%)`
                interval -= delta
                offset += this.step
            }
            setTimeout(frame, interval)
        })
    }


    constRoll(start) {
        return new Promise( resolve => {
            let column = this.column
            let interval = start.interval
            let offset = start.offset
    
            const frame = () => {
                if (offset >= (100/this.rows)) {
                    this.rollTrigger()
                    offset = 0
                }
                if (this.stopFlag) resolve({"interval": interval, "offset": offset}) 
                else setTimeout(frame, interval)
                column.style.transform = `translateY(${offset}%)`
                offset += this.step
            }
            setTimeout(frame, interval)
        })
    }


    stopRoll (start) {
        return new Promise( resolve => {
            let interval = start.interval
            let offset = start.offset
            let column = this.column
            const delta = (this.maxInterval - interval) / 100 * this.step
            let stopFlag = false
    
            let colNewState = this.state
    
            const frame = () => {
                if (offset >= 100/(this.rows+1)) {
                    if (!!colNewState.length) this.rollTriggerStop(colNewState.pop())
                    if (stopFlag) {
                        column.style.transform = `translateY(${100/(this.rows+1)}%)`
                        this.isRolling = false
                        this.stopFlag = false
                        this.audio.colsStop.play()
                        resolve()
                        return 0
                    }
                    offset = 0
                }
                if (interval >= this.stopInterval) stopFlag = true
                column.style.transform = `translateY(${offset}%)`
                interval += delta
                offset += this.step
                setTimeout(frame, interval)
            }
            setTimeout(frame, interval)
        })
    }



    rollTrigger = () => {
        const column = this.column
        const img = this.itemsImages[getImgIndex(this.boardGenerator.getRandomItem())].cloneNode(true)
        const el = document.createElement('div')
        el.classList.add('item-wrapper')
        el.appendChild(img)
        column.removeChild(column.lastChild)
        column.insertBefore(el, column.querySelector('.item-wrapper'))
    }
    
    
    rollTriggerStop = (itemToAdd) => {
        const column = this.column
        const img = this.itemsImages[getImgIndex(itemToAdd)].cloneNode(true)
        const el = document.createElement('div')
        el.classList.add('item-wrapper')
        el.appendChild(img)
        column.removeChild(column.lastChild)
        column.insertBefore(el, column.querySelector('.item-wrapper'))
    }


    highLight = (indexes) => {
        if (Array.isArray(indexes)) {
            const elements = this.column.querySelectorAll('.item-wrapper')
            indexes.forEach(i => {
                elements[i].classList.add('highlight')
                setTimeout(() => elements[i].classList.remove('highlight'), this.highLightTime)
            })
        }
    }


}


const appendRandomItem = (state, boardGenerator) => [boardGenerator.getRandomItem(), ...state]


const getImgElement = (item, itemsImages) => itemsImages[getImgIndex(item)].cloneNode(true)


const getImgIndex = (_name) => config.availableItems.map(item => item.name).indexOf(_name)


const loadImages = async () => Promise.all(config.availableItems.map(item => new Promise(resolve => {
        const img = new Image()
        img.src = item.src
        img.onload = () => resolve(img)
    })
))

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))
