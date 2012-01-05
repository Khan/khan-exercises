({
	"nl" : {
		"question1"	: 'Find the slope and y-intercept of the line that is <code>\color{<var>GREEN</var>}{\text{<var>LINE_TYPE</var>}}</code> to <code>\enspace \color{<var>BLUE</var>}{y = <span data-if="abs( M_FRAC ) !== 1"><var>M_FRAC</var></span><span data-else><var>M_SIGN</var></span>x <span data-if="B !== 0">+ <var>B</var></span>}\enspace</code> and passes through the point <code>\color{red}{(<var>X</var>, <var>Y</var>)}</code>.</b>',
		"question2"	: 'What do the following two equations represent?',
		
		"list1"		: 'Equivalent lines',
		"list2"		: 'Parallel lines',
		"list3"		: 'Perpendicular lines',
		"list4"		: 'None of the above',
		
		"hint1"		: 'Lines are considered perpendicular if their slopes are negative reciprocals of each other. ',
		"hint2"		: 'The slope of the blue line is <code>\color{<var>BLUE</var>}{<var>M_FRAC</var>}</code>, and its negative reciprocal is <code>\color{<var>GREEN</var>}{<var>M_PERP_FRAC</var>}</code>.',
		"hint3"		: 'Thus, the equation of our perpendicular line will be of the form <code>\enspace \color{<var>GREEN</var>}{y = <span data-if="abs( M_PERP_FRAC ) !== 1"><var>M_PERP_FRAC</var></span><span data-else><var>M_PERP_SIGN</var></span>x + b}\enspace</code>.',
		"hint4"		: 'We can plug our point, <code>(<var>X</var>, <var>Y</var>)</code>, into this equation to solve for <code>\color{<var>GREEN</var>}{b}</code>, the y-intercept.',
		"hint5"		: 'The equation of the perpendicular line is <code>\enspace \color{<var>GREEN</var>}{y = <span data-if="abs( M_PERP_FRAC ) !== 1"><var>M_PERP_FRAC</var></span><span data-else><var>M_PERP_SIGN</var></span>x<span data-if="Y - ( -1 / M * X ) !== 0"> + <var>decimalFraction( Y - ( -1 / M * X ), "true", "true" )</var></span>}\enspace</code>.',
		"hint6"		: 'Parallel lines have the same slope.',
		"hint7"		: 'The slope of the blue line is <code>\color{<var>BLUE</var>}{<var>M_FRAC</var>}</code>, so the equation of our parallel line will be of the form <code>\enspace \color{<var>GREEN</var>}{y = <span data-if="abs( M_FRAC ) !== 1"><var>M_FRAC</var></span><span data-else><var>M_SIGN</var></span>x + b}\enspace</code>.',
		"hint8"		: 'We can plug our point, <code>(<var>X</var>, <var>Y</var>)</code>, into this equation to solve for <code>\color{<var>GREEN</var>}{b}</code>, the y-intercept.',
		"hint9"		: 'The equation of the parallel line is <code>\enspace \color{<var>GREEN</var>}{y = <span data-if="abs( M_FRAC ) !== 1"><var>M_FRAC</var></span><span data-else><var>M_SIGN</var></span>x<span data-if="Y - ( M * X ) !== 0"> + <var>decimalFraction( Y - M * X, "true", "true" )</var>}</span>\enspace</code>.',
		"hint10"	: 'Putting the first equation in <code>y = mx + b</code> form gives:',
		"hint11"	: 'Putting the second equation in <code>y = mx + b</code> form gives:',
		"hint12"	: 'The slopes are not the same, so the lines are not equivalent or parallel. The slopes are not negative inverses of each other, so the lines are not perpendicular. The correct answer is none of the above.',
		"hint13"	: 'The above equations turn into the same equation, so they represent equivalent lines.',
		"hint14"	: 'The slopes are equal, and the y-intercepts are different, so the lines are parallel.',
		"hint15"	: 'The slopes are negative inverses of each other, so the lines are perpendicular.'
		
		}
})