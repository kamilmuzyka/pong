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
    const velocityRateX = 0.001;
    const velocityRateY = 0.0017;
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

    function table() {
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, cw, ch);
        for (let i = ch * 0.03; i < ch - ch * 0.03; i += ch * 0.05) {
            ctx.fillStyle = '#808080';
            ctx.fillRect(cw / 2 - dashWidth / 2, i, dashWidth, dashHeight);
        }
    }

    function ball() {
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(ballX, ballY, ballSize, ballSize);

        ballX += ballXV;
        ballY += ballYV;

        if (ballY <= 0 || ballY + ballSize >= ch) {
            ballYV = -ballYV;
            updateVelocity();
        } else if (ballX <= 0 || ballX + ballSize >= cw) {
            ballXV = -ballXV;
            updateVelocity();
        }
    }

    function updateVelocity() {
        if (ballXV > 0 && ballXV < cw * 0.015) {
            ballXV += cw * 0.0001;
        } else if (ballXV < 0 && ballXV > -cw * 0.015) {
            ballXV -= cw * 0.0001;
        }

        if (ballYV > 0 && ballYV < ch * 0.015) {
            ballYV += ch * 0.0001;
        } else if (ballYV < 0 && ballYV > -ch * 0.015) {
            ballYV -= ch * 0.0001;
        }
    }

    function player() {
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(playerX, playerY, racketWidth, racketHeight);
    }

    function playerPosition(e) {
        playerY = e.offsetY - racketHeight / 2;

        if (playerY >= ch - racketHeight) {
            playerY = ch - racketHeight;
        } else if (playerY <= 0) {
            playerY = 0;
        }

        computerY = playerY;
    }

    function computer() {
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(computerX, computerY, racketWidth, racketHeight);
    }

    function game() {
        requestAnimationFrame(game);
        table();
        ball();
        player();
        computer();
    }

    canvas.addEventListener('mousemove', playerPosition);
    game();
});