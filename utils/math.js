jQuery.extend(KhanUtil, {
	// Simplify formulas before display
	cleanMath: function( expr ) {
		return typeof expr === "string" ?
			jQuery.cleanHTML( expr )
				.replace(/\+ -/g, "- ")
				.replace(/- -/g, "+ ")
				.replace(/\^1/g, "") :
			expr;
	},

	// A simple random number picker
	// Returns a random int in [0, num)
	rand: function( num ) {
		return Math.floor( num * KhanUtil.random() );
	},

	/* Returns an array of the digits of a nonnegative intege 
in reverse
	 * order: digits(376) = [6, 7, 3] */
	digits: function(n) {
		if(n == 0) {
			return [0];
		}

		var list = [];

		while(n > 0) {
			list.push(n % 10);
			n = Math.floor(n / 10);
		}

		return list;
	},
	
	// Similar to above digits, but in original order (not reversed)
	integerToDigits: function( number ) {
		if ( n === 0 ) {
			return [0];
		}
		
		var digits = [];
		while ( number > 0 ) {
			digits.unshift( number % 10 );
			number = Math.floor( number / 10 );
		}
		return digits;
	},
	
	digitsToInteger: function( digits ) {
		var place = Math.floor( Math.pow( 10, digits.length - 1 ) );
		var number = 0;
		
		jQuery.each( digits, function(index, digit) {
			number += digit * place;
			place /= 10;
		});
		
		return number;
	},
	
	placesLeftOfDecimal: ["one", "ten", "hundred", "thousand"],
	placesRightOfDecimal: ["unused", "tenth", "hundredth", "thousandth"],
	
	powerToPlace: function( power ) {
		if ( power < 0 ) {
			return KhanUtil.placesRightOfDecimal[ -1 * power ];
		} else {
			return KhanUtil.placesLeftOfDecimal[ power ];
		}
	},

	getGCD: function( a, b ) {
		if ( arguments.length > 2 ) {
			var rest = [].slice.call( arguments, 1 );
			return KhanUtil.getGCD( a, KhanUtil.getGCD.apply( KhanUtil, rest ) );
		} else {
			var mod;

			a = Math.abs( a );
			b = Math.abs( b );

			while ( b ) {
				mod = a % b;
				a = b;
				b = mod;
			}

			return a;
		}
	},

	getLCM: function( a, b ) {
	  return ( a * b ) / KhanUtil.getGCD( a, b );
	},

	primes: [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43,
		47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97],

	getPrime: function() {
		return KhanUtil.primes[ KhanUtil.rand( KhanUtil.primes.length ) ];
	},

	isPrime: function(n) {
		if (n <= 1) {
			return false;
		} else if (n < 101) {
			return !!jQuery.grep(KhanUtil.primes, function(p, i) {
				return Math.abs(p - n) <= 0.5;
			}).length;
		} else {
			/* maybe do something faster, like Miller-Rabin */
			for(var i = 2; i * i <= n; i++) {
				if ( n % i <= 0.5 ) {
					return false;
				}
			}

			return true;
		}
	},

	isOdd: function( n ) {
		return n % 2 === 1;
	},

	isEven: function( n ) {
		return n % 2 === 0;
	},

	getOddComposite: function( min, max ) {
		if ( min === undefined ) {
			min = 0;
		}

		if ( max === undefined ) {
			max = 100;
		}

		var oddComposites = [9, 15, 21, 25, 27, 33, 35, 39, 45, 49, 51, 55];
		oddComposites = oddComposites.concat([57, 63, 65, 69, 75, 77, 81, 85, 87, 91, 93, 95, 99]);

		var result = -1;
		while ( result < min || result > max ) {
			result = oddComposites[ KhanUtil.rand( oddComposites.length ) ];
		}
		return result;
	},

	getEvenComposite: function( min, max ) {
		if ( min === undefined ) {
			min = 0;
		}

		if ( max === undefined ) {
			max = 100;
		}

		var evenComposites = [4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26];
		evenComposites = evenComposites.concat([28, 30, 32, 34, 36, 38, 40, 42, 44, 46, 48]);
		evenComposites = evenComposites.concat([50, 52, 54, 56, 58, 60, 62, 64, 66, 68, 70, 72]);
		evenComposites = evenComposites.concat([74, 76, 78, 80, 82, 84, 86, 88, 90, 92, 94, 96, 98]);

		var result = -1;
		while ( result < min || result > max ) {
			result = evenComposites[ KhanUtil.rand( evenComposites.length ) ];
		}
		return result;
	},

	getPrimeFactorization: function( number ) {
		if ( jQuery.inArray(number, KhanUtil.primes) !== -1 ) {
			return [number];
		}

		var maxf = Math.sqrt( number );
		for (var f = 2; f <= maxf; f++) {
			if ( number % f == 0 ) {
				return jQuery.merge(KhanUtil.getPrimeFactorization( f ), KhanUtil.getPrimeFactorization( number / f ));
			}
		}
	},

	getFactors: function( number ) {
		var factors = [];
		var maxf = Math.sqrt( number );
		for (var f = 1; f <= maxf; f++) {
			if (! ( number % f ) ) {
				factors.push( f );
				factors.push( number / f );
			}
		}
		return KhanUtil.sortNumbers( factors );
	},
	
	// Get a random factor of a composite number which is not 1 or that number
	getNontrivialFactor: function( number ) {
		var factors = KhanUtil.getFactors( number );
		return factors[ KhanUtil.randRange( 1, factors.length - 2 ) ];
	},
    
	getMultiples: function( number, upperLimit ) {
		var multiples = [];
		for ( var i = 1; i * number <= upperLimit; i++ ) {
			multiples.push( i * number );
		}
		return multiples;
	},
	
	// Get a random integer between min and max, inclusive
	// If a count is passed, it gives an array of random numbers in the range
	randRange: function( min, max, count ) {
		if ( count == null ) {
			return Math.floor( KhanUtil.rand( max - min + 1 ) ) + min;
		} else {
			return jQuery.map(new Array(count), function() {
				return KhanUtil.randRange( min, max );
			});
		}
	},

	// Get a random integer between min and max with a perc chance of hitting
	// target (which is assumed to be in the range, but it doesn't have to be).
	randRangeWeighted: function( min, max, target, perc ) {
		if ( KhanUtil.random() < perc ) return target;
		else return KhanUtil.randRangeExclude( min, max, [target] );
	},

	// Get a random integer between min and max that is never any of the values
	// in the excludes array.
	randRangeExclude: function( min, max, excludes ) {
		var result;
		while ( result === undefined || excludes.indexOf(result) !== -1 )
			result = KhanUtil.randRange( min, max );
		return result;
	},

	// From limits_1
	randRangeNonZero: function( min, max ) {
		return KhanUtil.randRangeExclude( min, max, [0] );
	},

	// Returns a random member of the given array
	randFromArray: function( arr ) {
		return arr[ KhanUtil.rand( arr.length ) ];
	},

	// Round a number to a certain number of decimal places
	roundTo: function( precision, num ) {
		var factor = Math.pow( 10, precision ).toFixed(5);
		return Math.round( ( num * factor ).toFixed(5) ) / factor;
	},

	/* Shuffle an array using a Fischer-Yates shuffle. */
	shuffle: function( array ) {
		array = array.slice(0);

		for ( var top = array.length; top > 0; top-- ) {
			var newEnd = Math.floor(KhanUtil.random() * top),
				tmp = array[newEnd];

			array[newEnd] = array[top - 1];
			array[top - 1] = tmp;
		}

		return array;
	},
	
	sortNumbers: function( array ) {
		return array.slice( 0 ).sort( function( a, b ) {
			return a - b;
		});
	},

	// From limits_1
	truncate_to_max: function( num, digits ) {
		return parseFloat( num.toFixed( digits ) );
	}
});

