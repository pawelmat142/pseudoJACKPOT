
import config from '../../gameConfig.json' assert { type: "json" }

export class GameColumn {

    constructor(state, board, index, factory, audioManager) {
        
        this.board = board
        this.index = index
        this.factory = factory
        this.audio = audioManager
        this.state = appendRandomItem(state, this.factory)  // np: ['A', 'S', 'W']

        this.rows = config.board.rows
        this.cols = config.board.cols
        this.minInterval = config.rollConfig.minInterval
        this.maxInterval = config.rollConfig.maxInterval
        this.stopInterval = config.rollConfig.stopInterval
        this.step = config.rollConfig.step
        this.highLightTime = config.rollConfig.highLightTime    //should be same as css:root{--high-light-time}

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



    spin = async () => {
        this.stopFlag = false
        const start =  await this.startRoll()
        const constStart = await this.constRoll(start)
        await this.stopRoll(constStart)
        return 'a'
    }


    spinStop = () => {
        this.stopFlag = true
    }
    

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
                if (interval <= this.minInterval)
                    resolve({"interval": interval, "offset": offset})
                    // this.constRoll(interval, offset)
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
                if (this.stopFlag) 
                    resolve({"interval": interval, "offset": offset})
                    // this.stopRoll(offset, interval)
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
    
            const colNewState = this.state
    
            const frame = () => {
                if (offset >= (100/this.rows-2)) {
                    if (stopFlag) {
                        this.isRolling = false
                        this.stopFlag = false
                        this.audio.colsStop.play()
                        resolve()
                        return 0
                    }
                    if (colNewState.length) this.rollTriggerStop(colNewState.pop())
                    offset = 0
                }
                if (interval >= this.stopInterval) stopFlag = true
                interval += delta
                offset += this.step
                column.style.transform = `translateY(${offset}%)`
                setTimeout(frame, interval)
            }
            setTimeout(frame, interval)
        })
    }



    rollTrigger = () => {
        const column = this.column
        const img = this.itemsImages[getImgIndex(this.factory.getRandomItem())].cloneNode(true)
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
                elements[i].classList.add('high-light')
                setTimeout(() => elements[i].classList.remove('high-light'), this.highLightTime)
            })
        }
    }


}


const appendRandomItem = (state, factory) => {
    state.unshift(factory.getRandomItem())
    return state
}


const getImgElement = (item, itemsImages) => 
    itemsImages[getImgIndex(item)].cloneNode(true)


const getImgIndex = (name) => {
    let result = -1
    config.availableItems.forEach((item, itemIndex) => {
        if (item.name === name) {result = itemIndex}
    })
    return result
}


async function loadImages() {
    const items = config.availableItems
    let promises = items.map(item => {
        return new Promise((resolve, reject) => {
            const img = new Image()
            img.src = item.src
            img.onload = () => resolve(img)
        })
    })
    return Promise.all(promises)
}



