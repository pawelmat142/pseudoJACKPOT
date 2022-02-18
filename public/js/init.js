import { HttpClient } from './HttpClient.js'
import { StateFactory } from './game/StateFactory.js'
import { GameBoard } from './game/GameBoard.js'
import { GameUI } from './game/GameUI.js'
import { AudioManager } from './AudioManager.js'

const httpClient = new HttpClient() 

const audio = new AudioManager()

// client side random items generator
const stateFactory = new StateFactory()

// DOM operations - rolling board
const gameBoard = new GameBoard(stateFactory)

// getting scores from server side and
// DOM operations - User Interface
new GameUI(gameBoard, httpClient, audio)
