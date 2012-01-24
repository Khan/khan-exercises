// Temporary not really following convention file, see #160

function numberLine( start, end, step, x, y, denominator ) {
	step = step || 1;
	x = x || 0;
	y = y || 0;
	var decPlaces = (step + "").length - (step + "").indexOf(".")-1;
	if(	 (step + "").indexOf(".") < 0){
		decPlaces = 0;
	}
	var graph = KhanUtil.currentGraph;
	var set = graph.raphael.set();
	set.push( graph.line( [x, y], [x + end - start, y] ) );
	for( var i = 0; i <= end - start; i += step ) {
		set.push( graph.line( [x + i, y - 0.2], [x + i, y + 0.2] ) );

		if ( denominator ){
			var base = KhanUtil.roundTowardsZero( start + i + 0.001 );
			var frac = start + i - base;
			var lab = base;

			if (! ( Math.abs ( Math.round( frac * denominator ) )  === denominator || Math.round( frac * denominator )  ===  0 ) ){
				if ( base === 0 ){
					lab = KhanUtil.fraction( Math.round( frac * denominator ),  denominator, false, false, true);
				}
				else{
					lab =  base + "\\frac{" +  Math.abs( Math.round( frac * denominator )) + "}{" + denominator + "}";
				}
			}
			graph.label( [x + i, y - 0.2], lab, "below", { labelDistance: 3 } );
		}
		else {
			graph.label( [x + i, y - 0.2], (start + i).toFixed(decPlaces), "below", { labelDistance: 3 } );
		}
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
			stroke: colors[2] || "none",
			fill: colors[i]
		} ) );
		partial += slice;
	} );

	for ( var i = 0; i < sum; i++ ) {
		set.push( graph.line( [0, 0], graph.polar( radius, i * 360 / sum ), { stroke: colors[2] || "#fff" } ) );
	}

	return set;
}

