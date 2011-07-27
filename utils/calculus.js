jQuery.extend(KhanUtil, {
	trigFuncs: ["sin", "cos", "tan"],
	ddxTrigFuncs: {
		"sin": function( expr ) {
			return ["cos", expr];
		},
		"cos": function( expr ) {
			return ["-", ["sin", expr]];
		},
		"tan": function( expr ) {
			return ["^", ["sec", expr], 2];
		}
	},

	generateFunction: function( variable ) {
		// Generate a differentiable expression object
		// {fofx, ddxF, wrongs}
		// x being the name of the variable we differentiate with respect to
		// ensure that the function isn"t just 0 as well
		var f;
		do {
			f = new ( KhanUtil.randFromArray( KhanUtil.CalcFunctions ) )( variable );
		} while (f.f === "0");
		return f;
	},

	generateSpecialFunction: function( variable ) {
		// Different emphasis from normal generateFunction
		// For the special_derivatives exercise
		var f;
		do {
			var r = KhanUtil.rand(10);
			if ( r < 2 ) { // 20% chance of power rule
				f = new KhanUtil.CalcFunctions[0]( variable );
			} else if ( r < 6 ) { // 40% chance of trig
				f = new KhanUtil.CalcFunctions[1]( variable );
			} else if ( r < 10 ) { // 40% chance of e^x / ln x
				f = new KhanUtil.CalcFunctions[3]( variable );
			}
		} while (f.f === "0");
		return f;
	},

	ddxPolynomial: function( poly ) {
		var ddxCoefs = [];

		for (var i = poly.maxDegree; i >= poly.minDegree; i--) {
			ddxCoefs[i - 1] = i * poly.coefs[i];
		}

		return new KhanUtil.Polynomial(poly.minDegree - 1, poly.maxDegree - 1, ddxCoefs, poly.variable);
	},

	// doesn't decrement exponents
	ddxPolynomialWrong1: function( poly ) {
		var ddxCoefs = [];

		for (var i = poly.maxDegree; i >= poly.minDegree; i--) {
			ddxCoefs[i] = i * poly.coefs[i];
		}

		return new KhanUtil.Polynomial( poly.minDegree, poly.maxDegree, ddxCoefs, poly.variable );
	},

	// increments negative exponents
	ddxPolynomialWrong2: function( poly ) {
		var ddxCoefs = [];

		for (var i = poly.maxDegree; i >= poly.minDegree; i--) {
			if (i < 0) {
				ddxCoefs[i + 1] = i * poly.coefs[i];
			} else {
				ddxCoefs[i - 1] = i * poly.coefs[i];
			}
		}

		return new KhanUtil.Polynomial( poly.minDegree, poly.maxDegree, ddxCoefs, poly.variable );
	},

	// reversed signs on all terms
	ddxPolynomialWrong3: function( poly ) {
		var ddxCoefs = [];

		for (var i = poly.maxDegree; i >= poly.minDegree; i--) {
			ddxCoefs[i - 1] = -1 * i * poly.coefs[i];
		}

		return new KhanUtil.Polynomial( poly.minDegree - 1, poly.maxDegree - 1, ddxCoefs, poly.variable );
	},

	// doesn't multiply coefficients
	ddxPolynomialWrong4: function( poly ) {
		var ddxCoefs = [];

		for (var i = poly.maxDegree; i >= poly.minDegree; i--) {
			ddxCoefs[i - 1] = poly.coefs[i];
		}

		return new KhanUtil.Polynomial( poly.minDegree - 1, poly.maxDegree - 1, ddxCoefs, poly.variable );
	},

	// original with flipped signs
	ddxPolynomialWrong5: function( poly ) {
		var ddxCoefs = [];

		for (var i = poly.maxDegree; i >= poly.minDegree; i--) {
			ddxCoefs[i] = poly.coefs[i] * -1;
		}

		return new KhanUtil.Polynomial( poly.minDegree, poly.maxDegree, ddxCoefs, poly.variable );
	},

	funcNotation: function( variable, index ) {
		variable = (typeof variable !== "undefined") ? variable : "x";
		var notations = [
			["y", "\\frac{dy}{d"+variable+"}", function ( term ) {
				return "y=" + term + " \\implies \\frac{dy}{d"+variable+"}";
			}],
			["f("+variable+")", "f'("+variable+")", function ( term ) {
				return "f'(" + term + ")";
			}],
			["g("+variable+")", "g'("+variable+")", function ( term ) {
				return "g'(" + term + ")";
			}],
			["y", "y'", function ( term ) {
				return "y=" + term + " \\implies y'";
			}],
			["f("+variable+")", "\\frac{d}{d"+variable+"}f("+variable+")", function ( term ) {
				return "f("+variable+")=" + term + " \\implies \\frac{d}{d"+variable+"}f("+variable+")";
			}],
			["a", "a'", function ( term ) {
				return "a=" + term + " \\implies a'";
			}],
			["a", "\\frac{da}{d"+variable+"}", function ( term ) {
				return "a=" + term + " \\implies \\frac{da}{d"+variable+"}";
			}]
		];
		var n_idx = (typeof index == "number" && index >= 0 && index < notations.length) ? index : KhanUtil.rand( notations.length );
		return {
			f: notations[n_idx][0],
			ddxF: notations[n_idx][1],
			diffHint: notations[n_idx][2]( "A" + variable + "^{n}" ) + "=n \\cdot A"+variable+"^{n-1}", //this is the overall hint in the notation of the problem
			diffHintFunction: notations[ n_idx ][ 2 ] //this is the hint function used by each hint.  It renders the hint per term in the appropriate format
		};
	},

	PowerRule: function(minDegree, maxDegree, coefs, variable, funcNotation ){
		if ( this instanceof KhanUtil.PowerRule ) { //avoid mistakenly calling without a new
			// power rule, polynomials
			var minDegree = (typeof minDegree == "number") ? minDegree : KhanUtil.randRange(-2, 2);
			var maxDegree = (typeof maxDegree == "number") ? maxDegree : KhanUtil.randRange(2, 4);
			var coefs = (typeof coefs == "object") ? coefs : KhanUtil.randCoefs(minDegree, maxDegree);
			var poly = new KhanUtil.Polynomial(minDegree, maxDegree, coefs, variable);

			this.f = poly.expr();
			this.ddxF = KhanUtil.ddxPolynomial(poly).expr();
			this.fText = KhanUtil.expr( this.f );
			this.ddxFText = KhanUtil.expr( this.ddxF );
			this.notation = (typeof funcNotation == "object") ? funcNotation : KhanUtil.funcNotation(variable);

			this.hints = [];

			for ( var i = 0; i < poly.getNumberOfTerms(); i = i + 1){
				var term = poly.getCoefAndDegreeForTerm( i );
				var ddxCoef = term.degree * term.coef;
				var ddxDegree = ( term.degree != 0 ) ? term.degree -1 : 0;
				var ddxCoefText = ( ddxCoef == 1 ) ? "" : ddxCoef + "";
				var ddxText = ( ddxDegree == 0 ) ? ddxCoef : ddxCoefText + poly.variable + ( (ddxDegree == 1) ? "" : "^{" + ddxDegree + "}" );

				this.hints [ i ] =	"\\dfrac{d (" + KhanUtil.expr( this.f[ i+1 ] )  + ")}{dx} \\implies " + term.degree + " \\cdot " + term.coef + poly.variable + "^{" + term.degree + "-1} = " + ddxText;
			}

			this.wrongs = [
				KhanUtil.ddxPolynomialWrong1(poly).expr(),
				KhanUtil.ddxPolynomialWrong2(poly).expr(),
				KhanUtil.ddxPolynomialWrong3(poly).expr(),
				KhanUtil.ddxPolynomialWrong4(poly).expr(),
				KhanUtil.ddxPolynomialWrong5(poly).expr()
			];

			// Remove empty choices, if any
			this.wrongs = jQuery.map( this.wrongs, function( value, index ) {
				if ( value.length > 1 ) {
					return [ value ];
				} else {
					return [];
				}
			} );

			this.wrongsText = jQuery.map(this.wrongs, function( value, index ) {
				return KhanUtil.expr( value );
			});

			return this;
		}else{
			return new KhanUtil.PowerRule();
		}
	},

	CalcFunctions: [
		function( variable ) {
			// power rule, polynomials
			var minDegree = KhanUtil.randRange(-2, 2);
			var maxDegree = KhanUtil.randRange(2, 4);
			return KhanUtil.PowerRule(minDegree, maxDegree, KhanUtil.randCoefs(minDegree, maxDegree), variable);
		},
		function( variable ) {
			// random trig func
			var idx = KhanUtil.rand(3); // 0 - 2 in trig funcs

			this.wrongs = [];

			this.wrongs[0] = ["sin", variable];
			this.wrongs[1] = ["csc", variable];
			this.wrongs[2] = ["sec", variable];
			this.wrongs[3] = ["tan", variable];
			this.wrongs[4] = ["-", ["sec", variable]];
			this.wrongs[5] = ["-", ["cos", variable]];

			this.f = [ KhanUtil.trigFuncs[idx], variable ];
			this.ddxF = KhanUtil.ddxTrigFuncs[ KhanUtil.trigFuncs[idx] ](variable);

			this.fText = KhanUtil.expr( this.f );
			this.ddxFText = KhanUtil.expr( this.ddxF );

			this.wrongsText = jQuery.map(this.wrongs, function( value, index ) {
				return KhanUtil.expr( value );
			});

			return this;
		},

		function( variable ) {
			// basic x^power, simplified version of polynomials in [0]
			// kept KhanUtil around mainly for easy wrong answer generation
			var maxDegree = KhanUtil.randRange(2, 6);
			var minDegree = maxDegree;

			var coefs = [];
			coefs[maxDegree] = 1;

			var poly = new KhanUtil.Polynomial(minDegree, maxDegree, coefs, variable);

			this.f = poly.expr();
			this.ddxF = KhanUtil.ddxPolynomial(poly).expr();

			this.wrongs = [
				KhanUtil.ddxPolynomialWrong1(poly).expr(),
				KhanUtil.ddxPolynomialWrong2(poly).expr(),
				KhanUtil.ddxPolynomialWrong3(poly).expr(),
				KhanUtil.ddxPolynomialWrong4(poly).expr(),
				KhanUtil.ddxPolynomialWrong5(poly).expr()
			];

			// Remove empty choices, if any
			this.wrongs = jQuery.map( this.wrongs, function( value, index ) {
				if ( value.length > 1 ) {
					return [ value ];
				} else {
					return [];
				}
			} );

			this.fText = KhanUtil.expr( this.f );
			this.ddxFText = KhanUtil.expr( this.ddxF );

			this.wrongsText = jQuery.map(this.wrongs, function( value, index ) {
				return KhanUtil.expr( value );
			});

			return this;
		},

		function( variable ) {
			// ln x and e^x, combined in one because these should not be too likely
			this.wrongs = [];

			if (KhanUtil.rand(2)) {
				this.wrongs[0] = ["frac", 1, ["ln", variable]];
				this.wrongs[1] = ["^", "e", variable];
				this.wrongs[2] = ["frac", 1, ["^", "e", variable]];
				this.wrongs[3] = ["ln", variable];
				this.wrongs[4] = ["frac", 1, ["^", variable, 2]];
				this.wrongs[5] = variable;

				this.f = ["ln", variable];
				this.ddxF = ["frac", 1, variable];
			} else {
				this.wrongs[0] = ["*", variable, ["^", "e", ["-", variable, 1]]];
				this.wrongs[1] = ["frac", 1, variable];
				this.wrongs[2] = ["*", variable, ["^", "e", variable]];
				this.wrongs[3] = ["^", "e", ["-", variable, 1]];
				this.wrongs[4] = ["^", ["-", "e", variable], variable];
				this.wrongs[5] = ["frac", "e", variable];

				this.f = ["^", "e", variable];
				this.ddxF = ["^", "e", variable];
			}

			this.fText = KhanUtil.expr( this.f );
			this.ddxFText = KhanUtil.expr( this.ddxF );

			this.wrongsText = jQuery.map(this.wrongs, function( value, index ) {
				return KhanUtil.expr( value );
			});

			return this;
		} ]
});
