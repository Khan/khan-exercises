$.extend(KhanUtil, {
	// A simple random number picker
	rand: function( num ) {
		return Math.round( num * Math.random() );
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
	},
	
	// From limits_1
	nonZeroRandomInt: function( min, max ) {
		var result;
		while ( (result = this.randRange( min, max )) === 0 ) {}
		return result;
	},
	
	// From limits_1
	truncate_to_max: function( num, digits ) {
		return parseFloat( num.toFixed( digits ) );
	}
});