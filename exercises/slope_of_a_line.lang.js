({
	"nl" : {
		"question1"	: 'What is the slope of the line through the points <code>(<var>X1</var>, <var>Y1</var>)</code> and <code>(<var>X2</var>, <var>Y2</var>)</code>?',
		"question2"	: 'Which graph best depicts a slope of <code><var>M.display</var></code>?',
		"question3"	: 'Which graph best depicts a slope of <code><var>M.display</var></code>?</span><span data-else>Which graph best depicts an undefined slope?</span>',
		
		"hint1"		: "Picture an airplane moving from left to right.  If the the airplane is taking off <code>\color{<var>BLUE</var>}{/}</code>, the slope is positive.  If it's landing <code>\color{<var>GREEN</var>}{\backslash}</code>, the slope is negative.  When the plane has reached cruising altitude  <code>\color{<var>ORANGE</var>}{-}</code>, the slope is 0.",
		"hint2"		: 'The quicker the airplane takes off, the steeper the positive slope, which means the answer will be a higher number than when the airplane takes off slowly. The quicker the airplane lands, the steeper the negative slope, which means the answer will be much more negative than when it lands slowly.',
		"hint3"		: '',
		"hint4"		: 'The equation for the slope is <code>m = \dfrac{\color{<var>BLUE</var>}{y_2} - \color{<var>ORANGE</var>}{y_1}}{\color{<var>BLUE</var>}{x_2} - \color{<var>ORANGE</var>}{x_1}}</code> for points <code>(\color{<var>ORANGE</var>}{<var>X1</var>}, \color{<var>ORANGE</var>}{<var>Y1</var>})</code> and <code>(\color{<var>BLUE</var>}{<var>X2</var>}, \color{<var>BLUE</var>}{<var>Y2</var>})</code>.',
		"hint5"		: 'Substituting in, we get <code>m = \dfrac{\color{<var>BLUE</var>}{<var>Y2</var>} - \color{<var>ORANGE</var>}{<var>negParens(Y1)</var>}}{\color{<var>BLUE</var>}{<var>X2</var>} - \color{<var>ORANGE</var>}{<var>negParens(X1)</var>}} ='+
						'\dfrac{\color{<var>GREEN</var>}{<var>Y2 - Y1</var>}}{\color{<var>PINK</var>}{<var>X2 - X1</var>}}</code>',
		"hint6"		: 'So, the slope <code>m</code> is <code><var>fractionReduce( Y2 - Y1, X2 - X1 )</var></code>.',
		"hint7"		: 'Remember that the slope corresponds to which direction the line slants, and how much it slants.',
		"hint8"		: 'Because <code><var>M.display</var></code> is positive, the line should slant upwards as we follow it to the right.',
		"hint9"		: 'The answer is either the <code class="hint_blue">\text{blue}</code> or <code class="hint_green">\text{green}</code> graph.',
		"hint10"	: 'In which graph does the y value change by <code><var>M.display</var></code> if the x value changes by <code>1</code>?',
		"hint11"	: 'The <code>\color{<var>COLORS[WHICH].hex</var>}{\text{<var>COLORS[WHICH].name.toLowerCase()</var>}}</code> graph best depicts a slope of <code><var>M.display</var></code>.',
		"hint12"	: 'Remember that the slope corresponds to how steep the line is.',
		"hint13"	: 'Imagine walking up a hill represented by a line. A larger slope means a steeper hill.',
		"hint14"	: 'A slope of <code><var>M.display</var></code> means there is no hill at all, and the graph should be flat.',
		"hint15"	: 'An <var>M.display</var> slope corresponds to a vertical line, which is like an impossibly steep hill.',
		"hint16"	: 'The <code>\color{<var>COLORS[WHICH].hex</var>}{\text{<var>COLORS[WHICH].name.toLowerCase()</var>}}</code> graph best depicts a<span data-if="WHICH === 2">n undefined</span> slope<span data-if="WHICH === 1"> of <code><var>M.display</var></code></span>.',
		"hint17"	: 'Because <code><var>M.display</var></code> is negative, the line should slant downwards as we follow it to the right.',
		"hint18"	: 'The answer is either the <code class="hint_orange">\text{orange}</code> or <code class="hint_pink">\text{pink}</code> graph.'
		}
})