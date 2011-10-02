function Adder( a, b ) {
	var graph = KhanUtil.currentGraph;
	var digitsA = KhanUtil.digits( a );
	var digitsB = KhanUtil.digits( b );
	var highlights = [];
	var carry = 0;
	var pos = { max: 0,
		carry: 3,
		first: 2,
		second: 1,
		sum: 0,
		sideX: Math.max( digitsA.length, digitsB.length ) + 2,
		sideY: 1.5 };

	var index = 0;
	var numHints = 0;

	this.show = function() {
		graph.init({
			range: [ [ -1, 11 ], [ pos.sum - 0.5, pos.carry + 0.5 ] ],
			scale: [30, 45]
		});
		pos.max = KhanUtil.digits( a + b ).length;
		numHints = pos.max + 1;
		drawDigits( digitsA.slice( 0 ).reverse(), pos.max - digitsA.length + 1, pos.first );
		drawDigits( digitsB.slice( 0 ).reverse(), pos.max - digitsB.length + 1, pos.second );

		graph.path( [ [ -0.5, pos.second - 0.5 ], [ pos.max + 0.5, pos.second - 0.5 ] ]);
		graph.label( [ 0, 1 ] ,"\\huge{+\\vphantom{0}}" );
	};

	this.showHint = function() {
		this.removeHighlights();
		if ( ( index === numHints - 2 ) && ( numHints - 1 > digitsA.length ) ) {
			this.showFinalCarry();
			index++;
			return;
		} else if ( index === numHints - 1 ) {
			return;
		}
		var prevCarry = carry;
		var prevCarryStr = "";
		var carryStr = "";
		var addendStr = "";
		var sum;

		var x = pos.max - index;

		if ( prevCarry !== 0 ) {
			highlights.push( graph.label( [ x, pos.carry ], "\\color{#6495ED}{" + prevCarry + "}", "below" ) );
			prevCarryStr =  "\\color{#6495ED}{" + prevCarry + "} + ";
		}

		sum = digitsA[ index ] + carry;
		highlights.push( drawDigits( [ digitsA[ index ] ], x, pos.first, KhanUtil.BLUE ) );

		if ( index < digitsB.length ) {
			highlights.push( drawDigits( [ digitsB[ index ] ], x, pos.second, KhanUtil.BLUE ) );
			addendStr = " + \\color{#6495ED}{" + digitsB[ index ] + "}";
			sum += digitsB[ index ];
		}

		drawDigits( [ sum % 10 ], x, pos.sum );
		highlights.push( drawDigits( [ sum % 10 ], x, pos.sum, KhanUtil.GREEN ) );

		carry = Math.floor( sum / 10 );
		if ( carry !== 0 ) {
			highlights.push( graph.label( [ x - 1, pos.carry ],
				"\\color{#FFA500}{" + carry + "}", "below" ) );
			carryStr = "\\color{#FFA500}{" + carry + "}";
		}

		this.showSideLabel( "\\Large{"
			+ prevCarryStr
			+ "\\color{#6495ED}{" + digitsA[ index ] + "}"
			+ addendStr
			+ " = "
			+ carryStr
			+ "\\color{#28AE7B}{" + sum % 10 + "}"
			+ "}" );

		index++;
	};

	this.showFinalCarry = function() {
		highlights.push( graph.label( [ pos.max - index, pos.carry ],
			"\\color{#6495ED}{" + carry + "}", "below" ) );
		graph.label( [ pos.max - index, pos.sum ], "\\Huge{" + carry + "}" );
		highlights.push( graph.label( [ pos.max - index, pos.sum ],
			"\\Huge{\\color{#28AE7B}{" + carry + "}}" ) );

		this.showSideLabel("\\Large{"
			+ "\\color{#6495ED}{" + carry + "}"
			+ " = "
			+ "\\color{#28AE7B}{" + carry + "}"
			+ "}" );
	};

	this.getNumHints = function() {
		return numHints;
	};

	this.removeHighlights = function() {
		while( highlights.length ) {
			var h = highlights.pop();
			if ( h.remove ) {
				h.remove();
			} else {
				while( h.length ) {
					h.pop().remove();
				}
			}
		}
	}

	this.showSideLabel = function( str ) {
		highlights.push( graph.label( [ pos.sideX, pos.sideY ], str, "right" ) );
	}
}

