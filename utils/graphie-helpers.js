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

function Rotator( center, r, pro ) {
	var graph = KhanUtil.currentGraph;
	this.set = graph.raphael.set();

	var arcDragStop = function() {

	};

	var arcDragMove = function( dx, dy ) {
		// mildly screwed up at the moment, TODO add dragging
		// var angle = Math.atan2( dy, dx ) * 180 / Math.PI;
		// pro.rotate( angle * -1, true );
	};

	var arcDragStart = function() {
		arcDragMove.call( this, 0, 0 );
	};

	this.set.push( graph.arc( center, r + 1, 150, 180, { "stroke": "#aab", "stroke-width": 20 } )
				   .drag( arcDragMove, arcDragStart, arcDragStop ) );
	
	this.downArrow = graph.path( [ [center[0]-(r+0.25), center[1]],
								  [center[0]-(r+1), center[1]-0.75],
								  [center[0]-(r+1.75), center[1]],
								  [center[0]-(r+0.75), center[1]]],
								{ "stroke-width": 0, "fill": "#aae" } );
	this.set.push( this.downArrow );

	this.upArrow = graph.path( [ [center[0]+(r+0.25)*Math.cos(5 * Math.PI / 6), center[1]+(r+0.25)*Math.sin(5 * Math.PI / 6)],
								 [center[0]+(r+1)*Math.cos(29 * Math.PI / 36), center[1]+(r+1)*Math.sin(29 * Math.PI / 36)], // tip of arrow at 145 degrees
								[center[0]+(r+1.75)*Math.cos(5 * Math.PI / 6), center[1]+(r+1.75)*Math.sin(5 * Math.PI / 6)] ],
							  { "stroke-width": 0, "fill": "#aae" } );
	this.set.push( this.upArrow );

	var RotatorHelp = function( center, r ) {
		var graph = KhanUtil.currentGraph;
		var set = graph.raphael.set();

		// down arrow
		set.push( graph.line( [center[0]-(r+4), center[1]+2-0.3],
							  [center[0]-(r+1)-0.6, center[1]-0.75+0.2],
							  { "stroke-width": 2, arrows: "->" } ) );

		// up arrow
		set.push( graph.line( [center[0]-(r+4), center[1]+2+0.3],
							  [center[0]+(r+1)*Math.cos(29 * Math.PI / 36)-0.8, center[1]+(r+1)*Math.sin(29 * Math.PI / 36)-0.2],
							  { "stroke-width": 2, arrows: "->" } ) );

		set.push( graph.label( [center[0]-(r+4), center[1]+2], "Click these to rotate!", "center", false,  { "stroke-width": 1, "font-size": 12, stroke: "black" } ) );

		jQuery(document).one( "mousedown", function( event ) {
			set.remove();
		});

		this.set = set;
		return this;
	};
	this.set.push( new RotatorHelp( center, r ).set );

	jQuery([ this.downArrow.node, this.upArrow.node ]).css( "cursor", "hand" );
	jQuery.each([ this.downArrow, this.upArrow ], function( i, el ) {
		el.hover(
			function( event ) {
				this.attr({ fill: "green" });
			},
			function( event ) {
				this.attr({ fill: "#aae" });
			});
	});

	this.rotationOn = function() {
		jQuery(this.upArrow.node).mousedown(function() {
			var iv = setInterval( function() { pro.rotate( 2 ); }, 50 );
			jQuery(document).one( "mouseup", function() {
				clearInterval( iv );
			});
		});

		jQuery(this.downArrow.node).mousedown(function() {
			var iv = setInterval( function() { pro.rotate( -2 ); }, 50 );
			jQuery(document).one( "mouseup", function() {
				clearInterval( iv );
			});
		});

		this.set.show();
	};

	this.rotationOff = function() {
		jQuery(this.upArrow.node).unbind( "mousedown" ).unbind( "mouseup" );
		jQuery(this.downArrow.node).unbind( "mousedown" ).unbind( "mouseup" );

		this.set.hide();
	};
	return this;
}

