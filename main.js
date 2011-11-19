function initDraw() {
	var canvas = document.getElementById("graveguardgame");
	var stack = new Array();
	canvas.newRect = function(x, y, w, h) {
		var self = {"x":x, "y":y, "w":w, "h":h,
			draw: function(ctx) {
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

var canvas = initDraw();
var split = canvas.width / 2;
canvas.newRect(0, 0, split, canvas.height).fillStyle = "#555";
canvas.newRect(split, 0, split, canvas.height).fillStyle = "#AAA";

var level = document.getElementById("level");
alert(level.data.length);

setInterval(function() {return canvas.draw();}, 33);