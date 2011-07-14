module("calculus");

(function(){

var coefs = [];
coefs[2] = 2;
coefs[3] = 3;
coefs[4] = 4;
coefs[5] = 5;

var neg_coefs = [];
neg_coefs[-1] = -1;
neg_coefs[0] = 4;
neg_coefs[1] = 6;
neg_coefs[2] =-2;

test("ddxPolynomial - Differentiate Polynomials", function() {
	equals((KhanUtil.ddxPolynomial(new KhanUtil.Polynomial(2, 5, coefs, "x", null))).toString(), "25x^{4}+16x^{3}+9x^{2}+4x", "differentiate 5x^{5}+4x^{4}+3x^{3}+2x^{2}" );
	equals((KhanUtil.ddxPolynomial(new KhanUtil.Polynomial(-1, 2, neg_coefs, "x", null))).toString(), "-4x+6+x^{-2}", "differentiate -2x^{2}+6x+4-x^{-1}" );
});

test("PowerRule - helper object for polynomial differentiation", function(){

	var powerRule = new KhanUtil.PowerRule();
	ok(powerRule.fText, "null constructor produces a displayable function");
	ok(powerRule.ddxFText, "null constructor produces a displayable differentiated function");

	powerRule = new KhanUtil.PowerRule(2, 5, coefs, "x");
	equals(powerRule.fText,"5x^{5}+4x^{4}+3x^{3}+2x^{2}","check it correctly converts polynomial to LaTeX");
	equals(powerRule.ddxFText,"25x^{4}+16x^{3}+9x^{2}+4x", "check it correctly converts the differential of the polynomial to LaTeX" );

	for (var index in powerRule.wrongsText){
		notEqual(powerRule.wrongsText[index],powerRule.ddxFText,"none of the wrong answers should match the right one");
	}
	ok(KhanUtil.PowerRule() instanceof KhanUtil.PowerRule, "check that 'new' operator is optional");

});

test ( "Hints for PowerRule", function(){
	var powerRule = new KhanUtil.PowerRule ( -1, 2, neg_coefs, "x", KhanUtil.funcNotation ( "x", 1 ) ); //-2x^{2}+6x+4-x^{-1}
	equals ( powerRule.hints.length, 4 );
	equals ( powerRule.hints[0], "f'(-2x^{2}) = 2 \\cdot -2x^{2-1} = -4x" );
	equals ( powerRule.hints[1], "f'(6x) = 1 \\cdot 6x^{1-1} = 6" );
	equals ( powerRule.hints[2], "f'(4) = 0 \\cdot 4x^{0-1} = 0" );
	equals ( powerRule.hints[3], "f'(-x^{-1}) = -1 \\cdot -1x^{-1-1} = x^{-2}");

	powerRule = new KhanUtil.PowerRule ( -1, 2, neg_coefs, "x", KhanUtil.funcNotation ( "x", 4 ) ); //-2x^{2}+6x+4-x^{-1}
	equals ( powerRule.hints.length, 4 );
	equals ( powerRule.hints[0], "f(x)=-2x^{2} \\implies \\frac{d}{dx}f(x) = 2 \\cdot -2x^{2-1} = -4x" );
});

test("funcNotation - helper for randomly choosing a notation for the function", function(){
	ok(KhanUtil.funcNotation().f, "generates a notation for the function");
	ok(KhanUtil.funcNotation().ddxF, "generates a notation for the function derivative");
	equals(KhanUtil.funcNotation("x",1).f, "f(x)","index works and variable is substituted");
	equals(KhanUtil.funcNotation("x",1).ddxF,"f'(x)","index works and variable is substituted");
	ok(KhanUtil.funcNotation("x",1000).f,"randomly choose a notation if out of range");
	equals(KhanUtil.funcNotation("x",0).diffHint,"y=Ax^{n} \\implies \\frac{dy}{dx}=n \\cdot Ax^{n-1}", "check diffHint");
	equals(KhanUtil.funcNotation("b",1).diffHint,"f'(Ab^{n})=n \\cdot Ab^{n-1}","check diffHint");
	equals(KhanUtil.funcNotation("x",2).diffHint,"g'(Ax^{n})=n \\cdot Ax^{n-1}","check diffHint");
	equals(KhanUtil.funcNotation("b",3).diffHint,"y=Ab^{n} \\implies y'=n \\cdot Ab^{n-1}","check diffHint");
	equals(KhanUtil.funcNotation("x",4).diffHint,"f(x)=Ax^{n} \\implies \\frac{d}{dx}f(x)=n \\cdot Ax^{n-1}","check diffHint");
	equals(KhanUtil.funcNotation("b",5).diffHint,"a=Ab^{n} \\implies a'=n \\cdot Ab^{n-1}","check diffHint");
	equals(KhanUtil.funcNotation("x",6).diffHint,"a=Ax^{n} \\implies \\frac{da}{dx}=n \\cdot Ax^{n-1}","check diffHint");
});

})();
