({
	"nl" : {
		"question1"	: '<p>Some ordered pairs for a linear function of <span class='hint_orange'><code><var>X_VAR</var></code></span> are given in the table below.</p> <p><b>Which equation was used to generate this table?</b></p>',
		"question2"	: '<p>The data in the table show the cost of buying bulk vegetables per pound, including the fee for the clerk to package the vegetables in boxes.</p> <p><b>Which equation fits the data?</b></p>',
		"question3"	: '<p><b>The table below was generated using the following equation:</b><code>\quad f(x) = <var>COEF</var>x + <var>CONST</var></code></p> <p><b>Find the missing values.</b></p>',

		"var1"		: '"p"',
		"var2"		: '"c"',
		"var3"		: '"Pound (p)"',
		"var4"		: '"Cost (c)"',
		
		"hint0"		: 'Take one of the equations and try plugging in the values from the table. If the equality does not hold for at least one set of values, then we can eliminate that answer choice.',
		"hint1"		: 'For example, consider <code><var>Y_VAR</var> = <var>WRONG_ANSWERS[0].coef</var><var>X_VAR</var> + <var>WRONG_ANSWERS[0].const</var></code>. Substituting in <code>\color{<var>ORANGE</var>}{<var>X_VAR</var> = <var>XVALS[0]</var>}</code> and <code>\color{<var>BLUE</var>}{<var>Y_VAR</var> = <var>XVALS[0] * COEF + CONST</var>}</code> shows that the equality holds for the first row of the table :',
		"hint2"		: 'However, plugging in <code>\color{<var>ORANGE</var>}{<var>X_VAR</var> = <var>XVALS[1]</var>}</code> and <code>\color{<var>BLUE</var>}{<var>Y_VAR</var> = <var>XVALS[1] * COEF + CONST</var>}</code> from the second row of the table gives us:',
		"hint3"		: 'So we can eliminate <code><var>Y_VAR</var> = <var>WRONG_ANSWERS[0].coef</var><var>X_VAR</var> + <var>WRONG_ANSWERS[0].const</var></code> from consideration and try a different answer choice.',
		"hint4"		: 'When we try <code><var>Y_VAR</var> = <var>COEF</var><var>X_VAR</var> + <var>CONST</var></code>, we see that it holds up for each set of values in the table.',
		"hint5"		: 'The equation that fits this table of values is <code><var>Y_VAR</var> = <var>COEF</var><var>X_VAR</var> + <var>CONST</var></code>.',
		"hint6"		: 'Plug the corresponding values of <code class="hint_orange">x</code> into the equation to find the missing values of <code class="hint_blue">f(x)</code>.',
		"hint7"		: 'The missing <span data-if="I === 1">value is</span><span data-else>values are</span>:'
		}
})