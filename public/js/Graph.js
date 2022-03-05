export class Graph {

    constructor (config) {

        this.id = config.id
        this._width = config.width || '100%'
        this._height = config.height || '100%'
        this.canvas = document.getElementById(this.id)
        this.ctx = this.canvas.getContext("2d")

        this.curves = []
        this.legends = []
        this.iterator = 0

        // grid
        this.gridOnY = config.gridOnY || false
        this.gridOnX = config.gridOnX || false
        this.linesNumberY = config.linesNumberY || 8
        this.linesNumberX = config.linesNumberX || 5
        this.gridWidth =  config.gridWidth || 1
        this.gridDashed = config.gridDashed || 15
        this.gridColor = config.gridColor || '#c8c8c8'
        this.gridNumbersFont = config.gridNumbersFont || screen.width > 576 ? '17px Arial' : '12px Arial'

        this.legendHeight = mobile() ? 30 : 50
        this.offsetTop = mobile() ? 10 : 15 
        this.offsetRight = mobile() ? 10 : 15 
        this.offsetBottom = (mobile() ? 30 : 50) + this.legendHeight
        this.offsetLeft = mobile() ? 40 : 70
        this.horizontalNumsOffset = mobile() ? 40 : 50
        this.verticalNumsOffset = mobile() ? 30 : 40

        window.addEventListener('resize', this.resize)
        window.addEventListener('orientationchange', this.resize)
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
    
    get height() {
        let height = 0
        if (typeof this._width === 'string' && this._width.includes('%')) height = parseInt(this._height) * this.canvas.parentNode.offsetHeight / 100
        if (typeof this._width === 'string' && this._width.includes('px')) height = parseInt(this._height)
        if (typeof this._height === 'number') height = this._height
        return height 
    }

    set height(val) { this._height = val }


    resize = () => {
        this.canvas.width = this.width
        this.canvas.height = this.height 
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
            this.ctx.beginPath()
            this.ctx.strokeStyle = config.color
            this.ctx.lineWidth = config.width
            this.ctx.setLineDash([config.dashed])
            this.ctx.font = this.gridNumbersFont
            this.ctx.fillText(config.name, x0+i*(legendPartWidth+gap)+ legendPartWidth/3*2 + 10, this.height + this.legendHeight/2 + 5)
            this.ctx.moveTo(x0 + i*(legendPartWidth+gap), this.height - this.legendHeight / 2)
            this.ctx.lineTo(x0 + i*(legendPartWidth+gap) + legendPartWidth/3*2, this.height - this.legendHeight / 2)
            this.ctx.stroke()
            this.ctx.closePath()
        })
    }


    gridVerticalLines = (length) => {
        const width = this.width - this.offsetLeft - this.offsetRight
        const step = width / (length-1)
        const print = (i) => {
            this.ctx.fillText(i, this.offsetLeft + step*i -8, this.height - this.offsetBottom + this.verticalNumsOffset)
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
            this.ctx.fillText(parseInt(i*step*maxVal/height), this.offsetLeft - this.horizontalNumsOffset, this.height - this.offsetBottom - step*i +5)
            this.ctx.moveTo(this.offsetLeft - 12, this.height - this.offsetBottom - step*i)
            this.ctx.lineTo(this.width - this.offsetRight, this.height - this.offsetBottom - step*i)
            this.ctx.stroke()
        }
    }



    printLegend = () => {
        const gap = 70
        const legendPartWidth = 150
        const x0 = (this.width - this.legends.length*(legendPartWidth+gap)+gap) / 2
        this.legends.forEach((config, i) => {
            this.ctx.beginPath()
            this.ctx.strokeStyle = config.color
            this.ctx.lineWidth = config.width
            this.ctx.setLineDash([config.dashed])
            this.ctx.font = this.gridNumbersFont
            this.ctx.fillText(config.name, x0+i*(legendPartWidth+gap)+ legendPartWidth/3*2 + 10, this.height - this.legendHeight/2 + 5)
            this.ctx.moveTo(x0 + i*(legendPartWidth+gap), this.height - this.legendHeight/2)
            this.ctx.lineTo(x0 + i*(legendPartWidth+gap) + legendPartWidth/3*2, this.height - this.legendHeight/2)
            this.ctx.stroke()
            this.ctx.closePath()
        })
    }



    orientationchange = () => {
        this.resize()
        if (screen.height > screen.width) {
            console.log('to vertical')
            
        }
        else {
            console.log('to horizontal')
        }
    }

}



const mobile = () => {
    let check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
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

