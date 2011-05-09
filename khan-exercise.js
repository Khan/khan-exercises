jQuery(function() {
	// Inject the site markup, if it doesn't exist
	injectSite();
	
	// Generate the initial problem
	makeProblem();
	
	// Watch for a solution submission
	jQuery("form").submit(function() {
		// Get the solution to the problem
		var solution = jQuery("#workarea").children().data("solution"),
		
			// We get the answer differently if it's a text input or a radio
			answer = jQuery("#solution").is("div") ?
				jQuery("#solution input:checked").val() :
				jQuery("#solution").val();
		
		// Verify the solution
		if ( answer === solution ) {
			// Show a congratulations message
			jQuery("#congrats").show().delay( 1000 ).fadeOut( 2000 );
			
			// Toggle the navigation buttons
			jQuery("#check").hide();
			jQuery("#next").show();
		
		// Otherwise show an error message
		} else {
			jQuery("#oops").show().delay( 1000 ).fadeOut( 2000 );
		}
		
		return false;
	});
	
	// Watch for when the next button is clicked
	jQuery("#next").click(function() {
		// Erase the old value
		jQuery("#solution").val( "" );
		
		// Toggle the navigation buttons
		jQuery("#check").show();
		jQuery("#next").hide();
		
		// Wipe out any previous problem
		jQuery("#workarea, #hintsarea").empty();
		
		// Generate a new problem
		makeProblem();
		
		return false;
	});
	
	// Watch for when the "Get a Hint" button is clicked
	jQuery("#gethint").click(function() {
		// Show the first not shown hint
		jQuery("#shown-hints > *:hidden:first").show();
	});
	
	// TODO: Loop through the <code> examples and convert them to nice math
});

function makeProblem() {			
	// Load all the variables from the page
	jQuery("#vars").children().loadVAR();
	
	// Get the problem we'll be using
	var problem = jQuery("#problems").children().getRandom().clone();
	
	// See if there's an original problem that we're inheriting from
	if ( problem.data("type") ) {
		// Clone it for manipulation
		var original = jQuery("#" + problem.data("type")).clone();
		
		// Go through the components of the sub-problem
		problem.children().each(function() {
			// Remove those parts from the original
			original.children( "." + this.className ).remove();
			// And add our new ones in, instead
			original.append( problem );
		});
		
		problem = original;
	}
	
	// Replace all the variables with their values
	problem.find("var").replaceVAR();
	
	// Store the solution to the problem
	problem.data( "solution", problem.find(".solution").remove().text() );
	
	var choices = problem.find(".choices").remove();
	
	if ( choices.length ) {
		var radios = [],
			// Figure out how many choices to show
			num = parseFloat( choices.data("show") );
		
		// Go through the possible wrong answers
		var possible = choices.children().get();
		
		// Figure out the solution to display
		// If "none" is a possibility, make it a correct answer sometimes
		if ( choices.data("none") ) {
			radios.push( "None of the above." );
			
			// The right answer is injected most of the time
			if ( Math.random() > 1 / num ) {
				radios.push( problem.data("solution") );
			
			// But sometimes "None of the above." is the right answer
			} else {
				problem.data( "solution", "None of the above." );
			}
		}
		
		// And add them in in a random order
		while ( radios.length < num ) {
			var item = possible.splice( Math.floor( possible.length * Math.random() ), 1 )[0];
			radios.splice( Math.floor( radios.length * Math.random() ), 0, item );
		}
		
		jQuery("#solution").replaceWith( "<div id='solution'>" +
			jQuery.map( radios, function( value ) {
				value = value && value.nodeType ? jQuery(value).text() : value;
				return "<input type='radio' name='solution' value='" + value + "'/> " + value + "<br/>";
			}).join("") +
		"</div>" );
	}
	
	// Add the problem into the page
	jQuery("#workarea").append( problem );
	
	// Clone the hints and add them into their area
	var hints = jQuery("#hints").clone();
	
	// Extract any problem-specific hints
	problem.find(".hint").remove().children().each(function() {
		// Replace the hint placeholders
		hints.find("." + this.className).replaceWith( this );
	});
	
	hints
		// Be sure to replace the vars with the correct values
		.find("var").replaceVAR().end()
		
		// Hide all the hints
		.children().hide().end()
		
		// And give it a new ID
		.attr("id", "shown-hints")
		
		// Add it in to the page
		.appendTo("#hintsarea");
}

// Pick a random element from a set of elements
jQuery.fn.getRandom = function() {
	return this.eq( Math.floor( this.length * Math.random() ) );
};

(function() {
	var VARS = {};
	
	// Load the value associated with the variable
	jQuery.fn.loadVAR = function() {
		return this.each(function() {
			VARS[ this.id ] = getVAR( this );
		});
	};
	
	jQuery.fn.replaceVAR = function() {
		return this.text( getVAR );
	};

	function getVAR( elem, text ) {
		// If it's a list, grab a random one out of it
		if ( elem.nodeName && elem.nodeName.toLowerCase() === "ul" ) {
			return jQuery( elem ).children().getRandom().text();
	
		// Otherwise we need to compute the value
		} else {
			var text = (elem.nodeName ? jQuery(elem).text() : text);
			
			try {
				// Use the methods provided by the library
				with ( Util ) {
					// And the methods from JavaScript's builtin Math methods
					with ( Math ) {
						// Use all the computed variables
						with ( VARS ) {
							return eval( "(" + text  + ")" );
						}
					}
				}
			} catch( e ) {
				if ( typeof console !== "undefined" ) {
					console.error( text, e );
				}
			}
		}
	}

	var Util = {
		// A simple random number picker
		rand: function( num ) {
			return Math.round( num * Math.random() );
		}
	};
})();

function injectSite() {
	jQuery("body").prepend(
		'<h1>' + document.title + '</h1>' +
		'<div id="sidebar">' +
			'<form action="">' +
				'<h3>Answer</h3>' +
				'<br/><input type="text" id="solution"/>' +
				'<input type="submit" id="check" value="Check Answer"/>' +
				'<br/><input type="button" id="next" value="Next Problem"/>' +
				'<p id="congrats">Congratulations! That answer is correct.</p>' +
				'<p id="oops">Oops! That answer is not correct, please try again.</p>' +
			'</form>' +
			'<div id="help">' +
				'<h3>Need Help?</h3>' +
				'<br/><input type="button" id="gethint" value="Get a Hint"/>' +
			'</div>' +
		'</div>' +
		'<div id="workarea"></div>' +
		'<div id="hintsarea"></div>'
	);
}