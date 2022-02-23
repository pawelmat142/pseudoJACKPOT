import config from '../../gameConfig.json' assert { type: "json" }
import { GameColumn } from "./GameColumn.js"
// import { Observable } from 'rxjs'

export class GameBoard {

    constructor(stateFactory, audioManager) {

        this.board = document.getElementById(config.DOMids.board)
        this.rows = config.board.rows
        this.cols = config.board.cols

        this.factory = stateFactory
        this.currentState = this.factory.getRandomBoard()
        this.audio = audioManager
        this.spiningSound = null

        this.columns = this.currentState.map((columnState, colIndex) => 
            new GameColumn(columnState, this.board, colIndex, this.factory, this.audio)
        )

        this.spinFlag = true
    }


    spin = async () => {
        if (this.spinFlag) {
            this.spinFlag = false
            this.audio.spin.play()
            this.audio.spinning.play()
            let promises = this.columns.map(col => col.spin())
            return Promise.all(promises)
        } else console.log('is rolling: ' + this.isRolling)
    }


    stopSpin = () => this.columns.forEach((column, i) => {
        if (!this.spinFlag) setTimeout(() => column.stopFlag = true, config.rollConfig.stopDelay*i) 
        else console.log('is rolling: ' + this.isRolling)
    })
    

    setCurrentState = (state) => {
        this.currentState = state
        this.columns.forEach((col, i) => col.setState(this.currentState[i]))
    }


    get isRolling() {
        let flag = false
        this.columns.forEach(col => {
            if (col.isRolling) flag = true
        })
        return flag
    }


    highlightScore = async () => {
        const scoreLines = getScoreLines(this.currentState)
        await sleep(config.rollConfig.highLightInterval*0.3)
        await this.highlightLines(scoreLines)
        await sleep(config.rollConfig.highLightInterval*0.15)
        if (scoreLines.length > 2) await this.highlightLinesTogether(scoreLines, 0)
        if (scoreLines.length > 4) await this.highlightLinesTogether(scoreLines, 1)
        await sleep(config.rollConfig.highLightInterval*0.3)
    }



    highlightLines = async (lines) => {
        let promises = lines.map((line, i) => {
            return new Promise(resolve => {
                setTimeout(() => {
                    this.audio.highlights.play()
                    this.highlightLine(line)
                    resolve()
                }, config.rollConfig.highLightInterval*i)
            })
        })
        return Promise.all(promises)
    }



    highlightLine = (line) => {
        if (Array.from(line).shift() === 'r') {
            const rowIndex = parseInt(Array.from(line).pop())
            this.columns.forEach(col => col.highLight([rowIndex]))
            return rowIndex
        }
        if (Array.from(line).shift() === 'x') {
            const index = parseInt(Array.from(line).pop())
            this.columns.forEach((col, ind) => col.highLight([Math.abs(index - ind)]))
            return index
        }
    }


    highlightLinesTogether = async (lines) => {
        await sleep(config.rollConfig.highLightInterval)
        this.audio.highlights.play()
        this.audio.highlightAll.play()
        lines.forEach(line => this.highlightLine(line))
    }

}


const getScoreLines = (state) => {
    let lines = getHorizontalLines(state)
    return [...lines, ...getObliqueLines(state)]
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


const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))
