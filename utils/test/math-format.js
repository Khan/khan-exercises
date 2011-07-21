module("math-format");

test( "Decimal to Fraction Conversion", function() {
	//decimals with lots of digits
	deepEqual( KhanUtil.decimalToFraction(-43/7), ['/', -43, 7], '-43/7' );
	deepEqual( KhanUtil.decimalToFraction(1/2), ['/', 1, 2], '1/2' );
	deepEqual( KhanUtil.decimalToFraction(2/9), ['/', 2, 9], '14/63' );
	deepEqual( KhanUtil.decimalToFraction(-13/16), ['/', -13, 16], '-13/16' );
	deepEqual( KhanUtil.decimalToFraction(27/970), ['/', 27, 970], '27/970' );
	
	//decimals with few digits
	deepEqual( KhanUtil.decimalToFraction(.3), ['/', 3, 10], '.3 -> 3/10' );
	deepEqual( KhanUtil.decimalToFraction(.33), ['/', 33, 100], '.33 -> 33/100' );
	deepEqual( KhanUtil.decimalToFraction(.333), ['/', 1, 3], '.333 -> 1/3' );
	deepEqual( KhanUtil.decimalToFraction(.6667), ['/', 2, 3], '.6667 -> 2/3' );
	
	//changing maximum denominator
	deepEqual( KhanUtil.decimalToFraction(.33, 100), ['/', 1, 3], '.33 -> 1/3 if denominator < 100' );

	//integers
	equals( KhanUtil.decimalToFraction(0), 0, "0" )
	equals( KhanUtil.decimalToFraction(-1232131), -1232131, "-1232131" )
	equals( KhanUtil.decimalToFraction(54321), 54321, "54321" )
	equals( KhanUtil.decimalToFraction(0.0001), 0, "0.0001 -> 0" )
	equals( KhanUtil.decimalToFraction(-77.0001), -77, "-77.0001 -> -77" )
});
