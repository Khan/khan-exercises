// Add in the site stylesheet
var link = document.createElement("link");
link.rel = "stylesheet";
link.href = "../khan-exercise.css";
document.documentElement.appendChild( link );

// The list of loaded modules
var modules = (document.documentElement.getAttribute("data-require") || "").split(" ");

// Populate this with modules
var KhanUtil = {};

// Load query string params
var query = queryString();

loadScripts( [ "https://ajax.googleapis.com/ajax/libs/jquery/1.6.1/jquery.min.js" ], function() {
	// Load module dependencies
	loadScripts( jQuery.map( modules, function( name ) {
		return "../utils/" + name + ".js";
	}), function() {
	
		jQuery(function() {
			// Inject the site markup, if it doesn't exist
			injectSite();
		
			// Generate the initial problem when dependencies are done being loaded
			makeProblem();
	
			// Watch for a solution submission
			jQuery("form").submit(function() {
				// Get the solution to the problem
				var solution = jQuery("#workarea").children().data("solution");
				var isCorrect;
		
				// We get the answer differently if it's a text input or a radio
				if ( jQuery("#solution").is("div") ) {
					// radio
					isCorrect = jQuery("#solution input:checked").data("is-correct");
			
				} else {
					// text input
					answer = jQuery("#solution").val();
					isCorrect = ( answer === solution );
				}
		
				// Verify the solution
				if ( isCorrect ) {
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
		});
	});
	
	// Pick a random element from a set of elements
	jQuery.fn.getRandom = function() {
		return this.eq( Math.floor( this.length * Math.random() ) );
	};
	
	// Run the methods provided by a module against some elements
	jQuery.fn.runModules = function( type ) {
		type = type || "";
		
		return this.each(function( i, elem ) {
			elem = jQuery( elem );
			
			// Run the main method of any modules
			jQuery.each( modules, function( i, name ) {
				if ( jQuery.fn[ name + type ] ) {
					elem[ name + type ]();
				}
			});
		});
	};
});

function makeProblem() {
	jQuery(".exercise").each(function() {
		var exercise = jQuery(this);
		
		// Run the "Load" method of any modules
		exercise.runModules( "Load" );
	
		// Get the problem we'll be using
		var problems = exercise.find(".problems").children(),
			problem;
		
		// Check to see if we want to test a specific problem
		if ( query.problem ) {
			problem = /^\d+$/.test( query.problem ) ?
				// Access a problem by number
				problems.eq( parseFloat( query.problem ) ) :
				
				// Or by its ID
				problems.filter( "#" + query.problem );
		
		} else {
			problem = problems.getRandom();
		}
		
		// Work with a clone to avoid modifying the original
		problem = problem.clone();
	
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
		
		// Run the main method of any modules
		problem.runModules();
	
		// Store the solution to the problem
		var solution = problem.find(".solution").remove();
	
		problem.data( "solution", solution.text() );
	
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
				radios.push( "None of these." );
			
				// The right answer is injected most of the time
				if ( Math.random() > 1 / num ) {
					radios.push( solution.html() );
			
				// But sometimes "None of these." is the right answer
				} else {
					problem.data( "solution", "None of these." );
				}
			}
		
			// And add them in in a random order
			while ( radios.length < num ) {
				var item = possible.splice( Math.floor( possible.length * Math.random() ), 1 )[0];
				radios.splice( Math.floor( radios.length * Math.random() ), 0, item );
			}
		
			jQuery( "<div id='solution'>" +
				jQuery.map( radios, function( value ) {
					// TODO: This is very gnarly and should be refactored
					var inValue = value && value.nodeType ? jQuery(value).text() : value,
						htmlValue = value && value.nodeType ? jQuery(value).html() : value;

					var isCorrect;
					if (jQuery(value).text() === problem.data("solution") || value === problem.data("solution")) {
						isCorrect = "data-is-correct = '1'";
					} else {
						isCorrect = "";
					}
					return "<label><input type='radio' name='solution' " + isCorrect + " value='" + inValue + "'/> <span>" + htmlValue + "</span></label><br/>";
				}).join("") +
			"</div>" )
			
				// Run the main method of any modules
				.runModules()
			
				// Replace the existing solution
				.replaceAll( "#solution" );
		}
	
		// Add the problem into the page
		jQuery("#workarea").append( problem );
	
		// Clone the hints and add them into their area
		var hints = exercise.children(".hints").clone();
	
		// Extract any problem-specific hints
		problem.find(".hints").remove().children().each(function() {
			// Replace the hint placeholders
			hints.find("." + this.className).replaceWith( this );
		});
	
		hints
			// Run the main method of any modules
			.runModules()
		
			// Hide all the hints
			.children().hide().end()
		
			// And give it a new ID
			.attr("id", "shown-hints")
		
			// Add it in to the page
			.appendTo("#hintsarea");
	});
}

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

function loadScripts( urls, callback ) {
	var loaded = 0,
		loading = urls.length;
	
	// Ehhh... not a huge fan of this
	this.scriptWait = function( callback ) {
		loading++;
		callback( runCallback );
	};

	for ( var i = 0; i < loading; i++ ) (function( url ) {
		var script = document.createElement("script");
		script.src = url;
		script.onload = runCallback;
		document.documentElement.appendChild( script );
	})( urls[i] );

	runCallback( true );
	
	function runCallback( check ) {
		if ( check !== true ) {
			loaded++;
		}
		
		if ( callback && loading === loaded ) {
			callback();
		}
	}
}

// Original from:
// http://stackoverflow.com/questions/901115/get-querystring-values-in-javascript/2880929#2880929
function queryString() {
	var urlParams = {},
		e,
        a = /\+/g,  // Regex for replacing addition symbol with a space
        r = /([^&=]+)=?([^&]*)/g,
        d = function (s) { return decodeURIComponent(s.replace(a, " ")); },
        q = window.location.search.substring(1);

    while ( (e = r.exec(q)) ) {
       urlParams[d(e[1])] = d(e[2]);
	}
		
	return urlParams;
}