({
	"nl" : {
		"question1"	: '<code>\color{red}{f(x)}</code> is graphed in <span class="hint_red">red</span>.',
		"question2"	: '<code>\color{blue}{g(x)}</code> is graphed in <span class="hint_blue">blue</span>.',
		"question3"	: 'What is <code>\color{blue}{g(x)}</code> in terms of <code>\color{red}{f(x)}</code>?',
		
		"hint1"		: 'To get from <code>f(x)</code> to <code>g(x)</code>, first "flip" <code>f(x)</code> vertically by multiplying by <code>-1</code>, giving <code class="hint_purple">-f(x)</code>.',
		"hint2"		: 'Shift the function <code>-f(x)</code> <var>(Y_SHIFT &gt; 0 ? "up " : "down ") + abs(Y_SHIFT)</var> <var>(abs(Y_SHIFT) == 1 ? "unit" : "units")</var>, giving <code class="hint_green"><var>expr(["+",["*", FLIP,"f(x)"], Y_SHIFT])</var></code>.',
		"hint3"		: 'Now shift the function <code><var>expr(["+",["*", FLIP,"f(x)"], Y_SHIFT])</var></code> <var>(X_SHIFT &gt; 0 ? "left " : "right ") + abs(X_SHIFT)</var> <var>(abs(X_SHIFT) == 1 ? "unit" : "units")</var>, giving <code class="hint_blue"><var>expr(["+",["*", FLIP, ["*", "f", ["+","x", X_SHIFT]]], Y_SHIFT])</var></code>.',
		"hint4"		: 'We now know that <code>g(x)</code> = <code><var>expr(["+",["*", FLIP, ["*", "f", ["+","x", X_SHIFT]]],Y_SHIFT])</var></code>.'
		}
})