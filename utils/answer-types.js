Khan.answerTypes = Khan.answerTypes || {};

jQuery.extend( Khan.answerTypes, {
	text: function( solutionarea, solution, verifier ) {
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

		return function() {
			return verifier( correct, input.val() );
		};
	},

	decimal: function( solutionarea, solution ) {
		var verifier = function( correct, guess ) {
			correct = parseFloat( correct );
			guess = parseFloat( guess );
			return Math.abs( correct - guess ) < Math.pow( 2, -23 );
		};

		return Khan.answerTypes.text( solutionarea, solution, verifier );
	},

	rational: function( solutionarea, solution ) {
		var options = jQuery.extend({
			simplify: "required"
		}, jQuery( solution ).data());

		var verifier = function( correct, guess ) {
			var ratExp = /^(-?[0-9]+)(?:\/([0-9]))?$/;

			if ( correct.match( "/" ) ) {
				correct = jQuery.getVAR( correct );
			} else {
				correct = parseFloat( correct );
			}

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

		return Khan.answerTypes.text( solutionarea, solution, verifier );
	},

	multiple: function( solutionarea, solution ) {
		solutionarea = jQuery( solutionarea );
		solutionarea.append( jQuery( solution ).contents() );

		// Iterate in reverse so the *first* input is focused
		jQuery( solutionarea.find( ".sol" ).get().reverse() ).each(function() {
			var type = jQuery( this ).data( "type" );
			type = type != null ? type : "text";

			var sol = jQuery( this ).clone();
			var solarea = jQuery( this ).empty();

			var validator = Khan.answerTypes[type]( solarea, sol );
			jQuery( this ).data( "validator", validator );
		});

		return function() {
			var valid = true;

			solutionarea.find( ".sol" ).each(function() {
				var validator = jQuery( this ).data( "validator", validator );
				if ( validator != null ) {
					valid = valid && validator();
				}
			});

			return valid;
		};
	},

	radio: function( solutionarea, solution ) {
		var list = jQuery("<ul></ul>");
		jQuery( solutionarea ).append(list);

		var choices = jQuery( solution ).siblings( ".choices" );
		var wrongCount;

		var numChoices = choices.children().length + 1;
		if ( choices.data("show") ) {
			numChoices = parseFloat( choices.data("show") );
		}

		var showNone = choices.data("none");
		if ( showNone ) {
			var noneIsCorrect = KhanUtil.rand(numChoices) === 0;
			numChoices -= 1;
		}

		var shuffled = KhanUtil.shuffle( choices.children().get() );

		// add the correct answer
		if( !noneIsCorrect ) {
			jQuery( solution ).data( "correct", true );
			// splice(0, 0) should be the same as unshift()
			shuffled.splice( 0, 0, solution );
		}

		var dupes = {};
		var shownChoices = [];
		for ( var i = 0; i < shuffled.length && shownChoices.length < numChoices; i++ ) {
			var choice = jQuery( shuffled[i] );
			choice.runModules();

			if ( !dupes[ choice.text() ] ) {
				dupes[ choice.text() ] = true;

				shownChoices.push( choice );
			}
		}

		if( shownChoices.length < numChoices ) {
			return false;
		}

		shownChoices = KhanUtil.shuffle(shownChoices);

		if( showNone ) {
			var none = jQuery( "<span>None of the above.</span>" );

			if( noneIsCorrect ) {
				none.data( "correct", true );
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

		return function() {
			return list.find("input:checked").val() === "1";
		};
	}
} );
