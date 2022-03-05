
export class MyGraph {
    
    constructor (config) {
        this.id = config.id
        this.configWidth = config.width
        this.configHeight = config.height

        // grid
        this.gridOnY = config.gridOnY || false
        this.gridOnX = config.gridOnX || false
        this.linesNumberY = config.linesNumberY || 5
        this.linesNumberX = config.linesNumberX || 5
        this.gridWidth =  config.gridWidth || 1
        this.gridDashed = config.gridDashed || 5
        this.gridColor = config.gridColor || '#000000'
        this.gridNumbersFont = config.gridNumbersFont || '15px Arial'

        this.ctx = !!this.DOM ? this.DOM.getContext('2d') : false

        this.offsetTop = 10
        this.offsetRight = 10
        this.offsetBottom = 40
        this.offsetLeft = 70
        
        this.curves = []
        this.iterator = 0

        window.addEventListener('resize', this.print)

        this.print()
    }

    

    get DOM() {
        const el = document.getElementById(this.id)  
        if (el instanceof HTMLCanvasElement) return el
        else return false
    }



    print = () => {
        this.width = this.configWidth
        this.height = this.heightStyle
        this.printGrid()
        this.printCurves()
    }



    set width(_width) {
        if (typeof _width === 'number') this.DOM.width = _width
        if (typeof _width === 'string') {
            if (_width.includes('px')) this.DOM.width = parseInt(_width)
            if (_width.includes('%'))  {
                this.DOM.width = window.innerWidth * parseInt(_width) / 100
                this.DOM.width = 50
                console.log(window.innerWidth * parseInt(_width) / 100)
                console.log(this.DOM.width)
                console.log(this.DOM.width)
                // this.DOM.width = this.DOM.parentNode.offsetWidth * parseInt(_width) / 100
            }
        }
    }


    get width() { return !!this.DOM.width ? this.DOM.width : 0 }


    set height(_height) {
        if (typeof _height === 'number') this.DOM.height = _height + this.offsetTop
        if (typeof _height === 'string') {
            if (_height.includes('px')) this.DOM.height = parseInt(_height) 
            if (_height.includes('%')) this.DOM.height = (this.DOM.parentNode.offsetHeight * parseInt(_height) / 100) + this.offsetTop
        }
    }
    

    get height() { return !!this.DOM.height ? this.DOM.height-this.offsetY-this.offsetTop : 0 }


    get Height() { return !!this.DOM.height ? this.DOM.height : 0 }


    get maxValCurve() {
        if (this.curves.length > 0) {
            let result = false
            this.curves.forEach(curve => {
                const max = Math.max(...curve.yArr)
                if (max > result) result = copy(curve)
            })
            return result
        } else return false
    }
    


    addCurve = (yArr, _xArr, config) => {
        if (valid(yArr, _xArr)) {
            const xArr = !_xArr ? yArr.map((el,i) => i) : [..._xArr]
            const curve = {
                iterator: ++this.iterator,
                xArr: xArr,
                yArr: yArr,
                width: !!config ? config.width : 1,
                dashed: !!config ? config.dashed : 0,
                color: !!config ? config.color : '#000000'
            }
            this.curves.push(curve)
            return this.iterator
        }
    }



    printCurve = (iterator, maxY) => {
        console.log('printCurve')
        const curve = this.curves.filter(el => el.iterator === iterator).pop()
        let length = curve.yArr.length
        const height = (!!this.height ? this.height : 0)
        const stepX = this.width / (length-1)
        this.ctx.beginPath()
        this.ctx.strokeStyle = curve.color
        this.ctx.lineWidth = curve.width
        this.ctx.setLineDash([curve.dashed])
        this.ctx.moveTo(curve.xArr[0]+this.offsetX, height - curve.yArr[0]*height/maxY + this.offsetTop)
        for (let i = 1; i < length; i++) this.ctx.lineTo(this.offsetX+stepX*i, height - curve.yArr[i]*height/maxY + this.offsetTop)
        this.ctx.stroke()
        this.ctx.closePath()
    }
    
    
    printCurves = (iterators) => {
        console.log('printCurves')
        const maxY = ArraysMaxVal(this.curves.map(curve => curve.yArr))
        if (!iterators) this.curves.forEach(curve => this.printCurve(curve.iterator, maxY))
        else if (Array.isArray(iterators)) iterators.forEach(iterator => this.printCurve(iterator, maxY))
    }


    // GRID
    
    printGrid = () => {
        this.ctx.beginPath()
        this.ctx.strokeStyle = this.gridColor
        this.ctx.lineWidth = this.gridWidth
        this.ctx.setLineDash([this.gridDashed, this.gridDashed])
        this.ctx.font = this.gridNumbersFont

        !!this.gridOnY ? this.gridLinesY() : this.gridLineY()
        !!this.gridOnX ? this.gridLinesX() : this.gridLineX()

        this.ctx.closePath()
    }


    gridLineY = () => {
        this.ctx.moveTo(this.offsetX-10, this.height + this.offsetTop )
        this.ctx.lineTo(this.width + this.offsetX-10, this.height + this.offsetTop)
        this.ctx.stroke()
    }
    

    gridLinesY = () => {
        const maxVal = ArraysMaxVal(this.curves.map(curve => curve.yArr))
        let lengthY = this.curves.length > 0 ? this.curves[0].yArr.length : 0
        if ( lengthY >= this.linesNumberY) lengthY = this.linesNumberY
        const step = this.height / lengthY
        let numbers = []
        for (let i = 0; i < this.linesNumberY; i++) {
            numbers.push(i*step)
            this.ctx.moveTo(this.offsetX -10, this.height - i*step + this.offsetTop)
            this.ctx.lineTo(this.width + this.offsetX-10, this.height - i*step + this.offsetTop)
            this.ctx.fillText(parseInt(i*step*maxVal/this.height), this.offsetX-55, this.height+4-i*step+this.offsetTop)
            this.ctx.stroke()
        }
    }



    gridLineX = () => {
        this.ctx.moveTo(this.offsetX, + this.offsetTop)
        this.ctx.lineTo(this.offsetX, this.height+10 + this.offsetTop)
        this.ctx.stroke()
    }



    gridLinesX = () => {
        let lengthX = this.curves.length > 0 ? this.curves[0].xArr.length : 0
        if ( lengthX >= this.linesNumberX) lengthX = this.linesNumberX
        const step = this.width / (lengthX-1)
        for (let i = 0; i < this.linesNumberX; i++) {
            this.ctx.moveTo(this.offsetX + i*step, this.height+10 + this.offsetTop)
            this.ctx.lineTo(this.offsetX + i*step, this.offsetTop)
            this.ctx.fillText(i, this.offsetX-4 + i*step, this.height+32+this.offsetTop)
            this.ctx.stroke()
        }
    }


    open = () => this.height = this.heightStyle

    close = () => this.height = 0

}


const copy = (obj) => JSON.parse(JSON.stringify(obj))


const valid = (yArr, xArr) => {
    if (!xArr) return Array.isArray(yArr) && yArr.every(el => typeof el === 'number') 
    else return Array.isArray(yArr) && 
        Array.isArray(xArr) &&
        yArr.every(el => typeof el === 'number') && 
        xArr.every(el => typeof el === 'number') &&
        yArr.length === xArr.length
}

const ArraysMaxVal = (arrs) => {
    arrs.forEach(arr => console.log(arr))
    let result = 0
    arrs.forEach(arr => {
        let arrMax = Math.max(...arr)
        if (arrMax > result) result = arrMax
    })
    return result
}
