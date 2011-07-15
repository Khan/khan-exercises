// Temporary not really following convention file, see #160
function drawDigits( digits, startX, startY, color ) {
	with ( jQuery.tmpl.VARS ) {
		with ( KhanUtil.currentGraph ) {
			var set = [];
			jQuery.each( digits, function( index, digit ) {
				var colorStrPre = color ? "\\color{" + color + "}{" : "";
				var colorStrPost = color ? "}" : "";
				var str = "\\Huge{" + colorStrPre + digit + colorStrPost+ "}";
				set.push( label( [ startX + index, startY ], str ) );
			});
			return set;
		}
	}
}

function numberLine( start, end, step ) {
	step = step || 1;

	var graph = KhanUtil.currentGraph;
	var set = graph.raphael.set();

	set.push( graph.line( [start, 0], [end, 0] ) );
	for( var x = start; x <= end; x += step ) {
		set.push( graph.line( [x, -0.2], [x, 0.2] ) );
		graph.label( [x, -0.2], x, "below", { labelDistance: 3 } )
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
