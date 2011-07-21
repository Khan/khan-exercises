var Khan = (function() {

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

// Prime numbers used for jumping through exercises
var primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43,
	47, 53, 59, 61, 67, 71, 73, 79, 83],
	
	// CRC32 Lookup Table
	table = "00000000 77073096 EE0E612C 990951BA 076DC419 706AF48F E963A535 9E6495A3 0EDB8832 79DCB8A4 E0D5E91E 97D2D988 09B64C2B 7EB17CBD E7B82D07 90BF1D91 1DB71064 6AB020F2 F3B97148 84BE41DE 1ADAD47D 6DDDE4EB F4D4B551 83D385C7 136C9856 646BA8C0 FD62F97A 8A65C9EC 14015C4F 63066CD9 FA0F3D63 8D080DF5 3B6E20C8 4C69105E D56041E4 A2677172 3C03E4D1 4B04D447 D20D85FD A50AB56B 35B5A8FA 42B2986C DBBBC9D6 ACBCF940 32D86CE3 45DF5C75 DCD60DCF ABD13D59 26D930AC 51DE003A C8D75180 BFD06116 21B4F4B5 56B3C423 CFBA9599 B8BDA50F 2802B89E 5F058808 C60CD9B2 B10BE924 2F6F7C87 58684C11 C1611DAB B6662D3D 76DC4190 01DB7106 98D220BC EFD5102A 71B18589 06B6B51F 9FBFE4A5 E8B8D433 7807C9A2 0F00F934 9609A88E E10E9818 7F6A0DBB 086D3D2D 91646C97 E6635C01 6B6B51F4 1C6C6162 856530D8 F262004E 6C0695ED 1B01A57B 8208F4C1 F50FC457 65B0D9C6 12B7E950 8BBEB8EA FCB9887C 62DD1DDF 15DA2D49 8CD37CF3 FBD44C65 4DB26158 3AB551CE A3BC0074 D4BB30E2 4ADFA541 3DD895D7 A4D1C46D D3D6F4FB 4369E96A 346ED9FC AD678846 DA60B8D0 44042D73 33031DE5 AA0A4C5F DD0D7CC9 5005713C 270241AA BE0B1010 C90C2086 5768B525 206F85B3 B966D409 CE61E49F 5EDEF90E 29D9C998 B0D09822 C7D7A8B4 59B33D17 2EB40D81 B7BD5C3B C0BA6CAD EDB88320 9ABFB3B6 03B6E20C 74B1D29A EAD54739 9DD277AF 04DB2615 73DC1683 E3630B12 94643B84 0D6D6A3E 7A6A5AA8 E40ECF0B 9309FF9D 0A00AE27 7D079EB1 F00F9344 8708A3D2 1E01F268 6906C2FE F762575D 806567CB 196C3671 6E6B06E7 FED41B76 89D32BE0 10DA7A5A 67DD4ACC F9B9DF6F 8EBEEFF9 17B7BE43 60B08ED5 D6D6A3E8 A1D1937E 38D8C2C4 4FDFF252 D1BB67F1 A6BC5767 3FB506DD 48B2364B D80D2BDA AF0A1B4C 36034AF6 41047A60 DF60EFC3 A867DF55 316E8EEF 4669BE79 CB61B38C BC66831A 256FD2A0 5268E236 CC0C7795 BB0B4703 220216B9 5505262F C5BA3BBE B2BD0B28 2BB45A92 5CB36A04 C2D7FFA7 B5D0CF31 2CD99E8B 5BDEAE1D 9B64C2B0 EC63F226 756AA39C 026D930A 9C0906A9 EB0E363F 72076785 05005713 95BF4A82 E2B87A14 7BB12BAE 0CB61B38 92D28E9B E5D5BE0D 7CDCEFB7 0BDBDF21 86D3D2D4 F1D4E242 68DDB3F8 1FDA836E 81BE16CD F6B9265B 6FB077E1 18B74777 88085AE6 FF0F6A70 66063BCA 11010B5C 8F659EFF F862AE69 616BFFD3 166CCF45 A00AE278 D70DD2EE 4E048354 3903B3C2 A7672661 D06016F7 4969474D 3E6E77DB AED16A4A D9D65ADC 40DF0B66 37D83BF0 A9BCAE53 DEBB9EC5 47B2CF7F 30B5FFE9 BDBDF21C CABAC28A 53B39330 24B4A3A6 BAD03605 CDD70693 54DE5729 23D967BF B3667A2E C4614AB8 5D681B02 2A6F2B94 B40BBE37 C30C8EA1 5A05DF1B 2D02EF8D",

	// The main server we're connecting to for saving data
	server = "http://localhost:8080",
	
	// The name of the exercise
	exerciseName = (/([^\/.]+)(?:\.html)?$/.exec( window.location.pathname ) || [])[1],

	// Bin users into a certain number of realms so that
	// there is some level of reproducability in their questions
	bins = 200,
	
	// The seed information
	problemSeed,
	randomSeed,

	// Get the username of the user
	user = window.localStorage["exercise:lastUser"] || null,

	// How far to jump through the problems
	jumpNum,

	// The number of the current problem that we're on
	problemNum,
	problemID,
	
	// The current validator function
	validator,
	
	// Storing hint data for later
	rawHints,
	hints,
	
	// Where we are in the shuffled list of problem types
	problemBag,
	problemBagIndex = 0,
	
	// How many problems are we doing? (For the fair shuffle bag.)
	problemCount = 10,
	
	// Debug data dump
	dataDump = {
		"exercise": exerciseName,
		"problems": [],
		"issues": 0
	},
	
	// Check to see if we're in test mode
	testMode = window.location.host.indexOf("localhost") === 0 || window.location.protocol === "file:";

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
	}
};

