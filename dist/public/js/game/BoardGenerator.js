import { config } from '../gameConfig.js'

import {scores} from './scores.js'

export class BoardGenerator {

    constructor() {
        this.availableItems = config.availableItems
        this.rows = config.board.rows
        this.cols = config.board.cols
        this.scores = scores.map(el => el.score)
        this.configs = scores.map(el => el.configs)

    }

    getRandomItem = () => this.availableItems[getRandomInt(0, this.availableItems.length-1)].name


    getItemSrc = (name) => this.availableItems.filter(item => item.name === name).src


    getBoard = (_score) => _score > 0 ? this.getBoardByScore(_score) : this.getZeroScoreBoard()
    

    getBoardByScore = (_score) => {
        const scoreIndex = this.scores.indexOf(_score)
        const numberOfConfigs = this.configs[scoreIndex].length
        return getBoardByConfig(this.configs[scoreIndex][getRandomInt(0, numberOfConfigs-1)])
    }


    getZeroScoreBoard = () => {
        let board = getRandomBoard()
        let flag = !!getHorizontalLines(board).length || !!getObliqueLines(board).length
        while (flag){
            board = getRandomBoard()
            flag = !!getHorizontalLines(board).length || !!getObliqueLines(board).length
        }
        return board
    }


    getScoreLines = (board) => [...getHorizontalLines(board), ...getObliqueLines(board)]
}


const getBoardByConfig = (scoreCongifg) => {
    const itemsNotInConfig = getItemsNotInConfig(scoreCongifg)
    let board = []
    scoreCongifg.forEach((col, colIndex) => {
        let boardCol = []
        col.forEach((item, rowIndex) => {
            if (item === '0') {
                let newItem = itemsNotInConfig[getRandomInt(0, itemsNotInConfig.length-1)]
                while (colIndex>0 && newItem === board[colIndex-1][rowIndex]) {
                    newItem = itemsNotInConfig[getRandomInt(0, itemsNotInConfig.length-1)]
                }
                boardCol.push(newItem)
            } else boardCol.push(item)
        })
        board.push(boardCol)
    })
    return board
}



const getItemsNotInConfig = (scoreCongifg) => {
    const allItems = [] 
    const existingItems = [] 
    config.availableItems.forEach(item => allItems.push(item.name))

    scoreCongifg.forEach(row => row.forEach(item => {
            if (existingItems.indexOf(item) === -1 && item !== '0') 
                existingItems.push(item)}))

    return allItems.filter(item => existingItems.indexOf(item)<0)
}



const getRandomBoard = () => {
    const rows = config.board.rows
    const cols = config.board.cols
    const items = []
    config.availableItems.forEach(i => items.push(i.name))
    const getRandomItem = () => items[getRandomInt(0, items.length-1)]

    let result = []
    for (let i = 0; i < rows; i++) {
        let col = []
        for (let j = 0; j < cols; j++) {
            col.push(getRandomItem())
        }
        result.push(col)
    }
    return result
}



const getHorizontalLines = (board) => {
    let result = []
    for (let colIndex = 0; colIndex < board.length; colIndex++) 
        if (colIndex > 1) 
            for (let rowIndex = 0; rowIndex < board[colIndex].length; rowIndex++) {

                if (board[colIndex][rowIndex] === board[colIndex-1][rowIndex] && 
                    board[colIndex][rowIndex] === board[colIndex-2][rowIndex]) 
                    
                    result.push('r'+rowIndex)

            }
    return result
}


const getObliqueLines = (board) => {
    let result = []
    for (let colIndex = 0; colIndex < board.length; colIndex++) 
        if (colIndex > 1) 
            for (let rowIndex = 0; rowIndex < board[colIndex].length; rowIndex++) {

                if ( !(rowIndex % 2) &&
                    board[colIndex][rowIndex] === board[colIndex-1][Math.abs(rowIndex-1)] && 
                    board[colIndex][rowIndex] === board[colIndex-2][Math.abs(rowIndex-2)] )
                    result.push('x'+Math.abs(rowIndex-2))
            }

    return result
}



const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
