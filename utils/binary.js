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
		if ( typeof bits === "number" ) {
			return KhanUtil.formatBinary( KhanUtil.decimalToBinary( bits, precision ) );
		} else {
			if ( !bits ) {
				bits = 8;
			}
			var newBin = '';
			for( var i = bits.length - 1; i >= 0; -- i ) {
				newBin = bits[i] + newBin;
			}
			return newBin;
		}
	},

	generateBinary: function( power ) {
		return KhanUtil.randRange( 0, Math.pow( 2, power ) - 1 );
	},

	binaryToDecimal: function( bits, power ) {
		if ( typeof bits === "number" ) {
			return bits.toString();
		}
		var value = 0;
		for( var i = power - 1; i >= 0; -- i ) {
			if( bits[i] === '1' ) {
				value += Math.pow( 2, power - i - 1 );
			}
		}
		return value;
	},

	decimalToBinary: function( decimal, power ) {
		var binary = '', c = 0;

		do {
			binary = ( ( decimal & 1 ) ? '1' : '0' ) + binary;
			decimal >>= 1;
			c++;
		} while ( decimal > 0 || c < power );

		return binary;
	}
});
