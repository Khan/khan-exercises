({
	"nl" : {
		"question1"	: 'Starting at home, <var>person( 1 )</var> traveled uphill to the <var>store( 1 )</var> store for <var>TIME_UP</var> minutes at just <var>RATE_UP</var> mph. <var>He( 1 )</var> then traveled back home along the same path downhill at a speed of <var>K * RATE_UP</var> mph.',
		"question2"	: 'What is <var>his( 1 )</var> average speed for the entire trip from home to the <var>store( 1 )</var> store and back?',
		"question3"	: 'It takes <var>TIME_INIT</var> minutes for <var>PEOPLE_INIT</var> people to paint <var>WALL_INIT</var> walls.',
		"question4"	: 'How many minutes does it take <var>PEOPLE_FINAL</var> people to paint <var>WALL_FINAL</var> walls?',
		"question5"	: '<var>PEOPLE_INIT</var> people can paint <var>WALL_INIT</var> walls in <var>TIME_INIT</var> minutes.',
		"question6"	: 'How many minutes will it take for <var>PEOPLE_FINAL</var> people to paint <var>WALL_FINAL</var> walls? Round to the nearest minute.',

		"problem1"	: '<span class="sol"><var>RATE_AVG</var></span> mph',
		"problem2"	: '<span class="sol"><var>TIME_FINAL</var></span> minutes',
		"problem3"	: '<span class="sol"><var>TIME_FINAL</var></span> minutes'+
				'<p class="example">the number of minutes, rounded to the nearest minute</p>',		

		"hint1"		: 'The average speed is not just the average of <var>RATE_UP</var> mph and <var>RATE_DOWN</var> mph.',
		"hint2"		: '<var>He( 1 )</var> traveled for a longer time uphill (since <var>he( 1 )</var> was going slower), so we can estimate that the average speed is closer to <var>RATE_UP</var> mph than <var>RATE_DOWN</var> mph.',
		"hint3"		: 'To calculate the average speed, we will make use of the following:',
		"hint4"		: 'What was the total distance traveled?',
		"hint5"		: 'Substituting to find the total distance:',
		"hint6"		: 'What was the total time spent traveling?',
		"hint7"		: 'Now that we know both the total distance and total time, we can find the average speed.',
		"hint8"		: 'The average speed is <var>RATE_AVG</var> mph, and which is closer to <var>RATE_UP</var> mph than <var>RATE_DOWN</var> mph as we expected.',
		"hint9"		: 'Imagine that each person is assigned one wall, and all <var>PEOPLE_INIT</var> people begin painting at the same time.',
		"hint10"	: 'Since everyone will finish painting their assigned wall after <var>TIME_INIT</var> minutes, it takes one person <var>TIME_INIT</var> minutes to paint one wall.',
		"hint11"	: 'If we have <var>PEOPLE_FINAL</var> people and <var>WALL_FINAL</var> walls, we can again assign one wall to each person.',
		"hint12"	: 'Everyone will take <var>TIME_FINAL</var> minutes to paint their assigned wall.',
		"hint13"	: 'In other words, it takes <var>TIME_FINAL</var> minutes for <var>PEOPLE_FINAL</var> people to paint <var>WALL_FINAL</var> walls.',
		"hint14"	: 'We know the following about the number of walls <code>w</code> painted by <code>p</code> people in <code>t</code> minutes at a constant rate <code>r</code>.',
		"hint15"	: 'Substituting known values and solving for <code>r</code>:',
		"hint16"	: 'We can now calculate the amount of time to paint <var>WALL_FINAL</var> walls with <var>PEOPLE_FINAL</var> people.',
		"hint17"	: 'Round to the nearest minute:',
		"hint18"	: '<code>t = <var>TIME_FINAL</var>\text{ minutes}</code>'
		}
})