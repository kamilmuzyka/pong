document.addEventListener('DOMContentLoaded', function () {
    /* 
     * Initial Values
     */
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth * 0.625;
    canvas.height = Math.round(canvas.width / 1.618033);
    const cw = canvas.width;
    const ch = canvas.height;

    /* 
     * Elements
     */

    // Dashes
    const dashWidth = cw * 0.006;
    const dashHeight = ch * 0.025;

    // Ball
    const ballSize = cw * 0.02;
    let ballX = (cw / 2) - (ballSize / 2);
    let ballY = (ch / 2) - (ballSize / 2);

    const signs = [true, false];

    function randomSign(signs) {
        const index = Math.floor(Math.random() * signs.length);
        return signs[index];
    }

    const signX = randomSign(signs) ? "+" : "-";
    const signY = randomSign(signs) ? "+" : "-";

    const velocityRateX = Number(signX + (Math.random() + 0.5) * 0.0013);
    const velocityRateY = Number(signY + (Math.random() + 0.5) * 0.0013);
    let velocityIncrease = 5;
    let ballXV = cw * velocityRateX * velocityIncrease; // Velocity X
    let ballYV = ch * velocityRateY * velocityIncrease; // Velocity Y

    // Rackets
    const racketWidth = cw * 0.02;
    const racketHeight = ch * 0.2;

    const playerX = cw * 0.07;
    let playerY = (ch / 2) - (racketHeight / 2);

    const computerX = cw - (cw * 0.07 + racketWidth);
    let computerY = (ch / 2) - (racketHeight / 2);

    /* 
     * Functions
     */

    // Draw Table
    function table() {
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, cw, ch);
        for (let i = ch * 0.03; i < ch - ch * 0.03; i += ch * 0.05) {
            ctx.fillStyle = '#808080';
            ctx.fillRect(cw / 2 - dashWidth / 2, i, dashWidth, dashHeight);
        }
    }

    // Draw Ball, Collision detection
    function ball() {
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(ballX, ballY, ballSize, ballSize);

        ballX += ballXV;
        ballY += ballYV;

        if (ballY <= 0 || ballY + ballSize >= ch) {
            ballYV = -ballYV;
            updateVelocity();
        }

        // Ball-Wall collision at X axis
        // if (ballX <= 0 || ballX + ballSize >= cw) {
        //     ballXV = -ballXV;
        //     updateVelocity();
        // }

        // Ball-Racket collision
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

    // Update velocity 
    function updateVelocity() {
        if (ballXV > 0 && ballXV < cw * 0.015) {
            ballXV += cw * 0.00012;
        } else if (ballXV < 0 && ballXV > -cw * 0.015) {
            ballXV -= cw * 0.00012;
        }

        if (ballYV > 0 && ballYV < ch * 0.015) {
            ballYV += ch * 0.00012;
        } else if (ballYV < 0 && ballYV > -ch * 0.015) {
            ballYV -= ch * 0.00012;
        }
    }

    // Draw player's racket
    function player() {
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(playerX, playerY, racketWidth, racketHeight);
    }

    // Update player's racket position
    function playerPosition(e) {
        playerY = e.offsetY - racketHeight / 2;

        if (playerY >= ch - racketHeight) {
            playerY = ch - racketHeight;
        } else if (playerY <= 0) {
            playerY = 0;
        }
    }

    // Draw computer's racket
    function computer() {
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(computerX, computerY, racketWidth, racketHeight);
    }

    // Update computer's racket position
    function computerPosition() {
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

    // Load game
    function game() {
        requestAnimationFrame(game);
        table();
        ball();
        player();
        computer();
        computerPosition();
    }

    canvas.addEventListener('mousemove', playerPosition);
    game();
});