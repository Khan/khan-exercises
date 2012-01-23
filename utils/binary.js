// Binary
// Author: Eliot Van Uytfanghe
// Date: 13 March 2011
//
// Contributor(s):
// [<Name> <Date>]

jQuery.extend(KhanUtil, {
	formatBinary: function( bits, precision ) {
		if ( typeof precision === "undefined" ) {
			precision = 8;
		}
		switch ( typeof bits ) {
			case "number":
				bits = KhanUtil.decimalToBinary( bits, precision ); // fall through to string case
			case "string":
				// Pad with zeroes on left
				while ( bits.length < precision ) {
					bits = '0' + bits;
				}
				return bits;
			case "object": // assume it's an array; call self to pad with zeroes.
				return KhanUtil.formatBinary( bits.join(''), precision );
		}
	},

	// Generates a random (power)-bit number.
	generateBinary: function( power ) {
		return KhanUtil.randRange( 0, Math.pow( 2, power ) - 1 );
	},

	// Converts a number to its binary representation (with no padding zeroes).
	decimalToBinary: function( decimal ) {
		var binary = '', c = 0;

		do {
			binary = ( ( decimal & 1 ) ? '1' : '0' ) + binary;
			decimal >>= 1;
			c++;
		} while ( decimal > 0 );

		return binary;
	}
});
