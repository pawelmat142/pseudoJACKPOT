
import config from '../../gameConfig.json' assert { type: "json" }

export class GameColumn {

    constructor(state, board, index, factory, itemsImagesArr) {
        
        this.board = board
        this.index = index
        this.factory = factory
        this.itemsImagesArr = itemsImagesArr
        this.state = appendRandomItem(state, this.factory)  // np: ['A', 'S', 'W']
        
        this.rows = config.board.rows
        this.cols = config.board.cols
        this.minInterval = config.rollConfig.minInterval
        this.maxInterval = config.rollConfig.maxInterval
        this.stopInterval = config.rollConfig.stopInterval
        this.step = config.rollConfig.step

        this.isRolling = false
        this.stopTrigger = false

        this.column = generateColumn(this.state, itemsImagesArr)
        this.board.appendChild(this.column)

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
            if (offset >= (100/this.rows)) {
                if (stopFlag) {
                    this.isRolling = false
                    this.stopTrigger = false
                    return 0
                }
                if (colNewState.length) this.rollTriggerStop(colNewState.pop())
                offset = 0
            }
            if (interval >= this.stopInterval) 
            stopFlag = true
            interval += delta
            offset += this.step
            column.style.transform = `translateY(${offset}%)`
            setTimeout(frame, interval)
        }
        setTimeout(frame, interval)
    }



    rollTrigger = () => {
        const el = generateImgElement(this.factory.getRandomItem(), this.itemsImagesArr)
        this.column.insertBefore(el, this.column.querySelector('img'))
        this.column.removeChild(this.column.lastChild)
    }
    
    
    rollTriggerStop = (itemToAdd) => {
        const el = generateImgElement(itemToAdd, this.itemsImagesArr)
        this.column.insertBefore(el, this.column.querySelector('img'))
        this.column.removeChild(this.column.lastChild)
    }
}



const appendRandomItem = (state, factory) => {
    state.unshift(factory.getRandomItem())
    return state
}



const generateColumn = (state, itemsImagesArr) => {
    const column = document.createElement('div')
    column.classList.add('column')
    state.forEach(item => {
        let itemImage = generateImgElement(item, itemsImagesArr)
        column.appendChild(itemImage)
    })
    return column
}



const generateImgElement = (item, itemsImagesArr) => {
    let itemImage = itemsImagesArr[getImgIndex(item)].cloneNode(true)
    return itemImage
}



const getImgIndex = (name) => {
    let result = -1
    config.availableItems.forEach((item, itemIndex) => {
        if (item.name === name) {result = itemIndex}
    })
    return result
}


