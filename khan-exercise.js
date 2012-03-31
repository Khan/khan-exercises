/* khan-exercise.js

	The main entry point here is actually the loadScripts method which is defined
	as Khan.loadScripts and then evaluated around line 500.

	When this loadScripts is called, it loads in many of the pre-reqs and then
	calls, one way or another, setUserExercise concurrently with loadModules.

	setProblemNum updates some instance vars that get looked at by other functions.

	loadModules takes care of loading an individual exercise's prereqs (i.e.
	word problems, etc). It _also_ loads in the khan academy site skin and
	exercise template via injectSite which runs prepareSite first then
	makeProblemBag and makeProblem when it finishes loading dependencies.

	pepareSite and makeProblem are both fairly heavyweight functions.

	If you are trying to register some behavior when the page loads, you
	probably want it to go in prepareSite. (which also registers server-initiated
	behavior via api.js) as well. By the time prepareSite is called, jquery and
	any core plugins are already available.

	If you are trying to do something each time a problem loads, you probably
	want to look at makeProblem.

	At the end of evaluation, the inner Khan object is returned/exposed as well
	as the inner Util object.



	Catalog of events fired on the Khan object by khan-exercises:

	* newProblem -- when a new problem has completely finished rendering

	* hintUsed -- when a hint has been used by the user
	
	* allHintsUsed -- when all possible hints have been used by the user
	
	* checkAnswer -- when the user attempts to check an answer, incorrect or
	  correct

	* problemDone -- when the user has completed a problem which, in this case,
	  usually means supplying the correct answer

	* attemptSaved -- when an attempt has been recorded successfully via the
	  API

	* attemptError -- when an error occurs during an API attempt

	* apiRequestStarted / apiRequestEnded -- when an API request is sent
	  outbound or completed, respectively. Listeners can keep track of whether
	  or not khan-exercises is still waiting on API responses.

	* exerciseLoaded:[exercise-name] -- when an exercise and all of its
	  dependencies are loaded and ready to render

	* updateUserExercise -- when an updated userExercise has been received 
	  and is being used by khan-exercises, either via the result of an API
	  call or initialization
*/

