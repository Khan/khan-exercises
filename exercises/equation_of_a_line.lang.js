({
	"nl" : {
		"question1"	: 'A line goes through the following points, and the equation of that line is written in <code>y = mx + b</code> form.',
		"question2"	: 'What are the values of the slope <code>m</code> and the <code>y</code>-intercept <code>b</code>?',
		"question3"	: 'The equation of the line through the points <code>(<var>X1</var>, <var>Y1</var>)</code> and <code>(<var>X2</var>, <var>Y2</var>)</code> is written in the form <code>y = mx + b</code>.',
		"question4"	: 'What are the values of the slope <code>m</code> and the <code>y</code>-intercept <code>b</code>?',
		
		"hint1"		: 'We can plot all the points and the line that connects them.',
		"hint2"		: 'We can choose any two points to determine the equation of the line.',
		"hint3"		: "Let's choose <code>(<var>X1</var>, <var>Y1</var>)</code> and <code>(<var>X2</var>, <var>Y2</var>)</code>.",
		"hint4"		: 'The equation for the slope is <code>m = \dfrac{y_2 - y_1}{x_2 - x_1}</code>.',
		"hint5"		: 'Substitute both points.',
		"hint6"		: 'Writing the equation of the line, we have <code>y = <var>( M == -1 ? "-" : ( M == 1 ? "" : fractionReduce( Y2 - Y1, X2 - X1 )))</var> x + b</code> <span data-if="abs( M ) == 1"> (the value of <code>m</code> is equal to <code><var>M</var></code>)</span>.',
		"hint7"		: "To find <code>b</code>, we can substitute in either of the two points into the above equation. Let's go through both cases:",
		"hint8"		: 'Using the first point <code>(<var>X1</var>, <var>Y1</var>)</code>, substitute <code>y = <var>Y1</var></code> and <code>x = <var>X1</var></code>:',
		"hint9"		: 'Using the second point <code>(<var>X2</var>, <var>Y2</var>)</code>, substitute <code>y = <var>Y2</var></code> and <code>x = <var>X2</var></code>:',
		"hint10"	: 'In both cases, the equation of the line is <code>y = <var>( M == -1 ? "-" : ( M == 1 ? "" : fractionReduce( Y2 - Y1, X2 - X1 )))</var> x + <var>fractionReduce( Y1 * (X2 - X1) - X1 * ( Y2 - Y1 ), X2 - X1 )</var></code><span data-if="abs( M ) == 1"> (the value of <code>m</code> is equal to <code><var>M</var></code>)</span>.'
		"hint11"	: 'The equation for the slope is <code>m = \dfrac{y_2 - y_1}{x_2 - x_1}</code>.',
		"hint12"	: 'Substitute both points.',
		"hint13"	: 'Writing the equation of the line, we have <code>y = <var>( M == -1 ? "-" : ( M == 1 ? "" : fractionReduce( Y2 - Y1, X2 - X1 )))</var> x + b</code><span data-if="abs( M ) == 1"> (the value of <code>m</code> is equal to <code><var>M</var></code>)</span>.',
		"hint14"	: "To find <code>b</code>, we can substitute in either of the two points into the above equation. Let's go through both cases:",
		"hint15"	: 'Using the first point <code>(<var>X1</var>, <var>Y1</var>)</code>, substitute <code>y = <var>Y1</var></code> and <code>x = <var>X1</var></code>:',
		"hint16"	: 'Using the second point <code>(<var>X2</var>, <var>Y2</var>)</code>, substitute <code>y = <var>Y2</var></code> and <code>x = <var>X2</var></code>:',
		"hint17"	: 'In both cases, the equation of the line is <code>y = <var>( M == -1 ? "-" : ( M == 1 ? "" : fractionReduce( Y2 - Y1, X2 - X1 )))</var> x + <var>fractionReduce( Y1 * (X2 - X1) - X1 * ( Y2 - Y1 ), X2 - X1 )</var></code><span data-if="abs( M ) == 1"> (the value of <code>m</code> is equal to <code><var>M</var></code>)</span>.'
		}
})