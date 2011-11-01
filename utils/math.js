jQuery.extend(KhanUtil, {
	// Simplify formulas before display
	cleanMath: function( expr ) {
		return typeof expr === "string" ?
			KhanUtil.tmpl.cleanHTML( expr )
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

	/* Returns an array of the digits of a nonnegative integer in reverse
	 * order: digits(376) = [6, 7, 3] */
	digits: function( n ) {
		if (n === 0) {
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
	integerToDigits: function( n ) {
		return KhanUtil.digits( n ).reverse();
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

	padDigitsToNum: function( digits, num ) {
		digits = digits.slice( 0 );
		while ( digits.length < num ) {
			digits.push( 0 );
		}
		return digits;
	},

	placesLeftOfDecimal: ["one", "ten", "hundred", "thousand"],
	placesRightOfDecimal: ["one", "tenth", "hundredth", "thousandth"],

	powerToPlace: function( power ) {
		if ( power < 0 ) {
			return KhanUtil.placesRightOfDecimal[ -1 * power ];
		} else {
			return KhanUtil.placesLeftOfDecimal[ power ];
		}
	},
	

	//Adds 0.001 because of floating points uncertainty so it errs on the side of going further away from 0
	roundTowardsZero: function( x ){
		if ( x < 0 ){
			return Math.ceil( x - 0.001 );
		}
		return Math.floor( x + 0.001 );
		

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
		if ( arguments.length > 2 ) {
			var rest = [].slice.call( arguments, 1 );
			return KhanUtil.getLCM( a, KhanUtil.getLCM.apply( KhanUtil, rest ) );
		} else {
			return Math.abs( a * b ) / KhanUtil.getGCD( a, b );
		}
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

	getComposite: function() {
		if (KhanUtil.randRange( 0, 1 )) {
			return KhanUtil.getEvenComposite();
		} else {
			return KhanUtil.getOddComposite();
		}
	},

	getPrimeFactorization: function( number ) {
		if ( number === 1 ) {
			return [];
		} else if ( KhanUtil.isPrime( number ) ) {
			return [ number ];
		}

		var maxf = Math.sqrt( number );
		for (var f = 2; f <= maxf; f++) {
			if ( number % f === 0 ) {
				return jQuery.merge(KhanUtil.getPrimeFactorization( f ), KhanUtil.getPrimeFactorization( number / f ));
			}
		}
	},

	getFactors: function( number ) {
		var factors = [],
			ins = function( n ) {
				if ( factors.indexOf( n ) === -1 ) {
					factors.push( n );
				}
			};

		var maxf2 = number;
		for (var f = 1; f * f <= maxf2; f++) {
			if ( number % f === 0 ) {
				ins( f );
				ins( number / f );
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

	// splitRadical( 24 ) gives [ 2, 6 ] to mean 2 sqrt(6)
	splitRadical: function( n ) {
		if ( n === 0 ) {
			return [ 0, 1 ];
		}

		var coefficient = 1;
		var radical = n;

		for(var i = 2; i * i <= n; i++) {
			while(radical % (i * i) === 0) {
				radical /= i * i;
				coefficient *= i;
			}
		}

		return [coefficient, radical];
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

	// Get an array of unique random numbers between min and max
	randRangeUnique: function( min, max, count ) {
		if ( count == null ) {
			return KhanUtil.randRange( min, max );
		} else {
			var toReturn = [];
			for ( var i = min; i < max; i++ ){
				toReturn.push( i );
			}
			
			return KhanUtil.shuffle( toReturn, count );
		}
	},

	// Get an array of unique random numbers between min and max,
	// that ensures that none of the integers in the array are 0.  
	randRangeUniqueNonZero: function( min, max, count ) {
		if ( count == null ) {
			return KhanUtil.randRangeNonZero( min, max );
		} else {
			var toReturn = [];
			for ( var i = min; i < max; i++ ){
				if ( i === 0 ) {
					continue;
				}
				toReturn.push( i );
			}
			
			return KhanUtil.shuffle( toReturn, count );
		}
	},

	// Get a random integer between min and max with a perc chance of hitting
	// target (which is assumed to be in the range, but it doesn't have to be).
	randRangeWeighted: function( min, max, target, perc ) {
		if ( KhanUtil.random() < perc ) {
			return target;
		} else {
			return KhanUtil.randRangeExclude( min, max, [target] );
		}
	},

	// Get a random integer between min and max that is never any of the values
	// in the excludes array.
	randRangeExclude: function( min, max, excludes ) {
		var result;

		do {
			result = KhanUtil.randRange( min, max );
		} while ( excludes.indexOf(result) !== -1 );

		return result;
	},

	// Get a random integer between min and max with a perc chance of hitting
	// target (which is assumed to be in the range, but it doesn't have to be).
	// It never returns any of the values in the excludes array.
	randRangeWeightedExclude: function( min, max, target, perc, excludes ) {
		var result;
								
		do {
			result = KhanUtil.randRangeWeighted( min, max, target, perc );
		} while ( excludes.indexOf(result) !== -1 );

		return result;
	},

	// From limits_1
	randRangeNonZero: function( min, max ) {
		return KhanUtil.randRangeExclude( min, max, [0] );
	},

	// Returns a random member of the given array
	// If a count is passed, it gives an array of random members of the given array
	randFromArray: function( arr, count ) {
		if ( count == null ) {
			return arr[ KhanUtil.rand( arr.length ) ];
		} else {
			return jQuery.map( new Array(count), function() {
				return KhanUtil.randFromArray( arr );
			});
		}
	},

	// Returns a random member of the given array that is never any of the values
	// in the excludes array.
	randFromArrayExclude: function( arr, excludes ) {
		var cleanArr = [];
		for ( var i = 0; i < arr.length; i++ ) {
			if ( excludes.indexOf( arr[i] ) === -1 ) {
				cleanArr.push( arr[i] );
			}
		}
		return KhanUtil.randFromArray( cleanArr );
	},

	// Round a number to a certain number of decimal places
	roundTo: function( precision, num ) {
		var factor = Math.pow( 10, precision ).toFixed(5);
		return Math.round( ( num * factor ).toFixed(5) ) / factor;
	},

	floorTo: function( precision, num ) {
		var factor = Math.pow( 10, precision ).toFixed(5);
		return Math.floor( ( num * factor ).toFixed(5) ) / factor;
	},

	ceilTo: function( precision, num ) {
		var factor = Math.pow( 10, precision ).toFixed(5);
		return Math.ceil( ( num * factor ).toFixed(5) ) / factor;
	},

	// toFraction( 4/8 ) => [1, 2]
	// toFraction( 0.666 ) => [333, 500]
	// toFraction( 0.666, 0.001 ) => [2, 3]
	//
	// tolerance can't be bigger than 1, sorry
	toFraction: function( decimal, tolerance ) {
		if ( tolerance == null ) {
			tolerance = Math.pow( 2, -46 );
		}

		if ( decimal < 0 || decimal > 1 ) {
			var fract = decimal % 1;
			fract += ( fract < 0 ? 1 : 0 );

			var nd = KhanUtil.toFraction( fract, tolerance );
			nd[0] += Math.round( decimal - fract ) * nd[1];
			return nd;
		} else if ( Math.abs( Math.round( decimal ) - decimal ) <= tolerance ) {
			return [ Math.round( decimal ), 1 ];
		} else {
			var loN = 0, loD = 1, hiN = 1, hiD = 1, midN = 1, midD = 2;

			while ( 1 ) {
				if ( Math.abs( Number(midN / midD) - decimal ) <= tolerance ) {
					return [ midN, midD ];
				} else if ( midN / midD < decimal) {
					loN = midN;
					loD = midD;
				} else {
					hiN = midN;
					hiD = midD;
				}

				midN = loN + hiN;
				midD = loD + hiD;
			}
		}
	},

	// Shuffle an array using a Fischer-Yates shuffle
	// If count is passed, returns an random sublist of that size
	shuffle: function( array, count ) {
		array = [].slice.call( array, 0 );
		var beginning = typeof count === "undefined" || count > array.length ? 0 : array.length - count;

		for ( var top = array.length; top > beginning; top-- ) {
			var newEnd = Math.floor(KhanUtil.random() * top),
				tmp = array[newEnd];

			array[newEnd] = array[top - 1];
			array[top - 1] = tmp;
		}

		return array.slice(beginning);
	},

	sortNumbers: function( array ) {
		return array.slice( 0 ).sort( function( a, b ) {
			return a - b;
		});
	},

	// From limits_1
	truncate_to_max: function( num, digits ) {
		return parseFloat( num.toFixed( digits ) );
	},

	//Gives -1 or 1 so you can multiply to restore the sign of a number
	restoreSign: function( num ) {
		num = parseFloat( num );
		if ( num < 0 ){
			return -1;
		}
		return 1;
	},

	// Checks if a number or string representation thereof is an integer
	isInt: function( num ) {
		return parseFloat( num ) === parseInt( num, 10 ) && !isNaN( num );
	},
	BLUE: "#6495ED",
	ORANGE: "#FFA500",
	PINK: "#FF00AF",
	GREEN: "#28AE7B"
});
