$(function() {
var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');

var paddleX = 200;
var paddleY = 460;

var paddleWidth = 100;
var paddleHeight = 15;

var paddleDeltaX = 0;
var paddleDeltaY = 0;

var ballX = 300;
var ballY = 300;
var ballRadius = 10;

function drawPaddle(){
	context.fillRect(paddleX, paddleY, paddleWidth, paddleHeight);
}

function drawBall(){
	context.beginPath();
	context.arc(ballX,ballY,ballRadius,0,Math.PI*2,true);

	context.fill();
}

var bricksPerRow = 16;
var brickHeight = 20;
var brickWidth = canvas.width/bricksPerRow;

// 1 is orange, 2 is green, 3, is gray, 0 is empty
var bricks = [
	[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
	[1,1,1,2,1,1,1,1,0,2,1,1,1,1,1,1],
	[1,1,1,3,1,1,1,1,1,1,1,0,1,1,1,1],
	[1,1,1,0,1,1,1,1,0,1,1,0,1,1,1,1],
	[1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1]
]

var colors = {
	"1" : "orange",
	"2" : "rgb(100,200,100)",
	"3" : "rgba(50,100,50,.5)"
}

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


drawPaddle();
drawBall();
createBricks();

});