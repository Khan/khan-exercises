function drawCircles( num, color ) {
	with ( KhanUtil.currentGraph ) {
		var numCols = Math.floor( Math.sqrt( num ));
		var numRows = Math.floor( num / numCols );
		var extra = num % numRows;

		init({
			range: [ [ 0, numCols + 1 ], [ -1, numRows + 2 ] ],
			scale: [30, 30]
		});

		style({
			stroke: color,
			fill: color
		});

		for ( var i = numRows; i > 0; i-- ) {
			for (var j = numCols; j > 0; j-- ) {
				circle( [ j, i ], 0.25 );
			}
		}

		for ( var j = extra; j > 0; j-- ) {
			circle( [ j, 0 ], 0.25 );
		}
	}
}

function crossOutCircles( numCircles, numCrossed, color ) {
	with ( KhanUtil.currentGraph ) {
		var numCols = Math.floor( Math.sqrt( numCircles ));
		var numRows = Math.floor( numCircles / numCols );
		var extra = numCircles % numRows;
		var count = 0;

		style({
			stroke: color,
			fill: color
		});

		for ( var i = numRows; i > 0; i-- ) {
			for (var j = numCols; j > 0; j-- ) {
				path( [ [ j - 0.3, i - 0.3 ], [ j + 0.3, i + 0.3 ] ] );
				path( [ [ j - 0.3, i + 0.3 ], [ j + 0.3, i - 0.3 ] ] );
				count += 1;
				if ( count === numCrossed ) {
					return;
				}
			}
		}

		for ( var j = extra; j > 0; j-- ) {
			path( [ [ j - 0.3, i - 0.3 ], [ j + 0.3, i + 0.3 ] ] );
			path( [ [ j - 0.3, i + 0.3 ], [ j + 0.3, i - 0.3 ] ] );
			count += 1;
			if ( count === numCrossed ) {
				return;
			}
		}
	}
}

function drawDigits( digits, startX, startY, color ) {
	var graph = KhanUtil.currentGraph;
	var set = [];
	jQuery.each( digits, function( index, digit ) {
		var str = "\\Huge{" + digit + "}";
		set.push( graph.label( [ startX + index, startY ], str, { color: color } ) );
	});
	return set;
}

// for subtraction
function borrow( idx, A_DIGITS, X_MAX, Y_FIRST, Y_CARRY ) {
	var graph = KhanUtil.currentGraph;
	var HIGHLIGHTS = graph.graph.highlights;
	var borrowedIdx = idx + 1;
	if ( A_DIGITS[ idx + 1 ] < 1 ) {
		borrowedIdx = borrow( idx + 1, A_DIGITS, X_MAX, Y_FIRST, Y_CARRY, HIGHLIGHTS );
	}
	A_DIGITS[ idx + 1 ] -= 1;
	A_DIGITS[ idx ] += 10;
	var depth = borrowedIdx - idx - 1;

	HIGHLIGHTS[ idx ].push( graph.label( [ X_MAX - idx, Y_CARRY + ( 0.5 * depth ) ],
										 "\\color{#6495ED}{" + A_DIGITS[ idx ] + "}", "below" ) );
	HIGHLIGHTS[ idx ].push( graph.path( [ [ X_MAX - 0.3 - idx, Y_FIRST - 0.4 ], [ X_MAX + 0.3 - idx, Y_FIRST + 0.4 ] ] ) );

	HIGHLIGHTS[ idx + 1 ].push( graph.label( [ X_MAX - 1 - idx, Y_CARRY + ( 0.5 * depth ) ],
											 "\\color{#FFA500}{" + A_DIGITS[ idx + 1 ] + "}", "below" ) );
	HIGHLIGHTS[ idx + 1 ].push( graph.path( [ [ X_MAX - 1.3 - idx, Y_FIRST - 0.4 ], [ X_MAX - 0.7 - idx, Y_FIRST + 0.4 ] ] ) );
	if ( depth !== 0 ) {
		HIGHLIGHTS[ idx + 1 ].push( graph.path( [ [ X_MAX - 1.3 - idx, Y_CARRY - 1 + ( 0.5 * depth) ], [ X_MAX - 0.7 - idx, Y_CARRY - 0.7 + ( 0.5 * depth) ] ] ) );
	}
	return borrowedIdx;
}

