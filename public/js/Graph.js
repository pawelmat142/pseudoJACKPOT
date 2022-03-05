export class Graph {

    constructor (config) {

        this.id = config.id
        this._width = config.width
        this._height = config.height
        this.canvas = document.getElementById(this.id)
        this.ctx = this.canvas.getContext("2d")

        this.curves = []
        this.legends = []
        this.iterator = 0

        // grid
        this.gridOnY = config.gridOnY || false
        this.gridOnX = config.gridOnX || false
        this.linesNumberY = config.linesNumberY || 5
        this.linesNumberX = config.linesNumberX || 5
        this.gridWidth =  config.gridWidth || 1
        this.gridDashed = config.gridDashed || 15
        this.gridColor = config.gridColor || '#c8c8c8'
        this.gridNumbersFont = config.gridNumbersFont || '17px Arial'

        this.offsetTop = 15
        this.offsetRight = 15
        this.offsetBottom = 50
        this.offsetLeft = 70
        this.legendHeight = 50

        window.addEventListener('resize', this.resize)
        this.resize()
    }

    get width(){
        let width = 0
        if (typeof this._width === 'string' && this._width.includes('%')) width = parseInt(this._width) * this.canvas.parentNode.offsetWidth / 100
        if (typeof this._width === 'string' && this._width.includes('px')) width = parseInt(this._width)
        if (typeof this._width === 'number') width = this._width
        return width
    }
    
    set width(val) { this._width = val }
    
    get height(){
        let height = 0
        if (typeof this._width === 'string' && this._width.includes('%')) height = parseInt(this._height) * this.canvas.parentNode.offsetHeight / 100
        if (typeof this._width === 'string' && this._width.includes('px')) height = parseInt(this._height)
        if (typeof this._height === 'number') height = this._height
        return height 
    }

    set height(val) { this.this._height = val }


    resize = () => {
        this.canvas.width = this.width
        this.canvas.height = this.height + this.legendHeight
        if (this.curves.length > 0) this.print()
    }


    addCurve = (yArr, _xArr, config) => {
        if (valid(yArr, _xArr)) {
            const xArr = !_xArr ? yArr.map((el,i) => i) : [..._xArr]
            const curve = {
                iterator: ++this.iterator,
                xArr: xArr,
                yArr: [...yArr],
                width: !!config ? config.width : 1,
                dashed: !!config ? config.dashed : 0,
                color: !!config ? config.color : '#000000'
            }
            this.curves.push(curve)
            this.legends.push(config)
            return this.iterator
        }
    }


    print = () => {
        this.printGrid()
        this.printLegend()
        this.printCurves()
    }


    printGrid = () => {
        this.ctx.strokeStyle = this.gridColor
        this.ctx.lineWidth = this.gridWidth
        this.ctx.setLineDash([this.gridDashed, this.gridDashed])
        this.ctx.font = this.gridNumbersFont
        let length = this.curves.length > 0 ? this.curves[0].xArr.length : 0
        this.ctx.beginPath()
        this.gridVerticalLines(length)
        this.gridHorizontalLines(length)
        this.ctx.closePath()
    }


    printCurves = () => {
        const width = this.width - this.offsetLeft - this.offsetRight
        const height = this.height - this.offsetTop - this.offsetBottom
        const maxY = ArraysMaxVal(this.curves.map(curve => curve.yArr))
        this.curves.forEach(curve => {
            let length = curve.yArr.length
            const stepX = width / (length-1)
            this.ctx.strokeStyle = curve.color
            this.ctx.lineWidth = curve.width
            this.ctx.setLineDash([curve.dashed])
            this.ctx.beginPath()
            this.ctx.moveTo(this.offsetLeft, this.height - this.offsetBottom - curve.yArr[0]*height/maxY)
            for (let i = 1; i < length; i++) 
                this.ctx.lineTo(this.offsetLeft + stepX*i, this.height - this.offsetBottom - curve.yArr[i]*height/maxY)
            this.ctx.stroke()
            this.ctx.closePath()
        })
    }


    printLegend = () => {
        const gap = 70
        const legendPartWidth = 150
        const x0 = (this.width - this.legends.length*(legendPartWidth+gap) + gap) / 2
        this.legends.forEach((config, i) => {
            const x = this.width/2
            this.ctx.beginPath()
            this.ctx.strokeStyle = config.color
            this.ctx.lineWidth = config.width
            this.ctx.setLineDash([config.dashed])
            this.ctx.font = this.gridNumbersFont
            this.ctx.fillText(config.name, x0+i*(legendPartWidth+gap)+ legendPartWidth/3*2 + 10, this.height + this.legendHeight/2 + 5)
            this.ctx.moveTo(x0 + i*(legendPartWidth+gap), this.height + this.legendHeight / 2)
            this.ctx.lineTo(x0 + i*(legendPartWidth+gap) + legendPartWidth/3*2, this.height + this.legendHeight / 2)
            this.ctx.stroke()
            this.ctx.closePath()
        })
    }


    gridVerticalLines = (length) => {
        const width = this.width - this.offsetLeft - this.offsetRight
        const step = width / (length-1)
        const print = (i) => {
            this.ctx.fillText(i, this.offsetLeft + step*i -8, this.height - this.offsetBottom + 40)
            this.ctx.moveTo(this.offsetLeft + step*i, this.height - this.offsetBottom + 12)
            this.ctx.lineTo(this.offsetLeft + step*i, this.offsetTop)
            this.ctx.stroke()
        }
        if (length > 100) {for (let i = 0; i < length; i++) if (i % 12 === 0) print(i)}
        else if (length > 20) {for (let i = 0; i < length; i++) if (i % 3 === 0) print(i)}
        else for (let i = 0; i < length; i++) {print(i)}
    }
    

    gridHorizontalLines = (length) => {
        const maxVal = ArraysMaxVal(this.curves.map(curve => curve.yArr))
        const height = this.height - this.offsetTop - this.offsetBottom
        const l = length > this.linesNumberY ? this.linesNumberY : length
        const step = height / (l-1)
        for (let i = 0; i < l; i++) {
            this.ctx.fillText(parseInt(i*step*maxVal/height), this.offsetLeft - 50, this.height - this.offsetBottom - step*i +5)
            this.ctx.moveTo(this.offsetLeft - 12, this.height - this.offsetBottom - step*i)
            this.ctx.lineTo(this.width - this.offsetRight, this.height - this.offsetBottom - step*i)
            this.ctx.stroke()
        }
    }



    printLegend = () => {
        const gap = 70
        const legendPartWidth = 150
        const x0 = (this.width - this.legends.length*(legendPartWidth+gap) + gap) / 2
        this.legends.forEach((config, i) => {
            const x = this.width/2
            this.ctx.beginPath()
            this.ctx.strokeStyle = config.color
            this.ctx.lineWidth = config.width
            this.ctx.setLineDash([config.dashed])
            this.ctx.font = this.gridNumbersFont
            this.ctx.fillText(config.name, x0+i*(legendPartWidth+gap)+ legendPartWidth/3*2 + 10, this.height + this.legendHeight/2 + 5)
            this.ctx.moveTo(x0 + i*(legendPartWidth+gap), this.height + this.legendHeight / 2)
            this.ctx.lineTo(x0 + i*(legendPartWidth+gap) + legendPartWidth/3*2, this.height + this.legendHeight / 2)
            this.ctx.stroke()
            this.ctx.closePath()
        })
    }



}



const valid = (yArr, xArr) => {
    if (!xArr) return Array.isArray(yArr) && yArr.every(el => typeof el === 'number') 
    else return Array.isArray(yArr) && 
        Array.isArray(xArr) &&
        yArr.every(el => typeof el === 'number') && 
        xArr.every(el => typeof el === 'number') &&
        yArr.length === xArr.length
}

const ArraysMaxVal = (arrs) => {
    // arrs.forEach(arr => console.log(arr))
    let result = 0
    arrs.forEach(arr => {
        let arrMax = Math.max(...arr)
        if (arrMax > result) result = arrMax
    })
    return result
}

