jQuery.extend(KhanUtil, {
	Polynomial: function( minDegree, maxDegree, coefs, variable, name ) {
		var term = function( coef, vari, degree ) {

			// sort of a weird error behavior
			if ( typeof coef === "undefined" || coef === 0 ) {
				return null;
			}

			if ( degree === 0 ) {
				return coef;
			} else if ( degree === 1 ) {
				return [ "*", coef, vari ];
			} else {
				return [ "*", coef, [ "^", vari, degree ] ];
			}

		};

		// inverse of term.	Given an expression it returns the coef and degree.
		// calculus needs this for hints
		var extractFromExpr = function ( expr ){
			var coef,degree;
			if ( typeof expr === "number" ){
				coef = expr;
				degree = 0;
			} else if (jQuery.isArray( expr ) && !jQuery.isArray( expr[2] )){
				coef = expr[1];
				degree = 1;
			} else if (jQuery.isArray( expr ) && jQuery.isArray( expr[2] )){
				coef = expr[1];
				degree = expr[2][2];
			}
			return {
				coef: coef,
				degree: degree
			};
		};

		// These seem royally useless to me
		if ( maxDegree >= minDegree ) {
			this.minDegree = minDegree;
			this.maxDegree = maxDegree;
		} else {
			this.minDegree = maxDegree;
			this.maxDegree = minDegree;
		}

		this.coefs = coefs || KhanUtil.randCoefs( this.minDegree, this.maxDegree );

		this.variable = (typeof variable !== "undefined") ? variable : "x";

		this.name = name || "f";

		this.findMaxDegree = function( coefs ) {
			if ( !coefs ) {
				for ( var i = this.maxDegree; i >= this.minDegree; i-- ) {
					if ( this.coefs[i] !== 0 ) {
						return i;
					}
				}
			} else {
				for ( var i = coefs.length - 1; i >= 0; i-- ) {
					if ( coefs[i] !== 0 ) {
						return i;
					}
				}
				return -1;
			}
		};

		this.findMinDegree = function( coefs ) {
			if ( !coefs ) {
				for ( var i = this.minDegree; i <= this.maxDegree; i++ ) {
					if ( this.coefs[i] !== 0 ) {
						return i;
					}
				}
			} else {
				for ( var i = 0; i < coefs.length; i++ ) {
					if ( coefs[i] !== 0 ) {
						return i;
					}
				}
				return -1;
			}
		};

		this.expr = function( vari ) {
			if ( typeof vari === "undefined" ) {
				vari = this.variable;
			}

			var expr = ["+"];

			for ( var i = this.maxDegree; i >= this.minDegree; i-- ) {
				var theTerm = term( this.coefs[i], vari, i );

				if ( theTerm != null ) {
					expr.push( theTerm );
				}
			}

			return expr;
		};

		this.getNumberOfTerms = function() {

			// -1 as the first term in the expression for a polynomial is always a "+"
			return this.expr().length - 1 ;

		};

		this.getCoefAndDegreeForTerm = function( termIndex ) {

			//returns the coef and degree for a particular term
			var numberOfTerms = this.getNumberOfTerms();

			//mod twice to always get positive
			termIndex = ( ( termIndex % numberOfTerms ) + numberOfTerms ) % numberOfTerms;

			//upshift by one due to "+" sign at the front of the expression
			return extractFromExpr( this.expr()[ termIndex + 1 ] );

		};

		this.text = function() {
			return KhanUtil.expr( this.expr( this.variable ) );
		};

		this.toString = this.text;

		this.hintEvalOf = function( val ) {
			return KhanUtil.expr( this.expr( val ) );
		};

		this.evalOf = function( val ) {
			return KhanUtil.expr( this.expr( val ), true );
		};

		this.hint = function( val ) {
			var hints = [];
			hints.push( "<p><code>" + this.name+"("+val+") = " +
				this.hintEvalOf( val ) + "</code></p>" );
			hints.push( "<p><code>" + this.name+"("+val+") = " +
				this.evalOf( val ) + "</code></p>" );

			return hints;
		};

		// Adds two polynomials
		// It assumes the second polynomial's variable is the same as the first polynomial's
		// Does not change the polynomials, returns the result
		this.add = function( polynomial ) {
			var coefs = [];
			var minDegree = Math.min( this.minDegree, polynomial.minDegree );
			var maxDegree = Math.max( this.maxDegree, polynomial.maxDegree );

			for ( var i = minDegree; i <= maxDegree; i++ ) {
				var value = 0;

				value += i <= this.maxDegree ? this.coefs[ i ] : 0;
				value += i <= polynomial.maxDegree ? polynomial.coefs[ i ] : 0;

				coefs[ i ] = value;
			}

			return new KhanUtil.Polynomial(minDegree, maxDegree, coefs, this.variable );
		};

		// Subtracts polynomial from this
		// It assumes the second polynomial's variable is the same as the first polynomial's
		// Does not change the polynomials, returns the result
		this.subtract = function( polynomial ) {
			return this.add( polynomial.multiply(-1) )
		}

		// Multiply a polynomial by a number or other polynomial
		this.multiply = function( value ) {
			var coefs = [];
			if ( typeof value === "number" ) {

				for ( var i = 0; i < this.coefs.length; i++ ) {
					coefs[ i ] = this.coefs[ i ] * value;
				}

				return new KhanUtil.Polynomial( this.minDegree, this.maxDegree, coefs, this.variable );

			// Assume if it's not a number it's a polynomial
			} else {
				for ( var i = this.minDegree; i <= this.maxDegree; i++ ) {
					if ( this.coefs[ i ] === 0 ) {
						continue;
					}
					for ( var j = value.minDegree; j <= value.maxDegree; j++ ) {
						if ( value.coefs[ j ] === 0 ) {
							continue;
						}

						var coef = this.coefs[ i ] * value.coefs[ j ];

						if ( coefs[ i + j ] === undefined ) {
							coefs[ i + j ] = coef;
						} else {
							coefs[ i + j ] += coef;
						}
					}
				}

				// Fill in any missing values of coefs with 0s
				for ( var i = 0; i < coefs.length; i++ ) {
					if ( coefs[ i ] === undefined ) {
						coefs[ i ] = 0;
					}
				}

				return new KhanUtil.Polynomial( Math.min( this.minDegree, value.minDegree ), coefs.length, coefs, this.variable );
			}
		}

		return this;
	},

	CompositePolynomial: function( minDegree, maxDegree, coefs, variable, name,
			composed, composedCoef ) {
		var base = new KhanUtil.Polynomial(
			minDegree, maxDegree, coefs, variable, name );

		jQuery.extend(this, base);

		if ( !composedCoef ) {
			composedCoef = KhanUtil.randRangeNonZero( -5, 5 );
		}
		var composedFunc = composed.name+"("+this.variable+")";

		var tackOn = function( expr, tack ) {
			expr = jQuery.merge( [], expr );

			if ( expr[0] === "+" ) {
				expr.push( tack );
			} else {
				expr = [ "+", expr, tack ];
			}

			return expr;
		};

		this.expr = function( vari ) {
			return tackOn( base.expr( vari ), ["*", composedCoef, composedFunc] );
		};

		this.text = function() {
			return KhanUtil.expr( this.expr( this.variable ) );
		};

		this.toString = this.text;

		this.hintEvalOf = function( val, evalInner ) {
			if ( evalInner ) {

				return KhanUtil.expr( tackOn( base.expr( val ),
					["*", composedCoef, composed.evalOf( val )] ) );

			} else {

				return KhanUtil.expr( tackOn( base.expr( val ),
					["*", composedCoef, composed.name+"("+val+")"] ) );

			}
		};

		this.evalOf = function( val ) {
			return base.evalOf( val ) + composedCoef * composed.evalOf( val );
		};

		this.hint = function( val ) {
			var hints = [];
			hints.push( "<p><code>" + this.name + "(" + val + ") = " +
				this.hintEvalOf(val) + "</code></p>" );

			var composedFuncWithVal = composed.name+"("+val+")";

			hints.push( "<p>To solve for the value of <code>" + this.name + "</code>,"
				+ "we need to solve for the value of <code>"
				+ composedFuncWithVal + "</code>.</p>" );

			hints = hints.concat( composed.hint( val ) );

			hints.push( "<p>That means <code>" + this.name + "(" + val + ") = " +
				this.hintEvalOf(val, true) + "</code></p>" );

			hints.push( "<p><code>" + this.name+"("+val+") = " +
				this.evalOf( val ) + "</code></p>" );

			return hints;

		};

		return this;

	},

	randCoefs: function randCoefs( minDegree, maxDegree ) {
		var coefs = [];
		var allZero = true;

		for ( var i = maxDegree; i >= minDegree; i-- ) {
			coefs[i] = KhanUtil.randRange( -7, 7 );
			allZero = allZero && coefs[i] === 0;
		}

		return allZero ? randCoefs( minDegree, maxDegree ) : coefs;
	}
});