function Subtractor( a, b ) {
	var graph = KhanUtil.currentGraph;
	var digitsA = KhanUtil.digits( a );
	var digitsB = KhanUtil.digits( b );
	var workingDigitsA = digitsA.slice( 0 );
	var workingDigitsB = digitsB.slice( 0 );
	var highlights = [];
	var carry = 0;
	var pos = { max: 0,
		carry: 3,
		first: 2,
		second: 1,
		diff: 0,
		sideX: Math.max( digitsA.length, digitsB.length ) + 2,
		sideY: 1.5 };

	var index = 0;
	var numHints = 0;

	this.show = function() {
		graph.init({
			range: [ [ -1, 11 ], [ pos.sum - 0.5, pos.carry + 0.5 ] ],
			scale: [30, 45]
		});
		pos.max = KhanUtil.digits( a ).length;
		numHints = pos.max + 1;
		drawDigits( digitsA.slice( 0 ).reverse(), pos.max - digitsA.length + 1, pos.first );
		drawDigits( digitsB.slice( 0 ).reverse(), pos.max - digitsB.length + 1, pos.second );

		graph.path( [ [ -0.5, pos.second - 0.5 ], [ pos.max + 0.5, pos.second - 0.5 ] ]);
		graph.label( [ 0, 1 ] ,"\\huge{-\\vphantom{0}}" );

		for ( var i = 0; i < digitsA.length; i++ ) {
			highlights.unshift( [] );
		}
	};

	this.borrow = function( idx ) {
		var borrowedIdx = idx + 1;
		if ( workingDigitsA[ idx + 1 ] < 1 ) {
			borrowedIdx = this.borrow( idx + 1 );
		}
		workingDigitsA[ idx + 1 ] -= 1;
		workingDigitsA[ idx ] += 10;

		var depth = borrowedIdx - idx - 1;

		highlights[ idx ].push( graph.label( [ pos.max - idx, pos.carry + ( 0.5 * depth ) ],
											 "\\color{#6495ED}{" + workingDigitsA[ idx ] + "}", "below" ) );
		highlights[ idx ].push( graph.path( [ [ pos.max - 0.3 - idx, pos.first - 0.4 ], [ pos.max + 0.3 - idx, pos.first + 0.4 ] ] ) );

		highlights[ idx + 1 ].push( graph.label( [ pos.max - 1 - idx, pos.carry + ( 0.5 * depth ) ],
												 "\\color{#FFA500}{" + workingDigitsA[ idx + 1 ] + "}", "below" ) );
		highlights[ idx + 1 ].push( graph.path( [ [ pos.max - 1.3 - idx, pos.first - 0.4 ], [ pos.max - 0.7 - idx, pos.first + 0.4 ] ] ) );
		if ( depth !== 0 ) {
			highlights[ idx + 1 ].push( graph.path( [ [ pos.max - 1.3 - idx, pos.carry - 1 + ( 0.5 * depth) ], [ pos.max - 0.7 - idx, pos.carry - 0.7 + ( 0.5 * depth) ] ] ) );
		}
		return borrowedIdx;
	};

	this.showHint = function() {
		this.removeHighlights( index );

		if ( index !== 0 ) {
			this.removeHighlights( index - 1 );
		}
		if ( index === numHints - 1 ) {
			return;
		}

		var value = workingDigitsA[ index ];
		var withinB = index < workingDigitsB.length;
		var subtrahend = withinB ? workingDigitsB[ index ] : 0;
		var subStr = "";

		if ( value < subtrahend ) {
			this.borrow( index );
		} else if ( workingDigitsA[ index ] === digitsA[ index ] ) {
			highlights[ index ].push( graph.label( [ pos.max - index, pos.first ],
				"\\Huge{\\color{#6495ED}{" + workingDigitsA[ index ] +"}}" ) );
		} else {
			highlights[ index ].push( graph.label( [ pos.max - index, pos.carry ],
				"\\color{#6495ED}{" + workingDigitsA[ index ] + "}", "below" ) );
		}

		if ( withinB ) {
			highlights[ index ].push( graph.label( [ pos.max - index, pos.second ],
				"\\Huge{\\color{#6495ED}{" + workingDigitsB[ index ] + "}}" ) );
			subStr = " - \\color{#6495ED}{" + subtrahend + "}";
		}

		var diff = workingDigitsA[ index ] - subtrahend;
		if ( ( ( a - b ) / Math.pow( 10, index ) ) > 1 ) {
			graph.label( [ pos.max - index, pos.diff ],  "\\Huge{" + diff + "}" );
		}

		highlights[ index ].push( graph.label( [ pos.max - index, pos.diff ],  "\\Huge{\\color{#28AE7B}{" + diff + "}}" ) );
		if ( subStr == "" ){
			subStr = "- \\color{#6495ED}{ 0 }";
		}
		highlights[ index ].push( graph.label( [ pos.sideX, pos.sideY ], "\\Large{"
			+ "\\color{#6495ED}{" + workingDigitsA[ index ] + "}"
			+ subStr
			+ " = "
			+ "\\color{#28AE7B}{" + diff + "}}", "right" ) );
		index++;
	};

	this.getNumHints = function() {
		return numHints;
	};

	this.removeHighlights = function( i ) {
		if ( i >= highlights.length ) {
			return;
		}

		var col = highlights[ i ];
		while( col.length ) {
			col.pop().remove();
		}
	};
}

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
