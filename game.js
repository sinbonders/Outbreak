var highScore = 0;
var restart = 0;
$(runGame);
function runGame(){
var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');
var contextball = canvas.getContext('2d');
clearScreen();

var thisLoop, lastLoop;
var basicCounter = 0;
var musicTimer = 0;

var loseText = "GAME OVER!!!"
var winText = "You Win!!!"
var textWidth = 200;
var levelUpTime = 0;
var timeBetweenLevels = 1700;
var balls = 4;


var keyRight = 39;
var keyLeft = 37;
var keyUp = 38;
var keyDown = 40;
var spaceBar = 32;

var paddleX = 200;
var paddleY = 500;

var paddleWidth = 80;
var paddleHeight = 20;

var paddleDeltaX = 0;
var paddleDeltaY = 0;
var paddleSpeedX = 10;
var ballSpeed = .4;
var maxBallSpeedX = 8;
var criticalVelocity = 15;
var resistance = .97;

var ballX = 300;
var ballY = 300;
var ballRadius = 6;

var gravity = .12;

var polyphonic = 3;

var hitSound = [];
var myLoader = html5Preloader();

for (i = 0; i < polyphonic; i++){
	hitSound[i] = new Audio("hit.wav");
}
var breakSound = [];
for (i = 0; i < polyphonic; i++){
	breakSound[i] = new Audio("break.wav");
	breakSound[i].volume=.6;
}

var bounceSound = new Audio("bounce.wav");
var newBricks = new Audio("newbricks.wav");
newBricks.volume = .6;

myLoader.addFiles('hit.wav', 'break.wav', 'bounce.wav','newbricks.wav'); 
var song = [];
for (i = 1; i < 17; i++){
	song[i] = new Audio("song/note"+i+".wav");
	myLoader.addFiles('song/note'+i+'.wav');
	song[i].volume=.2;
}

var note = 1;

var hit_numb = 0;
var break_numb = 0;

var ballColor = "rgb(168,219,168)";
var arrowColor = "rgba(121,189,154,.3)";
var paddleColor = "rgb(121,189,154)";


var colors = {
	"1" : "rgba(59,134,134,.2)", //green
	"2" : "rgba(59,134,134,.5)", //green
	"3" : "rgba(59,134,134,.8)", //green
	"4" : "rgba(59,134,134,1)", //green
	"5" : "silver"
}

var level = 0;
var levels = [500, 400, 300, 200, 100, 75, 60, 40, 30, 20];


var bricksPerRow = 12;
var brickHeight = 16;
var brickWidth = canvas.width/bricksPerRow;

var bricks = [
	[3,3,3,3,3,3,3,3,3,3,3,3],
	[3,3,3,3,3,3,3,3,3,3,3,3],
	[3,3,2,3,3,3,3,3,3,2,3,3],
	[3,3,3,2,2,3,3,2,2,3,3,3],
	[3,3,3,5,3,2,2,3,5,3,3,3],
	[3,3,3,3,3,3,3,3,3,3,3,3],
	[3,3,3,3,2,3,3,2,3,3,3,3],
	[3,3,3,3,3,2,2,3,3,3,3,3],
	[3,3,3,3,1,1,1,1,3,3,3,3],
	[3,3,3,1,1,1,1,1,1,3,3,3],
	[3,2,1,1,1,1,1,1,1,1,2,3]
]

var score = 0;

var mobile = 0;
var win = window,
	doc = document,
	w = win.innerWidth,
	h = win.innerHeight;

if( win.navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/i) ) { //experimental mobile mode.
	mobile = 1;
	canvas.height = h;
	canvas.width  = w;
	setTimeout(clickToStart, 200);
	paddleY = h - 60;
	}

clickToStart();

function displayScore(){
    //Set the text font and color
    context.fillStyle = paddleColor;
    context.font = "20px monospace";
    
    context.clearRect(0,canvas.height-30,canvas.width,30);  


    context.fillText('SCORE:'+score,10,canvas.height-5);
    context.fillText('LEVEL:'+ (level + 1),canvas.width - 100,canvas.height-5);
    context.fillText('BALLS:'+ balls,canvas.width / 2 - 20,canvas.height-5);
}

function checkScore(){
	if(score >= 50000){
		endGame(true);
	}
}

function drawPaddle(){
	context.fillStyle = paddleColor;
	context.fillRect(paddleX, paddleY, paddleWidth, paddleHeight);
}

