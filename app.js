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
    const ballX = (cw / 2) - (ballSize / 2);
    const ballY = (ch / 2) - (ballSize / 2);

    // Rackets
    const racketWidth = cw * 0.02;
    const racketHeight = ch * 0.2;

    const playerX = cw * 0.07;
    const playerY = (ch / 2) - (racketHeight / 2);

    const computerX = cw - (cw * 0.07 + racketWidth);
    const computerY = (ch / 2) - (racketHeight / 2);

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
    }

    function player() {
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(playerX, playerY, racketWidth, racketHeight);
    }

    function computer() {
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(computerX, computerY, racketWidth, racketHeight);
    }

    table();
    ball();
    player();
    computer();
});