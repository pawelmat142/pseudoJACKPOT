import config from '../../gameConfig.json' assert { type: "json" }
import { GameColumn } from "./GameColumn.js"

export class GameBoard {

    constructor(stateFactory) {

        this.board = document.getElementById(config.DOMids.board)
        this.rows = config.board.rows
        this.cols = config.board.cols

        this.factory = stateFactory
        this.currentState = this.factory.getRandomBoard()

        this.initBoard()

    }


    
    async initBoard() {
        let itemsImagesArr = await loadImages()
        this.columns = []
        for(let i = 0; i < this.cols; i++) {
            const columnState = getCurrentColumnState(this.currentState, i)
            const newColumn = new GameColumn(columnState, this.board, i, this.factory, itemsImagesArr)
            this.columns.push(newColumn)
        }
    }



    setNewState = (state) => {
        this.currentState = state
        this.columns.forEach((col, ind) => 
            col.setNewState(getCurrentColumnState(state, ind)))
    }
    


    start() {
        if (this.isRolling) {
            console.log('is rolling: ' + this.isRolling)
        }
        else {
            this.columns.forEach((col, index) => {
                setTimeout(() => col.startRoll(), startInterval(index) )
            })
        }
    }
    
    
    stop() {
        if (this.isRolling) {
            this.columns.forEach((col, index) => {
                setTimeout(() => col.stopTrigger = true, stopInterval(index))
            })
        }
        else {
            console.log('is rolling: ' + this.isRolling)
        }
    }


    get isRolling() {
        let flag = false
        this.columns.forEach(col => {
            if (col.isRolling) flag = true
        })
        return flag
    }


}

const loadImage = (url) => new Promise((resolve, reject) => {
    const img = new Image();
    img.addEventListener('load', () => resolve(img));
    img.addEventListener('error', (err) => reject(err));
    img.src = url;
});


const startInterval = (index) => { return config.rollConfig.startDelay*index}

const stopInterval = (index) => { return config.rollConfig.stopDelay*index}
    
        
const getCurrentColumnState = (currentState, index) => {
    const columnState = []
    currentState.forEach(row => columnState.push(row[index]))
    return columnState
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
