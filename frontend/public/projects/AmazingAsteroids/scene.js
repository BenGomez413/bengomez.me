let stars = [];
let played = false;
let lifeCount = 3;
let alpha = 0;
let score = 0;
let finalScore = 0;
let updated = false;

//-------------------------Star----------------------------------
function createStars() {
	let star = new Star();
	stars.push(star);

	for (let i = 0; i < stars.length; i++) {
		stars[i].upListen();
		stars[i].show();
		if (stars[i].y > windowHeight + 20) {
			stars.splice(i, 1);
		}
	}
}

class Star {
	//Properties
	constructor(x, y, s, w, h, alpha) {
		this.x = random(0, windowWidth);
		this.y = -10;
		this.s = random(2, 15);
		this.w = random(2, 7);
		this.h = w;
		this.alpha = random(10, 255);
	}

	//Method
	show() {
		noStroke();
		fill(255, 255, 255, this.alpha);
		ellipse(this.x, this.y, this.w, this.h);
		this.y += this.s;
	}

	upListen() {
		if (keyIsDown(UP_ARROW) || keyIsDown(87)) {
			this.s += 0.2;

		} else {
			this.s = this.s
		}
	}
}


function startMenu() {
	strokeWeight(5);
	stroke(255)
	noFill();
	//rect(windowWidth / 2, windowHeight / 2, 600, 400, 150);
	noStroke();
	fill(223, 191, 64);
	textSize(50);
	text("Amazing Asteroids", windowWidth / 2, windowHeight / 2);
	for (a = 0; a <= 255; a += 0.51) {
		if (alpha == 255) {
			alpha = 0;
		}
		fill(255, alpha);
		alpha++
	}
	textSize(20);
	text("PRESS ARROWS TO START", windowWidth / 2, windowHeight / 2 + 50);
}


function scoreBoard() {
	fill(255)
	rect(50, windowHeight - 32, 150, 40, 50)
	fill(51);
	textAlign(CENTER);
	textSize(40);
	text(score, 50, windowHeight - 20);
}


function endGame() {
	if (lifeCount <= 0) {
		if (played == false) {
			finalScore = score;
			score = 0;
			shotsFired = true;
		}

		played = true;


		//Display End Screen

		strokeWeight(5);
		stroke(255)
		fill(0, 0, 0, 100);
		rect(windowWidth / 2, windowHeight / 2, 600, 400, 50);
		strokeWeight(4);
		line(windowWidth / 2 - 300, windowHeight / 2 - 80, windowWidth / 2 + 300, windowHeight / 2 - 80);
		strokeWeight(2);
		line(windowWidth / 2 - 300, windowHeight / 2 - 40, windowWidth / 2 + 300, windowHeight / 2 - 40);
		line(windowWidth / 2 - 300, windowHeight / 2, windowWidth / 2 + 300, windowHeight / 2);
		line(windowWidth / 2 - 300, windowHeight / 2 + 40, windowWidth / 2 + 300, windowHeight / 2 + 40);
		line(windowWidth / 2 - 300, windowHeight / 2 + 80, windowWidth / 2 + 300, windowHeight / 2 + 80);
		line(windowWidth / 2 - 300, windowHeight / 2 + 120, windowWidth / 2 + 300, windowHeight / 2 + 120);
		line(windowWidth / 2 - 300, windowHeight / 2 + 160, windowWidth / 2 + 300, windowHeight / 2 + 160);

		noStroke();
		fill(236, 66, 66);
		textSize(30);
		textAlign(LEFT);
		text("PGM", (windowWidth / 2 - 275), windowHeight / 2 - 50);
		fill(255);
		text("BEN", (windowWidth / 2 - 275), windowHeight / 2 - 10);
		text("AJA", (windowWidth / 2 - 275), windowHeight / 2 + 30);
		text(" D ", (windowWidth / 2 - 275), windowHeight / 2 + 70);
		text("BPP", (windowWidth / 2 - 275), windowHeight / 2 + 110);
		text("KEV", (windowWidth / 2 - 275), windowHeight / 2 + 150);
		fill(236, 66, 66);
		textAlign(RIGHT);
		text("5173", (windowWidth / 2 + 275), windowHeight / 2 - 50);
		fill(255);
		text("1063", (windowWidth / 2 + 275), windowHeight / 2 - 10);
		text("745", (windowWidth / 2 + 275), windowHeight / 2 + 30);
		text(" ALL THE POINTS", (windowWidth / 2 + 275), windowHeight / 2 + 70);
		text("637", (windowWidth / 2 + 275), windowHeight / 2 + 110);
		text("?", (windowWidth / 2 + 275), windowHeight / 2 + 150);

		textSize(50);
		fill(255);
		noStroke();
		textAlign(CENTER);
		text("Final Score:", (windowWidth / 2), windowHeight / 2 - 150);
		text(finalScore, (windowWidth / 2), windowHeight / 2 - 100);

		textSize(30);
		text("PRESS ENTER TO PLAY AGAIN", (windowWidth / 2), windowHeight / 2 + 250);
	}
}

function keyPressed() {
	if (keyCode >= 37 && keyCode <= 40 ||
		keyCode == 87 ||
		keyCode == 83 ||
		keyCode == 65 ||
		keyCode == 68
	) {
		newGame = false;
	}

	if (keyCode == 27 || keyCode == 80) {
		if (played == false) {
			paused = !paused;
		}
	}
	if (keyCode == 13 || keyCode == 82) {
		if (played == true) {
			restart();
		}
	}
}


function pause() {
	if (paused == false) {
		if (updated == false) {
			for (let i = 0; i < rocks.length; i++) {
				rocks[i].xs = random(-0.5, 0.5);
				rocks[i].ys = random(1, 5);
			}
			updated = true;
		}
	}
	if (paused == true) {
		for (let i = 0; i < rocks.length; i++) {
			rocks[i].xs = 0;
			rocks[i].ys = 0;
		}
		updated = false;

		strokeWeight(5);
		stroke(255)
		noFill();
		rect(windowWidth / 2, windowHeight / 2, 600, 400, 50);

		noStroke();
		fill(255);
		textSize(50);
		text("CONTROLS", windowWidth / 2, windowHeight / 2 - 150);

		textAlign(LEFT);
		text("PAUSED", 10, 60);
		textSize(30);
		text("MOVE -------", windowWidth / 2 - 250, windowHeight / 2 - 75);
		text("SHOOT --------------", windowWidth / 2 - 250, windowHeight / 2 + 25);
		text("PAUSE -----------", windowWidth / 2 - 250, windowHeight / 2 + 125);
		textAlign(RIGHT);
		text("ARROWS or WASD", windowWidth / 2 + 250, windowHeight / 2 - 75);
		text("SPACEBAR", windowWidth / 2 + 250, windowHeight / 2 + 25);
		text("ESCAPE or P", windowWidth / 2 + 250, windowHeight / 2 + 125);
	}
}

function restart() {
	played = false;
	lifeCount = 3;

	for (let i = 0; i < player.length; i++) {
		player[i].x = width / 2;
		player[i].y = height / 2
	}
}
