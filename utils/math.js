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
	rand: function( num ) {
		return Math.round( num * KhanUtil.random() );
	},
	
	fraction: function( n, d ) {
		if ( d === 0 ) {
			return "\\text{undefined}";
		}
		
		if ( n === 0 ) {
			return "0";
		}
		
		var sign = n / d < 0 ? "-" : "";
		n = Math.abs(n);
		d = Math.abs(d);
		
		var gcd = this.getGCD(n, d);
		n = n / gcd;
		d = d / gcd;
		
		return d > 1 ?
				sign + "\\frac{" + n + "}{" + d + "}" :
				sign + n;
	},

	/* formattedSquareRootOf(24) gives 2\sqrt{6} */
	formattedSquareRootOf: function(n) {
		if(n == 1) {
			/* so as to not return "" later */
			return "1";
		}

		var coefficient = 1;
		var radical = n;

		for(var i = 2; i * i <= n; i++) {
			while(radical % (i * i) == 0) {
				radical /= i * i;
				coefficient *= i;
			}
		}

		var cString = coefficient == 1 ? "" : coefficient.toString();
		var rString = radical == 1 ? "" : "\\sqrt{" + radical + "}";
		return cString + rString;
	},

    getGCD: function( a, b ) {
        var mod;

        while ( b ) {
            mod = a % b;
            a = b;
            b = mod;
        }

        return a;
    },
    
    getLCM: function( a, b ) {
      return ( a * b ) / this.getGCD( a, b );
    },

	primes: [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43,
		47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97],
    
    getPrime: function() {
        return this.primes[ this.rand( this.primes.length ) ];
    },
    
    getOddComposite: function() {
        var oddComposites = [9, 15, 21, 25, 27, 33, 35, 39, 45, 49, 51, 55];
        oddComposites = oddComposites.concat([57, 63, 65, 69, 75, 77, 81, 85, 87, 91, 93, 95, 99]);
        return oddComposites[ this.rand( oddComposites.length ) ];
    },
    
    getEvenComposite: function() {
        var evenComposites = [4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26];
        evenComposites = evenComposites.concat([28, 30, 32, 34, 36, 38, 40, 42, 44, 46, 48]);
        evenComposites = evenComposites.concat([50, 52, 54, 56, 58, 60, 62, 64, 66, 68, 70, 72]);
        evenComposites = evenComposites.concat([74, 76, 78, 80, 82, 84, 86, 88, 90, 92, 94, 96, 98]);
        return evenComposites[ this.rand( evenComposites.length ) ];
    },
    
    getPrimeFactorization: function( number ) {
        if ( jQuery.inArray(number, this.primes) !== -1 ) {
            return [number];                
        }

        var maxf = Math.sqrt( number );
        for (var f = 2; f <= maxf; f++) {
            if ( number % f == 0 ) {
                return jQuery.merge(this.getPrimeFactorization( f ), this.getPrimeFactorization( number / f ));
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
        return factors.sort( function( a, b ) {
            return a - b;
        });
    },
    
    getMultiples: function( number, upperLimit ) {
        var multiples = [];
        for ( var i = 1; i * number <= upperLimit; i++ ) {
            multiples.push( i * number );
        }
        return multiples;
    },


	// Get a random integer between min and max, inclusive
	randRange: function( min, max ) {
		return Math.floor( KhanUtil.random() * ( max - min + 1 ) ) + min;
	},
	
	// Returns a random member of the given array
	randFromArray: function( arr ) {
		return arr[ this.rand( arr.length - 1 ) ];
	},

	// Round a number to a certain number of decimal places
	roundTo: function( precision, num ) {
		var factor = Math.pow( 10, precision ).toFixed(5);
		return Math.round( ( num * factor ).toFixed(5) ) / factor;
	},
	
	// From limits_1
	randRangeNonZero: function( min, max ) {
		var result;
		while ( (result = this.randRange( min, max )) === 0 ) {}
		return result;
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
				this.innerHTML = KhanUtil.cleanMath( this.innerHTML );

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
		
		// If we're in an exercise then we only want the main var block
		} else if ( this.is(".exercise") ) {
			vars = this.children(".vars");
			VARS = {};
		
		// Otherwise we're in a problem
		} else {
			vars = this.find(".vars");
		}
		
		// Go through the specified variables
		vars.children().each(function() {
			// And load in their values
			var value = jQuery.getVAR( this ),
				name = this.id;

			if ( name ) {
				// Show an error if a variable definition is overriding a built-in method
				if ( KhanUtil[ name ] || ( typeof present !== "undefined" && ( typeof present[ name ] === "function" ) ) ) {
					if ( typeof console !== "undefined" ) {
						console.error( "Defining variable '" + name + "' overwrites utility property of same name." );
					}
				}
				
				VARS[ name ] = value;
			}
		});
		
		return this;
	},

	// Replace an inline variable with its computed value
	replaceVAR: function() {
		return this.replaceWith(function( i, text ) {
			return document.createTextNode( jQuery.getVAR( text ) );
		});
	}
});

