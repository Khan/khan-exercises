var Khan = (function() {
	// Adapted from a comment on http://mathiasbynens.be/notes/localstorage-pattern
	var localStorageEnabled = function() {
		var enabled, uid = +new Date;
		try {
			localStorage[ uid ] = uid;
			enabled = ( localStorage[ uid ] == uid );
			localStorage.removeItem( uid );
			return enabled;
		}
		catch( e ) {
			return false;
		}
	}();

	if ( !localStorageEnabled ) {
		jQuery(function() {
			jQuery( "#warning-bar-content" ).html( "You must enable DOM storage in your browser to see an exercise." );
			jQuery( "#warning-bar-close" ).hide();
			jQuery( "#warning-bar" ).show();
		});
		return;
	}

// Prime numbers used for jumping through exercises
var primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43,
	47, 53, 59, 61, 67, 71, 73, 79, 83],

	/*
	===============================================================================
	Crc32 is a JavaScript function for computing the CRC32 of a string
	...............................................................................

	Version: 1.2 - 2006/11 - http://noteslog.com/category/javascript/

	-------------------------------------------------------------------------------
	Copyright (c) 2006 Andrea Ercolino
	http://www.opensource.org/licenses/mit-license.php
	===============================================================================
	*/

	// CRC32 Lookup Table
	table = "00000000 77073096 EE0E612C 990951BA 076DC419 706AF48F E963A535 9E6495A3 0EDB8832 79DCB8A4 E0D5E91E 97D2D988 09B64C2B 7EB17CBD E7B82D07 90BF1D91 1DB71064 6AB020F2 F3B97148 84BE41DE 1ADAD47D 6DDDE4EB F4D4B551 83D385C7 136C9856 646BA8C0 FD62F97A 8A65C9EC 14015C4F 63066CD9 FA0F3D63 8D080DF5 3B6E20C8 4C69105E D56041E4 A2677172 3C03E4D1 4B04D447 D20D85FD A50AB56B 35B5A8FA 42B2986C DBBBC9D6 ACBCF940 32D86CE3 45DF5C75 DCD60DCF ABD13D59 26D930AC 51DE003A C8D75180 BFD06116 21B4F4B5 56B3C423 CFBA9599 B8BDA50F 2802B89E 5F058808 C60CD9B2 B10BE924 2F6F7C87 58684C11 C1611DAB B6662D3D 76DC4190 01DB7106 98D220BC EFD5102A 71B18589 06B6B51F 9FBFE4A5 E8B8D433 7807C9A2 0F00F934 9609A88E E10E9818 7F6A0DBB 086D3D2D 91646C97 E6635C01 6B6B51F4 1C6C6162 856530D8 F262004E 6C0695ED 1B01A57B 8208F4C1 F50FC457 65B0D9C6 12B7E950 8BBEB8EA FCB9887C 62DD1DDF 15DA2D49 8CD37CF3 FBD44C65 4DB26158 3AB551CE A3BC0074 D4BB30E2 4ADFA541 3DD895D7 A4D1C46D D3D6F4FB 4369E96A 346ED9FC AD678846 DA60B8D0 44042D73 33031DE5 AA0A4C5F DD0D7CC9 5005713C 270241AA BE0B1010 C90C2086 5768B525 206F85B3 B966D409 CE61E49F 5EDEF90E 29D9C998 B0D09822 C7D7A8B4 59B33D17 2EB40D81 B7BD5C3B C0BA6CAD EDB88320 9ABFB3B6 03B6E20C 74B1D29A EAD54739 9DD277AF 04DB2615 73DC1683 E3630B12 94643B84 0D6D6A3E 7A6A5AA8 E40ECF0B 9309FF9D 0A00AE27 7D079EB1 F00F9344 8708A3D2 1E01F268 6906C2FE F762575D 806567CB 196C3671 6E6B06E7 FED41B76 89D32BE0 10DA7A5A 67DD4ACC F9B9DF6F 8EBEEFF9 17B7BE43 60B08ED5 D6D6A3E8 A1D1937E 38D8C2C4 4FDFF252 D1BB67F1 A6BC5767 3FB506DD 48B2364B D80D2BDA AF0A1B4C 36034AF6 41047A60 DF60EFC3 A867DF55 316E8EEF 4669BE79 CB61B38C BC66831A 256FD2A0 5268E236 CC0C7795 BB0B4703 220216B9 5505262F C5BA3BBE B2BD0B28 2BB45A92 5CB36A04 C2D7FFA7 B5D0CF31 2CD99E8B 5BDEAE1D 9B64C2B0 EC63F226 756AA39C 026D930A 9C0906A9 EB0E363F 72076785 05005713 95BF4A82 E2B87A14 7BB12BAE 0CB61B38 92D28E9B E5D5BE0D 7CDCEFB7 0BDBDF21 86D3D2D4 F1D4E242 68DDB3F8 1FDA836E 81BE16CD F6B9265B 6FB077E1 18B74777 88085AE6 FF0F6A70 66063BCA 11010B5C 8F659EFF F862AE69 616BFFD3 166CCF45 A00AE278 D70DD2EE 4E048354 3903B3C2 A7672661 D06016F7 4969474D 3E6E77DB AED16A4A D9D65ADC 40DF0B66 37D83BF0 A9BCAE53 DEBB9EC5 47B2CF7F 30B5FFE9 BDBDF21C CABAC28A 53B39330 24B4A3A6 BAD03605 CDD70693 54DE5729 23D967BF B3667A2E C4614AB8 5D681B02 2A6F2B94 B40BBE37 C30C8EA1 5A05DF1B 2D02EF8D",

	/* Number */
	crc32 = function( /* String */ str, /* Number */ crc ) {
		if( crc == window.undefined ) crc = 0;
		var n = 0; //a number between 0 and 255
		var x = 0; //an hex number

		crc = crc ^ (-1);
		for( var i = 0, iTop = str.length; i < iTop; i++ ) {
			n = ( crc ^ str.charCodeAt( i ) ) & 0xFF;
			x = "0x" + table.substr( n * 9, 8 );
			crc = ( crc >>> 8 ) ^ x;
		}
		return Math.abs( crc ^ (-1) );
	},

	// Check to see if we're in test mode
	testMode = typeof userExercise === "undefined",

	// Check to see if we're in beta mode
	betaMode = window.location.host.indexOf( "khan-masterslave" ) !== -1,

	// The main server we're connecting to for saving data
	server = testMode ? "http://localhost:8080" : "",

	// The name of the exercise
	exerciseName = typeof userExercise !== "undefined" ? userExercise.exercise : ((/([^\/.]+)(?:\.html)?$/.exec( window.location.pathname ) || [])[1]),

	// Bin users into a certain number of realms so that
	// there is some level of reproducability in their questions
	bins = 200,

	// The seed information
	problemSeed,
	randomSeed,

	// Get the username of the user
	user = window.localStorage["exercise:lastUser"] || null,
	userCRC32,

	// How far to jump through the problems
	jumpNum = 1,

	// The current problem and its corresponding exercise
	problem,
	exercise,

	// The number of the current problem that we're on
	problemNum = 0,
	problemID,

	// The current validator function
	validator,

	hints,

	// The exercise elements
	exercises,

	// If we're dealing with a summative exercise
	isSummative = false,

	// Where we are in the shuffled list of problem types
	problemBag,
	problemBagIndex = 0,

	// How many problems are we doing? (For the fair shuffle bag.)
	problemCount = 10,

	// For saving problems to the server
	hintUsed,
	lastAction,
	doHintSave,
	doSave,
	attempts,
	once = true,

	// For loading remote exercises
	remoteCount = 0,

	// Debug data dump
	dataDump = {
		"exercise": exerciseName,
		"problems": [],
		"issues": 0
	},

	urlBase = testMode ? "../" : "/khan-exercises/",

	lastFocusedSolutionInput = null,

	issueError = "Communication with GitHub isn't working. Please file "
		+ "the issue manually at <a href=\""
		+ "http://github.com/Khan/khan-exercises/issues/new\">GitHub</a>. "
		+ "Please reference exercise: " + exerciseName + ".",
	issueSuccess = function( a, b ) {
		return "Thank you for your feedback! Your issue has been created and can be "
			+ "found at the following link:</p>"
			+ "<p><a id=\"issue-link\" href=\"" + a + "\">" + b + "</a>";
	},
	issueIntro = "Please make sure you report this issue from an exercise page where you see the issue, so we can reproduce the issue and fix it. If you're reporting an issue about a mathematical error, please make sure that you've double-checked your math. Note: All information provided will become public. Thanks for helping us change education!";

// from MDC, thx :)
if (!Array.prototype.indexOf) {
	Array.prototype.indexOf = function (searchElement /*, fromIndex */ ) {
		if (this === void 0 || this === null) {
			throw new TypeError();
		}
		var t = Object(this);
		var len = t.length >>> 0;
		if (len === 0) {
			return -1;
		}
		var n = 0;
		if (arguments.length > 0) {
			n = Number(arguments[1]);
			if (n !== n) { // shortcut for verifying if it's NaN
				n = 0;
			} else if (n !== 0 && n !== (1 / 0) && n !== -(1 / 0)) {
				n = (n > 0 || -1) * Math.floor(Math.abs(n));
			}
		}
		if (n >= len) {
			return -1;
		}
		var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);
		for (; k < len; k++) {
			if (k in t && t[k] === searchElement) {
				return k;
			}
		}
		return -1;
	};
}

