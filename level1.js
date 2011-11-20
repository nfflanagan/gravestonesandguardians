(function(level) {
	for (i = 0; i < level.length; i++) {
		new Space(i, 5, level);
	}

	new Space(1, 6, level).source = "gargoyle";
	level[1][6].timeOut = 500;
	new Space(5, 4, level).source = "gargoyle";
	
	setDestination("angel", level, 0, 5);
	setDestination("gargoyle", level, level.length - 1, 5);
	
})(newLevel(16, 10));