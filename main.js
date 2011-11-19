function initDraw() {
	var canvas = document.getElementById("graveguardgame");
	var stack = new Array();
	canvas.newRect = function(x, y, w, h) {
		var self = {"x":x, "y":y, "w":w, "h":h,
			"draw": function(ctx) {
				ctx.fillStyle = this.fillStyle;
				ctx.beginPath();
				ctx.rect(this.x, this.y, this.w, this.h);
				ctx.closePath();
				ctx.fill();
			}
		}
		stack[stack.length] = self;
		return self;
	}
	canvas.newImage = function(x, y, img) {
		var self = {"x":x, "y":y, "image":img,
			"draw": function(ctx) {	
				if (this.image.Ready) {
					ctx.drawImage(this.image, this.x, this.y);
				}
			}
		}
		stack[stack.length] = self;
		return self;
	}
	canvas.clear = function() {
		this.getContext("2d").clearRect(0, 0, this.width, this.height);
	}
	canvas.draw = function draw () {
		this.clear();
		var ctx = this.getContext("2d");
		for (var i = 0; i < stack.length; i++) {
			stack[i].draw(ctx);
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
canvas.newRect(0, 0, split, canvas.height).fillStyle = "#555";
canvas.newRect(split, 0, split, canvas.height).fillStyle = "#AAA";

var path = img("art/path.png");

for (i = 0; i < level.length; i++) {
	var row = level[i];
	for (j = 0; j < row.length; j++) {
		var space = row[j];
		if (space) {
			canvas.newImage(i * 64, j * 64, path);
		}
	}
}

setInterval(function() {return canvas.draw();}, 33);