// Load query string params
Khan.query = Khan.queryString();

// Seed the random number generator
randomSeed = testMode && parseFloat( Khan.query.seed ) || ( new Date().getTime() & 0xffffffff );

// Load in jQuery
Khan.loadScripts( [ { src: "https://ajax.googleapis.com/ajax/libs/jquery/1.6.2/jquery.min.js" } ], function() {

	// Base modules required for every problem
	Khan.require( [ "answer-types", "tmpl" ] );

	Khan.require( document.documentElement.getAttribute("data-require") );
	
	var hintUsed,
		lastAction,
		doHintSave,
		doSave,
		attempts,
		once = true;
	
	jQuery(Khan).bind({
		// The user is generating a new problem
		newProblem: function() {
			doHintSave = true;
			doSave = true;
			hintUsed = false;
			attempts = 0;
			lastAction = (new Date).getTime();
			
			if ( once ) {
				updateData();
				once = false;
			}
		},
		
		// The user checked to see if an answer was valid
		checkAnswer: function( e, pass ) {
			// Build the data to pass to the server
			var curTime = (new Date).getTime(),
				data = {
					// The user answered correctly
					complete: pass ? 1 : 0,
			
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
					sha1: exerciseName,
					
					// The seed that was used for generating the problem
					seed: problemSeed
				};
		
			// Save the problem results to the server
			request( "problems/" + (getData().total_done + 1) + "/attempt", data, function() {
				// TODO: Save locally if offline
				jQuery(Khan).trigger( "answerSaved" );
			});
			
			// Make sure hint streak breaking is handled correctly
			doSave = false;
			
			// Remember when the last action was
			lastAction = curTime;
		},
		
		// A user revealed a hint
		showHint: function() {
			// Don't reset the streak if we've already reset it or if
			// we've already sent in an answer
			if ( !doSave || !doHintSave ) {
				return;
			}
			
			hintUsed = true;
			request( "reset_streak" );
			
			// Make sure we don't reset the streak more than once
			doHintSave = false;
		}
	});
	
	// Load in the exercise data from the server
	jQuery.ajax({
		// Do a request to the server API
		url: server + "/api/v1/user/exercises/" + exerciseName,
		type: "GET",
		dataType: "json",
		
		// Make sure cookies are passed along
		xhrFields: { withCredentials: true },
		
		success: function( data ) {
			// Display all the related videos
			var videos = data.exercise_model.related_videos;
			
			if ( videos && videos.length ) {
				jQuery.each( videos, function( i, video ) {
					jQuery("<li><a href='" + video.ka_url + "'><span class='video-title'>" +
						video.title + "</span></a></li>")
							.appendTo(".related-video-list");
				});
			
				jQuery(".related-content, #related-video-content").show();
			}
			
			// Update the local data store
			updateData( data );
			
			if ( user != null ) {
				// How far to jump through the problems
				jumpNum = primes[ crc32( user ) % primes.length ];

				// The starting problem of the user
				problemNum = crc32( user ) % bins;

				// Advance to the current problem seed
				nextProblem( getData().total_done );
			}
		}
	});
	
	function request( method, data, fn ) {
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
			error: fn
		});
	}
	
	// Update the visual representation of the points/streak
	function updateData( data ) {
		// Make sure we have current data
		data = data || getData();
		
		// Change users, if needed
		user = data.user;
		
		// Cache the data locally
		if ( data && user != null ) {
			window.localStorage[ "exercise:" + user + ":" + exerciseName ] = JSON.stringify( data );
		}
		
		// Update the streaks/point bar
		jQuery(".current-rating").width( Math.min( Math.min( data.streak, 10 ) * 23, 228 ) );
		jQuery(".streak-icon").width( data.streak ? 46 : 0 );
		jQuery(".best-label").width( Math.min( Math.min( data.longest_streak, 10 ) * 23, 228 ) ).html( data.longest_streak + "&nbsp;" );
		jQuery(".current-label").width( Math.min( Math.min( data.streak, 10 ) * 23, 228 ) ).html( data.streak + "&nbsp;" );
		jQuery("#exercise-points").text( " " + data.next_points + " " );
	}
	
	// Grab the cached UserExercise data from local storage
	function getData() {
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
				next_points: 225
			};
		}
	}
	
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
	
    /* Number */ 
    function crc32( /* String */ str, /* Number */ crc ) { 
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
    }

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
			injectSite( html );
			
			// Prepare the "random" problems
			if ( !testMode || !Khan.query.problem ) {
				var problems = jQuery( "body > .exercise > .problems" ).children();

				weighExercises( problems );
				problemBag = makeProblemBag( problems, problemCount );
			}

			// Generate the initial problem when dependencies are done being loaded
			makeProblem();
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

