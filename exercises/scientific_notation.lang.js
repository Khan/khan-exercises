({
	"nl" : {
		"question1"	: 'Express this number in scientific notation.',
		"question2"	: 'So: <code><var>PRETTY_DECIMAL</var> = \leadingColor{<var>LEADING</var>}<var>TRAIL</var> \times 10^{\exponentColor{<var>E</var>}}</code>',
		
		"hint1"		: 'There are <code>\exponentColor{<var>E</var>}</code> digits to the right of the leading <code>\leadingColor{<var>LEADING</var>}</code> (and to the left of the decimal).',
		"hint2"		: 'Count the zeroes to the right of the decimal point before the leading <code>\leadingColor{<var>LEADING</var>}</code>: there <span data-if="E + 1 === -1">is 1 zero</span><span data-else>are <code><var>(E + 1) * -1</var></code> zeroes</span>.',
		"hint3"		: 'If you count the leading digit <code>\leadingColor{<var>LEADING</var>}</code><span data-if="E + 1 < -1"> and those zeroes</span><span data-else-if="E + 1 === -1"> and the 1 zero</span>, there <var>E === -1 ? "is" : "are"</var> <code>\exponentColor{<var>E * -1</var>}</code> <var>E === -1 ? "digit" : "digits"</var> to the <span style="color: purple;">right</span> of the decimal point.'
		}
})