function movePaddle(x){
	if (x){
		paddleX = x - (paddleWidth / 2);
		return;
	}
	else{
		paddleDeltaX = 0;
	}

	if (Math.abs((paddleX + (paddleWidth / 2)) - ballX) > (paddleWidth / 3))
		paddleDeltaX = (paddleX + (paddleWidth / 2) < ballX)? 2 : -2;

	if (paddleX + paddleDeltaX < 0 || paddleX + paddleDeltaX +paddleWidth >canvas.width ){
		paddleDeltaX = 0;
	}
	
	paddleX = paddleX + paddleDeltaX;
}

function drawBall(){
	contextball.beginPath();
	contextball.arc(ballX,ballY,ballRadius,0,Math.PI*2,true);
	contextball.fillStyle = ballColor;
	contextball.fill();

	drawBallArrows();

}

function drawBallArrows(){
	context.fillStyle   = arrowColor;
	context.beginPath();
	var directionX = ballDeltaX > 0 ? ballRadius + 5 : -ballRadius - 5;
	context.moveTo(ballX + directionX, ballY - ballRadius); // give the (x,y) coordinates
	context.lineTo(ballX + directionX, ballY + ballRadius);
	context.lineTo(ballX + directionX + ballDeltaX, ballY);
	context.lineTo(ballX + directionX, ballY - ballRadius);
	context.fill();
	context.closePath();

	context.fillStyle   = arrowColor;
	context.beginPath();
	var directionY =  ballDeltaY > 0 ? ballRadius + 5 : -ballRadius - 5;
	if (ballMoveUD == "DOWN")
		directionY = ballRadius + 5;
	else if (ballMoveUD == "UP")
		directionY = -ballRadius -5;

	context.moveTo(ballX - ballRadius, ballY + directionY ); // give the (x,y) coordinates
	context.lineTo(ballX, ballY + directionY + (directionY > 0 ? Math.abs(ballDeltaY) : -Math.abs(ballDeltaY)));
	context.lineTo(ballX + ballRadius, ballY + directionY);
	context.lineTo(ballX - ballRadius, ballY + directionY);
	context.fill();
	context.closePath();

}

function moveBall(){
	var ballBottomY = ballY + ballDeltaY + ballRadius
	var ballTopY = ballY + ballDeltaY - ballRadius;
	var ballLeftX = ballX + ballDeltaX - ballRadius;
	var ballRightX = ballX + ballDeltaX + ballRadius;

	//check for Paddle hit
	if (ballBottomY >= paddleY){ // If the ball is at paddleY
		if (ballX + ballDeltaX >= paddleX && ballX + ballDeltaX <= paddleX +paddleWidth){ // and that shit is within the X of paddleX.
			ballY = paddleY;
			ballDeltaY = -ballDeltaY;
			bounceSound.play();
			//to do, change X based on distance of ball from center of paddle.
		}
	}

	//Check for collisions:

	if (collisionBricksY() == "breakable"){
		ballDeltaY = ballDeltaY < 0 ? ballDeltaY + gravity * 20 : ballDeltaY * resistance; //slow down, not reverse.

	}

	if (collisionBricksY() == "unbreakable"){
		ballDeltaY = -ballDeltaY * resistance;
		bounceSound.play();
	}

	if (collisionBricksX() == "breakable"){
		ballDeltaX = ballDeltaX / 5; //slow down, not reverse.
	}

	if (collisionBricksX() == "unbreakable"){
		ballDeltaX = -ballDeltaX * resistance;
		bounceSound.play();
	}

	//Flip directionXs if we get < 0 on Y. Likewise for X.
	if (ballTopY < 0){
		ballDeltaY = -ballDeltaY;
		bounceSound.play();
	}

	if (ballBottomY > canvas.height){
		endGame();
	}

	if ((ballLeftX < 0) || (ballRightX > canvas.width)){
		ballDeltaX = -ballDeltaX;
		bounceSound.play();
	}
	else {
		if (ballMoveLR =='LEFT' && ballDeltaX > -maxBallSpeedX){
			ballDeltaX -= ballSpeed;
		}
		if (ballMoveLR == 'RIGHT' && ballDeltaX < maxBallSpeedX){
			ballDeltaX += ballSpeed;
		}
	}

	var downMomentum = (ballMoveUD == 'DOWN') ? .25 : 0;
	var upMomentum = (ballMoveUD == 'UP') ? -.15 : 0;
	if (ballDeltaY > criticalVelocity) ballDeltaY = criticalVelocity;
	ballX = ballX + ballDeltaX;
	ballY = ballY + ballDeltaY;
	ballDeltaY = ballDeltaY + gravity + downMomentum + upMomentum;
	ballDeltaX = ballDeltaX > maxBallSpeedX ? maxBallSpeedX : ballDeltaX; 
	ballDeltaX = ballDeltaX < -maxBallSpeedX ? -maxBallSpeedX : ballDeltaX;
	ballDeltaX *= resistance;
	ballDeltaX *= resistance;
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
		if ((y * brickHeight) > canvas.height && type < 5){ // A normal brick hits the bottom of the screen, you die.
			balls = 0;
			endGame();
		}
		context.fillStyle = colors[type];
		context.fillRect(x*brickWidth,y*brickHeight,brickWidth,brickHeight);
		context.strokeRect(x*brickWidth+1,y*brickHeight+1,brickWidth-2,brickHeight-2);
	}
	else{
		context.clearRect(x*brickWidth,y*brickHeight,brickWidth,brickHeight);
	}
}

