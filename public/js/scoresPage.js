import { HttpClient } from './HttpClient.js'
import { MyGraph } from './MyGraph.js'
import { Graph } from './Graph.js'


const http = new HttpClient()


document.addEventListener("DOMContentLoaded", async () => {

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
    const button = document.createElement('button')

    const graph = document.createElement('canvas')
    graph.setAttribute('id', 'graph-' + sessionData.id)

    const graphContainer = document.createElement('div')
    graphContainer.classList.add('graph-container')
    graphContainer.appendChild(graph)

    const spins = await http.sessionSpins(sessionData.id)
    
    lp.innerHTML = i
    date.innerHTML = new Date(sessionData.start_time).toLocaleDateString()
    startTime.innerHTML = new Date(sessionData.start_time).toLocaleTimeString()
    stopTime.innerHTML = new Date(sessionData.stop_time).toLocaleTimeString()
    coins.innerHTML = sessionData.coins
    win.innerHTML = sessionData.win
    totalCoins.innerHTML = '100'
    totalWin.innerHTML = getTotalWin(spins)
    spinsNumber.innerHTML = Array.isArray(spins) ? spins.length : 0
    button.addEventListener('click', (event) => toggleButton(event, sessionData.id))
    button.innerHTML = 'open'
    
    container.appendChild(lp)
    container.appendChild(date)
    container.appendChild(startTime)
    container.appendChild(stopTime)
    container.appendChild(coins)
    container.appendChild(win)
    container.appendChild(totalCoins)
    container.appendChild(totalWin)
    container.appendChild(spinsNumber)
    container.appendChild(button)
    container.classList.add('data')
    
    sessionEl.appendChild(container)
    sessionEl.appendChild(graphContainer)
    sessionEl.classList.add('session')
    sessionEl.setAttribute('id', sessionData.id)
    return sessionEl
}


const toggleButton = (event, sessionId) => {
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
            generateGraph(sessionId)
        }
    }
}


// GRAPHS
const generateGraph = async (sessionId) => {
    const config = {
        id: 'graph-' + sessionId,
        width: '100%',
        height: 600,
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