jQuery.extend( KhanUtil, {
	Polygon: function( numSides ) {
		// This should be renamed...
		// these are the angles between diagonals
		// to construct the polygon.
		var angles = [],
			points = [];
			gExteriorAngles = [];

		function getMaxDiagonalLength( p1, p2, p3 ) {
			var intersection = findIntersection( [ p1, p2 ], [ [ 0, 0 ], p3 ] ),
				x = intersection[ 0 ],
				y = intersection[ 1 ];
			return Math.sqrt( x * x + y * y );
		}

		function getDistance( p1, p2 ) {
			var dx = p2[ 0 ] - p1[ 0 ],
				dy = p2[ 1 ] - p1[ 1 ];
			return Math.sqrt( dx * dx + dy * dy );
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
			var graph = KhanUtil.currentGraph,
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

			while( points.length !== angles.length + 2 ){
				curr = 0;
				points = [ [ 0, 0 ], graph.polar( KhanUtil.randRange( min, max ), curr ) ];
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
			}
		})()

		this.draw = function () {
			var graph = KhanUtil.currentGraph;
			graph.style({stroke: KhanUtil.BLUE });
			points.push( [0, 0] );
			graph.path( points );
			points.pop();
		}

		function drawDiagonalTriangle( start ) {
			var graph = KhanUtil.currentGraph,
				length = points.length;
			graph.style({stroke: KhanUtil.ORANGE, "stroke-width": 3});
			graph.line( points[ start % length ], points[ ( start + 1 ) % length ] );
			graph.line( points[ ( start + 1 ) % length ], points[ ( start + 2 ) % length ] );
			graph.line( points[ ( start + 2 ) % length ], points[ start % length ] );
		}

		function drawEndTriangles( start ) {
			drawDiagonalTriangle( start );
			drawDiagonalTriangle( start + points.length - 2 );
		}

		this.drawDiagonals = function( start ) {
			var graph = KhanUtil.currentGraph,
				p1 = points[ start % points.length ];
			jQuery.each( points, function( i, p2 ) {
				if ( start !== i ) {
					graph.line( p1, p2 );
				}
			});
			drawEndTriangles( start );
		}

		this.drawRadialDiagonals = function() {
			var graph = KhanUtil.currentGraph,
				cx = 0,
				cy = 0;

			jQuery.each( points, function( index, point ) {
				cx += point[ 0 ];
				cy += point[ 1 ];
			});
			cx /= points.length;
			cy /= points.length;
			graph.style({stroke: KhanUtil.ORANGE}, function() {
				jQuery.each( points, function( index, point ) {
					graph.line( [ cx, cy ], point );
				});
			});
			graph.circle( [ cx, cy ], 0.3 );
		}

		this.drawExteriorAngles = function() {
			var graph = KhanUtil.currentGraph,
				prevTheta = 0,
				prevPoint;
			graph.style({ "stroke-dasharray": "-"});
			points.push( [ 0, 0 ] );
			jQuery.each( points, function( index, point ) {
				if ( index != 0 ) {
					var distance = getDistance( prevPoint, point ),
						dx = point[ 0 ] - prevPoint[ 0 ],
						dy = point[ 1 ] - prevPoint[ 1 ],
						theta = Math.acos( dx / distance ) * 180 / Math.PI,
						coord;
					if ( dy < 0 ) {
						theta = 360 - theta;
					}
					coord = graph.polar( distance + 2, theta );
					coord[ 0 ] += prevPoint[ 0 ];
					coord[ 1 ] += prevPoint[ 1 ];
					graph.line( prevPoint, coord );
					graph.style({"stroke-dasharray":""}, function() {
						gExteriorAngles.push( graph.arc( prevPoint, 0.5, prevTheta, theta ) );
					});

					prevTheta = theta;
				}
				prevPoint = point;
			});
			graph.style({"stroke-dasharray":""}, function() {
				gExteriorAngles.push( graph.arc( prevPoint, 0.5, prevTheta, 360 ) );
			});
			points.pop();
		}
		
		function getColor( i ) {
			switch( i % 4 ) {
				case 0: return KhanUtil.BLUE;
				case 1: return KhanUtil.ORANGE;
				case 2: return KhanUtil.GREEN;
				case 3: return KhanUtil.PINK;
			}
		}

		this.animateExteriorAngles = function( start ) {
			var graph = KhanUtil.currentGraph,
				origin = graph.scalePoint( points[ start ] );
			points.push( [ 0, 0 ] );
			for ( var i = 0; i < gExteriorAngles.length; i++ ) {
				var gAngle = gExteriorAngles[ i ],
					point = points[ i ],
					coord = graph.scalePoint( point ),
					clone = gAngle.attr( "stroke", getColor( i ) ).clone();
				clone.animate( { translation: [ origin[ 0 ] - coord[ 0 ], origin[ 1 ] - coord[ 1 ] ] }, 1000 );
			}
			points.pop();
		}

		this.clone = function() {
			return jQuery.extend( true, {}, this );
		}

		this.ex = function() {
			return gExteriorAngles;
		}
	}
});
