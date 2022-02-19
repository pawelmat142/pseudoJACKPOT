import config from '../../gameConfig.json' assert { type: "json" }
import { GameColumn } from "./GameColumn.js"
// import { Observable } from 'rxjs'

export class GameBoard {

    constructor(stateFactory) {

        this.board = document.getElementById(config.DOMids.board)
        this.rows = config.board.rows
        this.cols = config.board.cols

        this.factory = stateFactory
        this.currentState = this.factory.getRandomBoard()

        this.initBoard()

        this.spinFlag = true

    }


    
    initBoard = async () => {
        this.columns = []
        for(let i = 0; i < this.cols; i++) {
            const columnState = getCurrentColumnState(this.currentState, i)
            const newColumn = new GameColumn(columnState, this.board, i, this.factory, this.colStopTrigger)
            this.columns.push(newColumn)
        }
    }



    setNewState = (state) => {
        this.currentState = state
        this.columns.forEach((col, ind) => 
            col.setNewState(getCurrentColumnState(state, ind)))
    }
    


    start = () => {
        if (!this.spinFlag) {
            console.log('is rolling: ' + this.isRolling)
        }
        else {
            this.spinFlag = false
            this.columns.forEach((col, index) => {
                setTimeout(() => col.startRoll(), startInterval(index) )
            })
        }
    }
    
    
    stop = () => {
        if (!this.spinFlag) {
            this.columns.forEach((col, index) => {
                setTimeout(() => col.stopTrigger = true, stopInterval(index) )
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



    colStopTrigger = async (colIndex) => {

        if (colIndex >= this.cols-1) {
            const scoreLines = await this.highLightScoreLines()
            if (scoreLines.length > 2) {
                await this.highLightScoreLinesAll(scoreLines)
            }
            if (!!scoreLines.length) setTimeout(() => this.highLightsStopTrigger(), config.rollConfig.highLightTime)
            else this.highLightsStopTrigger()
        }
    }
    
    highLightsStopTrigger = () => {
        this.spinFlag = true;
        console.log('stop')
    }
    

    highLightScoreLines = () => {
        const scoreLines = getScoreLines(this.currentState)
        let highLightsCounter = 0
        let promises = scoreLines.map((line, i) => {
            return new Promise((resolve, reject) => {
                highLightsCounter++
                if (Array.from(line).shift() === 'r') {
                    setTimeout(() => {
                        const index = parseInt(Array.from(line).pop())
                        this.columns.forEach(col => col.highLight([index]))
                        resolve(line)
                    },i*config.rollConfig.highLightInterval)
                }
                if (Array.from(line).shift() === 'x') {
                    setTimeout(() => {
                        const index = parseInt(Array.from(line).pop())
                        this.columns.forEach((col, ind) => col.highLight([Math.abs(index - ind)]))
                        resolve(line)
                    },i*config.rollConfig.highLightInterval)
                }
            })
        })
        return Promise.all(promises)
    }


    highLightScoreLinesAll = (scoreLines) => {
        return new Promise((resolve, reject) => {
            let highLightCols = this.columns.map(i => [])
            scoreLines.forEach(line => {
                if (Array.from(line).shift() === 'r') {
                    const rowIndex = parseInt(Array.from(line).pop())
                    highLightCols.forEach(col => col.push(rowIndex))
                }
                if (Array.from(line).shift() === 'x') {
                    const i = parseInt(Array.from(line).pop())
                    highLightCols.forEach((col, colIndex) => {
                        const rowIndex = Math.abs(i - colIndex)
                        if (col.indexOf(rowIndex) === -1) col.push(rowIndex)
                    })
                }
            })
            setTimeout(() => {
                this.columns.forEach((col, ind) => {
                    col.highLight(highLightCols[ind])
                    setTimeout(() => resolve(), config.rollConfig.highLightTime)
                })
            },config.rollConfig.highLightTime*1.5)
        })
    }


    onAudio = () => {
        // this.columns.forEach(col => col.highLight([1,2,3]))
        this.columns.forEach(col => col.highLight([0]))
    }
            
            

}


const getScoreLines = (state) => {
    let lines = getHorizontalLines(state)
    return [...lines, ...getObliqueLines(state)]
}



const getHorizontalLines = (board) => {
    let result = []
    for (let row = 0; row < board.length; row++) 
        for (let col = 0; col < board[row].length; col++) 

            if (col > 1 ) {
                if ((board[row][col] === board[row][col-1]) &&
                    (board[row][col] === board[row][col-2]) ) 
                    result.push(`r${row}`)
            }
    return result
}


const getObliqueLines = (board) => {
    let result = []
    for (let row = 0; row < board.length; row++) 
        for (let col = 0; col < board[row].length; col++) 

            if (col > 1 && row > 1) {
                if ((board[row][col] === board[row-1][col-1]) &&
                    (board[row][col] === board[row-2][col-2]) ) 
                    result.push(`x${row-2}`)
                    
                if (board[row][col-2] === board[row-1][col-1] && 
                    board[row][col-2] === board[row-2][col]) 
                    result.push(`x${row}`)
            }
    return result
}


const startInterval = (index) => { return config.rollConfig.startDelay*index}

const stopInterval = (index) => { return config.rollConfig.stopDelay*index}
    
        
const getCurrentColumnState = (currentState, index) => {
    const columnState = []
    currentState.forEach(row => columnState.push(row[index]))
    return columnState
}



const sleep = (ms) => new Promise(resolve => setTimeout(resolve(), ms));
