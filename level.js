function setDestination(group, data, i, j) {
	data[i][j].destination = group;
	var n = 0;
	data[i][j][group] = n++;
	var spaces = new Array(data[i][j]);
	while (spaces.length > 0) {
		var borders = new Array();
		for each (space in spaces) {
			var neighbors = [ data[space.h-1] && data[space.h-1][space.v], data[space.h][space.v - 1], data[space.h+1] && data[space.h+1][space.v], data[space.h][space.v+1] ];
			for each (neighbor in neighbors) {
				if (neighbor && !neighbor[group]) {
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