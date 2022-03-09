
import config from '../gameConfig.json' assert { type: "json" }

export class AudioManager {
    
    constructor (vol) {
        this._volume = vol || 1
        this.dir = `audio/`
        this.muted = mobile() ? true : false 

        if (!mobile()) this.initUI()

        this.it = {
            spinning: new Audio(`${this.dir}spinning.mp3`),
            spin: new Audio(`${this.dir}spin.mp3`),
            moneyTransfer: new Audio(`${this.dir}moneyTransfer.mp3`),
            money: new Audio(`${this.dir}money.mp3`),
            notEnough: new Audio(`${this.dir}notEnough.mp3`),
            openModal: new Audio(`${this.dir}openModal.mp3`),
            closeModal: new Audio(`${this.dir}closeModal.mp3`),
            reset: new Audio(`${this.dir}notEnough.mp3`),
            highlights: new AudioArray(`${this.dir}highlights.mp3`, this._volume),
            highlightsAll: new AudioArray(`${this.dir}highlightsAll.mp3`, this._volume),
            betUp: new AudioArray(`${this.dir}betUp.mp3`, this._volume),
            betDown: new AudioArray(`${this.dir}betDown.mp3`, this._volume),
            colsStop: new AudioArray(`${this.dir}colsStop.mp3`, this._volume),
            changeVolume: new AudioArray(`${this.dir}changeVolume.mp3`, this._volume),
            clickFail: new AudioArray(`${this.dir}clickFail.mp3`, this._volume)
        }

        this.init = {
            spinning: 0.7,
            spin: 0.4,
            moneyTransfer: 1,
            money: 1,
            notEnough: 1,
            openModal: 0.4,
            closeModal: 0.4,
            reset: 1,
            highlights: 1,
            highlightsAll: 1,
            betUp: 0.6,
            betDown: 0.6,
            colsStop: 1,
            changeVolume: 1,
            clickFail: 0.5
        }

        this.volume = this._volume
    }
    

    initUI = () => {

        if (!mobile()) {
            const _interface = getInterface()
            this.interface = document.body.appendChild(_interface)
            this.interface.addEventListener('mouseenter', event => enter(event))
            this.interface.addEventListener('mouseleave', event => leave(event))
            this.interfaceHover = false

            this.line = document.getElementById('volume-line')
            
            this.icon = document.getElementById('volume-icon')
            this.icon.addEventListener('click', event => this.mute(event))
            
            this.clicker = document.getElementById('volume-clicker')
            this.clicker.addEventListener('mousedown', event => mousedown(event))
            this.clicker.addEventListener('mouseup', event => mouseup(event))
            this.clicker.addEventListener('mousemove', event => mousemove(event))
            this.clicker.addEventListener('mouseleave', event => mouseleave(event))
            
        }

        const enter = () => {
            this.interfaceHover = true
            this.interface.classList.add('show')
        }

        const leave = () => {
            this.interfaceHover = false
            setTimeout(() => !this.interfaceHover ? this.interface.classList.remove('show') : {}, 1000)
        }

        const mousedown = (event) => {
            this.mouseFlag = true
            let a = event.target.offsetHeight - event.offsetY - 15
            if (a > 120) a = 120
            if (a < 0) a = 0
            let b = a / 120 
            this.volume = b 
        }
        
        const mouseup = () => {
            if (this.mouseFlag) {
                this.mouseFlag = false
                this.it.changeVolume.play()
            }
        }
        
        const mousemove = (event) => {
            if (this.mouseFlag) {
                let a = event.target.offsetHeight - event.offsetY - 15
                if (a > 120) a = 120
                if (a < 0) a = 0
                let b = a / 120 
                this.volume = b 
            }
        }

        const mouseleave = () => {
            if (this.mouseFlag) {
                this.mouseFlag = false
                this.it.changeVolume.play()
            }
        }
    }
    
    get volume() {
        return this._volume
    }

    set volume(vol) {
        this._volume = vol
        for (let soundName in this.it) {
            let _init = eval(`this.init.${soundName}`)
            eval(`this.it.${soundName}`).volume = vol*_init*config.ui.volume
        }
        this.setIcon()
    } 


    volumeUp = () => {
        let _volume = this.volume + 0.05
        if (_volume > 1) {
            _volume = 1
            this.it.clickFail.play()
        }else this.it.changeVolume.play()
        this.volume = _volume
        return _volume
    }
    
    
    volumeDown = () => {
        let _volume = this.volume - 0.05
        if (_volume < 0) _volume = 0
        this.it.changeVolume.play()
        this.volume = _volume
        return _volume
    }


    mute = (event) => {
        if (!!this.muted) {
            this.setIcon()
            this.muted = false
            this.it.changeVolume.play()
            event.target.classList.remove('active')
            for (let key in this.it) {
                if (this.it[key] instanceof Audio) this.it[key].muted = false
                if (this.it[key] instanceof AudioArray) this.it[key].mute(false)
            }
        } else {
            this.setIcon(true)
            this.muted = true
            event.target.classList.add('active')
            for (let key in this.it) {
                if (this.it[key] instanceof Audio) this.it[key].muted = true
                if (this.it[key] instanceof AudioArray) this.it[key].mute(true)
            }
        }
    }