var VARS = {};

// Load the value associated with the variable
jQuery.fn.extend({
	math: function() {
		var lastCond;

		return this
			// Remove the var block so that it isn't displayed
			.find(".vars").remove().end()

			// Work against the elements inside
			.find( jQuery.tmplExpr ).each(function() {
				jQuery.tmplFilter.call( this );
			}).end()

			// Replace all the variables with the computed value
			.find("var").replaceVAR().end()

			// Render
			.find("code").each(function() {
				if ( this.className ) {
					jQuery( this ).wrap( "<span class='" + this.className + "'></span>" );
				}

				// Trick MathJax into thinking that we're dealing with a script block
				this.type = "math/tex";

				// Make sure that the old value isn't being displayed anymore
				this.style.display = "none";

				// Clean up any strange mathematical expressions
				jQuery( this ).text( KhanUtil.cleanMath( jQuery( this ).text() ) );

				// Stick the processing request onto the queue
				MathJax.Hub.Queue([ "Typeset", MathJax.Hub, this ]);
			}).end();
	},

	// Load all the variables from the exercise
	mathLoad: function() {
		var vars;

		// If we're operating on a hints block
		if ( this.is(".hints") ) {
			this.children().filter( jQuery.tmplFilter );
			return;

		// If we're in an exercise, then reset VARS
		} else if ( this.is(".exercise") ) {
			VARS = {};
			return;

		// Otherwise we're in a problem
		} else {
			vars = this.find(".vars");
		}

		var ensureFailed;
		do {
			// Go through the specified variables
			vars.children().each(function() {
				// And load in their values
				var value = jQuery.getVAR( this ),
					name = this.id;

				if ( name ) {
					// Show an error if a variable definition is overriding a built-in method
					if ( KhanUtil[ name ] || ( typeof present !== "undefined" && ( typeof present[ name ] === "function" ) ) ) {
						Khan.error( "Defining variable '" + name + "' overwrites utility property of same name." );
					}

					VARS[ name ] = value;
				}
			});

			// check the ensure
			var ensure = vars.data("ensure");
			ensureFailed = ensure && !jQuery.getVAR( ensure );
		} while (ensureFailed);

		return this;
	},

	// Replace an inline variable with its computed value
	replaceVAR: function() {
		return this.replaceWith(function( i, text ) {
			var replaced = jQuery.getVAR( text );

			if( typeof replaced !== "null" && typeof replaced !== "undefined" ) {
				replaced = replaced.toString();
			}

			return replaced;
		});
	}
});