function addBricks(){
newBricks.play();
var newRow = [];
	for (i = 0; i < bricksPerRow; i++){
		var newBrick = 0;
		var random = Math.random()* 100;
		if (random > 96) newBrick = 5;
		if (random > 85 && random <97) newBrick = 4;
		if (random > 70 && random <86) newBrick = 3;
		if (random > 40 && random <71) newBrick = 2;
		if (random > 10 && random <41) newBrick = 1;
		newRow.push(newBrick);
	}
	bricks.unshift(newRow);
}

function loopCycle(){
	thisLoop = new Date;
	//This is going to run at 50fps and redraw everything after clearing.
	clearScreen();
	createBricks();
	drawBall();
	movePaddle();
	drawPaddle();
	displayScore();
	checkScore();
	moveBall(); // moveBall can result in endGame

	levelUpTime++;

	if (levelUpTime > timeBetweenLevels){
		level++;
		balls++;
		levelUpTime = 0;
		if (level == levels.length) level--;
	}

	var fps = 1000 / (thisLoop - lastLoop);
	basicCounter++
	if (basicCounter > levels[level]){ //Level means less time between bricks.
		basicCounter = 0;
		addBricks();
	}
	if (musicTimer > levels[level] / 12){
		stepMusic();
		musicTimer = 0;
	} else musicTimer++;

	lastLoop = thisLoop;

	// window.addEventListener("devicemotion", function(event) { //experimental DeviceOrientation fun
	// 	ballDeltaX = -event.accelerationIncludingGravity.x;
	// }, true);


}

function clearScreen(){
	context.clearRect(0,0,canvas.width,canvas.height);
}

function stepMusic(){
	if (note > 16) note = 1;
	song[note].play();
	note++;
}
function clickToStart(){
	if (restart){
		startGame();
		return;
	}
	context.fillStyle = 'rgb(235,235,235)';
	context.font = "bold 32pt monospace";
	context.fillText("OUTBREAK", canvas.width/2 - textWidth/2,canvas.height/2-100, textWidth);
	context.font = "bold 20pt monospace";
	context.fillText("Click to Start", canvas.width/2 - textWidth/2,canvas.height/2, textWidth);
	context.fillText("use arrow keys", canvas.width/2 - textWidth/2,canvas.height/2 + 30, textWidth);
	$('canvas').click(startGame);
}
function startGame(){
	$('canvas').unbind('click');
	$('canvas').css('cursor','none');
	clearScreen();
	ballDeltaY = -4;
	ballDeltaX = -2;
	ballMoveLR = 'NONE';
	ballMoveUD = 'NONE';
	paddleDeltaX = 0;
	gameLoop = setInterval(loopCycle,20); //We're going to loopCycle ever 20ms. That should be 50 fps.

	//keystroke listeners
	$(document).keydown(function(evt) {
		evt.preventDefault();
		if (evt.keyCode == keyRight){
			ballMoveLR = 'RIGHT';
		}
		else if (evt.keyCode == keyLeft){
			ballMoveLR = 'LEFT';
		}
		if (evt.keyCode == keyUp){
			ballMoveUD = 'UP';
		}
		else if (evt.keyCode == keyDown){
			ballMoveUD = 'DOWN';
		}
		if (evt.keyCode == spaceBar){
			criticalVelocity = 40;
		}
	});


	$(document).keyup(function(evt) {
		if (evt.keyCode == keyLeft && ballMoveLR == 'LEFT' || evt.keyCode == keyRight && ballMoveLR == 'RIGHT') {
			ballMoveLR = 'NONE';
		}
		if (evt.keyCode == keyUp || evt.keyCode == keyDown){
			ballMoveUD = 'NONE';
		}
		if (evt.keyCode == spaceBar){
			criticalVelocity = 15;
		}
	})


	// //mousemove listener.
	// $('#canvas').mousemove(function(evt){
	// 	movePaddle(evt.pageX - this.offsetLeft);
	// });


	//touch listener.
	if (mobile){
		$('#canvas').bind('touchstart',function(evt){
			evt.preventDefault();
			var touch = evt.originalEvent.touches[0] || evt.originalEvent.changedTouches[0];
			if (touch.pageX - this.offsetLeft < 100){
				ballMoveLR = 'LEFT';
			}
			else if (touch.pageX - this.offsetLeft > canvas.width - 100){
				ballMoveLR = 'RIGHT';
			}
			if (touch.pageY - this.offsetTop < canvas.height / 2){
				ballMoveUD = 'UP';
			}
			else if (touch.pageY - this.offsetTop > canvas.height / 2){
				ballMoveUD = 'DOWN';
			}
		});

		$('#canvas').bind('touchend',function(evt){
			//evt.preventDefault();
			ballMoveLR = 'NONE';
			ballMoveUD = 'NONE';
		});
	}

	// //touchmove listener.
	// $('#canvas').bind('touchmove',function(evt){
	// 	evt.preventDefault();
	// 	var touch = evt.originalEvent.touches[0] || evt.originalEvent.changedTouches[0];
	// 	movePaddle(touch.pageX - this.offsetLeft);
	// });


}

