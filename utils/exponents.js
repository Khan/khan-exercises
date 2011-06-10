jQuery.extend( KhanUtil, {

	/* Given a base, returns the highest positive integer it is reasonable to
	 * raise that base to. */
	maxReasonableExp: function( n ) {
		// The values are shown in comments to show that they're reasonable.
		return {
			0: 1000,
			1: 1000,
			2: 8,    // 2*2*2*2*2*2*2*2 = 256
			3: 5,    // 3*3*3*3*3 = 243
			4: 4,    // 4*4*4*4 = 256
			5: 4,    // 5*5*5*5 = 625
			6: 3,    // 6*6*6 = 216
			7: 3,    // 7*7*7 = 343
			8: 3,    // 8*8*8 = 512
			9: 3,    // 9*9*9 = 729
			10: 10,  // 10^10 = 100000000000
		}[ Math.abs( n ) ];
	},

	/* For Exponents 1, find an integer base and an positive integer exponent such
	 * that the calculation is reasonable. With a probability of `exp_zero_prob`,
	 * will choose an arbitrarily large/small base and an exponent of 0, and with
	 * a probability of `exp_unit_prob`, will do likewise with an exponent of
	 * 1. Otherwise, will choose a base in [-10,10] with `base_negunit_prob`,
	 * `base_unit_prob`, and `base_zero_prob` probabilities for choosing those
	 * exceptional base values (more specifically, they are the probabilities
	 * conditional on the exponent not being 0 or 1), and then will choose an
	 * exponent such that the calculation is reasonable. */
	pickIntBasePosExp: function( exp_zero_prob, exp_unit_prob, 
			base_negunit_prob, base_unit_prob, base_zero_prob ) {
		var base, exp;
		
		var r = KhanUtil.random();
		if ( r < exp_zero_prob + exp_unit_prob ) {
			base = KhanUtil.randRangeNonZero( -500, 500 );
			if ( r < exp_zero_prob) {
				exp = 0;
			} else {
				exp = 1;
			}
		} else {
			r = KhanUtil.random();
			if ( r < base_negunit_prob ) {
				base = -1;
			} else if ( r < base_negunit_prob + base_unit_prob ) {
				base = 1;
			} else if ( r < base_negunit_prob + base_unit_prob + base_zero_prob ) {
				base = 0;
			} else {
				base = KhanUtil.randRangeExclude( -10, 10, [ 0, 1, -1 ] );
			}

			exp = KhanUtil.randRange( 2, KhanUtil.maxReasonableExp( base ) );
		}

		return {
			base: base,
			exp: exp
		};
	},

	/* For Exponents 2, find a rational base and an integer exponent such that the
	 * calculation is reasonable. */
	pickRatBaseIntExp: function( base_neg_prob, exp_neg_prob, base_rat_prob ) {
		var base_neg = Math.random() < base_neg_prob;
		var base_n = KhanUtil.randRange( 1, 10 );
		var base_d;
		while ( base_d === undefined || base_n === base_d ) {
			base_d = KhanUtil.randRangeWeighted( 1, 10, 1, 1 - base_rat_prob );
		}

		var exp_neg = Math.random() < exp_neg_prob;
		var max_exp = Math.min( KhanUtil.maxReasonableExp( base_n ),
			KhanUtil.maxReasonableExp( base_d ) );
		var min_exp = exp_neg ? 1 : 2;
		var exp = KhanUtil.randRange( min_exp, max_exp );

		var sol_n = Math.round( Math.pow( exp_neg ? base_d : base_n, exp ) );
		var sol_d = Math.round( Math.pow( exp_neg ? base_n : base_d, exp ) );

		return {
			base_n: base_n,
			base_d: base_d,
			exp: exp * ( exp_neg ? -1 : 1 ),
			sol_n: sol_n,
			sol_d: sol_d
		};
	},

	/* For Exponents 3, find a rational base and root such that both the numerator
	 * and denominator of the base can be taken to that root. */
	pickRatBaseRoot: function( exp_neg_prob ) {

		// we want to choose a random rootable base then find the root associated
  	// to that base and then find another base which can be taken to that
  	// root. we could just choose a root, then take two bases, but we want the
  	// roots to be weighted by the number of bases that can be taken to the root.

		var bases_by_root = {
			//   1   2   3    4    5   6   7   8   9   10
			2: [ 1,  4,  9,  16,  25, 36, 49, 64, 81, 100 ],
			3: [ 1,  8, 27,  64, 125 ],
			4: [ 1, 16, 81, 256 ]
		};

		// these are all the bases that can be rooted.
		var bases = bases_by_root[ 2 ]
			.concat( bases_by_root[ 3 ] )
			.concat( bases_by_root[ 4 ] );

		var roots_by_base = {};
		for ( var i = 0; i < bases.length; i++ ) {
			var base = bases[ i ];
			for ( var j = 2; j <= 4; j++ ) {
				if ( bases_by_root[ j ].indexOf( base ) !== -1 ) {
					if ( roots_by_base[ base ] === undefined ) {
						roots_by_base[ base ] = [ j ];
					} else if ( roots_by_base[ base ].indexOf( j ) === -1 ) {
						roots_by_base[ base ].push( j );
					}
				}
			}
		}

		var base_n = KhanUtil.randFromArray( bases );

		var exp_d;
		while ( exp_d === undefined || exp_d === 1) {
			exp_d = KhanUtil.randFromArray( roots_by_base[ base_n ] );
		}
		var exp_neg = Math.random() < exp_neg_prob;

		// keep choosing the second base until it's unique from the first.
		var base_d;
		while ( base_d === undefined || base_d === base_n ) {
			base_d = KhanUtil.randFromArray( bases_by_root[ exp_d ] );
		}

		var sol_n = Math.round( Math.pow( exp_neg ? base_d : base_n, 1 / exp_d ) );
		var sol_d = Math.round( Math.pow( exp_neg ? base_n : base_d, 1 / exp_d ) );

		return {
			base_n: base_n,
			base_d: base_d,
			exp_d: exp_d * ( exp_neg ? -1 : 1 ),
			sol_n: sol_n,
			sol_d: sol_d
		};
	},

	/* For Exponents 4, pick a rational base and a rational exponent such that the
	 * base is easy to take the root corresponding to the exponent's denominator
	 * and such that it is then reasonable to raise to the exponent's numerator. */
	pickRatBaseRatExp: function( base_neg_prob, exp_neg_prob, 
			exp_num_unit_prob ) {
		var root_bases = KhanUtil.pickRatBaseRoot( exp_neg_prob );

		var exp_neg = root_bases.exp_d < 0;
		var exp_d = Math.abs( root_bases.exp_d );

		var base_neg = KhanUtil.isOdd( exp_d ) && ( KhanUtil.random() < base_neg_prob );
		var base_n = root_bases.base_n;
		var base_d = root_bases.base_d;

		var root_n = Math.round( Math.pow( exp_neg ? base_d : base_n, 1 / exp_d ) );
		var root_d = Math.round( Math.pow( exp_neg ? base_n : base_d, 1 / exp_d ) );

		var max_exp = Math.min( KhanUtil.maxReasonableExp( root_n ),
			KhanUtil.maxReasonableExp( root_d ) );

		var exp_n;
		while ( exp_n === undefined || exp_n % exp_d === 0 ) {
			exp_n = KhanUtil.randRange(2, max_exp);
		}

		// we need to check and update the root if the exponent reduces, since we'll
		// be displaying just the reduced exponent.
		var gcd = KhanUtil.getGCD( exp_n, exp_d );
		exp_n = exp_n / gcd;
		exp_d = exp_d / gcd;
		root_n = Math.round( Math.pow( exp_neg ? base_d : base_n, 1 / exp_d ) );
		root_d = Math.round( Math.pow( exp_neg ? base_n : base_d, 1 / exp_d ) );
		// the base will only be negative when the root would also be negative.
		var root_neg = base_neg;

		var sol_neg = base_neg && KhanUtil.isOdd( exp_n );
		var sol_n = Math.round( Math.pow( root_n, exp_n ) );
		var sol_d = Math.round( Math.pow( root_d, exp_n ) );

		return {
			base_n: base_n * (base_neg ? -1 : 1),
			base_d: base_d,
			exp_n: exp_n * (exp_neg ? -1 : 1),
			exp_d: exp_d,
			root_n: root_n * (root_neg ? -1 : 1),
			root_d: root_d,
			sol_n: sol_n * (sol_neg ? -1 : 1),
			sol_d: sol_d
		};
	}

});