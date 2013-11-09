module("math" );

(function(){

test( "math miscellanea", 58, function() {
	deepEqual( KhanUtil.digits(376), [ 6, 7, 3 ], "digits(376)" );
	deepEqual( KhanUtil.integerToDigits(376), [ 3, 7, 6 ], "integerToDigits(376)" );

	strictEqual( KhanUtil.getGCD(216, 1024), 8, "gcd(216, 1024)" );
	strictEqual( KhanUtil.getGCD(512341, 2325183), 1, "gcd(512341, 2325183)" );
	strictEqual( KhanUtil.getGCD(53110108, 109775188), 68, "gcd(53110108, 109775188)" );
	strictEqual( KhanUtil.getGCD(-21, 14), 7, "gcd(-21, 14)" );
	strictEqual( KhanUtil.getGCD(-21, -14), 7, "gcd(-21, -14)" );
	strictEqual( KhanUtil.getGCD(123, 1), 1, "gcd(123, 1)" );
	strictEqual( KhanUtil.getGCD(123, 1), 1, "gcd(123, 1)" );
	strictEqual( KhanUtil.getGCD(123, 123), 123, "gcd(123, 123)" );
	strictEqual( KhanUtil.getGCD(169, 26, -52), 13, "gcd(169, 26, -52)" );

	strictEqual( KhanUtil.getLCM(216, 1024), 27648, "lcm(216, 1024)" );
	strictEqual( KhanUtil.getLCM(216, -1024), 27648, "lcm(216, -1024)" );
	strictEqual( KhanUtil.getLCM(1, 2, 3, 4, 5, 6, 7, 8, 9, 10), 2520, "lcm(1..10)" );

	strictEqual( KhanUtil.isPrime(1), false, "primeq 1" );
	strictEqual( KhanUtil.isPrime(2), true, "primeq 2" );
	strictEqual( KhanUtil.isPrime(216), false, "primeq 216" );
	strictEqual( KhanUtil.isPrime(127), true, "primeq 127" );
	strictEqual( KhanUtil.isPrime(129), false, "primeq 129" );

	strictEqual( KhanUtil.isOdd(0), false, "oddq 0" );
	strictEqual( KhanUtil.isOdd(1), true, "oddq 1" );

	strictEqual( KhanUtil.isEven(0), true, "evenq 0" );
	strictEqual( KhanUtil.isEven(1), false, "evenq 1" );

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

	strictEqual( KhanUtil.roundTo( 1, 0.15 ), 0.2, "roundTo half up" );
	strictEqual( KhanUtil.roundTo( 1, 0.14 ), 0.1, "roundTo down" );

	strictEqual( KhanUtil.floorTo( 1, 0.19 ), 0.1, "floorTo" );
	strictEqual( KhanUtil.ceilTo( 1, 0.11 ), 0.2, "ceilTo" );

	strictEqual( KhanUtil.truncate_to_max( 0.16, 1 ), 0.2, "truncate_to_max round up" );
	strictEqual( KhanUtil.truncate_to_max( 0.15, 1 ), 0.1, "truncate_to_max round precision problem" );
	strictEqual( KhanUtil.truncate_to_max( 0.14, 1 ), 0.1, "truncate_to_max round down" );
	strictEqual( KhanUtil.truncate_to_max( 0.15, 3 ), 0.15, "truncate_to_max ignore" );

	strictEqual( KhanUtil.isInt( 0 ), true, "0 is int" );
	strictEqual( KhanUtil.isInt( "99" ), true, "'99' is int" );
	strictEqual( KhanUtil.isInt( 0.5 ), false, "0.5 isn't int" );
	strictEqual( KhanUtil.isInt( "9.9" ), false, "'9.9' isn't int" );
	strictEqual( KhanUtil.isInt( "9,9" ), false, "'9,9' isn't int" );
	strictEqual( KhanUtil.isInt( "a" ), false, "'a' isn't int" );

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

	deepEqual( KhanUtil.splitRadical( 24 ), [ 2, 6 ], "sqrt(24) = 2*sqrt(6)" );
	deepEqual( KhanUtil.splitCube( 24 ), [ 2, 3 ], "sqrt[3](24) = 2*sqrt[3](3)" );
});

})();
