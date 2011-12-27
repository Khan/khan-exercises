({
	"nl" : {
		"question1"	: 'Find the distance between the points <span class="point1">(<var>X1</var>, <var>Y1</var>)</span> and <span class="point2">(<var>X2</var>, <var>Y2</var>)</span>.',
		
		"hint1"		: 'Change in <span style="color: #679B00"> <code>x</code>:</span>'+
					'<span data-if="X2 - X1 > 0">'+
						'<span class="point2"><var>X2</var></span> - <span class="point1"><var>negParens(X1)</var></span>'+
					'</span>'+
					'<span data-else>'+
						'<span class="point1"><var>X1</var></span> - <span class="point2"><var>negParens(X2)</var></span>'+
					'</span>'+
					'= <span style="color: #679B00"><var>X_DIST</var></span>',
		"hint2"		: 'Change in <span style="color: #A66000"><code>y</code>:</span>'+
					'<span data-if="Y2 - Y1 > 0">'+
						'<span class="point2"><var>Y2</var></span> - <span class="point1"><var>negParens(Y1)</var></span>'+
					'</span>'+
					'<span data-else>'+
						'<span class="point1"><var>Y1</var></span> - <span class="point2"><var>negParens(Y2)</var></span>'+
					'</span>'+
					'= <span style="color: #A66000"><var>Y_DIST</var></span>',
		"hint3"		: 'The distance is the <span style="color: #FF4900">length of the hypotenuse</span> of this right triangle.',
		"hint4"		: 'By the Pythagorean Theorem, <span style="color: #FF4900">that length</span> is equal to:',
		"hint5"		: 'The distance is equal to the length of the side, which is <var>X_DIST+Y_DIST</var>'
		}
})