const config = require('../public/gameConfig.json')
const scores = require("./scores")

const generatorConfig = {
    maxScore: 100,
    minScore: 0,
    chance: 22,
    divider: 100
}


class ScoreGenerator {
    
    constructor() {
        this.chance = 40 //has to be integer between 1 to 100
        this.maxScore = 100 
        this.divider = 100

        this.maxShot = this.maxScore * this.divider

        this.possibleScores = []
        scores.forEach(score => {
            this.possibleScores.push(score.score)
        })
    }

    

    getBoard = (_score) => {
        const score = _score
        if (score > 0 ) {
            const scoreCongifg = this.getRandomConfigByScore(score)
            const board = getBoardByConfig(scoreCongifg)
            return board
        }
        else return this.getZeroScoreBoard()
    }



    getRandomConfigByScore = (score) => {
        const scoreIndex = this.possibleScores.indexOf(score)
        const numberOfConfigs = scores[scoreIndex].configs.length
        const configIndex = getRandomInt(0, numberOfConfigs-1)
        return scores[scoreIndex].configs[configIndex]
    }



    getZeroScoreBoard = () => {
        let board = getRandomBoard()
        let flag = hasBoardObliqueLine(board) || hasBoardHorizontalLine(board)
        while (flag){
            board = getRandomBoard()
            flag = hasBoardObliqueLine(board) || hasBoardHorizontalLine(board)
        }
        return board
        // board.forEach(row => console.log(row))
    }



    getScore = (_shot) => {
        const shot = _shot || this.getShot()
        let result = -1
        this.possibleScores.forEach((score, ind) => {
            if (shot > (this.maxShot - (this.maxScore * this.chance / score)) ) {
                result = ind
            }
        })
        if (result >= 0 ) 
            return this.possibleScores[result]
        else 
            return 0
    }


    getShot = () => getRandomInt(1, this.maxShot)
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


const getBoardByConfig = (scoreCongifg) => {
    const itemsNotInConfig = getItemsNotInConfig(scoreCongifg)
    const newConfig = []

    scoreCongifg.forEach(row => {
        const newRow = []
        row.forEach((item, colInd) => {
            if (item === '0') {
                let newItem = itemsNotInConfig[getRandomInt(0, itemsNotInConfig.length-1)]
                // prevent generate line with same items
                while (newItem === newRow[colInd-1] && colInd > 0) 
                    newItem = itemsNotInConfig[getRandomInt(0, itemsNotInConfig.length-1)]
                
                newRow.push(newItem)
            }
            else newRow.push(item)
        })
        newConfig.push(newRow)
    })
    return newConfig
}


const hasBoardHorizontalLine = (board) => {
    flag = false
    for (let row = 0; row < board.length; row++) 
        for (let col = 0; col < board[row].length; col++) 

            if (col > 1 ) {
                if ((board[row][col] === board[row][col-1]) &&
                    (board[row][col] === board[row][col-2]) ) 
                    flag = true
            }
    return flag
}

const hasBoardObliqueLine = (board) => {
    flag = false
    for (let row = 0; row < board.length; row++) 
        for (let col = 0; col < board[row].length; col++) 

            if (col > 1 && row > 1) {
                if ((board[row][col] === board[row-1][col-1]) &&
                    (board[row][col] === board[row-2][col-2]) ) 
                    flag = true
                
                if (board[row][col-2] === board[row-1][col-1] && 
                    board[row][col-2] === board[row-2][col]) 
                    flag = true
            }
    return flag
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


const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


module.exports = new ScoreGenerator()