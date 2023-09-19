//setup the canvas
const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")

/**make the canvas always fill the screen**/;
(function resize() {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    window.onresize = resize
})()

//for this code (as in code before this line), I almost always use the same stuff, so its going to stay here

//now create the grid of bricks
let gx = 5
let gy = 5
let bricks = Array(gy).fill(0)
let bx = canvas.width / gx
let by = canvas.height / gy / 2
//and make the bricks only fill half the screen
for (let index in bricks) bricks[index] = Array(gx).fill(1)

//create the paddle
let paddle = {
    width: 200,
    speed: 10,
    height: 25,
    x: canvas.width / 2
}

//create the ball
let ball = {
    x: canvas.width / 2,
    y: canvas.height / 4 * 3,
    r: 10,
    sx: (Math.floor(Math.random()) * 2 - 1) * 10,
    sy: (Math.floor(Math.random()) * 2 - 1) * 10
}

//remember the mouse
let lastX = canvas.width / 2
document.addEventListener('mousemove', e => lastX = e.x)

const UPS = 30
setInterval(() => {

    //move the ball
    ball.x += ball.sx
    ball.y += ball.sy

    //make it bounce off the sides
    if (ball.x - ball.r < 0) ball.sx = Math.abs(ball.sx)
    if (ball.x + ball.r > canvas.width) ball.sx = -Math.abs(ball.sx)
    if (ball.y - ball.r < 0) ball.sy = Math.abs(ball.sy)

    //make it bounce off the paddle
    if (ball.x + ball.r > paddle.x - paddle.width / 2 &&
        ball.x - ball.r < paddle.x + paddle.width / 2 &&
        ball.y + ball.r > canvas.height - paddle.height)
        ball.sy = -Math.abs(ball.sy)

    //check for brick hits
    for (let y in bricks)
        for (let x in bricks[y])
            if (bricks[y][x] == 1 &&
                ball.x - ball.r < x * bx + bx &&
                ball.x + ball.r > x * bx &&
                ball.y - ball.r < y * by + by &&
                ball.y + ball.r > y * by) {
                bricks[y][x] = 0
                if (Math.random() < .5) ball.sx *= -1
                else ball.sy *= -1
            }

    //check for the ball going off the bottom
    if (ball.y + ball.r > canvas.height) setTimeout(alert('You lost'),10)

    //move the paddle
    paddle.x += (Math.max(Math.min(lastX - paddle.x, paddle.speed), -paddle.speed))

    //check for win
    let win = true
    for (let y in bricks)
        for (let x in bricks[y])
            if (bricks[y][x] == 1) win = false
    if (win) setTimeout(alert('You won'),10)

}, 1000 / UPS)

    ;
(function render() {
    //first clear the screen
    ctx.fillStyle = 'rgb(0,0,0)'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    //then draw the bricks
    ctx.fillStyle = 'rgb(0,100,0)'
    for (let y in bricks)
        for (let x in bricks[y])
            if (bricks[y][x] == 1)
                ctx.fillRect(x * bx, y * by, bx, by)

    //render the paddle
    ctx.fillStyle = 'rgb(255,255,255)'
    ctx.fillRect(paddle.x - paddle.width / 2, canvas.height - paddle.height, paddle.width, paddle.height)

    //render the ball
    ctx.fillStyle = 'rgb(0,255,0)'
    ctx.fillRect(ball.x - ball.r, ball.y - ball.r, ball.r * 2, ball.r * 2)
    requestAnimationFrame(render)
})()