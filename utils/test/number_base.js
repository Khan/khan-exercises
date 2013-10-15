module("number_base" );

(function(){

test( "math number_base", 2, function() {
	deepEqual( KhanUtil.digitsInBase(12, 2), [ 0,0,1,1 ], "digits(12, 2)" );
    deepEqual( KhanUtil.digitsInBase(137, 5), [ 2,2,0,1 ], "digits(137, 5)" );

});

})();