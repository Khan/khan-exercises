(function() {

var inexactMessages = {
	unsimplified: "Your answer is almost correct, but it needs to be simplified.",
	missingPercentSign: "Your answer is almost correct, but it is missing a <code>\\%</code> at the end."
};

Khan.answerTypes = Khan.answerTypes || {};

jQuery.extend( Khan.answerTypes, {
	text: function( solutionarea, solution, fallback, verifier, input ) {
		if ( !input ) {
			input = jQuery('<input type="text">');
		}

		jQuery( solutionarea ).append( input );

		var correct = typeof solution === "object" ? jQuery( solution ).text() : solution;

		if ( verifier == null ) {
			verifier = function( correct, guess ) {
				correct = jQuery.trim( correct );
				guess = jQuery.trim( guess );
				return correct === guess;
			};
		}

		var ret = function() {
			// we want the normal input if it's nonempty, the fallback converted to a string if
			// the input is empty and a fallback exists, and the empty string if the input
			// is empty and the fallback doesn't exist.
			var val = input.val().length > 0 ?
				input.val() :
				(typeof fallback !== "undefined") ?
					fallback + "" :
					"";

			ret.guess = input.val();

			return verifier( correct, val );
		};
		ret.solution = jQuery.trim( correct );
		ret.examples = verifier.examples || [];
		ret.showGuess = function( guess ) {
			input.val( guess );
		};
		return ret;
	},


	graphic: function( solutionarea, solution, fallback ) {
			var verifier = function( correct, guess ){
					return Math.abs( correct - guess ) < 0.3;
				}
		return Khan.answerTypes.text( solutionarea, solution, fallback, verifier );
	},

	line: function( solutionarea, solution, fallback ) {

		var verifier = function( correct, guess ){
			var result = true;
			for ( var i = 0; i < 5; i++ ){
				var sampleX = KhanUtil.randRange( -100, 100 );
				if ( guess.match(/[A-W]|[a-w]|[y-z]|[Y-Z]/) !== null ){
					return false;
				}

				var newGuess = guess
						.replace( /\u2212/, "-" )
						.replace( /(\d)(x)/, "$1 * $2" )
						.replace( "x", sampleX )
						.replace( /(\d)(\()/, "$1 * $2" );
				var newCorrect = correct
						.replace( /(\d)(x)/, "$1 * $2" )
						.replace( "x", sampleX )
						.replace( /(\d)(\()/, "$1 * $2" )
						.replace( /-\s?-/, "");
				result = result &&  ( eval( newCorrect ) === eval( newGuess ) ) ;
			}
			return result;
		};
		verifier.examples = "An equation of a line, like 3(x+1)/2 or 2x + 1";
		return Khan.answerTypes.text( solutionarea, solution, fallback, verifier );

	},


	number: function( solutionarea, solution, fallback, accForms ) {
		var options = jQuery.extend({
			simplify: "required",
			ratio: false,
			maxError: Math.pow( 2, -42 ),
			forms: "literal, integer, proper, improper, mixed, decimal"
		}, jQuery( solution ).data());
		var acceptableForms = ( accForms || options.forms ).split(/\s*,\s*/);

		var fractionTransformer = function( text ) {
			text = text

				// Replace unicode minus sign with hyphen
				.replace( /\u2212/, "-" )

				// Remove space after +, -
				.replace( /([+-])\s+/g, "$1" )

				// Remove leading/trailing whitespace
				.replace(/(^\s*)|(\s*$)/gi,"");

				// Extract numerator and denominator
			var match = text.match( /^([+-]?\d+)\s*\/\s*([+-]?\d+)$/ );
			var parsedInt = parseInt( text, 10 );

			if ( match ) {
				var num = parseFloat( match[1] ),
					denom = parseFloat( match[2] );
				var simplified = denom > 0 &&
					( options.ratio || match[2] !== "1" ) &&
					KhanUtil.getGCD( num, denom ) === 1;
				return [ {
					value: num / denom,
					exact: simplified
				} ];
			} else if ( !isNaN( parsedInt ) && "" + parsedInt === text ) {
				return [ {
					value: parsedInt,
					exact: true
				} ];
			}

			return [];
		};

		var forms = {
			literal: {
				transformer: function( text ) {
					// Prevent literal comparisons for decimal-looking-like strings
					return [{ value: ( /[^+-\u2212\d\.\s]/ ).test( text ) ? text : null }];
				}
			},

			integer: {
				transformer: function( text ) {
					return forms.decimal.transformer( text );
				},
				example: "an integer, like <code>6</code>"
			},

			proper: {
				transformer: function( text ) {
					return jQuery.map( fractionTransformer( text ), function( o ) {
						if ( Math.abs(o.value) < 1 ) {
							return [o];
						} else {
							return [];
						}
					} );
				},
				example: (function() {
					if ( options.simplify === "optional" ) {
						return "a <em>proper</em> fraction, like <code>1/2</code> or <code>6/10</code>";
					} else {
						return "a <em>simplified proper</em> fraction, like <code>3/5</code>";
					}
				})()
			},

			improper: {
				transformer: function( text ) {
					return jQuery.map( fractionTransformer( text ), function( o ) {
						if ( Math.abs(o.value) >= 1 ) {
							return [o];
						} else {
							return [];
						}
					} );
				},
				example: (function() {
					if ( options.simplify === "optional" ) {
						return "an <em>improper</em> fraction, like <code>10/7</code> or <code>14/8</code>";
					} else {
						return "a <em>simplified improper</em> fraction, like <code>7/4</code>";
					}
				})()
			},

			pi: {
				transformer: function( text ) {
					var match, possibilities = [];

					// Replace unicode minus sign with hyphen
					text = text.replace( /\u2212/, "-" );

					// - pi
					if ( match = text.match( /^([+-]?)\s*(?:pi?|\u03c0)$/i ) ) {
						possibilities = [ { value: parseFloat( match[1] + "1" ), exact: true } ];

					// 5 / 6 pi
					} else if ( match = text.match( /^([+-]?\d+\s*(?:\/\s*[+-]?\d+)?)\s*\*?\s*(?:pi?|\u03c0)$/i ) ) {
						possibilities = fractionTransformer( match[1] );

					// 5 pi / 6
					} else if ( match = text.match( /^([+-]?\d+)\s*\*?\s*(?:pi?|\u03c0)\s*(?:\/\s*([+-]?\d+))?$/i ) ) {
						possibilities = fractionTransformer( match[1] + "/" + match[2] );

					// - pi / 4
					} else if ( match = text.match( /^([+-]?)\s*\*?\s*(?:pi?|\u03c0)\s*(?:\/\s*([+-]?\d+))?$/i ) ) {
						possibilities = fractionTransformer( match[1] + "1/" + match[2] );

					// 0
					} else if ( text === "0") {
						possibilities = [ { value: 0, exact: true } ];

					// 0.5 pi (fallback)
					} else if ( match = text.match( /^(\S+)\s*\*?\s*(?:pi?|\u03c0)$/i ) ) {
						possibilities = forms.decimal.transformer( match[1] );
					}

					jQuery.each( possibilities, function( ix, possibility ) {
						possibility.value *= Math.PI;
					} );
					return possibilities;
				},
				example: "a multiple of pi, like <code>12\\ \\text{pi}</code> or <code>2/3\\ \\text{pi}</code>"
			},

			// simple log( c ) form
			log: {
				transformer: function( text ) {
					var match, possibilities = [];

					// Replace unicode minus sign with hyphen
					text = text.replace( /\u2212/, "-" );
					text = text.replace( /[ \(\)]/g, "");

					if ( match = text.match( /^log\s*(\S+)\s*$/i ) ) {
						possibilities = forms.decimal.transformer( match[1] );
					} else if ( text === "0") {
						possibilities = [ { value: 0, exact: true } ];
					}
					return possibilities;
				},
				example: "an expression, like <code>\\log(100)</code>"
			},

			percent: {
				transformer: function( text ) {
					text = jQuery.trim( text );
					var hasPercentSign = false;

					if ( text.indexOf( "%" ) === ( text.length - 1 ) ) {
						text = jQuery.trim( text.substring( 0, text.length - 1) );
						hasPercentSign = true;
					}

					var transformed = forms.decimal.transformer( text );
					jQuery.each( transformed, function( ix, t ) {
						t.exact = hasPercentSign;
					});
					return transformed;
				},
				example: "a percent, like <code>12.34\\%</code>"
			},

			dollar: {
				transformer: function( text ) {
					text = jQuery.trim( text ).replace( '$', '' );

					return forms.decimal.transformer( text );
				},
				example: "a money amount, like <code>$2.75</code>"
			},

			mixed: {
				transformer: function( text ) {
					var match = text
						// Replace unicode minus sign with hyphen
						.replace( /\u2212/, "-" )

						// Remove space after +, -
						.replace( /([+-])\s+/g, "$1" )

						// Extract integer, numerator and denominator
						.match( /^([+-]?)(\d+)\s+(\d+)\s*\/\s*(\d+)$/ );

					if ( match ) {
						var sign  = parseFloat( match[1] + "1" ),
							integ = parseFloat( match[2] ),
							num   = parseFloat( match[3] ),
							denom = parseFloat( match[4] );
						var simplified = num < denom && KhanUtil.getGCD( num, denom ) === 1;

						return [ {
							value: sign * ( integ + num / denom ),
							exact: simplified
						} ];
					}

					return [];
				},
				example: "a mixed number, like <code>1\\ 3/4</code>"
			},

			decimal: {
				transformer: function( text ) {
					var normal = function( text ) {
						var match = text

							// Replace unicode minus sign with hyphen
							.replace( /\u2212/, "-" )

							// Remove space after +, -
							.replace( /([+-])\s+/g, "$1" )

							// Remove commas
							.replace( /,\s*/g, "" )

							// Extract integer, numerator and denominator
							// This matches [+-]?\.; will f
							.match( /^([+-]?(?:\d+\.?|\d*\.\d+))$/ );

						if ( match ) {
							var x = parseFloat( match[1] );

							if ( options.inexact === undefined ) {
								var factor = Math.pow( 10, 10 );
								x = Math.round( x * factor ) / factor;
							}

							return x;
						}
					};

					var commas = function( text ) {
						text = text.replace( /([\.,])/g, function( _, c ) { return ( c === "." ? "," : "." ); } );
						return normal( text );
					};

					return [
						{ value: normal( text ), exact: true },
						{ value: commas( text ), exact: true }
					];
				},
				example: (function() {
					if ( options.inexact === undefined ) {
						return "an <em>exact</em> decimal, like <code>0.75</code>";
					} else {
						return "a decimal, like <code>0.75</code>";
					}
				})()
			}
		};

		var verifier = function( correct, guess ) {
			correct = jQuery.trim( correct );
			guess = jQuery.trim( guess );

			var correctFloat = parseFloat( correct );
			var ret = false;

			jQuery.each( acceptableForms, function( i, form ) {
				var transformed = forms[ form ].transformer( jQuery.trim( guess ) );

				for ( var j = 0, l = transformed.length; j < l; j++ ) {
					var val = transformed[ j ].value;
					var exact = transformed[ j ].exact;

					if ( typeof val === "string" &&
							correct.toLowerCase() === val.toLowerCase() ) {
						ret = true;
						return false; // break;
					} if ( typeof val === "number" &&
							Math.abs( correctFloat - val ) < options.maxError ) {
						if ( exact || options.simplify === "optional" ) {
							ret = true;
						} else if ( form === "percent" ){
							ret = inexactMessages.missingPercentSign;
						} else {
							ret = inexactMessages.unsimplified;
						}

						return false; // break;
					}
				}
			} );

			return ret;
		};

		verifier.examples = [];
		jQuery.each( acceptableForms, function( i, form ) {
			if ( forms[ form ] != null && forms[ form ].example != null ) {
				verifier.examples.push( forms[ form ].example );
			}
		});

		var input;

		if ( typeof userExercise !== "undefined" && userExercise.tablet ) {
			input = jQuery("<input type='number'/>");
		}

		return Khan.answerTypes.text( solutionarea, solution, fallback, verifier, input );
	},

	regex: function( solutionarea, solution, fallback ) {
		var verifier = function( correct, guess ) {
			return jQuery.trim( guess ).match( correct ) != null;
		};

		return Khan.answerTypes.text( solutionarea, solution, fallback, verifier );
	},

	decimal: function( solutionarea, solution, fallback ) {
		return Khan.answerTypes.number( solutionarea, solution, fallback, "decimal" );
	},

	rational: function( solutionarea, solution, fallback ) {
		return Khan.answerTypes.number( solutionarea, solution, fallback, "integer, proper, improper, mixed" );
	},

	// A little bit of a misnomer as proper fractions are also accepted
	improper: function( solutionarea, solution, fallback ) {
		return Khan.answerTypes.number( solutionarea, solution, fallback, "integer, proper, improper" );
	},

	mixed: function( solutionarea, solution, fallback ) {
		return Khan.answerTypes.number( solutionarea, solution, fallback, "integer, proper, mixed" );
	},

	radical: function( solutionarea, solution ) {
		var options = jQuery.extend({
			simplify: "required"
		}, jQuery( solution ).data());
		var ansSquared = parseFloat( jQuery( solution ).text() );
		var ans = KhanUtil.splitRadical( ansSquared );

		var inte = jQuery( "<span>" ), inteGuess, rad = jQuery( "<span>" ), radGuess;

		var inteValid = Khan.answerTypes.text( inte, null, "1", function( correct, guess ) { inteGuess = guess; } );
		var radValid = Khan.answerTypes.text( rad, null, "1", function( correct, guess ) { radGuess = guess; } );

		solutionarea.addClass( "radical" )
			.append( inte )
			.append( '<span class="surd">&radic;</span>')
			.append( rad.addClass( "overline" ) );

		var ret = function() {
			// Load entered values into inteGuess, radGuess
			inteValid();
			radValid();

			inteGuess = parseFloat( inteGuess );
			radGuess = parseFloat( radGuess );

			ret.guess = [ inteGuess, radGuess ];

			var simplified = inteGuess === ans[0] && radGuess === ans[1];
			var correct = Math.abs( inteGuess ) * inteGuess * radGuess === ansSquared;

			if ( correct ) {
				if ( simplified || options.simplify === "optional" ) {
					return true;
				} else {
					return inexactMessages.unsimplified;
				}
			} else {
				return false;
			}
		};
		if ( options.simplify === "required" ) {
			ret.examples = [ "a simplified radical, like <code>\\sqrt{2}</code> or <code>3\\sqrt{5}</code>" ];
		} else {
			ret.examples = [ "a radical, like <code>\\sqrt{8}</code> or <code>2\\sqrt{2}</code>" ];
		}
		ret.solution = ans;
		ret.showGuess = function( guess ) {
			inteValid.showGuess( guess ? guess[0] : '' );
			radValid.showGuess( guess ? guess[1] : '' );
		};
		return ret;
	},

	si_quantity: function( solution_area, solution, fallback ) {
		// These tables from http://physics.nist.gov/cuu/Units
		var prefixes = [["Y", "yotta", 1e24],
						["Z", "zetta", 1e21],
						["E", "exa",   1e18], 
						["P", "peta",  1e15],
						["T", "tera",  1e12],
						["G", "giga",  1e9],
						["M", "mega",  1e6],
						["k", "kilo",  1e3],
						["h", "hecto", 1e2],
						["da", "deka", 1e1],
						["d", "deci",  1e-1],
						["c", "centi", 1e-2],
						["m", "milli", 1e-3],
						["u", "micro", 1e-6],
						["n", "nano",  1e-9],
						["p", "pico",  1e-12],
						["f", "femto", 1e-15],
						["a", "atto",  1e-18],
						["z", "zepto", 1e-21],
						["y", "yocto", 1e-24]];

		var baseUnits = [["m", "meter"],
						 ["g", "gram"],
						 ["s", "second"],
						 ["A", "ampere", "amp"],
						 ["K", "kelvin"],
						 ["mol", "mole"],
						 ["cd", "candela"]];

		var derivedUnits = [["rad", "radian",	[1]],
							["sr",  "steradian", [1]],
							["Hz",  "hertz",	 [["s", -1]]],
							["N",   "newton",	[1e3,
							   					 ["m", 1],
							   					 ["g", 1],
							   					 ["s", -2]]],
							["Pa",  "pascal",	[["N", 1], ["m", -2]]],
							["J",   "joule",	 [["N", 1], ["m", 1]]],
							["W",   "watt",	  [["J", 1], ["s", -1]]],
							["C",   "coulomb",   [["s", 1], ["A", 1]]],
							["V",   "volt",	  [["W", 1], ["A", -1]]],
							["F",   "farad",	 [["C", 1], ["V", -1]]],
							["ohm", "ohm",	   [["V", 1], ["A", -1]]],
							["S",   "siemen",	[["A", 1], ["V", -1]]],
							["Wb",  "weber",	 [["V", 1], ["s", 1]]],
							["T",   "tesla",	 [["Wb", 1], ["m", -2]]],
							["H",   "henry",	 [["Wb", 1], ["A", -1]]],
							["lm",  "lumen",	 [["cd", 1], ["sr", 1]]],
							["lx",  "lux",	   [["lm", 1], ["m", -2]]],
							["Bq",  "becquerel", [["s", -1]]],
							["Gy",  "gray",	  [1e-3, ["J", 1], ["g", -1]]],
							["Sv",  "sievert",   [1e-3, ["J", 1], ["g", -1]]],
							["kat", "katal",	 [["mol", 1], ["s", -1]]]];
   
		var unitRegex = "";
		
		jQuery.each( baseUnits, function( u ) {
			jQuery.each(baseUnits[u], function( name ) {
				if( unitRegex !== "" ) unitRegex += "|";
				unitRegex += baseUnits[u][name];
			});
		});

		jQuery.each( derivedUnits, function( u ) {
			unitRegex += "|" + derivedUnits[u][0] + "|" + derivedUnits[u][1];
		});

		var prefixRegex = "";

		jQuery.each( prefixes, function( u ) {
			prefixRegex += "|" + prefixes[u][0] + "|" + prefixes[u][1];
		});

		unitRegex = new RegExp( "^("+prefixRegex+")-?("+unitRegex+")s?$", "i" );

		// Extracts the prefix name
		var extractPrefix = function( token ) {
			var vals = unitRegex.exec( token );
			if(vals === null) {
				return vals;
			}
			return vals.slice( 1 );
		};
		
		var getScale = function( token ) {
			var rtn = null;
			if( token === "" ) {
				return 1;
			}
			jQuery.each( prefixes, function( i ) {
				if( token === prefixes[i][0]
				 || token.toLowerCase() === prefixes[i][1] ) {
					rtn = prefixes[i][2];
				}
				return !rtn;
			});
			return rtn;
		};
		
		// Returns standard unit name for a base unit
		var getBase = function( token ) {
			var rtn = null;
			jQuery.each( baseUnits, function( u ) {
				var _token = token; // abbreviation is case-sensitive
				u = baseUnits[u];
				jQuery.each( u, function( name ) {
					if( _token === u[name] ) {
						rtn = u[0];
					}
					_token = _token.toLowerCase();
					return !rtn;
				});
				return !rtn;
			});
			return rtn;
		};

		// Returns list of factors for a derived unit
		var getDerived = function( token ) {
			var rtn = null;
			jQuery.each( derivedUnits, function( u ) {
				u = derivedUnits[u];
				if( token === u[0] || token.toLowerCase() === u[1] ) {
					rtn = u[2];
				}
				return !rtn;
			});
			return rtn;
		};

		// Modifies aggregate to multiply another derived unit
		var appendUnit = function( aggregate, extra ) {
			aggregate.scale *= extra.scale;
			jQuery.each( baseUnits, function( key ) {
				key = baseUnits[key];
				if( extra.hasOwnProperty( key[0] ) ) {
					if( !aggregate.hasOwnProperty( key[0] ) ) {
						 aggregate[key[0]] = 0;
					}
					aggregate[key[0]] += extra[key[0]];
				}
			});
			return aggregate;
		};

		// Returns an object with keys for the scale and unit factors
		var simplifyUnit = function( name, exponent ) {
			name = extractPrefix( name );

			if( !name ) {
				return { scale: 0 };
			}

			var prefix = name[0];
			name = name[1];
			var rtn = { scale: getScale( prefix ) };

			if( getBase( name ) ) {
				rtn[getBase( name )] = exponent;
				rtn.scale = Math.pow( rtn.scale, exponent );
				return rtn;
			}
			var derivation = getDerived( name );

			// Unknown unit; further calculations will work, but answer will
			// be wrong
			if( !derivation ) {
				return { scale: 0 } ;
			}

			if( typeof derivation[0] === "number" ) {
				rtn.scale = derivation[0];
				derivation = derivation.slice( 1 );
			}

			jQuery.each( derivation, function( u ) {
				u = derivation[u]
				appendUnit( rtn, simplifyUnit( u[0], u[1] ) )
			});
			
			rtn.scale = Math.pow( rtn.scale, exponent );
			jQuery.each( baseUnits, function( key ) {
				key = baseUnits[key];
				if( rtn.hasOwnProperty( key[0] ) ) rtn[key[0]] *= exponent;
			});
			return rtn;
		}

		var parseUnit = function( str ) {
			rtn = { scale: 1 };
			re = /(|\/|per\s)\s*(|square\s|cubic\s)\s*((?!per|square|cubic)[-a-zA-Z]+)\s*(?:(?:\^|\*\*)\s*(-?\d+))?/i ;
			fields = str.split( re );

			// Capturing groups:
			//   bp+1: denominator specifier ("/" or "per ")
			//   bp+2: verbal exponent ("square " or "cubic ")
			//   bp+3: unit name
			//   bp+4: numerical exponent
			for( var bp = 0; bp + 4 < fields.length; bp += 5 ) {
				var exponent = 1;
				if( fields[bp+1]					   ) exponent *= -1;
				if( ( /^square/i ).test( fields[bp+2]) ) exponent *=  2;
				if( ( /^cubic/i  ).test( fields[bp+2]) ) exponent *=  3;
				if( fields[bp+4]					   ) exponent *= fields[bp+4];

				appendUnit( rtn, simplifyUnit( fields[bp+3], exponent ) );
			}
			return rtn;
		};
		 
		var parseQuantity = function( text ) {
			var rtn = {};
			var match = text

				// Replace unicode minus sign with hyphen
				.replace( /\u2212/, "-" )

				// Remove space after +, -
				.replace( /([+-])\s+/g, "$1" )

				// Remove commas
				.replace( /,\s*/g, "" )

				// Extract integer, numerator and denominator
				// This matches [+-]?\.; will f
				.match( /^([+-]?(?:\d+\.?|\d*\.\d+))\s*([^0-9.].*)$/ );

			if( match ) {
				rtn.magnitude = parseFloat( match[1] );
				rtn.unit = parseUnit( match[2] );
				rtn.magnitude *= rtn.unit.scale;
				return rtn;
			}

			return null;
		};

		var verifier = function( correct, guess ) {
			correct = parseQuantity( jQuery.trim( correct ) );
			guess = parseQuantity( jQuery.trim( guess ) );

			// TODO: get from options
			var tolerance = 0.05;
			
			// unparseable
			if( !correct || !guess ) return false;

			// Unknown unit
			if( correct.unit.scale == 0 || guess.unit.scale == 0 ) return false;
			
			// Guess too low 
			if( correct.magnitude * ( 1-tolerance ) > guess.magnitude ) return false;

			// Guess too high
			if( correct.magnitude * ( 1+tolerance ) < guess.magnitude ) return false;

			// Wrong units
			var rtn = true;
			jQuery.each( baseUnits, function( i ) {
				var key = baseUnits[i][0];
				if( correct.unit[key] != guess.unit[key] ) rtn = false;
				return rtn;
			});

			return rtn;
		}

		verifier.examples = ["A decimal quantity with <em>SI units</em>, " + 
			"like <code>27\\,\\mathrm{g/cm}^\\wedge 3</code> or <code>3.2\\;\\mbox{Newtons per square meter}</code>"];

		return Khan.answerTypes.text( solutionarea, solution, fallback, verifier );
	},

	multiple: function( solutionarea, solution ) {
		solutionarea = jQuery( solutionarea );
		// here be dragons
		solutionarea.append( jQuery( solution ).clone().contents().tmpl() );

		var solutionArray = [];

		solutionarea.find( ".sol" ).each(function() {
			var type = jQuery( this ).data( "type" );
			type = type != null ? type : "number";

			var sol = jQuery( this ).clone(),
				solarea = jQuery( this ).empty();

			var fallback = sol.data( "fallback" ),
				validator = Khan.answerTypes[type]( solarea, sol, fallback );

			jQuery( this ).data( "validator", validator );
			solutionArray.unshift( validator.solution );
		});

		var ret = function() {
			var valid = true,
				guess = [];

			solutionarea.find( ".sol" ).each(function() {
				var validator = jQuery( this ).data( "validator", validator );

				if ( validator != null ) {
					// Don't short-circuit so we can record all guesses
					valid = validator() && valid;

					guess.push( validator.guess );
				}
			});

			ret.guess = guess;

			return valid;
		};

		ret.showGuess = function( guess ) {
			guess = jQuery.extend( true, [], guess );

			solutionarea.find( ".sol" ).each(function() {
				var validator = jQuery( this ).data( "validator", validator );

				if ( validator != null ) {
					// Shift regardless of whether we can show the guess
					var next = guess.shift();

					if ( typeof validator.showGuess === "function" ) {
						validator.showGuess( next );
					}
				}
			});
		};

		ret.showCustomGuess = function( guess ) {
			guess = jQuery.extend( true, [], guess );

			solutionarea.find( ".sol" ).each(function() {
				var validator = jQuery( this ).data( "validator", validator );

				if ( validator != null ) {
					// Shift regardless of whether we can show the interactive guess
					var next = guess.shift();

					if ( jQuery.isFunction( validator.showCustomGuess ) ) {
						validator.showCustomGuess( next );
					}
				}
			});
		};

		// If there's only a single sol in the multiple and there aren't any examples defined,
		// use the examples from the single sol element.
		if ( solutionarea.find( ".sol" ).length === 1 && solutionarea.find( ".example" ).length === 0 ) {
			ret.examples = solutionarea.find( ".sol" ).first().data( "validator" ).examples;
		} else {
			ret.examples = solutionarea.find( ".example" ).remove()
				.map(function(i, el) {
					return jQuery( el ).html();
				});
		}
		ret.solution = solutionArray;

		return ret;
	},

	set: function( solutionarea, solution ) {
		var solutionarea = jQuery( solutionarea ),
			showUnused = (jQuery( solution ).data( "showUnused" ) === true);
		solutionarea.append(jQuery(solution).find(".input-format").clone().contents().tmpl());

		var validatorArray = [],
			solutionArray = [],
			inputArray = [];
			checkboxArray = [];

		// Fill validatorArray[] with validators for each acceptable answer
		jQuery(solution).find(".set-sol").clone().each(function() {
			var type = jQuery( this ).data( "type" );
			type = type != null ? type : "number";
			// We don't want the validators to build the solutionarea. The point
			// here is to decouple the UI from the validator. Passing null
			// generally works.
			var solarea = null;
			if (type == "multiple") {
				// Multiple is special. It has dragons that don't like null. This distracts them.
				solarea = jQuery( this ).clone().empty();
			}
			var sol = jQuery( this ).clone(),
				fallback = sol.data( "fallback" ),
				validator = Khan.answerTypes[type]( solarea, sol, fallback );

			validatorArray.push(validator);
			solutionArray.push(validator.solution);
		});


		// Create throwaway validators for each "entry" on the answer form
		// and store the resulting UI fragments in inputArray[]
		solutionarea.find( ".entry" ).each(function() {
			var input = jQuery( this ),
				type = jQuery( this ).data( "type" );
			type = type != null ? type : "number";

			// We're just using this validator to paint the UI, so we pass it a bogus solution.
			Khan.answerTypes[type]( input, jQuery(this).clone().empty(), null );
			inputArray.push(jQuery(input).find(":input"));
		});

		// Also keep track of any checkboxes
		solutionarea.find( ".checkbox" ).each(function() {
			var sol = jQuery( this ).clone();
			var solarea = jQuery( this ).empty(),
				input = jQuery( '<input type="checkbox"/>' );
			solarea.append( input );
			var solution = KhanUtil.tmpl.getVAR( sol.text() );
			jQuery( input ).data( "solution", solution );
			checkboxArray.push( input );
			solutionArray.push( solution );
		});

		var ret = function() {
			var valid = true,
				// Make a copy of the validators, so we can delete each as it's used
				unusedValidators = validatorArray.slice(0),
				allguesses = [];

			// iterate over each input area
			jQuery( inputArray ).each( function() {
				var guess = [],
					correct = false,
					validatorIdx = 0;

				// Scrape the raw inputs out of the UI elements
				jQuery( this ).each( function() {
					guess.push( jQuery( this ).val() );
				});

				if (guess.length == 1) {
					allguesses.push( guess[0] );
				} else {
					allguesses.push( guess );
				}

				// Iterate over each validator
				while (validatorIdx < unusedValidators.length && !correct) {
					// Push the actual guess into the validator's hidden input
					unusedValidators[validatorIdx].showGuess( guess );
					// And validate it
					correct = unusedValidators[validatorIdx]();
					++validatorIdx;
				}

				if (correct) {
					// remove the matching validator from the list so duplicate inputs don't match
					unusedValidators.splice(validatorIdx-1, 1);
				} else if (jQuery.trim( guess.join( "" ) ) !== "") {
					// Not correct and not empty; the entire answer is wrong :(
					valid = false;
				}

			});

			if ((validatorArray.length > inputArray.length)) {
				// if there are more valid answers than inputs, make sure that as many answers as possible were entered
				if (unusedValidators.length > validatorArray.length - inputArray.length) {
					valid = false;
				}
			// otherwise, make sure every possible answer was entered
			} else if (unusedValidators.length > 0) {
				valid = false;
			}

			// now check that all the checkboxes are selected appropriately
			jQuery( checkboxArray ).each( function() {
				var guess = jQuery( this ).is( ":checked" ),
					answer = jQuery( this ).data( "solution" ),
					label_text = jQuery( this ).closest( "label" ).text();
				if (label_text === "") {
					label_text = "checked";
				}
				// un-checked boxes are recorded as "" to prevent the question from
				// being graded if submit is clicked before anything is entered
				allguesses.push( guess ? label_text : "" );
				if ( guess != answer ) {
					valid = false;
				}
			});

			ret.guess = allguesses;

			// If data-show-unused="true" is set and the question was answered correctly,
			// show the list of additional answers (if any) that would also have been accepted.
			//
			// TODO: Ideally this should be shown below the green button so the button doesn't jump around.
			//	   perhaps reuse the check-answer-message area
			if (showUnused && valid && unusedValidators.length) {
				var otherSolutions = jQuery( "<p>" ).appendTo(solutionarea);
				jQuery( unusedValidators ).each( function( i, el ) {
					other_solution = el.solution;
					if (i > 0) {
						jQuery( "<span>" ).text(" and ").appendTo( otherSolutions );
					}
					jQuery.each( other_solution, function( i, el ) {
						if (jQuery.isArray( el )) {
							var subAnswer = jQuery( "<span>" ).appendTo( otherSolutions );
							jQuery.each( el, function( i, el ) {
								jQuery( "<span>" ).text( el + " " ).appendTo( subAnswer );
							} );
						} else {
							jQuery( "<span> " ).text( el + " " ).appendTo( otherSolutions );
						}
					} );
				});
				if (unusedValidators.length == 1) {
					jQuery( "<span>" ).text(" is also correct").appendTo( otherSolutions );
				} else {
					jQuery( "<span>" ).text(" are also correct").appendTo( otherSolutions );
				}
			}

			return valid;
		};

		ret.showGuess = function( guess ) {
			guess = jQuery.extend( true, [], guess );
			jQuery( inputArray ).each(function() {
				var item = guess.shift();
				if ( item instanceof Array ) {
					jQuery( this ).each( function() {
						jQuery(this).val( item.shift() );
					});
				} else {
					this.val( item );
				}
			});
			solutionarea.find( ".checkbox input:checkbox" ).each(function() {
				var ans = guess.shift();
				jQuery( this ).attr('checked', ans !== undefined && ans !== "");
			});
		};

		ret.examples = solution.find( ".example" ).remove()
			.map(function(i, el) {
				return jQuery( el ).html();
			});
		ret.solution = solutionArray;

		return ret;
	},

	radio: function( solutionarea, solution ) {
		var extractRawCode = function( solution ) {
			return jQuery( solution ).find('.value').clone()
				.find( ".MathJax" ).remove().end()
				.find( "code" ).removeAttr( "id" ).end()
				.html();
		};
		// Without this we get numbers twice and things sometimes
		var solutionText = extractRawCode( solution );

		var list = jQuery("<ul></ul>");
		jQuery( solutionarea ).append(list);

		// Get all of the wrong choices
		var choices = jQuery( solution ).siblings( ".choices" );

		// Set number of choices equal to all wrong plus one correct
		var numChoices = choices.children().length + 1;
		// Or set number as specified
		if ( choices.data("show") ) {
			numChoices = parseFloat( choices.data("show") );
		}

		// Optionally include none of the above as a choice
		var showNone = choices.data("none");
		var noneIsCorrect = false;
		if ( showNone ) {
			noneIsCorrect = KhanUtil.rand(numChoices) === 0;
			numChoices -= 1;
		}

		// If a category exercise, the correct answer is already included in .choices
		// and choices are always presented in the same order
		var isCategory = choices.data("category");
		var possibleChoices = choices.children().get();
		if ( isCategory ) {
			numChoices -= 1;
		} else {
			possibleChoices = KhanUtil.shuffle( possibleChoices );
		}

		// Add the correct answer
		if( !noneIsCorrect && !isCategory) {
			jQuery( solution ).data( "correct", true );
		}

		// Insert correct answer as first of possibleChoices
		if ( !isCategory ) {
			possibleChoices.splice( 0, 0, solution );
		}

		var dupes = {};
		var shownChoices = [];
		var solutionTextSquish = solution.text().replace(/\s+/g, "");
		for ( var i = 0; i < possibleChoices.length && shownChoices.length < numChoices; i++ ) {
			var choice = jQuery( possibleChoices[i] );
			choice.runModules();
			var choiceTextSquish = choice.text().replace(/\s+/g, "");

			if ( isCategory && solutionTextSquish === choiceTextSquish ) {
				choice.data( "correct", true );
			}

			if ( !dupes[ choiceTextSquish ] ) {
				dupes[ choiceTextSquish ] = true;

				// i == 0 is the solution except in category mode; skip it when none is correct
				if ( !( noneIsCorrect && i === 0 ) || isCategory ) {
					shownChoices.push( choice );
				}
			}
		}

		if( shownChoices.length < numChoices ) {
			return false;
		}

		if ( !isCategory ) {
			shownChoices = KhanUtil.shuffle( shownChoices );
		}

		if( showNone ) {
			var none = jQuery( "<span>None of the above.</span>" );

			if( noneIsCorrect ) {
				none.data( "correct", true );
				solutionText = none.text();
				list.data( "real-answer",
						jQuery( solution ).runModules()
							.contents()
							.wrapAll( '<span class="value""></span>' )
							.parent() );
			}

			shownChoices.push( none );
		}

		var correctIndex = -1;

		jQuery.each(shownChoices, function( i, choice ) {
			if ( choice.data( "correct" ) ) {
				correctIndex = i + "";
			}
			choice.contents().wrapAll( '<li><label><span class="value"></span></label></li>' )
				.parent().before( '<input type="radio" name="solution" value="' + i + '">' )
				.parent().parent()
				.appendTo(list);
		});

		var ret = function() {
			var choice = list.find("input:checked");

			if ( noneIsCorrect && choice.val() === correctIndex ) {
				choice.next()
					.fadeOut( "fast", function() {
						jQuery( this ).replaceWith( list.data( "real-answer" ) )
							.fadeIn( "fast" );
					});
			}

			ret.guess = jQuery.trim( extractRawCode(choice.closest("li")) );

			return choice.val() === correctIndex;
		};

		ret.solution = jQuery.trim( solutionText );
		ret.showGuess = function( guess ) {
			list.find( 'input:checked' ).prop( 'checked', false);

			var li = list.children().filter( function() {
				return jQuery.trim( extractRawCode(this) ) === guess;
			} );
			li.find( "input[name=solution]" ).prop( "checked", true );
		};
		return ret;
	},

	list: function( solutionarea, solution ) {
		var input = jQuery("<select></select>");
		jQuery( solutionarea ).append( input );

		var choices = jQuery.tmpl.getVAR( jQuery( solution ).data("choices") );

		jQuery.each( choices, function(index, value) {
			input.append('<option value="' + value + '">'
				+ value + '</option>');
		});

		var correct = jQuery( solution ).text();

		var verifier = function( correct, guess ) {
			correct = jQuery.trim( correct );
			guess = jQuery.trim( guess );
			return correct === guess;
		};

		var ret = function() {
			ret.guess = input.val();

			return verifier( correct, ret.guess );
		};

		ret.solution = jQuery.trim( correct );

		ret.showGuess = function( guess ) {
			input.val( guess );
		};

		return ret;
	},

	primeFactorization: function( solutionarea, solution, fallback ) {
		var verifier = function( correct, guess ) {
			guess = guess.split(" ").join("").toLowerCase();
			guess = KhanUtil.sortNumbers( guess.split( /x|\*|\u00d7/ ) ).join( "x" );
			return guess === correct;
		};
		verifier.examples = [
			"a product of prime factors, like <code>2 \\times 3</code>",
			"a single prime number, like <code>5</code>"
		];

		return Khan.answerTypes.text( solutionarea, solution, fallback, verifier );
	},

	custom: function( solutionarea, solution ) {
		var isTimeline = !( solutionarea.attr( "id" ) === "solutionarea" || solutionarea.parent().attr( "id" ) === "solutionarea" );
		var guessCorrect = false;
		solution.find( ".instruction" ).appendTo( solutionarea );
		var guessCode = solution.find( ".guess" ).text();

		var validatorCode = solution.find( ".validator-function" ).text();
		var validator = function( guess ) {
			var code = "(function() { var guess = " + JSON.stringify( guess ) + ";" + validatorCode + "})()";
			return KhanUtil.tmpl.getVAR( code, KhanUtil.currentGraph );
		};

		ret = function() {
			ret.guess = KhanUtil.tmpl.getVAR( guessCode, KhanUtil.currentGraph );
			if ( isTimeline ) {
				return guessCorrect;
			} else {
				var result = validator( ret.guess );
				if ( result === "" ) {
					ret.guess = "";
				}
				return result;
			}
		};

		ret.examples = solution.find( ".example" ).map(function(i, el) {
			return jQuery( el ).html();
		});
		ret.solution = "custom";
		var showGuessSolutionCode = jQuery( solution ).find( ".show-guess-solutionarea" ).text() || "";
		ret.showGuess = function( guess ) {
			if ( isTimeline ) {
				guessCorrect = validator( guess );
				jQuery( solutionarea ).empty();
				jQuery( solutionarea ).append( guessCorrect === true ? "Answer correct" : "Answer incorrect" );
			} else {
				var code = "(function() { var guess = " + ( JSON.stringify( guess ) || "[]" ) + ";" + showGuessSolutionCode + "})()";
				KhanUtil.tmpl.getVAR( code, KhanUtil.currentGraph );
			}
		};

		var showGuessCode = jQuery( solution ).find( ".show-guess" ).text();
		ret.showCustomGuess = function( guess ) {
			var code = "(function() { var guess = " + JSON.stringify( guess ) + ";" + showGuessCode + "})()";
			KhanUtil.tmpl.getVAR( code, KhanUtil.currentGraph );
		};

		return ret;
	}
} );

} )();
