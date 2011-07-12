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

		return function() {
			// we want the normal input if it's nonempty, the fallback converted to a string if 
			// the input is empty and a fallback exists, and the empty string if the input
			// is empty and the fallback doesn't exist.
			var val = input.val().length > 0 ? 
				input.val() :
				fallback ?
					fallback + "" :
					""

			return verifier( correct, val );
		};
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
		}

		return Khan.answerTypes.text( solutionarea, solution, fallback, verifier );
	},
	
	matrixEntry: function( solutionarea, solution, fallback, verifier ) {
		//matrix computations can be prone to large rounding error
		Khan.answerTypes.opts = jQuery.extend({
				maxError: Math.pow( 2, -10 )
				}, jQuery( solution ).data());			
		var input = jQuery('<input type="text" style="width:3em;" />');
		jQuery( solutionarea ).append( input );
		input.focus();

		var default_answer = jQuery( solution ).attr('default');
		if ( typeof default_answer !== 'undefined' ) {
			input.val(default_answer);
		}

		var correct = jQuery( solution ).text();

		if ( verifier == null ) {
			verifier = function( correct, guess ) {
				correct = jQuery.trim( correct );
				if ( guess.length !== 0 ) {
					guess = eval( guess.replace(/sqrt/g, "Math.sqrt") );
				}
				return Math.abs( correct - guess ) < parseFloat( Khan.answerTypes.opts.maxError );
			};
		}

		return function() {
			// we want the normal input if it's nonempty, the fallback converted to a string if 
			// the input is empty and a fallback exists, and the empty string if the input
			// is empty and the fallback doesn't exist.
			var val = input.val().length > 0 ? 
				input.val() :
				fallback ?
					fallback + "" :
					""

			return verifier( correct, val );
		};
	},

	matrix: function ( solutionarea, solution, array, displayDims ) {
		var MAX_MATRIX_DIM = 10;
		if ( array == null ) {
			//load the solution into an array
			try {
				array = eval( jQuery(solution).text() );
			} catch( ex ) {
				throw "Error loading solution for matrix solution type: '" + jQuery(solution).text() + "' cannot be evaled";
			}
		}
		//by default we display "_x_ Matrix"
		if ( displayDims == null ) { displayDims = true; }

		var display_rows = jQuery(solution).attr('rows'), display_cols = jQuery(solution).attr('cols');
		display_rows = (typeof display_rows === 'undefined' || display_rows === 'auto') ? array.length : parseInt(display_rows, 10);
		display_cols = (typeof display_cols === 'undefined' || display_cols === 'auto') ? array[0].length : parseInt(display_cols, 10);

		var adjustable = jQuery(solution).attr('adjustable') ? true : false;

		//table of inputs for the matrix
		var table = jQuery( '<table></table>' );
		for ( var i = 0; i < MAX_MATRIX_DIM; i++ ) {
			var row = jQuery( '<tr row="'+i+'"></tr>' );
			for ( var j = 0; j < MAX_MATRIX_DIM; j++ ) {
				//grab the proper value from the array or '' if we're beyond the boundaries of the array
				var val = (typeof array[i] !== 'undefined' && typeof array[i][j] !== 'undefined') ? array[i][j] : '';
				var entry = jQuery('<td col="'+j+'" type="matrixEntry" class="sol">'+val+'</td>');
				entry.data({'type': 'matrixEntry', 'fallback': '0'});
				row.append(entry);	
			}
			table.append(row);
		}
		//displays the size of the matrix
		var matrix_dims = jQuery("<div><span id='numrows' />&times;<span id='numcols' /> Matrix</div>");

		//keeps track of the dimensions of the matrix to be varified by answerTypes.multiple solution type
		//this is meant to be hidden
		var matrix_dims_sol = jQuery("<div style='display: none'>" + 
					     "<span id='numrows_sol' default='"+display_rows+"' class='sol' />" + 
					     "<span id='numcols_sol' default='"+display_cols+"' class='sol' />" +
					     "</div>");
		matrix_dims_sol.find('#numrows_sol').text( array.length )
						    .data({'type': 'matrixEntry'});
		matrix_dims_sol.find('#numcols_sol').text( array[0].length )
						    .data({'type': 'matrixEntry'});
		
		//updates the display of the matrix and matrix properties
		var update_matrix = function(){
			matrix_dims.find('#numrows').text( display_rows );
			matrix_dims.find('#numcols').text( display_cols );
			matrix_dims_sol.find('#numrows_sol input').val( display_rows );
			matrix_dims_sol.find('#numcols_sol input').val( display_cols );
			//hide the rows and cols we shouldn't show
			table.find('td').each(function(){
				var entry = jQuery(this);
				if ( entry.attr('col') >= display_cols ){
					entry.find('input').val('');
					entry.hide();
				} else {
					entry.show();
				}
			});
			table.find('tr').each(function(){
				var entry = jQuery(this);
				if ( entry.attr('row') >= display_rows ){
					entry.find('input').val('');
					entry.hide();
				} else {
					entry.show();
				}
			});
		};

		var matrix_size_adjusters = jQuery('<div><div>'+
						   '<input type="button" id="addcol" value="Add Column" />'+
						   '<input type="button" id="removecol" value="Remove Column" />'+
						   '</div><div>'+
						   '<input type="button" id="addrow" value="Add Row" />'+
						   '<input type="button" id="removerow" value="Remove Row" />'+
						   '</div></div>');
		matrix_size_adjusters.find('#addcol').click(function(){ 
			if ( display_cols < MAX_MATRIX_DIM ) {
				display_cols++;
			}
			update_matrix();
		});
		matrix_size_adjusters.find('#removecol').click(function(){ 
			if ( display_cols > 1 ) {
				display_cols--;
			}
			update_matrix();
		});
		matrix_size_adjusters.find('#addrow').click(function(){ 
			if ( display_rows < MAX_MATRIX_DIM ) {
				display_rows++;
			}
			update_matrix();
		});
		matrix_size_adjusters.find('#removerow').click(function(){ 
			if ( display_rows > 1 ) {
				display_rows--;
			}
			update_matrix();
		});
		
		solution = jQuery(solution);
		solution.empty();
		if ( adjustable ) {
			solution.append( matrix_size_adjusters );
		}
		if ( displayDims ) {
			solution.append( matrix_dims );
		}
		solution.append( matrix_dims_sol );
		solution.append( table );
		update_matrix();

		return Khan.answerTypes.multiple( solutionarea, solution );
	},

	vector: function ( solutionarea, solution ) {
		//load the solution into an array
		try {
			array = eval( jQuery(solution).text() );
		} catch( ex ) {
			throw "Error loading solution for matrix solution type: '" + jQuery(solution).text() + "' cannot be evaled";
		}

		var row_vector = jQuery(solution).attr('rowvector') ? true : false;
		var col_vector = jQuery(solution).attr('colvector') ? true : false;
		//if niether row vector nor column vector were specified, try to guess based on the input array
		//by the end of this statement, one of row_vector or col_vector will be true
		if ( array[0].length > 1 && col_vector === false ) {
			row_vector = true;
		} else if ( row_vector === false ) {
			col_vector = true;
		}
		
		//format our array to be liked an n x 1 or 1 x n matrix depending on the value of row_vector and col_vector
		var flattened = jQuery.map(array, function(x){ return x; });
		if ( row_vector ) {
			array = [flattened];
		}
		if ( col_vector ) {
			array = jQuery.map(flattened, function(x){ return [[x]]; });
		}

		return Khan.answerTypes.matrix( solutionarea, solution, array, false );

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
			var ratExp = /^(-?[0-9]+)(?:\/([0-9]+))?$/;

			if ( correct.match( "/" ) ) {
				correct = jQuery.tmpl.getVAR( correct );
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

		// Iterate in reverse so the *first* input is focused
		jQuery( solutionarea.find( ".sol" ).get().reverse() ).each(function() {
			var type = jQuery( this ).data( "type" );
			type = type != null ? type : "text";

			var sol = jQuery( this ).clone(),
				solarea = jQuery( this ).empty();

			var fallback = sol.data( "fallback" ),
				validator = Khan.answerTypes[type]( solarea, sol, fallback );

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
			possibleChoices.splice( 0, 0, solution );
		}

		var dupes = {};
		var shownChoices = [];
		for ( var i = 0; i < possibleChoices.length && shownChoices.length < numChoices; i++ ) {
			var choice = jQuery( possibleChoices[i] );
			choice.runModules();

			if ( isCategory && solution.text() === choice.text() ) {
				choice.data( "correct", true );
			}

			if ( !dupes[ choice.text() ] ) {
				dupes[ choice.text() ] = true;

				shownChoices.push( choice );
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

		return function() {
			var choice = list.find("input:checked");
			if ( noneIsCorrect ) {
				choice.next()
					.fadeOut( "fast", function() {
						jQuery( this ).replaceWith( list.data( "real-answer" ) )
							.fadeIn( "fast" );
					})
			}
			return choice.val() === "1";
		};
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

		return function() {
			return verifier( correct, input.val() );
		};
	},

	primeFactorization: function( solutionarea, solution ) {
		var verifier = function( correct, guess ) {
			guess = guess.split(" ").join("").toLowerCase();
			guess = KhanUtil.sortNumbers( guess.split( "x" ) ).join( "x" );
			return guess === correct;
		}
		return Khan.answerTypes.text( solutionarea, solution, verifier );
	}
} );
