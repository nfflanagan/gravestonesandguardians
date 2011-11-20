function setDestination(group, data, i, j) {
	var d = data[i][j];
	d.destination = group;
	var n = 0;
	d[group] = n++;
	var spaces = new Array(d);
	while (spaces.length > 0) {
		var borders = new Array();
		for (var space_index in spaces) { var space = spaces[space_index];
			var neighbors = space.neighbors();
			for (var neighbor_index in neighbors) {	var neighbor = neighbors[neighbor_index];
				if (neighbor && neighbor[group] == undefined) {
					borders.push(neighbor);
				}
			}
		}
		for (var border_index in borders) {	var border = borders[border_index];
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
		var n = new Array();
		if (level[h-1] && level[h-1][v]) n.push(level[h-1][v]);
		if (level[h][v - 1]) n.push(level[h][v - 1]);
		if (level[h+1] && level[h+1][v]) n.push(level[h+1][v]);
		if (level[h][v+1]) n.push(level[h][v+1]);
		return n;
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