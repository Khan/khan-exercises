// Temporary not really following convention file, see #160

function numberLine( start, end, step, x, y ) {
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
		graph.label( [x + i, y - 0.2], (start + i).toFixed(decPlaces), "below", { labelDistance: 3 } );
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

function rectchart( divisions, colors, radius ) {
	var graph = KhanUtil.currentGraph;
	var set = graph.raphael.set();

	var sum = 0;
	jQuery.each( divisions, function( i, slice ) {
		sum += slice;
	} );

	var partial = 0;
	jQuery.each( divisions, function( i, slice ) {
		var x = partial / sum, w = slice / sum;
		set.push( graph.path([ [x, 0], [x + w, 0], [x + w, 1], [x, 1] ], {
			stroke: "none",
			fill: colors[i]
		} ) );
		partial += slice;
	} );

	for ( var i = 0; i <= sum; i++ ) {
		var x = i / sum;
		set.push( graph.line( [x, 0], [x, 1], { stroke: "#fff" } ) );
	}

	return set;
}

//set up our object for dragging
function dragStart() {
	if ( !this.pro.draggable() ) return;
	var i;
	//store the starting point for each item in the set
	for ( i=0; i < this.pro.set.items.length; i++ ) {
		var obj = this.pro.set.items[i];
		
		obj.ox = 0;
		obj.oy = 0;

		obj.animate( { opacity: .25 }, 500, ">" );
	}
}

//clean up after dragging
function dragStop() {
	if ( !this.pro.draggable() ) return;
	var i;
	//remove the starting point for each of the objects
	for ( i=0; i < this.pro.set.items.length; i++ ) {
		var obj = this.pro.set.items[i];
		
		delete(obj.ox);
		delete(obj.oy);

		obj.animate( { opacity: .5 }, 500, ">" );
	}
}

//take care of moving the objects when dragging
function dragMove( dx, dy ) {
	if ( !this.pro.draggable() ) return;
	var i;
	//reposition the objects relative to their start position
	for ( i = 0; i < this.pro.set.items.length; i++ ) {
		var obj = this.pro.set.items[i],
		trans_x = dx - obj.ox,
		trans_y = dy - obj.oy;
		
		obj.translate( trans_x, trans_y );
		
		obj.ox = dx;
		obj.oy = dy;
	}
}

function Rotator( center, r, pro ) {
	var graph = KhanUtil.currentGraph;
	this.set = graph.raphael.set();

	var arcDragStart = function() {
		arcDragMove.call( this, 0, 0 );
	};

	var arcDragStop = function() {

	};

	var arcDragMove = function( dx, dy ) {
		// mildly screwed up at the moment, TODO add dragging
		// var angle = Math.atan2( dy, dx ) * 180 / Math.PI;
		// pro.rotate( angle * -1, true );
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

	jQuery([ this.downArrow.node, this.upArrow.node ]).css( "cursor", "hand" );

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

function Protractor( center, r ) {
	var graph = KhanUtil.currentGraph;
	this.set = graph.raphael.set();

	this.cx = center[0];
	this.cy = center[1];
	var lineColor = "#789";

	this.set.push( graph.arc( [this.cx, this.cy], r, 0, 180, { fill: "#b0c4de", stroke: lineColor } ) );

	this.getRotation = function() {
		var t = this.set[0].transformations[0];
		if ( t ) {
			return parseFloat( t.substring( 7,
											t.indexOf( " " ) ) );
		} else {
			return 0;
		}
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
	
	this.set.push( graph.arc( [this.cx, this.cy], r - 1.1, 0, 180, { fill: "none", stroke: lineColor } ) );
	for ( var angle = 0; angle <= 180; angle += 10 ) {
		this.drawAngle( angle );
	}
	this.set.drag( dragMove, dragStart, dragStop );
	jQuery( jQuery.map( this.set, function( el ) { return el.node; } ) ).css( "cursor", "move" );
	
	this.rotator = new Rotator( [this.cx, this.cy], r, this );
	this.set.push( this.rotator.set );

	this.set.attr( { opacity: .5 } );

	var pro = this;
	jQuery.each( this.set, function( index, el ) {
		// custom attribute so we can rotate the whole set from dragging any element
		el.pro = pro;
	});

	// unscaled center point for working directly with raphael
	this.getCenter = function() {
		return [this.set[0].attrs.path[0][1] - this.set[0].attrs.path[1][1],
				this.set[0].attrs.path[0][2]];
	};

	this.rotate = function( offset, absolute ) {
		var c = this.getCenter(),
		rotation = this.getRotation();

		if ( typeof absolute !== "undefined" && absolute ) {
			rotation = 0;
		}

		this.set.rotate( rotation + offset, c[0], c[1] );
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

	// Raphael doesn't let us unbind drag events
	this.draggable = function( dble ) {
		if ( typeof dble === "undefined" ) {
			return this._draggable;
		} else {
			this._draggable = dble;
		}
		return this;
	};
	this.draggable( true );

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

	return this;
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
