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
			var base = KhanUtil.roundTowardsZero( start + i );
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
			stroke: "white",
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
	}
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
	}

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

				obj.animate( { opacity: .25 }, 500, ">" );
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
					
					obj.animate( { opacity: .5 }, 500, ">" );
					
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

	this.set.attr( { opacity: .5 } );

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
	}

	this.drawLabels = function(){
		for( var x = 1; x < 13; x++ ){
			this.set.push( this.graph.label( [ 0.7 * this.radius *  Math.sin( 2 * Math.PI * x/12  ), 0.7 * this.radius * Math.cos( 2 * Math.PI * x/12 ) ], x  ) );
		}
		return this.set;
	}
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