function rectchart( divisions, colors, y ) {
	var graph = KhanUtil.currentGraph;
	var set = graph.raphael.set();

	y = y || 0;

	var sum = 0;
	jQuery.each( divisions, function( i, slice ) {
		sum += slice;
	} );

	var partial = 0;
	jQuery.each( divisions, function( i, slice ) {
		var x = partial / sum, w = slice / sum;
		set.push( graph.path([ [x, y], [x + w, y], [x + w, y + 1], [x, y + 1] ], {
			stroke: "#fff",
			fill: colors[i]
		} ) );
		partial += slice;
	} );

	for ( var i = 0; i <= sum; i++ ) {
		var x = i / sum;
		set.push( graph.line( [x, y + 0], [x, y + 1], { stroke: "#fff" } ) );
	}

	return set;
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

	jQuery( "#equationAnswer").html( "<code>y =" + KhanUtil.fractionReduce( graph.MN, graph.MD ) + "x +" + KhanUtil.fractionReduce( graph.BN, graph.BD )+"</code>" ).tmpl();
	jQuery( "#slope-sol input" ).val( ( graph.MN / graph.MD ) + "" );
	jQuery( "#intercept-sol input" ).val( ( graph.BN / graph.BD ) + "" );
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

function Parabola( lc, x, y ) {
	var leadingCoefficient = lc;
	var x1 = x;
	var y1 = y;
	var raphaelObjects = [];

	this.graphieFunction = function( x ) {
		return ( leadingCoefficient * ( x - x1 ) * ( x - x1 ) ) + y1;
	};

	this.plot = function( fShowFocusDirectrix ) {
		var graph = KhanUtil.currentGraph;
		raphaelObjects.push( graph.plot( this.graphieFunction, [-10, 10] ) );
		if ( fShowFocusDirectrix ) {
			var focusX = this.getFocusX();
			var focusY = this.getFocusY();
			var directrixK = this.getDirectrixK();

			graph.style({
				fill: "#6495ED"
			}, function() {
				raphaelObjects.push( graph.circle( [ focusX, focusY ], 0.1 ) );
				raphaelObjects.push( graph.line( [ -10, directrixK ], [ 10, directrixK ] ) );
			});
		}
	};

	this.redraw = function( fShowFocusDirectrix ) {
		jQuery.each( raphaelObjects, function( i, el ) {
			el.remove();
		});
		raphaelObjects = [];
		this.plot( fShowFocusDirectrix );
	};

	this.update = function( newLC, newX, newY ) {
		leadingCoefficient = newLC;
		x1 = newX;
		y1 = newY;
	};

	this.delta = function( deltaLC, deltaX, deltaY ) {
		this.update( leadingCoefficient + deltaLC, x1 + deltaX, y1 + deltaY );
	};

	this.deltaFocusDirectrix = function( deltaX, deltaY, deltaK ) {
		var focusY = this.getFocusY() + deltaY;
		var k = this.getDirectrixK() + deltaK;

		if ( focusY === k ) {
			focusY += deltaY;
			k += deltaK;
		}
		var newVertexY = ( focusY + k ) / 2;
		var newLeadingCoefficient = 1 / ( 2 * ( focusY - k ) );

		this.update( newLeadingCoefficient, this.getVertexX() + deltaX, newVertexY );
	};

	this.getVertexX = function() {
		return x1;
	};

	this.getVertexY = function() {
		return y1;
	};

	this.getLeadingCoefficient = function() {
		return leadingCoefficient;
	};

	this.getFocusX = function() {
		return x1;
	};

	this.getFocusY = function() {
		return y1 + ( 1 / ( 4 * leadingCoefficient ) );
	};

	this.getDirectrixK = function() {
		return y1 - ( 1 / ( 4 * leadingCoefficient ) );
	};
}

function redrawParabola( fShowFocusDirectrix ) {
	var graph = KhanUtil.currentGraph;
	var storage = graph.graph;
	var currParabola = storage.currParabola;
	currParabola.redraw( fShowFocusDirectrix );

	var leadingCoefficient = currParabola.getLeadingCoefficient();
	var vertexX = currParabola.getVertexX();
	var vertexY = currParabola.getVertexY();

	if ( fShowFocusDirectrix ) {
		jQuery( "#focus-x-label" ).html( "<code>" + currParabola.getFocusX() + "</code>" ).tmpl();
		jQuery( "#focus-y-label" ).html( "<code>" + currParabola.getFocusY().toFixed( 2 ) + "</code>" ).tmpl();
		jQuery( "#directrix-label" ).html( "<code>" + "y = " + currParabola.getDirectrixK().toFixed( 2 ) + "</code>" ).tmpl();
	} else {
		var equation = "y - " + vertexY + "=" + leadingCoefficient + "(x - " + vertexX + ")^{2}";
		equation = KhanUtil.cleanMath( equation );
		jQuery( "#equation-label" ).html( "<code>" + equation + "</code>").tmpl();
	}
	jQuery( "#leading-coefficient input" ).val( leadingCoefficient );
	jQuery( "#vertex-x input" ).val( vertexX );
	jQuery( "#vertex-y input" ).val( vertexY );
}

function updateParabola( deltaA, deltaX, deltaY, fShowFocusDirectrix ) {
	KhanUtil.currentGraph.graph.currParabola.delta( deltaA, deltaX, deltaY );
	redrawParabola( fShowFocusDirectrix );
}

function updateFocusDirectrix( deltaX, deltaY, deltaK ) {
	KhanUtil.currentGraph.graph.currParabola.deltaFocusDirectrix( deltaX, deltaY, deltaK );
	redrawParabola( true );
}

function ParallelLines( x1, y1, x2, y2, distance ) {
	var lowerIntersection;
	var upperIntersection;
	var anchorAngle;

	function stretch( coordArr, dy ) {
		return jQuery.map( coordArr, function( coord, index ){
			if ( index === 0 ) {
				var dx = dy / Math.tan( KhanUtil.toRadians( anchorAngle ) );
				coord += dx;
			}
			if ( index === 1 ) {
				coord += dy;
			}
			return coord;
		});
	}

	function labelAngle( coordArr, angles, color, label ) {
		var graph = KhanUtil.currentGraph;
        var measure = (angles[ 1 ] - angles[ 0 ])
        var bisect = ( angles[ 0 ] + angles[ 1 ] ) / 2;

        var radius = 0.6

        if ( measure < 60 ) { // control for angle label getting squeezed between intersecting lines
            radius /= Math.sin( KhanUtil.toRadians ( measure ) );
        }

		var coords = jQuery.map( coordArr, function( coord, index ) {
			if ( index === 0 ) { // x-coordinate
				return coord + radius * Math.cos( KhanUtil.toRadians( bisect ) );
			} else { // y-coordinate
				return coord + radius * Math.sin( KhanUtil.toRadians( bisect ) );
			}
		});

		graph.label( coords, label.text, label.placement, { color: color } );
	}

	this.draw = function() {
		var graph = KhanUtil.currentGraph;
		graph.line( [ x1, y1 ], [ x2, y2 ] );
		graph.line( [ x1, y1 + distance ], [ x2, y2 + distance ] );
	};

	this.drawTransverse = function( angleDeg ) {
		anchorAngle = angleDeg;
		var graph = KhanUtil.currentGraph;
		var width = distance / Math.tan( KhanUtil.toRadians ( anchorAngle ) );
		var lowerX = x1 + ( ( x2 - x1 ) - width ) / 2;
		var upperX = lowerX + width;
		lowerIntersection = [ lowerX, y1 ];
		upperIntersection = [ upperX, y1 + distance ];
		graph.line( stretch( lowerIntersection, -0.8 ), stretch( upperIntersection, 0.8 ) );
	};

	this.drawAngle = function( index, label, color ) {

		var graph = KhanUtil.currentGraph,
			radius = 0.5,
			args, angles;

		color || ( color = "#6495ED" );
		index = ( index + 8 ) % 8;
		if ( index < 4 ) {
			args = [ lowerIntersection, radius ];
		} else {
			args = [ upperIntersection, radius ];
		}

		var labelPlacement;
		switch( index % 4 ) {
			case 0: // Quadrant 1
				angles = [ 0, anchorAngle ];
				labelPlacement = "right";
				break;
			case 1: // Quadrant 2
				angles = [ anchorAngle, 180 ];
				labelPlacement = "left";
				break;
			case 2: // Quadrant 3
				angles = [ 180, 180 + anchorAngle ];
				labelPlacement = "left";
				break;
			case 3: // Quadrant 4
				angles = [ 180 + anchorAngle, 360 ];
				labelPlacement = "right";
				break;
		}
		jQuery.merge( args, angles );

		graph.style({ stroke: color}, function() {
			graph.arc.apply( graph, args );
			if ( label ) {
				var labelOptions = { text: label, placement: labelPlacement};

				if ( typeof label === "boolean" ) {
					labelOptions.text = (angles[1] - angles[0]) + "^\\circ";
				}

				labelAngle( args[ 0 ], angles, color, labelOptions );
			}
		});
	};

	this.drawVerticalAngle = function( index, label, color ) {
		index = ( index + 8 ) % 8;
		var vert = ( index + 2 ) % 4;
		if ( index >=4 ) {
			vert += 4;
		}
		this.drawAngle( vert, label, color );
	};

	this.drawAdjacentAngles = function( index, label, color ) {
		index = ( index + 8 ) % 8;
		var adj1 = ( index + 1 ) % 4;
		var adj2 = ( index + 3 ) % 4;
		if ( index >= 4 ) {
			adj1 += 4;
			adj2 += 4;
		}
		this.drawAngle( adj1, label, color );
		this.drawAngle( adj2, label, color );
	};
}

function Chart( data, pos ) {
	var graph = KhanUtil.currentGraph;
	this.transformX = d3.scale.ordinal().domain( data.ordinals ).rangeBands( [ pos.lx, pos.lx + pos.width ], 0.75 );
	this.transformY = d3.scale.linear().domain( [ data.min, data.max ] ).range( [ pos.ly, pos.ly + pos.height ] );

	this.draw = function() {
		// Draw axes
		graph.style({ stroke: "#ccc"});
		graph.line( [ pos.lx, pos.ly ], [ pos.lx + pos.width, pos.ly ] );
		graph.line( [ pos.lx, pos.ly ], [ pos.lx, pos.ly + pos.height ] );

		// Draw data points
		for ( var i = 0; i < data.ordinals.length; i++ ) {
			this.drawDataPoint( i, "#aaa" );
		}

		// Draw ticks
		graph.style({ "stroke-width": 1 });
		var ticks = this.transformY.ticks( data.tickCount );
		for ( var i = 0; i < ticks.length; i++ ) {
			var tick = ticks[ i ];
			graph.line( [ pos.lx - 0.1, this.transformY( tick ) ], [ pos.lx + 0.1, this.transformY( tick ) ] );
			graph.label( [ pos.lx, this.transformY( tick ) ], "\\small{" + tick + "}", "left" );
		}
	};

	this.highlightDataPoint = function( index, color ) {
		this.drawDataPoint( index, color );
	}

	this.labelDataPoint = function( index, color ) {
		color = color || KhanUtil.BLUE;
		var val = data.values[ index ];
		var x = this.transformX( data.ordinals[ index ] );
		var y = this.transformY( val );
		graph.label( [ x, y ], "\\text{" + val + "}", "above", { color: color } );
		graph.style ({ "stroke-dasharray": "-", "stroke-width": 1 });
		graph.line( [ pos.lx, y ], [ x, y ]);
	}
}

function LineChart( data, pos ) {
	var graph = KhanUtil.currentGraph;
	this.base = Chart;
	this.base( data, pos );
	var prevPoint = null;

	this.drawDataPoint = function( index, color ) {
		color = color || KhanUtil.BLUE;
		graph.style({ stroke: color, fill: color });
		var ord = data.ordinals[ index ];
		var x = this.transformX( ord );
		var y = this.transformY( data.values[ index ] );
		var coord = [ x, y ];
		graph.circle( [ x, y ], 0.1 );
		if ( prevPoint ) {
			graph.line( prevPoint, coord );
		}
		prevPoint = coord;
		graph.label( [ x, this.transformY( data.min ) ], "\\text{" + ord + "}", "below" );
	}

	this.highlightDataPoint = function( index, color ) {
		prevPoint = null;
		this.drawDataPoint( index, color );
	}
}

function BarChart( data, pos ) {
	var graph = KhanUtil.currentGraph;
	this.base = Chart;
	this.base( data, pos );

	this.drawDataPoint = function( index, color ) {
		color = color || KhanUtil.BLUE;
		graph.style({ stroke: color, "stroke-width": 10 });
		var ord = data.ordinals[ index ];
		var x = this.transformX( ord );
		var bottomCoord = [ x, this.transformY( data.min ) ];
		graph.line( bottomCoord, [ x, this.transformY( data.values[ index ] ) ] );
		graph.label( bottomCoord, "\\text{" + ord + "}", "below" );
	};
}

function drawComplexChart( radius, denominator ) {
	var graph = KhanUtil.currentGraph;
	var safeRadius = radius * Math.sqrt(2);
	var color = "#ddd";

	// Draw lines of complex numbers with same angle and
	// circles of complex numbers with same radius to help the intuition.
	
	graph.style({
		strokeWidth: 1.0
	});

	for (var i = 1; i <= safeRadius; i++) {
		graph.circle( [0, 0], i, {
			fill: "none",
			stroke: color 
		});
	}

	for (var i = 0; i < denominator; i++) {
		var angle = i * 2 * Math.PI / denominator;
		if (denominator % 4 === 0 && i % (denominator / 4) != 0) { // Don't draw over axes.
			graph.line( [ 0, 0 ], [ Math.sin( angle ) * safeRadius, Math.cos( angle ) * safeRadius ], {
				stroke: color
			});
		}
	}

	graph.label( [ radius, 0.5 ], "Re", "left");
	graph.label( [ 0.5, radius - 1 ], "Im", "right");
}

function ComplexPolarForm( angleDenominator, maxRadius, euler ) {
	var denominator = angleDenominator;
	var maximumRadius = maxRadius;
	var angle = 0, radius = 1;
	var circle;
	var useEulerForm = euler;

	this.update = function ( newAngle, newRadius ) {
		angle = newAngle;
		while ( angle < 0 ) angle += denominator;
		angle %= denominator;

		radius = Math.max( 1, Math.min( newRadius, maximumRadius ) ); // keep between 0 and maximumRadius...

		this.redraw();
	}

	this.delta = function ( deltaAngle, deltaRadius ) {
		this.update( angle + deltaAngle, radius + deltaRadius );
	}

	this.getAngleNumerator = function () {
		return angle;
	}

	this.getAngleDenominator = function () {
		return denominator;
	}

	this.getAngle = function () {
		return angle * 2 * Math.PI / denominator;
	}

	this.getRadius = function () {
		return radius;
	}

	this.getRealPart = function () {
		return Math.cos( this.getAngle() ) * radius;
	}

	this.getImaginaryPart = function () {
		return Math.sin( this.getAngle() ) * radius;
	}

	this.getUseEulerForm = function () {
		return useEulerForm;
	}

	this.plot = function () {
		circle = KhanUtil.currentGraph.circle( [ this.getRealPart(), this.getImaginaryPart() ], 1/4, {
			fill: KhanUtil.ORANGE,
			stroke: "none"
		});
	},
	
	this.redraw = function () {
		if ( circle ) {
			circle.remove();
		}
		this.plot();
	}
}

function updateComplexPolarForm( deltaAngle, deltaRadius ) {
	KhanUtil.currentGraph.graph.currComplexPolar.delta( deltaAngle, deltaRadius );
	redrawComplexPolarForm();
}

function redrawComplexPolarForm( angle, radius ) {
	var graph = KhanUtil.currentGraph;
	var storage = graph.graph;
	var point = storage.currComplexPolar;
	point.redraw();

	if ( typeof radius === "undefined" ) {
		radius = point.getRadius();
	}
	if ( typeof angle === "undefined" ) {
		angle = point.getAngleNumerator();
	}

	angle *= 2 * Math.PI / point.getAngleDenominator();

	var equation = KhanUtil.polarForm( radius, angle, point.getUseEulerForm() );

	jQuery( "#number-label" ).html( "<code>" + equation + "</code>" ).tmpl();
	jQuery( "#current-radius" ).html( "<code>" + radius + "</code>" ).tmpl();
	jQuery( "#current-angle" ).html( "<code>" + KhanUtil.piFraction( angle, true ) + "</code>" ).tmpl();
}