jQuery.extend({
	// Work around a strange bug in jQuery/Sizzle
	// http://bugs.jquery.com/ticket/5637
	tmplExpr: "[data-if],[data-else=]",

	tmplFilter: function() {
		if ( !jQuery( this ).is( jQuery.tmplExpr ) ) {
			return true;
		}

		var condStr = jQuery(this).data("if");
		var cond = true;

		if ( condStr != null ) {
			cond = cond && jQuery.getVAR( condStr );

			var nextCond = jQuery(this).next( jQuery.tmplExpr );

			if ( nextCond.data("else") != null ) {
				nextCond.data("else-hide", cond || jQuery(this).data("else-hide"));
			}
		}

		if ( jQuery(this).data("else") != null ) {
			cond = cond && !jQuery(this).data("else-hide");
		}

		if ( !cond ) {
			jQuery(this).remove();
			return false;
		}

		// Remove the templating so that it isn't run again later
		jQuery(this)
			.removeAttr("data-if")
			.removeAttr("data-else");

		return true;
	},

	getVAR: function( elem ) {
		// If it's a list, grab a random one out of it
		if ( elem.nodeName && elem.nodeName.toLowerCase() === "ul" ) {
			return jQuery( elem ).children().getRandom()

				// Replace all the variables with the computed value
				.find("var").replaceVAR().end()

				.html();

		// Otherwise we need to compute the value
		} else {
			var code = jQuery.trim( elem.nodeName ? jQuery(elem).text() : elem );

			// Make sure any HTML formatting is stripped
			code = jQuery.cleanHTML( code );

			// See if we're dealing with a multiline block of code
			if ( /;/.test( code ) && !/\bfunction\b/.test( code ) ) {
				code = "(function(){\n" + code + "\n})()";
			}

			try {
				// Use the methods from JavaScript's builtin Math methods
				with ( Math ) {
					// And the methods provided by the library
					with ( KhanUtil ) {
						// Use all the computed variables
						with ( VARS ) {
							return eval( "(" + code	 + ")" );
						}
					}
				}
			} catch( e ) {
				Khan.error( code, e );
			}
		}
	},

	// Make sure any HTML formatting is stripped
	cleanHTML: function( text ) {
		return text.replace(/&gt;/g, ">").replace(/&lt;/g, "<").replace(/&amp;/g, "&");
	}
});
