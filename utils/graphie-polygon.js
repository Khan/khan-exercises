jQuery.extend( KhanUtil, {
	Polygon: function( numSides ) {
		var graph = KhanUtil.currentGraph,
			angles = [],
			points = [];

		function getMaxDiagonalLength( p1, p2, p3 ) {
			var intersection = findIntersection( [ p1, p2 ], [ [ 0, 0 ], p3 ] ),
				x = intersection[ 0 ],
				y = intersection[ 1 ];
			return Math.sqrt( x * x + y * y );
		}

		// Creates a convex n-gon by choosing n-2 angles,
		// where each of the n vertices will fall somewhere
		// on these diagonals, or rays from the origin.
		// ( see http://gyazo.com/625bd5662ac07707c86fd83d9d8531a1 )
		// Choose the first two diagonal-lengths willy-nilly,
		// but each subsequent vertex must be closer to the origin
		// than the intersection of the corresponding diagonal
		// and the line created by the previous two vertices.
		// Hippopotamus.
		(function (){
			var origin = [ 0, 0 ],
				curr,
				length,
				min = 1,
				max = 5,
				incr = 1;

			for ( var i = 0; i < numSides - 2; i++ ) {
				var evenlyDivided = 180 / numSides,
					jitter = KhanUtil.randRange( -10, 10 ) / 40;
				angles.push( evenlyDivided * ( 1 + jitter ) );
			}

			while( points.length !== angles.length + 3 ){
				curr = 0;
				points = [ origin, graph.polar( KhanUtil.randRange( min, max ), curr ) ];
				jQuery.each( angles, function( index, angle ) {
					curr += angle;
					if ( index == 0 ){
						length = KhanUtil.randRange( min, max );
					} else {
						var maxLength = getMaxDiagonalLength( points[ points.length - 2 ], points[ points.length - 1 ], graph.polar( min, curr ) );
						if ( Math.floor( maxLength ) <= min + incr ) {
							return;
						}
						maxLength = Math.min( Math.floor( maxLength ) - incr, max );
						length = KhanUtil.randRange( min, maxLength );
					}
					points.push( graph.polar( length, curr ) );
				});
				points.push( origin );
			}
			graph.style({stroke: KhanUtil.BLUE });
			graph.path( points );
			points.pop();
		})()

		function drawDiagonalTriangle( start ) {
			var length = points.length;
			graph.line( points[ start % length ], points[ ( start + 1 ) % length ] );
			graph.line( points[ ( start + 1 ) % length ], points[ ( start + 2 ) % length ] );
			graph.line( points[ ( start + 2 ) % length ], points[ start % length ] );
		}

		function drawEndTriangles( start ) {
			drawDiagonalTriangle( start );
			drawDiagonalTriangle( start + points.length - 2 );
		}

		this.drawDiagonals = function( start ) {
			var p1 = points[ start % points.length ];
			jQuery.each( points, function( i, p2 ) {
				if ( start !== i ) {
					graph.line( p1, p2 );
				}
			});
			graph.style({stroke: KhanUtil.ORANGE, "stroke-width": 3});
			drawEndTriangles( start );
		}
	}
});