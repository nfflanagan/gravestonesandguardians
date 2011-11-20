(function(level) {
	for (i = 0; i < level.length; i++) {
		new Space(i, 5, level);
	}

	new Space(2, 6, level).source = "gargoyle";
	level[2][6].timeOut = 1500;
	new Space(5, 4, level).source = "gargoyle";
	
	new Space(14, 4, level).source = "angel";
	new Space(11, 6, level).source = "angel";
	
	setDestination("angel", level, 0, 5);
	setDestination("gargoyle", level, level.length - 1, 5);
	
})(newLevel(16, 10));