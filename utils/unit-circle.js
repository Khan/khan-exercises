jQuery.extend( KhanUtil, {
	BLUE: "#6495ED",
	ORANGE: "#FFA500",

	initUnitCircle: function( degrees ) {
		var graph = KhanUtil.currentGraph;

		// Create a properly scaled 600x600px graph
		options = {
			xpixels: 600,
			ypixels: 600,
			range: [ [-1.2, 1.2], [-1.2, 1.2] ],
		};
		options.scale = [ options.xpixels/(options.range[0][1] - options.range[0][0]),
		                  options.ypixels/(options.range[1][1] - options.range[1][0]) ];
		graph.init(options);

		// Attach the metrics to the graph for later reference
		graph.xpixels = options.xpixels;
		graph.ypixels = options.ypixels;
		graph.range = options.range;
		graph.scale = options.scale;

		graph.angle = 0;
		graph.revolutions = 0;
		graph.quadrant = 1;

		graph.dragging = false;
		graph.highlight = false;
		graph.degrees = degrees;

		// Axes and circle
		graph.style({
			stroke: "#ddd",
			strokeWidth: 1,
			arrows: "->"
		}, function() {
			graph.circle( [ 0, 0 ], 1 );
			graph.line( [-1.2, 0], [1.2, 0] );
			graph.line( [0, -1.2], [0, 1.2] );
			graph.line( [1.2, 0], [-1.2, 0] );
			graph.line( [0, 1.2], [0, -1.2] );
		});

		// Tick marks at -1, 1
		graph.style({
			strokeWidth: 2,
		}, function() {
			graph.line( [ -1, -5 / graph.scale[0] ], [ -1, 5 / graph.scale[0] ] );
			graph.line( [ 1, -5 / graph.scale[0] ], [ 1, 5 / graph.scale[0] ] );
			graph.line( [ -5 / graph.scale[0], -1 ], [ 5 / graph.scale[0], -1 ] );
			graph.line( [ -5 / graph.scale[0], 1 ], [ 5 / graph.scale[0], 1 ] );
		});

		// Declare all the graphic elements that get manipulated each time the angle changes
		graph.triangle = KhanUtil.bogusShape;
		graph.rightangle = KhanUtil.bogusShape;
		graph.spiral = KhanUtil.bogusShape;
		graph.arrow = KhanUtil.bogusShape;
		graph.cosLabel = KhanUtil.bogusShape;
		graph.sinLabel = KhanUtil.bogusShape;
		graph.radiusLabel = KhanUtil.bogusShape;
		graph.angleLabel = KhanUtil.bogusShape;
		graph.angleLines = KhanUtil.bogusShape;

		KhanUtil.initMouseHandlers();
		KhanUtil.setAngle( graph.angle );
	},

	// Not all shapes are needed to depict every angle. If a shape isn't
	// needed, it's replaced with bogusShape which just has stub methods
	// that successfully do nothing.
	// The alternative would be 'if..typeof' checks all over the place.
	bogusShape: {
		animate: function(){},
		attr: function(){},
		remove: function(){},
	},


	initMouseHandlers: function() {
		var graph = KhanUtil.currentGraph;

		// Another SVG element on top of everything else where we can add
		// invisible shapes with mouse handlers wherever we want.
		graph.mouselayer = Raphael( "unitcircle", graph.xpixels, graph.ypixels );
		jQuery( graph.mouselayer.canvas ).css( "z-index", 1 );
		Khan.scratchpad.disable();

		// Visible orange point that gets dragged
		graph.style({
			stroke: KhanUtil.ORANGE,
			fill: KhanUtil.ORANGE,
		}, function() {
			graph.dragPoint = graph.circle( [ 1, 0 ], 4 / graph.scale[0] );
		});

		// The invisible circle that gets mouse events.
		graph.mouseTarget = graph.mouselayer.circle(
				(1 - graph.range[0][0]) * graph.scale[0],
				(graph.range[1][1] - 0) * graph.scale[1], 15 );
		graph.mouseTarget.attr({fill: "#000", "opacity": 0.0});

		jQuery( graph.mouseTarget[0] ).css( "cursor", "move" );
		jQuery( graph.mouseTarget[0] ).bind("mousedown mouseenter mouseleave", function( event ) {
			var graph = KhanUtil.currentGraph;
			if ( event.type === "mouseenter" ) {
				graph.highlight = true;
				if ( !graph.dragging ) {
					KhanUtil.highlightAngle();
				}

			} else if ( event.type === "mouseleave" ) {
				graph.highlight = false;
				if ( !graph.dragging ) {
					KhanUtil.unhighlightAngle();
				}

			} else if ( event.type === "mousedown" && event.which === 1 ) {
				event.preventDefault();
				jQuery( document ).bind("mousemove mouseup", function( event ) {
					event.preventDefault();
					graph.dragging = true;

					// mouseY is in pixels relative to the SVG; coordY is the scaled y-coordinate value
					var mouseY = event.pageY - jQuery( "#unitcircle" ).offset().top;
					var mouseX = event.pageX - jQuery( "#unitcircle" ).offset().left;
					var coordX = (mouseX / graph.scale[0]) + graph.range[0][0];
					var coordY = graph.range[1][1] - mouseY / graph.scale[1];

					if ( event.type === "mousemove" ) {
						// Find the angle from the origin to the mouse pointer
						var angle;
						if (coordX) {
							angle = Math.atan(coordY / coordX);
						} else {
							// Fill in where atan is undefined
							if (coordY > 0) {
								angle = -Math.PI/2;
							} else {
								angle = -Math.PI/2;
							}
						}

						// Round the angle to the nearest 5 degree increment
						angle = Math.round( angle / (Math.PI/36) ) * (Math.PI/36);

						// Figure out what quadrant the mouse is in. Since atan
						// is only defined in Q1 and Q4 (and is negative in Q4),
						// adjust the angle appropriately to represent the correct
						// positive angle in the unit circle.
						//
						// If moving between Q1 and Q4, keep track of the number of revolutions.
						if (coordX > 0 && coordY >= 0) {
							if (graph.quadrant === 4) {
								++graph.revolutions;
							}
							graph.quadrant = 1;

						} else if (coordX <= 0 && coordY > 0) {
							angle += Math.PI;
							graph.quadrant = 2;

						} else if (coordX < 0 && coordY <= 0) {
							angle += Math.PI;
							graph.quadrant = 3;

						} else if (coordX >= 0 && coordY < 0) {
							angle += 2 * Math.PI;
							if (graph.quadrant === 1) {
								--graph.revolutions;
							}
							graph.quadrant = 4;
						}

						// Limit the number of revolutions to 2 in either direction.
						if (graph.revolutions <= -3) {
							graph.revolutions = -3;
							angle = 2 * Math.PI;
						} else if (graph.revolutions >= 2) {
							graph.revolutions = 2;
							angle = 0;
						}

						// Now ((2pi * revolutions) + angle) represents the full angle
						// Redraw the angle only if it's changed
						if (graph.angle != angle + (graph.revolutions * 2 * Math.PI)) {
							KhanUtil.setAngle( angle + (graph.revolutions * 2 * Math.PI) );
						}

					} else if ( event.type === "mouseup" ) {
						jQuery( document ).unbind( "mousemove mouseup" );
						graph.dragging = false;
						if (!graph.highlight) {
							KhanUtil.unhighlightAngle();
						}
					}
				});
			}
		});

	},


	highlightAngle: function() {
		graph.dragPoint.animate({ scale: 2 }, 50 );
		graph.angleLines.animate( { stroke: KhanUtil.ORANGE }, 100 );
		graph.spiral.animate({ stroke: KhanUtil.ORANGE }, 100 );
		graph.arrow.animate({ fill: KhanUtil.ORANGE }, 100 );
		jQuery( graph.angleLabel ).animate({ color: KhanUtil.ORANGE }, 100 );
		//jQuery( graph.angleLabel ).css({ color: KhanUtil.ORANGE });
	},


	unhighlightAngle: function() {
		graph.dragPoint.animate({ scale: 1 }, 50 );
		graph.angleLines.animate( { stroke: KhanUtil.BLUE }, 100 );
		graph.spiral.animate({ stroke: KhanUtil.BLUE }, 100 );
		graph.arrow.animate({ fill: KhanUtil.BLUE }, 100 );
		jQuery( graph.angleLabel ).animate({ color: KhanUtil.BLUE }, 100 );
		//jQuery( graph.angleLabel ).css({ color: KhanUtil.BLUE });
	},


	// Redraw the angle
	setAngle: function( angle ) {
		graph = KhanUtil.currentGraph;
		graph.angle = angle;

		graph.quadrant = (Math.floor((angle + 10 * Math.PI) / (Math.PI / 2)) % 4) + 1;
		graph.revolutions = Math.floor(angle / (2 * Math.PI));

		if (graph.quadrant != (Math.floor((angle + 10 * Math.PI) / (Math.PI / 2)) % 4) + 1) {
			console.log("quadrant", graph.quadrant, (Math.floor((angle + 10 * Math.PI) / (Math.PI / 2)) % 4) + 1, angle * (180/Math.PI));
		}
		if (graph.revolutions != Math.floor(angle / (2 * Math.PI))) {
			console.log("revolutions", graph.revolutions, Math.floor(angle / (2 * Math.PI)), angle * (180/Math.PI));
		}

		// Remove everything dynamic. It should be safe to call remove()
		// on everything since unused stuff should be instances of bogusShape
		graph.triangle.remove();
		graph.rightangle.remove();
		graph.spiral.remove();
		graph.arrow.remove();
		graph.cosLabel.remove();
		graph.sinLabel.remove();
		graph.radiusLabel.remove();
		graph.angleLabel.remove();
		graph.angleLines.remove();

		var highlightColor = KhanUtil.BLUE;
		if (graph.dragging || graph.highlight) {
			highlightColor = KhanUtil.ORANGE;
		}

		graph.style({ stroke: KhanUtil.BLUE, strokeWidth: 1 });
		graph.triangle = graph.path( [ [ 0, 0 ], [ Math.cos( angle ), 0 ], [ Math.cos( angle ), Math.sin( angle ) ], [0, 0] ] );

		var cosText = KhanUtil.roundTo(3, Math.cos(angle));
		var sinText = KhanUtil.roundTo(3, Math.sin(angle));

		// Include radicals for common 45-45-90 and 30-60-90 values
		cosText = cosText != 0.866 ? cosText : "\\frac{\\sqrt{3}}{2}\\;(0.866)";
		cosText = cosText != 0.707 ? cosText : "\\frac{\\sqrt{2}}{2}\\;(0.707)";
		cosText = cosText != -0.866 ? cosText : "-\\frac{\\sqrt{3}}{2}\\;(-0.866)";
		cosText = cosText != -0.707 ? cosText : "-\\frac{\\sqrt{2}}{2}\\;(-0.707)";
		sinText = sinText != 0.866 ? sinText : "\\frac{\\sqrt{3}}{2}\\;(0.866)";
		sinText = sinText != 0.707 ? sinText : "\\frac{\\sqrt{2}}{2}\\;(0.707)";
		sinText = sinText != -0.866 ? sinText : "-\\frac{\\sqrt{3}}{2}\\;(-0.866)";
		sinText = sinText != -0.707 ? sinText : "-\\frac{\\sqrt{2}}{2}\\;(-0.707)";


		// Position the distance labels and right-angle marker based on quadrant
		if (!(angle % Math.PI)) {
			graph.cosLabel = graph.label( [Math.cos(angle) / 2, 0], cosText, "below" );
		} else if (!(angle % (Math.PI / 2))) {
			graph.sinLabel = graph.label( [Math.cos(angle), Math.sin(angle) / 2], sinText, "right" );
		} else if (graph.quadrant === 1) {
			graph.cosLabel = graph.label( [Math.cos(angle) / 2, 0], cosText, "below" );
			graph.sinLabel = graph.label( [Math.cos(angle), Math.sin(angle) / 2], sinText, "right" );
			graph.radiusLabel = graph.label( [Math.cos(angle) / 2, Math.sin(angle) / 2], 1, "above left" );
			graph.rightangle = graph.path([ [Math.cos(angle) - 0.04, 0], [Math.cos(angle) - 0.04, 0.04], [Math.cos(angle), 0.04] ]);
		} else if (graph.quadrant === 2) {
			graph.cosLabel = graph.label( [Math.cos(angle) / 2, 0], cosText, "below" );
			graph.sinLabel = graph.label( [Math.cos(angle), Math.sin(angle) / 2], sinText, "left"  );
			graph.radiusLabel = graph.label( [Math.cos(angle) / 2, Math.sin(angle) / 2], 1, "above right" );
			graph.rightangle = graph.path([ [Math.cos(angle) + 0.04, 0], [Math.cos(angle) + 0.04, 0.04], [Math.cos(angle), 0.04] ]);
		} else if (graph.quadrant === 3) {
			graph.cosLabel = graph.label( [Math.cos(angle)/2, 0], cosText, "above" );
			graph.sinLabel = graph.label( [Math.cos(angle), Math.sin(angle) / 2], sinText, "left" );
			graph.radiusLabel = graph.label( [Math.cos(angle)/2, Math.sin(angle)/2], 1, "below right" );
			graph.rightangle = graph.path([ [Math.cos(angle) + 0.04, 0], [Math.cos(angle) + 0.04, -0.04], [Math.cos(angle), -0.04] ]);
		} else if (graph.quadrant === 4) {
			graph.cosLabel = graph.label( [Math.cos(angle) / 2, 0], cosText, "above" );
			graph.sinLabel = graph.label( [Math.cos(angle), Math.sin(angle) / 2], sinText, "right" );
			graph.radiusLabel = graph.label( [Math.cos(angle) / 2, Math.sin(angle) / 2 ], 1, "below left" );
			graph.rightangle = graph.path([ [Math.cos(angle) - 0.04, 0], [Math.cos(angle) - 0.04, -0.04], [Math.cos(angle), -0.04] ]);
		}

		// Draw the spiral angle indicator
		var points = [];
		for (var i = 0; i <= 50; ++i) {
			points.push([ Math.cos(i * angle / 50) * (0.1 + ((i * Math.abs(angle) / 50 / Math.PI) * 0.02)),
			              Math.sin(i * angle / 50) * (0.1 + ((i * Math.abs(angle) / 50 / Math.PI) * 0.02)) ]);
		}
		graph.style({ strokeWidth: 2, stroke: highlightColor });

		graph.spiral = graph.path(points);

		// Draw an arrow at the end of the spiral angle indicator
		var spiralEndX = points[50][0];
		var spiralEndY = points[50][1];
		graph.style( { stroke: false, fill: highlightColor }, function() {
			if (angle > Math.PI/12) {
				// positive angles big enough to need an arrow
				graph.arrow = graph.path([ [spiralEndX, spiralEndY - 0.005],
				                           [spiralEndX - 0.02, spiralEndY-0.03],
				                           [spiralEndX + 0.02, spiralEndY-0.03],
				                           [spiralEndX, spiralEndY-0.005] ]);
				graph.arrow.rotate((angle-Math.PI/20) * (-180/Math.PI), (spiralEndX - graph.range[0][0]) * graph.scale[0], (graph.range[1][1] - spiralEndY) * graph.scale[1]);
			} else if (angle < -Math.PI/12) {
				// negative angles "big" enough to need an arrow
				graph.arrow = graph.path([ [spiralEndX, spiralEndY+0.005],
				                           [spiralEndX - 0.02, spiralEndY+0.03],
				                           [spiralEndX + 0.02, spiralEndY+0.03],
				                           [spiralEndX, spiralEndY+0.005] ]);
				graph.arrow.rotate((angle+Math.PI/20) * (-180/Math.PI), (spiralEndX - graph.range[0][0]) * graph.scale[0], (graph.range[1][1] - spiralEndY) * graph.scale[1]);
			} else {
				// no room for an arrow
				graph.arrow = KhanUtil.bogusShape;
			}
		});


		// Figure out how to display the angle
		var angleText = angle;
		if (graph.degrees) {
			angleText *= (180 / Math.PI);
			angleText = Math.round(angleText);
			angleText += "^{\\circ}";
		} else if (-15 < angle && angle < 15) {
			angleText = KhanUtil.piFraction( angle );
		}

		// Put the angle value somewhere obvious, but not in the way of anything else. This
		// could probably be improved, but it at least prevents text on top of other text.
		if (angle < -3.5 * Math.PI) {
			graph.angleLabel = graph.label( [-0.2, 0.2], angleText, "center");
		} else if (angle < -0.15 * Math.PI) {
			graph.angleLabel = graph.label( [Math.cos(angle/2)/5, Math.sin(angle/2)/5], angleText, "center");
		} else if (angle < 0.15 * Math.PI) {
			graph.angleLabel = graph.label( [0, 0], angleText, "left");
		} else if (angle < 3.5 * Math.PI) {
			graph.angleLabel = graph.label( [Math.cos(angle/2)/5, Math.sin(angle/2)/5], angleText, "center");
		} else {
			graph.angleLabel = graph.label( [-0.2, -0.2], angleText, "center");
		}
		jQuery( graph.angleLabel ).css("color", highlightColor );


		// Draw the bold angle lines
		graph.style({ strokeWidth: 3 });
		graph.angleLines = graph.path([ [ 1, 0 ], [ 0, 0 ], [ Math.cos( angle ), Math.sin( angle ) ] ]);

		// Reposition the mouse target and indicator
		graph.mouseTarget.attr("cx", (Math.cos( angle ) - graph.range[0][0]) * graph.scale[0]);
		graph.mouseTarget.attr("cy", (graph.range[1][1] - Math.sin( angle )) * graph.scale[1]);
		graph.dragPoint.attr("cx", (Math.cos( angle ) - graph.range[0][0]) * graph.scale[0]);
		graph.dragPoint.attr("cy", (graph.range[1][1] - Math.sin( angle )) * graph.scale[1]);
		graph.dragPoint.toFront();
	},


	goToAngle: function( angle ) {
		var graph = KhanUtil.currentGraph;
		if (graph.degrees) {
			angle *= (Math.PI/180);
		}
		var duration = 1000 * Math.abs(angle - graph.angle) / Math.PI;
		jQuery( graph ).animate({
			angle: angle
		}, {
			duration: duration,
			easing: "linear",
			step: function( now, fx ) {
				KhanUtil.setAngle(now);
			}
		});
	},


	showCoordinates: function( angle ) {
		var graph = KhanUtil.currentGraph;
		if (graph.degrees) {
			angle *= (Math.PI/180);
		}

		var coordText = "(" + KhanUtil.roundTo(3, Math.cos(angle)) + ", " + KhanUtil.roundTo(3, Math.sin(angle)) + ")";

		graph.style( {stroke: 0, fill: KhanUtil.BLUE}, function() {
			graph.circle( [ Math.cos(angle), Math.sin(angle) ], 4 / graph.scale[0] );
		});
		graph.dragPoint.toFront();

		if ( Math.floor(angle / Math.PI) % 2 ) {
			graph.coordLabel = graph.label( [ Math.cos(angle), Math.sin(angle) ], coordText, "below" );
		} else {
			graph.coordLabel = graph.label( [ Math.cos(angle), Math.sin(angle) ], coordText, "above" );
		}

	}

});