// Add in the site stylesheets
if (testMode) {
	(function(){
		var link = document.createElement("link");
		link.rel = "stylesheet";
		link.href = urlBase + "css/khan-site.css";
		document.getElementsByTagName('head')[0].appendChild(link);

		link = document.createElement("link");
		link.rel = "stylesheet";
		link.href = urlBase + "css/khan-exercise.css";
		document.getElementsByTagName('head')[0].appendChild(link);
	})();
}

// The main Khan Module
var Khan = {
	modules: {},

	// So modules can use file paths properly
	urlBase: urlBase,

	moduleDependencies: {
		// Yuck! There is no god. John will personally gut punch whoever
		// thought this was a good API design.
		"math": [ {
			src: "http://cdn.mathjax.org/mathjax/1.1-latest/MathJax.js",
			text: "MathJax.Hub.Config({\
				messageStyle: \"none\",\
				skipStartupTypeset: true,\
				jax: [\"input/TeX\",\"output/HTML-CSS\"],\
				extensions: [\"tex2jax.js\",\"MathZoom.js\"],\
				TeX: {\
					extensions: [\"AMSmath.js\",\"AMSsymbols.js\",\"noErrors.js\",\"noUndefined.js\"],\
					Macros: {\
						RR: \"\\\\mathbb{R}\"\
					},\
					Augment: {\
						Definitions: {\
							macros: {\
								lrsplit: \"LRSplit\",\
								lcm: [\"NamedOp\", 0],\
							}\
						},\
						Parse: {\
							prototype: {\
								LRSplit: function( name ) {\
									var num = this.GetArgument( name ),\
										den = this.GetArgument( name );\
									var frac = MathJax.ElementJax.mml.mfrac( MathJax.InputJax.TeX.Parse( '\\\\strut\\\\textstyle{'+num+'\\\\qquad}', this.stack.env ).mml(),\
										MathJax.InputJax.TeX.Parse( '\\\\strut\\\\textstyle{\\\\qquad '+den+'}', this.stack.env ).mml() );\
									frac.numalign = MathJax.ElementJax.mml.ALIGN.LEFT;\
									frac.denomalign = MathJax.ElementJax.mml.ALIGN.RIGHT;\
									frac.linethickness = \"0em\";\
									this.Push( frac );\
								}\
							}\
						}\
					}\
				},\
				\"HTML-CSS\": {\
					scale: 100,\
					showMathMenu: false,\
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
			MathJax.Hub.Register.StartupHook(\"HTML-CSS Jax - using image fonts\",function () {\
				Khan.warnFont();\
			});\
			\
			MathJax.Hub.Register.StartupHook(\"HTML-CSS Jax - no valid font\",function () {\
				Khan.warnFont();\
			});\
			// Trying to monkey-patch MathJax.Message.Init to not throw errors\n\
			MathJax.Message.Init = (function( oldInit ) {\
				return function( styles ) {\
					if ( this.div && this.div.parentNode == null ) {\
						var div = document.getElementById(\"MathJax_Message\");\
						if ( div && div.firstChild == null ) {\
							var parent = div.parentNode;\
							if ( parent ) {\
								parent.removeChild( div );\
							}\
						}\
					}\
					\
					oldInit.call( this, styles );\
				};\
			})( MathJax.Message.Init );\
			\
			MathJax.Hub.Startup.onload();"
		}, "raphael" ],

		// Load Raphael locally because IE8 has a problem with the 1.5.2 minified release
		// http://groups.google.com/group/raphaeljs/browse_thread/thread/c34c75ad8d431544

		// The normal module dependencies.
		"calculus": [ "math", "expressions", "polynomials" ],
		"exponents": [ "math", "math-format" ],
		"kinematics": [ "math" ],
		"math-format": [ "math", "expressions" ],
		"polynomials": [ "math", "expressions" ],
		"stat": [ "math" ],
		"word-problems": [ "math" ]
	},

	warnFont: function() {
		if ( jQuery.browser.msie ) {
			jQuery( "#warning-bar" ).fadeIn( "fast" );
		}
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
				src = urlBase + "utils/" + mod + ".js";
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
			var seed = randomSeed;
			seed = ( ( seed + 0x7ed55d16 ) + ( seed << 12 ) ) & 0xffffffff;
			seed = ( ( seed ^ 0xc761c23c ) ^ ( seed >>> 19 ) ) & 0xffffffff;
			seed = ( ( seed + 0x165667b1 ) + ( seed << 5 ) ) & 0xffffffff;
			seed = ( ( seed + 0xd3a2646c ) ^ ( seed << 9 ) ) & 0xffffffff;
			seed = ( ( seed + 0xfd7046c5 ) + ( seed << 3 ) ) & 0xffffffff;
			seed = ( ( seed ^ 0xb55a4f09 ) ^ ( seed >>> 16 ) ) & 0xffffffff;
			return ( randomSeed = ( seed & 0xfffffff ) ) / 0x10000000;
		}
	},

	// Load in a collection of scripts, execute callback upon completion
	loadScripts: function( urls, callback ) {
		var loaded = 0,
			loading = urls.length,
			head = document.getElementsByTagName('head')[0];

		callback || ( callback = function() { } );

		for ( var i = 0; i < loading; i++ ) (function( mod ) {

			if ( !testMode && mod.src.indexOf("/khan-exercises/") === 0 ) {
				// Don't bother loading khan-exercises content in production
				// mode, this content is already packaged up and available.
				loaded++;
				return;
			}

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
			jQuery.each( arguments, function( ix, arg ) {
				console.error(arg);
			});
		}
	}
};

// Load query string params
Khan.query = Khan.queryString();

// Seed the random number generator with the user's hash
randomSeed = testMode && parseFloat( Khan.query.seed ) || userCRC32 || ( new Date().getTime() & 0xffffffff );

// Load in jQuery
var scripts = (typeof jQuery !== "undefined") ? [] : [ { src: "../jquery.js" } ];
Khan.loadScripts( scripts, function() {

	// Base modules required for every problem
	Khan.require( [ "answer-types", "tmpl" ] );

	Khan.require( document.documentElement.getAttribute("data-require") );

	if ( typeof userExercise !== "undefined" ) {
		prepareUserExercise( userExercise );

	} else {
		// Load in the exercise data from the server
		jQuery.ajax({
			// Do a request to the server API
			url: server + "/api/v1/user/exercises/" + exerciseName,
			type: "GET",
			dataType: "json",

			// Make sure cookies are passed along
			xhrFields: { withCredentials: true },

			success: prepareUserExercise
		});
	}

	jQuery(function() {
		var remoteExercises = jQuery( ".exercise[data-name]" );

		if ( remoteExercises.length ) {
			isSummative = true;

			remoteExercises.each( loadExercise );
		} else {
			loadModules();
		}
	});

	jQuery.fn.extend({
		// Pick a random element from a set of elements
		getRandom: function() {
			return this.eq( Math.floor( this.length * KhanUtil.random() ) );
		},

		// Run the methods provided by a module against some elements
		runModules: function( problem, type ) {
			type = type || "";

			var info = {
				testMode: testMode
			};

			return this.each(function( i, elem ) {
				elem = jQuery( elem );

				// Run the main method of any modules
				jQuery.each( Khan.modules, function( src, mod ) {
					var name = mod.name;
					if ( jQuery.fn[ name + type ] ) {
						elem[ name + type ]( problem, info );
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

// Add up how much total weight is in each exercise so we can adjust for
// it later
function weighExercises( problems ) {
	if ( exercises.length > 1 ) {
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
}

// Create a set of n problems fairly from the weights - not random; it
// ensures that the proportions come out as fairly as possible with ints
// (still usually a little bit random).
// There has got to be a better way to do this.
function makeProblemBag( problems, n ) {
	var bag = [], totalWeight = 0;

	if ( testMode && Khan.query.test != null ) {
		// Just do each problem 10 times
		jQuery.each( problems, function( i, elem ) {
			elem = jQuery( elem );
			elem.data( "id", elem.attr( "id" ) || "" + i );

			for ( var j = 0; j < 10; j++ ) {
				bag.push( problems.eq( i ) );
			}
		} );

		problemCount = bag.length;

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

		while ( n ) {
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
}

function makeProblem( id, seed ) {
	if ( typeof Badges !== "undefined" ) {
		Badges.hide();
	}

	// Allow passing in a random seed
	if ( typeof seed !== "undefined" ) {
		randomSeed = seed;

	// Otherwise set the seed from the problem number
	// Only do so if we're not in test mode and if we have a username
	} else if ( (!testMode || Khan.query.test == null) && user != null ) {
		randomSeed = problemNum;
	}

	// Save the seed for later so we can show it when asked
	problemSeed = randomSeed;

	// Check to see if we want to test a specific problem
	if ( testMode ) {
		id = typeof id !== "undefined" ? id : Khan.query.problem;
	}

	if ( typeof id !== "undefined" ) {
		var problems = exercises.children( ".problems" ).children();

		problem = /^\d+$/.test( id ) ?
			// Access a problem by number
			problems.eq( parseFloat( id ) ) :

			// Or by its ID
			problems.filter( "#" + id );

	// Otherwise we grab a problem at random from the bag of problems
	// we made earlier to ensure that every problem gets shown the
	// appropriate number of times
	} else {
		problem = problemBag[ problemBagIndex ];
		id = problem.data( "id" );
	}

	problemID = id;

	// Find which exercise this problem is from
	exercise = problem.parents( ".exercise" ).eq( 0 );

	// Work with a clone to avoid modifying the original
	problem = problem.clone();

	// problem has to be child of visible #workarea for MathJax metrics to all work right
	var workAreaWasVisible = jQuery( "#workarea" ).is( ":visible" );
	jQuery( "#workarea" ).append( problem ).show();

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
	hints = problem.children( ".hints" ).remove();

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

		// Otherwise we assume the smart number type
		} else {
			answerType = "number";
		}
	}

	// Generate a type of problem
	// (this includes possibly generating the multiple choice problems,
	//  if this fails then we will need to try generating another one.)
	validator = Khan.answerTypes[answerType]( solutionarea, solution );

	// A working solution was generated
	if ( validator ) {
		// Focus the first input
		// Use .select() and on a delay to make IE happy
		var firstInput = solutionarea.find( ":input" ).first();
		setTimeout( function() {
			firstInput.focus().select();
		}, 1 );

		lastFocusedSolutionInput = firstInput;
		solutionarea.find( ":input" ).focus( function() {
			// Save which input is focused so we can refocus it after the user hits Check Answer
			lastFocusedSolutionInput = this;
		} );
	} else {
		// Making the problem failed, let's try again
		problem.remove();
		makeProblem( id, randomSeed );
		return;
	}

	// Remove the solution and choices elements from the display
	solution.remove();
	choices.remove();

	// Add the problem into the page
	jQuery( "#workarea" ).toggle( workAreaWasVisible ).fadeIn();
	jQuery( "#answercontent input" ).removeAttr("disabled");
	if ( validator.examples && validator.examples.length > 0 ) {
		jQuery( "#examples-show" ).show();
		jQuery( "#examples" ).empty();

		jQuery.each( validator.examples, function( i, example ) {
			jQuery( "#examples" ).append( '<li>' + example + '</li>' );
		});

		jQuery( "#examples" ).children().tmpl();
	} else {
		jQuery( "#examples-show" ).hide();
	}
	// save a normal JS array of hints so we can shift() through them later
	hints = hints.tmpl().children().get();

	if ( hints.length === 0 ) {
		// Disable the get hint button
		jQuery( "#hint" ).attr( "disabled", true );
	}

	// Hook out for exercise test runner
	if ( testMode && parent !== window && typeof parent.jQuery !== "undefined" ) {
		parent.jQuery( parent.document ).trigger( "problemLoaded", [ makeProblem, validator.solution ] );
	}

	// Save problem info in dump data for testers
	if ( testMode && Khan.query.test != null ) {
		var testerInfo = jQuery( "#tester-info" );

		// Deep clone the elements to avoid some straaaange bugs
		var lastProblem = jQuery.extend( true, {}, {
			seed: problemSeed,
			type: problemID,
			VARS: jQuery.tmpl.VARS,
			solution: validator.solution
		} );

		dataDump.problems.push( lastProblem );

		jQuery( testerInfo ).find( ".problem-no" )
			.text( dataDump.problems.length + dataDump.issues + " of " + problemCount );

		var answer = jQuery( testerInfo ).find( ".answer" ).empty();

		var displayedSolution = validator.solution;
		if ( !jQuery.isArray( displayedSolution ) ) {
			displayedSolution = [ displayedSolution ];
		}

		jQuery.each( displayedSolution, function( i, el ) {
			jQuery( "<span>" ).text( el ).addClass( "box" ).appendTo( answer );
		} );
	}

	// Show the debug info
	if ( testMode && Khan.query.debug != null ) {
		jQuery( document ).keypress( function( e ) {
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
			.attr( "href", debugURL + "&seed=" + problemSeed )
			.appendTo( links );

		links.append("<br>");
		links.append("Problem type: ");

		jQuery( "<a>" )
			.text( problemID )
			.attr( "href", debugURL )
			.appendTo( links );

		if ( exercise.data( "name" ) != null ) {
			links.append("<br>");
			links.append("Original exercise: " + exercise.data( "name" ));
		}

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

	// Advance to the next problem
	nextProblem( 1 );

	// The user is generating a new problem
	doHintSave = true;
	doSave = true;
	hintUsed = false;
	attempts = 0;
	lastAction = (new Date).getTime();

	jQuery( "#hint" ).val( "I'd like a hint" );
	jQuery( "#hint-remainder" ).hide();

	if ( once ) {
		updateData();
		once = false;
	}

	jQuery(Khan).trigger( "newProblem" );
}

function injectSite( html, htmlExercise ) {
	jQuery("body").prepend( html );
	jQuery("#container").html( htmlExercise );

	if ( Khan.query.layout === "lite" ) {
		// TODO: Move this into a stylesheet, toggle a class
		jQuery("header, footer, #extras, .exercise-badge").remove();
		jQuery("#page-container, #container").css({ "min-width": 0, "border-width": 0 });
		jQuery("#answer_area").css({ "margin-top": "10px" });
	}
}

function prepareSite() {

	// Set exercise title
	jQuery(".exercise-title").text( typeof userExercise !== "undefined" ? userExercise.exercise_model.display_name : document.title );

	exercises = jQuery( ".exercise" ).detach();

	// Setup appropriate img URLs
	jQuery( "#sad" ).attr( "src", urlBase + "css/images/face-sad.gif" );
	jQuery( "#happy" ).attr( "src", urlBase + "css/images/face-smiley.gif" );
	jQuery( "#throbber, #issue-throbber" )
		.attr( "src", urlBase + "css/images/throbber.gif" );

	if (typeof userExercise !== "undefined" && userExercise.read_only) {
		jQuery( "#answercontent" ).hide();
		jQuery( "#extras" ).css("visibility", "hidden");

		jQuery( "#readonly" )
			.find( "#readonly-problem" ).text("Problem #" + (userExercise.total_done + 1)).end()
			.find( "#readonly-start" ).attr("href", "/exercises?exid=" + userExercise.exercise).end()
			.show();
	}

	// Watch for a solution submission
	jQuery("#check-answer-button").click( handleSubmit );
	jQuery("#answerform").submit( handleSubmit );

	function handleSubmit( e ) {
		var pass = validator();

		// Stop if the user didn't enter a response
		// If multiple-answer, join all responses and check if that's empty
		if ( jQuery.trim( validator.guess ) === "" ||
			 ( validator.guess instanceof Array && jQuery.trim( validator.guess.join( "" ) ) === "" ) ) {
			return false;
		}

		// Stop if the form is already disabled and we're waiting for a response.
		if ( jQuery( "#answercontent input" ).is( ":disabled" )) {
			return false;
		}

		jQuery( "#throbber" ).show();
		jQuery( "#check-answer-button" ).addClass( "buttonDisabled" );
		jQuery( "#answercontent input" ).attr( "disabled", "disabled" );
		jQuery( "#check-answer-results p" ).hide();

		// Figure out if the response was correct
		if ( pass === true ) {
			jQuery("#happy").show();
			jQuery("#sad").hide();
		} else {
			jQuery("#happy").hide();
			jQuery("#sad").show();

			// Is this a message to be shown?
			if ( typeof pass === "string" ) {
				jQuery( "#check-answer-results .check-answer-message" ).html( pass ).tmpl().show();
			}

			// Refocus text field so user can type a new answer
			if ( lastFocusedSolutionInput != null ) {
				setTimeout( function() {
					// focus should always work; hopefully select will work for text fields
					jQuery( lastFocusedSolutionInput ).focus().select();
				}, 1 );
			}
		}

		// The user checked to see if an answer was valid

		// Build the data to pass to the server
		var curTime = (new Date).getTime(),
			data = {
				// The user answered correctly
				complete: pass === true ? 1 : 0,

				// The user used a hint
				hint_used: hintUsed ? 1 : 0,

				// How long it took them to complete the problem
				time_taken: Math.round((curTime - lastAction) / 1000),

				// How many times the problem was attempted
				attempt_number: ++attempts,

				// The answer the user gave
				// TODO: Get the real provided answer
				attempt_content: validator.guess,

				// A hash representing the exercise
				// TODO: Populate this from somewhere
				sha1: typeof userExercise !== "undefined" ? userExercise.exercise_model.sha1 : exerciseName,

				// The seed that was used for generating the problem
				seed: problemSeed,

				// The seed that was used for generating the problem
				problem_type: problemID,

				// The non-summative exercise that the current problem belongs to
				non_summative: exercise.data( "name" )
			};

		// Save the problem results to the server
		request( "problems/" + (getData().total_done + 1) + "/attempt", data, function() {

			// TODO: Save locally if offline
			jQuery(Khan).trigger( "answerSaved" );

			jQuery( "#throbber" ).hide();
			jQuery( "#check-answer-button" ).removeClass( "buttonDisabled" );
			if ( pass === true ) {
				jQuery( "#check-answer-button" ).hide();
				if ( !testMode || Khan.query.test == null ) {
					jQuery( "#next-container" ).show();
					jQuery( "#next-question-button" ).removeAttr( "disabled" )
						.removeClass( "buttonDisabled" )
						.focus();
				}
			} else {
				jQuery( "#answercontent input" ).removeAttr( "disabled" );
			}
		}, function() {
			// Error during submit. Cheat, for now, and reload the page in
			// an attempt to get updated data.
			window.location.reload();
		});

		// Make sure hint streak breaking is handled correctly
		doSave = false;

		// Remember when the last action was
		lastAction = curTime;

		jQuery(Khan).trigger( "checkAnswer", pass );

		return false;
	}

	// Watch for when the next button is clicked
	jQuery("#next-question-button").click(function(ev) {
		jQuery("#happy").hide();
		if( !jQuery( "#examples-show" ).data( "show" ) ){ jQuery( "#examples-show" ).click(); }

		// Toggle the navigation buttons
		jQuery("#check-answer-button").show();
		jQuery("#next-question-button").blur().parent().hide();

		// Wipe out any previous problem
		jQuery("#workarea").hide();
		jQuery("#workarea, #hintsarea").runModules( problem, "Cleanup" ).empty();
		jQuery("#hint").attr( "disabled", false );

		if ( Khan.scratchpad ) {
			Khan.scratchpad.clear();
		}

		if ( testMode && Khan.query.test != null && dataDump.problems.length + dataDump.issues >= problemCount ) {
			// Show the dump data
			jQuery( "#problemarea" ).append(
				"<p>Thanks! You're all done testing this exercise.</p>" +
				"<p>Please copy the text below and send it to us.</p>"
			);

			jQuery( "<textarea>" )
				.val( "Khan.testExercise(" + JSON.stringify( dataDump ) + ");" )
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
			makeProblem();
		}
	});

	// Watch for when the "Get a Hint" button is clicked
	jQuery("#hint").click(function() {

		if ( user ) {
			var hintApproved = window.localStorage[ "hintApproved:" + user ];

			if ( !(typeof hintApproved !== "undefined" && JSON.parse(hintApproved)) ) {
				if ( !(typeof userExercise !== "undefined" && userExercise.read_only) ) {
					if ( confirm("One-time warning: Using a hint will erase your streak.\nAre you sure you want to continue?"))  {
						// Hint consequences approved
						window.localStorage[ "hintApproved:" + user ] = true;

					} else {
						// User doesn't want to lose streak.
						return;
					}
				}
			}
		}

		var hint = hints.shift();
		jQuery( "#hint-remainder" ).text( hints.length + " remaining" )
			.fadeIn( 500 );

		if ( hint ) {

			jQuery( "#hint" ).val("I'd like another hint");

			var problem = jQuery( hint ).parent();

			// Append first so MathJax can sense the surrounding CSS context properly
			jQuery( hint ).appendTo( "#hintsarea" ).runModules( problem );

			// Grow the scratchpad to cover the new hint
			if ( Khan.scratchpad ) {
				Khan.scratchpad.resize();
			}

			// Disable the get hint button
			if ( hints.length === 0 ) {
				jQuery( this ).attr( "disabled", true );
				jQuery( "#hint-remainder" ).fadeOut( 500 );
			}

			// Don't reset the streak if we've already reset it or if
			// we've already sent in an answer
			if ( !doSave || !doHintSave ) {
				return;
			}

			hintUsed = true;

			if (!(typeof userExercise !== "undefined" && userExercise.read_only)) {
				request( "reset_streak" );
			}

			// Make sure we don't reset the streak more than once
			doHintSave = false;

		}
	});

	// On an exercise page, replace the "Report a Problem" link with a button
	// to be more clear that it won't replace the current page.
	jQuery( "<a>Report a Problem</a>" )
		.attr( "id", "report" ).addClass( "simple-button action-gradient green" )
		.replaceAll( jQuery( ".footer-links a:first" ) );

	jQuery( "#report" ).click( function( e ) {

		e.preventDefault();

		var report = jQuery( "#issue" ).css( "display" ) !== "none",
			form = jQuery( "#issue form" ).css( "display" ) !== "none";

		if ( report && form ) {
			jQuery( "#issue" ).hide();
		} else if ( !report || !form ) {
			jQuery( "#issue-status" ).removeClass( "error" ).html( issueIntro );
			jQuery( "#issue, #issue form" ).show();
			jQuery( "html, body" ).animate({
				scrollTop: jQuery( "#issue" ).offset().top
			}, 500, function() {
				jQuery( "#issue-title" ).focus();
			} );
		}
	});


	// Hide issue form.
	jQuery( "#issue-cancel" ).click( function( e ) {

		e.preventDefault();

		jQuery( "#issue" ).hide( 500 );
		jQuery( "#issue-title, #issue-email, #issue-body" ).val( "" );

	});

	// Submit an issue.
	jQuery( "#issue form input:submit" ).click( function( e ) {

		e.preventDefault();

		// don't do anything if the user clicked a second time quickly
		if ( jQuery( "#issue form" ).css( "display" ) === "none" ) return;

		var pretitle = jQuery( ".exercise-title" ).text() || jQuery( "title" ).text(),
			title = jQuery( "#issue-title" ).val(),
			email = jQuery( "#issue-email" ).val(),
			path = ( Khan.query.exid || exerciseName ) + ".html"
				+ "?seed=" + problemSeed
				+ "&problem=" + problemID,
			agent = navigator.userAgent,
			mathjaxInfo = "MathJax is " + ( typeof MathJax === "undefined" ? "NOT " : "" ) + "loaded",
			localStorageInfo = "localStorage is " + ( typeof localStorage === "undefined" || typeof localStorage.getItem === "undefined" ? "NOT " : "" ) + "enabled",
			body = ( email ? [ "Reporter: " + email ] : [] )
				.concat( [ jQuery( "#issue-body" ).val(), path, agent, localStorageInfo, mathjaxInfo ] )
				.join( "\n\n" );

		// flagging of browsers/os for issue labels. very primitive, but
		// hopefully sufficient.
		var agent_contains = function( sub ) { return agent.indexOf( sub ) !== -1; },
			flags = {
				ie8: agent_contains( "MSIE 8.0" ),
				ie9: agent_contains( "Trident/5.0" ),
				chrome: agent_contains( "Chrome/" ),
				safari: !agent_contains( "Chrome/" ) && agent_contains( "Safari/" ),
				firefox: agent_contains( "Firefox/" ),
				win7: agent_contains( "Windows NT 6.1" ),
				vista: agent_contains( "Windows NT 6.0" ),
				xp: agent_contains( "Windows NT 5.1" ),
				leopard: agent_contains( "OS X 10_5" ) || agent_contains( "OS X 10.5" ),
				snowleo: agent_contains( "OS X 10_6" ) || agent_contains( "OS X 10.6" ),
				lion: agent_contains( "OS X 10_7" ) || agent_contains( "OS X 10.7" ),
				scratchpad: ( /scratch\s*pad/i ).test( body ),
				ipad: agent_contains( "iPad" )
			},
			labels = [];
		jQuery.each( flags, function( k, v ) {
			if ( v ) labels.push( k )
		});

		if ( title === "" ) {
			jQuery( "#issue-status" ).addClass( "error" )
				.html( "Please provide a valid title for the issue." ).show();
			return;
		}

		var formElements = jQuery( "#issue input" ).add( "#issue textarea" );

		// disable the form elements while waiting for a server response
		formElements.attr( "disabled", true );

		jQuery( "#issue-cancel" ).hide();
		jQuery( "#issue-throbber" ).show();

		var dataObj = {
			title: pretitle + " - " + title,
			body: body,
			labels: labels
		};

		// we try to post ot github without a cross-domain request, but if we're
		// just running the exercises locally, then we can't help it and need
		// to fall back to jsonp. 
		jQuery.ajax({

			url: ( testMode ? "http://www.khanacademy.org/" : "/" ) + "githubpost",
			type: testMode ? "GET" : "POST",
			data: testMode
				? { json: JSON.stringify( dataObj ) }
				: JSON.stringify( dataObj ),
			contentType: testMode ? "application/x-www-form-urlencoded" : "application/json",
			dataType: testMode ? "jsonp" : "json",
			success: function( json ) {

				data = json.data || json;

				// hide the form
				jQuery( "#issue form" ).hide();

				// show status message
				jQuery( "#issue-status" ).removeClass( "error" )
					.html( issueSuccess( data.html_url, data.title ) )
					.show();

				// reset the form elements
				formElements.attr( "disabled", false )
					.not( "input:submit" ).val( "" );

				// replace throbber with the cancel button
				jQuery( "#issue-cancel" ).show();
				jQuery( "#issue-throbber" ).hide();

			},
			// note this won't actually work in local jsonp-mode
			error: function( json ) {

				// show status message
				jQuery( "#issue-status" ).addClass( "error" )
					.html( issueError ).show();

				// enable the inputs
				formElements.attr( "disabled", false );

				// replace throbber with the cancel button
				jQuery( "#issue-cancel" ).show();
				jQuery( "#issue-throbber" ).hide();

			}
		});
	});

	jQuery( "#print-ten" ).data( "show", true )
		.click( function( e ) {
			e.preventDefault();

			var link = jQuery( this ),
				show = link.data( "show" );

			if ( show ) {
				link.text( "Try current problem" );
				jQuery( "#hintsarea" ).empty();
				jQuery( "#answerform" ).hide();

				for ( var i = 0; i < 9; i++ ) {
					jQuery( "#workarea" ).append( "<hr>" );
					makeProblem();
				}
			} else {
				link.text( "Show next 10 problems" );
				jQuery( "#workarea" ).empty();
				jQuery( "#answerform" ).show();
				prevProblem( 10 );

				makeProblem();
			}

			jQuery( "#answerform input[type='button']" ).attr( "disabled", show );

			link.data( "show", !show );
		});

	jQuery( "#examples-show" ).data( "show", true )
		.click(function(evt){
			if ( evt ) { evt.preventDefault(); }

			var exampleLink = jQuery(this);
			var examples = jQuery( "#examples" );
			var show = exampleLink.data( "show" );

			if ( exampleLink.data( "show" ) ){
				exampleLink.text( "Hide acceptable answer formats" );
			} else {
				exampleLink.text( "Show acceptable answer formats" );
			}

			examples.slideToggle( 190 );
			exampleLink.data( "show", !show );
		}).trigger( "click" );

	jQuery( "#warning-bar-close a").click( function( e ) {
		e.preventDefault();
		jQuery( "#warning-bar" ).fadeOut( "slow" );
	});

	jQuery( "#scratchpad-show" ).data( "show", true )
		.click( function( e ) {
			e.preventDefault();
			var button = jQuery( this ),
				show = button.data( "show" );

			if ( show ) {
				if ( !Khan.scratchpad ) {
					Khan.loadScripts( [ {src: urlBase + "utils/scratchpad.js"} ], function() {
						jQuery( "#scratchpad" ).show();
						jQuery( "#workarea, #hintsarea" ).css( "padding-left", 60 );

						Khan.scratchpad = new Scratchpad( jQuery( "#scratchpad div" )[0] );
						button.text( "Hide scratchpad" );
					} );

				} else {
					jQuery( "#workarea, #hintsarea" ).css( "padding-left", 60 );
					jQuery( "#scratchpad" ).show();
					button.text( "Hide scratchpad" );
				}

			} else {
				jQuery( "#workarea, #hintsarea" ).css( "padding-left", 0 );
				jQuery( "#scratchpad" ).hide();
				button.text( "Show scratchpad" );
			}

			button.data( "show", !show );
			if (user) {
				window.localStorage[ "scratchpad:" + user ] = show;
			}
		});

	jQuery( "#answer_area" ).delegate( "input.button, select", "keydown", function( e ) {
		// Don't want to go back to exercise dashboard; just do nothing on backspace
		if ( e.keyCode === 8 ) {
			return false;
		}
	} );

	// Prepare for the tester info if requested
	if ( testMode && Khan.query.test != null ) {
		jQuery( "#answer_area" ).prepend(
			'<div id="tester-info" class="info-box">' +
				'<span class="info-box-header">Testing Mode</span>' +
				'<p><strong>Problem No.</strong> <span class="problem-no"></span></p>' +
				'<p><strong>Answer:</strong> <span class="answer"></span></p>' +
				'<p>' +
					'<input type="button" class="pass button green" value="This problem was generated correctly.">' +
					'<input type="button" class="fail button orange" value="There is an error in this problem.">' +
				'</p>' +
			'</div>'
		);

		jQuery( "#tester-info .pass" ).click( function() {
			dataDump.problems[ dataDump.problems.length - 1 ].pass = true;
			jQuery( "#next-question-button" ).trigger( "click" );
		} );

		jQuery( "#tester-info .fail" ).click( function() {
			var description = prompt( "Please provide a short description of the error" );

			// Don't do anything on clicking Cancel
			if ( description == null ) return;

			// we discard the info recorded and record an issue on github instead
			// of testing against the faulty problem's data dump.
			var dump = dataDump.problems.pop(),
				prettyDump = "```js\n" + JSON.stringify( dump ) + "\n```",
				fileName = window.location.pathname.replace(/^.+\//, ""),
				path = fileName + "?problem=" + problemID
					+ "&seed=" + problemSeed;

			var title = encodeURIComponent( "Issue Found in Testing - " + $("title").html() ),
				body = encodeURIComponent( [ description, path, prettyDump, navigator.userAgent ].join("\n\n") ),
				label = encodeURIComponent( "tester bugs" );

			var err = function( problems, dump, desc ) {
				problems.push( dump );
				problems[ problems.length - 1 ].pass = desc;
			};

			var comment = function( id ) {
				// If communication fails with the Sinatra app or Github and a
				// comment isn't created, then we create a test that will always
				// fail.
				jQuery.ajax({
					url: "http://66.220.0.98:2563/file_exercise_tester_bug_comment?id=" + id + "&body=" + body,
					dataType: "jsonp",
					success: function( json ) {
						if ( json.meta.status !== 201 ) {
							err( dataDump.problems, dump, description );
						} else {
							dataDump.issues += 1;
						}
					},
					error: function( json ) {
						err( dataDump.problems, dump, description );
					}
				});
			};

			var newIssue = function() {
				// if communication fails with the Sinatra app or Github and an
				// issue isn't created, then we create a test that will always
				// fail.
				jQuery.ajax({
					url: "http://66.220.0.98:2563/file_exercise_tester_bug?title=" + title + "&body=" + body + "&label=" + label,
					dataType: "jsonp",
					success: function( json ) {
						if ( json.meta.status !== 201 ) {
							err( dataDump.problems, dump, description );
						} else {
							dataDump.issues += 1;
						}
					},
					error: function( json ) {
						err( dataDump.problems, dump, description );
					}
				});
			};

			jQuery.ajax({
				url: "https://api.github.com/repos/Khan/khan-exercises/issues?labels=tester%20bugs",
				dataType: "jsonp",
				error: function( json ) {
					err( dataDump.problems, dump, description );
				},
				success: function( json ) {
					var copy = false;

					// see if an automatically generated issue for this file
					// already exists
					jQuery.each( json.data, function( i, issue ) {
						if ( encodeURIComponent( issue.title ) === title ) {
							copy = issue.number;
						}
					});

					if ( copy ) {
						comment( copy );
					} else {
						newIssue();
					}
				}
			});

			jQuery( "#next-question-button" ).trigger( "click" );
		} );

		jQuery( document ).keyup( function( e ) {
			if ( e.keyCode === "H".charCodeAt( 0 ) ) {
				jQuery( "#hint" ).click();
			}
			if ( e.keyCode === "Y".charCodeAt( 0 ) ) {
				jQuery( "#tester-info .pass" ).click();
			}
			if ( e.keyCode === "N".charCodeAt( 0 ) ) {
				jQuery( "#tester-info .fail" ).click();
			}
		});
	}

	// Prepare for the debug info if requested
	if ( testMode && Khan.query.debug != null ) {
		jQuery( '<div id="debug"></div>' ).appendTo( "#answer_area" );
	}

	// Register API ajax callbacks for updating UI
	if ( typeof APIActionResults !== "undefined" ) {
		// Update exercise message after appropriate API ajax requests
		APIActionResults.register("exercise_message_html",
			function(sExerciseMessageHtml) {
				var jel = jQuery("#exercise-message-container");
				var jelNew = jQuery(sExerciseMessageHtml);
				if (jelNew.children().length) {
					jel.empty().append(jelNew.children());
					setTimeout(function(){ jel.slideDown(); }, 50);
				}
				else {
					jel.slideUp();
				}
			}
		);
	}

	// Make scratchpad persistent per-user
	if (user) {
		var lastScratchpad = window.localStorage[ "scratchpad:" + user ];
		if (typeof lastScratchpad !== "undefined" && JSON.parse(lastScratchpad)) {
			$("#scratchpad-show").click();
		}
	}
}

function nextProblem( num ) {
	if ( num > 0 ) {
		// Increment the problem number
		problemNum += jumpNum;

		if ( problemNum >= 200 ) {
			problemNum -= 200;
		}

		// Go to the next problem type in the problem bag
		problemBagIndex = (problemBagIndex + 1) % problemCount;

		nextProblem( num - 1 );
	}
}

function prevProblem( num ) {
	if ( num > 0 ) {
		// Increment the problem number
		problemNum -= jumpNum;

		if ( problemNum < 0 ) {
			problemNum += 200;
		}

		// Go to the next problem type in the problem bag
		problemBagIndex = (problemBagIndex - 1) % problemCount;

		if ( problemBagIndex < 0 ) {
			problemBagIndex += problemCount;
		}

		prevProblem( num - 1 );
	}
}

function prepareUserExercise( data ) {
	// Update the local data store
	updateData( data );

	if ( user != null ) {
		// How far to jump through the problems
		jumpNum = primes[ userCRC32 % primes.length ];

		// The starting problem of the user
		problemNum = userCRC32 % bins;

		// Advance to the current problem seed
		nextProblem( getData().total_done );
	}
}

function request( method, data, fn, fnError ) {
	if ( testMode ) {
		// Pretend we have success
		if ( jQuery.isFunction( fn ) ) {
			fn();
		}

		return;
	}

	jQuery.ajax({
		// Do a request to the server API
		url: server + "/api/v1/user/exercises/" + exerciseName + "/" + method,
		type: "POST",
		data: data,
		dataType: "json",

		// Make sure cookies are passed along
		xhrFields: { withCredentials: true },

		// Backup the response locally, for later use
		success: function( data ) {
			// Update the visual representation of the points/streak
			updateData( data );

			if ( jQuery.isFunction( fn ) ) {
				fn( data );
			}
		},

		// Handle error edge case
		error: fnError
	});
}

// Update the visual representation of the points/streak
function updateData( data ) {
	// Check if we're setting/switching usernames
	if ( data ) {
		user = data.user || user;
		userCRC32 = user != null ? crc32( user ) : null;
		randomSeed = userCRC32 || randomSeed;
	}

	// Make sure we have current data
	var oldData = getData();

	// Change users, if needed
	if ( data && (data.total_done >= oldData.total_done || data.user !== oldData.user) ) {
		// Cache the data locally
		if ( user != null ) {
			window.localStorage[ "exercise:" + user + ":" + exerciseName ] = JSON.stringify( data );
		}

	// If no data is provided then we're just updating the UI
	} else {
		data = oldData;
	}

	// Update the streaks/point bar
	var streakMaxWidth = 227,

		// Streak and longest streak pixel widths
		streakWidth = Math.min(streakMaxWidth, Math.ceil((streakMaxWidth / data.required_streak) * data.streak)),
		longestStreakWidth = Math.min(streakMaxWidth, Math.ceil((streakMaxWidth / data.required_streak) * data.longest_streak)),

		// Streak icon pixel width
		streakIconWidth = Math.min(streakMaxWidth - 2, Math.max(43, streakWidth)), // 43 is width of streak icon

		// Don't show label if not enough room
		labelWidthRequired = 20,

		// Don't show accumulation stats higher than 100 to stop grinding behavior,
		// and don't show labels if there isn't room in the bar to render them.
		labelStreak = streakWidth < labelWidthRequired ? "" :
						( !data.summative && data.streak > 100 ) ? "Max" : data.streak,

		labelLongestStreak = ( longestStreakWidth < labelWidthRequired || (longestStreakWidth - streakWidth) < labelWidthRequired ) ? "" :
						( !data.summative && data.longest_streak > 100 ) ? "Max" : data.longest_streak;

	if ( data.summative ) {

		jQuery( ".summative-help ")
			.find( ".summative-required-streaks" ).text( parseInt( data.required_streak / 10 ) ).end()
			.show();

		if ( jQuery( ".level-label" ).length === 0 ) {

			// Split summative streak bar into levels
			var levels = [];
			var levelCount = data.required_streak / 10;
			for ( var i = 1; i < levelCount; i++ ) {

				// Individual level pixels
				levels[ levels.length ] = Math.ceil(i * ( streakMaxWidth / levelCount )) + 1;

			}

			jQuery.each(levels, function( index, val ) {
				jQuery( ".best-label" ).after("<li class='level-label' style='width:" + val + "px'></li>");
			});

		}
	}

	jQuery(".unit-rating").width( streakMaxWidth );
	jQuery(".current-rating").width( streakWidth );
	jQuery(".streak-icon").width( streakIconWidth );
	jQuery(".best-label").width( longestStreakWidth ).html( labelLongestStreak + "&nbsp;" );
	jQuery(".current-label").width( streakWidth ).html( labelStreak + "&nbsp;" );
	jQuery("#exercise-points").text( " " + data.next_points + " " );

	// Update the exercise icon
	var exerciseStates = data && data.exercise_states;

	if ( exerciseStates ) {
		var sPrefix = exerciseStates.summative ? "node-challenge" : "node";
		var src = exerciseStates.review ? "/images/node-review.png" :
					exerciseStates.suggested ? "/images/" + sPrefix + "-suggested.png" :
						exerciseStates.proficient ? "/images/" + sPrefix + "-complete.png" :
							"/images/" + sPrefix + "-not-started.png";
		jQuery("#exercise-icon-container img").attr("src", src);
	}

	// Display all the related videos
	var videos = data && data.exercise_model.related_videos;

	if ( videos && videos.length && jQuery(".related-video-list").is(":empty") ) {
		jQuery.each( videos, function( i, video ) {
			var span = jQuery( "<span>" )
				.addClass( "video-title vid-progress v" + video.id )
				.text( video.title );
			if ( i < videos.length - 1 && i < 2 ) {
				span.append( "<span class='separator'>, </span>" );
			}

			var a = jQuery( "<a>" ).attr( {
				href: video.ka_url,
				title: video.title
			} )
				.append( span );

			jQuery( "<li>" )
				.addClass( i > 2 ? "related-video-extended" : "" )
				.append( a )
				.appendTo( ".related-video-list" );
		} );

		jQuery(".related-content, #related-video-content").show();
	}
}

// Grab the cached UserExercise data from local storage
function getData() {
	// If we're viewing a problem, ignore local storage and return the userExercise blob
	if ( typeof userExercise !== "undefined" && userExercise.read_only ) {
		return userExercise;

	} else {
		var data = window.localStorage[ "exercise:" + user + ":" + exerciseName ];

		// Parse the JSON if it exists
		if ( data ) {
			return JSON.parse( data );

		// Otherwise we contact the server
		} else {
			return {
				total_done: 0,
				total_correct: 0,
				streak: 0,
				longest_streak: 0,
				next_points: 225,
				exercise_model: {
					summative: isSummative
				}
			};
		}
	}
}

function loadExercise() {
	var self = jQuery( this );
	var name = self.data( "name" );
	var weight = self.data( "weight" );
	var dummy = jQuery( "<div>" );

	remoteCount++;
	dummy.load( urlBase + "exercises/" + name + ".html .exercise", function( data, status, xhr ) {
		var match, newContents;

		if ( !( /success|notmodified/ ).test( status ) ) {
			// Maybe loading from a file:// URL?
			Khan.error( "Error loading exercise from file " + name + ".html: " + xhr.status + " " + xhr.statusText );
			return;
		}

		newContents = dummy.contents();
		self.replaceWith( newContents );

		// Maybe the exercise we just loaded loads some others
		newContents.find( ".exercise[data-name]" ).each( loadExercise );

		// Save the filename and weights
		newContents.filter( ".exercise" ).data( "name", name );
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
}

function loadModules() {
	// Load module dependencies
	Khan.loadScripts( jQuery.map( Khan.modules, function( mod, name ) {
		return mod;
	}), function() {

		jQuery(function() {
			// Inject the site markup, if it doesn't exist
			if ( jQuery("#answer_area").length === 0 ) {
				jQuery.ajax( {
					url: urlBase + "exercises/khan-site.html",
					dataType: "html",
					success: function( html ) {

						jQuery.ajax( {
							url: urlBase + "exercises/khan-exercise.html",
							dataType: "text",
							success: function( htmlExercise ) {

								handleInject( html, htmlExercise );

							}
						});

					}
				});
			} else {
				postInject();
			}
		});
	});

	function handleInject( html, htmlExercise ) {
		injectSite( html, htmlExercise );
		postInject();
	}

	function postInject() {
		prepareSite();

		// Prepare the "random" problems
		if ( !testMode || !Khan.query.problem ) {
			var problems = exercises.children( ".problems" ).children();

			if ( typeof userExercise !== "undefined" ) {
				problemCount = userExercise.required_streak;
			}

			weighExercises( problems );
			problemBag = makeProblemBag( problems, problemCount );
		}

		// Generate the initial problem when dependencies are done being loaded
		makeProblem();
	}
}

return Khan;

})();

// Make this publicly accessible
var KhanUtil = Khan.Util;
