({
	"nl" : {
		"question1"	: 'Graph the following inequality:',
		"question2"	: '',
		"question3"	: '',
		"question4"	: '',
		"question5"	: '',
		
		"label1"	: '<input name="dashradio" type="radio" value="solid" checked onClick="javascript:KhanUtil.currentGraph.graph.dasharray = ''; KhanUtil.currentGraph.graph.update();" />Solid line',
		"label2"	: '<input name="dashradio" type="radio" value="dashed" onClick="javascript:KhanUtil.currentGraph.graph.dasharray = '- ';KhanUtil.currentGraph.graph.update();" />Dashed line',
		
		"instruction1" : 'Drag the two points to move the line into the correct position.',
		
		"example1"	: 'graph the inequality',
		"example2" 	: 'make sure the correct side is shaded',
		"example3" 	: 'make sure the line is correctly shown as solid or dashed',
		
		"hint1"		: 'Convert <code><var>expr([ "+", [ "*", A, "x" ], [ "*", B, "y" ] ])</var> <var>STD_FORM_COMP</var> <var>C</var></code>to slope-intercept form by solving for <code>y</code>.',
		"hint2"		: '<var>A &lt; 0 ? "Add" : "Subtract"</var> <code><var>abs( A )</var>x</code> <var>A &lt; 0 ? "to" : "from"</var> both sides:',
		"hint3"		: 'Divide both sides by <code><var>B</var></code><span data-if="B < 0">. Since youre multiplying or dividing by a negative number, <strong>dont forget</strong> to flip the inequality sign</span>:',
		"hint4"		: 'The y-intercept is <code class="hint_green"><var>YINT</var></code> and the slope is <code class="hint_purple"><var>decimalFraction( SLOPE, true, true )</var></code>.Since the y-intercept is <code class="hint_green"><var>YINT</var></code>, the line must pass through the point <code class="hint_green">(0, <var>YINT</var>)</code>.',
		"hint5"		: 'The slope is <code class="hint_purple"><var>decimalFraction( SLOPE, true, true )</var></code>. Remember that'
						'the slope tells you rise over run. So in this case for every'
						'<code><var>abs( SLOPE_FRAC[0] )</var></code>'
						'<var>"position" + ( abs( SLOPE_FRAC[0] ) !== 1 ? "s" : "" )</var>'
						'you move'
						'<span data-if="SLOPE_FRAC[0] < 0"><em>down</em> (because its negative)</span>'
						'<span data-else>up</span>'s
						'you must also move'
						'<code><var>SLOPE_FRAC[1]</var></code>'
						'<var>"position" + ( abs( SLOPE_FRAC[1] ) !== 1 ? "s" : "" )</var>'
						'to the right. So the line must also pass through <code class="hint_purple">(<var>SLOPE_FRAC[1]</var>, <var>YINT + SLOPE_FRAC[0]</var>)</code>',
		"hint6"		: 'Since our inequality has a <var>LESS_THAN ? "less-than" : "greater-than"</var><var>INCLUSIVE ? " or equal to" : ""</var> sign, that means that any point<strong><var>LESS_THAN ? "below" : "above"</var></strong> the line is a solution to the inequality, so the area <var>LESS_THAN ? "below" : "above"</var>the line should be shaded.',
		"hint7"		: 'Note that since the sign is <var>LESS_THAN ? "less-than" : "greater-than"</var> or <strong>equal to</strong>, any point on the line is also a solution, so theline should be solid.',
		"hint8"		: 'Note that since the sign is <var>LESS_THAN ? "less-than" : "greater-than"</var> (and not equal to), any point on the line is <strong>not</strong> part of the solution,so the line should be dashed to indicate this.',
		"hint9"		: '',
		"hint10"	: ''
		}
})