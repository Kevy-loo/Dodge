import React, {Component} from 'react';
import '../Game.css'
const KEY = { //Keyboard key codes
    LEFT: 37,
    RIGHT: 39,
    UP: 38,
    DOWN: 40
}

const maxSize = 500 //size of the board

class Game extends Component {

    constructor() {
        super();
        this.canvasRef = React.createRef();
        this.state = {
            player: {
                x: 250,
                y: 250,
                width: 20,
                height: 20
            },
            bullets: [],
            score: 0,
            highScore: 0,
            touchStart: undefined
        }
        this.draw = this.draw.bind(this)
        this.startGame = this.startGame.bind(this)
    }

    componentDidMount() {
        window.addEventListener('keydown', this.handleKeys.bind(this, true)); //add a listener for the keydown event

        window.addEventListener('touchstart', this.handleTouchStart.bind(this, false)) //add a listener 
        window.addEventListener('touchend', this.handleTouchEnd.bind(this, false)) //add a listener 
        this.startGame(); //begin the game!
    }

    componentWillUnmount() {
        //remove all intervals
        clearInterval(this.accelerateInterval); 
        clearInterval(this.generationInterval);
        clearInterval(this.updateInterval);
        clearInterval(this.detectionInterval);
    }
    /**
     * Begin the game, reset state and initialize intervals
     */
    startGame() {
        this.setState({ 
            player:{
                x: 250,
                y: 250,
                width: 20,
                height: 20
            },
            bullets: [],
            score: 0 }, () => {
                this.draw()
            })

        this.accelerateInterval = setInterval(() => this.accelerateGame(), 7500)
        this.generationIntervalDuration = 1000
        this.generationInterval = setInterval(() => this.generateNewBullet(), this.generationIntervalDuration)
        this.updateIntervalDuration = 25
        this.updateInterval = setInterval(() => this.updateBullets(), this.updateIntervalDuration)
        this.detectionInterval = setInterval(() => this.detectCollisions(), 5)
    }

    /**
     * draws the elements on the canvas
     */
    draw() {
        const context = this.canvasRef.current.getContext("2d");
        context.clearRect(0, 0, this.canvasRef.current.width, this.canvasRef.current.height); //clear it first
        context.fillStyle = "blue"; //use the color blue
        context.fillRect(this.state.player.x, this.state.player.y, this.state.player.width, this.state.player.height); //draw the player's rectangle
        for(const element of this.state.bullets) { //draw the bullets (in red this time!)
            let bullet = element
            context.fillStyle = "red";
            context.fillRect(bullet.x, bullet.y, bullet.width, bullet.height)
        }
    }
    
    /**
     * Event handler for key down
     */
    handleKeys(value, event) {
        if(event.keyCode === KEY.LEFT) this.moveHorizontally(-20)
        if(event.keyCode === KEY.RIGHT) this.moveHorizontally(20)
        if(event.keyCode === KEY.UP) this.moveVertically(-20)
        if(event.keyCode === KEY.DOWN) this.moveVertically(20)
    }

    /**
 * Event handler for touch start
 */
handleTouchStart(event) {
    if (event.changedTouches && event.changedTouches.length > 0) {
        this.setState({ touchStart: event.changedTouches[0] });
    }
}

/**
 * Event handler for touch end
 */
handleTouchEnd(event) {
    if (this.state.touchStart !== undefined && event.changedTouches && event.changedTouches.length > 0) {
        let currentTouch = event.changedTouches[0];
        let touchStart = this.state.touchStart;
        let deltaX = Math.abs(touchStart.clientX - currentTouch.clientX);
        let deltaY = Math.abs(touchStart.clientY - currentTouch.clientY);

        if (deltaX > deltaY) {
            touchStart.clientX > currentTouch.clientX ? this.moveHorizontally(-20) : this.moveHorizontally(20);
        } else if (deltaX < deltaY) {
            touchStart.clientY > currentTouch.clientY ? this.moveVertically(-20) : this.moveVertically(20);
        }
        this.setState({ touchStart: currentTouch });
    }
}

