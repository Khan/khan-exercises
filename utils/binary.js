// Binary
// Author: Eliot Van Uytfanghe
// Date: 13 March 2011
//
// Contributor(s):
// [<Name> <Date>]

jQuery.extend(KhanUtil, {
	formatBinary: function( bits, precision ) {
		if ( typeof precision === "undefined" ) {
			precision = 8;
		}
		switch ( typeof bits ) {
			case "number":
				bits = KhanUtil.decimalToBinary( bits, precision ); // fall through to string case
			case "string":
				// Pad with zeroes on left
				while ( bits.length < precision ) {
					bits = '0' + bits;
				}
				return bits;
			case "object": // assume it's an array; call self to pad with zeroes.
				return KhanUtil.formatBinary( bits.join(''), precision );
		}
	},

	// Generates a random (power)-bit number.
	generateBinary: function( power ) {
		return KhanUtil.randRange( 0, Math.pow( 2, power ) - 1 );
	},

	// Converts a number to its binary representation (with no padding zeroes).
	decimalToBinary: function( decimal ) {
		var binary = '', c = 0;

		do {
			binary = ( ( decimal & 1 ) ? '1' : '0' ) + binary;
			decimal >>= 1;
			c++;
		} while ( decimal > 0 );

		return binary;
	},

	randBinaryOperator: function() {
		// The tilde is commented out, because currently the exercises don't tell you the
		// number of bits to flip. That might change in the future if the exercise
		// get a bit more CS-centric.
		return KhanUtil.randFromArray( [ "&", "|", /* "~", */"^" ] );
	},

	// Generates a random binary expression
	randBinaryExpression: function( bits ) {
		var randExpr = function( depth ) {
			if ( depth <= 0 ) {
				return KhanUtil.generateBinary( bits );
			}

			var expression = [];
			expression.push( KhanUtil.randBinaryOperator() );
			expression.push( randExpr( depth - KhanUtil.randRange( 1, 2 ) ) );
			if ( expression[0] !== '~' ) {
				expression.push( randExpr( depth - KhanUtil.randRange( 1, 2 ) ) );
			}
			return expression;
		};

		return randExpr( 3 );
	},

	binarySymbol: function( oper ) {
		var dict = {
			"&": "\\wedge",
			"|": "\\vee",
			"^": "\\oplus",
			"~": "\\sim"
		};
		return dict[oper];
	},

	// Formats a binary expression
	formatBinaryExpression: function( expr ) {
		var recurse = function( expr ) {
			var result = KhanUtil.formatBinaryExpression( expr );
			if ( typeof expr === "object" && expr.length > 1 ) {
				result = "(" + result + ")";
			}
			if ( expr.color ) {
				result = "\\color{"+ expr.color +"}{" + result + "}";
			}
			return result;
		};
		if ( expr.length === 1 ) {
			expr = expr[0];
		}
		if ( typeof expr === "string" || typeof expr === "number" ) {
			return KhanUtil.formatBinary( expr );
		}
		var sym = KhanUtil.binarySymbol( expr[0] );
		switch ( expr[0] ) {
			case "~": 
				return sym + recurse( expr[1] );
			default:
				return recurse( expr[1] ) + sym + recurse( expr[2] );
		}
	},

	parseBinary: function( x ) {
		if ( typeof x === "number" ) {
			return x;
		}
		if ( typeof x === "string" ) {
			if ( x === "0" ) {
				return 0;
			}
			if ( x === "1" ) {
				return 1;
			}
			var result = 0;
			for ( var i = 0; i < x.length; i++ ) {
				result <<= 1;
				result += ( x[i] == 0 ? 0 : 1 );
			}
			return result;
		}
	},

	applyBinaryOperator: function( operator, a, b ) {
		if ( typeof operator === "object" ) {
			a = operator[1];
			b = operator[2];
			operator = operator[0];
		}
		a = KhanUtil.parseBinary(a);
		b = KhanUtil.parseBinary(b);
		switch ( operator ) {
			case "&":
				result = a & b;
				break;
			case "|":
				result = a | b;
				break;
			case "~":
				result = 255 - a;
				break;
			case "^":
				result = a ^ b;
				break;
		}
		return result;
	},

	evaluateBinaryExpression: function( expression ) {
		if ( typeof expression === "undefined" ) {
			return;
		}
		if ( expression[0] === '0' || expression[1] === '1' ) {
			return KhanUtil.parseBinary( expression );
		}
		if ( expression.length <= 3 &&
			 typeof expression[1] !== "object" &&
			 typeof expression[2] !== "object" ) {
			return KhanUtil.applyBinaryOperator( expression );
		}

		return KhanUtil.applyBinaryOperator( expression[0],
				KhanUtil.evaluateBinaryExpression( expression[1] ),
				KhanUtil.evaluateBinaryExpression( expression[2] ) );
	},

	countBinaryExpressionOperators: function( expression ) {
		if ( typeof expression === "object" ) {
			return 1 + KhanUtil.countBinaryExpressionOperators( expression[1] ) +
				KhanUtil.countBinaryExpressionOperators( expression[2] );
		}
		return 0;
	}
});
