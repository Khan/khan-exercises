module("expressions");

(function(){

var expr = KhanUtil.expr;
var exprStripColor = KhanUtil.exprStripColor;
var exprSimplifyAssociative = KhanUtil.exprSimplifyAssociative;

test( "Expression formatter", function() {
	equal( expr([ "-", 1 ]), "-1", "-1");
	equal( expr([ "+", 1, 2 ]), "1+2", "1 + 2" );
	equal( expr([ "+", "elephant", "potato" ]), "elephant+potato", "random strings" );

	equal( expr([ "-", 1, 2 ]), "1-2", "1 - 2" );
	equal( expr([ "-", 1, 2, 3, -4 ]), "1-2-3-(-4)", "1-2-3-(-4)" );
	equal( expr([ "-", 1 ]), "-1", "-1" );
	equal( expr([ "-", -1 ]), "-(-1)", "-(-1)" );
	equal( expr([ "-", 2 ]), "-2", "-2" );
	equal( expr([ "-", -2 ]), "-(-2)", "-(-2)" );

	equal( expr([ "*", "x", "y" ]), "xy", "x * y" );
	equal( expr([ "*", 2, 4 ]), "(2)(4)", "2 * 4" );
	equal( expr([ "*", 2, 4, "x" ]), "(2)(4)(x)", "2 * 4 * x" );

	equal( expr([ "*", 2, ["^", 4, 2 ] ]), "2(4^{2})", "2 * 4^2" );
	equal( expr([ "*", 2, ["^", 0, 2 ] ]), "2(0^{2})", "2 * 0^2" );
	equal( expr([ "*", 2, ["^", -3, 2 ] ]), "2(-3)^{2}", "2 * (-3)^2" );

	equal( expr([ "/", 5, 3 ]), "5/3", "5 / 3" );

	equal( expr([ "^", "x", 2 ]), "x^{2}", "x^2" );
	equal( expr([ "^", [ "*", "x", "y" ], 2 ]), "(xy)^{2}", "(xy)^2" );
	equal( expr([ "^", [ "*", "x", "y" ], [ "+", 2, 3 ] ]), "(xy)^{2+3}", "(xy)^{2+3}" );

	equal( expr([ "sin", "x" ]), "\\sin{x}", "sin x" );
	equal( expr([ "sin", [ "*", "x", "y" ] ]), "\\sin{(xy)}", "sin xy" );
	equal( expr([ "sin", [ "+", "x", "y" ] ]), "\\sin{(x+y)}", "sin(x + y)" );

	equal( expr([ "*", 2, [ "sqrt", 5 ] ]), "2\\sqrt{5}", "2 sqrt(5)" );
	equal( expr([ "*", [ "+", "w", "x" ], "y" ]), "(w+x)(y)", "(w + x) * y" );

	equal( expr([ "+-", "x" ]), "\\pm x", "+- x" );
	equal( expr([ "+-", "x", "y" ]), "x \\pm y", "x +- y" );
	equal( expr([ "+-", [ "+", "x", "y" ] ]), "\\pm (x+y)", "x +- y" );

	equal( expr([ "+", [ "*", 2, [ "^", 3, 2 ] ], [ "*", -3, 3 ], 4 ]), "2(3^{2})+(-3)(3)+4", "issue 90" );
	equal( expr([ "+", [ "*", 2, [ "^", 3, "x" ] ], [ "*", -3, "x" ], 4 ]), "2(3^{x})-3x+4", "issue 90" );
	equal( expr([ "*", -2, [ "^", "x", 2 ] ]), "-2x^{2}", "polynomial term" );

	equal( expr([ "-", [ "+", 1, 2 ] ]), "-(1+2)", "-1*(1+2)" );
	equal( expr([ "-", [ "+", 1, -2 ] ]), "-(1-2)", "-1*(1-2)" );
	equal( expr([ "*", 3, [ "+", 1, -2 ], 4 ]), "3(1-2)(4)", "3 * (1-2) * 4" );
	equal( expr([ "*", 3, [ "-", 1, -2 ], 4 ]), "3(1-(-2))(4)", "3 * (1-(-2)) * 4" );
	equal( expr([ "+", 1, [ "-", [ "*", 2, 3, 4 ] ], 5, 6 ]), "1-(2)(3)(4)+5+6", "1-(2)(3)(4)+5+6" );

	// Test colors
	equal( expr([ "*", 4, [ "+", 2, [ "color", "blue", 2 ] ] ]), "4(2+\\color{blue}{2})", "4(2+\\color{blue}{2})" );
	equal( expr([ "*", 4, [ "color", "blue", 2 ] ]), "(4)(\\color{blue}{2})", "(4)(\\color{blue}{2})" );
});

test( "Expression evaluator", function() {
	equal( expr([ "+", 2, 4 ], true ), 6, "2 + 4" );
	equal( expr([ "*", 2, 4 ], true ), 8, "2 * 4" );
	equal( expr([ "-", 2, 4 ], true ), -2, "2 - 4" );
	equal( expr([ "/", 2, 4 ], true ), 0.5, "2 / 4" );
	equal( expr([ "^", 2, 4 ], true ), 16, "2 ^ 4" );
	equal( expr([ "frac", 2, 4 ], true ), 0.5, "2 `frac` 4" );
	equal( expr([ "sqrt", 65536 ], true ), 256, "sqrt 65536" );
	equal( expr([ "+", [ "*", 2, 4 ], 6 ], true ), 14, "2 * 4 + 6" );

	// Test colors
	equal( expr([ "*", 4, [ "+", 2, [ "color", "blue", 2 ] ] ], true), 16, "4*(2+\\color{blue}{2})" );
	equal( expr([ "*", 4, [ "color", "blue", 2 ] ], true), 8, "(4)(\\color{blue}{2})" );
});

test( "Expression utilities", function() {
	//remove colors
	equal( expr(exprStripColor([ "color", "green", 17 ])), "17", "color outside" );
	equal( expr(exprStripColor([ "*", 4, [ "+", 2, [ "color", "blue", 2 ] ] ])), "4(2+2)", "color inside" );

	//simplify an expression
	equal( expr(exprSimplifyAssociative([ "+", 1, [ "+", [ "+", 2, 3 ], 4 ] ])), "1+2+3+4", "Simplify 1+((2+3)+4)" );
	equal( expr(exprSimplifyAssociative([ "*", [ "*", [ "*", 2, 3 ], 4 ], 5 ])), "(2)(3)(4)(5)", "Simplify ((2*3)*4)*5" );
	equal( expr(exprSimplifyAssociative([ "*", [ "*", [ "*", [ "+", 1, [ "+", [ "+", 2, 3, [ "*", [ "*", [ "*", 2, 3 ], 4 ], 5 ] ], 4 ] ], 3 ], 4 ], 5 ])), "(1+2+3+(2)(3)(4)(5)+4)(3)(4)(5)", "Simplify alternating multiplication and addition" );
});

})();
