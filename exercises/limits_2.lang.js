({
	"nl" : {
		"question1"	: 'undefined',
		"question2"	: 'Find <code>\displaystyle\lim_{x \to \infty}\dfrac{<var>NUM.text()</var>}{<var>DEN.text()</var>}</code>.',
		"question3"	: 'Find <code>\displaystyle\lim_{x \to <var>K</var>}\dfrac{<var>A</var>}{(<var>B</var>x + <var>-K</var>\smash{)}^2}</code>.',
		"question4"	: 'Find <code>\displaystyle\lim_{x \to <var>PM</var>\infty}\dfrac{<var>NUM.text()</var>}{<var>DEN.text()</var>}</code>.',		
		"hint1"		: 'Look at the leading terms <code><var>expr(NUM.expr()[1])</var></code> and <code><var>expr(DEN.expr()[1])</var></code>.',
		"hint2"		: 'Because they have the same degree <code><var>DEG</var></code>, the limit is equal to the quotient of their coefficients.',
		"hint3"		: 'Look at the leading terms <code><var>expr(NUM.expr()[1])</var></code> and <code><var>expr(DEN.expr()[1])</var></code>.',
		"hint4"		: "Because the numerator's degree <code><var>NUM.getCoefAndDegreeForTerm(0).degree</var></code> is less than the denominator's degree <code><var>DEN.getCoefAndDegreeForTerm(0).degree</var></code>, the bottom term dominates as <code>x</code> approaches <code><var>PM</var>\infty</code>.",
		"hint5"		: 'Since the denominator grows faster than the numerator, the limit goes to <code>0</code>.',
		"hint6"		: 'Look at the leading terms <code><var>expr(NUM.expr()[1])</var></code> and <code><var>expr(DEN.expr()[1])</var></code>.',
		"hint7"		: 'As <code>x \to \infty</code>, the numerator approaches <code><var>NUM.getCoefAndDegreeForTerm(0).coef < 0 ? "-" : ""</var>\infty</code> because the coefficient <code><var>NUM.getCoefAndDegreeForTerm(0).coef</var></code> is <var>NUM.getCoefAndDegreeForTerm(0).coef < 0 ? "negative" : "positive"</var>.',
		"hint8"		: 'As <code>x \to \infty</code>, the denominator <var>NUM.getCoefAndDegreeForTerm(0).coef * DEN.getCoefAndDegreeForTerm(0).coef > 0 ? "also " : ""</var>approaches <code><var>DEN.getCoefAndDegreeForTerm(0).coef < 0 ? "-" : ""</var>\infty</code> because the coefficient <code><var>DEN.getCoefAndDegreeForTerm(0).coef</var></code> is <var>DEN.getCoefAndDegreeForTerm(0).coef < 0 ? "negative" : "positive"</var>.',
		"hint9"		: "Because the numerator's degree <code><var>NUM.getCoefAndDegreeForTerm(0).degree</var></code> is greater than the denominator's degree <code><var>DEN.getCoefAndDegreeForTerm(0).degree</var></code>, the limit diverges.",
		"hint10"	: 'The numerator and denominator have the same sign as <code>x</code> gets large, so the limit is <code>+\infty</code>.',
		"hint11"	: 'The numerator and denominator have differing signs as <code>x</code> gets large, so the limit is <code>-\infty</code>.',
		"hint12"	: 'Consider the behavior of the function as <code>x \to <var>K</var></code> from each direction.',
		"hint13"	: 'As <code>x</code> approaches <code><var>K</var></code> from the left, <code><var>B</var>x + <var>-K</var></code> starts negative and increases as it approaches <code>0</code>, so <code>\dfrac{<var>A</var>}{<var>B</var>x + <var>-K</var>}</code> approaches <code>-\infty</code>.',
		"hint14"	: 'As <code>x</code> approaches <code><var>K</var></code> from the right, <code><var>B</var>x + <var>-K</var></code> starts positive and decreases as it approaches <code>0</code>, so <code>\dfrac{<var>A</var>}{<var>B</var>x + <var>-K</var>}</code> approaches <code>+\infty</code>.',
		"hint15"	: 'Since the left- and right-hand limits are not equal, the limit is not defined.',
		"hint16"	: 'Consider the behavior of the function as <code>x \to <var>K</var></code> from each direction.',
		"hint17"	: 'In either direction, <code>(x + <var>-K</var>)^2</code> approaches <code>0</code>, so <code>\dfrac{<var>A</var>}{(<var>B</var>x + <var>-K</var>\smash{)}^2}</code> diverges.',
		"hint18"	: 'Because <code>(x + <var>-K</var>)^2</code> is always positive and <code><var>A</var></code> is <var>A > 0 ? "positive" : "negative"</var>, <code>\dfrac{<var>A</var>}{(<var>B</var>x + <var>-K</var>\smash{)}^2}</code> approaches <code><var>RIGHT_SIGN</var>\infty</code>.'
		}
})