// Add up how much total weight is in each exercise so we can adjust for
// it later
function weighExercises( problems ) {
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

			for ( var j = 0; j < problemCount; j++ ) {
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
	
	// Remove all the exercises from the page (they're no longer needed)
	jQuery(".exercise").detach();

	return bag;
}

function makeProblem( id, seed ) {
	var problem;
	
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
		var problems = jQuery( "body > .exercise > .problems" ).children();

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

		problemBagIndex = ( problemBagIndex + 1 ) % problemCount;
	}

	problemID = id;

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
	hints = problem.children( ".hints" ).remove();

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
	validator = Khan.answerTypes[answerType]( solutionarea, solution );

	// A working solution was not generated
	if ( !validator ) {
		// Making the problem failed, let's try again
		makeProblem( id, seed );
		return;
	}

	// Remove the solution and choices elements from the display
	solution.remove();
	choices.remove();

	// Add the problem into the page
	jQuery( "#workarea" ).append( problem );

	// Save the raw hints so they can be modified later
	rawHints = hints.clone()

		// FIXME: Should apply templating here without rendering MathJax, but
		// that's currently not possible.
		.tmpl()

		// Save as a normal JS array so we can use shift() on it later
		.children().get();

	// Save the rendered hints so we can display them later
	hints = hints

		// Do all the templating
		.tmpl()

		// Save as a normal JS array so we can use shift() on it later
		.children().get();

	if ( hints.length === 0 ) {
		// Disable the get hint button
		jQuery("#hint").attr( "disabled", true );
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
			.attr( "href", debugURL + "&seed=" + problemSeed )
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
	
	// Advance to the next problem
	nextProblem( 1 );
	
	jQuery(Khan).trigger( "newProblem" );
}

function injectSite( html ) {
	jQuery("body").prepend( html );
	
	jQuery(".exercise-title").text( document.title );

	// Hide exercies summaries for now
	// Will figure out something more elegant to do with them once the new
	// framework is shipped and we can worry about rounding out the summaries
	jQuery( ".summary" ).hide();

	// Watch for a solution submission
	jQuery("#check-answer-button").click( handleSubmit );
	jQuery("#answerform").submit( handleSubmit );
	
	function handleSubmit( e ) {
		var pass = validator();
		
		// Figure out if the response was correct
		if ( pass ) {
			// Show a congratulations message
			jQuery("#oops").hide();
			jQuery("#congrats").show();

			// Toggle the navigation buttons
			jQuery("#check-answer-button").hide();
			
			if ( !testMode || Khan.query.test == null ) {
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
		
		jQuery(Khan).trigger( "checkAnswer", pass );

		// Why is this necessary along with the return false? Not sure. Chrome needs it, at least.
		e.preventDefault();
		return false;
	}

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

		// Get the first hint and render left in the parallel arrays
		var hint = rawHints.shift(),
			render = hints.shift(),
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

			if ( hints.length === 0 ) {
				// Disable the get hint button
				jQuery( this ).attr( "disabled", true );
			}
		}
		
		jQuery(Khan).trigger( "showHint" );
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
					makeProblem();
					jQuery( "#workarea" ).append( jQuery( "<hr/>" ) );
				}
				
			} else {
				link.text( "Show next 10 problems" );
				jQuery( "#workarea, #hintsarea, #rawhintsarea" ).empty();
				makeProblem();
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
			if ( description == null ) return

			// we discard the info recorded and record an issue on github instead
			// of testing against the faulty problem's data dump.
			var dump = dataDump.problems.pop(),
				prettyDump = "```js\n" + JSON.stringify( dump ) + "\n```",
				fileName = window.location.pathname.replace(/^.+\//, ""),
				path = fileName + "?problem=" + problemID 
					+ "&seed=" + problemSeed;

			var title = encodeURIComponent( "Issue in " + $("title").html() ),
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
			})


			jQuery( "#next-question-button" ).trigger( "click" );
		} );

		jQuery( "body" ).keyup( function( e ) {
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

return Khan;

})();

// Make this publicly accessible
var KhanUtil = Khan.Util;