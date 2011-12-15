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
					if ( index != 1 ) {
						graph.style({"stroke-dasharray":""}, function() {
							gExteriorAngles.push( graph.arc( prevPoint, 0.5, prevTheta, theta ) );
						});
					}
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
			gExteriorAngles.unshift( "dummy" );
			for ( var i = 1; i < gExteriorAngles.length; i++ ) {
				var gAngle = gExteriorAngles[ i ],
					point = points[ i ],
					coord = graph.scalePoint( point ),
					clone = gAngle.attr( "stroke", getColor( i ) ).clone();
				clone.animate( { translation: [ origin[ 0 ] - coord[ 0 ], origin[ 1 ] - coord[ 1 ] ] }, 1000 );
			}
			points.pop();
			gExteriorAngles.shift();
		}

		this.clone = function() {
			return jQuery.extend( true, {}, this );
		}

		this.ex = function() {
			return gExteriorAngles;
		}
	},

	Circle: function( radius, center ) {
		center = center || [ 0, 0 ];
		var pointRadius = 0.1;

		(function() {
			var graph = KhanUtil.currentGraph;
			graph.style({stroke: KhanUtil.BLUE});
			graph.circle( center, radius );
		})()

		this.drawPoint = function( theta ) {
			var graph = KhanUtil.currentGraph,
				point = graph.polar( radius, theta );
			return graph.circle( point, pointRadius );
		}

		this.drawCenter = function() {
			var graph = KhanUtil.currentGraph;
			graph.style({ fill: KhanUtil.BLUE }, function() {
				graph.circle( center, pointRadius );
			});
		}

		this.drawRadius = function( theta ) {
			var graph = KhanUtil.currentGraph,
				point = graph.polar( radius, theta );
			return graph.line( center, point );
		}

		this.drawChord = function( theta1, theta2 ) {
			var graph = KhanUtil.currentGraph,
				point1 = graph.polar( radius, theta1 ),
				point2 = graph.polar( radius, theta2 );
			return graph.line( point1, point2 );
		}

		function isThetaWithin( theta, min, max ) {
			min = min % 360;
			max = max % 360;
			if ( min > max ) {
				return theta < max || theta > min;
			} else {
				return theta > min && theta < max;
			}
		}

		function getThetaFromXY( x, y ) {
			var angle = Math.atan( y / x );
			if (x <= 0 && y > 0) {
				angle += Math.PI;
			} else if (x < 0 && y < 0) {
				angle += Math.PI;
			} else if (x >= 0 && y < 0) {
				angle += 2 * Math.PI;
			}
			angle = angle * 180 / Math.PI;
			return angle;
		}

		this.drawMovablePoint = function( theta, min, max  ) {
			var graph = KhanUtil.currentGraph,
				point = graph.polar( radius, theta )
				min = min || 0,
				max = max || 360,
				graph.graph.movable = { vertex: KhanUtil.bogusShape, arc: KhanUtil.bogusShape, chords: [ KhanUtil.bogusShape, KhanUtil.bogusShape ] };

			graph.graph.inscribedPoint = KhanUtil.addMovablePoint( {coordX: point[ 0 ], coordY: point[ 1 ] } );

			graph.graph.inscribedPoint.onMove = function( x, y ) {
				var theta = getThetaFromXY( x, y );
				if ( !isThetaWithin( theta, min, max ) ) {
					return false;
				}
				graph.style({stroke: KhanUtil.ORANGE});
				graph.graph.movable.arc.remove();
				graph.graph.movable.chords[0].remove();
				graph.graph.movable.chords[1].remove();
				graph.graph.movable.vertex.remove();
				graph.graph.movable = graph.graph.circle.drawInscribedAngle( theta, max, min );
				return graph.polar( radius, theta );
			};
		}

		this.drawCentralArc = function( start, end, arcRadius ) {
			var graph = KhanUtil.currentGraph,
				arcRadius = arcRadius || 0.5,
				arc;
			graph.style( {fill: ""}, function() {
				arc = graph.arc( center, arcRadius, start, end );
			});
			return arc;
		}

		this.drawCentralAngle = function( start, end, arcRadius ) {
			var result = { radii: [] };
			result.radii.push( this.drawRadius( start ) );
			result.radii.push( this.drawRadius( end ) );
			result.arc = this.drawCentralArc( start, end, arcRadius );
			return result;
		}

		this.drawInscribedArc = function( inscribed, start, end, arcRadius ) {
			var graph = KhanUtil.currentGraph,
				vertex = graph.polar( radius, inscribed ),
				point1 = graph.polar( radius, start ),
				point2 = graph.polar( radius, end ),
				theta1 = getThetaFromXY( point1[0] - vertex[0], point1[1] - vertex[1] ),
				theta2 = getThetaFromXY( point2[0] - vertex[0], point2[1] - vertex[1] ),
				arcRadius = arcRadius || 0.5,
				arc;
			graph.style( { fill: "" }, function() {
				arc = graph.arc( vertex, arcRadius, theta1, theta2 );
			})
			return arc;
		}

		this.drawInscribedAngle = function( inscribed, start, end, arcRadius ) {
			var graph = KhanUtil.currentGraph,
				chords = [ this.drawChord( inscribed, start ), this.drawChord( inscribed, end) ],
				vertex = this.drawPoint( inscribed ),
				arc = this.drawInscribedArc( inscribed, start, end, arcRadius );
			return { chords: chords, vertex: vertex, arc: arc };
		}
	}
});
