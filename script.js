var game = {};
var ball = {};
var gameArea = {};
var rp = {};
var lp = {};
var sl = {};
var sr = {};

var paddleMargin = 50;
var paddleSpeed = 250 / 1000;
var ballSpeed = 300 / 1000;
var lastTick = 0;
var controls = {
	player1UP : "s",
	player1DOWN : "w",
	player2UP : "ArrowUp",
	player2DOWN : "ArrowDown"
}

var keysPressed = {};

function init(){

    initGOs();

    document.addEventListener("keydown", function (keyEvent){
        keysPressed[keyEvent.key] = true;
    });
    document.addEventListener("keyup", function (keyEvent){
        keysPressed[keyEvent.key] = false;
    });


    requestAnimationFrame(loop);


}

function loop(ts) {
    var delta = ts - lastTick;
   // console.log(ts);
    //console.log(keyPressed)
    handleInput(delta);
    
        updateGame(delta);
    
    

    lastTick = ts;
    requestAnimationFrame(loop);
}

function handleInput(delta) {
    //console.log("handleInput")

    if (keysPressed[controls.player1UP]) {
        lp.y -= delta * paddleSpeed;
    }
if (keysPressed[controls.player1DOWN]) {
    lp.y += delta * paddleSpeed;
}
if (keysPressed[controls.player2UP]) {
    rp.y -= delta * paddleSpeed;
}
if (keysPressed[controls.player2DOWN]) {
    rp.y += delta * paddleSpeed;
}
if (lp.y < 0) {
    lp.y = 0
}
if (lp.y > playArea.height - lp.height) {
    lp.y = playArea.height - lp.height;
}
if (rp.y < 0) {
    rp.y = 0
}
if (rp.y > playArea.height - rp.height) {
    rp.y = playArea.height - rp.height;
}

updateDOMFromGO(lp);
updateDOMFromGO(rp);
}

function updateGame(delta) {
    ball.x += delta * ballSpeed * ball.direction.x;
	ball.y += delta * ballSpeed * ball.direction.y;

	if (ball.x < 0) {
		ball.x = 0;
        ball.direction.x *= -1;
        ball.direction.y *= -1;

        sr.score = parseInt(sr.score) + 1;
        sr.dom.innerText = sr.score;

        ball.x = (playArea.width - ball.width)/2;
        ball.y = (playArea.height - ball.height)/2;
        ballSpeed = 0.3;
        

		console.log(sr.score, ballSpeed)
	}
	if (ball.x > playArea.width - ball.width) {
		ball.x = playArea.width - ball.width;
        ball.direction.x *= -1;
        ball.direction.y *= -1;
        
        sl.score = parseInt(sl.score) + 1;
        sl.dom.innerText = sl.score;
      
        ball.x = (playArea.width - ball.width)/2;
        ball.y = (playArea.height - ball.height)/2;
        ballSpeed = 0.3;
        

		console.log(sl.score, ballSpeed)
	}
	if (ball.y < 0) {
		ball.y = 0;
        ball.direction.y *= -1;
        
	}
	if (ball.y > playArea.height - ball.height) {
		ball.y = playArea.height - ball.height;
        ball.direction.y *= -1;
        
	}
	updateDOMFromGO(ball);
	aabbCollision(lp,ball);
    aabbCollision(rp,ball);
    updateDOMFromGO(sr);
    updateDOMFromGO(sl);
}


function aabbCollision(go1, go2) {
	if (go1.x < go2.x + go2.width &&
		go1.x + go1.width > go2.x &&
		go1.y < go2.y + go2.height &&
		go1.y + go1.height > go2.y) {
            ball.direction.x *= -1;
            
            if (ballSpeed < 0.65) {
                ballSpeed  = ballSpeed * 1.07;
            }
			console.log(ballSpeed)
	 }
	 //console.log("nocolli")
}

function wait(ms){
    var start = new Date().getTime();
    var end = start;
    while(end < start + ms) {
      end = new Date().getTime();
   }
 }



function initGOs(){

    game.x = 0;
    game.y = 0;
    game.dom = document.getElementById("game");
    game.width = game.dom.offsetWidth;
    game.height = game.dom.offsetHeight;
    
    updateDOMFromGO(game);
   
    playArea.dom = document.getElementById("playArea");
    playArea.width = playArea.dom.offsetWidth;
    playArea.height = playArea.dom.offsetHeight;
    playArea.x = (game.width - playArea.width)/2;
    playArea.y = (game.height - playArea.height)/2;
    
    updateDOMFromGO(playArea);
   
    ball.dom = document.getElementById("ball");
    ball.width = ball.dom.offsetWidth;
    ball.height = ball.dom.offsetHeight;
    ball.x = (playArea.width - ball.width)/2;
    ball.y = (playArea.height - ball.height)/2;
    ball.direction = {
        x : 1,
        y : 1
    };
    
    updateDOMFromGO(ball);
   
    lp.dom = document.getElementById("leftPaddle");
    lp.width = lp.dom.offsetWidth;
    lp.height = lp.dom.offsetHeight;
    lp.x = paddleMargin;
    lp.y = (playArea.height - lp.height)/2;
    
    updateDOMFromGO(lp);
   
   
    rp.dom = document.getElementById("rightPaddle");
    rp.width = rp.dom.offsetWidth;
    rp.height = rp.dom.offsetHeight;
    rp.x = playArea.width - rp.width - paddleMargin;
    rp.y = (playArea.height - rp.height)/2;
    updateDOMFromGO(rp);
   
    sl.dom = document.getElementById("scoreL");
    sl.width = sl.dom.offsetWidth;
    sl.height = sl.dom.offsetHeight;
    sl.x = paddleMargin * 10;
    sl.y = (playArea.height - lp.height)/5;
    sl.score = sl.dom.innerText;
    updateDOMFromGO(sl);

    sr.dom = document.getElementById("scoreR");
    sr.width = sr.dom.offsetWidth;
    sr.height = sr.dom.offsetHeight;
    sr.x = playArea.width - rp.width - paddleMargin * 10;
    sr.y = (playArea.height - lp.height)/5;
    sr.score = sr.dom.innerText;
    updateDOMFromGO(sr);

   }
   
   function updateDOMFromGO(go){
   
       go.dom.style.width = go.width + "px";
       go.dom.style.height = go.height + "px";
       go.dom.style.top = go.y + "px";
       go.dom.style.left = go.x + "px";
   
   }

