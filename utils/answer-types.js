KhanUtil.answerTypes || (KhanUtil.answerTypes = {});

jQuery.extend( KhanUtil.answerTypes, {
	// TODO check numerical equality
	text: (function() {
		var input;
		var correct;

		return {
			init: function(solutionarea, solution) {
				input = $('<input type="text">');
				jQuery( solutionarea ).append( input );
				input.focus();

				correct = jQuery.trim( jQuery( solution ).text() );

				return true;
			},

			validate: function() {
				return jQuery.trim( input.val() ) === correct;
			}
		};
	})(),

	rational: (function() {
		var input;
		var correct;

		var options = {
			simplify: "required"
		};

		return {
			init: function(solutionarea, solution) {
				input = $('<input type="text">');
				jQuery( solutionarea ).append( input );
				input.focus();

				correct = parseFloat( jQuery( solution ).text() );

				return true;
			},

			validate: function() {
				var answered = jQuery.trim( input.val() );
				var re = /^(-?[0-9]+)(?:\/([0-9]))?$/;
				var match = answered.match(re);

				if( match ) {
					var num = parseFloat( match[1] );
					var denom = match[2] ? parseFloat( match[2] ) : 1;

					num = Math.round( num );
					denom = Math.round( denom );
					gcd = KhanUtil.getGCD( num, denom );

					if ( options.simplify === "required" && gcd > 1 ) {
						return false;
					} else {
						/* Floating-point compare */
						var epsilon = Math.pow( 2, -52 );
						var q = num/denom;
						return q === correct || Math.abs( q - correct ) < epsilon ||
							Math.abs( q - correct ) / Math.abs( correct ) < epsilon;
					}
				}
			}
		};
	})(),

	radio: (function() {
		var list;

		return {
			init: function(solutionarea, solution) {
				list = $("<ul></ul>");
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

				var shuffled = Array.prototype.slice.call( choices.children() );
				shuffled = KhanUtil.shuffle( choices.children() );

				// add the correct answer
				if( !noneIsCorrect ) {
					$( solution ).data( "correct", true );
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
					var none = $( "<span>None of the above.</span>" );

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

				return true;
			},

			validate: function() {
				return list.find("input:checked").val() === "1";
			}
		};
	})()
} );