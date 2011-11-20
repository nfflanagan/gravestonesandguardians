function setDestination(group, data, i, j) {
	var d = data[i][j];
	d.destination = group;
	var n = 0;
	d[group] = n++;
	var spaces = new Array(d);
	while (spaces.length > 0) {
		var borders = new Array();
		for each (space in spaces) {
			for each (neighbor in space.neighbors()) {
				if (neighbor && !(neighbor[group]) {
					borders.push(neighbor);
				}
			}
		}
		for each (border in borders) {
			border[group] = n;
		}
		spaces = borders;
		n++;
	}

}

var level = new Array();

function Space(h, v, level) {
	this.h = h;
	this.v = v;
	this.level = level;
	level[h][v] = this;
}
Space.prototype = {
	"neighbors": function() {
		var level = this.level, h = this.h, v = this.v;
		return [ level[h-1] && level[h-1][v], level[h][v - 1], level[h+1] && level[h+1][v], level[h][v+1] ];
	}
}

function newLevel(h, v) {
	var self = new Array();
	self.length = h;
	for (var i = 0; i < self.length; i++) {
		self[i] = new Array();
		self[i].length = v;
	}
	level.push(self);
	return self;
}