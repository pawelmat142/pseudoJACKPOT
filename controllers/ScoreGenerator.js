const config = require('../public/gameConfig.json')
const scores = require("./scores")

class ScoreGenerator {
    
    constructor() {
        // this.chance = 40
        this.chance = 90 // int <1, 100>
        this.maxScore = 100 
        this.divider = 100

        this.maxShot = this.maxScore * this.divider

        this._scores = scores.map(el => el.score)
    }


    getScore = (_shot) => {
        const shot = _shot || this.getShot()
        let a = this._scores.filter(score => shot > (this.maxShot - (this.maxScore * this.chance / score)))
        return !!a.length ? a.pop() : 0 
    }

    getShot = () => getRandomInt(1, this.maxShot)
}


const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


module.exports = new ScoreGenerator()