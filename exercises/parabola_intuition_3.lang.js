({
	"nl" : {
		"question1"	: 'First, find the <span class="hint_orange">focus</span> and <span class="hint_orange">directrix</span> of the parabola by moving'+
					'the orange point and line to their correct positions. Then use that information to find the equation of the parabola.',
		"question2"	: 'The <span class="hint_green">two green line segments</span> you see when you point to the parabola are always the same'+
					'length as each other. Use them to check that youve found the right focus and directrix.',
		"question3"	: 'Focus: </span><code>(</code><span id="focus-x-label"><code>0</code></span><code>\text{, }</code><span id="focus-y-label"><code>1</code></span><code>)</code>',
		"question4"	: 'Directrix: <code>y = </code><span id="directrix-label"><code>-1</code></span>',
		"question5"	: 'Equation of the parabola:<br />'+
						'<code>y - </code><span class="sol" data-fallback="0"><var>Y1</var></span>'+
						'<code> = </code><span class="sol" data-fallback="1"><var>A</var></span>'+
						'<code>(x - </code><span class="sol" data-fallback="0"><var>X1</var></span>'+
						'<code>)^2</code>',
		"question6"	: 'set the focus and directrix by moving them around the graph',
		"question7"	: 'for the equation of the parabola, you may enter integers, fractions, or exact decimals for each term',
		"question8"	: 'pay attention to the sign of each number you enter to be sure the entire equation is correct',
		
		"hint1"		: "All points on a parabola are equidistant from the focus and directrix. There is only one place to put the orange focus point"+
					"and directrix line where this is true."+
					'<button onClick="javascript:'+
						"vertex.moveTo(KhanUtil.tmpl.getVAR('X1'), KhanUtil.tmpl.getVAR('Y1') + 1/(4*KhanUtil.tmpl.getVAR('A')));"+
						"directrix.moveTo(KhanUtil.tmpl.getVAR('Y1') - 1/(4*KhanUtil.tmpl.getVAR('A')));"+
					'">Show me</button>',
		"hint2"		: 'The focus is <code>(<var>PRETTY_X1</var>,	<var>PRETTY_FOCUS_Y</var>)</code>'+
					'and the directrix is <code>y = <var>PRETTY_DIR_Y</var></code>',
		"hint3"		: 'The equation for a parabola is <code>y - y_1 = a (x - x_1)^2</code>, where <code>x_1</code> and <code>y_1</code>'+
					'are the coordinates of the <em>vertex</em> of the parabola (halfway between the focus and directrix).',
		"hint4"		: 'code>x_1</code> is the same as the <code>x</code> coordinate of the focus.'+
					'<code>y_1</code> is at the midpoint of <code><var>PRETTY_FOCUS_Y</var></code> and <code><var>PRETTY_DIR_Y</var></code>.',
		"hint5"		: 'So <code>x_1 = <var>PRETTY_X1</var></code>.'+
					'And <code>y_1 = \dfrac{<var>PRETTY_FOCUS_Y</var> + <var>PRETTY_DIR_Y</var>}{2} = <var>PRETTY_Y1</var></code>.',
		"hint6"		: 'The leading coefficient <code>a</code> in the equation <code>y - y_1 = a (x - x_1)^2</code> indicates how "wide" and'+
					'in what direction the parabola opens. Its always the reciprocal of 2 times the distance from the directrix to the focus.',
		"hint7"		: 'So the equation of the parabola is <code>y - <var>PRETTY_Y1</var> = <var>PRETTY_A</var>(x - <var>PRETTY_X1</var>)^2</code>.'
		}
})