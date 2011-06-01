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
			sign + "\\frac{" + n + "}{" + d + "}" :
			sign + n;
	},

	fractionSimplification: function(n, d) {
		var result = "\\frac{" + n + "}{" + (d < 0 ? "(" + d + ")" : d) + "}";

		if ( this.getGCD( n, d ) > 1 || d == 1 ) {
			result += " = " + this.fraction( n, d );
		}

		return result;
	},

	negParens: function( n ) {
		return n < 0 ? "(" + n + ")" : n;
	},

	splitRadical: function( n ) {
		console.log(n)
		console.log(typeof n)
		if ( n === 0 ) {
			return [ 0, 1 ];
		}

		var coefficient = 1;
		var radical = n;

		for(var i = 2; i * i <= n; i++) {
			while(radical % (i * i) == 0) {
				radical /= i * i;
				coefficient *= i;
			}
		}

		return [coefficient, radical];
	},

	/* formattedSquareRootOf(24) gives 2\sqrt{6} */
	formattedSquareRootOf: function( n ) {
		if( n === 1  || n === 0 ) {
			/* so as to not return "" or "\\sqrt{0}" later */
			return n.toString();
		} else {
			var split = KhanUtil.splitRadical( n );
			var coefficient = split[0] == 1 ? "" : split[0].toString();
			var radical = split[1] == 1 ? "" : "\\sqrt{" + split[1] + "}";

			return cString + rString;
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

		return words.join( " " );
	},

	Cardinal: function( n ) {
		var card = KhanUtil.cardinal( n );
		return card.charAt(0).toUpperCase() + card.slice(1);
	}
});
