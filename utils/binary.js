// Binary
// Author: Eliot Van Uytfanghe
// Date: 13 March 2011
//
// Contributor(s):
// [<Name> <Date>]

jQuery.extend(KhanUtil, {
    formatBinary: function( bits ) {
        newBin = '';
        for( i = bits.length - 1; i >= 0; -- i ) {
            newBin = bits[i] /*+ (i % 4 == 0 ? ' ' : '')*/ + newBin;
        }
        return newBin;
    },
    
    generateBinary: function( power ) {
        bits = new Array();
        for( i = 0; i < power; ++ i ) {
            bits[i] = Math.round( Math.random() ) == 0 ? '0' : '1';
        }
        return bits;
    },
    
    generateDecimal: function( power ) {
        num = Math.random() * Math.pow( 2, power );
        return Number( num );
    },
    
    binaryToDecimal: function( bits, power ) {
        value = 0;
        for( i = power - 1; i >= 0; -- i ) {
            if( bits[i] == '1' ) {
                value += Math.pow( 2, power - i - 1 );
            }
        }
        return value;
    },
    
    decimalToBinary: function( decimal, power ) {
        binary = '';
        c = 1;
        
        do {
            binary = (((decimal & c) == c) ? '1' : '0') + binary;
            c *= 2;
        } while( c <= decimal && c != Math.pow( 2, power ) /* all bits */);
        return binary;
    },
});