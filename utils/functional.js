jQuery.extend( KhanUtil, {
	tabulate: function( fn, n ) {
		// Return an array, [ fn(), fn(), ... ] of length n if fn does not take arguments
		// or the array [ fn( 0 ), fn( 1 ), ..., fn( n - 1 ) ] if it does
		return jQuery.map( new Array(n), function( val, i ) {
			return [ fn( i ) ];
		});
	}
});