    /**
     * Function to move the player horizontally
     */
    moveHorizontally(value) {
        let player  = this.state.player
        if(player.x + value <= (maxSize - 20) && player.x + value >= 0) {
            player.x += value 
            this.setState({player: player}, () => this.draw())
        }
    }

    /**
     * Function to move the player vertically

     */
    moveVertically(value) {
        let player = this.state.player
        if(player.y + value <= (maxSize - 20) && player.y + value >= 0) {
            player.y += value 
            this.setState({player: player}, () => this.draw())
        }
    }

    /**
     * Function to update the position of the bullets (in other words make them move)
     */
    updateBullets() {
        this.setState(prevState => {
          const bullets = prevState.bullets.reduce((filtered, bullet) => {
            if (bullet[bullet.axis] >= -20 && bullet[bullet.axis] <= maxSize) {
              bullet.nextFrame();
              filtered.push(bullet);
            }
            return filtered;
          }, []); // Provide an empty array as the initial value
      
          const scoreIncrease = prevState.bullets.length - bullets.length;
          const newScore = prevState.score + (scoreIncrease * 1);
      
          return {
            bullets,
            score: newScore,
          };
        }, () => {
          this.detectCollisions(); // Move collision detection here
          this.draw();
        });
      }
      
      
      

    /**
     * Function to generate new bullets
     */
    generateNewBullet() {
        this.setState(prevState => {
          const bullet = {
            axis: Math.round(Math.random()) ? 'x' : 'y',
            direction: Math.round(Math.random()) ? '+' : '-',
            width: 20,
            height: 20,
          };
      
          if (bullet.axis === 'x') {
            bullet.y = prevState.player.y;
            bullet.x = this.calculateInitialBulletX(bullet.direction);
          } else {
            bullet.x = prevState.player.x;
            bullet.y = this.calculateInitialBulletY(bullet.direction);
          }
      
          bullet.nextFrame = () => {
            bullet[bullet.axis] += bullet.direction === '+' ? 2 : -2;
          };
      
          return { bullets: [...prevState.bullets, bullet] };
        });
      }
      
      calculateInitialBulletX(direction) {
        return direction === '+' ? -20 : maxSize;
      }
      
      calculateInitialBulletY(direction) {
        return direction === '+' ? -20 : maxSize;
      }
      
      

    /**
     * Function to detect collisions
     */
    detectCollisions() {
        const { bullets, score, highScore } = this.state;
        let shouldRestart = false;
      
        bullets.forEach(bullet => {
          if (
            bullet.x < this.state.player.x + this.state.player.width &&
            bullet.x + bullet.width > this.state.player.x &&
            bullet.y < this.state.player.y + this.state.player.height &&
            bullet.y + bullet.width > this.state.player.y
          ) {
            shouldRestart = true;
          }
        });
      
        if (shouldRestart) {
          clearInterval(this.accelerateInterval);
          clearInterval(this.updateInterval);
          clearInterval(this.generationInterval);
          clearInterval(this.detectionInterval);
      
          const newHighScore = score > highScore ? score : highScore;
      
          this.setState(
            {
              highScore: newHighScore,
              score: 0,
              bullets: [],
            },
            () => {
              this.startGame();
            }
          );
        }
      }
      
      
      

    /**
     * Function to make bullets being spawned faster with higher velocity
     */
    accelerateGame() {
        clearInterval(this.updateInterval)
        this.updateIntervalDuration = Math.round(this.updateIntervalDuration/1.2)
        this.updateInterval = setInterval(() => this.updateBullets(), this.updateIntervalDuration)

        clearInterval(this.generationInterval)
        this.generationIntervalDuration = Math.round(this.generationIntervalDuration/1.2)
        this.generationInterval = setInterval(() => this.generateNewBullet(), this.generationIntervalDuration)
        
    }

    render() {
        return (
          <div>
            <canvas ref={this.canvasRef} width={maxSize} height={maxSize} className="game-canvas" />
            <div className="score">Score: {this.state.score * 10} | Highscore: {this.state.highScore * 10}</div>
          </div>
        );
      }
}

export default Game;