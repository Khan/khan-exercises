jQuery.extend(KhanUtil, {
	expr: function( expr, compute ) {
		if ( typeof expr == "object" ) {
			var op = expr[0], args = expr.slice(1);

			var table = compute ? KhanUtil.computeOperators : KhanUtil.formatOperators;
			return table[op].apply( this, args );
		} else {
			return compute ? expr : expr.toString();
		}
	},

	exprType: function( expr ) {
		if ( typeof expr === "object" ) {
			return expr[0];
		} else {
			return typeof(expr);
		}
	},

	exprIsNegated: function( expr ) {
		switch( KhanUtil.exprType(expr) ) {
			case "+":
			case "*":
			case "/":
			return KhanUtil.exprIsNegated(expr[1]);

			case "-":
			return true;

			case "number":
			return expr < 0;

			default:
			return false;
		}
	},

	exprIsShort: function( expr ) {
		switch( KhanUtil.exprType(expr) ) {
			case "+":
			case "-":
			case "*":
			case "/":
			case "frac":
			return false;

			case "^":
			case "number":
			return true;

			default:
			return expr.length <= 1;
		}
	},

	formatOperators: {
		"+": function() {
			var terms = jQuery.map(arguments, function( term, i ) {
				var negate = KhanUtil.exprIsNegated( term );
				var parenthesize;
				switch ( KhanUtil.exprType(term) ) {
					case "+":
					case "-":
					parenthesize = true;
					break;

					default:
					// case "*":
					// case "/":
					// case "^":
					parenthesize = false;
				}

				term = KhanUtil.expr( term );

				if ( parenthesize ) {
					term = "(" + term + ")";
				}

				if ( !negate || parenthesize ) {
					term = "+" + term;
				}

				return term;
			});

			joined = terms.join("");

			if(joined.charAt(0) === "+") {
				return joined.slice(1);
			} else {
				return joined;
			}
		},

		"-": function() {
			if ( arguments.length == 1 ) {
				return KhanUtil.expr( ["*", -1, arguments[0]] );
			} else {
				var terms = jQuery.map(arguments, function( term, i ) {
					var negate = KhanUtil.exprIsNegated( term );
					var parenthesize;
					switch ( KhanUtil.exprType(term) ) {
						case "+":
						case "-":
						parenthesize = true;
						break;

						default:
						// case "*":
						// case "/":
						// case "^":
						parenthesize = false;
					}

					term = KhanUtil.expr( term );

					if ( ( negate && i > 0 ) || parenthesize ) {
						term = "(" + term + ")";
					}

					return term;
				});

				joined = terms.join(" - ");

				return joined;
			}
		},

		"*": function() {
			if ( arguments.length > 1 ) {
				var parenthesizeRest = KhanUtil.exprType(arguments[0]) === "number"
					&& KhanUtil.exprType(arguments[1]) === "number";
				var factors = jQuery.map(arguments, function( factor, i ) {
					var parenthesize;
					switch ( KhanUtil.exprType( factor ) ) {
						case "number":
						if ( i > 0 ) {
							parenthesize = true;
						} else if ( factor == 1 || factor == -1 ) {
							return factor == 1 ? "" : "-";
						}
						break;

						default:
						parenthesize = !KhanUtil.exprIsShort( factor );
						break;
					}

					parenthesizeRest || ( parenthesizeRest = parenthesize );
					factor = KhanUtil.expr( factor );

					if ( parenthesizeRest ) {
						factor = "(" + factor + ")";
					}

					return factor;
				});

				return factors.join("");
			}
		},

		"/": function( num, den ) {
			var parenthesizeNum = !KhanUtil.exprIsShort(num);
			var parenthesizeDen = !KhanUtil.exprIsShort(den);

			num = KhanUtil.expr( num );
			den = KhanUtil.expr( den );

			num = parenthesizeNum ? "(" + num + ")" : num;
			den = parenthesizeDen ? "(" + den + ")" : den;

			return num + "/" + den;
		},

		"frac": function( num, den ) {
			return "\\frac{" + KhanUtil.expr( num ) + "}{" + KhanUtil.expr( den ) + "}";
		},

		"^": function( base, pow ) {
			var parenthesizeBase;
			switch ( KhanUtil.exprType(base) ) {
				case "+":
				case "-":
				case "*":
				case "/":
				parenthesizeBase = true;
				break;

				case "number":
				parenthesizeBase = base < 0;
				break;

				default:
				parenthesizeBase = false;
			}

			base = KhanUtil.expr( base );
			if ( parenthesizeBase ) {
				base = "(" + base + ")";
			}

			return base + "^{" + pow + "}";
		},

		"sqrt": function( arg ) {
			return "\\sqrt{" + KhanUtil.expr( arg ) + "}";
		},

		"+-": function( arg ) {
			return ["*", "\\pm", arg];
		}
	},

	computeOperators: {
		"+": function() {
			var sum = 0;

			jQuery.each(arguments, function( i, term ) {
				sum += KhanUtil.expr( term, true );
			});

			return sum;
		},

		"-": function() {
			if ( arguments.length == 1 ) {
				return -KhanUtil.expr( arguments[0], true );
			} else {
				var sum = 0;

				jQuery.each(arguments, function( i, term ) {
					sum += ( i == 0 ? 1 : -1 ) * KhanUtil.expr( term, true );
				});

				return sum;
			}
		},

		"*": function() {
			var prod = 1;

			jQuery.each(arguments, function( i, term ) {
				prod *= KhanUtil.expr( term, true );
			});

			return prod;
		},

		"/": function() {
			var prod = 1;

			jQuery.each(arguments, function( i, term ) {
				var e = KhanUtil.expr( term, true );
				prod *= ( i == 0 ? e : 1 / e );
			});

			return prod;
		},

		"^": function( base, pow ) {
			return Math.pow( KhanUtil.expr( base, true ), KhanUtil.expr( pow, true));
		},

		"sqrt": function( arg ) {
			return Math.sqrt( KhanUtil.expr( arg, true ));
		},

		"+-": function() {
			return Number.NaN;
		}
	}
});

KhanUtil.computeOperators["frac"] = KhanUtil.computeOperators["/"];
