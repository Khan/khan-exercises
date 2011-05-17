$.extend(KhanUtil, {
	// A simple random number picker
	rand: function( num ) {
		return Math.round( num * Math.random() );
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
    
    getPrime: function() {
        var primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43];
        primes = primes.concat([47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97]);
        return primes[ this.rand( primes.length ) ];
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
        if ( $.inArray(number, allprimes) != -1) {
            return [number];                
        }

        var maxf = Math.sqrt( number );
        for (var f = 2; f <= maxf; f++) {
            if ( number % f == 0 ) {
                return $.merge(getPrimeFactorization( f ), getPrimeFactorization( number / f ));
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

	// Get a random integer between min and max, inclusive
	randRange: function( min, max ) {
		return Math.floor( Math.random() * ( max - min + 1 ) ) + min;
	},
	
	// Returns a random member of the given array
	randFromArray: function( arr ) {
		return arr[ this.rand( arr.length - 1 ) ];
	},

	// Round a number to a certain number of decimal places
	roundTo: function( precision, num ) {
		var factor = Math.pow( 10, -1 * precision ).toFixed(5);
		return Math.round( ( num * factor ).toFixed(5) ) / factor;
	}
});