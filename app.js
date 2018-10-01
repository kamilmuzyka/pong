document.addEventListener('DOMContentLoaded', function () {

    /* 
     * Canvas
     */
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth * 0.625;
    canvas.height = Math.round(canvas.width / 1.618033);
    const cw = canvas.width;
    const ch = canvas.height;

    /* 
     * Table
     */
    const dashWidth = cw * 0.006;
    const dashHeight = ch * 0.025;

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

        // Wall collision at X axis
        if (ballX <= 0) {
            computerScore++;
            setBallFactors();
        } else if (ballX + ballSize >= cw) {
            userScore++;
            setBallFactors();
        }

        // Wall collision at Y axis
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
    const velocityIncrease = 5;
    const signs = [true, false];

    function setBallFactors() {
        ballX = (cw / 2) - (ballSize / 2);
        ballY = (ch / 2) - (ballSize / 2);

        directionX = signs[Math.round(Math.random())] ? "+" : "-";
        directionY = signs[Math.round(Math.random())] ? "+" : "-";

        velocityRateX = Number(directionX + (0.001 + Math.random() * 0.0004));
        velocityRateY = Number(directionY + (0.001 + Math.random() * 0.0004));

        ballXV = cw * velocityRateX * velocityIncrease;
        ballYV = ch * velocityRateY * velocityIncrease;
    }

    setBallFactors();

    // Update ball's velocity on collision
    function updateVelocity() {
        if (ballXV > 0 && ballXV < cw * 0.015) {
            ballXV += cw * 0.00025;
        } else if (ballXV < 0 && ballXV > -cw * 0.015) {
            ballXV -= cw * 0.00025;
        }

        if (ballYV > 0 && ballYV < ch * 0.015) {
            ballYV += ch * 0.00025;
        } else if (ballYV < 0 && ballYV > -ch * 0.015) {
            ballYV -= ch * 0.00025;
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
                computerY -= ch * 0.028;
            } else if (middleComputerY - middleBallY > ch * 0.1) {
                computerY -= ch * 0.018;
            } else if (middleComputerY - middleBallY < -(ch * 0.35)) {
                computerY += ch * 0.028;
            } else if (middleComputerY - middleBallY < -(ch * 0.1)) {
                computerY += ch * 0.018;
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
     * Game control
     */

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

    let gameInterval = setInterval(game, 1000 / 60);

    // Restart game
    function restart() {
        ballX = (cw / 2) - (ballSize / 2);
        ballY = (ch / 2) - (ballSize / 2);
        userScore = 0;
        computerScore = 0;
        setBallFactors();
    }

    // Pause game
    function pause() {
        clearInterval(gameInterval);
    }

    // Resume game
    function resume() {
        gameInterval = setInterval(game, 1000 / 60);
    }
});