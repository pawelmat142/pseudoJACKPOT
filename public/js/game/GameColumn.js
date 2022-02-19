
import config from '../../gameConfig.json' assert { type: "json" }

export class GameColumn {

    constructor(state, board, index, factory, rollingStoppedTrigger) {
        
        this.board = board
        this.index = index
        this.factory = factory
        this.rollingStoppedTrigger = rollingStoppedTrigger
        this.state = appendRandomItem(state, this.factory)  // np: ['A', 'S', 'W']
        
        this.rows = config.board.rows
        this.cols = config.board.cols
        this.minInterval = config.rollConfig.minInterval
        this.maxInterval = config.rollConfig.maxInterval
        this.stopInterval = config.rollConfig.stopInterval
        this.step = config.rollConfig.step
        this.highLightTime = config.rollConfig.highLightTime    //should be same as css:root{--high-light-time}

        this.isRolling = false
        this.stopTrigger = false

        this.columnInit()
    }

    get column() {
        return document.getElementById(config.DOMids.board)
            .querySelectorAll('.column')[this.index]
    }


    columnInit = async () => {
        this.itemsImages = await loadImages()
        this.state.forEach((item, i) => {
            document.getElementById(`r${i}-c${this.index}`)
                .appendChild(getImgElement(item, this.itemsImages))
        
        })
    }


    setNewState = (state) => this.state = state

    
    startRoll() {

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
                this.constRoll(interval, offset)
            else setTimeout(frame, interval)
            column.style.transform = `translateY(${offset}%)`
            interval -= delta
            offset += this.step
        }
        
        setTimeout(frame, interval)
    }


    constRoll(_interval, _offset) {

        let column = this.column
        let interval = _interval
        let offset = _offset

        const frame = () => {
            if (offset >= (100/this.rows)) {
                this.rollTrigger()
                offset = 0
            }
            if (this.stopTrigger) 
                this.stopRoll(offset, interval)
            else setTimeout(frame, interval)
            column.style.transform = `translateY(${offset}%)`
            offset += this.step
        }
        
        setTimeout(frame, interval)
    }


    stopRoll (_offset, _interval) {
        
        let column = this.column
        let offset = _offset
        let interval = _interval
        const delta = (this.maxInterval - interval) / 100 * this.step
        let stopFlag = false

        const colNewState = this.state

        const frame = () => {
            if (offset >= (100/this.rows-2)) {
                if (stopFlag) {
                    this.isRolling = false
                    this.stopTrigger = false
                    this.rollingStoppedTrigger(this.index)
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


    columnStoppedTrigger = () => {
        console.log(this.board)
        this.board.ccc(this.index)
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
    itemsImages[getImgIndex(item)]
    .cloneNode(true)



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



