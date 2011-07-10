module("math" );

(function(){

test( "math miscellanea", 44, function() {
	deepEqual( KhanUtil.digits(376), [ 6, 7, 3 ], "digits(376)" );
	deepEqual( KhanUtil.integerToDigits(376), [ 3, 7, 6 ], "integerToDigits(376)" );

	equals( KhanUtil.getGCD(216, 1024), 8, "gcd(216, 1024)" );
	equals( KhanUtil.getGCD(512341, 2325183), 1, "gcd(512341, 2325183)" );
	equals( KhanUtil.getGCD(53110108, 109775188), 68, "gcd(53110108, 109775188)" );
	equals( KhanUtil.getGCD(-21, 14), 7, "gcd(-21, 14)" );
	equals( KhanUtil.getGCD(-21, -14), 7, "gcd(-21, -14)" );
	equals( KhanUtil.getGCD(123, 1), 1, "gcd(123, 1)" );
	equals( KhanUtil.getGCD(123, 1), 1, "gcd(123, 1)" );
	equals( KhanUtil.getGCD(123, 123), 123, "gcd(123, 123)" );
	equals( KhanUtil.getGCD(169, 26, -52), 13, "gcd(169, 26, -52)" );

	equals( KhanUtil.getLCM(216, 1024), 27648, "lcm(216, 1024)" );
	equals( KhanUtil.getLCM(216, -1024), 27648, "lcm(216, -1024)" );
	equals( KhanUtil.getLCM(1, 2, 3, 4, 5, 6, 7, 8, 9, 10), 2520, "lcm(1..10)" );

	equals( KhanUtil.isPrime(1), false, "primeq 1" );
	equals( KhanUtil.isPrime(2), true, "primeq 2" );
	equals( KhanUtil.isPrime(216), false, "primeq 216" );
	equals( KhanUtil.isPrime(127), true, "primeq 127" );
	equals( KhanUtil.isPrime(129), false, "primeq 129" );

	equals( KhanUtil.isOdd(0), false, "oddq 0" );
	equals( KhanUtil.isOdd(1), true, "oddq 1" );

	equals( KhanUtil.isEven(0), true, "evenq 0" );
	equals( KhanUtil.isEven(1), false, "evenq 1" );

	deepEqual( KhanUtil.getPrimeFactorization( 6 ), [ 2, 3 ], "factor 6" );
	deepEqual( KhanUtil.getPrimeFactorization( 23 ), [ 23 ], "factor 23" );
	deepEqual( KhanUtil.getPrimeFactorization( 49 ), [ 7, 7 ], "factor 49" );
	deepEqual( KhanUtil.getPrimeFactorization( 45612394 ), [ 2, 17, 67, 20023 ], "factor 45612394" );

	deepEqual( KhanUtil.getFactors( 6 ), [ 1, 2, 3, 6 ], "factors 6" );
	deepEqual( KhanUtil.getFactors( 492 ), [ 1, 2, 3, 4, 6, 12, 41, 82, 123, 164, 246, 492 ], "factors 492" );
	deepEqual( KhanUtil.getFactors( 45612394 ), [ 1, 2, 17, 34, 67, 134, 1139, 2278, 20023, 40046,
		340391, 680782, 1341541, 2683082, 22806197, 45612394 ], "factors 45612394" );

	deepEqual( KhanUtil.getMultiples( 7, 70 ), [ 7, 14, 21, 28, 35, 42, 49, 56, 63, 70 ], "multiples 7, 70" );
	deepEqual( KhanUtil.getMultiples( 7, 80 ), [ 7, 14, 21, 28, 35, 42, 49, 56, 63, 70, 77 ], "multiples 7, 80" );
	deepEqual( KhanUtil.getMultiples( 7, 83 ), [ 7, 14, 21, 28, 35, 42, 49, 56, 63, 70, 77 ], "multiples 7, 83" );

	equals( KhanUtil.roundTo( 2, Math.PI ), 3.14, "roundTo 2, pi" );
	equals( KhanUtil.roundTo( 0, Math.PI ), 3, "roundTo 0, pi" );

	deepEqual( KhanUtil.toFraction( 4/8 ), [ 1, 2 ], "4/8" );
	deepEqual( KhanUtil.toFraction( 0.666 ), [ 333, 500 ], "0.666" );
	deepEqual( KhanUtil.toFraction( 0.666, 0.001 ), [ 2, 3 ], "0.666 with tol" );
	deepEqual( KhanUtil.toFraction( 20/14 ), [ 10, 7 ], "20/14" );
	deepEqual( KhanUtil.toFraction( 500 ), [ 500, 1 ], "500" );
	deepEqual( KhanUtil.toFraction( -500 ), [ -500, 1 ], "-500" );
	deepEqual( KhanUtil.toFraction( -Math.PI, 0.000001 ), [ -355, 113 ], "-pi" );

	deepEqual( KhanUtil.sortNumbers([ 134, 17, 2, 46 ]), [ 2, 17, 46, 134 ], "sort some stuff" );
	deepEqual( KhanUtil.sortNumbers( KhanUtil.shuffle( KhanUtil.primes ) ),
		KhanUtil.primes, "shuffle then sort the primes" );

});

})();