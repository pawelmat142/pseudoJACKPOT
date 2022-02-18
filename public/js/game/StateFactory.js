import config from '../../gameConfig.json' assert { type: "json" }

export class StateFactory {

    constructor() {
        this.availableItems = config.availableItems
        this.rows = config.board.rows
        this.cols = config.board.cols
    }


    getRandomBoard() {
        let result = []
        for (let i = 0; i < this.rows; i++) {
            let col = []
            for (let j = 0; j < this.cols; j++) {
                col.push(this.getRandomItem())
            }
            result.push(col)
        }
        return result
    }


    getRandomItem() {
        const i = getRandomInt(0, this.availableItems.length-1)
        return this.availableItems[i].name
    }


    getItemSrc(name) {
        let result = ''
        this.availableItems.forEach(item => {
            if (item.name === name) result = item.src
        })
        return result
    }
}


const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
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