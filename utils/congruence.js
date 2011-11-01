jQuery.extend( KhanUtil, {

	initCongruence: function( options ) {
		options = jQuery.extend({
			ticks: [],
			numArcs: [ 0, 0, 0 ],
			reflected: false
		}, options );

		options.sides = options.triangle.sideLengths.slice();
		options.angles = options.triangle.angles.slice();

		var randomAngle = function( current ) {
			var angle = current;
			while ( Math.abs( angle - current ) < 10 ) {
				angle = Math.floor( KhanUtil.random() * 70 ) + 10;
			}
			return angle;
		};

		var randomSide = function( current ) {
			var side = current;
			while ( Math.abs( side - current ) < 1 ) {
				side = KhanUtil.random() * 30 / 10 + 1;
			}
			return side;
		};


		//
		// Side-Side-Side
		//
		if ( options.type === "SSS" ) {
			options.angles[0] = randomAngle( options.angles[0] );
			options.angles[1] = randomAngle( options.angles[1] );
			options.angles[2] = randomAngle( options.angles[2] );
			options.ticks = [ 1, 2, 3 ];
			var triangle = KhanUtil.addInteractiveTriangle( options );

			// Point 0 is a fixed distance from point 1
			triangle.points[0].constraints.fixedDistance = { dist: options.sides[0], point: triangle.points[1] };

			// Point 1 can be used to rotate the shape
			triangle.setRotationPoint( 1 );

			// Point 2 can be used to rotate the shape
			triangle.setRotationPoint( 2 );

			// Point 3 is a fixed distance from point 2
			triangle.points[3].constraints.fixedDistance = { dist: options.sides[2], point: triangle.points[2] };

			// When point 0 moves, check if it's close enough to point 3 to make a triangle
			triangle.points[0].onMove = function( coordX, coordY ) {
				triangle.points[0].coord = [ coordX, coordY ];
				if ( KhanUtil.distance( triangle.points[0].coord, triangle.points[3].coord ) < 0.3 ) {
					triangle.snapCorrect();
				}
				triangle.update();
				return triangle.points[0].coord;
			};

			// When point 3 moves, check if it's close enough to point 0 to make a triangle
			triangle.points[3].onMove = function( coordX, coordY ) {
				triangle.points[3].coord = [ coordX, coordY ];
				if ( KhanUtil.distance( triangle.points[0].coord, triangle.points[3].coord ) < 0.3 ) {
					triangle.snapCorrect();
				}
				triangle.update();
				return triangle.points[3].coord;
			};

			triangle.snapCorrect = function() {
				// Check to see if SSS was 'reflected' by being turned inside out
				if (Math.abs( ((options.triangle.angles[1] * (triangle.reflected ? -1 : 1) + 360) % 360) - ((KhanUtil.findAngle( this.points[0].coord, this.points[2].coord, this.points[1].coord ) + 360) % 360) ) > 90) {
					triangle.reflected = !triangle.reflected;
				}
				this.points[0].setCoord( this.points[0].applyConstraint( this.points[0].coord, {
					fixedAngle: {
						angle: options.triangle.angles[1] * (triangle.reflected ? -1 : 1),
						vertex: this.points[1],
						ref: this.points[2]
					}
				}));
				this.points[3].setCoord( this.points[3].applyConstraint( this.points[3].coord, {
					fixedAngle: {
						angle: options.triangle.angles[2] * (triangle.reflected ? 1 : -1),
						vertex: this.points[2],
						ref: this.points[1]
					}
				}));
			};


		//
		// Side-Side-Angle
		//
		} else if ( options.type === "SSA" ) {
			options.angles[0] = randomAngle( options.angles[0] );
			options.angles[1] = randomAngle( options.angles[1] );
			options.sides[2] = randomSide( options.sides[2] );
			options.ticks = [ 1, 2, 0 ];
			options.numArcs = [ 0, 1, 0 ];
			var triangle = KhanUtil.addInteractiveTriangle( options );

			// Point 0 is a fixed distance from point 1
			triangle.points[0].constraints.fixedDistance = { dist: options.sides[0], point: triangle.points[1] };

			// Point 1 can be used to rotate the shape
			triangle.setRotationPoint( 1 );

			// Point 2 is a fixed distance from point 1
			triangle.points[2].constraints.fixedDistance = { dist: options.sides[1], point: triangle.points[1] };

			// Point 3 is a fixed angle from points 1 and 2
			triangle.points[3].constraints.fixedAngle = { angle: options.angles[2] * (triangle.reflected ? 1 : -1), vertex: triangle.points[2], ref: triangle.points[1] };

			// When point 0 moves, check if it's close enough to point 3 to make a triangle
			triangle.points[0].onMove = function( coordX, coordY ) {
				triangle.points[0].coord = [ coordX, coordY ];
				if ( KhanUtil.distance( triangle.points[0].coord, triangle.points[3].coord ) < 0.2 ) {
					triangle.snapCorrect();
				}
				triangle.update();
				return triangle.points[0].coord;
			};

			// When point 2 moves, point 3 moves along with it
			triangle.points[2].onMove = function( coordX, coordY ) {
				var origCoord = triangle.points[2].coord;
				triangle.points[2].coord = [ coordX, coordY ];
				triangle.points[3].setCoord(triangle.points[3].applyConstraint( triangle.points[3].coord, {
					fixedDistance: {
						dist: KhanUtil.distance( triangle.points[3].coord, origCoord ),
						point: triangle.points[2]
					}
				}));
				// Check if point 3 ends up close enough to point 0 to make a triangle
				if ( KhanUtil.distance( triangle.points[0].coord, triangle.points[3].coord ) < 0.2 ) {
					triangle.snapCorrect();
				}
				triangle.update();
			};

			// When point 3 moves, check if it's close enough to point 0 to make a triangle
			triangle.points[3].onMove = function( coordX, coordY ) {
				triangle.points[3].coord = [ coordX, coordY ];
				if ( KhanUtil.distance( triangle.points[0].coord, triangle.points[3].coord ) < 0.2 ) {
					triangle.snapCorrect();
				}
				triangle.update();
				return triangle.points[3].coord;
			};

			triangle.snapCorrect = function() {
				var angle1 = options.triangle.angles[1] * (triangle.reflected ? -1 : 1);
				// SSA has two possible shapes: See which one we're closest to'
				if ( Math.abs( KhanUtil.distance( triangle.points[2].coord, triangle.points[3].coord ) - options.triangle.sideLengths[2] ) > 1.0 ) {
					this.isCongruent = false;
					angle1 = Math.abs(angle1);
					var angle2 = Math.abs(options.triangle.angles[2] * (triangle.reflected ? -1 : 1));
					angle1 = (180 - 2 * angle2 - angle1) * (triangle.reflected ? -1 : 1);
				} else {
					this.isCongruent = true;
				}
				this.points[0].setCoord( this.points[0].applyConstraint( this.points[0].coord, {
					fixedAngle: {
						angle: angle1,
						vertex: this.points[1],
						ref: this.points[2]
					}
				}));
				this.points[3].setCoord( this.points[0].coord );
			};


		//
		// Side-Angle-Side
		//
		} else if ( options.type === "SAS" ) {
			options.angles[0] = randomAngle( options.angles[0] );
			options.sides[2] = randomSide( options.sides[2] );
			options.angles[2] = randomAngle( options.angles[2] );
			options.ticks = [ 1, 2, 0 ];
			options.numArcs = [ 1, 0, 0 ];
			var triangle = KhanUtil.addInteractiveTriangle( options );

			// Point 0 can be used to rotate the shape
			triangle.setRotationPoint( 0 );

			// Point 1 is a fixed distance from point 2
			triangle.points[1].constraints.fixedDistance = { dist: options.sides[1], point: triangle.points[2] };

			// Point 2 can be used to rotate the shape
			triangle.setRotationPoint( 2 );

			// Point 3 is unconstrained

			// When point 1 moves, point 0 moves along with it
			triangle.points[1].onMove = function( coordX, coordY ) {
				triangle.points[1].coord = [ coordX, coordY ];
				triangle.points[0].setCoord(triangle.points[0].applyConstraint( triangle.points[0].coord, {
					fixedDistance: {
						dist: options.sides[0],
						point: triangle.points[1]
					},
					fixedAngle: {
						angle: options.angles[1] * (triangle.reflected ? -1 : 1),
						vertex: triangle.points[1],
						ref: triangle.points[2]
					}
				}));
				// Check if point 0 ends up close enough to point 3 to make a triangle
				if ( KhanUtil.distance( triangle.points[0].coord, triangle.points[3].coord ) < 0.2 ) {
					triangle.snapCorrect();
				}
				triangle.update();
				return triangle.points[1].coord;
			};

			// When point 3 moves, check if it's close enough to point 0 to make a triangle
			triangle.points[3].onMove = function( coordX, coordY ) {
				triangle.points[3].coord = [ coordX, coordY ];
				if ( KhanUtil.distance( triangle.points[0].coord, triangle.points[3].coord ) < 0.2 ) {
					triangle.snapCorrect();
				}
				triangle.update();
				return triangle.points[3].coord;
			};

			triangle.snapCorrect = function() {
				this.points[3].setCoord( this.points[0].coord );
			};


		//
		// Side-Side-Angle
		//
		} else if ( options.type === "SAA" ) {
			options.angles[0] = randomAngle( options.angles[0] );
			options.sides[1] = randomSide( options.sides[1] );
			options.sides[2] = randomSide( options.sides[2] );
			options.ticks = [ 1, 0, 0 ];
			options.numArcs = [ 1, 2, 0 ];
			var triangle = KhanUtil.addInteractiveTriangle( options );

			// Point 0 can be used to rotate the shape
			triangle.setRotationPoint( 0 );

			// Point 1 is a fixed angle from points 3 and 2
			triangle.points[1].constraints.fixedAngle = { angle: options.angles[2] * (triangle.reflected ? -1 : 1), vertex: triangle.points[2], ref: triangle.points[3] };

			// Point 2 can be used to rotate the shape
			triangle.setRotationPoint( 2 );

			// Point 3 is a fixed angle from points 1 and 2
			triangle.points[3].constraints.fixedAngle = { angle: options.angles[2] * (triangle.reflected ? 1 : -1), vertex: triangle.points[2], ref: triangle.points[1] };

			// When point 1 moves, point 0 moves along with it
			triangle.points[1].onMove = function( coordX, coordY ) {
				triangle.points[1].coord = [ coordX, coordY ];
				triangle.points[0].setCoord(triangle.points[0].applyConstraint( triangle.points[0].coord, {
					fixedDistance: {
						dist: options.sides[0],
						point: triangle.points[1]
					},
					fixedAngle: {
						angle: options.angles[1] * (triangle.reflected ? -1 : 1),
						vertex: triangle.points[1],
						ref: triangle.points[2]
					}
				}));
				// Check if point 0 ends up close enough to point 3 to make a triangle
				if ( KhanUtil.distance( triangle.points[0].coord, triangle.points[3].coord ) < 0.3 ) {
					triangle.snapCorrect();
				}
				triangle.update();
				return triangle.points[1].coord;
			};

			// When point 3 moves, check if it's close enough to point 0 to make a triangle
			triangle.points[3].onMove = function( coordX, coordY ) {
				triangle.points[3].coord = [ coordX, coordY ];
				if ( KhanUtil.distance( triangle.points[0].coord, triangle.points[3].coord ) < 0.3 ) {
					triangle.snapCorrect();
				}
				triangle.update();
				return triangle.points[3].coord;
			};

			triangle.snapCorrect = function() {
				this.points[1].setCoord( this.points[1].applyConstraint( this.points[1].coord, {
					fixedDistance: {
						dist: options.triangle.sideLengths[1],
						point: this.points[2]
					}
				}));
				this.points[0].setCoord( this.points[0].applyConstraint( this.points[0].coord, {
					fixedDistance: {
						dist: options.triangle.sideLengths[0],
						point: this.points[1]
					},
					fixedAngle: {
						angle: options.angles[1] * (this.reflected ? -1 : 1),
						vertex: this.points[1],
						ref: this.points[2]
					}
				}));
				this.points[3].setCoord( this.points[3].applyConstraint( this.points[3].coord, {
					fixedDistance: {
						dist: options.triangle.sideLengths[2],
						point: this.points[2]
					}
				}));
			};


		//
		// Angle-Side-Angle
		//
		} else if ( options.type === "ASA" ) {
			options.sides[0] = randomSide( options.sides[0] );
			options.angles[0] = randomAngle( options.angles[0] );
			options.sides[2] = randomSide( options.sides[2] );
			options.ticks = [ 0, 1, 0 ];
			options.numArcs = [ 1, 2, 0 ];
			var triangle = KhanUtil.addInteractiveTriangle( options );

			// Point 0 is a fixed angle from points 2 and 1
			triangle.points[0].constraints.fixedAngle = { angle: options.angles[1] * (triangle.reflected ? -1 : 1), vertex: triangle.points[1], ref: triangle.points[2] };

			// Point 1 can be used to rotate the shape
			triangle.setRotationPoint( 1 );

			// Point 2 can be used to rotate the shape
			triangle.setRotationPoint( 2 );

			// Point 3 is a fixed angle from points 1 and 2
			triangle.points[3].constraints.fixedAngle = { angle: options.angles[2] * (triangle.reflected ? 1 : -1), vertex: triangle.points[2], ref: triangle.points[1] };

			// When point 0 moves, check if it's close enough to point 3 to make a triangle
			triangle.points[0].onMove = function( coordX, coordY ) {
				triangle.points[0].coord = [ coordX, coordY ];
				if ( KhanUtil.distance( triangle.points[0].coord, triangle.points[3].coord ) < 0.3 ) {
					triangle.snapCorrect();
				}
				triangle.update();
				return triangle.points[0].coord;
			};

			// When point 3 moves, check if it's close enough to point 0 to make a triangle
			triangle.points[3].onMove = function( coordX, coordY ) {
				triangle.points[3].coord = [ coordX, coordY ];
				if ( KhanUtil.distance( triangle.points[0].coord, triangle.points[3].coord ) < 0.3 ) {
					triangle.snapCorrect();
				}
				triangle.update();
				return triangle.points[3].coord;
			};

			triangle.snapCorrect = function() {
				this.points[0].setCoord( this.points[0].applyConstraint( this.points[0].coord, {
					fixedDistance: {
						dist: options.triangle.sideLengths[0],
						point: this.points[1]
					}
				}));
				this.points[3].setCoord( this.points[3].applyConstraint( this.points[3].coord, {
					fixedDistance: {
						dist: options.triangle.sideLengths[2],
						point: this.points[2]
					}
				}));
			};


		//
		// Angle-Angle-Angle
		//
		} else if ( options.type === "AAA" ) {
			var scale = KhanUtil.random() < 0.5 ? 1 : KhanUtil.random() > 0.5 ? KhanUtil.random() * 0.4 + 1.2 : KhanUtil.random() * 0.2 + 0.6;
			options.sides[0] *= scale;
			options.sides[1] *= scale;
			options.sides[2] *= scale;
			options.numArcs = [ 2, 3, 1 ];
			var triangle = KhanUtil.addInteractiveTriangle( options );
			triangle.isCongruent = scale === 1;

			// The shape is always a triangle, so we don't need 4 points visible
			triangle.points[0].visibleShape.remove();
			triangle.points[0].mouseTarget.remove();
			triangle.points[0].visible = false;

			// Point 1 can be used to rotate the shape
			triangle.setRotationPoint( 1 );

			// Point 2 can be used to rotate the shape
			triangle.setRotationPoint( 2 );

			// Point 3 is a fixed angle from the centroid
			triangle.points[3].constraints.fixedAngle = {
				angle: KhanUtil.findAngle(triangle.points[3].coord, triangle.points[1].coord, triangle.rotationPoint.coord),
				vertex: triangle.rotationPoint,
				ref: triangle.points[1]
			};

			// When point 3 moves, scale the entire triangle
			triangle.points[3].onMove = function( coordX, coordY ) {
				var origCoord = triangle.points[3].coord;
				triangle.points[3].coord = [ coordX, coordY ];
				triangle.points[0].setCoord([ coordX, coordY ]);
				var scaleFactor = KhanUtil.distance([ coordX, coordY ], triangle.rotationPoint.coord) / triangle.radii[3];
				triangle.points[1].setCoord( triangle.points[1].applyConstraint( triangle.points[1].coord, {
					fixedDistance: {
						dist: triangle.radii[1] * scaleFactor,
						point: triangle.rotationPoint
					}
				}));
				triangle.points[2].setCoord( triangle.points[2].applyConstraint( triangle.points[2].coord, {
					fixedDistance: {
						dist: triangle.radii[2] * scaleFactor,
						point: triangle.rotationPoint
					}
				}));
				// Check if the triangle is close enough to congruent to make it easier/possible to get wrong
				if ( Math.abs( KhanUtil.distance( triangle.points[0].coord, triangle.points[1].coord ) - options.triangle.sideLengths[0] ) < 0.3 ) {
					triangle.snapCorrect();
					triangle.isCongruent = true;
				} else {
					triangle.isCongruent = false;
				}
				triangle.update();
				return triangle.points[3].coord;
			};

			triangle.snapCorrect = function() {
				this.points[3].setCoord( this.points[0].applyConstraint( this.points[0].coord, {
					fixedDistance: {
						dist: KhanUtil.distance( options.triangle.points[0], options.triangle.centroid ),
						point: this.rotationPoint
					}
				}));
				this.points[0].setCoord( this.points[3].coord );
				this.points[1].setCoord( this.points[1].applyConstraint( this.points[1].coord, {
					fixedDistance: {
						dist: KhanUtil.distance( options.triangle.points[1], options.triangle.centroid ),
						point: this.rotationPoint
					}
				}));
				this.points[2].setCoord( this.points[2].applyConstraint( this.points[2].coord, {
					fixedDistance: {
						dist: KhanUtil.distance( options.triangle.points[2], options.triangle.centroid ),
						point: this.rotationPoint
					}
				}));
			};


		}
		KhanUtil.currentGraph.interactiveTriangle = triangle;

	},


	addInteractiveTriangle: function( options ) {
		var triangle = jQuery.extend({
			points: [],
			lines: [],
			numArcs: options.numArcs,
			arcs: [],
			radii: [],
			reflected: false,
			animating: false,
			isCongruent: true,
			isTriangle: false
		}, options);

		// Redraw/refresh the triangle
		triangle.update = function() {
			if ( !KhanUtil.dragging ) {
				// if the shape is a triangle, rotate around the centroid, otherwise use the center of the bounding box
				if ( Math.abs( triangle.points[0].coord[0] - triangle.points[3].coord[0] ) < 0.001 &&  Math.abs( triangle.points[0].coord[1] - triangle.points[3].coord[1] ) < 0.001 ) {
					triangle.isTriangle = true;
					triangle.rotationPoint.setCoord([
						1/3 * (triangle.points[0].coord[0] + triangle.points[1].coord[0] + triangle.points[2].coord[0]),
						1/3 * (triangle.points[0].coord[1] + triangle.points[1].coord[1] + triangle.points[2].coord[1]),
					]);
				} else {
					triangle.isTriangle = false;
					var minX = Math.min(triangle.points[0].coord[0], triangle.points[1].coord[0], triangle.points[2].coord[0], triangle.points[3].coord[0]);
					var maxX = Math.max(triangle.points[0].coord[0], triangle.points[1].coord[0], triangle.points[2].coord[0], triangle.points[3].coord[0]);
					var minY = Math.min(triangle.points[0].coord[1], triangle.points[1].coord[1], triangle.points[2].coord[1], triangle.points[3].coord[1]);
					var maxY = Math.max(triangle.points[0].coord[1], triangle.points[1].coord[1], triangle.points[2].coord[1], triangle.points[3].coord[1]);

					triangle.rotationPoint.setCoord([ (maxX - minX) / 2 + minX, (maxY - minY) / 2 + minY ]);
				}

				for ( var point = 0; point < 4; ++point ) {
					triangle.radii[point] = KhanUtil.distance( triangle.points[point].coord, triangle.rotationPoint.coord );
					if ( triangle.points[point].isRotationPoint ) {
						triangle.points[point].constraints.fixedDistance = { dist: triangle.radii[point], point: triangle.rotationPoint };
					}
				}
			}

			KhanUtil.currentGraph.style({ stroke: KhanUtil.BLUE, opacity: 1.0, "stroke-width": 2 });
			for ( var angle = 0; angle < 2; ++angle ) {
				jQuery( triangle.arcs[angle] ).each( function() { this.remove(); });
				triangle.arcs[angle] = KhanUtil.drawArcs( triangle.points[angle].coord, triangle.points[angle + 1].coord, triangle.points[angle + 2].coord, options.numArcs[angle] );
			}
			if (options.numArcs[2]) {
				jQuery( triangle.arcs[2] ).each( function() { this.remove(); });
				triangle.arcs[angle] = KhanUtil.drawArcs( triangle.points[2].coord, triangle.points[3].coord, triangle.points[1].coord, options.numArcs[2] );
			}

			jQuery( triangle.lines ).each( function() {
				this.transform(true);
				this.toFront();
			});
			jQuery( triangle.points ).each( function() { this.toFront(); });
		};

		// Call to set one of the points to rotate the entire shape
		triangle.setRotationPoint = function( point ) {
			triangle.points[point].isRotationPoint = true;
			triangle.points[point].normalStyle = { fill: KhanUtil.BLUE, stroke: KhanUtil.BLUE, scale: 1 };
			triangle.points[point].highlightStyle = { fill: KhanUtil.BLUE, stroke: KhanUtil.BLUE, scale: 1.5 };
			triangle.points[point].visibleShape.attr( triangle.points[point].normalStyle );
			triangle.points[point].constraints.fixedDistance = { dist: triangle.radii[point], point: triangle.rotationPoint };

			triangle.points[point].onMove = function( coordX, coordY ) {
				var dAngle = KhanUtil.findAngle( [coordX, coordY], triangle.points[point].coord, triangle.rotationPoint.coord ) * Math.PI/180;
				for ( var i = 0; i < 4; ++i ) {
					if (i !== point) {
						triangle.points[i].setCoord([
							(triangle.points[i].coord[0] - triangle.rotationPoint.coord[0]) * Math.cos(dAngle) - (triangle.points[i].coord[1] - triangle.rotationPoint.coord[1]) * Math.sin(dAngle) + triangle.rotationPoint.coord[0],
							(triangle.points[i].coord[0] - triangle.rotationPoint.coord[0]) * Math.sin(dAngle) + (triangle.points[i].coord[1] - triangle.rotationPoint.coord[1]) * Math.cos(dAngle) + triangle.rotationPoint.coord[1]
						]);
					}
				}
				triangle.points[point].coord = [ coordX, coordY ];
				triangle.update();
			};
		};

		jQuery(".question").prepend("<button id=\"reflect\">Reflect shape</button>");
		jQuery("button#reflect").bind("click", function( event ) {
			this.blur();
			if ( !triangle.animating ) {
				triangle.animating = true;
				var startPoints = jQuery.map( triangle.points, function( pt ) { return [ pt.coord.slice() ]; } );
				var xMin = Math.min.apply(Math, jQuery.map( startPoints, function(x) { return x[0]; }));
				var xMax = Math.max.apply(Math, jQuery.map( startPoints, function(x) { return x[0]; }));
				var xMid = (xMin + xMax) / 2;
				var endPoints = jQuery.map( triangle.points, function( pt ) { return [[ xMid - pt.coord[0] + xMid, pt.coord[1] ]]; });

				// flip the angles around
				jQuery( triangle.points ).each( function( n, point ) {
					if ( typeof point.constraints.fixedAngle.angle === "number" ) {
						point.constraints.fixedAngle.angle *= -1;
					}
				});
				triangle.reflected = !triangle.reflected;

				// remove the angle arc decorations since (without some effort) they look funny during the animation
				jQuery( triangle.arcs[0] ).each( function() { this.remove(); });
				jQuery( triangle.arcs[1] ).each( function() { this.remove(); });
				jQuery( triangle.arcs[2] ).each( function() { this.remove(); });

				var xCoords = { 0: startPoints[0][0], 1: startPoints[1][0], 2: startPoints[2][0], 3: startPoints[3][0] };
				jQuery( xCoords ).animate({ 0: endPoints[0][0], 1: endPoints[1][0], 2: endPoints[2][0], 3: endPoints[3][0] }, {
					duration: 500,
					easing: "linear",
					step: function( now, fx ) {
						jQuery( triangle.points ).each(function( n ) { this.setCoord([ xCoords[n], endPoints[n][1] ]); });
						jQuery( triangle.lines ).each(function() { this.transform(true); });
					},
					complete: function() {
						jQuery( triangle.points ).each(function( n ) { this.setCoord( endPoints[n] ); });
						triangle.update();
						triangle.animating = false;
					}
				});
			}
		});

		// Flip the angles around if the triangle starts out reflected
		var angles = options.angles.slice();

		if (!options.reflected) {
			jQuery( angles ).each( function( n ) {
				angles[n] *= -1;
			});
		}

		// Start at 0,0 and build the shape, logo-style
		var coord = [ 0, 0 ];
		triangle.points.push( KhanUtil.addMovablePoint({ coord: coord }) );

		coord[0] += options.sides[0] * Math.cos( angles[0] * Math.PI / 180 );
		coord[1] += options.sides[0] * Math.sin( angles[0] * Math.PI / 180 );
		triangle.points.push( KhanUtil.addMovablePoint({ coord: coord }) );

		coord[0] += options.sides[1] * Math.cos( -(180 - angles[1] - angles[0]) * Math.PI / 180 );
		coord[1] += options.sides[1] * Math.sin( -(180 - angles[1] - angles[0]) * Math.PI / 180 );
		triangle.points.push( KhanUtil.addMovablePoint({ coord: coord }) );

		coord[0] += options.sides[2] * Math.cos( (angles[2] + angles[1] + angles[0]) * Math.PI / 180 );
		coord[1] += options.sides[2] * Math.sin( (angles[2] + angles[1] + angles[0]) * Math.PI / 180 );
		triangle.points.push( KhanUtil.addMovablePoint({ coord: coord }) );

		triangle.lines.push( KhanUtil.addMovableLineSegment({ pointA: triangle.points[0], pointZ: triangle.points[1], ticks: options.ticks[0], highlightStyle: { "stroke": KhanUtil.BLUE, "stroke-width": 4 } }) );
		triangle.lines.push( KhanUtil.addMovableLineSegment({ pointA: triangle.points[1], pointZ: triangle.points[2], ticks: options.ticks[1], highlightStyle: { "stroke": KhanUtil.BLUE, "stroke-width": 4 } }) );
		triangle.lines.push( KhanUtil.addMovableLineSegment({ pointA: triangle.points[2], pointZ: triangle.points[3], ticks: options.ticks[2], highlightStyle: { "stroke": KhanUtil.BLUE, "stroke-width": 4 } }) );

		triangle.rotationPoint = KhanUtil.addMovablePoint({ visible: false });

		// Translate the triangle so its all visible
		var xlateX = 4 - Math.max(triangle.points[0].coord[0], triangle.points[1].coord[0], triangle.points[2].coord[0], triangle.points[3].coord[0]);
		var xlateY = 4 - Math.max(triangle.points[0].coord[1], triangle.points[1].coord[1], triangle.points[2].coord[1], triangle.points[3].coord[1]);
		jQuery( triangle.points ).each(function() { this.setCoord([ this.coord[0] + xlateX, this.coord[1] + xlateY ]); });

		// Dragging the lines translates the entire shape
		for (var line = 0; line < 3; ++line) {
			triangle.lines[line].onMove = function( dX, dY ) {
				jQuery( triangle.points ).each(function() { this.setCoord([ this.coord[0] + dX, this.coord[1] + dY ]); });
				triangle.update();
			};
			triangle.lines[line].onMoveEnd = function() {
				triangle.update();
			};
		}

		// Always redraw the triangle after a point moves
		for (var point = 0; point < 4; ++point) {
			triangle.points[point].onMoveEnd = function( coordX, coordY ) {
				triangle.update();
			};
		}

		triangle.update();
		return triangle;
	},



	addTriangleDecorations: function( triangle, type ) {
		var ticks = [ 0, 0, 0 ];
		var arcs  = [ 0, 0, 0 ];
		if ( type === "SSS" ) {
			ticks = [ 1, 2, 3 ];
		} else if ( type === "SSA") {
			arcs  = [ 0, 0, 1 ];
			ticks = [ 1, 2, 0 ];
		} else if ( type === "SAS") {
			arcs  = [ 0, 1, 0 ];
			ticks = [ 1, 2, 0 ];
		} else if ( type === "SAA") {
			arcs  = [ 0, 1, 2 ];
			ticks = [ 1, 0, 0 ];
		} else if ( type === "ASA") {
			arcs  = [ 0, 1, 2 ];
			ticks = [ 0, 1, 0 ];
		} else if ( type === "AAA") {
			arcs  = [ 1, 2, 3 ];
		}

		KhanUtil.addMovableLineSegment({ coordA: triangle.points[0], coordZ: triangle.points[1], fixed: true, ticks: ticks[0], normalStyle: { stroke: "#b1c9f5", "stroke-width": 2 } });
		KhanUtil.addMovableLineSegment({ coordA: triangle.points[1], coordZ: triangle.points[2], fixed: true, ticks: ticks[1], normalStyle: { stroke: "#b1c9f5", "stroke-width": 2 } });
		KhanUtil.addMovableLineSegment({ coordA: triangle.points[2], coordZ: triangle.points[0], fixed: true, ticks: ticks[2], normalStyle: { stroke: "#b1c9f5", "stroke-width": 2 } });
		KhanUtil.drawArcs( triangle.points[2], triangle.points[0], triangle.points[1], arcs[0] );
		KhanUtil.drawArcs( triangle.points[0], triangle.points[1], triangle.points[2], arcs[1] );
		KhanUtil.drawArcs( triangle.points[1], triangle.points[2], triangle.points[0], arcs[2] );
		jQuery( triangle.set ).each( function() { this.toBack(); });
	}

});


