/* 	Function List:
	coinFlips, choose, factorial, countPermutations	*/  

jQuery.extend(KhanUtil, {
	/* coinFlips( 2 ) returns
	 * [["HH", 2], ["HT", 1], ["TH", 1], ["TT", 0]] */
	coinFlips: function( n ) {
		if ( n === 0 ) {
			return [ ["", 0] ];
		} else {
			var preceding = KhanUtil.coinFlips( n - 1 );

			var andAHead = jQuery.map(preceding, function(_arg, i) {
				var seq = _arg[0];
				var h = _arg[1];
				return [["H" + seq, h + 1]];
			});

			var andATail = jQuery.map(preceding, function(_arg, i) {
				var seq = _arg[0];
				var h = _arg[1];
				return [["T" + seq, h]];
			});

			return andAHead.concat(andATail);
		}
	},

	/* returns binomial coefficient (n choose k) or
	 * sum of choose(n, i) for i in k:
	 * choose( 4, [0, 1, 2] ) = 1 + 4 + 6 = 11 */
	choose: function( n, k ) {
		if ( typeof k === "number" ) {
			if ( k * 2 > n ) {
				return KhanUtil.choose( n, n - k );
			} else if ( k > 0.5 ) {
				return KhanUtil.choose( n, k - 1 ) * (n - k + 1) / (k);
			} else if( Math.abs( k ) <= 0.5 ) {
				return 1;
			} else {
				return 0;
			}
		} else {
			var sum = 0;
			jQuery.each(k, function( ind, elem ) {
				sum += KhanUtil.choose( n, elem );
			});
			return sum;
		}
	},
	
	/* given an integer: num > 0, return num! otherwise return 1 
	 * 			example: factorial(5) = 5*4*3*2*1 */  
	factorial: function(num){
		
		if( typeof num === "number"){
			
			//return 1 for 0 or negative values
			if(num <= 1)
				return 1;
				
			//calculate num!
			else
				return(num*KhanUtil.factorial(num-1));
			
		}
	},
	
	/* given 2 positive integers: return count of permutations for k distinct elements in n total elements
	 * 					 example: countPermutations(5,3) = 5!/(5-3)! */ 
	countPermutations: function(n, k){
		if(typeof k === "number" && typeof n === "number"){
			
			//return 0 if input is negative or if you are asking to count more elements than in total elements 
			if(n < 1 || k < 0 || (k>n))
				return 0;
			
			else{
				var permutations = KhanUtil.factorial(n)/KhanUtil.factorial(n-k);
				return(permutations);
			}
		}
	}
});
