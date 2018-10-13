document.addEventListener('DOMContentLoaded', function () {

    /* 
     * Canvas
     */
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    // canvas.width = window.innerWidth * 0.625;
    canvas.width = 900;
    canvas.height = Math.round(canvas.width / 1.618033);
    const cw = canvas.width;
    const ch = canvas.height;

    /* 
     * Table
     */
    const dashWidth = cw * 0.006;
    const dashHeight = ch * 0.025;

    // Draw table
    function table() {
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, cw, ch);
        for (let i = ch * 0.03; i < ch - ch * 0.03; i += ch * 0.05) {
            ctx.fillStyle = '#808080';
            ctx.fillRect(cw / 2 - dashWidth / 2, i, dashWidth, dashHeight);
        }
    }

    /* 
     * Ball
     */
    const ballSize = cw * 0.02;
    let ballX;
    let ballY;

    // Draw ball
    function ball() {
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(ballX, ballY, ballSize, ballSize);

        ballX += ballXV;
        ballY += ballYV;

        checkCollision();
    }

    // Check ball's collision
    function checkCollision() {

        // Wall collision on the X axis
        if (ballX <= 0) {
            computerScore++;
            setBallFactors();
        } else if (ballX + ballSize >= cw) {
            userScore++;
            gameData.totalGoals++;
            if (userScore - computerScore > gameData.topDominance[2]) {
                gameData.topDominance[0] = userScore;
                gameData.topDominance[1] = computerScore;
                gameData.topDominance[2] = userScore - computerScore;
            }

            if (userScore > gameData.topGoals) {
                gameData.topGoals = userScore;
            }

            updateLocalStorage();
            setBallFactors();
        }

        // Wall collision on the Y axis
        if (ballY <= 0 || ballY + ballSize >= ch) {
            ballYV = -ballYV;
            updateVelocity();
        }

        // Collision with rackets
        if (
            ballX <= playerX + racketWidth &&
            ballX > playerX &&
            ballY >= playerY - ballSize &&
            ballY <= playerY + racketHeight
        ) {
            ballX = playerX + racketWidth;
            ballXV = -ballXV;
            updateVelocity();
        } else if (
            ballX >= computerX &&
            ballX < computerX + racketWidth &&
            ballY >= computerY - ballSize &&
            ballY <= computerY + racketHeight
        ) {
            ballX = computerX - racketWidth;
            ballXV = -ballXV;
            updateVelocity();
        }
    }

    // Initial ball's direction and velocity
    let directionX, directionY, velocityRateX, velocityRateY, ballXV, ballYV;
    const velocityIncrease = 4;
    const signs = [true, false];

    function setBallFactors() {
        ballX = (cw / 2) - (ballSize / 2);
        ballY = (ch / 2) - (ballSize / 2);

        directionX = signs[Math.round(Math.random())] ? "+" : "-";
        directionY = signs[Math.round(Math.random())] ? "+" : "-";

        velocityRateX = Number(directionX + (Math.random() * (0.0015 - 0.001) + 0.001));
        velocityRateY = Number(directionY + (Math.random() * (0.0015 - 0.0001) + 0.0001));

        ballXV = cw * velocityRateX * velocityIncrease;
        ballYV = ch * velocityRateY * velocityIncrease;
    }

    setBallFactors();

    // Update ball's velocity on collision
    function updateVelocity() {
        if (ballXV > 0 && ballXV < cw * 0.01) {
            ballXV += cw * 0.00031;
        } else if (ballXV < 0 && ballXV > -cw * 0.01) {
            ballXV -= cw * 0.00031;
        }

        if (ballYV > 0 && ballYV < ch * 0.01) {
            ballYV += ch * 0.00031;
        } else if (ballYV < 0 && ballYV > -ch * 0.01) {
            ballYV -= ch * 0.00031;
        }
    }

    /* 
     * Rackets
     */
    const racketWidth = cw * 0.02;
    const racketHeight = ch * 0.2;

    /* 
     * Player's racket
     */

    // Player's X,Y
    const playerX = cw * 0.07;
    let playerY = (ch / 2) - (racketHeight / 2);

    // Draw player's racket
    function player() {
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(playerX, playerY, racketWidth, racketHeight);
    }

    // Update player's X,Y
    function playerPosition(e) {
        playerY = e.offsetY - racketHeight / 2;

        if (playerY >= ch - racketHeight) {
            playerY = ch - racketHeight;
        } else if (playerY <= 0) {
            playerY = 0;
        }
    }

    canvas.addEventListener('mousemove', playerPosition);

    /* 
     * Computer's racket
     */

    // Computer's X, Y
    const computerX = cw - (cw * 0.07 + racketWidth);
    let computerY = (ch / 2) - (racketHeight / 2);

    // Draw computer's racket
    function computer() {
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(computerX, computerY, racketWidth, racketHeight);
    }

    // Update computer's X,Y (Imitate AI)
    function computerPosition() {
        if (computerY >= ch - racketHeight) {
            computerY = ch - racketHeight;
        } else if (computerY <= 0) {
            computerY = 0;
        }
        const middleComputerY = computerY + racketHeight / 2;
        const middleBallY = ballY + ballSize / 2;
        if (ballX > cw / 2) {
            if (middleComputerY - middleBallY > ch * 0.35) {
                computerY -= ch * 0.023;
            } else if (middleComputerY - middleBallY > ch * 0.1) {
                computerY -= ch * 0.014;
            } else if (middleComputerY - middleBallY < -(ch * 0.35)) {
                computerY += ch * 0.018;
            } else if (middleComputerY - middleBallY < -(ch * 0.1)) {
                computerY += ch * 0.009;
            }
        } else if (ballX <= cw / 2 && ballX > racketWidth + playerX) {
            if (middleComputerY - middleBallY > ch * 0.2) {
                computerY -= ch * 0.005;
            } else if (middleComputerY - middleBallY < ch * 0.2) {
                computerY += ch * 0.005;
            }
        }
    }

    /* 
     * DOM Elements
     */

    // Menu Element
    const menu = document.querySelector('.menu');
    let opaque = '';

    // Handle Menu (Event Bubbling)
    function handleMenu(e) {
        if (e.target.tagName === "A") {
            const fn = e.target.dataset.fn;
            if (fn === "start") {
                start();
            } else if (fn === "main") {
                main();
            } else if (fn === "scores") {
                scores();
            } else if (fn === "settings") {
                settings();
            } else if (fn === "restart") {
                restart();
            } else if (fn === "pause") {
                pause();
            }
        }
    }

    menu.addEventListener('click', handleMenu);

    // Handle ESC
    function handleEscape(e) {
        if (e.keyCode === 27 && !gameStarted) {
            main();
        } else if (e.keyCode === 27 && gameStatus === "playing") {
            pause();
        } else if (e.keyCode === 27 && gameStatus === "paused") {
            resume();
        }
    }

    window.addEventListener('keydown', handleEscape);

    /* 
     * Game control
     */

    // Game control variables
    let gameInterval;
    let gameStatus;
    let gameStarted = false;

    // Game scores data
    const gameData = JSON.parse(localStorage.getItem('gameData')) || {
        totalGoals: 0,
        topGoals: 0,
        topDominance: [0, 0, 0]
    }

    // Update local storage
    function updateLocalStorage() {
        localStorage.setItem('gameData', JSON.stringify(gameData));
    }

    // Update score
    let userScore = 0;
    let computerScore = 0;

    function updateScore() {
        const fontSize = cw * 0.02;
        ctx.font = `${fontSize}px 'Pixel'`;
        ctx.fillStyle = "#FFFFFF";
        ctx.fillText(userScore, cw / 4, ch / 4);
        ctx.fillText(computerScore, cw - cw / 4, ch / 4);
    }

    // Load game
    function game() {
        table();
        ball();
        player();
        computer();
        computerPosition();
        updateScore();
    }

    // Start game
    function start() {
        gameStarted = true;
        gameStatus = "playing";
        menu.classList.remove('open');
        menu.innerHTML = ``;
        gameInterval = setInterval(game, 1000 / 60);
    }

    // Restart game
    function restart() {
        ballX = (cw / 2) - (ballSize / 2);
        ballY = (ch / 2) - (ballSize / 2);
        userScore = 0;
        computerScore = 0;
        setBallFactors();
        gameStatus = "playing";
        menu.classList.remove('open');
        menu.innerHTML = ``;
        gameInterval = setInterval(game, 1000 / 60);
    }

    // Pause game
    function pause() {
        gameStatus = "paused";
        menu.classList.add('open');
        menu.innerHTML = `
            <div class="menu__window" data-window="pause">
                <h2 class="heading">Pause</h2>
                <ul class="navigation">
                    <li class="navigation__item"><a class="navigation__link" data-fn="start" href="#">Resume</a></li>
                    <li class="navigation__item"><a class="navigation__link" data-fn="scores" href="#">Scores</a></li>
                    <li class="navigation__item"><a class="navigation__link" data-fn="settings" href="#">Settings</a></li>
                    <li class="navigation__item"><a class="navigation__link" data-fn="restart" href="#">Restart</a></li>
                </ul>
            </div>
        `;
        clearInterval(gameInterval);
    }

    // Resume game
    function resume() {
        gameStatus = "playing";
        menu.classList.remove('open');
        menu.innerHTML = ``;
        gameInterval = setInterval(game, 1000 / 60);
    }

    // Render main menu
    function main() {
        menu.innerHTML = `
            <div class="menu__window menu__window--opaque" data-window="start">
                <h1 class="heading">Pong</h1>
                <ul class="navigation">
                    <li class="navigation__item"><a class="navigation__link" data-fn="start" href="#">Start</a></li>
                    <li class="navigation__item"><a class="navigation__link" data-fn="scores" href="#">Scores</a></li>
                    <li class="navigation__item"><a class="navigation__link" data-fn="settings" href="#">Settings</a></li>
                </ul>
            </div>
        `;
    }

    // Open scores 
    function scores() {
        let backTo = 'pause';
        opaque = '';

        if (!gameStarted) {
            backTo = 'main';
            opaque = 'menu__window--opaque';
        }

        menu.innerHTML = `
            <div class="menu__window ${opaque}" data-window="scores">
                <h2 class="heading">Scores</h2>
                <ul class="scores">
                    <li>Total Goals: ${gameData.totalGoals}</li>
                    <li>Top Goals: ${gameData.topGoals}</li>
                    <li>Top Dominance: ${gameData.topDominance[2]} (${gameData.topDominance[0]} to ${gameData.topDominance[1]})</li>
                </ul>
                <ul class="navigation">
                    <li class="navigation__item"><a class="navigation__link" data-fn=${backTo} href="#">Exit</a></li>
                </ul>
            </div>
        `;
    }

    // Open settings
    function settings() {
        let backTo = 'pause';
        opaque = '';

        if (!gameStarted) {
            backTo = 'main';
            opaque = 'menu__window--opaque';
        }

        menu.innerHTML = `
            <div class="menu__window ${opaque}" data-window="settings">
                <h2 class="heading">Settings</h2>
                <ul class="navigation">
                    <li class="navigation__item"><a class="navigation__link" data-fn=${backTo} href="#">Exit</a></li>
                </ul>
            </div>
        `;
    }
});