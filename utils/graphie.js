(function() {
	var createGraph = function( el ) {
		var xScale = 40, yScale = 40, xRange, yRange;

		jQuery( el ).css( "position", "relative" );
		var raphael = Raphael( el );

		// For a sometimes-reproducible IE8 bug; doesn't affect SVG browsers at all
		jQuery( el ).children( "div" ).css( "position", "absolute" );

		// Set up some reasonable defaults
		var currentStyle = {
			"stroke-width": 2,
			"fill": "none"
		};

		var scaleVector = function( point ) {
			if ( typeof point === "number" ) {
				return scaleVector([ point, point ]);
			}

			var x = point[0], y = point[1];
			return [ x * xScale, y * yScale ];
		};

		var scalePoint = function scalePoint( point ) {
			if ( typeof point === "number" ) {
				return scalePoint([ point, point ]);
			}

			var x = point[0], y = point[1];
			return [ ( x - xRange[0] ) * xScale, ( yRange[1] - y ) * yScale ];
		};

		var svgPath = function( points ) {
			// Bound a number by 1e-6 and 1e20 to avoid exponents after toString
			function boundNumber( num ) {
				if ( num === 0 ) {
					return num;
				} else if ( num < 0 ) {
					return -boundNumber( -num );
				} else {
					return Math.max( 1e-6, Math.min( num, 1e20 ) );
				}
			}

			return jQuery.map(points, function( point, i ) {
				if ( point === true ) {
					return "z";
				} else {
					var scaled = scalePoint( point );
					return ( i === 0 ? "M" : "L") + boundNumber(scaled[0]) + " " + boundNumber(scaled[1]);
				}
			}).join("");
		};

		var processAttributes = function( attrs ) {
			var transformers = {
				scale: function( scale ) {
					if ( typeof scale === "number" ) {
						scale = [ scale, scale ];
					}

					xScale = scale[0];
					yScale = scale[1];

					// Update the canvas size
					raphael.setSize( ( xRange[1] - xRange[0] ) * xScale, ( yRange[1] - yRange[0] ) * yScale );
				},

				clipRect: function( pair ) {
					var point = pair[0], size = pair[1];
					point[1] += size[1]; // because our coordinates are flipped

					return { "clip-rect": scalePoint( point ).concat( scaleVector( size ) ).join(" ") };
				},

				strokeWidth: function( val ) {
					return { "stroke-width": parseFloat(val) };
				},

				rx: function( val ) {
					return { rx: scaleVector([ val, 0 ])[0] };
				},

				ry: function( val ) {
					return { ry: scaleVector([ 0, val ])[1] };
				},

				r: function( val ) {
					var scaled = scaleVector([ val, val ]);
					return { rx: scaled[0], ry: scaled[1] };
				}
			};

			var processed = {};
			jQuery.each(attrs || {}, function( key, value ) {
				var transformer = transformers[ key ];

				if ( typeof transformer === "function" ) {
					jQuery.extend( processed, transformer( value ) );
				} else {
					var dasherized = key.replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')
						.replace(/([a-z\d])([A-Z])/g, '$1-$2')
						.toLowerCase();
					processed[ dasherized ] = value;
				}
			});

			return processed;
		};

		var polar = function( r, th ) {
			if ( typeof r === "number" ) {
				r = [ r, r ];
			}
			th = th * Math.PI / 180;
			return [ r[0] * Math.cos( th ), r[1] * Math.sin( th ) ];
		};

		var addArrowheads = function arrows( path ) {
			var type = path.constructor.prototype;

			if ( type === Raphael.el ) {
				if ( path.type === "path" && typeof path.arrowheadsDrawn === "undefined" ) {
					var w = path.attr( "stroke-width" ), s = 0.6 + 0.4 * w;
					var l = path.getTotalLength();

					if ( l < 0.75 * s ) {
						// You're weird because that's a *really* short path
						// Giving up now before I get more confused

					} else {
						// This makes a lot more sense
						var set = raphael.set();
						var head = raphael.path( "M-3 4 C-2.75 2.5 0 0.25 0.75 0C0 -0.25 -2.75 -2.5 -3 -4" );
						var end = path.getPointAtLength( l - 0.4 );
						var almostTheEnd = path.getPointAtLength( l - 0.75 * s );
						var angle = Math.atan2( end.y - almostTheEnd.y, end.x - almostTheEnd.x ) * 180 / Math.PI;
						var attrs = path.attr();
						delete attrs.path;

						var subpath = path.getSubpath( 0, l - 0.75 * s );
						subpath = raphael.path( subpath ).attr( attrs );
						subpath.arrowheadsDrawn = true;
						path.remove();

						head.rotate( angle, 0.75, 0 ).scale( s, s, 0.75, 0 )
							.translate( almostTheEnd.x, almostTheEnd.y ).attr( attrs )
							.attr({ "stroke-linejoin": "round", "stroke-linecap": "round" });
						head.arrowheadsDrawn = true;
						set.push( subpath );
						set.push( head );
						return set;
					}
				}
			} else if ( type === Raphael.st ) {
				for (var i = 0, l = path.items.length; i < l; i++) {
					arrows( path.items[i] );
				}
			}
		};

		var drawingTools = {
			circle: function( center, radius ) {
				return raphael.ellipse.apply( raphael, scalePoint( center ).concat( scaleVector([ radius, radius ]) ) );
			},

			ellipse: function( center, radii ) {
				return raphael.ellipse.apply( raphael, scalePoint( center ).concat( scaleVector( radii ) ) );
			},

			arc: function( center, radius, startAngle, endAngle, sector ) {
				startAngle = ( startAngle % 360 + 360 ) % 360;
				endAngle = ( endAngle % 360 + 360 ) % 360;

				var cent = scalePoint( center );
				var radii = scaleVector( radius );
				var startVector = polar( radius, startAngle );
				var endVector = polar( radius, endAngle );

				var startPoint = scalePoint([ center[0] + startVector[0], center[1] + startVector[1] ]);
				var endPoint = scalePoint([ center[0] + endVector[0], center[1] + endVector[1] ]);

				var largeAngle = ( (endAngle - startAngle) % 360 + 360) % 360 > 180;

				return raphael.path(
					"M" + startPoint.join(" ") +
					"A" + radii.join(" ") +
					" 0 " + // ellipse rotation
					( largeAngle ? 1 : 0 ) +
					" 0 " + // sweep flag
					endPoint.join(" ") +
					( sector ? "L" + cent.join(" ") + "z" : "" ) );
			},

			path: function( points ) {
				var p = raphael.path( svgPath( points) );
				p.graphiePath = points;
				return p;
			},

			line: function( start, end ) {
				return this.path( [start, end] );
			},

			grid: function( xr, yr ) {
				var step = currentStyle.step || [ 1, 1 ];
				var set = raphael.set();

				var x = step[0] * Math.ceil(xr[0] / step[0]);
				for ( ; x <= xr[1]; x += step[0] ) {
					set.push( this.line( [x, yr[0]], [x, yr[1]] ) );
				}

				var y = step[1] * Math.ceil(yr[0] / step[1]);
				for ( ; y <= yr[1]; y += step[1] ) {
					set.push( this.line( [xr[0], y], [xr[1], y] ) );
				}

				return set;
			},

			label: function( point, text, direction, latex ) {
				var directions = {
					"center":      [ -0.5, -0.5 ],
					"above":       [ -0.5, -1.0 ],
					"above right": [  0.0, -1.0 ],
					"right":       [  0.0, -0.5 ],
					"below right": [  0.0,  0.0 ],
					"below":       [ -0.5,  0.0 ],
					"below left":  [ -1.0,  0.0 ],
					"left":        [ -1.0, -0.5 ],
					"above left":  [ -1.0, -1.0 ]
				};

				var scaled = scalePoint( point );

				latex = (typeof latex === "undefined") || latex;

				if (latex) {
					var code = jQuery( "<code>" ).text( text );
					var pad = currentStyle["label-distance"];
					var span = jQuery( "<span>" ).append( code ).css({
						position: "absolute",
						left: scaled[0],
						top: scaled[1],
						padding: ( pad != null ? pad : 7 ) + "px"
					}).appendTo( el );

					if ( typeof MathJax !== "undefined") {
						// Add to the MathJax queue
						jQuery.tmpl.type.code()( code[0] );

						// Run after MathJax typesetting
						MathJax.Hub.Queue(function() {
							// Avoid an icky flash
							span.css( "visibility", "hidden" );

							var setMargins = function( size ) {
								span.css( "visibility", "" );
								var multipliers = directions[ direction || "center" ];
								span.css({
									marginLeft: Math.round( size[0] * multipliers[0] ),
									marginTop: Math.round( size[1] * multipliers[1] )
								});
							};

							var callback = MathJax.Callback( function() {} );

							// Wait for the browser to render it
							var tries = 0,
							    size = [ span.outerWidth(), span.outerHeight() ];

							if ( size[1] > 18 ) {
								setMargins( size );
								callback();
							} else {
								var inter = setInterval(function() {
									size = [ span.outerWidth(), span.outerHeight() ];

									// Heuristic to guess if the font has kicked in so we have box metrics
									// (Magic number ick, but this seems to work mostly-consistently)
									if ( size[1] > 18 || ++tries >= 10 ) {
										setMargins( size );
										clearInterval(inter);
										callback();
									}
								}, 100);
							}

							return callback;
						});
					}

					return span;
				} else {
					var rtext = raphael.text( scaled[0], scaled[1], text );
					return rtext;
				}
			},

			plotParametric: function( fn, range ) {
				currentStyle.strokeLinejoin || ( currentStyle.strokeLinejoin = "round" );
				currentStyle.strokeLinecap || ( currentStyle.strokeLinecap = "round" );

				var points = [];

				var min = range[0], max = range[1];
				var step = ( max - min ) / ( currentStyle["plot-points"] || 800 );
				for ( var t = min; t <= max; t += step ) {
					points.push( fn( t ) );
				}

				return this.path( points );
			},

			plotPolar: function( fn, range ) {
				var min = range[0], max = range[1];

				// There is probably a better heuristic for this
				currentStyle["plot-points"] || ( currentStyle["plot-points"] = 2 * ( max - min ) * xScale );

				return this.plotParametric( function( th ) {
					return polar( fn(th), th * 180 / Math.PI );
				}, range );
			},

			plot: function( fn, range ) {
				var min = range[0], max = range[1];
				currentStyle["plot-points"] || ( currentStyle["plot-points"] = 2 * ( max - min ) * xScale );

				return this.plotParametric( function( x ) {
					return [ x, fn(x) ];
				}, range );
			}
		};

		var graphie = {
			raphael: raphael,

			init: function( options ) {
				var scale = options.scale || [ 40, 40 ];
				scale = ( typeof scale === "number" ? [ scale, scale ] : scale );

				xScale = scale[0];
				yScale = scale[1];

				if( options.range == null ) {
					return Khan.error( "range should be specified in graph init" );
				}

				xRange = options.range[0];
				yRange = options.range[1];

				var w = ( xRange[1] - xRange[0] ) * xScale, h = ( yRange[1] - yRange[0] ) * yScale;
				raphael.setSize( w, h );
				jQuery( el ).css({
					"width": w,
					"height": h
				});

				return this;
			},

			style: function( attrs, fn ) {
				var processed = processAttributes( attrs );

				if ( typeof fn === "function" ) {
					var oldStyle = currentStyle;
					currentStyle = jQuery.extend( {}, currentStyle, processed );
					fn.call( graphie );
					currentStyle = oldStyle;
				} else {
					jQuery.extend( currentStyle, processed );
				}
			},

			scalePoint: scalePoint,
			scaleVector: scaleVector,

			polar: polar

		};

		jQuery.each( drawingTools, function( name ) {
			graphie[ name ] = function() {
				var last = arguments[ arguments.length - 1 ];
				var oldStyle = currentStyle;
				var result;

				// The last argument is probably trying to change the style
				if ( typeof last === "object" && !jQuery.isArray( last ) ) {
					currentStyle = jQuery.extend( {}, currentStyle, processAttributes( last ) );

					var rest = [].slice.call( arguments, 0, arguments.length - 1 );
					result = drawingTools[ name ].apply( drawingTools, rest );
				} else {
					currentStyle = jQuery.extend( {}, currentStyle );

					result = drawingTools[ name ].apply( drawingTools, arguments );
				}

				// Bad heuristic for recognizing Raphael elements and sets
				var type = result.constructor.prototype;
				if ( type === Raphael.el || type === Raphael.st ) {
					result.attr( currentStyle );

					if ( currentStyle.arrows ) {
						result = addArrowheads( result );
					}
				} else if ( result instanceof jQuery ) {
					result.css( currentStyle );
				}

				currentStyle = oldStyle;
				return result;
			};
		});


		// Initializes graphie settings for a graph and draws the basic graph
		// features (axes, grid, tick marks, and axis labels)
		// Options expected are:
		// - range: [ [a, b], [c, d] ] or [ a, b ]
		// - scale: [ a, b ] or number
		// - gridOpacity: number (0 - 1)
		// - gridStep: [ a, b ] or number (relative to units)
		// - tickStep: [ a, b ] or number (relative to grid steps)
		// - tickLen: [ a, b ] or number (in pixels)
		// - labelStep: [ a, b ] or number (relative to tick steps)
		// - yLabelFormat: fn to format label string for y-axis
		// - xLabelFormat: fn to format label string for x-axis
		// - smartLabelPositioning: true or false to ignore minus sign
		graphie.graphInit = function( options ) {

			options = options || {};

			jQuery.each( options, function( prop, val ) {

				// allow options to be specified by a single number for shorthand if 
				// the horizontal and vertical components are the same
				if ( prop !== "gridOpacity" && prop !== "range" 
						&& typeof val === "number" ) {
					options[ prop ] = [ val, val ];
				}

				// allow symmetric ranges to be specified by the absolute values 
				if ( prop === "range" ) {
					if ( val.constructor === Array ) {
						if ( val[0].constructor !== Array ) {  // but don't mandate symmetric ranges
							options[ prop ] = [ [ -val[0], val[0] ], [ -val[1], val[1] ] ];
						}
					} else if ( typeof val === "number" ) {
						options[ prop ] = [ [ -val, val ], [ -val, val ] ];
					}
				}

			});

			var range = options.range || [ [-10, 10], [-10, 10] ],
				scale = options.scale || [ 20, 20 ],
				grid = options.grid || true,
				gridOpacity = options.gridOpacity || 0.1,
				gridStep = options.gridStep || [ 1, 1 ],
				axes = options.axes || true,
				axisArrows = options.axisArrows || "",
				ticks = options.ticks || true,
				tickStep = options.tickStep || [ 2, 2 ],
				tickLen = options.tickLen || [ 5, 5 ],
				labels = options.labels || options.labelStep || false,
				labelStep = options.labelStep || [ 1, 1 ],
				unityLabels = options.unityLabels || false,
				labelFormat = options.labelFormat || function(a) { return a; },
				xLabelFormat = options.xLabelFormat || labelFormat,
				yLabelFormat = options.yLabelFormat || labelFormat,
				smartLabelPositioning = options.smartLabelPositioning != null ?
					options.smartLabelPositioning : true;

			if ( smartLabelPositioning ) {
				var minusIgnorer = function( lf ) { return function( a ) {
					return ( lf( a ) + "" ).replace( /-(\d)/g, "\\llap{-}$1" );
				}; };

				xLabelFormat = minusIgnorer( xLabelFormat );
				yLabelFormat = minusIgnorer( yLabelFormat );
			}

			this.init({
				range: range,
				scale: scale
			});

			// draw grid
			if ( grid ) {
				this.grid( range[0], range[1], {
					stroke: "#000000",
					opacity: gridOpacity,
					step: gridStep
				});
			}

			// draw axes
			if ( axes ) {

				// this is a slight hack until <-> arrowheads work
				if ( axisArrows === "<->" || true ) {
					this.style({
						stroke: "#000000",
						strokeWidth: 2,
						arrows: "->"
					}, function() {
						this.path([ [ 0, 0 ], [ range[0][0], 0 ] ]);
						this.path([ [ 0, 0 ], [ range[0][1], 0 ] ]);
						this.path([ [ 0, 0 ], [ 0, range[1][0] ] ]);
						this.path([ [ 0, 0 ], [ 0, range[1][1] ] ]);
					});

				// also, we don't support "<-" arrows yet, but why you
				// would want that on your graph is beyond me.
				} else if ( axisArrows === "->" || axisArrows === "" ) {
					this.style({
						stroke: "#000000",
						strokeWidth: 2,
						arrows: axisArrows
					}, function() {
						this.path([ [ range[0][0], 0 ], [ range[0][1], 0 ] ]);
						this.path([ [ 0, range[1][0] ], [ 0, range[1][1] ] ]);
					});

				}

			}

			// draw tick marks
			if ( ticks ) {
				this.style({
					stroke: "#000000",
					strokeWidth: 1
				}, function() {

					// horizontal axis
					var step = gridStep[0] * tickStep[0],
				 len = tickLen[0] / scale[1],
				 start = range[0][0],
				 stop = range[0][1];

					for ( var x = step; x <= stop; x += step ) {
						if ( x < stop || !axisArrows ) {
							this.line( [ x, -len ], [ x, len ] );
						}
					}

					for ( var x = -step; x >= start; x -= step ) {
						if ( x > start || !axisArrows ) {
							this.line( [ x, -len ], [ x, len ] );
						}
					}

					// vertical axis
					step = gridStep[1] * tickStep[1];
					len = tickLen[1] / scale[0];
					start = range[1][0];
					stop = range[1][1];

					for ( var y = step; y <= stop; y += step ) {
						if ( y < stop || !axisArrows ) {
							this.line( [ -len, y ], [ len, y ] );
						}
					}

					for ( var y = -step; y >= start; y -= step ) {
						if ( y > start || !axisArrows ) {
							this.line( [ -len, y ], [ len, y ] );
						}
					}

				});
			}

			// draw axis labels
			if ( labels ) {
				this.style({
					stroke: "#000000"
				}, function() {

					// horizontal axis
					var step = gridStep[0] * tickStep[0] * labelStep[0],
						start = range[0][0],
						stop = range[0][1];

					// positive x-axis
					for ( var x = step; x <= stop; x += step ) {
						if ( x < stop || !axisArrows ) {
							this.label( [ x, 0 ], xLabelFormat( x ), "below" );
						}
					}

					// negative x-axis
					for ( var x = -step * (unityLabels ? 1 : 2); x >= start; x -= step ) {
						if ( x > start || !axisArrows ) {
							this.label( [ x, 0 ], xLabelFormat( x ), "below" );
						}
					}

					step = gridStep[1] * tickStep[1] * labelStep[1];
					start = range[1][0];
					stop = range[1][1];

					// positive y-axis
					for ( var y = step; y <= stop; y += step ) {
						if ( y < stop || !axisArrows ) {
							this.label( [ 0, y ], yLabelFormat( y ), "left" );
						}
					}

					// negative y-axis
					for ( var y = -step * (unityLabels ? 1 : 2); y >= start; y -= step ) {
						if ( y > start || !axisArrows ) {
							this.label( [ 0, y ], yLabelFormat( y ), "left" );
						}
					}

				});
			}

		};

		return graphie;
	};

	jQuery.fn.graphie = function( problem ) {
		return this.find( ".graphie" ).andSelf().filter( ".graphie" ).each(function() {
			// Grab code for later execution
			var code = jQuery( this ).text(), graphie;

			// Ignore code that isn't really code ;)
			if (code.match(/Created with Rapha\xebl/)) {
				return;
			}

			// Remove any of the code that's in there
			jQuery( this ).empty();

			// Initialize the graph
			if ( jQuery( this ).data( "update" ) ) {
				var id = jQuery( this ).data( "update" );
				jQuery( this ).remove();

				// Graph could be in either of these
				var area = jQuery( "#problemarea" ).add(problem);
				graphie = area.find( "#" + id ).data( "graphie" );
			} else {
				graphie = createGraph( this );
				jQuery( this ).data( "graphie", graphie );
			}

			// So we can write graph.bwahahaha = 17 to save stuff between updates
			if ( typeof graphie.graph === "undefined" ) {
				graphie.graph = {};
			}

			code = "(function() {" + code + "})()";

			// Execute the graph-specific code
			KhanUtil.currentGraph = graphie;
			jQuery.tmpl.getVAR( code, graphie );
			// delete KhanUtil.currentGraph;
		}).end();
	};
})();
