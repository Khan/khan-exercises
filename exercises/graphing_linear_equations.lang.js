({
	"nl" : {
		"question1"	: 'Drag the two points to move the line into the correct position.',

		
		"hint1"		: 'Convert <code><var>expr([ "+", [ "*", A, "x" ], [ "*", B, "y" ] ])</var> = <var>C</var></code>'+
				'to slope-intercept form by solving for <code>y</code>.',
		"hint2"		: '<var>A &lt; 0 ? "Add" : "Subtract"</var> <code><var>abs( A )</var>x</code> <var>A &lt; 0 ? "to" : "from"</var> both sides:',
		"hint3"		: 'Divide both sides by <code><var>B</var></code>:',
		"hint4"		: 'The y-intercept is <code class="hint_green"><var>YINT</var></code> and the slope is <code class="hint_purple"><var>decimalFraction( SLOPE, true, true )</var></code>.',
		"hint5"		: 'The y-intercept is <code class="hint_green"><var>YINT</var></code>, so the line must pass through the point <code class="hint_green">(0, <var>YINT</var>)</code>.',
		"hint6"		: 'The slope is <code class="hint_purple"><var>decimalFraction( SLOPE, true, true )</var></code>. Remember that'+
				'the slope tells you rise over run. So in this case for every'+
				'<code><var>abs( SLOPE_FRAC[0] )</var></code>'+
				'<var>"position" + ( abs( SLOPE_FRAC[0] ) !== 1 ? "s" : "" )</var>'+
				'you move'+
				'<span data-if="SLOPE_FRAC[0] < 0"><em>down</em> (because its negative)</span>'+
				'<span data-else>up</span>'+
				'you must also move'+
				'<code><var>SLOPE_FRAC[1]</var></code>'+
				'<var>"position" + ( abs( SLOPE_FRAC[1] ) !== 1 ? "s" : "" )</var>'+
				'to the right.',
		"hint7"		: 'style({'+
					'stroke: "purple",'+
					'strokeWidth: 2,'+
					'arrows: "-&gt;"'+
				'}, function() {'+
					'path([ [ 0, YINT ], [ 0, YINT + SLOPE_FRAC[0] ] ]).toBack();'+
					'path([ [ 0, YINT + SLOPE_FRAC[0] ], [ SLOPE_FRAC[1], YINT + SLOPE_FRAC[0] ] ]).toBack();'+
				'});'+
				'label( [ 0, YINT + SLOPE_FRAC[0] / 2 ], abs( SLOPE_FRAC[0] ) + " \\text{ " + ( SLOPE_FRAC[0] &lt; 0 ? "down" : "up" ) + "} \\quad", "left", { color: "purple" } );'+
				'label( [ 0, YINT + SLOPE_FRAC[0] ], SLOPE_FRAC[1] + " \\text{ right}", ( SLOPE_FRAC[0] &lt; 0 ? "below right" : "above right" ), { color: "purple" } );'+
				'graph.yint.toBack();',
		"hint8"		: 'So the line must also pass through <code class="hint_purple">(<var>SLOPE_FRAC[1]</var>, <var>YINT + SLOPE_FRAC[0]</var>)</code>'
		}
})