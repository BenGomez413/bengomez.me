//-------------------------Rock----------------------------------
let rocks = [];
let invincible = false;
let iFrames = 0;

function createRock(x, y, xs, ys, d) {
	let r = new Rock(x, y, xs, ys, d);
	rocks.push(r);
}

function rockPlayerCollision() {
	if (invincible == false) {
		for (let i = 0; i < rocks.length; i++) {
			if (dist(player[0].x, player[0].y, rocks[i].x, rocks[i].y) < player[0].r / 2 + rocks[i].r) {
				rocks[i].marked = true;
				lifeCount--
				invincible = true;
			}
		}
	}
	if (invincible == true) {
		iFrames++
		player[0].alpha = 100;
		player[0].strokeA = 100;
		if (iFrames >= 100) {
			invincible = false;
			player[0].alpha = 255;
			player[0].strokeA = 0;
			iFrames = 0;
		}
	}
}

function rockBulletCollision() {
	for (let i = 0; i < rocks.length; i++) {
		for (let j = 0; j < bullets.length; j++) {
			if (dist(bullets[j].x, bullets[j].y, rocks[i].x, rocks[i].y) < bullets[j].w + rocks[i].r) {
				bullets[j].marked = true;
				rocks[i].marked = true;
				score++
			}
		}
	}
}

class Rock {
	//Properties
	constructor(x, y, xs, ys, d) {
		this.x = x;
		this.y = y;
		this.xs = xs;
		this.ys = ys;
		this.d = d;
		this.r = this.d / 2;
		this.c = random(75, 150);

		this.p = int(random(11, 25));
		this.offset = [];
		for (let i = 0; i < this.p; i++) {
			this.offset[i] = random(-this.r / 5, this.r / 15);
		}

		if (this.d < 80) {
			this.split = false;
		} else {
			this.split = true;
		}
		this.marked = false;
	}

	//Method
	show() {
		this.y += this.ys;
		this.x += this.xs;

		fill(this.c);
		strokeWeight(2);
		stroke(40, 0);

		beginShape();
		for (let i = 0; i < this.p; i++) {
			var a = map(i, 0, this.p, 0, 360);
			var r = this.r + this.offset[i];
			var x = r * cos(a) + this.x;
			var y = r * sin(a) + this.y;
			vertex(x, y);
		}
		endShape(CLOSE);

		//hitbox
		//noFill();
		//stroke(255);
		//ellipse(this.x, this.y, this.d, this.d);
	}

	death() {
		for (let i = 0; i < rocks.length; i++) {
			if (rocks[i].split == true && rocks[i].marked == true) {
				for (let k = 0; k < int(random(3, 5)); k++) {
					createRock(
						rocks[i].x, //x
						rocks[i].y, //y
						random(-2, 2), //xspeed
						random(1, 4), //yspeed
						random(20, 50) //diameter
					);
				}
			}

			if (
				rocks[i].marked == true ||
				rocks[i].x < (-100) ||
				rocks[i].x > (windowWidth + 100) ||
				rocks[i].y < (-200) ||
				rocks[i].y > (windowHeight + 100)
			) {
				rocks.splice(i, 1);
			}
		}
	}
}

//-------------------------Mine----------------------------------
let mines = [];

function createMine(x, y, xs, ys) {
	let mine = new Mine(x, y, xs, ys);
	if (mines.length < 2) {
		mines.push(mine);
	}
}

class Mine {
	//Properties
	constructor(x, y, xs, ys) {
		this.x = x;
		this.y = y;
		this.xs = xs;
		this.ys = ys;
		this.d = 35;
		this.r = this.d / 2;
	}

	show() {
		strokeWeight(2);
		stroke(255, 0, 0);
		fill(175);
		ellipse(this.x, this.y, this.d);
		stroke(0, 0, 0);
		fill(150);
		ellipse(this.x, this.y, this.r);

		this.y += this.ys;
		this.x += this.xs;

		for (let i = 0; i < mines.length; i++) {
			mines[i].show();
			if (mines[i].y > (windowHeight + 100)) {
				mines.splice(i, 1);
			}
		}
	}
}