function Translator( center, r, pro ) {
	var graph = KhanUtil.currentGraph;
	this.set = graph.raphael.set();

	this.set.push( graph.line( [center[0]+1, center[1]-1], [center[0]+r-1, center[1]-1], { "stroke": "#aab", "stroke-width": 20 } ) );
	
	this.leftArrow = graph.path( [ [center[0]+1, center[1]-0.25],
								   [center[0]+0.25, center[1]-1],
								   [center[0]+1, center[1]-1.75]
								 ],
								{ "stroke-width": 0, "fill": "#aae" } );
	this.set.push( this.leftArrow );

	this.rightArrow = graph.path( [ [center[0]+r-1, center[1]-0.25],
									[center[0]+r-1+0.75, center[1]-1],
									[center[0]+r-1, center[1]-1.75]
								  ],
							  { "stroke-width": 0, "fill": "#aae" } );
	this.set.push( this.rightArrow );

	var TranslatorHelp = function( center, r ) {
		var graph = KhanUtil.currentGraph;
		var set = graph.raphael.set();

		set.push( graph.line( [center[0]+1, center[1]-4],
							  [center[0]+0.25, center[1]-1.5],
							  { "stroke-width": 2, arrows: "->" } ) );
		set.push( graph.line( [center[0]+r-1.5, center[1]-4],
							  [center[0]+r-1+0.5, center[1]-1.5],
							  { "stroke-width": 2, arrows: "->" } ) );

		set.push( graph.label( [center[0]+r/2-1+0.75, center[1]-4], "Click these to move!", "center", false,  { "stroke-width": 1, "font-size": 12, stroke: "black" } ) );

		jQuery(document).one( "mousedown", function( event ) {
			set.remove();
		});

		this.set = set;
		return this;
	};

	this.set.push( new TranslatorHelp( center, r ).set );

	jQuery([ this.leftArrow.node, this.rightArrow.node ]).css( "cursor", "hand" );
	jQuery.each([ this.leftArrow, this.rightArrow ], function( i, el ) {
		el.hover(
			function( event ) {
				this.attr({ fill: "green" });
			},
			function( event ) {
				this.attr({ fill: "#aae" });
			});
	});

	this.translationOn = function() {
		jQuery(this.leftArrow.node).mousedown(function() {
			var iv = setInterval( function() { pro.rotatedTranslate( -10 ); }, 50 );
			jQuery(document).one( "mouseup", function() {
				clearInterval( iv );
			});
		});

		jQuery(this.rightArrow.node).mousedown(function() {
			var iv = setInterval( function() { pro.rotatedTranslate( 10 ); }, 50 );
			jQuery(document).one( "mouseup", function() {
				clearInterval( iv );
			});
		});

		this.set.show();
	};

	this.translationOff = function() {
		jQuery(this.leftArrow.node).unbind( "mousedown" ).unbind( "mouseup" );
		jQuery(this.rightArrow.node).unbind( "mousedown" ).unbind( "mouseup" );

		this.set.hide();
	};
	return this;
}

