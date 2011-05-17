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
    
    allprimes: [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97],

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

    roundToPosition: function( num, pos ) {
        var factor = Math.pow( 10, -1 * pos ).toFixed( 5 );
        return Math.round( (num * factor).toFixed(5) ) / factor;
    }
    
});