$.extend(KhanUtil, {
	// A simple random number picker
	rand: function( num ) {
		return Math.round( num * Math.random() );
	},

	// Get a random integer between min and max, inclusive
	randRange: function( min, max ) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	},
	
	// Returns a random member of the given array
	randFromArray: function( arr ) {
		return arr[this.rand(arr.length - 1)];
	},

	// Round a number to a certain number of decimal places
	roundTo: function( precision, num ) {
		return Math.round(num*Math.pow(10,precision))/Math.pow(10,precision);
	}
});