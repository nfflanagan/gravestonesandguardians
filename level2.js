(function(level) {
	for (i = 0; i < level.length; i++) {
		new Space(i, 5, level);
	}

	(new Space(1, 4, level)).source = "angel";
	(new Space(7, 4, level)).source = "angel";
	(new Space(8, 4, level)).source = "angel";
	(new Space(7, 4, level)).source = "angel";
	(new Space(6, 4, level)).source = "angel";
	(new Space(5, 4, level)).source = "angel";
	(new Space(4, 4, level)).source = "angel";
	(new Space(3, 4, level)).source = "angel";
	(new Space(2, 4, level)).source = "angel";
	(new Space(1, 4, level)).source = "angel";
	(new Space(0, 4, level)).source = "angel";

	setDestination("gargoyle", level, 0, 5);
	setDestination("angel", level, level.length -1, 5);

})(newLevel(16, 10));

