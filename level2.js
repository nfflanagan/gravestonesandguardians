(function(level) {
	new Space(0, 5, level);
	new Space(1, 5, level);
	new Space(1, 4, level);
	new Space(1, 3, level);
	new Space(2, 3, level);
	new Space(3, 3, level);
	new Space(3, 4, level);
	new Space(3, 5, level);
	new Space(3, 6, level);
	new Space(3, 7, level);
	new Space(4, 7, level);
	new Space(5, 7, level);
	new Space(5, 6, level);
	new Space(5, 5, level);
	new Space(5, 4, level);
	new Space(5, 3, level);
	new Space(6, 3, level);
	new Space(7, 3, level);
	new Space(7, 4, level);
	new Space(7, 5, level);
	new Space(8, 5, level);
	new Space(8, 6, level);
	new Space(8, 7, level);
	new Space(9, 7, level);
	new Space(10, 7, level);
	new Space(10, 6, level);
	new Space(10, 5, level);
	new Space(10, 4, level);
	new Space(10, 3, level);
	new Space(11, 3, level);
	new Space(12, 3, level);
	new Space(12, 4, level);
	new Space(12, 5, level);
	new Space(12, 6, level);
	new Space(12, 7, level);
	new Space(13, 7, level);
	new Space(14, 7, level);
	new Space(14, 6, level);
	new Space(14, 5, level);
	new Space(15, 5, level);

	new Space(0, 6, level).source = "gargoyle";
	level[0][6].period = 1500;
	
	setDestination("angel", level, 0, 5);
	setDestination("gargoyle", level, level.length - 1, 5);
	
})(newLevel(16, 10));