function Protractor( center, r ) {
	var graph = KhanUtil.currentGraph;
	this.set = graph.raphael.set();

	this.cx = center[0];
	this.cy = center[1];
	var lineColor = "#789";

	var imgPos = graph.scalePoint([ this.cx - r, this.cy + r ]);
	this.set.push( graph.raphael.image( Khan.urlBase + "images/protractor.png", imgPos[0], imgPos[1], 322, 166 ) );
	
	this._rotation = 0;
	this.getRotation = function() {
		return this._rotation;
	};

	this.drawAngle = function( angle, rOffset, stroke, labelStroke ) {
		rOffset = rOffset || -1;
		stroke = stroke || lineColor;
		labelStroke = stroke || "#000";
		
		var an = angle - this.getRotation(),
		dx = Math.cos( Math.PI * an / 180 ),
		dy = Math.sin( Math.PI * an / 180 ),
		ex = (r + rOffset) * dx,
		ey = (r + rOffset) * dy,
		lx = (r + rOffset + 0.5) * dx,
		ly = (r + rOffset + 0.5) * dy;

		this.set.push( graph.line( [this.cx + dx, this.cy + dy], [this.cx + ex, this.cy + ey], { stroke: stroke } ) );
		this.set.push( graph.label( [this.cx + lx, this.cy + ly], angle, "center", false, { "stroke-width": 1, "font-size": 12, stroke: labelStroke } ) );
	};

	var pro = this;
	var setNodes = jQuery.map( this.set, function( el ) { return el.node; } );
	function makeTranslatable() {
		jQuery( setNodes ).css( "cursor", "move" );
		
		jQuery( setNodes ).mousedown( function( event ) {
			event.preventDefault();
			
			var i;
			//store the starting point for each item in the set
			for ( i=0; i < pro.set.items.length; i++ ) {
				var obj = pro.set.items[i];
				
				obj.ox = event.pageX;
				obj.oy = event.pageY;

				obj.animate( { opacity: 0.25 }, 500, ">" );
			}

			jQuery(document).mousemove( function( event ) {
				var i;
				//reposition the objects relative to their start position
				for ( i = 0; i < pro.set.items.length; i++ ) {
					var obj = pro.set.items[i],
					trans_x = event.pageX - obj.ox,
					trans_y = event.pageY - obj.oy;
					
					obj.translate( trans_x, trans_y );
					
					obj.ox = event.pageX;
					obj.oy = event.pageY;
				}
			});

			jQuery(document).one( "mouseup", function( event ) {
				var i;
				//remove the starting point for each of the objects
				for ( i=0; i < pro.set.items.length; i++ ) {
					var obj = pro.set.items[i];
					
					delete(obj.ox);
					delete(obj.oy);
					
					obj.animate( { opacity: 0.5 }, 500, ">" );
					
					jQuery(document).unbind("mousemove");
				}
			});
		});

		pro.translator.translationOn();
	}

	function makeUntranslatable() {
		jQuery( setNodes ).unbind();
		jQuery( setNodes ).css( "cursor", "auto" );

		pro.translator.translationOff();
	}
	
	this.rotator = new Rotator( [this.cx, this.cy], r, this );
	this.set.push( this.rotator.set );

	this.translator = new Translator( [this.cx, this.cy], r, this );
	this.set.push( this.translator.set );

	this.set.attr( { opacity: 0.5 } );

	jQuery.each( this.set, function( index, el ) {
		// custom attribute so we can rotate the whole set from dragging any element
		el.pro = pro;
	});

	// scaled center point for working directly with raphael
	this.getCenter = function() {
		return [this.set[0].attrs.x + 161,
				this.set[0].attrs.y + 161];
	};

	this.rotate = function( offset, absolute ) {
		var c = this.getCenter(),
		rotation = this.getRotation();

		if ( typeof absolute !== "undefined" && absolute ) {
			rotation = 0;
		}

		this.set.rotate( rotation + offset, c[0], c[1] );
		this._rotation = rotation + offset;
		return this;
	};

	this.translate = function( x, y, absolute ) {
		if ( absolute ) {
			this.cx = x;
			this.cy = y;
			
			var d = graph.scalePoint([ x, y ]),
			c = this.getCenter();

			this.set.translate( d[0] - c[0], d[1] - c[1] );
		} else {
			this.cx += x;
			this.cy += y;
			
			this.set.translate( x, y );
		}
		return this;
	};

	this.rotatedTranslate = function( k ) {
		k = k || 1;
		
		var rot = Math.PI * this.getRotation() / 180;
		
		var x = k * Math.cos( rot ),
		y = k * Math.sin( rot );

		return this.translate( x, y );
	};

	this.translatable = function( tble ) {
		if ( typeof tble === "undefined" ) {
			return this._translatable;
		} else {
			this._translatable = tble;
			if ( tble ) {
				makeTranslatable();
			} else {
				makeUntranslatable();
			}
		}
		return this;
	};
	this.translatable( true );

	this.rotatable = function( rble ) {
		if ( typeof rble === "undefined" ) {
			return this._rotatable;
		} else {
			this._rotatable = rble;
			if ( rble ) {
				this.rotator.rotationOn();
			} else {
				this.rotator.rotationOff();
			}
		}
		return this;
	};
	this.rotatable( true );

	this.set.translate( 0, 0 );

	return this;
}