var Khan = (function() {
	function warn( message, showClose ) {
		jQuery(function() {
			var warningBar = jQuery( "#warning-bar" );
			jQuery( "#warning-bar-content" ).html( message );
			if ( showClose ) {
				warningBar.addClass( "warning" )
					  .children( "#warning-bar-close" ).show();
			} else {
				warningBar.addClass( "error" )
					  .children( "#warning-bar-close" ).hide();
			}
			warningBar.fadeIn( "fast" );
		});
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
		if( crc == window.undefined ) { crc = 0; }
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

	userExercise = undefined,

	// Check to see if we're in test mode
	testMode = typeof Exercises === "undefined",

	// The main server we're connecting to for saving data
	server = typeof apiServer !== "undefined" ? apiServer :
		testMode ? "http://localhost:8080" : "",

	// The name of the exercise -- this will only be set here in testMode
	exerciseName = ((/([^\/.]+)(?:\.html)?$/.exec( window.location.pathname ) || [])[1]),

	// Bin users into a certain number of realms so that
	// there is some level of reproducability in their questions
	bins = 200,

	// The seed information
	randomSeed,

	// Holds the current username
	user = null,
	userCRC32,

	// The current problem and its corresponding exercise
	problem,
	exercise,

	// The number of the current problem that we're on
	problemNum = 1,

	// Info for constructing the seed
	seedOffset = 0,
	jumpNum = 1,
	problemSeed = 0,

	problemID,

	// The current validator function
	validator,

	hints,

	// The exercise elements
	exercises,

	// Where we are in the shuffled list of problem types
	problemBag,
	problemBagIndex = 0,

	// How many problems are we doing? (For the fair shuffle bag.)
	problemCount = 10,

	// For saving problems to the server
	hintsUsed,
	lastAction,
	attempts,

	guessLog,
	userActivityLog,

	// A map of jQuery queues for serially sending and receiving AJAX requests.
	requestQueue = {},

	// Debug data dump
	dataDump = {
		"exercise": exerciseName,
		"problems": [],
		"issues": 0
	},

	// Dict of exercise names that are loading.
	// Values are number of remote exercises that are currently
	// pending in the middle of a load.
	loadingExercises = {},

	urlBase = typeof urlBaseOverride !== "undefined" ? urlBaseOverride :
		testMode ? "../" : "/khan-exercises/",

	lastFocusedSolutionInput = null,

	issueError = "Communication with GitHub isn't working. Please file "
		+ "the issue manually at <a href=\""
		+ "http://github.com/Khan/khan-exercises/issues/new\">GitHub</a>. "
		+ "Please reference exercise: " + exerciseName + ".",
	issueSuccess = function( url, title, suggestion ) {
		return ["Thank you for your feedback! Your issue has been created and can be ",
			"found at the following link:",
			"<p><a id=\"issue-link\" href=\"", url, "\">", title, "</a>",
			"<p>", suggestion, "</p>"].join('');
	},
	issueIntro = "Remember to check the hints and double check your math. All provided information will be public. Thanks for your help!",

	modulesLoaded = false,

	gae_bingo = window.gae_bingo || { bingo: function() {} };

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
			"math": [ {
				src: urlBase + "utils/MathJax/1.1a/MathJax.js?config=KAthJax-77111459c7d82564a705f9c5480e2c88"
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
			"word-problems": [ "math" ],
			"derivative-intuition": [ "jquery.mobile.vmouse" ],
			"unit-circle": [ "jquery.mobile.vmouse" ],
			"interactive": [ "jquery.mobile.vmouse" ],
			"mean-and-median": [ "stat" ]
		},

		warnTimeout: function() {
			warn( 'Your internet might be too slow to see an exercise. Refresh the page '
				+ 'or <a href="" id="warn-report">report a problem</a>.', false );
			jQuery( "#warn-report" ).click( function( e ) {
				e.preventDefault();
				jQuery( "#report" ).click();
			});
		},

		warnFont: function() {
			var enableFontDownload = "enable font download in your browser";
			if ( jQuery.browser.msie ) {
				enableFontDownload = '<a href="http://missmarcialee.com/2011/08/how-to-enable-font-download-in-internet-explorer-8/"  target="_blank">enable font download</a>';
			}

			warn( 'You should ' + enableFontDownload + ' to improve the appearance of math expressions.', true );
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
					var cachebust = "";
					if ( testMode && Khan.query.nocache != null ) {
						cachebust = "?" + Math.random();
					}
					src = urlBase + "utils/" + mod + ".js" + cachebust;
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

				if ( !Khan.modules[ src ] ) {
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

			for ( var i = 0; i < loading; i++ ) { (function( mod ) {

				if ( !testMode && mod.src.indexOf("/khan-exercises/") === 0 && mod.src.indexOf("/MathJax/") === -1 ) {
					// Don't bother loading khan-exercises content in production
					// mode, this content is already packaged up and available
					// (*unless* it's MathJax, which is silly still needs to be loaded)
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
			})( urls[i] ); }

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
		},

		scratchpad: (function() {
			var disabled = false, visible = false, wasVisible, pad;

			var actions = {
				disable: function() {
					wasVisible = visible;
					actions.hide();

					jQuery( "#scratchpad-show" ).hide();
					jQuery( "#scratchpad-not-available" ).show();
					disabled = true;
				},

				enable: function() {
					if ( wasVisible ) {
						actions.show();
						wasVisible = false;
					}

					jQuery( "#scratchpad-show" ).show();
					jQuery( "#scratchpad-not-available" ).hide();
					disabled = false;
				},

				isVisible: function() {
					return visible;
				},

				show: function() {
					if ( visible ) {
						return;
					}

					var makeVisible = function() {
						jQuery( "#workarea, #hintsarea" ).css( "padding-left", 60 );
						jQuery( "#scratchpad" ).show();
						jQuery( "#scratchpad-show" ).text( "Hide scratchpad" );
						visible = true;
					};

					if ( !pad ) {
						Khan.loadScripts( [ { src: urlBase + "utils/scratchpad.js" } ], function() {
							makeVisible();
							pad || ( pad = new Scratchpad( jQuery( "#scratchpad div" )[0] ) );
						} );
					} else {
						makeVisible();
					}
				},

				hide: function() {
					if ( !visible ) {
						return;
					}

					jQuery( "#workarea, #hintsarea" ).css( "padding-left", 0 );
					jQuery( "#scratchpad" ).hide();
					jQuery( "#scratchpad-show" ).text( "Show scratchpad" );
					visible = false;
				},

				toggle: function() {
					visible ? actions.hide() : actions.show();
				},

				clear: function() {
					if ( pad ) {
						pad.clear();
					}
				},

				resize: function() {
					if ( pad ) {
						pad.resize();
					}
				}
			};

			return actions;
		})(),

		relatedVideos: {
			videos: [],
			exercise: null,

			setVideos: function( exercise ) {
				this.exercise = exercise;
				this.videos = exercise.relatedVideos || [];
				this.render();
			},

			showThumbnail: function( index ) {
				jQuery( "#related-video-list .related-video-list li" ).each(function(i, el) {
					if ( i === index ) {
						jQuery( el )
							.find( 'a.related-video-inline' ).hide().end()
							.find( '.thumbnail' ).show();
					}
					else {
						jQuery( el )
							.find( 'a.related-video-inline' ).show().end()
							.find( '.thumbnail' ).hide();
					}
				});
			},

			// make a link to a related video, appending exercise ID.
			makeHref: function(video) {
				return video.relativeUrl + "?exid=" + this.exercise.name;
			},

			anchorElement: function( video, needComma ) {
				var template = Templates.get("video.related-video-link");
				return jQuery(template({
					href: this.makeHref(video),
					video: video,
					separator: needComma
				})).data('video', video);
			},

			renderInSidebar: function() {
				var container = jQuery(".related-video-box");
				var jel = container.find(".related-video-list");
				jel.empty();

				var template = Templates.get('video.thumbnail');
				_.each(this.videos, function(video, i) {
					var thumbnailDiv = jQuery(template({
						href: this.makeHref(video),
						video: video
					})).find('a.related-video').data('video', video).end();

					var inlineLink = this.anchorElement(video)
						.addClass("related-video-inline");

					var sideBarLi = jQuery( "<li>" )
						.append( inlineLink )
						.append( thumbnailDiv );

					if ( i > 0 ) {
						thumbnailDiv.hide();
					} else {
						inlineLink.hide();
					}
					jel.append( sideBarLi );
				}, this);

				container.toggle(this.videos.length > 0);
			},

			hookup: function() {
				// make caption slide up over the thumbnail on hover
				var captionHeight = 45;
				var marginTop = 23;
				// queue:false to make sure these run simultaneously
				var options = {duration: 150, queue: false};
				jQuery(".related-video-box")
					.delegate(".thumbnail", "mouseenter mouseleave", function(e) {
						var el = $(e.currentTarget);
						if (e.type == "mouseenter") {
							el.	find( ".thumbnail_label" ).animate(
									{ marginTop: marginTop },
									options)
								.end()
								.find( ".thumbnail_teaser" ).animate(
									{ height: captionHeight },
									options)
								.end();
						} else {
							el .find( ".thumbnail_label" ).animate(
									{ marginTop: marginTop + captionHeight },
									options)
								.end()
								.find( ".thumbnail_teaser" ).animate(
									{ height: 0 },
									options)
								.end();
						}
					});
			},

			render: function() {
				// don't try to render if templates aren't present (dev mode)
				if (!window.Templates) return;

				this.renderInSidebar();
			}
		},

		showSolutionButtonText: function() {
			return hintsUsed ? "Show step (" + hints.length + " left)" : "Show Solution";
		}

	};
	// see line 183. this ends the main Khan module

	// Load query string params
	Khan.query = Khan.queryString();

	if ( Khan.query.activity !== undefined ) {
		userExercise = {
			exerciseModel: {},
			readOnly: true,
			userActivity: JSON.parse( Khan.query.activity )
		};
	}

	// Seed the random number generator with the user's hash
	randomSeed = testMode && parseFloat( Khan.query.seed ) || userCRC32 || ( new Date().getTime() & 0xffffffff );

	// Load in jQuery
	var scripts = (typeof jQuery !== "undefined") ? [] : [ { src: "../jquery.js" } ];

	// Actually load the scripts. This is getting evaluated when the file is loaded.
	Khan.loadScripts( scripts, function() {

		if ( testMode ) {
			Khan.require( [ "../jquery-ui" ] );
		}

		// Base modules required for every problem
		Khan.require( [ "answer-types", "tmpl", "underscore", "jquery.adhesion", "hints" ] );

		Khan.require( document.documentElement.getAttribute("data-require") );

		// Initialize to an empty jQuery set
		exercises = jQuery();

		jQuery(function() {
			var remoteExercises = jQuery( "div.exercise[data-name]" );

			if ( remoteExercises.length ) {

				remoteExercises.each( loadExercise );

			// Only run loadModules if exercises are in the page
			} else if ( jQuery( "div.exercise" ).length ) {
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

				var exercise = elem.parents( "div.exercise" ).eq( 0 );

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

		} else if ( problems.length > 0 ) {
			// Collect the weights for the problems and find the total weight
			var weights = jQuery.map( problems, function( elem, i ) {
				elem = jQuery( elem );

				var exercise = elem.parents( "div.exercise" ).eq( 0 );
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

	function enableCheckAnswer() {
		jQuery( "#check-answer-button" )
			.removeAttr( "disabled" )
			.removeClass( "buttonDisabled" )
			.val('Check Answer');
	}

	function disableCheckAnswer() {
		jQuery( "#check-answer-button" )
			.attr( "disabled", "disabled" )
			.addClass( "buttonDisabled" )
			.val('Please wait...');
	}

	function isExerciseLoaded(exerciseName) {
		return _.any( exercises, function( exercise ) {
			return jQuery.data( exercise, "rootName" ) === exerciseName;
		});
	}

	function startLoadingExercise(exerciseName) {

		if ( typeof loadingExercises[exerciseName] !== "undefined" ) {
			// Already started loading this exercise.
			return;
		}

		if ( isExerciseLoaded( exerciseName ) ) {
			return;
		}

		var exerciseElem = jQuery( "<div>" )
			.data( "name", exerciseName )
			.data( "rootName", exerciseName );

		// Queue up an exercise load
		loadExercise.call( exerciseElem, function() {

			// Trigger load completion event for this exercise
			jQuery( Khan ).trigger("exerciseLoaded:" + exerciseName);

			delete loadingExercises[exerciseName];

		});

	}

	function loadAndRenderExercise( nextUserExercise ) {

		setUserExercise( nextUserExercise );
		exerciseName = userExercise.exerciseModel.name;

		function finishRender() {

			// Get all problems of this exercise type...
			var problems = exercises.filter(function() {
				return jQuery.data( this, "rootName" ) === exerciseName;
			}).children( ".problems" ).children();

			// ...and create a new problem bag with problems of our new exercise type.
			problemBag = makeProblemBag( problems, 10 );

			// Update related videos
			Khan.relatedVideos.setVideos( userExercise.exerciseModel );

			// Make scratchpad persistent per-user
			if ( user ) {
				var lastScratchpad = window.localStorage[ "scratchpad:" + user ];
				if ( typeof lastScratchpad !== "undefined" && JSON.parse( lastScratchpad ) ) {
					Khan.scratchpad.show();
				}
			}

			// Generate a new problem
			makeProblem();

		}

		if (isExerciseLoaded(exerciseName)) {
			finishRender();
		} else {
			startLoadingExercise(exerciseName);

			jQuery( Khan )
				.unbind("exerciseLoaded:" + exerciseName)
				.bind("exerciseLoaded:" + exerciseName, function() {
					finishRender();
				});
		}

	}

	function makeProblem( id, seed ) {

		// Enable scratchpad (unless the exercise explicitly disables it later)
		Khan.scratchpad.enable();

		// Allow passing in a random seed
		if ( typeof seed !== "undefined" ) {
			problemSeed = seed;

		// In either of these testing situations,
		} else if ( (testMode && Khan.query.test != null) || user == null ) {
			problemSeed = randomSeed;
		}

		// Set randomSeed to what problemSeed is (save problemSeed for recall later)
		randomSeed = problemSeed;

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
		} else if ( problemBag.length > 0 ) {
			problem = problemBag[ problemBagIndex ];
			id = problem.data( "id" );

		// No valid problem was found, bail out
		} else {
			return;
		}

		problemID = id;

		// Find which exercise this problem is from
		exercise = problem.parents( "div.exercise" ).eq( 0 );

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
			// var blocks append their contents to the parent
			.find( ".vars" ).tmplApply( { attribute: "class", defaultApply: "appendVars" } ).end()

			// Individual variables override other variables with the same name
			.find( ".vars [id]" ).tmplApply().end()

			// We also look at the main blocks within the problem itself to override,
			// ignoring graphie and spin blocks
			.children( "[class][class!='graphie'][class!='spin']" ).tmplApply( { attribute: "class" } );

		// Finally we do any inheritance to the individual child blocks (such as problem, question, etc.)
		children.each(function () {
			// Apply while adding problem.children() to include
			// template definitions within problem scope
			jQuery( this ).find( "[id]" ).add( children ).tmplApply();
		});

		// Remove and store hints to delay running modules on it
		hints = problem.children( ".hints" ).remove();

		// Remove the hint box if there are no hints in the problem
		if ( hints.length === 0 ) {
			jQuery( ".hint-box" ).remove();
		}

		// Evaluate any inline script tags in this exercise's source
		jQuery.each( exercise.data("script") || [], function( i, scriptContents ) {
			jQuery.globalEval( scriptContents );
		});

		// ...and inline style tags.
		if ( exercise.data( "style" ) ) {
			var exerciseStyleElem = jQuery( "head #exercise-inline-style" );

			// Clear old exercise style definitions
			if ( exerciseStyleElem.length && exerciseStyleElem[0].styleSheet ) {
				// IE refuses to modify the contents of <style> the normal way
				exerciseStyleElem[0].styleSheet.cssText = "";
			} else {
				exerciseStyleElem.empty();
			}

			// Then add rules specific to this exercise.
			jQuery.each( exercise.data("style"), function( i, styleContents ) {
				if ( exerciseStyleElem.length && exerciseStyleElem[0].styleSheet ) {
					// IE refuses to modify the contents of <style> the normal way
					exerciseStyleElem[0].styleSheet.cssText = exerciseStyleElem[0].styleSheet.cssText + styleContents;
				} else {
					exerciseStyleElem.append( styleContents );
				}
			});
		}

		// Run the main method of any modules
		problem.runModules( problem, "Load" );
		problem.runModules( problem );

		// Store the solution to the problem
		var solution = problem.find(".solution"),

			// Get the multiple choice problems
			choices = problem.find(".choices"),

			// Get the area into which solutions will be inserted,
			// Removing any previous answer
			solutionarea = jQuery("#solutionarea").empty(),

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
		// if this fails then we will need to try generating another one.)
		guessLog = [];
		userActivityLog = [];
		validator = Khan.answerTypes[answerType]( solutionarea, solution );

		// A working solution was generated
		if ( validator ) {
			// Focus the first input
			// Use .select() and on a delay to make IE happy
			var firstInput = solutionarea.find( ":input" ).first();
			setTimeout( function() {
				if (!firstInput.is(":disabled")) {
					firstInput.focus();
					if (firstInput.is("input:text")) {
						firstInput.select();
					}
				}
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
		Khan.scratchpad.resize();

		// Enable the all answer input elements except the check answer button.
		jQuery( "#answercontent input" ).not( '#check-answer-button' )
			.removeAttr( "disabled" );

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
				if (jQuery.isArray( el )) {
					// group nested arrays of answers, for sets of multiples or multiples of sets.
					// no reason answers can't be nested arbitrarily deep, but here we assume no
					// more than one sub-level.
					var subAnswer = jQuery( "<span>" ).addClass( "group-box" ).appendTo(answer);
					jQuery.each( el, function( i, el ) {
						jQuery( "<span>" ).text( el ).addClass( "box" ).appendTo(subAnswer);
					} );
				} else {
					jQuery( "<span>" ).text( el ).addClass( "box" ).appendTo( answer );
				}
			} );
		}

		if (typeof userExercise !== "undefined" && userExercise.readOnly) {
			if (!userExercise.current) {
				warn("This exercise may have changed since it was completed", true);
			}

			var timelineEvents, timeline;

			var timelinecontainer = jQuery( "<div id='timelinecontainer'>" )
				.append( "<div>\
							<div id='previous-problem' class='simple-button action-gradient'>Previous Problem</div>\
							<div id='previous-step' class='simple-button action-gradient'><span>Previous Step</span></div>\
							</div>" )
				.insertBefore( "#problem-and-answer" );

			jQuery.fn.disable = function() {
				this.addClass( 'disabled' )
					.css( {
					cursor: 'default !important'
					} )
					.data( 'disabled', true );
				return this;
			}

			jQuery.fn.enable = function() {
				this.removeClass( 'disabled' )
					.css( {
					cursor: 'pointer'
					} )
					.data( 'disabled', false );
				return this;
			}

			if (userExercise.totalDone === 0) {
				jQuery( '#previous-problem' ).disable();
			}

			timeline = jQuery( "<div id='timeline'>" ).appendTo( timelinecontainer );
			timelineEvents = jQuery( "<div id='timeline-events'>" ).appendTo( timeline );

			timelinecontainer
				.append( "<div>\
							<div id='next-problem' class='simple-button action-gradient'>Next Problem</div>\
							<div id='next-step' class='simple-button action-gradient'><span>Next Step</span></div>\
							</div>" );

			jQuery( "<div class='user-activity correct-activity'>Started</div>" )
				.data( 'hint', false )
				.appendTo( timelineEvents );

			var hintNumber = 0,
				answerNumber = 1;

			/* value[0]: css class
			 * value[1]: guess
			 * value[2]: time taken since last guess
			 */
			jQuery.each(userExercise.userActivity, function(index, value) {
				var guess = value[1] === "Activity Unavailable" ? value[1] : JSON.parse( value[1] ),
					thissolutionarea;

				timelineEvents
					.append( "<div class='timeline-time'>" + value[2] + "s</div>" );

				thissolutionarea = jQuery( "<div>" )
					.addClass( "user-activity " + value[0] )
					.appendTo( timelineEvents );

				if (value[0] === "hint-activity") {
					thissolutionarea.attr( 'title', 'Hint used' );
					thissolutionarea
						.data( 'hint', hintNumber )
						.prepend( "Hint #" + (hintNumber+1) );
					hintNumber += 1;
				} else { // This panel is a solution (or the first panel)
					thissolutionarea.data( 'hint', false );
					if (guess === "Activity Unavailable") {
						thissolutionarea.text( guess );
					} else {
						if (answerType === 'radio') {
							// radio is the only answer type that can't display its own guesses
							thissolutionarea.append( jQuery(
								"<p class='solution'>" + guess + "</p>" ).tmpl()
							);

							if (index === userExercise.userActivity.length - 1) {
								thissolutionarea
									.removeClass( 'incorrect-activity' )
									.addClass( 'correct-activity' );

								thissolutionarea.attr( 'title', 'Correct Answer' );
							} else {
								thissolutionarea.attr( 'title', 'Incorrect Answer' );
							}
						} else {
							var thisValidator = Khan.answerTypes[answerType]( thissolutionarea, solution );

							thisValidator.showGuess( guess );

							if (thisValidator() === true) {
								// If the user didn't get the problem right on the first try, all
								// answers are labelled incorrect by default
								thissolutionarea
									.removeClass( 'incorrect-activity' )
									.addClass( 'correct-activity' );

								thissolutionarea.attr( 'title', 'Correct Answer' );
							} else {
								thissolutionarea
									.removeClass( 'correct-activity' )
									.addClass( 'incorrect-activity' );
								thissolutionarea.attr( 'title', 'Incorrect Answer' );
							}
						}

						thissolutionarea
							.data( 'guess', guess )
								.find( 'input' )
								.attr( 'disabled', true )
							.end()
								.find( 'select' )
								.attr( 'disabled', true );
					}
				}
			});

			if (timelinecontainer.height() > timeline.height()) {
				timeline.height( timelinecontainer.height() );
			}

			var states = timelineEvents.children( ".user-activity" ),
				currentSlide = states.length - 1,
				numSlides = states.length,
				firstHintIndex = timeline.find( '.hint-activity:first' )
					.index( '.user-activity' ),
				lastHintIndex	= timeline.find( '.hint-activity:last' )
					.index( '.user-activity' ),
				totalHints = timeline.find( '.hint-activity:last' )
					.index( '.hint-activity' ),
				hintButton = jQuery( '#hint' ),
				timelineMiddle = timeline.width() / 2,
				realHintsArea = jQuery( '#hintsarea' ),
				realWorkArea = jQuery( '#workarea' ),
				statelist = [],
				previousHintNum = 100000;

			// So highlighting doesn't fade to white
			jQuery( '#solutionarea' ).css( 'background-color', jQuery( '#answercontent' ).css( 'background-color' ) );

			jQuery.fn.scrubber = function() {
				// create triangular scrubbers above and below current selection
				var timeline = jQuery( '#timeline' ),
					scrubber1 = jQuery( '#scrubber1' ),
					scrubber2 = jQuery( '#scrubber2' ),
					scrubberCss = {
					display: 'block',
					width: '0',
					height: '0',
					'border-left': '6px solid transparent',
					'border-right': '6px solid transparent',
					position: 'absolute',
					left: (timeline.scrollLeft() + this.position().left + this.outerWidth()/2 + 2) + 'px'
					};

				scrubber1 = scrubber1.length ? scrubber1 : jQuery("<div id='scrubber1'>").appendTo( timeline );
				scrubber2 = scrubber2.length ? scrubber2 : jQuery("<div id='scrubber2'>").appendTo( timeline );

				scrubber1.css( jQuery.extend( {}, scrubberCss, {
					'border-bottom': '6px solid #888',
					bottom: '0'
				}) );

				scrubber2.css( jQuery.extend( {}, scrubberCss, {
					'border-top': '6px solid #888',
					top: '0'
				}) );

				return this;
			};

			// Set the width of the timeline (starts as 10000px) after MathJax loads
			MathJax.Hub.Queue( function() {
				var maxHeight = 0;
				timelineEvents.children().each( function() {
					maxHeight = Math.max( maxHeight, jQuery( this ).outerHeight(true) );
				});

				if (maxHeight > timelinecontainer.height()) {
					timelinecontainer.height( maxHeight );
					timeline.height( maxHeight );
				}
			} );

			var create = function( i ) {
				var thisSlide = states.eq( i );

				var thisHintArea, thisProblem,
					hintNum = jQuery( '#timeline-events .user-activity:lt('+(i+1)+')' )
							.filter('.hint-activity').length - 1,
					// Bring the currently focused panel as close to the middle as possible
					itemOffset = thisSlide.position().left,
					itemMiddle = itemOffset + thisSlide.width() / 2,
					offset = timelineMiddle - itemMiddle,
					currentScroll = timeline.scrollLeft(),
					timelineMax = states.eq( -1 ).position().left + states.eq( -1 ).width(),
					scroll = Math.min( currentScroll - offset, currentScroll + timelineMax - timeline.width() + 25 );

				if (hintNum >= 0) {
					jQuery( hints[hintNum] ).appendTo( realHintsArea ).runModules( problem );
				}

				MathJax.Hub.Queue( function() {
					var recordState = function() {
						jQuery( "#problemarea input" ).attr({ disabled: "disabled" });
						thisHintArea = realHintsArea.clone();
						thisProblem = realWorkArea.clone();

						var thisState = {
							slide: thisSlide,
							hintNum: hintNum,
							hintArea: thisHintArea,
							problem: thisProblem,
							scroll: scroll
						};

						statelist[i] = thisState;

						if (i+1 < states.length) {
							MathJax.Hub.Queue( function() {
								create( i+1 );
							} );
						} else {
							activate( i );
						}
					};

					if ( thisSlide.data( "guess" ) !== undefined && jQuery.isFunction( validator.showCustomGuess ) ) {
						KhanUtil.currentGraph = jQuery( realWorkArea ).find( ".graphie" ).data( "graphie" );
						validator.showCustomGuess( thisSlide.data( "guess" ) );
						MathJax.Hub.Queue( recordState );
					} else {
						recordState();
					}

				});
			};

			MathJax.Hub.Queue( function() {create(0);} );

			var activate = function( slideNum ) {
				var hint, thisState,
					thisSlide = states.eq( slideNum ),
					fadeTime = 150;

				// All content for this state has been built before
				if (statelist[slideNum]) {
					thisState = statelist[slideNum];

					timeline.animate({
						scrollLeft: thisState.scroll
					}, fadeTime, function() {
						thisState.slide.scrubber();
					});

					if (slideNum < firstHintIndex) {
						hintRemainder.fadeOut( fadeTime );
						hintButton.val( "I'd like a hint" );
					} else if (slideNum >= lastHintIndex) {
						if (states.eq( lastHintIndex ).data( 'hint' ) < hints.length) {
							hintRemainder.fadeOut( fadeTime );
						}
					} else {
						hintButton.val( "I'd like another hint (" + (totalHints - thisState.hintNum) + " remaining)" );
					}

					jQuery( '#workarea' ).remove();
					jQuery( '#hintsarea' ).remove();
					jQuery( '#problemarea' ).append( thisState.problem ).append( thisState.hintArea );

					if (thisSlide.data( 'guess' )) {
						solutionarea.effect( 'highlight', {}, fadeTime );

						// If there is a guess we show it as if it was filled in by the user
						validator.showGuess( thisSlide.data( 'guess' ) );
					} else {
						validator.showGuess();
					}

					// TODO: still highlight even if hint modifies problem (and highlight following hints)
					if (slideNum > 0 && (thisState.hintNum > statelist[slideNum-1].hintNum)) {
						jQuery( '#hintsarea' ).children().each( function( index, elem ) {
							if (index > previousHintNum) {
								jQuery( elem ).effect( 'highlight', {}, fadeTime );
							}
						} );

						previousHintNum = thisState.hintNum;
					}

					jQuery( '#previous-step, #next-step' ).enable();
					if (slideNum === 0) {
						previousHintNum = -1;
						jQuery( '#previous-step' ).disable();
					} else if (slideNum === numSlides - 1) {
						jQuery( '#next-step' ).disable();
					}
				}
			};

			// Allow users to use arrow keys to move up and down the timeline
			jQuery( document ).keydown(function(event) {
				if (event.keyCode !== 37 && event.keyCode !== 39) {
					return;
				}

				if (event.keyCode === 37) { // left
					currentSlide -= 1;
				} else { // right
					currentSlide += 1;
				}

				currentSlide = Math.min(currentSlide, numSlides-1);
				currentSlide = Math.max(currentSlide, 0);

				activate( currentSlide );

				return false;
			});

			// Allow users to click on points of the timeline
			jQuery( states ).click(function(event) {
				var index = jQuery( this ).index( "#timeline .user-activity" );

				currentSlide = index;
				activate( currentSlide );

				return false;
			});

			jQuery( '#previous-step' ).click(function(event) {
				if (currentSlide > 0) {
					currentSlide -= 1;
					activate( currentSlide );
				}

				return false;
			});

			jQuery( '#next-step' ).click(function(event) {
				if (currentSlide < numSlides-1) {
					currentSlide += 1;
					activate( currentSlide );
				}

				return false;
			});

			jQuery( '#next-problem' ).click(function(event) {
				window.location.href = userExercise.nextProblemUrl;
			});

			jQuery( '#previous-problem' ).click(function(event) {
				if (!jQuery( this ).data( 'disabled' )) {
					window.location.href = userExercise.previousProblemUrl;
				}
			});

			// Some exercises use custom css
			jQuery( "#timeline input[type='text']" ).css( "width",
				jQuery( "#answer_area input[type='text']" ).css('width')
			);

			jQuery( '#hint' ).attr( 'disabled', true );
			jQuery( '#answercontent input' ).attr( 'disabled', true );
			jQuery( '#answercontent select' ).attr( 'disabled', true );
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


			if ( !Khan.query.activity ) {
				links.append("<br>");
				var historyURL = debugURL + "&seed=" + problemSeed + "&activity=";
				jQuery( "<a>Problem history</a>" ).attr( "href", "javascript:" ).click(function( event ) {
					window.location.href = historyURL + encodeURIComponent( JSON.stringify( userActivityLog ) );
				}).appendTo( links );
			} else {
				links.append("<br>");
				jQuery( "<a>Random problem</a>" )
					.attr( "href", debugURL )
					.appendTo( links );
			}

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

			if ( jQuery.tmpl.DATA_ENSURE_LOOPS > 0 ) {
				var dataEnsureInfo = jQuery( "<p>" );
				dataEnsureInfo.append("Data-ensure loops: " + jQuery.tmpl.DATA_ENSURE_LOOPS);
				if ( jQuery.tmpl.DATA_ENSURE_LOOPS > 15 ) {
					dataEnsureInfo.css( "background-color", "yellow" );
				}
				if ( jQuery.tmpl.DATA_ENSURE_LOOPS > 30 ) {
					dataEnsureInfo.css( "background-color", "orange" );
				}
				if ( jQuery.tmpl.DATA_ENSURE_LOOPS > 50 ) {
					dataEnsureInfo.css( "background-color", "red" );
				}
				dataEnsureInfo.appendTo( debugWrap );
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

		hintsUsed = 0;
		attempts = 0;
		lastAction = (new Date).getTime();

		jQuery( "#hint" ).val( "I'd like a hint" );

		// Update dimensions for sticky box
		jQuery( "#answer_area" ).adhere();

		jQuery(Khan).trigger( "newProblem" );

		return answerType;
	}

	function renderNextProblem( nextUserExercise ) {
		enableCheckAnswer();

		jQuery("#happy").hide();
		if( !jQuery( "#examples-show" ).data( "show" ) ){ jQuery( "#examples-show" ).click(); }

		// Toggle the navigation buttons
		jQuery("#check-answer-button").show();
		jQuery("#next-question-button").blur().hide();

		// Wipe out any previous problem
		jQuery("#workarea").hide();
		jQuery("#workarea, #hintsarea").runModules( problem, "Cleanup" ).empty();
		jQuery("#hint").attr( "disabled", false );

		Khan.scratchpad.clear();

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

			if ( testMode ) {
				// Just generate a new problem from existing exercise
				makeProblem();
			} else {
				loadAndRenderExercise( nextUserExercise );
			}

		}
	}

	function prepareSite() {
		// TODO(david): Don't add homepage elements with "exercise" class
		exercises = exercises.add( jQuery( "div.exercise" ).detach() );

		// Setup appropriate img URLs
		jQuery( "#issue-throbber" )
			.attr( "src", urlBase + "css/images/throbber.gif" );

		jQuery( "#answer_area" ).adhere( {
			container: jQuery( "#answer_area_wrap" ).parent(),
			topMargin: 10,
			bottomMargin: 10
		} );

		// Change form target to the current page so errors do not kick us
		// to the dashboard
		jQuery( "#answerform" ).attr( "action", window.location.href );

		// Watch for a solution submission
		jQuery("#check-answer-button").click( handleSubmit );
		jQuery("#answerform").submit( handleSubmit );

		// Build the data to pass to the server
		function buildAttemptData(pass, attemptNum, attemptContent, curTime) {
			var timeTaken = Math.round((curTime - lastAction) / 1000);

			if ( attemptContent !== "hint" ) {
				userActivityLog.push([ pass ? "correct-activity" : "incorrect-activity", attemptContent, timeTaken ]);
			} else {
				userActivityLog.push([ "hint-activity", "0", timeTaken ]);
			}

			return {
				// The user answered correctly
				complete: pass === true ? 1 : 0,

				// The user used a hint
				count_hints: hintsUsed,

				// How long it took them to complete the problem
				time_taken: timeTaken,

				// How many times the problem was attempted
				attempt_number: attemptNum,

				// The answer the user gave
				// TODO: Get the real provided answer
				attempt_content: attemptContent,

				// A hash representing the exercise
				// TODO: Populate this from somewhere
				sha1: typeof userExercise !== "undefined" ? userExercise.exerciseModel.sha1 : exerciseName,

				// The seed that was used for generating the problem
				seed: problemSeed,

				// The seed that was used for generating the problem
				problem_type: problemID,

				// Whether we are currently in review mode
				review_mode: (!testMode && Exercises.reviewMode) ? 1 : 0,

				// Whether we are currently in topic mode
				topic_mode: (!testMode && !Exercises.reviewMode && !Exercises.practiceMode) ? 1 : 0,

				// Request camelCasing in returned response
				casing: "camel"
			};
		}

		function handleSubmit() {
			var pass = validator();

			// Stop if the user didn't enter a response
			// If multiple-answer, join all responses and check if that's empty
			// Remove commas left by joining nested arrays in case multiple-answer is nested
			if ( jQuery.trim( validator.guess ) === "" ||
				 ( validator.guess instanceof Array && jQuery.trim( validator.guess.join( "" ).replace(/,/g, '') ) === "" ) ) {
				return false;
			} else {
				guessLog.push( validator.guess );
			}

			// Stop if the form is already disabled and we're waiting for a response.
			if ( jQuery( "#answercontent input" ).not( "#hint" ).is( ":disabled" ) ) {
				return false;
			}

			jQuery( "#answercontent input" ).not("#check-answer-button, #hint")
				.attr( "disabled", "disabled" );
			jQuery( "#check-answer-results p" ).hide();

			var examples = jQuery( "#examples" ),
				examplesLink = jQuery( "#examples-show" ),
				checkAnswerButton = jQuery( "#check-answer-button" );

			// Figure out if the response was correct
			if ( pass === true ) {
				examplesLink.qtip("hide");
			} else {
				checkAnswerButton
					.effect("shake", {times:3, distance: 5}, 80)
					.val("Try Again");

				// Is this a message to be shown?
				if ( typeof pass === "string" ) {
					jQuery( "#check-answer-results .check-answer-message" ).html( pass ).tmpl().show();
				}

				// Show the examples (acceptable answer formats) if available -- we get
				// a lot of issues due to incorrect formats (eg. "3.14159" instead of
				// "3pi", "log(2^5)" instead of "log(32)").
				if ( examplesLink.is( ":visible" ) ) {
					if ( !examples.is( ":visible" ) ) {
						examplesLink.qtip("show");
						setTimeout(function() {
							examplesLink.qtip("hide");
						}, 3000);
					}
				}

				// Refocus text field so user can type a new answer
				if ( lastFocusedSolutionInput != null ) {
					setTimeout( function() {
						var focusInput = jQuery( lastFocusedSolutionInput );

						if (!focusInput.is(":disabled")) {
							// focus should always work; hopefully select will work for text fields
							focusInput.focus();
							if (focusInput.is("input:text")) {
								focusInput.select();
							}
						}
					}, 1 );
				}
			}

			// The user checked to see if an answer was valid

			// Save the problem results to the server
			var curTime = new Date().getTime();
			var data = buildAttemptData(pass, ++attempts, JSON.stringify(validator.guess), curTime);
			request( "problems/" + problemNum + "/attempt", data, function() {

				// TODO: Save locally if offline
				jQuery(Khan).trigger( "attemptSaved" );

			}, function() {
				// Error during submit. Disable the page and ask users to
				// reload in an attempt to get updated data.

				// Alert any listeners of the error before reload
				jQuery( Khan ).trigger("attemptError", userExercise);

				// Hide the page so users don't continue
				jQuery( "#problem-and-answer" ).css("visibility", "hidden");

				warn(
					"This page is out of date. You need to <a href='" + window.location.href + 
					"'>reload this page</a>, but don't worry, you haven't lost any progress."
				);

			}, "attempt_hint_queue" );

			if ( pass === true ) {
				// Correct answer, so show the next question button.
				jQuery( "#check-answer-button" ).hide();
				if ( !testMode || Khan.query.test == null ) {
					jQuery( "#next-question-button" )
						.removeAttr( "disabled" )
						.removeClass( "buttonDisabled" )
						.show()
						.focus();
				}
				nextProblem( 1 );
			} else {
				// Wrong answer. Enable all the input elements
				jQuery( "#answercontent input" ).not( "#hint" )
					.removeAttr( "disabled" );
			}

			// Remember when the last action was
			lastAction = curTime;

			jQuery(Khan).trigger( "checkAnswer", {
				pass: pass,
				// Determine if this attempt qualifies as fast completion
				fast: ( typeof userExercise !== "undefined" && userExercise.secondsPerFastProblem >= data.time_taken )
			});

			if ( pass === true ) {
				// Problem has been completed -- now waiting on user to
				// move to next problem.
				jQuery( Khan ).trigger("problemDone");
			}

			return false;
		}

		// Watch for when the next button is clicked
		jQuery("#next-question-button").click(function(ev) {
			jQuery( Khan ).trigger("gotoNextProblem");
		});

		// Watch for when the "Get a Hint" button is clicked
		jQuery( "#hint" ).click(function() {

			var hint = hints.shift();

			// Update dimensions for sticky box
			jQuery( "#answer_area" ).adhere();

			if ( hint ) {
				jQuery( Khan ).trigger("hintUsed");

				hintsUsed += 1;

				jQuery( this )
					.val( jQuery( this ).data( "buttonText" ) || "I'd like another hint (" + hints.length + " remaining)" );

				var problem = jQuery( hint ).parent();

				// Append first so MathJax can sense the surrounding CSS context properly
				jQuery( hint ).appendTo( "#hintsarea" ).runModules( problem );

				// Grow the scratchpad to cover the new hint
				Khan.scratchpad.resize();

				// Disable the get hint button
				if ( hints.length === 0 ) {
					jQuery( Khan ).trigger("allHintsUsed");

					jQuery( this ).attr( "disabled", true );
				}
			}

			var fProdReadOnly = !testMode && userExercise.readOnly;
			var fAnsweredCorrectly = jQuery( "#next-question-button" ).is( ":visible" );
			if ( !fProdReadOnly && !fAnsweredCorrectly ) {
				// Resets the streak and logs history for exercise viewer
				request(
					"problems/" + problemNum + "/hint",
					buildAttemptData(false, attempts, "hint", new Date().getTime()),
					// Don't do anything on success or failure, silently failing is ok here
					function() {},
					function() {},
					"attempt_hint_queue"
				);
			}

			// The first hint is free iff the user has already attempted the question
			if ( hintsUsed === 1 && attempts > 0 ) {
				gae_bingo.bingo( "hints_free_hint" );
				gae_bingo.bingo( "hints_free_hint_binary" );
			}
		});

		// On an exercise page, replace the "Report a Problem" link with a button
		// to be more clear that it won't replace the current page.
		jQuery( "<a>Report a Problem</a>" )
			.attr( "id", "report" ).addClass( "simple-button action-gradient green" )
			.replaceAll( jQuery( ".footer-links #report" ) );

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

			var pretitle = jQuery( "title" ).text().replace(/ \|.*/, ''),
				type = jQuery( "input[name=issue-type]:checked" ).prop( "id" ),
				title = jQuery( "#issue-title" ).val(),
				email = jQuery( "#issue-email" ).val(),
				path = exerciseName + ".html"
					+ "?seed=" + problemSeed
					+ "&problem=" + problemID,
				pathlink = "[" + path + ( exercise.data( "name" ) != null && exercise.data( "name" ) !== exerciseName ? " (" + exercise.data( "name" ) + ")" : "" ) + "](http://sandcastle.khanacademy.org/media/castles/Khan:master/exercises/" + path + "&debug)",
				historyLink = "[Answer timeline](" + "http://sandcastle.khanacademy.org/media/castles/Khan:master/exercises/" + path + "&debug&activity=" + encodeURIComponent( JSON.stringify( userActivityLog ) ).replace( /\)/g, "\\)" ) + ")",
				agent = navigator.userAgent,
				mathjaxInfo = "MathJax is " + ( typeof MathJax === "undefined" ? "NOT loaded" :
					( "loaded, " + ( MathJax.isReady ? "" : "NOT ") + "ready, queue length: " + MathJax.Hub.queue.queue.length ) ),
				sessionStorageInfo = ( typeof sessionStorage === "undefined" || typeof sessionStorage.getItem === "undefined" ? "sessionStorage NOT enabled" : null ),
				warningInfo = jQuery( "#warning-bar-content" ).text(),
				parts = [ email ? "Reporter: " + email : null, jQuery( "#issue-body" ).val() || null, pathlink, historyLink, "    " + JSON.stringify( guessLog ), agent, sessionStorageInfo, mathjaxInfo, warningInfo ],
				body = jQuery.grep( parts, function( e ) { return e != null; } ).join( "\n\n" );

			var mathjaxLoadFailures = jQuery.map( MathJax.Ajax.loading, function( info, script ) {
				if ( info.status === -1 ) {
					return [ script + ": error" ];
				} else {
					return [];
				}
			} ).join( "\n" );
			if ( mathjaxLoadFailures.length > 0 ) {
				body += "\n\n" + mathjaxLoadFailures;
			}

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
				if ( v ) labels.push( k );
			});

			if ( !type ) {
				jQuery( "#issue-status" ).addClass( "error" )
					.html( "Please specify the issue type." ).show();
				return;
			} else {
				labels.push( type.slice( "issue-".length ) );

				var hintOrVideoMsg = "Please click the hint button above to see our solution, or watch a video for additional help.";
				var refreshOrBrowserMsg = "Please try a hard refresh (press Ctrl + Shift + R)" +
						" or use Khan Academy from a different browser (such as Chrome or Firefox).";
				var suggestion = {
					"issue-wrong-or-unclear": hintOrVideoMsg,
					"issue-hard": hintOrVideoMsg,
					"issue-not-showing": refreshOrBrowserMsg,
					"issue-other": ""
				}[ type ];
			}

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
						.html( issueSuccess( data.html_url, data.title, suggestion ) )
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

				// Reset answer fields, etc. and clear work and hints area
				jQuery("#next-question-button").click();

				if ( show ) {
					link.text( "Try current problem" );
					jQuery( "#answerform" ).hide();

					for ( var i = 0; i < 9; i++ ) {
						jQuery( "#workarea" ).append( "<hr>" );
						nextProblem( 1 );
						makeProblem();
					}

					// Rewind so next time we make a problem we'll be back at the beginning
					prevProblem( 9 );
				} else {
					link.text( "Show next 10 problems" );
					jQuery( "#answerform" ).show();
				}

				jQuery( "#answerform input[type='button']" ).attr( "disabled", show );

				link.data( "show", !show );
			});

		jQuery( "#warning-bar-close a").click( function( e ) {
			e.preventDefault();
			jQuery( "#warning-bar" ).fadeOut( "slow" );
		});

		jQuery( "#scratchpad-show" )
			.click( function( e ) {
				e.preventDefault();
				Khan.scratchpad.toggle();

				if ( user ) {
					window.localStorage[ "scratchpad:" + user ] = Khan.scratchpad.isVisible();
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
				nextProblem( 1 );
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

				var title = encodeURIComponent( "Issue Found in Testing - " + jQuery("title").html() ),
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
			// Display Messages like "You're Proficient" or "You Seem To Be Struggling"
			// TODO: this functionality is currently hidden from power-mode. Restore it.
			// https://trello.com/card/restore-you-re-ready-to-move-on-and-struggling-in-action-messages/4f3f43cd45533a1b3a065a1d/34
			APIActionResults.register("exercise_state",
				function(userState) {
					var jel = jQuery("#exercise-message-container");
					if (userState.template !== null) {
						jel.empty().append(userState.template);
						setTimeout(function(){ jel.slideDown(); }, 50);
					}
					else {
						jel.slideUp();
					}
				}
			);
		}

		jQuery( Khan )
			.bind("updateUserExercise", function( ev, data ) {
				// Any time we update userExercise, check if we're setting/switching usernames
				if ( data ) {
					user = data.user || user;
					userCRC32 = user != null ? crc32( user ) : null;
					randomSeed = userCRC32 || randomSeed;
				}
			});

		// Register testMode-specific event handlers
		if ( testMode ) {

			// testMode automatically advances to the next problem --
			// integrated mode just listens and waits for renderNextProblem
			jQuery( Khan ).bind("gotoNextProblem", function() {
				renderNextProblem();
			});

		}

		Khan.relatedVideos.hookup();

		if (window.ModalVideo) {
			ModalVideo.hookup();
		}
	}

	if ( !testMode ) {
		// testMode automatically prepares itself in loadModules,
		// where it loads jQuery and the rest of its dependencies
		// dynamically.
		//
		// Integrated mode already has jQuery, so we listen
		// and wait for the signal to prepare.
		jQuery( Exercises )
			.bind( "problemTemplateRendered", prepareSite )
			.bind( "readyForNextProblem", function(ev, data) {
				renderNextProblem(data.userExercise);
			})
			.bind("warning", function( ev, data ) {
				warn(data.text, data.showClose);
			})
			.bind("upcomingExercise", function( ev, data ) {
				startLoadingExercise(data.exerciseName);
			});
	}

	function setProblemNum( num ) {
		problemNum = num;
		problemSeed = (seedOffset + jumpNum * (problemNum - 1)) % bins;
		problemBagIndex = (problemNum + problemCount - 1) % problemCount;
	}

	function nextProblem( num ) {
		setProblemNum( problemNum + num );
	}

	function prevProblem( num ) {
		nextProblem( -num );
	}

	function setUserExercise( data ) {

		userExercise = data;

		if ( data && data.exercise ) {
			exerciseName = data.exercise;
		}

		jQuery( Khan ).trigger("updateUserExercise", userExercise);

		if ( user != null ) {
			// How far to jump through the problems
			jumpNum = primes[ userCRC32 % primes.length ];

			// The starting problem of the user
			seedOffset = userCRC32 % bins;

			// Advance to the current problem seed
			setProblemNum( userExercise.totalDone + 1 );
		}
	}

	function request( method, data, fn, fnError, queue ) {
		if ( testMode ) {
			// Pretend we have success
			if ( jQuery.isFunction( fn ) ) {
				fn();
			}

			return;
		}

		var xhrFields = {};
		if ( typeof XMLHTTPRequest !== "undefined" ) {
			// If we have native XMLHTTPRequest support,
			// make sure cookies are passed along.
			xhrFields["withCredentials"] = true;
		}

		var request = {
			// Do a request to the server API
			url: server + "/api/v1/user/exercises/" + exerciseName + "/" + method,
			type: "POST",
			data: data,
			dataType: "json",
			xhrFields: xhrFields,

			// Backup the response locally, for later use
			success: function( data ) {

				// Tell any listeners that khan-exercises has new 
				// userExercise data
				jQuery( Khan ).trigger("updateUserExercise", data);

				if ( jQuery.isFunction( fn ) ) {
					fn( data );
				}
			},

			complete: function() {
				jQuery( Khan ).trigger("apiRequestEnded");
			},

			// Handle error edge case
			error: fnError
		};

		// Send request and return a jqXHR (which implements the Promise interface)
		function sendRequest() {
			// Do request using OAuth, if available
			if ( typeof oauth !== "undefined" && jQuery.oauth ) {
				return jQuery.oauth( jQuery.extend( {}, oauth, request ) );
			}

			return jQuery.ajax( request );
		}

		// We may want to queue up the requests so that they're sent serially.
		//
		// We currently do this for problem attempts and hints to avoid a race
		// condition:
		// 1) request A fetches UserExercise X
		// 2) request B also fetches X
		// 3) A finishes updating X and saves as A(X)
		// 4) now B finishes updating X and overwrites A(X) with B(X)
		// ...when what we actually wanted saved is B(A(X)). We should really fix it
		// on the server by running the hint and attempt requests in transactions.
		if ( queue != null ) {
			// Create an empty jQuery object to use as a queue holder, if needed.
			requestQueue[queue] = requestQueue[queue] || jQuery( {} );

			// Queue up sending the request to run when old requests have completed.
			requestQueue[queue].queue(function(next) {
				sendRequest().always( next );
			});
		} else {
			sendRequest();
		}

		// Trigger an apiRequestStarted event here, and not in the inner sendRequest()
		// function, because listeners should know an API request is waiting as
		// soon as it gets queued up.
		jQuery( Khan ).trigger("apiRequestStarted");
	}

	function loadExercise( callback ) {
		var self = jQuery( this ).detach();
		var name = self.data( "name" );
		var weight = self.data( "weight" );
		var rootName = self.data( "rootName" );

		if ( !loadingExercises[name] ) {
			loadingExercises[name] = 0;
		}

		loadingExercises[name]++;

		// Packing occurs on the server but at the same "exercises/" URL
		jQuery.get( urlBase + "exercises/" + name + ".html", function( data, status, xhr ) {
			var match, newContents;

			if ( !( /success|notmodified/ ).test( status ) ) {
				// Maybe loading from a file:// URL?
				Khan.error( "Error loading exercise from file " + name + ".html: " + xhr.status + " " + xhr.statusText );
				return;
			}

			newContents = jQuery( data );

			// Name of the top-most ancestor exercise
			newContents.data( "rootName", rootName );

			// Maybe the exercise we just loaded loads some others
			newContents.filter( "[data-name]" ).each( function() { loadExercise.call( this, callback ); } );

			// Throw out divs that just load other exercises
			newContents = newContents.not( "[data-name]" );

			// Save the filename and weights
			// TODO(david): Make sure weights work for recursively-loaded exercises.
			newContents.data( "name", name ).data( "weight", weight );

			// Add the new exercise elements to the exercises DOM set
			exercises = exercises.add( newContents );

			// Extract data-require
			var requires = data.match( /<html(?:[^>]+)data-require=(['"])((?:(?!\1).)*)\1/ );

			if ( requires != null ) {
				requires = requires[ 2 ];
			}

			Khan.require( requires );

			// Extract contents from various tags and save them up for parsing when
			// actually showing this particular exercise.
			var tagsToExtract = {
				title: /<title>([^<]*(?:(?!<\/title>)<[^<]*)*)<\/title>/gi,

				// Scripts with no src
				script: /<(?:)script\b[^s>]*(?:(?!src=)s[^s>]*)*>([^<]*(?:(?!<\/script>)<[^<]*)*)<\/script>/gi,

				style: /<style[^>]*>([\s\S]*?)<\/style>/gi
			};

			jQuery.each( tagsToExtract, function( tag, regex ) {
				var result = [];
				while ( ( match = regex.exec( data ) ) != null ) {
					result.push( match[1] );
				}

				newContents.data( tag, result );
			});

			loadingExercises[name]--;

			if ( loadingExercises[name] === 0) {

				if ( !modulesLoaded ) {
					loadModules( callback );
				} else if ( callback ) {
					callback();
				}

			}

		});

	}

	function loadModules( callback ) {

		modulesLoaded = true;

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

									injectTestModeSite( html, htmlExercise );
									if ( callback ) {
										callback();
									}

								}
							});

						}
					});
				} else {
					if ( callback ) {
						callback();
					}
				}
			});
		});

		function injectTestModeSite( html, htmlExercise ) {
			jQuery("body").prepend( html );
			jQuery("#container").html( htmlExercise );

			if ( Khan.query.layout === "lite" ) {
				jQuery("html").addClass( "lite" );
			}

			prepareSite();

			var problems = exercises.children( ".problems" ).children();

			weighExercises( problems );
			problemBag = makeProblemBag( problems, 10 );

			// Generate the initial problem when dependencies are done being loaded
			var answerType = makeProblem();
		}

	}

	return Khan;

})();

// Make this publicly accessible
var KhanUtil = Khan.Util;
