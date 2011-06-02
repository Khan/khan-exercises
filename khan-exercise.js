// Add in the site stylesheet
(function(){
	var link = document.createElement("link");
	link.rel = "stylesheet";
	link.href = "../khan-exercise.css";
	document.documentElement.appendChild( link );
})();

// The main Khan Module
var Khan = {
	// The list of loaded modules
	modules: (document.documentElement.getAttribute("data-require") || "").split(" "),
	
	// The base modules needed to make a problem
	baseModules: [ "answer-types", "template-inheritance", "math-random" ],
	
	// Populate this with modules
	Util: {},
	
	// Load in a collection of scripts, execute callback upon completion
	loadScripts: function( urls, callback ) {
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
	},

	// Query String Parser
	// Original from:
	// http://stackoverflow.com/questions/901115/get-querystring-values-in-javascript/2880929#2880929
	queryString: function() {
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
	},
	
	// Display error messages
	error: function( msg ) {
		if ( typeof console !== "undefined" ) {
			console.error( msg );
		}
	},
	
	makeProblem: function() {
		jQuery(".exercise").each(function() {
			var exercise = jQuery(this);

			// Run the "Load" method of any modules
			exercise.runModules( "Load" );

			// Get the problem we'll be using
			var problems = exercise.find(".problems").children(),
		  		problem;

			// Check to see if we want to test a specific problem
			if ( Khan.query.problem ) {
				problem = /^\d+$/.test( Khan.query.problem ) ?
					// Access a problem by number
					problems.eq( parseFloat( Khan.query.problem ) ) :

				// Or by its ID
				problems.filter( "#" + Khan.query.problem );

			// Otherwise we grab a problem at random
			// (grouped by any sort of weights that exist)
			} else {
				problem = problems.getRandomWeighted();
			}

			// Work with a clone to avoid modifying the original
			problem = problem.clone();

			// If there's an original problem, add inherited elements
			var parentType = problem.data( "type" );

			while ( parentType ) {
				// Copy over the parent element to the child
				var original = jQuery("#" + parentType).clone();
				problem.prepend( original.children() );

				// Keep copying over the parent elements (allowing for deep inheritance)
				parentType = original.data( "type" );
			}

			// Add any global exercise defined elements
			problem.prepend( exercise.children( ':not(.problems)' ).clone() );

			// Apply templating
			var children = problem
				// vars and hints blocks append their contents to the parent
				.find( ".vars, .hints" ).tmplApply( { attribute: "class", defaultApply: "appendContents" } ).end()

				// Individual variables override other variables with the name name
				.find( ".vars [id]" ).tmplApply().end()

				// We also look at the main blocks within the problem itself to override
				.children( "[class]" ).tmplApply( { attribute: "class" } );

			// Finally we do any inheritance to the individual child blocks (such as problem, question, etc.)
			children.each(function () {
				// Apply while adding problem.children() to include
				// template definitions within problem scope
				jQuery( this ).find( "[id]" ).add( children ).tmplApply();
			});

			// Run the "Load" method of any modules
			problem.runModules( "Load" );

			// Run the main method of any modules
			problem.runModules();

			// Store the solution to the problem
			var solution = problem.find(".solution"),

				// Get the multiple choice problems
				choices = problem.find(".choices"),

				// Get the area into which solutions will be inserted,
				// Removing any previous answer
				solutionarea = jQuery("#solution").empty(),

				// See if we're looking for a specific style of answer
				answerType = solution.data("type");

			// Make sure that the answer type exists
			if ( answerType ) {
				if ( Khan.answerTypes && !Khan.answerTypes[ answerType ] ) {
					return Khan.error( "Unknown answer type specified: " + answerType );
				}
			}

			if ( !answerType ) {
				// If a multiple choice block exists
				if ( choices.length ) {
					answerType = "radio";

				// Otherwise we assume a basic text input
				} else {
					answerType = "text";
				}
			}

			Khan.validator = Khan.answerTypes[answerType]( solutionarea, solution );

			if( !Khan.validator ) {
				return Khan.error( "Error generating answer validator for problem." );
			}

			// Remove the solution and choices elements from the display
			solution.remove();
			choices.remove();

			// Add the problem into the page
			jQuery("#workarea").append( problem );

			// Add the hints into the page
			problem.find(".hints")
				// Hide all the hints
				.children().hide().end()

				// And give it a new ID
				.attr("id", "shown-hints")

				// Run the "Load" method of any modules
				.runModules( "Load" )

				// Add it in to the page
				.appendTo("#hintsarea");
		});
	},

	injectSite: function() {
		jQuery("body").prepend(
			'<h1>' + document.title + '</h1>' +
			'<div id="sidebar">' +
				'<form action="">' +
					'<h3>Answer</h3>' +
					'<div id="solution"></div>' +
					'<input type="submit" id="check" value="Check Answer"/>' +
					'<p id="congrats">Congratulations! That answer is correct.</p>' +
					'<p id="oops">Oops! That answer is not correct, please try again.</p>' +
					'<input type="button" id="next" value="Next Problem"/>' +
				'</form>' +
				'<div id="help">' +
					'<h3>Need Help?</h3>' +
					'<input type="button" id="gethint" value="Get a Hint"/>' +
				'</div>' +
			'</div>' +
			'<div id="workarea"></div>' +
			'<div id="hintsarea"></div>'
		);

		// Watch for a solution submission
		jQuery("form").submit(function() {
			// Figure out if the response was correct
			if ( Khan.validator() ) {
				// Show a congratulations message
				jQuery("#oops").hide();
				jQuery("#congrats").show();

				// Toggle the navigation buttons
				jQuery("#check").hide();
				jQuery("#next").show().focus();

			// Otherwise show an error message
			} else {
				jQuery("#oops").show().delay( 1000 ).fadeOut( 2000 );
			}

			return false;
		});

		// Watch for when the next button is clicked
		jQuery("#next").click(function() {
			// Erase the old value and hide congrats message
			jQuery("#congrats").hide();

			// Toggle the navigation buttons
			jQuery("#check").show();
			jQuery("#next").blur().hide();

			// Wipe out any previous problem
			jQuery("#workarea, #hintsarea").empty();

			// Generate a new problem
			Khan.makeProblem();

			return false;
		});

		// Watch for when the "Get a Hint" button is clicked
		jQuery("#gethint").click( showHint );

		function showHint() {
			// Show the first not shown hint
			var hint = jQuery("#shown-hints > *:hidden:first")

				// Run the main method of any modules
				.runModules()

				// Reveal the hint
				.show();
		}
	}
};

