import { HttpClient } from './HttpClient.js'
import { Graph } from './Graph.js'
import { SessionManager } from './game/SessionManager.js'


const http = new HttpClient()
const sessionManager = new SessionManager(http)
var graphs = []


document.addEventListener("DOMContentLoaded", async () => {

    setMobileFlag()     //inserts text flag in header if mobile device
    const sessionsIds = localStorage.getItem('sessions')
    const sessions = !!sessionsIds ? await http.getSessions(sessionsIds) : []
    sessions.reverse().forEach( async (session, i) =>
        document.getElementById('scores-page')
        .appendChild(await generateSessionElement(session, i)))

})


const generateSessionElement = async (sessionData, i) => {
    const sessionEl = document.createElement('div')
    const container = document.createElement('div')
    const lp = document.createElement('div')
    const date = document.createElement('div')
    const startTime = document.createElement('div')
    const stopTime = document.createElement('div')
    const coins = document.createElement('div')
    const win = document.createElement('div')
    const totalCoins = document.createElement('div')
    const totalWin = document.createElement('div')
    const spinsNumber = document.createElement('div')
    const openButton = document.createElement('button')
    const removeButton = document.createElement('button')

    const graph = document.createElement('canvas')
    graph.setAttribute('id', 'graph-' + sessionData.id)

    const graphContainer = document.createElement('div')
    graphContainer.classList.add('graph-container')
    graphContainer.appendChild(graph)

    const spins = await http.sessionSpins(sessionData.id)
    
    lp.innerHTML = i+1
    date.innerHTML = new Date(sessionData.start_time).toLocaleDateString()
    startTime.innerHTML = new Date(sessionData.start_time).toLocaleTimeString()
    stopTime.innerHTML = new Date(sessionData.stop_time).toLocaleTimeString()
    coins.innerHTML = sessionData.coins
    win.innerHTML = sessionData.win
    totalCoins.innerHTML = '100'
    totalWin.innerHTML = getTotalWin(spins)
    spinsNumber.innerHTML = Array.isArray(spins) ? spins.length : 0
    openButton.addEventListener('click', (event) => onOpenButton(event, sessionData.id))
    removeButton.addEventListener('click', (event) => onRemoveButton(event, sessionData.id))
    openButton.innerHTML = 'open'
    removeButton.innerHTML = 'remove'

    container.appendChild(lp)
    container.appendChild(date)
    container.appendChild(startTime)
    container.appendChild(stopTime)
    container.appendChild(coins)
    container.appendChild(win)
    container.appendChild(totalCoins)
    container.appendChild(totalWin)
    container.appendChild(spinsNumber)
    container.appendChild(openButton)
    container.appendChild(removeButton)
    container.classList.add('data')
    
    sessionEl.appendChild(container)
    sessionEl.appendChild(graphContainer)
    sessionEl.classList.add('session')
    sessionEl.setAttribute('id', sessionData.id)
    return sessionEl
}


const onOpenButton = (event, sessionId) => {
    const clicked = document.getElementById(sessionId)
    if (clicked.classList.contains('open')) {
        clicked.classList.remove('open')
        event.target.innerHTML = 'open'
    }
    else {
        clicked.classList.add('open')
        event.target.innerHTML = 'close'
        if (!clicked.classList.contains('loaded')) {
            clicked.classList.add('loaded')
            setTimeout(() => generateGraph(sessionId),200)
        }
    }
}


const onRemoveButton = (event, sessionId) => {
    sessionManager.removeFromSessions(parseInt(sessionId))
    document.getElementById(sessionId).remove()
}


// GRAPHS
const generateGraph = async (sessionId) => {
    const config = {
        id: 'graph-' + sessionId,
        width: '100%',
        height: '100%',
        // height: screen.width > 576 ? 600 : 350
    }
    const graph = new Graph(config)
    const spins = await http.sessionSpins(sessionId)
    const steps = Array.isArray(spins) ? getSteps(spins) : []
    const winSteps = steps.map(step => step.win)
    const coinsSteps = steps.map(step => step.coins)
    graph.addCurve(winSteps, false, winCurveConfig)
    graph.addCurve(coinsSteps, false, coinsCurveConfig)
    graph.print()
}


const getSteps = (spins) => {
    let currentCoins = 100
    let currentWin = 0
    const steps = spins.map(spin => {
        currentCoins = spin.bet < 0 ? currentCoins + spin.score : currentCoins - spin.bet
        currentWin += spin.bet * spin.score
        return {
            coins: currentCoins,
            bet: spin.bet,
            win: currentWin
        }
    })
    const zero = { coins: 100, bet: 1, win: 0 }
    return [zero, ...steps]
}


const getTotalWin = (spins) => {
    let scoresUp = Array.isArray(spins) ? spins.map(spin => spin.bet > 0 ? spin.score*spin.bet : 0) : []
    return !!scoresUp.length ? scoresUp.reduce((x, y) => x + y) : 0
}


const winCurveConfig = {
    name: 'Win',
    width: 6,
    dashed: 0,
    color: '#31add2'
}

const coinsCurveConfig = {
    name: 'Coins',
    width: 4,
    dashed: 10,
    color: '#31a24c'
}

const mobile = () => {
    let check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
}

const setMobileFlag = () => document.getElementById('js-mobile-flag').hidden = !mobile()
