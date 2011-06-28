module("math");

(function(){

test( "toFraction", function() {

	deepEqual( KhanUtil.toFraction( 4/8 ), [1, 2], "4/8" );
	deepEqual( KhanUtil.toFraction( 0.666 ), [333, 500], "0.666" );
	deepEqual( KhanUtil.toFraction( 0.666, 0.001 ), [2, 3], "0.666 with tol" );
	deepEqual( KhanUtil.toFraction( 20/14 ), [10, 7], "20/14" );
	deepEqual( KhanUtil.toFraction( 500 ), [500, 1], "500" );
	deepEqual( KhanUtil.toFraction( -500 ), [-500, 1], "-500" );
	deepEqual( KhanUtil.toFraction( -Math.PI, 0.000001 ), [-355, 113], "-pi" );

});

})();