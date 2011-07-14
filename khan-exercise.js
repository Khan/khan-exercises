// Add in the site stylesheets
(function(){
	var link = document.createElement("link");
	link.rel = "stylesheet";
	link.href = "../css/khan-site.css";
	document.getElementsByTagName('head')[0].appendChild(link);
	
	link = document.createElement("link");
	link.rel = "stylesheet";
	link.href = "../css/khan-exercise.css";
	document.getElementsByTagName('head')[0].appendChild(link);
})();

// The main Khan Module
var Khan = {
	modules: {},

	moduleDependencies: {
		// Yuck! There is no god. John will personally gut punch whoever
		// thought this was a good API design.
		"math": [ {
			src: "http://cdn.mathjax.org/mathjax/latest/MathJax.js",
			text: "MathJax.Hub.Config({\
				messageStyle: \"none\",\
				skipStartupTypeset: true,\
				jax: [\"input/TeX\",\"output/HTML-CSS\"],\
				extensions: [\"tex2jax.js\",\"MathMenu.js\",\"MathZoom.js\"],\
				TeX: {\
					extensions: [\"AMSmath.js\",\"AMSsymbols.js\",\"noErrors.js\",\"noUndefined.js\"],\
					Macros: {\
						RR: \"\\\\mathbb{R}\"\
					},\
					Augment: {\
						Definitions: {\
							macros: {\
								lrsplit: \"LRSplit\"\
							}\
						},\
						Parse: {\
							prototype: {\
								LRSplit: function( name ) {\
									var num = this.GetArgument( name ),\
										den = this.GetArgument( name );\
									var frac = MathJax.ElementJax.mml.mfrac( MathJax.InputJax.TeX.Parse( '\\\\strut\\\\textstyle{'+num+'\\\\qquad}', this.stack.env ).mml(),\
									                      MathJax.InputJax.TeX.Parse( '\\\\strut\\\\textstyle{\\\\qquad '+den+'}', this.stack.env ).mml() );\
					\
									frac.numalign = MathJax.ElementJax.mml.ALIGN.LEFT;\
									frac.denomalign = MathJax.ElementJax.mml.ALIGN.RIGHT;\
									frac.linethickness = \"0em\";\
					\
									this.Push( frac );\
								}\
							}\
						}\
					}\
				},\
				\"HTML-CSS\": {\
					scale: 100,\
					availableFonts: [\"TeX\"]\
				}\
			});\
			\
			// We don't want to use inline script elements, we want to use code blocks\n\
			MathJax.Hub.elementScripts = function( elem ) {\
				return elem.nodeName.toLowerCase() === \"code\" ?\
					[ elem ] :\
					elem.getElementsByTagName( \"code\" );\
			};\
			// Data is read in here:\n\
			// https://github.com/mathjax/MathJax/blob/master/unpacked/jax/input/TeX/jax.js#L1704\n\
			// We can force it to convert HTML entities properly by saying we're Konqueror\n\
			MathJax.Hub.Browser.isKonqueror = true;\
			\
			MathJax.Hub.Startup.onload();"
		}, "raphael" ],

		// Load Raphael locally because IE8 has a problem with the 1.5.2 minified release
		// http://groups.google.com/group/raphaeljs/browse_thread/thread/c34c75ad8d431544

		// The normal module dependencies.
		"calculus": [ "math", "expressions", "polynomials" ],
		"exponents": [ "math", "math-format" ],
		"kinematics": [ "math" ],
		"math-table": [ "math" ],
		"math-format": [ "math", "expressions" ],
		"polynomials": [ "math", "expressions" ],
		"stat": [ "math" ],
		"word-problems": [ "math" ]
	},

	require: function( mods ) {
		if ( mods == null ) {
			return;
		} else if ( typeof mods === "string" ) {
			mods = mods.split( " " );
		} else if ( !jQuery.isArray( mods ) ) {
			mods = [ mods ];
		}

		jQuery.each(mods, function( i, mod ) {
			var src, deps;

			if ( typeof mod === "string" ) {
				src = "../utils/" + mod + ".js";
				deps = Khan.moduleDependencies[ mod ];
				mod = {
					src: src,
					name: mod
				};
			} else {
				src = mod.src;
				deps = mod.dependencies;
				delete mod.dependencies;
			}

			if( !Khan.modules[ src ] ) {
				Khan.modules[ src ] = mod;
				Khan.require( deps );
			}

		});
	},

	// Populate this with modules
	Util: {
		// http://burtleburtle.net/bob/hash/integer.html
		// This is also used as a PRNG in the V8 benchmark suite
		random: function() {
			// Robert Jenkins' 32 bit integer hash function.
			var seed = Khan.randomSeed;
			seed = ( ( seed + 0x7ed55d16 ) + ( seed << 12 ) ) & 0xffffffff;
			seed = ( ( seed ^ 0xc761c23c ) ^ ( seed >>> 19 ) ) & 0xffffffff;
			seed = ( ( seed + 0x165667b1 ) + ( seed << 5 ) ) & 0xffffffff;
			seed = ( ( seed + 0xd3a2646c ) ^ ( seed << 9 ) ) & 0xffffffff;
			seed = ( ( seed + 0xfd7046c5 ) + ( seed << 3 ) ) & 0xffffffff;
			seed = ( ( seed ^ 0xb55a4f09 ) ^ ( seed >>> 16 ) ) & 0xffffffff;
			return ( Khan.randomSeed = ( seed & 0xfffffff ) ) / 0x10000000;
		}
	},

	// How many problems are we doing? (For the fair shuffle bag.)
	problemCount: 10,

	// Where we are in the shuffled list of problem types
	problemBagIndex: 0,

	dataDump: {
		"exercise": window.location.pathname.match(/[\/\\]([^\/\\]+)\.html/)[1],
		"problems": []
	},

	// Load in a collection of scripts, execute callback upon completion
	loadScripts: function( urls, callback ) {
		var loaded = 0,
			loading = urls.length,
			head = document.getElementsByTagName('head')[0];

		callback || ( callback = function() { } );

		for ( var i = 0; i < loading; i++ ) (function( mod ) {
			// Adapted from jQuery getScript (ajax/script.js)
			var script = document.createElement("script");
			script.async = "async";

			for ( var prop in mod ) {
				script[ prop ] = mod[ prop ];
			}

			script.onerror = function() {
				// No error in IE, but this is mostly for debugging during development so it's probably okay
				// http://stackoverflow.com/questions/2027849/how-to-trigger-script-onerror-in-internet-explorer
				Khan.error( "Error loading script " + script.src );
			};

			script.onload = script.onreadystatechange = function() {
				if ( !script.readyState || ( /loaded|complete/ ).test( script.readyState ) ) {
					// Handle memory leak in IE
					script.onload = script.onreadystatechange = null;

					// Remove the script
					if ( script.parentNode ) {
						script.parentNode.removeChild( script );
					}

					// Dereference the script
					script = undefined;

					runCallback();
				}
			};

			head.appendChild(script);
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
	error: function( ) {
		if ( typeof console !== "undefined" ) {
			console.error.apply( console, arguments );
		}
	},

	// Add up how much total weight is in each exercise so we can adjust for
	// it later
	weighExercises: function( problems ) {
		if ( jQuery( "body > .exercise" ).length > 1 ) {
			jQuery.map( problems, function( elem ) {
				elem = jQuery( elem );

				var exercise = elem.parents( ".exercise" ).eq( 0 );

				var exerciseTotal = exercise.data( "weight-sum" );
				exerciseTotal = exerciseTotal !== undefined ? exerciseTotal : 0;

				var weight = elem.data( "weight" );
				weight = weight !== undefined ? weight : 1;

				exercise.data( "weight-sum", exerciseTotal + weight );
			});
		}
	},

	// Create a set of n problems fairly from the weights - not random; it
	// ensures that the proportions come out as fairly as possible with ints
	// (still usually a little bit random).
	// There has got to be a better way to do this.
	makeProblemBag: function( problems, n ) {
		var bag = [], totalWeight = 0;

		if ( Khan.query.test != null ) {
			// Just do each problem 10 times
			jQuery.each( problems, function( i, elem ) {
				elem = jQuery( elem );
				elem.data( "id", elem.attr( "id" ) || "" + i );

				for( var j = 0; j < Khan.problemCount; j++ ) {
					bag.push( problems.eq( i ) );
				}
			} );

			Khan.problemCount = bag.length;

		} else {
			// Collect the weights for the problems and find the total weight
			var weights = jQuery.map( problems, function( elem, i ) {
				elem = jQuery( elem );

				var exercise = elem.parents( ".exercise" ).eq( 0 );
				var exerciseWeight = exercise.data( "weight" );
				exerciseWeight = exerciseWeight !== undefined ? exerciseWeight : 1;
				var exerciseTotal = exercise.data( "weight-sum" );

				var weight = elem.data( "weight" );
				weight = weight !== undefined ? weight : 1;

				if ( exerciseTotal !== undefined ) {
					weight = weight * exerciseWeight / exerciseTotal;
					elem.data( "weight", weight );
				}

				// Also write down the index/id for each problem so we can do
				// links to problems (?problem=17)
				elem.data( "id", elem.attr( "id" ) || "" + i );

				totalWeight += weight;
				return weight;
			});

			while( n ) {
				bag.push( (function() {
					// Figure out which item we're going to pick
					var index = totalWeight * KhanUtil.random();

					for ( var i = 0; i < problems.length; i++ ) {
						if ( index < weights[i] || i === problems.length - 1 ) {
							var w = Math.min( weights[i], totalWeight / ( n-- ) );
							weights[i] -= w;
							totalWeight -= w;
							return problems.eq( i );
						} else {
							index -= weights[i];
						}
					}

					// This will never happen
					return Khan.error("makeProblemBag got confused w/ index " + index);
				})() );
			}
		}

		return bag;
	},

	makeProblem: function( problemID, seed ) {
		// Allow passing in a random seed
		if ( typeof seed !== "undefined" ) {
			Khan.randomSeed = seed;
		}

		// Save the seed for later so we can show it when asked
		Khan.problemSeed = Khan.randomSeed;

		var problem;

		// Check to see if we want to test a specific problem
		problemID = typeof problemID !== "undefined" ? problemID : Khan.query.problem;
		if ( typeof problemID !== "undefined" ) {
			var problems = jQuery( "body > .exercise > .problems" ).children();

			problem = /^\d+$/.test( problemID ) ?
				// Access a problem by number
				problems.eq( parseFloat( problemID ) ) :

				// Or by its ID
				problems.filter( "#" + problemID );

		// Otherwise we grab a problem at random from the bag of problems
		// we made earlier to ensure that every problem gets shown the
		// appropriate number of times
		} else {
			problem = Khan.problemBag[ Khan.problemBagIndex ];
			problemID = problem.data( "id" );

			Khan.problemBagIndex = ( Khan.problemBagIndex + 1 ) % Khan.problemCount;
		}

		// Find which exercise this problem is from
		var exercise = problem.parents( ".exercise" ).eq( 0 );

		// Work with a clone to avoid modifying the original
		problem = problem.clone();

		// If there's an original problem, add inherited elements
		var parentType = problem.data( "type" );

		while ( parentType ) {
			// Copy over the parent element to the child
			var original = exercise.find( ".problems #" + parentType ).clone();
			problem.prepend( original.children().data( "inherited", true ) );

			// Keep copying over the parent elements (allowing for deep inheritance)
			parentType = original.data( "type" );
		}

		// Add any global exercise defined elements
		problem.prepend( exercise.children( ':not(.problems)' ).clone().data( "inherited", true ) );

		// Apply templating
		var children = problem
			// vars and hints blocks append their contents to the parent
			.find( ".vars" ).tmplApply( { attribute: "class", defaultApply: "appendVars" } ).end()

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

		// Remove and store hints to delay running modules on it
		Khan.hints = problem.children( ".hints" ).remove();

		// Hide the raw hints
		jQuery( "#rawhintsarea" ).hide();

		// Run the main method of any modules
		problem.runModules( problem, "Load" );
		problem.runModules( problem );

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
				Khan.error( "Unknown answer type specified: " + answerType );
				return;
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

		// Generate a type of problem
		// (this includes possibly generating the multiple choice problems,
		//  if this fails then we will need to try generating another one.)
		Khan.validator = Khan.answerTypes[answerType]( solutionarea, solution );

		// A working solution was not generated
		if ( !Khan.validator ) {
			// Making the problem failed, let's try again
			Khan.makeProblem();
			return;
		}

		// Remove the solution and choices elements from the display
		solution.remove();
		choices.remove();

		// Add the problem into the page
		jQuery( "#workarea" ).append( problem );

		// Save the raw hints so they can be modified later
		Khan.rawHints = Khan.hints.clone()

			// FIXME: Should apply templating here without rendering MathJax, but
			// that's currently not possible.
			.tmpl()

			// Save as a normal JS array so we can use shift() on it later
			.children().get();

		// Save the rendered hints so we can display them later
		Khan.hints = Khan.hints

			// Do all the templating
			.tmpl()

			// Save as a normal JS array so we can use shift() on it later
			.children().get();

		if ( Khan.hints.length === 0 ) {
			// Disable the get hint button
			jQuery("#hint").attr( "disabled", true );
		}

		// Hook out for exercise test runner
		if ( parent !== window && typeof parent.jQuery !== "undefined" ) {
			parent.jQuery( parent.document ).trigger( "problemLoaded" );
		}

		// Save problem info in dump data for testers
		if ( Khan.query.test != null ) {
			var testerInfo = jQuery( "#tester-info" );

			var lastProblem = {
				seed: Khan.problemSeed,
				type: problemID,
				VARS: jQuery.tmpl.VARS,
				solution: Khan.validator.solution
			};

			// Clone lastProblem to avoid some straaaange bugs
			lastProblem = JSON.parse( JSON.stringify( lastProblem ) );
			Khan.dataDump.problems.push( lastProblem );

			jQuery( testerInfo ).find( ".problem-no" )
				.text( Khan.dataDump.problems.length + " of " + Khan.problemCount );

			var answer = jQuery( testerInfo ).find( ".answer" ).empty();

			var displayedSolution = Khan.validator.solution;
			if ( !jQuery.isArray( displayedSolution ) ) {
				displayedSolution = [ displayedSolution ];
			}

			jQuery.each( displayedSolution, function( i, el ) {
				jQuery( "<span>" ).text( el ).addClass( "box" ).appendTo( answer );
			} );
		}

		// Show the debug info
		if ( Khan.query.debug != null ) {
			jQuery( "body" ).keypress( function( e ) {
				if ( e.charCode === 104 ) {
					jQuery("#hint").click();
				}
			});
			var debugWrap = jQuery( "#debug" ).empty();
			var debugURL = window.location.protocol + "//" + window.location.host + window.location.pathname
				+ "?debug&problem=" + problemID;

			jQuery( "<h3>Debug Info</h3>" ).appendTo( debugWrap );

			var src = exercise.data("src");
			if ( src != null ) {
				var srcInfo = jQuery( "<p>" ).appendTo( debugWrap );
				srcInfo.append( "From " );

				jQuery( "<a>" )
					.text( src )
					.attr( "href", src + "?debug" )
					.appendTo( srcInfo );
			}

			var links = jQuery( "<p>" ).appendTo( debugWrap );
			jQuery( "<a>Problem permalink</a>" )
				.attr( "href", debugURL + "&seed=" + Khan.problemSeed )
				.appendTo( links );

			links.append("<br>");
			links.append("Problem type: ");

			jQuery( "<a>" )
				.text( problemID )
				.attr( "href", debugURL )
				.appendTo( links );

			if ( typeof jQuery.tmpl.VARS !== "undefined" ) {
				var varInfo = jQuery( "<p>" );

				jQuery.each( jQuery.tmpl.VARS, function( name, value ) {
					var str;

					if ( typeof value === "function") {
						str = value.toString();
					} else {
						// JSON is prettier (when it works)
						try {
							str = JSON.stringify( value );
						} catch ( e ) {
							str = value.toString();
						}
					}

					varInfo.append( jQuery( "<b>" ).text( name ) );
					varInfo.append( ": " );
					varInfo.append( jQuery( "<var>" ).text( str ) );
					varInfo.append( "<br>" );
				});

				varInfo.appendTo( debugWrap );
			}

			// for special style rules
			jQuery( "body" ).addClass("debug");
		}
	},

	injectSite: function( html ) {
		jQuery("body").prepend( html );
		
		jQuery(".exercise-title").text( document.title );

		// Hide exercies summaries for now
		// Will figure out something more elegant to do with them once the new
		// framework is shipped and we can worry about rounding out the summaries
		jQuery( ".summary" ).hide();

		// Watch for a solution submission
		jQuery("#check-answer-button").click(function(ev) {
			// Figure out if the response was correct
			if ( Khan.validator() ) {
				// Show a congratulations message
				jQuery("#oops").hide();
				jQuery("#congrats").show();

				// Toggle the navigation buttons
				jQuery("#check-answer-button").hide();
				
				if ( Khan.query.test == null ) {
					jQuery("#next-container").show().find("input").focus();
				}
				
				jQuery("#happy").show();
				jQuery("#sad").hide();

			// Otherwise show an error message
			} else {
				jQuery("#oops").show().delay( 1000 ).fadeOut( 2000 );
				
				jQuery("#happy").hide();
				jQuery("#sad").show();
			}
		});

		// Watch for when the next button is clicked
		jQuery("#next-question-button").click(function(ev) {
			// Erase the old value and hide congrats message
			jQuery("#congrats").hide();
			
			jQuery("#happy").hide();

			// Toggle the navigation buttons
			jQuery("#check-answer-button").show();
			jQuery("#next-question-button").blur().parent().hide();

			// Wipe out any previous problem
			jQuery("#workarea, #hintsarea, #hintsbag").empty();
			jQuery("#hint").attr( "disabled", false );
			if ( Khan.scratchpad ) {
				Khan.scratchpad.clear();
			}

			if ( Khan.query.test != null && Khan.dataDump.problems.length >= Khan.problemCount ) {
				// Show the dump data
				jQuery( "#problemarea" ).append(
					"<p>Thanks! You're all done testing this exercise.</p>" +
					"<p>Please copy the text below and send it to us.</p>"
				);

				jQuery( "<textarea>" )
					.val( "Khan.testExercise(" + JSON.stringify( Khan.dataDump ) + ");" )
					.css({ width: "60%", height: "200px" })
					.prop( "readonly", true )
					.click( function() {
						this.focus();
						this.select();
					} )
					.appendTo( "#problemarea" );

				jQuery( "#sidebar" ).hide();
			} else {
				// Generate a new problem
				Khan.makeProblem();
			}
		});

		// Watch for when the "Get a Hint" button is clicked
		jQuery("#hint").click(function() {

			// Get the first hint and render left in the parallel arrays
			var hint = Khan.rawHints.shift(),
				render = Khan.hints.shift(),
				$hint = jQuery( hint ),
				$render = jQuery( render );

			if ( hint ) {

				var problem = $hint.parent();

				// If the hint has hint templating, then turn that hint templating into
				// normal inheritance templating, apply templating, and then re-render all
				// the hints.
				if ( $hint.data( "apply" ) && !$hint.data( "apply" ).indexOf( "hint" ) ) {

					// Revert the hint templating into normal inheritance
					$hint.data( "apply", $hint.data( "apply" ).split(/-/)[1] );

					// Apply templating, now that the hint template has been converted
					jQuery( "#rawhintsarea" ).append( $hint ).find( "[id]" ).tmplApply().end()

						// Re-render all the hints
						.clone().runModules( problem )

						// Replace the previously rendered hints
						.replaceAll( "#hintsarea" ).show().attr( "id", "hintsarea" );

				} else {

					// Inject the raw into the hidden raw area
					$hint.appendTo( "#rawhintsarea" );

					// Reveal the rendered hint
					$render.runModules( problem ).appendTo( "#hintsarea" );

				}

				if ( Khan.hints.length === 0 ) {

					// Disable the get hint button
					jQuery( this ).attr( "disabled", true );
				}
			}
		});

		jQuery( "#print_ten" ).data( "show", true )
			.click( function( e ) {
				e.preventDefault();

				var link = jQuery( this ),
					show = link.data( "show" );

				if ( show ) {
					link.text( "Try current problem" );
					jQuery( "#workarea" ).empty();
					jQuery( "#hintsarea" ).empty();
					for ( var i = 0; i < 10; i++ ) {
						Khan.makeProblem();
						jQuery( "#workarea" ).append( jQuery( "<hr/>" ) );
					}
					
				} else {
					link.text( "Show next 10 problems" );
					jQuery( "#workarea, #hintsarea, #rawhintsarea" ).empty();
					Khan.makeProblem();
				}

				jQuery( "#answerform input[type='button']" ).attr( "disabled", show );

				link.data( "show", !show );
			});

		jQuery( "#scratch_pad_show" ).data( "show", true )
			.click( function() {
				var button = jQuery( this ),
					show = button.data( "show" );
					
				if ( show ) {
					if ( !Khan.scratchpad ) {
						Khan.loadScripts( [ {src: "../utils/scratchpad.js"} ], function() {
							jQuery( "#scratchpad" ).show();
							
							Khan.scratchpad = new Scratchpad();
							Khan.scratchpad.offsetLeft = jQuery( "#scratchpad" ).offset().left;
							Khan.scratchpad.offsetTop = jQuery( "#scratchpad" ).offset().top;
							button.text( "Hide scratchpad" );
						} );
						
					} else {
						jQuery( "#scratchpad" ).show();
						button.text( "Hide scratchpad" );
					}
					
				} else {
					jQuery( "#scratchpad" ).hide();
					button.text( "Show scratchpad" );
				}

				button.data( "show", !show );
				
				return false
			});

		// Prepare for the tester info if requested
		if ( Khan.query.test != null ) {
			jQuery( "#answer_area" ).prepend(
				'<div id="tester-info" class="info-box">' +
					'<span class="info-box-header">Testing Mode</span>' +
					'<p><strong>Problem No.</strong> <span class="problem-no">hm.</span></p>' +
					'<p><strong>Answer:</strong> <span class="answer"></span></p>' +
					'<p>' +
						'<input type="button" class="pass button green" value="This problem was generated correctly.">' +
						'<input type="button" class="fail button orange" value="There is an error in this problem.">' +
					'</p>' +
				'</div>'
			);

			jQuery( "#tester-info .pass" ).click( function() {
				Khan.dataDump.problems[ Khan.dataDump.problems.length - 1 ].pass = true;
				jQuery( "#next-question-button" ).trigger( "click" );
			} );

			jQuery( "#tester-info .fail" ).click( function() {
				Khan.dataDump.problems[ Khan.dataDump.problems.length - 1 ].pass =
					prompt( "Please write a short description of the error, then click OK." );
				jQuery( "#next-question-button" ).trigger( "click" );
			} );
		}

		// Prepare for the debug info if requested
		if ( Khan.query.debug != null ) {
			jQuery( '<div id="debug"></div>' ).appendTo( "#answer_area" );
		}
	}
};

// Load query string params
Khan.query = Khan.queryString();

// Seed the random number generator
Khan.randomSeed = parseFloat( Khan.query.seed ) || ( new Date().getTime() & 0xffffffff );

// Make this publicly accessible
var KhanUtil = Khan.Util;

// Load in jQuery
Khan.loadScripts( [ { src: "https://ajax.googleapis.com/ajax/libs/jquery/1.6.2/jquery.min.js" } ], function() {

	// Base modules required for every problem
	Khan.require( [ "answer-types", "tmpl" ] );

	Khan.require( document.documentElement.getAttribute("data-require") );

	var remoteCount = 0;

	function loadExercise() {
		var self = jQuery( this );
		var src = self.data( "src" );
		var weight = self.data( "weight" );
		var dummy = jQuery( "<div>" );

		remoteCount++;
		dummy.load( src + " .exercise", function( data, status, xhr ) {
			var match, newContents;

			if ( !( /success|notmodified/ ).test( status ) ) {
				// Maybe loading from a file:// URL?
				Khan.error( "Error loading exercise from file " + src + ": " + xhr.status + " " + xhr.statusText );
				return;
			}

			newContents = dummy.contents();
			self.replaceWith( newContents );

			// Maybe the exercise we just loaded loads some others
			newContents.find( ".exercise[data-src]" ).each( loadExercise );

			// Save the filename and weights
			newContents.filter( ".exercise" ).data( "src", src );
			newContents.filter( ".exercise" ).data( "weight", weight );

			// Extract data-require
			var requires = data.match( /<html(?:[^>]+)data-require=(['"])((?:(?!\1).)*)\1/ );

			if ( requires != null ) {
				requires = requires[ 2 ];
			}

			Khan.require( requires );

			// Extract title
			var rtitle = /<title>([^<]*(?:(?!<\/title>)<[^<]*)*)<\/title>/gi;
			while ( ( match = rtitle.exec( data ) ) != null ) {
				newContents.filter( ".exercise" ).data( "title", match[1] );
			}

			// Extract scripts with no src
			var rscript = /<(?:)script\b[^s>]*(?:(?!src=)s[^s>]*)*>([^<]*(?:(?!<\/script>)<[^<]*)*)<\/script>/gi;
			while ( ( match = rscript.exec( data ) ) != null ) {
				jQuery.globalEval( match[1] );
			}

			remoteCount--;
			if ( remoteCount === 0 ) {
				loadModules();
			}
		});
	};

	var remoteExercises = jQuery( "body > .exercise[data-src]" );

	if ( remoteExercises.length ) {
		remoteExercises.each( loadExercise );

	} else {
		loadModules();
	}

	function loadModules() {
		// Load module dependencies
		Khan.loadScripts( jQuery.map( Khan.modules, function( mod, name ) {
			return mod;
		}), function() {

			jQuery(function() {
				// Inject the site markup, if it doesn't exist
				if ( jQuery("#answera_area").length === 0 ) {
					// Pull from the cache if it's already there
					var tmpl = window.localStorage && window.localStorage.khanTmpl;
					
					if ( tmpl ) {
						handleInject( tmpl );
					
					// Otherwise load it dynamically
					} else {
						jQuery.ajax( {
							url: "khan-exercise.html",
							dataType: "html",
							success: function( html ) {
								if ( window.localStorage ) {
									// Disabled for now
									// window.localStorage.khanTmpl = html;
								}
					
								handleInject( html );
							}
						});
					}
				}
			});
		});
		
		function handleInject( html ) {
			Khan.injectSite( html );
			
			// Prepare the "random" problems
			if ( !Khan.query.problem ) {
				var problems = jQuery( "body > .exercise > .problems" ).children();

				Khan.weighExercises( problems );
				Khan.problemBag = Khan.makeProblemBag( problems, Khan.problemCount );
			}

			// Generate the initial problem when dependencies are done being loaded
			Khan.makeProblem();
		}
	}

	jQuery.fn.extend({
		// Pick a random element from a set of elements
		getRandom: function() {
			return this.eq( Math.floor( this.length * KhanUtil.random() ) );
		},

		// Run the methods provided by a module against some elements
		runModules: function( problem, type ) {
			type = type || "";

			return this.each(function( i, elem ) {
				elem = jQuery( elem );

				// Run the main method of any modules
				jQuery.each( Khan.modules, function( src, mod ) {
					var name = mod.name;
					if ( jQuery.fn[ name + type ] ) {
						elem[ name + type ]( problem );
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
