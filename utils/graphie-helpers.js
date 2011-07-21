// Temporary not really following convention file, see #160
function drawDigits( digits, startX, startY, color ) {
	var graph = KhanUtil.currentGraph;
	var set = [];
	jQuery.each( digits, function( index, digit ) {
		var str = "\\Huge{" + digit + "}";
		set.push( graph.label( [ startX + index, startY ], str, { color: color } ) );
	});
	return set;
}

function numberLine( start, end, step, x, y ) {
	step = step || 1;
	x = x || 0;
	y = y || 0;

	var graph = KhanUtil.currentGraph;
	var set = graph.raphael.set();

	set.push( graph.line( [x, y], [x + end - start, y] ) );
	for( var i = 0; i <= end - start; i += step ) {
		set.push( graph.line( [x + i, y - 0.2], [x + i, y + 0.2] ) );
		graph.label( [x + i, y - 0.2], start + i, "below", { labelDistance: 3 } )
	}

	return set;
}

function piechart( divisions, colors, radius ) {
	var graph = KhanUtil.currentGraph;
	var set = graph.raphael.set();

	var sum = 0;
	jQuery.each( divisions, function( i, slice ) {
		sum += slice;
	} );

	var partial = 0;
	jQuery.each( divisions, function( i, slice ) {
		set.push( graph.arc( [0, 0], radius, partial * 360 / sum, ( partial + slice ) * 360 / sum, true, {
			stroke: "none",
			fill: colors[i]
		} ) );
		partial += slice;
	} );

	for ( var i = 0; i < sum; i++ ) {
		set.push( graph.line( [0, 0], graph.polar( radius, i * 360 / sum ), { stroke: "#fff" } ) );
	}

	return set;
}

function rectchart( divisions, colors, radius ) {
	var graph = KhanUtil.currentGraph;
	var set = graph.raphael.set();

	var sum = 0;
	jQuery.each( divisions, function( i, slice ) {
		sum += slice;
	} );

	var partial = 0;
	jQuery.each( divisions, function( i, slice ) {
		var x = partial / sum, w = slice / sum;
		set.push( graph.path([ [x, 0], [x + w, 0], [x + w, 1], [x, 1] ], {
			stroke: "none",
			fill: colors[i]
		} ) );
		partial += slice;
	} );

	for ( var i = 0; i <= sum; i++ ) {
		var x = i / sum;
		set.push( graph.line( [x, 0], [x, 1], { stroke: "#fff" } ) );
	}

	return set;
}

function borrow( idx, A_DIGITS, BORROW_LEVEL, X_MAX, Y_FIRST, Y_CARRY, HIGHLIGHTS ) {
	HIGHLIGHTS = HIGHLIGHTS || KhanUtil.currentGraph.highlights;
	var graph = KhanUtil.currentGraph;
	if ( A_DIGITS[ idx + 1 ] < 1 ) {
		borrow( idx + 1, A_DIGITS, BORROW_LEVEL, X_MAX, Y_FIRST, Y_CARRY, HIGHLIGHTS );
		BORROW_LEVEL += 0.5;
	}
	A_DIGITS[ idx + 1 ] -= 1;
	A_DIGITS[ idx ] += 10;

	HIGHLIGHTS[ idx ].push( graph.label( [ X_MAX - idx, BORROW_LEVEL ],
		"\\color{#6495ED}{" + A_DIGITS[ idx ] + "}", "below" ) );
	HIGHLIGHTS[ idx ].push( graph.path( [ [ X_MAX - 0.3 - idx, Y_FIRST - 0.4 ], [ X_MAX + 0.3 - idx, Y_FIRST + 0.4 ] ] ) );

	HIGHLIGHTS[ idx + 1 ].push( graph.label( [ X_MAX - 1 - idx, BORROW_LEVEL ],
		"\\color{#FFA500}{" + A_DIGITS[ idx + 1 ] + "}", "below" ) );
	HIGHLIGHTS[ idx + 1 ].push( graph.path( [ [ X_MAX - 1.3 - idx, Y_FIRST - 0.4 ], [ X_MAX - 0.7 - idx, Y_FIRST + 0.4 ] ] ) );
	if ( BORROW_LEVEL !== Y_CARRY ) {
		HIGHLIGHTS[ idx + 1 ].push( graph.path( [ [ X_MAX - 1.3 - idx, BORROW_LEVEL - 0.5 - 0.5 ], [ X_MAX - 0.7 - idx, BORROW_LEVEL - 0.7 ] ] ) );
	}
}

// for line graph intuition
function updateEquation() {
	var graph = KhanUtil.currentGraph;
	graph.plot.remove();
	graph.style({
		clipRect:[ [-10, -10], [20, 20] ]
	}, function() {
		var ell = function( x ) {
			return x * graph.MN / graph.MD + graph.BN / graph.BD;
		};
		graph.plot = graph.line( [ -10, ell( -10 ) ], [ 10, ell( 10 ) ] );
	});

	graph.labelHolder.remove();
	graph.labelHolder = graph.label( [1, 11], "y = " + KhanUtil.fractionReduce( graph.MN, graph.MD )
							+ "x +" + KhanUtil.fractionReduce( graph.BN, graph.BD ));

	jQuery( "#slope-sol input" ).val( graph.MN + "/" + graph.MD );
	jQuery( "#intercept-sol input" ).val( graph.BN + "/" + graph.BD );
}

// for line graph intuition
function changeSlope( dir ) {
	var graph = KhanUtil.currentGraph;
	var prevDenominator = graph.MD;
	graph.MD = KhanUtil.getLCM( prevDenominator, graph.INCR );
	graph.MN = ( graph.MD / prevDenominator * graph.MN ) + ( dir * graph.MD / graph.INCR );
	updateEquation();
}

// for line graph intuition
function changeIntercept( dir ) {
	var graph = KhanUtil.currentGraph;
	var prevDenominator = graph.BD;
	graph.BD = KhanUtil.getLCM( prevDenominator, graph.INCR );
	graph.BN = ( graph.BD / prevDenominator * graph.BN )
			+ ( dir * graph.BD / graph.INCR );
	updateEquation();
}