function analogClock( hour, minute, radius, labelShown ){
	this.hour = hour;
	this.minute = minute;
	this.radius = radius;
	this.set = KhanUtil.currentGraph.raphael.set();

	this.graph = KhanUtil.currentGraph;
	this.draw = function(){
		for( var x = 0; x < 12; x++ ){
			this.set.push( this.graph.line( [ this.radius *  Math.sin( 2 * Math.PI * x/12  ), this.radius * Math.cos( 2 * Math.PI * x/12 ) ], [ 0.8 * this.radius * Math.sin( 2 * Math.PI * x/12 ), 0.8 * this.radius * Math.cos( 2 * Math.PI * x/12 ) ] ) );
		}

		this.set.push( this.graph.line( [ 0.45 * this.radius *  Math.sin( 2 * Math.PI * this.hour/12 + ( this.minute / 60 ) / 12 * 2 * Math.PI ), 0.45 * this.radius * Math.cos( 2 * Math.PI * this.hour/12 + ( this.minute / 60 ) / 12  * 2 * Math.PI ) ], [ 0, 0  ] ) );

		this.set.push( this.graph.line( [ 0.6 * this.radius *  Math.sin( ( this.minute / 60 ) * 2 * Math.PI ), 0.6 * this.radius * Math.cos(  ( this.minute / 60 ) * 2 * Math.PI ) ], [ 0, 0  ] ) );
		this.set.push( this.graph.circle( [ 0, 0 ], this.radius ) );
		this.set.push( this.graph.circle( [ 0, 0 ], this.radius/ 40 ) );
		if( labelShown ){
			this.drawLabels();
		}
		return this.set;
	};

	this.drawLabels = function(){
		for( var x = 1; x < 13; x++ ){
			this.set.push( this.graph.label( [ 0.7 * this.radius *  Math.sin( 2 * Math.PI * x/12  ), 0.7 * this.radius * Math.cos( 2 * Math.PI * x/12 ) ], x  ) );
		}
		return this.set;
	};
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

	function labelAngle( coordArr, angles, color ) {
		var graph = KhanUtil.currentGraph;
		var measure = ( angles[ 1 ] - angles[ 0 ] );
		var bisect = ( angles[ 0 ] + angles[ 1 ] ) / 2;
		var radius = 0.8;
		if ( measure < 90 ) {
			radius = 0.8 / Math.sin( KhanUtil.toRadians ( measure ) );
		}
		var coords = jQuery.map( coordArr, function( coord, index ) {
			if ( index === 0 ) {
				return coord + radius * Math.cos( KhanUtil.toRadians( bisect ) );
			} else {
				return coord + radius * Math.sin( KhanUtil.toRadians( bisect ) );
			}
		});
		graph.label( coords, measure + "^{\\circ}", "center", {color: color});
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

		switch( index % 4 ) {
			case 0:
				angles = [ 0, anchorAngle ];
				break;
			case 1:
				angles = [ anchorAngle, 180 ];
				break;
			case 2:
				angles = [ 180, 180 + anchorAngle ];
				break;
			case 3:
				angles = [ 180 + anchorAngle, 360 ];
				break;
		}
		jQuery.merge( args, angles );

		graph.style({ stroke: color}, function() {
			graph.arc.apply( graph, args );
			if ( label ) {
				labelAngle( args[ 0 ], angles, color );
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
