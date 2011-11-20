(function(level) {
	new Space(1, 2, level);
	new Space(1, 3, level);
	new Space(1, 5, level);
	new Space(2, 6, level);
	new Space(2, 8, level);
	new Space(3, 9, level);
	new Space(4, 10, level);
	new Space(5, 10, level);
	new Space(6, 10, level);
	new Space(6, 9, level);
	new Space(7, 8, level);
	new Space(7, 7, level);
	new Space(7, 6, level);
	new Space(8, 10, level);
	new Space(9, 12, level);
	new Space(10, 12, level);
	new Space(11, 12, level);
	new Space(15, 13, level);
	new Space(16, 15, level);
	new Space(17, 16, level);
	new Space(18, 17, level);
	new Space(19, 18, level);
	new Space(20, 19, level);
	new Space(21, 20, level);
	

	new Space(4, 3, level).source = "gargoyle";
	
	new Space(11, 7, level).source = "angel";
	
	setDestination("angel", level, 0, 5);
	setDestination("gargoyle", level, level.length - 1, 5);
	
})(newLevel(16, 10));