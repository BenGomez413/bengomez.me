let paused = false;
let looping = false;
let newGame = true;
let loading = false;
let loadCounter = 0;
let fileTotal = 8;


//----------------------Preload----------------------------------
function preload() {
	mainFont = loadFont('Assets/Fonts/earthorbiter.ttf');
}


//-----------------------SETUP-----------------------------------
function setup() {
	createCanvas(windowWidth, windowHeight);

	frameRate(60);

	textFont(mainFont);

	rectMode(CENTER);
	angleMode(DEGREES);
	noStroke();

	createLives();

	createPlayer(windowWidth / 2, windowHeight / 2, 50, 5);
	//createPlayer(windowWidth / 2 - 75, windowHeight / 2 + 25, 50, 5);
	//createPlayer(windowWidth / 2 + 75, windowHeight / 2 + 25, 50, 5);
}

//------------------------Draw-----------------------------------
function draw() {
	background(10);

	if (loading == true) {
		rectMode(CORNER);
		createStars();
		noStroke();
		fill(234, 212, 14);
		var w = (width - 400) * (loadCounter / fileTotal);
		rect(200, height / 2 - 50, w, 100, 35);
		stroke(255);
		strokeWeight(7)
		noFill();
		rect(200, height / 2 - 50, width - 400, 100, 35);

	} else {
		rectMode(CENTER);
		createStars();
		if (looping == false) {
			looping = true;
		}

		if (newGame == true) {
			startMenu();
			scoreBoard();
			for (let i = 0; i < lifeCount; i++) {
				lives[i].show()
			}
		}

		if (newGame == false) {
			if (shotsFired == false) {
				fill(220);
				textSize(30);
				text("Press SPACEBAR to Shoot", windowWidth / 2, windowHeight - 100);
			}

			rockBulletCollision();
			rockPlayerCollision();

			for (let i = 0; i < bullets.length; i++) {
				bullets[i].death();
			}
			for (let i = 0; i < bullets.length; i++) {
				bullets[i].show();
			}
			if (played == false) {
				for (let i = 0; i < player.length; i++) {
					player[i].show();
				}
			}
			if (paused == false && played == false) {
				for (let i = 0; i < player.length; i++) {
					player[i].inputListen();
				}
			}
			if (paused == false) {
				if (rocks.length < score / 3 + 1) {
					createRock(random(0, windowWidth), -150, random(-0.5, 0.5), random(1, 5), random(30, 125));
				}
			}

			for (let i = 0; i < rocks.length; i++) {
				rocks[i].death();
			}

			for (let i = 0; i < rocks.length; i++) {
				rocks[i].show();
			}

			/*createMine(
			  random(0, windowWidth), //x
			  -100, 									//y
			  random(-0.5, 0.5), 			//xspeed
			  random(1, 5) 						//yspeed
			);*/


			for (let i = 0; i < lifeCount; i++) {
				lives[i].show()
			}

			pause();
			scoreBoard();
			endGame();
		}
	}
	//text(frameCount,50,50);
}
