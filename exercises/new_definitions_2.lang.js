({
	"nl" : {
		"question1"	: 'If <var>TEXTS</var>, find <code><var>X</var> <var>binop(1)</var> (<var>Y</var> <var>binop(2)</var> <var>Z</var>)</code>.',
		"question2"	: 'If <var>TEXTS</var>, find <code>(<var>Y</var> <var>binop(2)</var> <var>Z</var>) <var>binop(1)</var> <var>X</var></code>.',
		
		"hint1"		: '<var>NEED_VALU1 ? "Now, find" : "Find"</var> <code><var>X</var> <var>binop(1)</var> <var>NEED_VALU1 ? VALU2 : "y"</var></code>:',
		"hint2"		: '<var>NEED_VALU1 ? "Now, find" : "Find"</var> <code><var>NEED_VALU1 ? VALU2 : "x"</var> <var>binop(1)</var> <var>X</var></code>:',
		"hint3"		: 'First, find <code><var>Y</var> <var>binop(2)</var> <var>Z</var></code>:',
		"hint4"		: 'We dont need to find <code><var>Y</var> <var>binop(2)</var> <var>Z</var></code> because <code>x <var>binop(1)</var> y</code> depends only on the <var>NEED_VALU1_ONLY</var> operand.'
		}
})