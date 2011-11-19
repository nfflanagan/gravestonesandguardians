(function(level) {
	for (i = 0; i < level.length; i++) {
		level[i][5] = {"h":i, "v":5};
	}

	level[5][4] = {"h":5, "v":4, "source":"gargoyle"};

	setDestination("angel", level, 0, 5);
	setDestination("gargoyle", level, level.length - 1, 5);
	
})(newLevel(16, 10));