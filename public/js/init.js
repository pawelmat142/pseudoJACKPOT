import { HttpClient } from './HttpClient.js'
import { StateFactory } from './game/StateFactory.js'
import { GameBoard } from './game/GameBoard.js'
import { GameUI } from './game/GameUI.js'
import { AudioManager } from './AudioManager.js'
import { SessionManager } from './game/SessionManager.js'


const httpClient = new HttpClient() 


const audioManager = new AudioManager(0.6)


const session = new SessionManager(httpClient)


// client side random items generator
const stateFactory = new StateFactory()

// DOM operations - rolling board
const gameBoard = new GameBoard(stateFactory, audioManager)


// getting scores from server side and
// DOM operations - User Interface
new GameUI(session, gameBoard, httpClient, audioManager)
