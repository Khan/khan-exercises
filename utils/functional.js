jQuery.extend( KhanUtil, {
	listFn: function( fn, n ) {
		// Return an array, [ fn(), fn(), ... ] of length n if fn does not take arguments
		// or the array [ fn( 0 ), fn( 1 ), ..., fn( n - 1 ) ] if it does
		return jQuery.map( new Array(n), function( val, i ) {

			// If the function accepts arguments, pass it the current index
			if ( fn.length ) {
				return [ fn( i ) ];

			// Otherwise call it with no arguments
			} else {
				return [ fn() ];
			}

		});
	}
});