function doSubtractionStep( index, A, B, A_ORIG, A_DIGITS, B_DIGITS, X_MAX, Y_FIRST, Y_SECOND, Y_CARRY, Y_DIFF, X_SIDE, Y_SIDE ) {
	var graph = KhanUtil.currentGraph;
	var oldHighlights = graph.graph.highlights[ index ];
	while( oldHighlights.length ) {
		oldHighlights.shift().remove();
	}

	if ( index !== 0 ) {
		oldHighlights = graph.graph.highlights[ index - 1 ];
		while( oldHighlights.length ) {
			oldHighlights.shift().remove();
		}
	}

	var value = A_DIGITS[ index ];
	var withinB = index < B_DIGITS.length;
	var subtrahend = withinB ? B_DIGITS[ index ] : 0;
	var subStr = "";

	if ( value < subtrahend ) {
		borrow( index, A_DIGITS, X_MAX, Y_FIRST, Y_CARRY );
	} else if ( A_DIGITS[ index ] === A_ORIG[ index ] ) {
		graph.graph.highlights[ index ].push( graph.label( [ X_MAX - index, Y_FIRST ],
			"\\Huge{\\color{#6495ED}{" + A_DIGITS[ index ] +"}}" ) );
	} else {
		graph.graph.highlights[ index ].push( graph.label( [ X_MAX - index, Y_CARRY ],
			"\\color{#6495ED}{" + A_DIGITS[ index ] + "}", "below" ) );
	}
	
	if ( withinB ) {
		graph.graph.highlights[ index ].push( graph.label( [ X_MAX - index, Y_SECOND ],
			"\\Huge{\\color{#6495ED}{" + B_DIGITS[ index ] + "}}" ) );
		subStr = " - \\color{#6495ED}{" + subtrahend + "}";
	}
	
	var diff = A_DIGITS[ index ] - subtrahend;
	if ( ( ( A - B ) / Math.pow( 10, index ) ) > 1 ) {
		graph.label( [ X_MAX - index, Y_DIFF ],  "\\Huge{" + diff + "}" );
	}
	
	graph.graph.highlights[ index ].push( graph.label( [ X_MAX - index, Y_DIFF ],  "\\Huge{\\color{#28AE7B}{" + diff + "}}" ) );
	if ( subStr == "" ){
		subStr = "- \\color{#6495ED}{ 0 }";
	}
	graph.graph.highlights[ index ].push( graph.label( [ X_SIDE, Y_SIDE ], "\\Large{"
		+ "\\color{#6495ED}{" + A_DIGITS[ index ] + "}"
		+ subStr
		+ " = "
		+ "\\color{#28AE7B}{" + diff + "}}", "right" ) );
	
}

// for multiplication 0.5, 1
function drawRow( num, y, color, startCount ) {
	var graph = KhanUtil.currentGraph;

	graph.style({
		stroke: color
	});

	var set = graph.raphael.set();
	for ( var x = 0; x < num; x++ ) {
		set.push( graph.label( [ x, y ], "\\small{\\color{" + color + "}{" + ( startCount + x ) + "}}" ) );
		set.push( graph.circle( [ x, y ], 0.25 ) );
	}

	return set;
}

// currentGraph is the overall graph object, within which there is another graph that can hold things
// that is kind of confusing.
function initMultiplication( smallDigits, bigDigits, productDigits ) {
	var graph = KhanUtil.currentGraph;
	drawDigits( smallDigits.slice( 0 ).reverse(), 1 - smallDigits.length, 1 );
	drawDigits( bigDigits.slice( 0 ).reverse(), 1 - bigDigits.length, 2 );
	graph.path( [ [ -1 - productDigits.length, 0.5 ], [ 1, 0.5 ] ] );
	graph.label( [  - ( Math.max( bigDigits.length, smallDigits.length )), 1 ] ,"\\huge{\\times\\vphantom{0}}" );
	graph.graph.highlights = [];
	graph.graph.carry = 0;
}

