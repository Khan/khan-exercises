jQuery.extend(KhanUtil, {
	/* Wraps a number in paretheses if it's negative. */
	negParens: function( n ) {
		return n < 0 ? "(" + n + ")" : n;
	},

	/* Wrapper for `fraction` which takes a decimal instead of a numerator and
	 * denominator. */
	decimalFraction: function( num, defraction, reduce, small, parens ) {
		var f = KhanUtil.toFraction( num );
		return KhanUtil.fraction( f[0], f[1], defraction, reduce, small, parens );
	},

	reduce: function( n, d){
		var gcd = KhanUtil.getGCD( n, d );
		n = n / gcd;
		d = d / gcd;
		return [ n, d ];
	},

	toFractionTex: function( n, dfrac ) {
		var f = KhanUtil.toFraction( n );
		if ( f[1] === 1 ) {
			return f[0];
		} else {
			return "\\" + ( dfrac ? "d" : "" ) + "frac{" + f[0] + "}{" + f[1] + "}";
		}
	},

	/* Format the latex of the fraction `n`/`d`.
	 * - Will use latex's `dfrac` unless `small` is specified as truthy.
	 * - Will wrap the fraction in parentheses if necessary (ie, unless the
	 * fraction reduces to a positive integer) if `parens` is specified as
	 * truthy.
	 * - Will reduce the fraction `n`/`d` if `reduce` is specified as truthy.
	 * - Will defraction (spit out 0 if `n` is 0, spit out `n` if `d` is 1, or
	 * spit out `undefined` if `d` is 0) if `defraction` is specified as
	 * truthy. */
	fraction: function( n, d, defraction, reduce, small, parens ) {
		var frac = function( n, d ) {
			return ( small ? "\\frac" : "\\dfrac" ) + "{" + n + "}{" + d + "}";
		};

		var neg = n * d < 0;
		var sign = neg ? "-" : "";
		n = Math.abs( n );
		d = Math.abs( d );

		if ( reduce ) {
			var gcd = KhanUtil.getGCD( n, d );
			n = n / gcd;
			d = d / gcd;
		}

		defraction = defraction && ( n === 0 || d === 0 || d === 1 );
		parens = parens && ( !defraction || neg );
		var begin = parens ? "\\left(" : "";
		var end = parens ? "\\right)" : "";

		var main;
		if ( defraction ) {
			if ( n === 0 ) {
				main = "0";
			} else if ( d === 0 ) {
				main = "\\text{undefined}";
			} else if ( d === 1 ) {
				main = sign + n;
			}
		} else {
			main = sign + frac( n, d );
		}

		return begin + main + end;
	},

	mixedFractionFromImproper: function( n, d, defraction, reduce, small, parens ) {
		return KhanUtil.mixedFraction( Math.floor( n / d ), n % d, d, defraction, reduce, small, parens );
	},

	/* Format the latex of the mixed fraction 'num n/d"
	 * - For negative numbers, if it is a mixed fraction, make sure the whole
	 * number portion is negative.  '-5, 2/3' should be 'mixedFraction(-5,2,3)'
	 * do not put negative for both whole number and numerator portion.
	 * - Will use latex's `dfrac` unless `small` is specified as truthy.
	 * - Will wrap the fraction in parentheses if necessary (ie, unless the
	 * fraction reduces to a positive integer) if `parens` is specified as
	 * truthy.
	 * - Will reduce the fraction `n`/`d` if `reduce` is specified as truthy.
	 * - Will defraction (spit out 0 if `n` is 0, spit out `n` if `d` is 1, or
	 * spit out `undefined` if `d` is 0) if `defraction` is specified as
	 * truthy. */
	mixedFraction: function( number, n, d, defraction, reduce, small, parens ) {
		var wholeNum = number ? number : 0;
		var numerator = n ? n : 0;
		var denominator = d ? d : 1;

		if ( wholeNum < 0 && numerator < 0 ) {
			throw "NumberFormatException: Both integer portion and fraction cannot both be negative.";
		}
		if ( denominator < 0 ) {
			throw "NumberFormatException: Denominator cannot be be negative.";
		}
		if ( denominator === 0 ) {
			throw "NumberFormatException: Denominator cannot be be 0.";
		}

		if ( reduce ) {
			if( wholeNum < 0 ) {
				wholeNum -= Math.floor( numerator / denominator );
			} else {
				wholeNum += Math.floor( numerator / denominator );
			}

			numerator = numerator % denominator;
		}

		if ( wholeNum !== 0 && numerator !== 0 ) {
			return wholeNum + " " + KhanUtil.fraction( n, d, defraction, reduce, small, parens );
		} else if ( wholeNum !== 0 && numerator === 0 ) {
			return wholeNum;
		} else if ( wholeNum === 0 && numerator !== 0 ) {
			return KhanUtil.fraction( n, d, defraction, reduce, small, parens );
		} else {
			return 0;
		}
	},

	/* Calls fraction with the reduce and defraction flag enabled. Additional
	 * parameters correspond to the remaining fraction flags. */
	fractionReduce: function( n, d, small, parens ) {
		return KhanUtil.fraction( n, d, true, true, small, parens );
	},

	/* Calls fraction with the small flag enabled. Additional parameters
	 * correspond to the remaining fraction flags. */
	fractionSmall: function( n, d, defraction, reduce, parens ) {
		return KhanUtil.fraction( n, d, defraction, reduce, true, parens );
	},

	/* Interprets a decimal as a multiple of pi and formats it as would be
	 * expected. 
	 *
	 * If niceAngle is truthy, it also delivers more natural values for 0 (0 instead
	 * of 0 \pi) and 1 (\pi instead of 1 \pi).
	 * */
	piFraction: function( num, niceAngle ) {
		if ( num.constructor === Number ) {
			var f = KhanUtil.toFraction( num / Math.PI, 0.001 ),
			 n = f[0],
			 d = f[1];

			if ( niceAngle ) {
				if ( n === 0) {
					return "0";
				}
				if ( n === 1 && d === 1) {
					return "\\pi";
				}
			}
			return d === 1 ? n + "\\pi" : KhanUtil.fractionSmall( n, d ) + "\\pi";
		}
	},

	/* Returns whether the fraction n/d reduces. */
	reduces: function( n, d ) {
		// if the GCD is greater than 1, then there is a factor in common and the
		// fraction reduces.
		return KhanUtil.getGCD( n, d ) > 1;
	},

	fractionSimplification: function( n, d ) {
		var result = "\\frac{" + n + "}{" + d + "}";

		if ( d <= 1 || KhanUtil.getGCD( n, d ) > 1 ) {
			result += " = " + KhanUtil.fractionReduce( n, d );
		}

		return result;
	},

	// Randomly return the fraction in its mixed or improper form.
	mixedOrImproper: function( n, d ) {
		// mixed
		if ( n < d || KhanUtil.rand( 2 ) > 0 ) {
			return KhanUtil.fraction( n, d );

		// improper
		} else {
			var imp = Math.floor( n / d );
			return imp + KhanUtil.fraction( n - ( d * imp ), d );
		}
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
		if( n === 1 || n === 0 ) {
			/* so as to not return "" or "\\sqrt{0}" later */
			return n.toString();
		} else {
			var split = KhanUtil.splitRadical( n );
			var coefficient = split[0] === 1 ? "" : split[0].toString();
			var radical = split[1] === 1 ? "" : "\\sqrt{" + split[1] + "}";

			return coefficient + radical;
		}
	},

	squareRootCanSimplify: function(n) {
		return KhanUtil.formattedSquareRootOf(n) !== ("\\sqrt{" + n + "}");
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

		if ( n === 0 ) {
			return "zero";
		} else {
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

			if ( neg ) {
				words.unshift( "negative" );
			}

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
			rootString += KhanUtil.fraction(-b, 2*a, true, true, true);
		} else if ( underRadical[0] === 1 ) {
			// The number under the radical cannot be simplified
			rootString += KhanUtil.expr(["frac", ["+-", -b, ["sqrt", underRadical[1]]],
												 2 * a]);
		} else if ( underRadical[1] === 1 ) {
			// The absolute value of the number under the radical is a perfect square

			rootString += KhanUtil.fraction(-b + underRadical[0], 2*a, true, true, true) + ","
				+ KhanUtil.fraction(-b - underRadical[0], 2*a, true, true, true);
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

	// Thanks to Ghostoy on http://stackoverflow.com/questions/6784894/commafy/6786040#6786040
	commafy: function( num ) {
		var str = num.toString().split( "." );

		if ( str[0].length >= 5 ) {
			str[0] = str[0].replace( /(\d)(?=(\d{3})+$)/g, '$1{,}' );
		}

		if ( str[1] && str[1].length >= 5 ) {
			str[1] = str[1].replace( /(\d{3})(?=\d)/g, '$1\\;' );
		}

		return str.join( "." );
	},

	// Formats strings like "Axy + By + Cz + D" where A, B, and C are variables
	// initialized to unknown values. Formats things so that TeX takes care of
	// negatives, and also handles cases where the strings beind added are wrapped
	// in TeX color declarations (\color{blue}{Axy} to \color{blue}{xy} if A is 1,
	// and won't be inserted at all if A is 0). Also <code><var>plus( A, B, C )
	// </var></code> is cleaner than <code><var>A</var> + <var>B</var> + <var>C</var></code>.
	// Note: this is somewhat treading on the territory of expressions.js, but has
	// a slightly different use case.
	plus: function() {

		var args = [], s;

		for ( var i = 0; i < arguments.length; i++ ) {
			s = KhanUtil._plusTrim( arguments[i] );
			if ( s ) {
				args.push( s );
			}
		}

		return args.length > 0 ? args.join( " + " ) : "0";
	},

	_plusTrim: function( s ) {

		if ( typeof s === "string" && isNaN( s ) ) {

			// extract color, so we can handle stripping the 1 out of \color{blue}{1xy}
			if ( s.indexOf( "{" ) !== -1 ) {

				// we're expecting something like "\color{blue}{-1}..."
				var l, r;
				l = s.indexOf( "{", s.indexOf( "{" ) + 1 ) + 1;
				r = s.indexOf( "}", s.indexOf( "}" ) + 1 );

				// if we've encountered \color{blue}{1}\color{xy} somehow
				if ( l !== s.lastIndexOf( "{" ) + 1 && +KhanUtil._plusTrim( s.slice( l, r ) ) === 1 ) {
					if ( s.indexOf( "\\" ) !== -1 ) {
						return s.slice( 0, s.indexOf( "\\" ) ) + s.slice( r + 1 );
					} else {
						return s.slice( r + 1 );
					}
				}

				return s.slice( 0, l ) + KhanUtil._plusTrim( s.slice( l, r ) ) + s.slice( r );
			}

			if ( s.indexOf( "1" ) === 0 && isNaN( s[1] ) ) {
				return s.slice( 1 );
			} else if ( s.indexOf( "-1" ) === 0 && isNaN( s[2] ) ) {
				return "-" + s.slice( 2 );
			} else if ( s.indexOf( "0" ) === 0 || s.indexOf( "-0" ) === 0 ) {
				return "";
			} else {
				return s;
			}

		} else if ( typeof s === "number" ) {

			// we'll just return the number, but this will actually end up getting
			// rid of 0's since a returned 0 will be falsey.
			return s;

			// if we're dealing with a string that looks like a number
		} else if ( !isNaN( s ) ) {

			return +s;

		}

	},

	randVar: function() {
		return KhanUtil.randFromArray([ "x", "k", "y", "a", "n", "r", "p", "u", "v" ])
	},

	eulerFormExponent: function( angle ) {
		var fraction = KhanUtil.toFraction( angle / Math.PI, 0.001 );
		var numerator = fraction[0], denominator = fraction[1];
		var eExp = ( ( numerator > 1) ? numerator : "" ) + "\\pi i";
		if ( denominator !== 1 ) {
			eExp += " / " + denominator;
		}
		return eExp;
	},

	// Formats a complex number in polar form.
	polarForm: function( radius, angle, useEulerForm ) {
		var fraction = KhanUtil.toFraction( angle / Math.PI, 0.001 );
		var numerator = fraction[0], denominator = fraction[1];

		var equation;
		if ( useEulerForm ) {
			if ( numerator > 0 ) {
				var ePower = KhanUtil.expr( [ "^", "e", KhanUtil.eulerFormExponent( angle ) ] );
				equation = ( ( radius > 1 ) ? radius : "" ) + " " + ePower;
			} else {
				equation = radius;
			}
		} else {
			if ( angle === 0 ) {
				equation = radius;
			} else {
				var angleRep = KhanUtil.piFraction( angle, true );
				var cis = "\\cos(" + angleRep + ") + i \\sin(" + angleRep + ")";

				// Special case to circumvent ugly "*1* (sin(...) + i cos(...))"
				if ( radius !== 1 ) {
					equation = KhanUtil.expr( [ "*", radius, cis ] );
				} else {
					equation = cis;
				}
			}
		}
		return equation;
	},

	complexNumber: function( real, imaginary ) {
		if ( real === 0 && imaginary === 0 ) {
			return "0";
		} else if ( real === 0 ) {
			return imaginary + "i";
		} else if ( imaginary === 0 ) {
			return real;
		} else {
			return KhanUtil.expr([ "+", real, [ "*", imaginary, "i" ] ]);
		}
	},

	complexFraction: function( real, realDenominator, imag, imagDenominator ) {
		var ret = "";
		if ( real == 0 && imag == 0 ) {
			ret = "0";
		}
		if ( real != 0 ) {
			ret += KhanUtil.fraction( real, realDenominator, false, true );
		} 
		if ( imag != 0 ) {
			if ( imag / imagDenominator > 0 ) {
				if ( real != 0 ) {
					ret += " + ";
				}
				ret += KhanUtil.fraction( imag, imagDenominator, false, true ) + " i";
			} else {
				imag = Math.abs( imag );
				imagDenominator = Math.abs( imagDenominator );
				ret += " - ";
				ret += KhanUtil.fraction( imag, imagDenominator, false, true ) + " i";
			}
		}
		return ret;
	}
});
