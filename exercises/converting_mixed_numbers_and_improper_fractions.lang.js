({
	"nl" : {
		"question1"	: 'Convert <code><var>fraction( I_NUM, I_DENOM, false, true )</var></code> to a mixed number.',
		"question2"	: 'Convert <code><var>WHOLE</var>\ <var>fraction( M_NUM, M_DENOM, false, true )</var></code> to an improper fraction.',
		
		"hint1"		: 'First, divide the numerator by the denominator.',
		"hint2"		: 'So the improper fraction has <code class="hint_green"><var>WHOLE</var></code> wholes in it, which is equal to <code>\color{#28AE7B}{<var>WHOLE</var>} \times \dfrac{<var>I_DENOM</var>}{<var>I_DENOM</var>} = \color{#28AE7B}{<var>fraction( I_DENOM * WHOLE, I_DENOM, false, false )</var>}</code>.',
		"hint3"		: 'This quotient <code class="hint_green"><var>WHOLE</var></code> is the whole number part of the mixed number.',
		"hint4"		: 'We also have a remainder of <code class="hint_purple"><var>M_REDUCED_NUM</var></code>, though. That represents the <code>\dfrac{\color{purple}{<var>M_REDUCED_NUM</var>}}{<var>I_DENOM</var>}</code> remaining from the improper fraction; it wasn't enough to be another whole number.',
		"hint5"		: 'The converted mixed fraction is <code>\color{#28AE7B}{<var>WHOLE</var>}\ \color{purple}{<var>fraction( M_NUM, M_DENOM, false, true )</var>}.</code>',
		"hint6"		: 'Note that if we add up the two pieces of our mixed fraction, <code>\color{#28AE7B}{<var>fraction( I_DENOM * WHOLE, I_DENOM, false, false )</var>} + \color{purple}{<var>fraction( M_NUM, M_DENOM, false, true )</var>}</code>, we get the original improper fraction <code><var>fraction( I_NUM, I_DENOM, false, true )</var></code>.',
		"hint7"		: 'This mixed number is equivalent to <code>\color{#FFA500}{<var>WHOLE</var>} + \color{#6495ED}{<var>fraction( M_NUM, M_DENOM, false, true )</var>}</code>.',
		"hint8"		: 'First, convert the <span class="hint_orange">whole part</span> of the mixed number to a fraction with the same denominator <code><var>M_REDUCED_DENOM</var></code> as the <span class="hint_blue">fractional part</span>.',
		"hint9"		: 'So now we have our number in the form <code>\color{#FFA500}{\dfrac{<var>WHOLE * M_REDUCED_DENOM</var>}{<var>M_REDUCED_DENOM</var>}} + \color{#6495ED}{<var>fraction( M_NUM, M_DENOM, false, true )</var>}</code>.',
		"hint10"	: 'Now, just add the two fractions and simplify!'
		}
})