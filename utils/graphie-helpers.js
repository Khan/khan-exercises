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
}
