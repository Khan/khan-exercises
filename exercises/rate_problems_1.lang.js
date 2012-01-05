({
	"nl" : {
		"problem1"	: '<var>person(1)</var> traveled by <var>vehicle(1)</var> at an average speed of <var>SPEED1</var> miles per hour.',
		"problem2"	: 'Then, <var>he(1)</var> traveled by <var>vehicle(2)</var> at an average speed of <var>SPEED2</var> miles per hour.',
		"problem3"	: 'In total, <var>he(1)</var> traveled <var>DIST</var> miles for <var>plural(TIME, "hour")</var>.',

		"question1"	: 'How many miles did <var>person(1)</var> travel by <var>vehicle(1)</var>? (Round to the nearest mile.)',
		"question2"	: 'How many miles did <var>person(1)</var> travel by <var>vehicle(2)</var>? (Round to the nearest mile.)',
		"question3"	: 'How many minutes did <var>person(1)</var> travel by <var>vehicle(1)</var>? (Round to the nearest minute.)',
		"question4"	: 'How many minutes did <var>person(1)</var> travel by <var>vehicle(2)</var>? (Round to the nearest minute.)',
		
		"hint1"		: '<code>d_<var>vehicleVar(1)</var> = <var>round(DIST1)</var></code> miles',
		"hint2"		: '<code>d_<var>vehicleVar(2)</var> = <var>round(DIST2)</var></code> miles',
		"hint3"		: '<code>t_<var>vehicleVar(1)</var> = <var>round(DIST1 / SPEED1 * 60)</var></code> minutes',
		"hint4"		: '<code>t_<var>vehicleVar(2)</var> = <var>round(DIST2 / SPEED2 * 60)</var></code> minutes',
		"hint5"		: 'Remember that <code>d = r * t</code>, or written another way, <code>t = d / r</code>.',
		"hint6"		: '<code>d_<var>vehicleVar(1)</var> =</code> distance that <var>person(1)</var> traveled by <var>vehicle(1)</var>',
		"hint7"		: '<code>d_<var>vehicleVar(2)</var> =</code> distance that <var>person(1)</var> traveled by <var>vehicle(2)</var>',
		"hint8"		: 'Total distance: <code class="hint_orange">d_<var>vehicleVar(1)</var> + d_<var>vehicleVar(2)</var> = <var>DIST</var></code>',
		"hint9"		: 'Total time: <code class="hint_blue">t_<var>vehicleVar(1)</var> + t_<var>vehicleVar(2)</var> = <var>TIME</var></code>',
		"hint10"	: '<code class="hint_blue">t_<var>vehicleVar(1)</var> = (d_<var>vehicleVar(1)</var> / <var>SPEED1</var>)</code> and'+
				'<code class="hint_blue">t_<var>vehicleVar(2)</var> = (d_<var>vehicleVar(2)</var> / <var>SPEED2</var>)</code>',
		"hint11"	: 'Substitute the blue equations for:'+
				'<code>(d_<var>vehicleVar(1)</var> / <var>SPEED1</var>) + (d_<var>vehicleVar(2)</var> / <var>SPEED2</var>) = <var>TIME</var></code>',
		"hint12"	: 'Multiply the above equation by <var>-1 * SPEED1</var>:'+
				'<code class="hint_orange">-d_<var>vehicleVar(1)</var> - (<var>SPEED1</var> / <var>SPEED2</var>) * d_<var>vehicleVar(2)</var>  = <var>-SPEED1 * TIME</var></code>',
		"hint13"	: 'Add the two orange equations for:'+
				'<code>(<var>SPEED2 - SPEED1</var> / <var>SPEED2</var>) * d_<var>vehicleVar(2)</var> = <var>DIST - (SPEED1 * TIME)</var></code>',
		"hint14"	: 'Calculating all variables (and then rounding to the nearest integer):<br>'+
				'<code>d_<var>vehicleVar(2)</var> =</code> <var>roundTo( 4 , DIST2 )</var> <code>(<var>round(DIST2)</var>)</code> miles<br>'+
				'<code>d_<var>vehicleVar(1)</var> =</code> <var>roundTo( 4 , DIST1 )</var> <code>(<var>round(DIST1)</var>)</code> miles<br>'+
				'<code>t_<var>vehicleVar(1)</var> =</code> <var>roundTo( 4 , DIST1 / SPEED1 * 60 )</var> <code>(<var>round(DIST1 / SPEED1 * 60)</var>)</code> minutes<br>'+
				'<code>t_<var>vehicleVar(2)</var> =</code> <var>roundTo( 4 , DIST2 / SPEED2 * 60 )</var> <code>(<var>round(DIST2 / SPEED2 * 60)</var>)</code> minutes'
		}
})