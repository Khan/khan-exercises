jQuery.extend(KhanUtil, {
	sum: function( values ) {
		var sum = 0;

		$.each(values, function( index, value ) {
			sum += value;
		});
		return sum;
	},

	mean: function( values ) {
		return KhanUtil.sum( values ) / values.length;
	},

	median: function( values ) {
		var sortedInts, median;
		sortedInts = KhanUtil.sortNumbers( values );

		if ( values.length % 2 === 0 ) {
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
				if ( i !== mode && numInstances[i] >= modeInstances ) {
					return false;
				}
			}
		}

		return mode;
	},

	variance: function( values ) {
		var xbar = KhanUtil.mean( values );
		var n = values.length;

		var sum = 0;
		jQuery.each( values, function( i, x_i ) {
			sum += ( x_i - xbar ) * ( x_i - xbar );
		});
		return sum / ( n - 1 );
	},

	variancePop: function( values ) {
		var xbar = KhanUtil.mean( values );
		var N = values.length;

		var sum = 0;
		jQuery.each( values, function( i, x_i ) {
			sum += ( x_i - xbar ) * ( x_i - xbar );
		});
		return sum / N;
	},

	stdDev: function( values ) {
		return Math.sqrt( KhanUtil.variance( values ) );
	},

	stdDevPop: function( values ) {
		return Math.sqrt( KhanUtil.variancePop( values ) );
	},

	// Gaussian distribution using Box-Muller transform
	// defaults to standard normal unless target mean and stddev are passed
	// Pass "count" to get an array of data
	randGaussian: function( tgtMean, tgtStdDev, count ) {
		if ( count == null ) {
			var x1, x2, rad, y1;

			do {
				x1 = 2 * KhanUtil.random() - 1;
				x2 = 2 * KhanUtil.random() - 1;
				rad = x1 * x1 + x2 * x2;
			} while ( rad >= 1 || rad == 0 );

			var c = Math.sqrt( -2 * Math.log( rad ) / rad );

			return x1 * c * ( tgtStdDev || 1 ) + ( tgtMean || 0 );
		} else {
			return jQuery.map( new Array( count ), function() {
				return KhanUtil.randGaussian( tgtMean, tgtStdDev );
			});
		}
	},

	gaussianPDF: function( mean, stddev, x ) {
		return ( 1 / Math.sqrt( 2 * Math.PI * stddev * stddev ) ) * Math.exp( -( ( x - mean ) * ( x - mean ) ) / ( 2 * stddev * stddev ) );
	}

});
