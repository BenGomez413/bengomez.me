let player = [];
let bullets = [];
let lives = [];
let timer = 0;
let fireRate = 15;
let shotsFired = false;
let tripleShot = false;

//------------------------Player---------------------------------
function createPlayer(x, y, r, s) {
	let p = new Player(x, y, r, s);
	player.push(p);
}

class Player {
	//Properties
	constructor(x, y, r, s) {
		this.x = x;
		this.y = y;
		this.r = 50;
		this.s = s;
		this.alpha = 255;
		this.strokeA = 0;
		this.marked = false;
	}

	//Methods
	inputListen() {
		for (i = 0; i < player.length; i++) {
			if (keyIsDown(UP_ARROW) || keyIsDown(87)) {
				if (player[i].y > 0) {
					this.y -= this.s
				}
			}
			if (keyIsDown(DOWN_ARROW) || keyIsDown(83)) {
				if (player[i].y < windowHeight) {
					this.y += this.s
				}
			}
			if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) {
				if (player[i].x > 0) {
					this.x -= this.s
				}
			}
			if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) {
				if (player[i].x < windowWidth) {
					this.x += this.s
				}
			}
		}

		//Shooting  
		let held = false;
		if (keyIsDown(32)) { //space
			shotsFired = true;
			if (timer == 0) {
				for (i = 0; i < player.length; i++) {
					createBullet(player[i].x, player[i].y - 30);
					if (tripleShot == true) {
						createBullet(player[0].x - 22, player[0].y + 15);
						createBullet(player[0].x + 22, player[0].y + 15);
					}
				}
			}
			held = true;
			timer++
		} else {
			held = false;
			timer = 0;
		}
		if (timer >= fireRate) {
			timer = 0;
		}
	}

	show() {
		stroke(255, this.strokeA);
		fill(10, 100, 200, this.alpha);
		rect(this.x, this.y, 20, 40, 10);
		rect(this.x, this.y - 15, 14, 40, 15);
		rect(this.x, this.y + 5, 40, 20, 7);
		rect(this.x + 21, this.y + 1, 7, 25, 4);
		rect(this.x - 21, this.y + 1, 7, 25, 4);
		fill(234, 212, 14, 200);
		rect(this.x, this.y - 3, 12, 28, 10);

		//hitbox
		//noFill();
		//stroke(255);
		//ellipse(this.x, this.y, this.r, this.r);
	}


}

//------------------------Bullet---------------------------------
function createBullet(x, y) {
	let b = new Bullet(x, y);
	bullets.push(b);
}

class Bullet {
	//Properties
	constructor(x, y, w, h) {
		this.x = x;
		this.y = y;
		this.w = 5;
		this.h = this.w * 3;

		this.marked = false;
	}

	//Method
	show() {
		this.y -= 20;

		fill(20, 222, 20);
		rect(this.x, this.y, this.w, this.h, 10);

		//hitbox
		//noFill();
		//stroke(255);
		//ellipse(this.x, this.y, this.w, this.w);
	}

	death() {
		for (let i = 0; i < bullets.length; i++) {
			if (bullets[i].marked == true) {
				bullets.splice(i, 1);
			}
		}
		for (let i = 0; i < bullets.length; i++) {
			if (bullets[i].y < -100)
				bullets.splice(i, 1);
		}
	}
}


//-----------------------Lives-----------------------------------
function createLives() {
	for (i = 0; i < lifeCount; i++) {
		let x = -30 + (windowWidth - (60 * i));
		let y = windowHeight - 30;
		let l = new Life(x, y, 0.5);
		lives.push(l);
	}
}

class Life {
	//Properties
	constructor(x, y, scale) {
		this.x = x;
		this.y = y;
		this.scale = scale;
	}
	//Methods
	show() {
		stroke(255, 0);
		fill(10, 100, 200);
		rect(this.x, this.y, 20, 40, 10);
		rect(this.x, this.y - 15, 14, 40, 15);
		rect(this.x, this.y + 5, 40, 20, 7);
		rect(this.x + 21, this.y + 1, 7, 25, 4);
		rect(this.x - 21, this.y + 1, 7, 25, 4);
		fill(234, 212, 14, 200);
		rect(this.x, this.y - 3, 12, 28, 10);
	}
}
