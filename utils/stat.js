jQuery.extend(KhanUtil, {
	sum: function( values ) {
		var sum = 0;

		$.each(values, function( index, value ) {
			sum += value;
		});
		return sum;
	},

	sortValues: function( values ) {
		var sortedInts = values.slice(0);
		sortedInts.sort( function(a, b) { return a - b } );

		return sortedInts;
	},

	mean: function( values ) {
		return KhanUtil.roundTo( 1, this.sum( values ) / values.length );
	},

	median: function( values ) {
		var sortedInts, median;
		sortedInts = this.sortValues(values);

		if ( values.length % 2 == 0 ) {
			median = KhanUtil.roundTo( 1,
				( sortedInts[(values.length / 2) - 1] + sortedInts[values.length / 2] ) / 2 );
		} else {
			median = sortedInts[ Math.floor( values.length / 2 ) ];
		}
		return median;
	},

	mode: function( values ) {
		var numInstances = [];
		var modeInstances = -1;

		var mode;
		for ( var i = 0; i < values.length; i++ ) {
			if ( !numInstances[ values[i] ] ) {
				numInstances[ values[i] ] = 1;
			} else {
				numInstances[ values[i] ] += 1;
				if ( numInstances[ values[i] ] > modeInstances ) {
					modeInstances = numInstances[ values[i] ];
					mode = values[i];
				}
			}
		}

		// iterate again to check for 'no mode'
		for ( var i = 0; i < numInstances.length; i++ ) {
			if ( numInstances[i] ) {
				if ( i != mode && numInstances[i] >= modeInstances ) {
					return false;
				}
			}
		}

		return mode;
	},

	// concatenate array into a printable string
	display: function( values ) {
		var text = "";
		$.each(values, function( index, value ) {
			text += ", ";
			text += value;
		});
		return text.slice(2);
	}
});
