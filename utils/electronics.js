jQuery.extend(KhanUtil, {
	/* Returns a resistor value in ohms selected uniformly from the standard
	 * set of 5% tolerance resistors that can be bought off the shelf */
	randResistor: function() {
		var mantissa = [1.0, 1.1, 1.2, 1.3, 1.5, 1.6, 1.8, 2.0, 2.2, 2.4,
						2.7, 3.0, 3.3, 3.6, 3.9, 4.3, 4.7, 5.1, 5.6, 6.2,
						6.8, 7.5, 8.2, 9.1];
		mantissa = KhanUtil.randFromArray( mantissa );
		var exponent = KhanUtil.randRange( 0, 6 ); 
		return mantissa * Math.pow( 10, exponent );
	},

	/* Typesets a quantity, adjusting the base unit by factors of 1000 as
	 * necessary.  Unit must be a base unit (i.e. A instead of mA ) */
	formatQuantity: function( amount, unit, digits ) {
		if( amount >= 1e12 ) {
			amount /= 1e12;
			unit = "T" + unit;
		} else if ( amount >= 1e9 ) {
			amount /= 1e9;
			unit = "G" + unit;
		} else if ( amount >= 1e6 ) {
			amount /= 1e6;
			unit = "M" + unit;
		} else if ( amount >= 1e3 ) {
			amount /= 1e3;
			unit = "k" + unit;
		} else if ( amount >= 1 ) {
			// no adjustment necessary
		} else if ( amount >= 1e-3 ) {
			amount *= 1e3;
			unit = "m" + unit;
		} else if ( amount >= 1e-6 ) {
			amount *= 1e6;
			unit = "\\mu " + unit;
		} else if ( amount >= 1e-9 ) {
			amount *= 1e9;
			unit = "n" + unit;
		} else {
			amount *= 1e12;
			unit = "p" + unit;
		}

		return KhanUtil.roundToSignificant( digits, amount ) + "\\,\\mathrm{" + unit + "}";
	}
});
