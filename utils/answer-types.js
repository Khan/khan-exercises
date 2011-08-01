(function() {

var unsimplifiedMessage = "Your answer is almost correct, but it needs to be simplified.";

Khan.answerTypes = Khan.answerTypes || {};

jQuery.extend( Khan.answerTypes, {
	text: function( solutionarea, solution, fallback, verifier ) {
		var input = jQuery('<input type="text">');
		jQuery( solutionarea ).append( input );
		input.focus();

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
				fallback ?
					fallback + "" :
					"";

			ret.guess = val;

			return verifier( correct, val );
		};
		ret.solution = jQuery.trim( correct );
		ret.examples = verifier.examples || [];
		return ret;
	},

	number: function( solutionarea, solution, fallback, forms ) {
		var options = jQuery.extend({
			simplify: "required",
			maxError: Math.pow( 2, -42 ),
			forms: "literal, improper, mixed, decimal"
		}, jQuery( solution ).data());
		var acceptableForms = ( forms || options.forms ).split(/\s*,\s*/);

		var forms = {
			literal: {
				transformer: function( text ) {
					// Prevent literal comparisons for decimal-looking-like strings
					return { canonicalized: ( /[^\d\.\s]/ ).test( text ) ? text : null };
				}
			},

			improper: {
				transformer: function( text ) {
					var match = text

						// Replace unicode minus sign with hyphen
						.replace( /\u2212/, "-" )

						// Remove space after +, -
						.replace( /([+-])\s+/g, "$1" )

						// Extract numerator and (optional) denominator
						.match( /^([+-]?\d+)\s*(?:\/\s*([+-]?\d+))?$/ );

					if ( match ) {
						var num = parseFloat( match[1] ),
							denom = parseFloat( match[2] || "1" );
						var simplified = denom > 0 && match[2] !== "1" && KhanUtil.getGCD( num, denom ) === 1;

						return [ {
							canonicalized: num / denom,
							simplified: simplified
						} ];
					}

					return [];
				},
				example: (function() {
					if ( options.simplify === "optional" ) {
						return "a fraction, like <code>1/2</code>"
					} else {
						return "a simplified fraction, like <code>1/2</code> but not <code>2/4</code>"
					}
				})()
			},

			pi: {
				transformer: function( text ) {
					var match, possiblities = [];

					// Replace unicode minus sign with hyphen
					text = text.replace( /\u2212/, "-" );

					// - pi
					if ( match = text.match( /^([+-]?)\s*pi?$/i ) ) {
						possiblities = [ { canonicalized: parseFloat( match[1] + "1" ), simplified: true } ];

					// 5 / 6 pi
					} else if ( match = text.match( /^([+-]?\d+\s*(?:\/\s*[+-]?\d+)?)\s*\*?\s*pi?$/i ) ) {
						possiblities = transforms.improper( match[1] );

					// 5 pi / 6
					} else if ( match = text.match( /^([+-]?\d+)\s*\*?\s*pi?\s*(?:\/\s*([+-]?\d+))?$/i ) ) {
						possiblities = transforms.improper( match[1] + match[2] );

					// - pi / 4
					} else if ( match = text.match( /^([+-]?)\s*\*?\s*pi?\s*(?:\/\s*([+-]?\d+))?$/i ) ) {
						possiblities = transforms.improper( match[1] + "1/" + match[2] );

					// 0.5 pi (fallback)
					} else if ( match = text.match( /^(\S+)\s*\*?\s*pi?$/i ) ) {
						possiblities = transforms.decimal( match[1] );

					// 0
					} else if ( text === "0") {
						possiblities = [ { canonicalized: 0, simplified: true } ];
					}

					jQuery.each( possiblities, function( possibility ) {
						possibility.canonicalized *= Math.PI;
					} );
					return possiblities;
				},
				example: "a multiple or fraction of pi, like 12 pi or pi / 3"
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
							canonicalized: sign * ( integ + num / denom ),
							simplified: simplified
						} ];
					}

					return [];
				},
				example: "a mixed number, like <code>1\\ 2/3</code>"
			},

			decimal: {
				transformer: function( text ) {
					var normal = function( text ) {
						var match = text

							// Replace unicode minus sign with hyphen
							.replace( /\u2212/, "-" )

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
						{ canonicalized: normal( text ), simplified: true },
						{ canonicalized: commas( text ), simplified: true }
					];
				},
				example: (function() {
					if ( options.inexact === undefined ) {
						return "an exact decimal, like <code>0.75</code>";
					} else {
						return "a decimal, like <code>0.75</code>";
					}
				})()
			}
		};

		var verifier = function( correct, guess ) {
			correct = jQuery.trim( correct );
			guess = jQuery.trim( guess );

			correctFloat = parseFloat( correct );
			var ret = false;

			jQuery.each( acceptableForms, function( i, form ) {
				var transformed = forms[ form ].transformer( jQuery.trim( guess ) );

				for ( var i = 0, l = transformed.length; i < l; i++ ) {
					var can = transformed[ i ].canonicalized;
					var simp = transformed[ i ].simplified;

					if ( typeof can === "string" &&
							correct.toLowerCase() === can.toLowerCase() ) {
						ret = true;
						return false; // break;
					} if ( typeof can === "number" &&
							Math.abs( correctFloat - can ) < options.maxError ) {
						if ( simp || options.simplified === "optional" ) {
							ret = true;
						} else {
							ret = unsimplifiedMessage;
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

		return Khan.answerTypes.text( solutionarea, solution, fallback, verifier );
	},

	regex: function( solutionarea, solution, fallback ) {
		var verifier = function( correct, guess ) {
			return jQuery.trim( guess ).match( correct );
		};

		return Khan.answerTypes.text( solutionarea, solution, fallback, verifier );
	},

	percent: function ( solutionarea, solution, fallback ) {
		Khan.answerTypes.opts = jQuery.extend({
				maxError: Math.pow( 2, -42 )
				}, jQuery( solution ).data());

		var verifier = function( correct, guess ) {
			guess = jQuery.trim( guess );
			if ( guess.indexOf( "%" ) !== ( guess.length - 1 ) ) {
				return false;
			}
			guess = jQuery.trim( guess.substring( 0, guess.length - 1) );
			return Khan.answerTypes.decimalVerifier( correct, guess );
		};
		verifier.examples = [ "a percent, like 12.34%" ];

		return Khan.answerTypes.text( solutionarea, solution, fallback, verifier );
	},

	decimalVerifier: function( correct, guess ) {
		correct = parseFloat( correct );
		guess = jQuery.trim( guess );

		var checkDecimalPoint = function( g ) {
			// Make sure we have only a decimal, no funny exponent stuff
			var parts, integ, fract;
			parts = g.split( "." );
			integ = parts[0];
			fract = parts[1] != null ? parts[1] : "";

			if ( g.match( /\d/ )
					&& integ.match( /^([\+-])?((\d{1,3}([ ,]\d{3})*)|(\d*))$/ )
					&& fract.match( /^(((\d{3} )*\d{1,3})|(\d*))$/ ) ) {
				g = g.replace( /[, ]/g, "" );
				g = parseFloat( g );
				return Math.abs( correct - g ) < parseFloat( Khan.answerTypes.opts.maxError );
			} else {
				return false;
			}
		};

		var checkDecimalComma = function( g ) {
			// Swap . and , and try again
			return checkDecimalPoint( g.replace( /([\.,])/g, function( str, c ) {
				return ( c === "." ? "," : "." );
			}));
		};
		return checkDecimalPoint( guess ) || checkDecimalComma( guess );
	},

	decimal: function( solutionarea, solution, fallback ) {
		return Khan.answerTypes.number( solutionarea, solution, fallback, "decimal" );
	},

	rational: function( solutionarea, solution, fallback ) {
		return Khan.answerTypes.number( solutionarea, solution, fallback, "improper, mixed" );
	},

	improper: function( solutionarea, solution, fallback ) {
		return Khan.answerTypes.number( solutionarea, solution, fallback, "improper" );
	},

	mixed: function( solutionarea, solution, fallback ) {
		return Khan.answerTypes.number( solutionarea, solution, fallback, "mixed" );
	},

	radical: function( solutionarea, solution ) {
		var options = jQuery.extend({
			simplify: "required"
		}, jQuery( solution ).data());
		var ansSquared = parseFloat( jQuery( solution ).text() );
		var ans = KhanUtil.splitRadical( ansSquared );

		var inte = jQuery( "<span>" ), inteGuess, rad = jQuery( "<span>" ), radGuess;

		inteValid = Khan.answerTypes.text( inte, null, "1", function( correct, guess ) { inteGuess = guess; } );
		radValid = Khan.answerTypes.text( rad, null, "1", function( correct, guess ) { radGuess = guess; } );

		solutionarea.addClass( "radical" )
			.append( inte )
			.append( '<span class="surd">&radic;</span>')
			.append( rad.addClass( "overline" ) );
		inte.find( "input" ).eq( 0 ).focus();

		var ret = function() {
			// Load entered values into inteGuess, radGuess
			inteValid();
			radValid();

			inteGuess = parseFloat( inteGuess );
			radGuess = parseFloat( radGuess );

			ret.guess = [ inteGuess, radGuess ];

			var simplified = inteGuess === ans[0] && radGuess == ans[1];
			var correct = Math.abs( inteGuess ) * inteGuess * radGuess === ansSquared;

			if ( correct ) {
				if ( simplified || options.simplify === "optional" ) {
					return true;
				} else {
					return unsimplifiedMessage;
				}
			} else {
				return false;
			}
		};
		ret.solution = ans;
		return ret;
	},

	multiple: function( solutionarea, solution ) {
		solutionarea = jQuery( solutionarea );
		solutionarea.append( jQuery( solution ).contents() );

		var solutionArray = [];

		// Iterate in reverse so the *first* input is focused
		jQuery( solutionarea.find( ".sol" ).get().reverse() ).each(function() {
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
					valid = valid && validator();

					guess.push( validator.guess );
				}
			});

			ret.guess = guess;

			return valid;
		};

		ret.solution = solutionArray;

		return ret;
	},

	radio: function( solutionarea, solution ) {
		// Without this we get numbers twice and things sometimes
		var solutionText = jQuery( solution ).contents( ":not(.MathJax)" ).text();

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
		if ( showNone ) {
			var noneIsCorrect = KhanUtil.rand(numChoices) === 0;
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
				if ( !( noneIsCorrect && i == 0 ) || isCategory ) {
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

		jQuery.each(shownChoices, function( i, choice ) {
			var correct = choice.data( "correct" );
			choice.contents().wrapAll( '<li><label><span class="value"></span></label></li>' )
				.parent().before( '<input type="radio" name="solution" value="' + (correct ? 1 : 0) + '">' )
				.parent().parent()
				.appendTo(list);
		});

		var ret = function() {
			var choice = list.find("input:checked");

			if ( noneIsCorrect && choice.val() === "1") {
				choice.next()
					.fadeOut( "fast", function() {
						jQuery( this ).replaceWith( list.data( "real-answer" ) )
							.fadeIn( "fast" );
					});
			}

			ret.guess = jQuery.trim(
				choice.closest("li").contents( ":not(.MathJax)" ).text() );

			return choice.val() === "1";
		};
		ret.solution = jQuery.trim( solutionText );
		return ret;
	},

	list: function( solutionarea, solution ) {
		var input = jQuery("<select></select>");
		jQuery( solutionarea ).append( input );
		input.focus();

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

		return ret;
	},

	primeFactorization: function( solutionarea, solution, fallback ) {
		var verifier = function( correct, guess ) {
			guess = guess.split(" ").join("").toLowerCase();
			guess = KhanUtil.sortNumbers( guess.split( /x|\*/ ) ).join( "x" );
			return guess === correct;
		};
		verifier.examples = [ "a product of prime factors, like 2 x 3" ];

		return Khan.answerTypes.text( solutionarea, solution, fallback, verifier );
	}
} );

} )();
