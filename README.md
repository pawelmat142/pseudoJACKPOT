# pseudoJackpot
Simple jackpot gambling machine simulator

#### You can view the live application [here](http://130.162.34.50:8001/).

## **Overview**

This project is a simple jackpot gambling machine simulator developed as first part of my journey to enhance my skills and build my first portfolio project.
The motivation behind creating this app was to:

- **Learn JavaScript and Node.js:** Enhance my understanding of JavaScript and Node.js by building a functional application.

- **Explore Server Management:** Gain practical experience in setting up and managing servers.

- **Integrate Databases:** Develop skills in database integration.


## **Technologies**
Project is created with:
* Vanilla JS 
* Node.js v17.4.0
* HTML5, CSS3
* MongoDB 

<br>

## **Graphics**
The graphics for this project were created by my talented friend Krzywas. You can check out more of their work on Instagram.

<br>

## Setup
To run this project locally follow these steps: 
* go to your workspace directory, open it with IDE
* run in terminal usin npm:
```
$ git clone https://github.com/pawelmat142/pseudojackpot.git
$ cd pseudoJackpot
$ npm install
$ node jackpot.js
```

open web browser and go to: http://localhost:8001/

<br>

## How it works
Each shot(spin) generates a score in the form of one of 12 possible numbers: 2, 3, 5, 6, 10, 12, 20, 25, 30, 40, 50, or 100. The probability of hitting each number is inversely proportional to the value of the result.

Each outcome has 4 possible ways of presenting the result, with the selection of the presentation being pseudorandom. The result of 100 has only 1 possible presentation.

The win multiplier can be adjusted through configuration, and is set by default to ensure a satisfying experience for the user.

<br>

### Security

The app is not secured, and the `.env` files are public. This is intentional as the applications are developed for educational and portfolio purposes. This approach helps with maintaining and presenting the projects with minimal configuration required.