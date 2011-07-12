module("expressions");

(function(){

var expr = KhanUtil.expr;
var exprStripColor = KhanUtil.exprStripColor;
var exprSimplifyAssociative = KhanUtil.exprSimplifyAssociative;

test( "Expression formatter", function() {
	equals( expr([ "-", 1 ]), "-1", "-1");
	equals( expr([ "+", 1, 2 ]), "1+2", "1 + 2" );
	equals( expr([ "+", "elephant", "potato" ]), "elephant+potato", "random strings" );

	equals( expr([ "-", 1, 2 ]), "1-2", "1 - 2" );
	equals( expr([ "-", 1, 2, 3, -4 ]), "1-2-3-(-4)", "1-2-3-(-4)" );
	equals( expr([ "-", 1 ]), "-1", "-1" );
	equals( expr([ "-", -1 ]), "-(-1)", "-(-1)" );
	equals( expr([ "-", 2 ]), "-2", "-2" );
	equals( expr([ "-", -2 ]), "-(-2)", "-(-2)" );

	equals( expr([ "*", "x", "y" ]), "xy", "x * y" );
	equals( expr([ "*", 2, 4 ]), "(2)(4)", "2 * 4" );
	equals( expr([ "*", 2, 4, "x" ]), "(2)(4)(x)", "2 * 4 * x" );

	equals( expr([ "*", 2, ["^", 4, 2 ] ]), "2(4^{2})", "2 * 4^2" );
	equals( expr([ "*", 2, ["^", 0, 2 ] ]), "2(0^{2})", "2 * 0^2" );
	equals( expr([ "*", 2, ["^", -3, 2 ] ]), "2(-3)^{2}", "2 * (-3)^2" );

	equals( expr([ "/", 5, 3 ]), "5/3", "5 / 3" );

	equals( expr([ "^", "x", 2 ]), "x^{2}", "x^2" );
	equals( expr([ "^", [ "*", "x", "y" ], 2 ]), "(xy)^{2}", "(xy)^2" );
	equals( expr([ "^", [ "*", "x", "y" ], [ "+", 2, 3 ] ]), "(xy)^{2+3}", "(xy)^{2+3}" );

	equals( expr([ "sin", "x" ]), "\\sin{x}", "sin x" );
	equals( expr([ "sin", [ "*", "x", "y" ] ]), "\\sin{(xy)}", "sin xy" );
	equals( expr([ "sin", [ "+", "x", "y" ] ]), "\\sin{(x+y)}", "sin(x + y)" );

	equals( expr([ "*", 2, [ "sqrt", 5 ] ]), "2\\sqrt{5}", "2 sqrt(5)" );
	equals( expr([ "*", [ "+", "w", "x" ], "y" ]), "(w+x)(y)", "(w + x) * y" );

	equals( expr([ "+-", "x" ]), "\\pm x", "+- x" );
	equals( expr([ "+-", "x", "y" ]), "x \\pm y", "x +- y" );
	equals( expr([ "+-", [ "+", "x", "y" ] ]), "\\pm (x+y)", "x +- y" );

	equals( expr([ "+", [ "*", 2, [ "^", 3, 2 ] ], [ "*", -3, 3 ], 4 ]), "2(3^{2})+(-3)(3)+4", "issue 90" );
	equals( expr([ "+", [ "*", 2, [ "^", 3, "x" ] ], [ "*", -3, "x" ], 4 ]), "2(3^{x})-3x+4", "issue 90" );
	equals( expr([ "*", -2, [ "^", "x", 2 ] ]), "-2x^{2}", "polynomial term" );

	equals( expr([ "-", [ "+", 1, 2 ] ]), "-(1+2)", "-1*(1+2)" );
	equals( expr([ "-", [ "+", 1, -2 ] ]), "-(1-2)", "-1*(1-2)" );
	equals( expr([ "*", 3, [ "+", 1, -2 ], 4 ]), "3(1-2)(4)", "3 * (1-2) * 4" );
	equals( expr([ "*", 3, [ "-", 1, -2 ], 4 ]), "3(1-(-2))(4)", "3 * (1-(-2)) * 4" );
	equals( expr([ "+", 1, [ "-", [ "*", 2, 3, 4 ] ], 5, 6 ]), "1-(2)(3)(4)+5+6", "1-(2)(3)(4)+5+6" );

	// Test colors
	equals( expr([ "*", 4, [ "+", 2, [ "color", "blue", 2 ] ] ]), "4(2+\\color{blue}{2})", "4(2+\\color{blue}{2})" );
	equals( expr([ "*", 4, [ "color", "blue", 2 ] ]), "(4)(\\color{blue}{2})", "(4)(\\color{blue}{2})" );
});

test( "Expression evaluator", function() {
	equals( expr([ "+", 2, 4 ], true ), 6, "2 + 4" );
	equals( expr([ "*", 2, 4 ], true ), 8, "2 * 4" );
	equals( expr([ "-", 2, 4 ], true ), -2, "2 - 4" );
	equals( expr([ "/", 2, 4 ], true ), 0.5, "2 / 4" );
	equals( expr([ "^", 2, 4 ], true ), 16, "2 ^ 4" );
	equals( expr([ "frac", 2, 4 ], true ), 0.5, "2 `frac` 4" );
	equals( expr([ "sqrt", 65536 ], true ), 256, "sqrt 65536" );
	equals( expr([ "+", [ "*", 2, 4 ], 6 ], true ), 14, "2 * 4 + 6" );

	// Test colors
	equals( expr([ "*", 4, [ "+", 2, [ "color", "blue", 2 ] ] ], true), 16, "4*(2+\\color{blue}{2})" );
	equals( expr([ "*", 4, [ "color", "blue", 2 ] ], true), 8, "(4)(\\color{blue}{2})" );
});

test( "Expression utilities", function() {
	//remove colors
	equals( expr(exprStripColor([ "color", "green", 17 ])), "17", "color outside" );
	equals( expr(exprStripColor([ "*", 4, [ "+", 2, [ "color", "blue", 2 ] ] ])), "4(2+2)", "color inside" );

	//simplify an expression
	equals( expr(exprSimplifyAssociative([ "+", 1, [ "+", [ "+", 2, 3 ], 4 ] ])), "1+2+3+4", "Simplify 1+((2+3)+4)" );
	equals( expr(exprSimplifyAssociative([ "*", [ "*", [ "*", 2, 3 ], 4 ], 5 ])), "(2)(3)(4)(5)", "Simplify ((2*3)*4)*5" );
	equals( expr(exprSimplifyAssociative([ "*", [ "*", [ "*", [ "+", 1, [ "+", [ "+", 2, 3, [ "*", [ "*", [ "*", 2, 3 ], 4 ], 5 ] ], 4 ] ], 3 ], 4 ], 5 ])), "(1+2+3+(2)(3)(4)(5)+4)(3)(4)(5)", "Simplify alternating multiplication and addition" );
});

})();
