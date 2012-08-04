$(function() {
var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');

var thisLoop, lastLoop;
var basicCounter = 0;

endText = "GAME OVER!!!"
endTextWidth = 200;

var paddleX = 200;
var paddleY = 460;

var paddleWidth = 100;
var paddleHeight = 15;

var paddleDeltaX = 0;
var paddleDeltaY = 0;
var paddleSpeedX = 10;

var ballX = 300;
var ballY = 300;
var ballRadius = 10;

var colors = {
	"1" : "orange", //orange
	"2" : "rgb(100,200,100)", //green
	"3" : "rgba(50,100,50,.5)", //clearish/grey
	"4" : "rgb(90,120,190)" //bluish
}


function drawPaddle(){
	context.fillStyle = colors['2'];
	context.fillRect(paddleX, paddleY, paddleWidth, paddleHeight);
}

function movePaddle(x){
	if (x){
		paddleX = x - (paddleWidth / 2);
		return;
	}
	if (paddleMove =='LEFT'){
		paddleDeltaX = -paddleSpeedX;
	}
	else if (paddleMove == 'RIGHT'){
		paddleDeltaX = paddleSpeedX;
	}
	else{
		paddleDeltaX = 0;
	}
	if (paddleX + paddleDeltaX < 0 || paddleX + paddleDeltaX +paddleWidth >canvas.width ){
		paddleDeltaX = 0;
	}
	paddleX = paddleX + paddleDeltaX;
}

function drawBall(){
	context.beginPath();
	context.arc(ballX,ballY,ballRadius,0,Math.PI*2,true);
	context.fillStyle = colors['4'];
	context.fill();
}

function moveBall(){
	var ballBottomY = ballY + ballDeltaY + ballRadius
	var ballTopY = ballY + ballDeltaY - ballRadius;
	var ballLeftX = ballX + ballDeltaX - ballRadius;
	var ballRightX = ballX + ballDeltaX + ballRadius;

	//check for Paddle hit
	if (ballBottomY >= paddleY && ballBottomY <= paddleY + (paddleHeight / 2)){ // If the ball is at paddleY but not more than halfway.
		if (ballX + ballDeltaX >= paddleX && ballX + ballDeltaX <= paddleX +paddleWidth){ // and that shit is within the X of paddleX.
			ballDeltaY = -ballDeltaY;
			//to do, change X based on distance of ball from center of paddle.
		}
	}

	//Flip directions if we get < 0 on Y. Likewise for X.
	if (ballTopY < 0){
		ballDeltaY = -ballDeltaY;
	}

	if (ballBottomY > canvas.height){
		endGame();
	}

	if ((ballLeftX < 0) || (ballRightX > canvas.width)){
		ballDeltaX = -ballDeltaX;
	}

	ballX = ballX + ballDeltaX;
	ballY = ballY + ballDeltaY;
}

var bricksPerRow = 16;
var brickHeight = 20;
var brickWidth = canvas.width/bricksPerRow;

// 1 is orange, 2 is green, 3, is gray, 0 is empty
var bricks = [
	[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
	[1,1,1,2,1,1,1,1,0,2,1,1,1,0,2,1],
	[1,1,1,3,1,1,1,1,1,1,1,0,1,1,1,1],
	[1,1,2,1,1,1,1,0,1,1,1,1,1,1,1,1],
	[1,1,1,2,1,3,1,1,0,2,3,1,3,0,3,1],
	[1,1,1,3,1,1,1,1,1,1,1,0,1,1,1,1],
	[1,1,1,0,1,1,1,1,0,1,1,0,1,3,1,1],
	[1,2,1,2,1,1,0,1,1,1,1,1,1,3,1,1]
]

function createBricks(){
	for (var i=0; i < bricks.length; i++){
		for (var j=0; j < bricks[i].length; j++){
			drawBrick(j,i,bricks[i][j]);
		}
	}
}

//draw dat bricks
function drawBrick(x,y,type){
	if (type){
		context.fillStyle = colors[type];
		context.fillRect(x*brickWidth,y*brickHeight,brickWidth,brickHeight);
		context.strokeRect(x*brickWidth+1,y*brickHeight+1,brickWidth-2,brickHeight-2);
	}
	else{
		context.clearRect(x*brickWidth,y*brickHeight,brickWidth,brickHeight);
	}
}

function loopCycle(){
	thisLoop = new Date;
	//This is going to run at 50fps and redraw everything after clearing.
	clearScreen();
	createBricks();
	moveBall();
	movePaddle();
	drawPaddle();
	drawBall();

	var fps = 1000 / (thisLoop - lastLoop);
	basicCounter++
	if (basicCounter > 100){
		basicCounter = 0;
		console.log(fps);
	}
	lastLoop = thisLoop;

}

function clearScreen(){
	context.clearRect(0,0,canvas.width,canvas.height);
}

function startGame(){
	ballDeltaY = -4;
	ballDeltaX = -2;
	paddleMove = 'NONE';
	paddleDeltaX = 0;
	gameLoop = setInterval(loopCycle,20); //We're going to loopCycle ever 20ms. That should be 50 fps.

	//keystroke listeners
	$(document).keydown(function(evt) {
		if (evt.keyCode == 39){
			paddleMove = 'RIGHT';
		}
		else if (evt.keyCode == 37){
			paddleMove = 'LEFT';
		}
	});

	$(document).keyup(function(evt) {
		if (evt.keyCode == 39 || evt.keyCode == 37) {
			paddleMove = 'NONE';
		}
	})

	//mousemove listener.
	$('#canvas').mousemove(function(evt){
		movePaddle(evt.pageX - this.offsetLeft);
	});

	//touchmove listener.
	$('#canvas').bind('touchmove',function(evt){
		evt.preventDefault();
		var touch = evt.originalEvent.touches[0] || evt.originalEvent.changedTouches[0];
		movePaddle(touch.pageX - this.offsetLeft);
	});


}

function endGame(){
	clearInterval(gameLoop);
	context.fillStyle = 'white';
	context.font = "20pt Courier";
	context.fillText(endText, canvas.width/2 - endTextWidth/2,canvas.height/2, endTextWidth);
}

startGame();

});