import config from '../../gameConfig.json' assert { type: "json" }
import { GameColumn } from "./GameColumn.js"

export class GameBoard {

    constructor(boardGenerator, audioManager) {

        this.board = document.getElementById(config.DOMids.board)
        this.rows = config.board.rows
        this.cols = config.board.cols

        this.boardGenerator = boardGenerator
        this.currentState = this.boardGenerator.getZeroScoreBoard()
        this.audio = audioManager.it
        this.topScreen

        this.columns = this.currentState.map((columnState, colIndex) => 
            new GameColumn(columnState, this.board, colIndex, this.boardGenerator, this.audio)
        )

        this.spinFlag = false
        this.bet = 0
    }

    get isRolling() {
        let flag = false
        this.columns.forEach(col =>  {if (col.isRolling) flag = true })
        return flag
    }


    spinStart = ()=> {
        if (!this.isRolling) {
            this.spinFlag = false
            return this.columns.map(async col => col.spinStart())
        } else {
            return this.columns.map( el=> ({"interval": 0, "offset": 0}) )
        }
    }


    spinStop = async (spinPromises) => {
        if (!this.spinFlag) {
            let stopPromises = this.columns.map( async(col, i)=> col.spinStop(spinPromises[i]))
            return Promise.all(stopPromises)
        }
    }
    

    setCurrentState = (score) => {
        const state = this.boardGenerator.getBoard(score)
        this.currentState = [...state]
        console.log(state)
        this.columns.forEach((col, i) => col.setState(this.currentState[i]))
    }

    
    // HIGHLIGHTs

    highlightScore = async (topScreenShow) => {
        const scoreLines = this.boardGenerator.getScoreLines(this.currentState)
        await sleep(config.spin.highLightInterval*0.3)
        await this.highlightLines(scoreLines, topScreenShow)
        await sleep(config.spin.highLightInterval*0.15)
        if (scoreLines.length > 2) await this.highlightLinesTogether(scoreLines, topScreenShow)
        if (scoreLines.length > 4) await this.highlightLinesTogether(scoreLines, topScreenShow)
        await sleep(config.spin.highLightInterval*0.3)
    }



    highlightLines = async (lines, topScreenShow) => {
        let promises = lines.map((line, i) => {
            return new Promise(resolve => {
                setTimeout(() => {
                    this.audio.highlights.play()
                    this.highlightLine(line)
                    topScreenShow(this.getValueFromLine(line))
                    resolve()
                }, config.spin.highLightInterval*i)
            })
        })
        return Promise.all(promises)
    }


    getValueFromLine = (line) => {
        const item = this.currentState[0][parseInt(Array.from(line).pop())]
        return config.availableItems.find(el => el.name === item).score
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



    highlightLinesTogether = async (lines, topScreenShow) => {
        await sleep(config.spin.highLightInterval*1.1)
        this.audio.highlights.play()
        this.audio.highlightsAll.play()
        lines.forEach(line => this.highlightLine(line))
        topScreenShow(0)
    }

}


const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

