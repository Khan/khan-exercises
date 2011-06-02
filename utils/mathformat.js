jQuery.extend(KhanUtil, {
	fraction: function( n, d ) {
		if ( d === 0 ) {
			return "\\text{undefined}";
		}

		if ( n === 0 ) {
			return "0";
		}

		var sign = n / d < 0 ? "-" : "";
		n = Math.abs(n);
		d = Math.abs(d);

		var gcd = this.getGCD(n, d);
		n = n / gcd;
		d = d / gcd;

		return d > 1 ?
			sign + "\\dfrac{" + n + "}{" + d + "}" :
			sign + n;
	},

	/* Wrap a fraction in parentheses if it's actually displayed as a fraction or
	if it's negative. */
	fractionParens: function( n, d ) {
		var neg = n / d < 0;
		var frac = d !== 0 && d !== 1;
		var nonzero = n !== 0;

		if (nonzero && (frac || neg))
			return "\\left(" + this.fraction( n, d ) + "\\right)";
		else
			return this.fraction( n, d );
	},

	/* expandExp for rational bases. */
	expandFracExp: function( base_num, base_denom, exp ) {
		var base_str = exp >= 0 ? 
			this.fractionParens( base_num, base_denom ) :
			this.fractionParens( base_denom, base_num );

		var str = base_str;
		for ( var i = 1; i < Math.abs( exp ); i++ ) str += " \\cdot" + base_str;
		return str;
	},

	fractionSimplification: function( n, d ) {
		var result = "\\frac{" + n + "}{" + (d < 0 ? "(" + d + ")" : d) + "}";

		if ( this.getGCD( n, d ) > 1 || d == 1 ) {
			result += " = " + this.fraction( n, d );
		}

		return result;
	},

	/* Wrap a number in parentheses if it's negative. */
	negParens: function( n ) {
		return n < 0 ? "(" + n + ")" : n;
	},

	/* Expand something like (-2)^4 into (-2)*(-2)*(-2)*(-2) */
	expandExp: function( base, exp ) {
		var base_str = this.negParens( base );
		var str = base_str;
		for ( var i = 1; i < exp; i++ )	str += " \\cdot" + base_str;
		return str;
	},

	// splitRadical( 24 ) gives [ 2, 6 ] to mean 2 sqrt(6)
	splitRadical: function( n ) {
		if ( n === 0 ) {
			return [ 0, 1 ];
		}

		var coefficient = 1;
		var radical = n;

		for(var i = 2; i * i <= n; i++) {
			while(radical % (i * i) === 0) {
				radical /= i * i;
				coefficient *= i;
			}
		}

		return [coefficient, radical];
	},

	// formattedSquareRootOf(24) gives 2\sqrt{6}
	formattedSquareRootOf: function( n ) {
		if( n === 1	 || n === 0 ) {
			/* so as to not return "" or "\\sqrt{0}" later */
			return n.toString();
		} else {
			var split = KhanUtil.splitRadical( n );
			var coefficient = split[0] == 1 ? "" : split[0].toString();
			var radical = split[1] == 1 ? "" : "\\sqrt{" + split[1] + "}";

			return coefficient + radical;
		}
	},

	squareRootCanSimplify: function(n) {
		return KhanUtil.formattedSquareRootOf(n) != ("\\sqrt{" + n + "}");
	},

	// Ported from https://github.com/clojure/clojure/blob/master/src/clj/clojure/pprint/cl_format.clj#L285
	cardinal: function( n ) {
		var cardinalScales = ["", "thousand", "million", "billion", "trillion", "quadrillion", "quintillion", "sextillion", "septillion", "octillion", "nonillion", "decillion", "undecillion", "duodecillion", "tredecillion", "quattuordecillion", "quindecillion", "sexdecillion", "septendecillion", "octodecillion", "novemdecillion", "vigintillion"];
		var cardinalUnits = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
		var cardinalTens = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];
		// For formatting numbers less than 1000
		var smallNumberWords = function( n ) {
			var hundredDigit = Math.floor( n / 100 );
			var rest = n % 100;
			var str = "";

			if ( hundredDigit ) {
				str += cardinalUnits[ hundredDigit ] + " hundred";
			}

			if ( hundredDigit && rest ) {
				str += " ";
			}

			if ( rest ) {
				if ( rest < 20 ) {
					str += cardinalUnits [ rest ];
				} else {
					var tenDigit = Math.floor( rest / 10 );
					var unitDigit = rest % 10;

					if ( tenDigit ) {
						str += cardinalTens [ tenDigit ];
					}

					if ( tenDigit && unitDigit ) {
						str += "-";
					}

					if ( unitDigit ) {
						str += cardinalUnits [ unitDigit ];
					}
				}
			}

			return str;
		};

		if ( n == 0 ) return "zero";
		else {
			var neg = false;
			if ( n < 0 ) {
				neg = true;
				n = Math.abs( n );
			}

			var words = [];
			var scale = 0;
			while ( n > 0 ) {
				var end = n % 1000;

				if ( end > 0 ) {
					if ( scale > 0 ) {
						words.unshift( cardinalScales[ scale ] );
					}

					words.unshift( smallNumberWords( end ) );
				}

				n = Math.floor( n / 1000 );
				scale += 1;
			}

			if ( neg ) words.unshift( "negative" );
			return words.join( " " );
		}
	},

	Cardinal: function( n ) {
		var card = KhanUtil.cardinal( n );
		return card.charAt(0).toUpperCase() + card.slice(1);
	},
	
	// Depends on expressions.js for expression formatting
	// Returns a string with the expression for the formatted roots of the quadratic
	// with coefficients a, b, c
	// i.e. "x = \pm 3", "
	quadraticRoots: function( a, b, c ) {
		var underRadical = KhanUtil.splitRadical( b * b - 4 * a * c );
		var rootString = "x =";
		
		if ( (b * b - 4 * a * c) === 0 ) {
			// 0 under the radical
			rootString += KhanUtil.fraction(-b, 2*a);
		} else if ( underRadical[0] === 1 ) {
			// The number under the radical cannot be simplified
			rootString += KhanUtil.expr(["frac", ["+-", -b, ["sqrt", underRadical[1]]],
			                                     2 * a]);
		} else if ( underRadical[1] === 1 ) {
			// The absolute value of the number under the radical is a perfect square

			rootString += KhanUtil.fraction(-b + underRadical[0], 2*a) + "," 
				+ KhanUtil.fraction(-b - underRadical[0], 2*a);
		} else {
			// under the radical can be partially simplified
			var divisor = KhanUtil.getGCD( b, 2 * a, underRadical[0] );
			
			if ( divisor === Math.abs(2*a) ) {
				rootString += KhanUtil.expr(["+-", -b / (2 * a), ["*", underRadical[0] / divisor,
															 ["sqrt", underRadical[1]] ]]);
			} else {
				rootString += KhanUtil.expr(["frac", ["+-", -b / divisor, ["*", underRadical[0] / divisor,
				                                                                    ["sqrt", underRadical[1]] ]],
				                                     2 * a / divisor]);
			}
		}
		return rootString;
	},

	commafy: function( num ) {
		return num.toString().replace(/\B(?=(?:\d{3})+(?!\d))/g, "{,}");
    }
});

