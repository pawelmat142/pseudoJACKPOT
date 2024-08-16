export const config = {
  "board": {
    "rows": 3,
    "cols": 3
  },

  

  "DOMids": {
    "board": "game-board",

    "coins": "coins",
    "bet": "bet",
    "win": "win",
    "topScreen": "top-screen"
  },

  

  "roll": {
    "minInterval": 0.1,
    "maxInterval": 8,    
    "stopInterval": 12,   
    "step": 3,            

    "stopDelay": 200,     
    "startDelay": 50  

  },
  
  
  "spin": {
    "spinTime": 500,   
    "highLightTime": 330,
    "highLightInterval": 350
  },


  "ui": {
    "transferTime": 500,
    "volume": 0.6
  },
  


  "availableItems": [
    {
      "name": "W",
      "src": "../img/W.png",
      "score": 1,
      "description": "Cherry"
    },
    {
      "name": "C",
      "src": "../img/C.png",
      "score": 2,
      "description": "Banana"
    },
    {
      "name": "P",
      "src": "../img/P.png",
      "score": 5,
      "description": "Tomato"
    },
    {
      "name": "A",
      "src": "../img/A.png",
      "score": 10,
      "description": "Avocado"
    },
    {
      "name": "S",
      "src": "../img/S.png",
      "score": 20,
      "description": "Sevens"
    }
  ]
}