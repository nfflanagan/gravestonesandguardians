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
var baseImages = {"angel":img("art/angel_base.png"), "gargoyle":img("art/gargoyle_base.png")};

var bases = {"angel":new Array(), "gargoyle":new Array()};

var damages = 0;

var pawn = {"angel":img("art/angel.png"), "gargoyle":img("art/gargoyle.png")};
var pawns = new Array();

var night = "gargoyle";
var day = "angel";
var twilight = "";

var time = twilight;
var currentLevel = level[2];

function selectFrom(choices) {
	return choices[Math.floor(Math.random()*choices.length)];
}

function advancePawn(self) {
	return function() {
		if (self.where.destination == self.group) {
			self.die();
			damages++;
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
	var index = pawns.indexOf(this); if (index >= 0) {
		pawns.splice(index, 1);
		
	}
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
		if (pawns[i].group != this.source && this.domain.indexOf(pawns[i].where) >= 0) {
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

for (var row_index in currentLevel) {	var row = currentLevel[row_index];
	for (var space_index in row) {	var space = row[space_index];
		if (space) {
			new canvas.Image(space.h * 64, space.v * 64, space.source?baseImages[space.source]:path);
			if (space.source) {
				setBase(space, 2000, 500);
			}
		}
	}
}

var blazons = {"no":img("art/X_Graphic.png"), "angel":baseImages.angel, "gargoyle":baseImages.gargoyle};
var blazon;
var sideChoosing;

canvas.onmousemove = function(evt) {
	var x = Math.floor(evt.clientX / 64), y = Math.floor(evt.clientY / 64);
	if (blazon) {
		canvas.remove(blazon);
		blazon = undefined
	}
	if (time) return;
	var badge = sideChoosing;
	if ((badge == "angel" && x < currentLevel.length / 2) || (badge == "gargoyle" && x >= currentLevel.length / 2)) badge = "no";
	if (!currentLevel[x][y]){
		var neighbors = [currentLevel[x-1] && currentLevel[x-1][y], currentLevel[x][y - 1], currentLevel[x+1] && currentLevel[x+1][y], currentLevel[x][y+1]];
		for (var i = 0; i < neighbors.length; ) {
			if (neighbors[i] && !neighbors[i].source) {
				++i;
			} else {
				neighbors.splice(i, 1);
			}
		}
		if (neighbors.length == 0) badge = "no";
	} else {
		badge = "no";
	}
	blazon = new canvas.Image(x * 64, y * 64, blazons[badge]);
}

function addBase(side) {
	sideChoosing = side;
	canvas.onclick = function onClick(evt) {
		var x = Math.floor(evt.clientX / 64), y = Math.floor(evt.clientY / 64);
		if ((side == "angel" && x < (currentLevel.length + 1) / 2) || (side == "gargoyle" && x >= (currentLevel.length + 1) / 2)) return;
		if (!currentLevel[x][y]){
			var neighbors = [currentLevel[x-1] && currentLevel[x-1][y], currentLevel[x][y - 1], currentLevel[x+1] && currentLevel[x+1][y], currentLevel[x][y+1]];
			for (var i = 0; i < neighbors.length; ) {
				if (neighbors[i] && !neighbors[i].source) {
					++i;
				} else {
					neighbors.splice(i, 1);
				}
			}
			if (neighbors.length == 0) return;
		} else {
			return;
		}
		var space = new Space(x, y, currentLevel);
		var neighbors = space.neighbors();
		for (var i = 0; i < neighbors.length; ++i) {
			var neighbor = neighbors[i];
			if (!space.angel || neighbor.angel >= space.angel) space.angel = neighbor.angel + 1;
			if (!space.gargoyle || neighbor.gargoyle >= space.gargoyle) space.gargoyle = neighbor.gargoyle + 1;
		}
		space.source = side;
		new canvas.Image(space.h * 64, space.v * 64, baseImages[space.source]);
		setBase(space, 2000, 500);
		sideChoosing = undefined;
		canvas.onclick = null;
		time = (side==night)? day: night;
		setTimeout(swap, 30000);
	}
}

function swap() {
	var oldTime = time;
	time = twilight;
	while (pawns.length > 0) {
		pawns[pawns.length - 1].die();
	}
	var basesLost = bases[(oldTime==night)? day: night].splice(0, Math.floor(damages / 5));
	for (var i = 0; i < basesLost.length; ++i) {
		clearInterval(basesLost[i].controller);
		canvas.remove(basesLost[i]);
	}
	addBase(oldTime || day);
}

swap();

setInterval(function() {return canvas.draw();}, 33);