jQuery.extend( Khan.answerTypes, {
	congruence: function( solutionarea, solution, fallback, verifier, input ) {
		jQuery( solutionarea ).append( jQuery( solution ).clone().contents().tmpl() );
		var correct = solutionarea.find( ".answer" ).text();
		solutionarea.find( ".answer" ).empty();

		ret = function() {
			var triangle = KhanUtil.currentGraph.interactiveTriangle;
			var guess = solutionarea.find( "input:checked" ).val();
			ret.guess = [ guess, triangle.points[0].coord, triangle.points[1].coord, triangle.points[2].coord, triangle.points[3].coord ];
			if ( guess === undefined ) {
				// no guess, don't grade answer
				ret.guess = "";
				return false;
			} else if ( guess !== correct) {
				return false;
			} else if ( !triangle.isTriangle) {
				return "Your answer is almost correct, but you haven't constructed a triangle.";
			} else if ( correct === "No" && triangle.isCongruent ) {
				return "Your answer is almost correct, but the two triangles are congruent. Prove your answer by trying to construct an incongruent triangle.";
			} else {
				return true;
			}
		};
		ret.examples = [ "the shapes to the left are part of your answer" ];
		ret.solution = correct;
		ret.showGuess = function( guess ) {
			var triangle = KhanUtil.currentGraph.interactiveTriangle;
			solutionarea.find( "input:checked" ).prop( 'checked', false );
			solutionarea.find( "input[value=" + guess[0] + "]" ).prop( 'checked', true );
			triangle.points[0].setCoord(guess[1]);
			triangle.points[1].setCoord(guess[2]);
			triangle.points[2].setCoord(guess[3]);
			triangle.points[3].setCoord(guess[4]);
			triangle.update();
		};
		return ret;
	}
});
