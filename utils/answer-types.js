Khan.answerTypes = Khan.answerTypes || {};

jQuery.extend( Khan.answerTypes, {
	text: function( solutionarea, solution, fallback, verifier ) {
		var input = jQuery('<input type="text">');
		jQuery( solutionarea ).append( input );
		input.focus();

		var correct = jQuery( solution ).text();

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
		return ret;
	},

	regex: function( solutionarea, solution, fallback ) {
		var verifier = function( correct, guess ) {
			return jQuery.trim( guess ).match( correct );
		};

		return Khan.answerTypes.text( solutionarea, solution, fallback, verifier );
	},

	percent: function ( solutionarea, solution, fallback ) {
		Khan.answerTypes.opts = jQuery.extend({
				maxError: Math.pow( 2, -23 )
				}, jQuery( solution ).data());

		var verifier = function( correct, guess ) {
			guess = jQuery.trim( guess );
			if ( guess.indexOf( "%" ) !== ( guess.length - 1 ) ) {
				return false;
			}
			guess = jQuery.trim( guess.substring( 0, guess.length - 1) );
			return Khan.answerTypes.decimalVerifier( correct, guess );
		};

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
		Khan.answerTypes.opts = jQuery.extend({
				maxError: Math.pow( 2, -23 )
				}, jQuery( solution ).data());

		return Khan.answerTypes.text( solutionarea, solution, fallback, Khan.answerTypes.decimalVerifier );
	},

	rational: function( solutionarea, solution, fallback ) {
		var options = jQuery.extend({
			simplify: "required"
		}, jQuery( solution ).data());

		var verifier = function( correct, guess ) {
			var ratExp = /^(-?[0-9]+)\s*(?:\/\s*([0-9]+))?$/;

			correct = parseFloat( correct );

			var match = guess.match(ratExp);

			if ( match ) {
				var num = parseFloat( match[1] );
				var denom = match[2] ? parseFloat( match[2] ) : 1;

				var gcd = KhanUtil.getGCD( num, denom );
				guess = num / denom;

				if ( options.simplify !== "optional" && gcd > 1 ) {
					return false;
				} else {
					return Math.abs( correct - guess ) < Math.pow( 2, -23 );
				}
			} else {
				return false;
			}
		};

		return Khan.answerTypes.text( solutionarea, solution, fallback, verifier );
	},

	radical: function( solutionarea, solution ) {
		solution.find("span:first").addClass("sol").end()
			.find("span:last").addClass("sol").wrap("<span class=\"radical\"/>").end()
			.find(".radical").prepend("&radic;");

		return Khan.answerTypes.multiple( solutionarea, solution );
	},

	multiple: function( solutionarea, solution ) {
		solutionarea = jQuery( solutionarea );
		solutionarea.append( jQuery( solution ).contents() );

		var solutionArray = [];

		// Iterate in reverse so the *first* input is focused
		jQuery( solutionarea.find( ".sol" ).get().reverse() ).each(function() {
			var type = jQuery( this ).data( "type" );
			type = type != null ? type : "text";

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

		return Khan.answerTypes.text( solutionarea, solution, fallback, verifier );
	}
} );
