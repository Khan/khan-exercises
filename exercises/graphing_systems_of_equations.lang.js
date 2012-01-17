({
	"nl" : {
		"question1"	: 'Graph this system of equations and solve.',
		"question2"	: 'Click and drag the points to move the lines.',
		"question3"	: 'Your graphs are also part of your answer.',
		"question4"	: 'two integers like <code>6</code>',
		
		"hint1"		: 'Convert the first equation,'+
				'<code><var>expr([ "+", [ "*", A1, "x" ], [ "*", B1, "y" ] ])</var> = <var>C1</var></code>,'+
				'to slope-intercept form.',
		"hint2"		: 'The y-intercept for the first equation is <code><var>YINT_1</var></code>, so the first line'+
			'must pass through the point <code>(0, <var>YINT_1</var>)</code>.',
		"hint3"		: 'The slope for the first equation is <code><var>decimalFraction( SLOPE_1, true, true )</var></code>. Remember that'+
			'the slope tells you rise over run. So in this case for every'+
			'<code><var>abs( SLOPE_1_FRAC[0] )</var></code>'+
			'<var>"position" + ( abs( SLOPE_1_FRAC[0] ) !== 1 ? "s" : "" )</var>'+
			'you move'+
			'<span data-if="SLOPE_1_FRAC[0] < 0"><em>down</em> (because its negative)</span>'+
			'<span data-else>up</span>'+
			'you must also move'+
			'<code><var>SLOPE_1_FRAC[1]</var></code>'+
			'<var>"position" + ( abs( SLOPE_1_FRAC[1] ) !== 1 ? "s" : "" )</var>'+
			'to the right.',
		"hint4"		: '<code><var>SLOPE_1_FRAC[1]</var></code>'+
			'<var>"position" + ( abs( SLOPE_1_FRAC[1] ) !== 1 ? "s" : "" )</var> to the right and'+
			'<code><var>abs( SLOPE_1_FRAC[0] )</var></code>'+
			'<var>"position" + ( abs( SLOPE_1_FRAC[0] ) !== 1 ? "s" : "" )</var>'+
			'<span data-if="SLOPE_1_FRAC[0] < 0">down</span><span data-else>up</span> from'+
			'<code>(0, <var>YINT_1</var>)</code> is'+
			'<code>(<var>SLOPE_1_FRAC[1]</var>, <var>YINT_1 + SLOPE_1_FRAC[0]</var>)</code>.',
		"hint5"		: 'Graph the blue line so it passes through'+
			'<code>(0, <var>YINT_1</var>)</code> and'+
			'<code>(<var>SLOPE_1_FRAC[1]</var>, <var>YINT_1 + SLOPE_1_FRAC[0]</var>)</code>.'+
			'<br /><input type="button" value="Show me" onClick="javascript:'+
				"KhanUtil.currentGraph.graph.pointA.moveTo( 0, KhanUtil.tmpl.getVAR( 'YINT_1' ), true );"+
				"KhanUtil.currentGraph.graph.pointB.moveTo( KhanUtil.tmpl.getVAR( 'SLOPE_1_FRAC[1]' ),"+
					"KhanUtil.tmpl.getVAR( 'YINT_1' ) + KhanUtil.tmpl.getVAR( 'SLOPE_1_FRAC[0]' ), true );"+
			'" />',
		"hint6"		: 'Convert the second equation,'+
				'<code><var>expr([ "+", [ "*", A2, "x" ], [ "*", B2, "y" ] ])</var> = <var>C2</var></code>,'+
				'to slope-intercept form.',
		"hint7"		: 'The y-intercept for the second equation is <code><var>YINT_2</var></code>, so the second line'+
			'must pass through the point <code>(0, <var>YINT_2</var>)</code>.',
		"hint8"		: 'The slope for the second equation is <code><var>decimalFraction( SLOPE_2, true, true )</var></code>. Remember that'+
			'the slope tells you rise over run. So in this case for every'+
			'<code><var>abs( SLOPE_2_FRAC[0] )</var></code>'+
			'<var>"position" + ( abs( SLOPE_2_FRAC[0] ) !== 1 ? "s" : "" )</var>'+
			'you move'+
			'<span data-if="SLOPE_2_FRAC[0] < 0"><em>down</em> (because its negative)</span>'+
			'<span data-else>up</span>'+
			'you must also move'+
			'<code><var>SLOPE_2_FRAC[1]</var></code>'+
			'<var>"position" + ( abs( SLOPE_1_FRAC[1] ) !== 1 ? "s" : "" )</var>'+
			'to the right.',
		"hint9"		: '<code><var>SLOPE_2_FRAC[1]</var></code>'+
			'<var>"position" + ( abs( SLOPE_2_FRAC[1] ) !== 1 ? "s" : "" )</var> to the right and'+
			'<code><var>abs( SLOPE_2_FRAC[0] )</var></code>'+
			'<var>"position" + ( abs( SLOPE_2_FRAC[0] ) !== 1 ? "s" : "" )</var>'+
			'<span data-if="SLOPE_2_FRAC[0] < 0">down</span><span data-else>up</span> from'+
			'<code>(0, <var>YINT_2</var>)</code> is'+
			'<code>(<var>SLOPE_2_FRAC[1]</var>, <var>YINT_2 + SLOPE_2_FRAC[0]</var>)</code>.',
		"hint10"	: 'Graph the green line so it passes through'+
			'<code>(0, <var>YINT_2</var>)</code> and'+
			'<code>(<var>SLOPE_2_FRAC[1]</var>, <var>YINT_2 + SLOPE_2_FRAC[0]</var>)</code>.'+
			'<br /><input type="button" value="Show me" onClick="javascript:'+
				"KhanUtil.currentGraph.graph.pointC.moveTo( 0, KhanUtil.tmpl.getVAR( 'YINT_2' ), true );"+
				"KhanUtil.currentGraph.graph.pointD.moveTo( KhanUtil.tmpl.getVAR( 'SLOPE_2_FRAC[1]' ),"+
					"KhanUtil.tmpl.getVAR( 'YINT_2' ) + KhanUtil.tmpl.getVAR( 'SLOPE_2_FRAC[0]' ), true );"+
			'" />',
		"hint11"	: 'The solution is the point where the two lines intersect.',
		"hint12"	: 'The lines intersect at <code class="hint_pink">(<var>X</var>, <var>Y</var>)</code>.'
		}
})