// Load query string params
Khan.query = Khan.queryString();

// Make this publicly accessible
var KhanUtil = Khan.Util;

// Load in jQuery
Khan.loadScripts( [ "https://ajax.googleapis.com/ajax/libs/jquery/1.6.1/jquery.min.js" ], function() {
				
	// Load module dependencies
	Khan.loadScripts( jQuery.map( Khan.baseModules.concat( Khan.modules ), function( name ) {
		return "../utils/" + name + ".js";
	}), function() {
		
		jQuery(function() {			
			// Inject the site markup, if it doesn't exist
			Khan.injectSite();
			
			// Generate the initial problem when dependencies are done being loaded
			Khan.makeProblem();
		});
	});
	
	jQuery.fn.extend({
		// Pick a random element from a set of elements
		getRandom: function() {
			return this.eq( Math.floor( this.length * KhanUtil.random() ) );
		},
	
		// Pick a random element from a set of elements, using weights stored in
		// [data-weight], assuming 1 otherwise
		getRandomWeighted: function() {
			var totalWeight = 0,
		
				// Collect and compute the weights for the problems
				// Also generate the total weight
				weights = jQuery.map( this, function( elem, i ) {
					var weight = jQuery(elem).data("weight");
					weight = weight !== undefined ? weight : 1;
					totalWeight += weight;
					return weight;
				}),
			
				// Figure out which item we're going to pick
				index = totalWeight * KhanUtil.random();

			for ( var i = 0; i < this.length; i++ ) {
				if ( index < weights[i] ) {
					return this.eq( i );
			
				} else {
					index -= weights[i];
				}
			}
		
			return this.eq( this.length - 1 );
		},
		
		// Run the methods provided by a module against some elements
		runModules: function( type ) {
			type = type || "";

			return this.each(function( i, elem ) {
				elem = jQuery( elem );

				// Run the main method of any modules
				jQuery.each( Khan.modules, function( i, name ) {
					if ( jQuery.fn[ name + type ] ) {
						elem[ name + type ]();
					}
				});
			});
		}
	});

	// See if an element is detached
	jQuery.expr[":"].attached = function( elem ) {
		return jQuery.contains( elem.ownerDocument.documentElement, elem );
	};
});