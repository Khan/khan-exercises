// Add in the site stylesheet
var link = document.createElement("link");
link.rel = "stylesheet";
link.href = "../khan-exercise.css";
document.documentElement.appendChild( link );

loadScripts( [
	"http://code.jquery.com/jquery.js",
	"http://cdn.mathjax.org/mathjax/latest/MathJax.js"
], function() {
	// We don't want to use inline script elements, we want to use code blocks
	MathJax.Hub.elementScripts = function( elem ) {
		return elem.nodeName.toLowerCase() === "code" ?
			[ elem ] :
			elem.getElementsByTagName( "code" );
	};
	
	jQuery(function() {
		// Inject the site markup, if it doesn't exist
		injectSite();
		
		// Load in utility module dependencies
		loadScripts( $.map( ($("html").data("require") || "").split(" "), function( name ) {
			return "../utils/" + name + ".js";
		
		// Generate the initial problem when dependencies are done being loaded
		}), makeProblem );
	
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
	
	// Pick a random element from a set of elements
	jQuery.fn.getRandom = function() {
		return this.eq( Math.floor( this.length * Math.random() ) );
	};
	
	jQuery.fn.math = function() {
		return this.find("code").each(function() {
			if ( this.className ) {
				jQuery( this ).wrap( "<span class='" + this.className + "'></span>" );
			}
			
			// Trick MathJax into thinking that we're dealing with a script block
			this.type = "math/tex";
				
			// Make sure that the old value isn't being displayed anymore
			this.style.display = "none";
				
			// Stick the processing request onto the queue
			MathJax.Hub.Queue([ "Typeset", MathJax.Hub, this ]);
		}).end();
	};
	
	initVARS();
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
	
	// Run the math formulas through MathJax
	problem.math();
	
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
			radios.push( "None of the above." );
			
			// The right answer is injected most of the time
			if ( Math.random() > 1 / num ) {
				radios.push( solution.html() );
			
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
		
		jQuery( "<div id='solution'>" +
			jQuery.map( radios, function( value ) {
				// TODO: This is gnarly and should be refactored
				var inValue = value && value.nodeType ? jQuery(value).text() : value,
					htmlValue = value && value.nodeType ? jQuery(value).html() : value;
				return "<label><input type='radio' name='solution' value='" + inValue + "'/> <span>" + htmlValue + "</span></label><br/>";
			}).join("") +
		"</div>" )
		
			// Run the math formulas through MathJax
			.math()
			
			// Replace the existing solution
			.replaceAll( "#solution" );
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
		
		// Run the math formulas through MathJax
		.math()
		
		// Hide all the hints
		.children().hide().end()
		
		// And give it a new ID
		.attr("id", "shown-hints")
		
		// Add it in to the page
		.appendTo("#hintsarea");
}

function initVARS() {
	var VARS = {};
	
	// Load the value associated with the variable
	jQuery.fn.loadVAR = function() {
		return this.each(function() {
			VARS[ this.id ] = getVAR( this );
		});
	};
	
	jQuery.fn.replaceVAR = function() {
		return this.replaceWith(function( i, text ) {
			return document.createTextNode( getVAR( i, text ) );
		});
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
				with ( KhanUtil ) {
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
	var loaded = 0;

	for ( var i = 0; i < urls.length; i++ ) (function( url ) {
		var script = document.createElement("script");
		script.src = url;
		script.onload = function() {
			if ( callback && urls.length === ++loaded ) {
				callback();
			}
		};
	
		// There is no god.
		// I will personally gut punch whoever thought this was a good API design
		if ( /mathjax/i.test( url ) ) {
			script.text = 'MathJax.Hub.Config({\
				messageStyle: "none",\
				skipStartupTypeset: true,\
				jax: ["input/TeX","output/HTML-CSS"],\
				extensions: ["tex2jax.js","MathMenu.js","MathZoom.js"],\
				TeX: {\
					extensions: ["AMSmath.js","AMSsymbols.js","noErrors.js","noUndefined.js"]\
				}\
			});';
		}
	
		document.documentElement.appendChild( script );
	})( urls[i] );
	
	if ( urls.length === 0 && callback ) {
		callback();
	}
}

// Populate this with modules
var KhanUtil = {};