function squareFractions( nom, den, perLine, spacing, size ){
	spacing = spacing || 2.5;
	perLine = perLine || 10;
	size = size ||  0.2;
	var graph = KhanUtil.currentGraph;
	var arr = [];
	var x = 0;
	var y = 0;

	for( y = 0;  y < den/perLine && y * perLine <= nom  ; y++ ){	
		for ( x = 0; x < perLine &&  y * perLine + x < nom   ; x++ ){
			arr.push( graph.regularPolygon( [ x * spacing * size, y * 2.5 * size ], 4, size, Math.PI/4 ).attr("stroke", "none").attr("fill", "#6495ed"  ).attr("stroke-linecap", "square" ) );	
		}
	}

	y--;
	for ( x = x; x < perLine; x++ ){
		arr.push( graph.regularPolygon( [ x * spacing * size, y * 2.5 * size ], 4, size, Math.PI/4 ).attr("fill", "black" ).attr("stroke", "none").attr("stroke-linecap", "square" ) );
	}
	
	y++;
	for( y = y ;  y < den/perLine; y++ ){	
		for ( x = 0; x < perLine; x++ ){
			arr.push( graph.regularPolygon( [ x * spacing * size, y * 2.5 * size], 4, size, Math.PI/4 ).attr("fill", "black" ).attr("stroke", "none").attr("stroke-linecap", "square" )  );	
		}
	}


	return arr;
}


function doMultiplicationStep( bigIndex, bigDigits, smallIndex, smallDigits ) {
	var graph = KhanUtil.currentGraph;
	while( graph.graph.highlights.length ) {
		graph.graph.highlights.pop().remove();
	}

	if ( bigIndex === 0 ) {
		graph.graph.carry = 0;
	}
	var bigDigit = bigDigits[ bigIndex ];
	var smallDigit = smallDigits[ smallIndex ];
	var product = smallDigit * bigDigit + graph.graph.carry;
	var ones = product % 10;
	var currCarry = Math.floor( product / 10 );

	graph.graph.highlights = graph.graph.highlights.concat( drawDigits( [ bigDigit ], -bigIndex, 2, "#6495ED" ) );
	graph.graph.highlights = graph.graph.highlights.concat( drawDigits( [ smallDigit ], -smallIndex, 1, "#FF00AF" ) );
	if ( graph.graph.carry ) {
		graph.graph.highlights = graph.graph.highlights.concat( graph.label( [ -bigIndex, 3 ], "\\color{#FFA500}{" + graph.graph.carry + "}", "below" ) );
	}
	graph.label( [ 2, -smallIndex * bigDigits.length - bigIndex + 2 ],
		"\\color{#6495ED}{" + bigDigit + "}"
		+ "\\times"
		+ "\\color{#FF00AF}{" + smallDigit + "}"
		+ ( graph.graph.carry ? "+\\color{#FFA500}{" + graph.graph.carry + "}" : "" )
		+ "="
		+ "\\color{#28AE7B}{" + product + "}", "right" );
	
	drawDigits( [ ones ], -smallIndex - bigIndex, -smallIndex );
	graph.graph.highlights = graph.graph.highlights.concat( drawDigits( [ ones ], -smallIndex - bigIndex, -smallIndex, "#28AE7B" ) );
	
	if ( currCarry ) {
		graph.graph.highlights = graph.graph.highlights.concat( graph.label( [ -1 - bigIndex, 3 ], "\\color{#28AE7B}{" + currCarry + "}", "below" ) );
		if ( bigIndex === bigDigits.length - 1 ) {
			drawDigits( [ currCarry ], -smallIndex - bigIndex - 1, -smallIndex );
			graph.graph.highlights = graph.graph.highlights.concat( drawDigits( [ currCarry ], -smallIndex - bigIndex - 1, -smallIndex, "#28AE7B" ) );
		}
	}
	graph.graph.carry = currCarry;
}