jQuery.extend({
	tmplExpr: "[data-if],[data-else]",
	
	tmplFilter: function() {
		cond = jQuery(this).data("if");
		
		if ( cond != null ) {
			lastCond = cond = jQuery.getVAR( cond );
			
			if ( !cond ) {
				jQuery(this).remove();
				return false;
			}
			
		} else if ( lastCond && jQuery(this).data("else") != null ) {
			jQuery( this ).remove();
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
				
				.text();

		// Otherwise we need to compute the value
		} else {
			var code = jQuery.trim( elem.nodeName ? jQuery(elem).text() : elem );
			
			// Make sure any HTML formatting is stripped
			code = jQuery.cleanHTML( code );
		
			// See if we're dealing with a multiline block of code
			if ( (/;/.test( code ) || /\n/.test( code )) && !/function/.test( code ) ) {
				code = "(function(){\n" + code + "\n})()";
			}

			try {
				// Use the methods provided by the library
				with ( KhanUtil ) {
					// And the methods from JavaScript's builtin Math methods
					with ( Math ) {
						// Use all the computed variables
						with ( VARS ) {
							return eval( "(" + code  + ")" );
						}
					}
				}
			} catch( e ) {
				if ( typeof console !== "undefined" ) {
					console.error( code, e );
				}
			}
		}
	},
	
	// Make sure any HTML formatting is stripped
	cleanHTML: function( text ) {
		return text.replace(/&gt;/g, ">").replace(/&lt;/g, "<").replace(/&amp;/g, "&");
	}
});

// Load MathJax
scriptWait(function( scriptLoaded ) {
	var script = document.createElement("script");
	script.src = "http://cdn.mathjax.org/mathjax/latest/MathJax.js";
	script.onload = function() {
		// We don't want to use inline script elements, we want to use code blocks
		MathJax.Hub.elementScripts = function( elem ) {
			return elem.nodeName.toLowerCase() === "code" ?
				[ elem ] :
				elem.getElementsByTagName( "code" );
		};
		
		// Data is read in here:
		// https://github.com/mathjax/MathJax/blob/master/unpacked/jax/input/TeX/jax.js#L1704
		// We can force it to convert HTML entities properly by saying we're Konqueror
		MathJax.Hub.Browser.isKonqueror = true;
		
		scriptLoaded();
	};

	// There is no god.
	// I will personally gut punch whoever thought this was a good API design
	script.text = 'MathJax.Hub.Config({\
		messageStyle: "none",\
		skipStartupTypeset: true,\
		jax: ["input/TeX","output/HTML-CSS"],\
		extensions: ["tex2jax.js","MathMenu.js","MathZoom.js"],\
		TeX: {\
			extensions: ["AMSmath.js","AMSsymbols.js","noErrors.js","noUndefined.js"]\
		}\
	});';

	document.documentElement.appendChild( script );
});