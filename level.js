function setDestination(group, data, i, j) {
	var dest = data[i][j];
	dest.destination = group;
	var n = 0;
	dest[group] = n++;
	var spaces = new Array(dest);
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

function Space(h, v, level) {
	this.h = h;
	this.v = v;
	this.level = level;
	level[h][v] = this;
}
Space.prototype = {
	"neighbors": function(steps) { steps || (steps = 1);
		var level = this.level, h = this.h, v = this.v;
		var n = new Array();
		if (level[h-1] && level[h-1][v]) n.push(level[h-1][v]);
		if (level[h][v - 1]) n.push(level[h][v - 1]);
		if (level[h+1] && level[h+1][v]) n.push(level[h+1][v]);
		if (level[h][v+1]) n.push(level[h][v+1]);
		while (--steps) {
			var borders = new Array();
			for (var i = 0; i < n.length; ++i) {
				var spread = n[i].neighbors(1);
				for (var j = 0; j < spread.length; ++j) {
					if (n.indexOf(spread[j]) < 0) {
						borders.push(spread[j]);
					}
				}
			}
			n = n.concat(borders);
		}
		return n;
	}
}

var level = new Array();

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