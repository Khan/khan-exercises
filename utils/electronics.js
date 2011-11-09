( function () {
	var circuitSymbolClass =  function( path, halfWidth ) {
		var rtn = function( p1, p2 ) {
			this.graph = KhanUtil.currentGraph;
			this.center = [ ( p1[0] + p2[0] ) / 2, ( p1[1] + p2[1] ) / 2 ];
			this.rotation = Math.atan2( p2[1] - p1[1], p2[0] - p1[0] ) * 180 / Math.PI + 180;
			while( this.rotation < 0 ) {
				this.rotation += 360;
			}
			this.length = Math.sqrt( ( p2[0] - p1[0] ) * ( p2[0] - p1[0] ) + ( p2[1] - p1[1] ) * ( p2[1] - p1[1] ) );
			this.symbol = this.graph.raphael.set();
			this.symbol.push( this.graph.raphael.path( "M" + this.length / -2 + ",0 " + this.path + " L" + this.length / 2 + ",0" ) );
			this.transformElement( this.symbol );

			return this;
		};
		rtn.prototype = {
			path: path,
			halfWidth: halfWidth,
			transformElement: function( e ) {
				var scaledCenter = this.graph.scalePoint( this.center );
				var scale = this.graph.scaleVector(1);
				e.scale( scale[0], scale[1], 0, 0 );
				e.translate( scaledCenter[0], scaledCenter[1] );
				e.rotate( this.rotation, scaledCenter[0], scaledCenter[1] );
			},

			setLabel: function( text, latex ) {
				if( this.label ) {
					this.label.remove();
				}
				if( this.rotation % 180 < 10 || this.rotation % 180 > 170 ) {
					this.label = this.graph.label( [ this.center[0], this.center[1] + this.halfWidth ], text, "above", latex );
				} else if( this.rotation % 180 > 80 && this.rotation % 180 < 100 ) {
					this.label = this.graph.label( [ this.center[0] + this.halfWidth, this.center[1] ], text, "right", latex );
				} else if( this.rotation % 180 < 90 ) {
					this.label = this.graph.label( [ this.center[0] - this.halfWidth, this.center[1] + this.halfWidth ], text, "below right", latex );
				} else {
					this.label = this.graph.label( [ this.center[0] + this.halfWidth, this.center[1] + this.halfWidth ], text, "above right", latex );
				}
			},

			showCurrent: function( text, latex ) {
				// TODO: Figure out which side of symbol arrow should be placed
				if( this.currentLabel ) {
					this.currentLabel.remove;
				} else {
					var arrow = this.graph.raphael.path( "M" + this.length / -2.5 + ","+this.halfWidth + "L " + this.length / 2.5 + ","+this.halfWidth+" l-0.0625, -0.0625 0, 0.125 0.0625, -0.0625" );
					this.transformElement( arrow );
					this.symbol.push( arrow );
				}
				if( this.rotation % 180 < 10 || this.rotation % 180 > 170 ) {
					this.currentLabel = this.graph.label( [ this.center[0], this.center[1] - this.halfWidth ], text, "below", latex );
				} else if( this.rotation % 180 > 80 && this.rotation % 180 < 100 ) {
					this.currentLabel = this.graph.label( [ this.center[0] - this.halfWidth, this.center[1] ], text, "left", latex );
				} else if( this.rotation % 180 < 90 ) {
					this.currentLabel = this.graph.label( [ this.center[0] + this.halfWidth, this.center[1] - this.halfWidth ], text, "above left", latex );
				} else {
					this.currentLabel = this.graph.label( [ this.center[0] - this.halfWidth, this.center[1] - this.halfWidth ], text, "below left", latex );
				}
			}
			// function to show current
		};
		return rtn;
	};

	jQuery.extend(KhanUtil, {
		/* Returns a resistor value in ohms selected uniformly from the standard
		 * set of 5% tolerance resistors that can be bought off the shelf */
		randResistor: function() {
			var mantissa = [1.0, 1.1, 1.2, 1.3, 1.5, 1.6, 1.8, 2.0, 2.2, 2.4,
							2.7, 3.0, 3.3, 3.6, 3.9, 4.3, 4.7, 5.1, 5.6, 6.2,
							6.8, 7.5, 8.2, 9.1];
			mantissa = KhanUtil.randFromArray( mantissa );
			var exponent = KhanUtil.randRange( 0, 6 ); 
			return mantissa * Math.pow( 10, exponent );
		},

		/* Typesets a quantity, adjusting the base unit by factors of 1000 as
		 * necessary.  Unit must be a base unit (i.e. A instead of mA ) */
		formatQuantity: function( amount, unit, digits ) {
			if( amount >= 1e12 ) {
				amount /= 1e12;
				unit = "T" + unit;
			} else if ( amount >= 1e9 ) {
				amount /= 1e9;
				unit = "G" + unit;
			} else if ( amount >= 1e6 ) {
				amount /= 1e6;
				unit = "M" + unit;
			} else if ( amount >= 1e3 ) {
				amount /= 1e3;
				unit = "k" + unit;
			} else if ( amount >= 1 ) {
				// no adjustment necessary
			} else if ( amount >= 1e-3 ) {
				amount *= 1e3;
				unit = "m" + unit;
			} else if ( amount >= 1e-6 ) {
				amount *= 1e6;
				unit = "\\mu " + unit;
			} else if ( amount >= 1e-9 ) {
				amount *= 1e9;
				unit = "n" + unit;
			} else {
				amount *= 1e12;
				unit = "p" + unit;
			}

			return KhanUtil.roundToSignificant( digits, amount ) + "\\,\\mathrm{" + unit + "}";
		},

		Resistor: circuitSymbolClass( "L-0.25,0 l0.03125,0.0625, 0.0625,-0.125 0.0625,0.125 0.0625, -0.125 0.0625,0.125 0.0625, -0.125 0.0625,0.125 0.0625, -0.125 0.03125,0.0625", 0.10 ),
		Battery: circuitSymbolClass( "L-0.0625,0 M-0.0625,-0.125 L-0.0625,0.125 M0.0625,-0.25 L0.0625,0.25 M0.0625,0", 0.27 ),
		Wire: circuitSymbolClass( "", 0.05 )
	});
} ) ();
