// Binary
// Author: Eliot Van Uytfanghe
// Date: 13 March 2011
//
// Contributor(s):
// [<Name> <Date>]

jQuery.extend(KhanUtil, {
	formatBinary: function( bits ) {
		var newBin = '';
		for( var i = bits.length - 1; i >= 0; -- i ) {
			newBin = bits[i] /*+ (i % 4 == 0 ? ' ' : '')*/ + newBin;
		}
		return newBin;
	},

	generateBinary: function( power ) {
		var bits = [];
		for( var i = 0; i < power; ++ i ) {
			bits[i] = KhanUtil.randRange( 0, 1 ).toString();
		}
		return bits;
	},

	generateDecimal: function( power ) {
		return KhanUtil.randRange( 0, Math.pow( 2, power )-1 );
	},

	binaryToDecimal: function( bits, power ) {
		var value = 0;
		for( var i = power - 1; i >= 0; -- i ) {
			if( bits[i] === '1' ) {
				value += Math.pow( 2, power - i - 1 );
			}
		}
		return value;
	},

	decimalToBinary: function( decimal, power ) {
		var binary = '';
		var c = 1;

		do {
			binary = (((decimal & c) === c) ? '1' : '0') + binary;
			c *= 2;
		} while( c <= decimal && c !== Math.pow( 2, power ) /* all bits */);
		return binary;
	}
});