function endGame(win){
	if (balls > 0){
		balls--;
		ballX = canvas.width / 2;
		ballY = canvas.height - 300;
		ballDeltaX = 0;
		ballDeltaY = 0;
		return;
	}
	var newHighScore = "";
	if (score > highScore){
		highScore = score;
		newHighScore = "New "
	}
	var text = win? winText : loseText;
	clearInterval(gameLoop);
	$('canvas').click(runGame);
	$('canvas').css('cursor','default');
	restart = 1;
	context.fillStyle = 'rgb(235,235,235)';
	context.font = "bold 20pt monospace";
	context.fillText(text, canvas.width/2 - textWidth/2,canvas.height/2, textWidth);
	context.fillText(newHighScore + "High Score: " + highScore, canvas.width/2 - textWidth/2,canvas.height/2 + 50, textWidth);
	context.fillText("click to restart", canvas.width/2 - textWidth/2,canvas.height/2 + 100, textWidth);
}

function collisionBricksX(){
	var bumpX = false;
	for (var i=0; i < bricks.length; i++){ //Basic loop through array of array.
		for (var j=0; j < bricks[i].length; j++){
			if (bricks[i][j]){ //If brick at location is not 0 / falsey
				var brickX = j * brickWidth; //The X location is X number of places in.
				var brickY = i * brickHeight;
				if  (//touching from left
					((ballX + ballDeltaX + ballRadius >= brickX) &&
					(ballX + ballRadius <= brickX))
					||//touching from right
					((ballX + ballDeltaX - ballRadius <= brickX + brickWidth)&&
					(ballX - ballRadius >= brickX + brickWidth))
					){ //Also at Y of brick.
					if ((ballY + ballDeltaY - ballRadius <= brickY + brickHeight)&&
						(ballY + ballDeltaY + ballRadius >= brickY)){
						if (bricks[i][j] < 5){
							explodeBrick(i,j);
							bumpX = "breakable";
						}
						else{
							bumpX = "unbreakable";
						}
					}
				}
			}
		}
	}

	return bumpX;
}

function collisionBricksY(){
	var bumpY = false;
	for (var i=0; i < bricks.length; i++){
		for (var j=0; j < bricks[i].length; j++){
			if (bricks[i][j]){
				var brickX = j * brickWidth;
				var brickY = i * brickHeight;
				if ( //touching bottom
					((ballY + ballDeltaY - ballRadius <= brickY + brickHeight) &&
					(ballY - ballRadius >= brickY + brickHeight))
					|| //touch top
					((ballY + ballDeltaY + ballRadius >= brickY) &&
					(ballY + ballRadius <= brickY))
					||
					((ballY + ballDeltaY - ballRadius >= brickY) &&
					(ballY + ballRadius <= brickY))
					){ //and also at the X
					if (ballX + ballDeltaX + ballRadius >= brickX &&
						ballX + ballDeltaX - ballRadius <= brickX + brickWidth){
						if (bricks[i][j] < 5){
							explodeBrick(i,j);
							bumpY = "breakable";
						}
						else{
							bumpY = "unbreakable";
						}
					}
				}
			}
		}
	}
	return bumpY;
}

function explodeBrick(i,j){
	//One point for hitting brick
	if (bricks[i][j]>0)
		score++;
	//Lessen the power of brick
	if (bricks[i][j] < 5)
		bricks[i][j] --;

	if (bricks[i][j] == 0){
		breakSound[break_numb].play();
		break_numb++
		if (break_numb >= breakSound.length) break_numb = 0;
	}
	else{
		hitSound[hit_numb].play();
		hit_numb++
		if (hit_numb >= hitSound.length) hit_numb = 0;
	}

}

}