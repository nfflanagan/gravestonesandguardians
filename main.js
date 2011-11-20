function initDraw() {
	var canvas = document.getElementById("graveguardgame");
	var stack = new Array();
	canvas.Rect = function(x, y, w, h) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		stack[stack.length] = this;
	}
	canvas.Rect.prototype = {
		"draw": function(ctx) {
			ctx.fillStyle = this.fillStyle;
			ctx.beginPath();
			ctx.rect(this.x, this.y, this.w, this.h);
			ctx.closePath();
			ctx.fill();
		}
	}
	canvas.Image = function(x, y, image) {
		this.x = x;
		this.y = y;
		this.image = image;
		stack[stack.length] = this;
	}
	canvas.Image.prototype = {
		"draw": function(ctx) {	
			if (this.image.Ready) {
				ctx.drawImage(this.image, this.x, this.y);
			}
		}
	}
	canvas.remove = function(o) {
		if (stack.splice(stack.indexOf(o), 1)) return o;
	}
	canvas.clear = function() {
		this.getContext("2d").clearRect(0, 0, this.width, this.height);
	}
	canvas.draw = function draw () {
		this.clear();
		var ctx = this.getContext("2d");
		for (var index in stack) {	var item = stack[index];
			item.draw(ctx);
		}
	}
	return canvas;
}

function img(src) {
	var self = new Image();
	self.onload = function() {
		this.Ready = true;
	}
	self.src = src;
	return self;
}

var canvas = initDraw();
var split = canvas.width / 2;
new canvas.Rect(0, 0, split, canvas.height).fillStyle = "#555";
new canvas.Rect(split, 0, split, canvas.height).fillStyle = "#AAA";

var path = img("art/path.png");
var bases = {"angel":img("art/angel_base.png"), "gargoyle":img("art/gargoyle_base.png")};

var pawn = {"angel":img("art/angel.png"), "gargoyle":img("art/gargoyle.png")};
var pawns = new Array();

var night = "gargoyle";
var day = "angel";

var time = night;

function selectFrom(choices) {
	return choices[Math.floor(Math.random()*choices.length)];
}

function advancePawn(self) {
	return function() {
		if (self.where.destination == self.group) {
			self.die();
		} else {
			var neighbors = self.where.neighbors();
			var advances = new Array();
			for (var index in neighbors) {	var n = neighbors[index];
				if (!n.source && n[self.group] < self.where[self.group]) advances.push(n);
			}
			self.where = selectFrom(advances);
			self.x = self.where.h * 64;
			self.y = self.where.v * 64;
		}
	}
}

function attackPawn(self) {
	return function() {
		if (pawns.indexOf(self.target) >= 0) {
			var speed = 16;
			var dX = self.target.x - self.x, dY =  self.target.y - self.y;
			var distance = Math.sqrt(dX * dX + dY * dY);
			var angle = Math.atan2(dY, dX);
			if (distance >= speed) {
				self.x += Math.cos(angle) * speed;
				self.y += Math.sin(angle) * speed;
				return;
			} else {
				self.target.die();
			}
		} else {
			var targets = self.base.identifyTargets();
			if (targets.length > 0) {
				self.target = selectFrom(targets);
				return;
			}
		}
		self.die();
	}
}

function pawnKill() {
	var index = pawns.indexOf(this); if (index >= 0) pawns.splice(index, 1);
	clearInterval(this.controller);
	canvas.remove(this);
}

function newPawn(base, speed) {
	return function() {
		if (time == base.source) {
			if (base.spawnCount && !--base.spawnCount) {
				clearInterval(base.controller);
			}
			var self = new canvas.Image(base.h * 64, base.v * 64, pawn[base.source]);
			self.group = base.source;
			self.where = base;
			pawns.push(self);
			self.controller = setInterval(advancePawn(self), speed);
			self.die = pawnKill;
		} else {
			var targets = base.identifyTargets();
			if (targets.length > 0) {
				var self = new canvas.Image(base.h * 64, base.v * 64, pawn[base.source]);
				self.group = base.source;
				self.base = base;
				self.target = selectFrom(targets);
				self.controller = setInterval(attackPawn(self), 33);
				self.die = pawnKill;
			}
		}
	}
}

function identifyTargets() {
	var targets = new Array();
	for (var i = 0; i < pawns.length; ++i) {
		if (this.domain.indexOf(pawns[i].where) >= 0) {
			if (targets.length == 0 || targets[0].where[time] == pawns[i].where[time]) {
				targets.push(pawns[i]);
			} else if (targets[0].where[time] > pawns[i].where[time]) {
				targets = new Array(pawns[i]);
			}
		}
	}
	return targets;
}

function setBase(base, period, speed, spawnCount) {
	base.spawnCount = spawnCount;
	base.domain = base.neighbors(2);
	base.identifyTargets = identifyTargets;
	if (base.timeOut) {
		setTimeout(function() {base.controller = setInterval(newPawn(base, speed), period);}, base.timeOut);
	} else {
		base.controller = setInterval(newPawn(base, speed), period);
	}
}

for (var row_index in level[2]) {	var row = level[2][row_index];
	for (var space_index in row) {	var space = row[space_index];
		if (space) {
			new canvas.Image(space.h * 64, space.v * 64, space.source?bases[space.source]:path);
			if (space.source) {
				setBase(space, 2000, 500, 20);
			}
		}
	}
}

setInterval(function() {return canvas.draw();}, 33);