jQuery.extend(KhanUtil, {
	Polynomial: function( minDegree, maxDegree, coefs, variable, name ) {
		var term = function( coef, vari, degree ) {

			// sort of a weird error behavior
			if ( typeof coef === "undefined" || coef === 0 ) {
				return null;
			}

			if ( degree == 0 ) {
				return coef;
			} else if ( degree == 1 ) {
				return ["*", coef, vari];
			} else {
				return ["*", coef, ["^", vari, degree]];
			}

		};

		//inverse of term.	Given an expression it returns the coef and degree. 
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

		this.minDegree = minDegree;
		this.maxDegree = maxDegree;

		this.coefs = coefs || KhanUtil.randCoefs( minDegree, maxDegree );

		this.variable = (typeof variable !== "undefined") ? variable : "x";

		this.name = name || "f";

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

			if ( typeof termIndex === "number" && termIndex >= 0 
					&& termIndex <= numberOfTerms ) {

				//upshift by one due to "+" sign at the front of the expression
				return extractFromExpr( this.expr()[ termIndex + 1 ] );

			}

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
			var hint = "<p><code>" + this.name+"("+val+") = " + 
				this.hintEvalOf( val ) + "</code></p>";""
			hint += "<p><code>" + this.name+"("+val+") = " + 
				this.evalOf( val ) + "</code></p>";

			return hint;
		};

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
		}

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

			var hint = "<p><code>" + this.name+"("+val+") = " + 
				this.hintEvalOf(val) + "</code></p>";

			var composedFuncWithVal = composed.name+"("+val+")";

			hint += "<p>To solve for the value of <code>" + this.name + "</code>,"
				+ "we need to solve for the value of <code>"
				+ composedFuncWithVal + "</code>.</p>";

			hint += composed.hint( val );

			hint += "<p>Okay, so <code>" + composedFuncWithVal+" = " + 
				composed.evalOf(val) + "</code>.</p>";

			hint += "<p>That means <code>" + this.name+"("+val+") = " + 
				this.hintEvalOf(val, true) + "</code></p>";

			hint += "<p><code>" + this.name+"("+val+") = " + 
				this.evalOf( val ) + "</code></p>";

			return hint;

		};

		return this;

	},

	randCoefs: function( minDegree, maxDegree ) {
		var coefs = [];
		for ( var i = maxDegree; i >= minDegree; i-- ) {
			coefs[i] = KhanUtil.randRange( -7, 7 );
		}
		return coefs;
	}
});