    setIcon = (zero) => {
        if (!mobile()) {
            if (!!zero) {
                document.getElementById('volume-three').style.display = 'none'
                document.getElementById('volume-two').style.display = 'none'
                document.getElementById('volume-one').style.display = 'none'
                this.setBar(0)
            } else {
                if (this.volume < 0.7) document.getElementById('volume-three').style.display = 'none'
                else document.getElementById('volume-three').style.display = 'block'
                if (this.volume < 0.3) document.getElementById('volume-two').style.display = 'none'
                else document.getElementById('volume-two').style.display = 'block'
                if (this.volume === 0) document.getElementById('volume-one').style.display = 'none'
                else document.getElementById('volume-one').style.display = 'block'
                this.setBar(this.volume)
            }
        }
    }

    setBar = (percent) => this.line.style.height = percent < 100 ? `${percent*100}%` : `${percent}%`
    
}

class AudioArray {

    constructor(src, vol) {
        this.arr5 = [1,2,3,4,5]
        this.array = this.arr5.map(x => new Audio(src))
        this.counter = 0
        this._volume = vol || 1
        this.muted = false
    }

    play = () => {
        this.array[this.counter].play()
        this.counter++
        if (this.counter > 4) this.counter = 0
    }

    mute = (state) => this.array.forEach(el => el.muted = state)

    get volume() { return this.array[0].volume }

    set volume(vol) {
        this._volume = vol
        this.array.forEach(x => x.volume = vol)
    }
}


const getInterface = () => {
    const clicker = document.createElement('div')
    clicker.setAttribute('id', 'volume-clicker')
    const line = document.createElement('div')
    line.setAttribute('id', 'volume-line')
    const bar = document.createElement('div')
    bar.classList.add('bar')
    bar.appendChild(line)
    bar.appendChild(clicker)
    const container = document.createElement('div')
    container.setAttribute('id', 'audio-manager')
    container.appendChild(bar)
    container.appendChild(getIconSVG())
    return container
}


function getIconSVG() {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('fill', '#202124');
    svg.setAttribute('viewBox', '0 0 512 512');
    // svg.setAttribute('stroke', '#202124');
    svg.setAttribute('id', 'volume-icon');

    const pathBig = document.createElementNS('http://www.w3.org/2000/svg','path');
    pathBig.setAttribute('d',"M259.621,81.948c-11.499-5.661-24.952-4.324-35.11,3.491l-112.093,86.225v168.843l112.093,86.225c5.986,4.605,13.114,6.961,20.315,6.96c5.018,0,10.072-1.145,14.795-3.47c11.498-5.662,18.64-17.14,18.64-29.956V111.904C278.261,99.088,271.118,87.61,259.621,81.948z")

    const pathSmall = document.createElementNS('http://www.w3.org/2000/svg','path');
    pathSmall.setAttribute('d',"M50.087,173.087C22.469,173.087,0,195.556,0,223.174v66.783c0,27.618,22.469,50.087,50.087,50.087h28.939V173.087H50.087z")
		
    const pathOne = document.createElementNS('http://www.w3.org/2000/svg','path');
    pathOne.setAttribute('d',"M344.205,173.361c-6.52-6.52-17.092-6.52-23.611,0c-6.52,6.52-6.52,17.091,0,23.611c32.548,32.549,32.548,85.507,0,118.056c-6.52,6.52-6.52,17.091,0,23.611c3.259,3.261,7.532,4.891,11.805,4.891c4.273,0,8.545-1.631,11.806-4.891C389.772,293.071,389.772,218.928,344.205,173.361z")
    pathOne.setAttribute('id','volume-one')
    
    const pathTwo = document.createElementNS('http://www.w3.org/2000/svg','path');
    pathTwo.setAttribute('d',"M391.427,126.139c-6.519-6.519-17.091-6.519-23.611,0c-6.52,6.52-6.52,17.091,0,23.611c58.586,58.586,58.586,153.914,0,212.501c-6.52,6.52-6.52,17.091,0,23.611c3.259,3.26,7.532,4.89,11.805,4.89c4.273,0,8.546-1.63,11.806-4.89C463.033,314.256,463.033,197.744,391.427,126.139z")
    pathTwo.setAttribute('id','volume-two')

    const pathThree = document.createElementNS('http://www.w3.org/2000/svg','path');
    pathThree.setAttribute('d',"M438.649,78.916c-6.52-6.52-17.092-6.52-23.611,0c-6.52,6.52-6.52,17.092,0,23.611c40.995,40.994,63.57,95.499,63.57,153.473s-22.576,112.479-63.57,153.473c-6.52,6.52-6.52,17.091,0,23.611c3.259,3.261,7.532,4.891,11.805,4.891c4.272,0,8.546-1.631,11.806-4.891C485.95,385.784,512,322.894,512,256S485.95,126.217,438.649,78.916z");
    pathThree.setAttribute('id','volume-three')

    svg.appendChild(pathBig);
    svg.appendChild(pathSmall);
    svg.appendChild(pathOne);
    svg.appendChild(pathTwo);
    svg.appendChild(pathThree);

    return svg
}


const mobile = () => {
    let check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
}