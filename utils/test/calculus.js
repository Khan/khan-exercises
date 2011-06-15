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

test("#ddxPolynomial - Differentiate Polynomials", function() {
	equals((KhanUtil.ddxPolynomial(new KhanUtil.Polynomial(2, 5, coefs, "x", null))).toString(), "25x^{4}+16x^{3}+9x^{2}+4x", "differentiate 5x^{5}+4x^{4}+3x^{3}+2x^{2}" );
	equals((KhanUtil.ddxPolynomial(new KhanUtil.Polynomial(-1, 2, neg_coefs, "x", null))).toString(), "-4x+6+x^{-2}", "differentiate -2x^{2}+6x+4-x^{-1}" );
});

test("#PowerRule - helper object for polynomial differentiation", function(){

	var powerRule = new KhanUtil.PowerRule();
	ok(powerRule.fText, "null constructor produces a displayable function");
	ok(powerRule.ddxFText, "null constructor produces a displayable differentiated function");

	powerRule = new KhanUtil.PowerRule(2, 5, coefs, "x");
	equals(powerRule.fText,"5x^{5}+4x^{4}+3x^{3}+2x^{2}","check it correctly converts polynomial to LaTeX");
	equals(powerRule.ddxFText,"25x^{4}+16x^{3}+9x^{2}+4x", "check it correctly converts the differential of the polynomial to LaTeX" );

	for (wrongText in powerRule.wrongsText){
		notEqual(wrongText,powerRule.ddxFText,"none of the wrong answers should match the right one");
	}
	ok(KhanUtil.PowerRule() instanceof KhanUtil.PowerRule, "check that 'new' operator is optional");

});

test("#funcNotation - helper for randomly choosing a notation for the function", function(){
	ok(KhanUtil.funcNotation().f, "generates a notation for the function");
	ok(KhanUtil.funcNotation().ddxF, "generates a notation for the function derivative");
	equals(KhanUtil.funcNotation("x",1).f, "f(x)","index works and variable is substituted");
	equals(KhanUtil.funcNotation("x",1).ddxF,"f'(x)","index works and variable is substituted");
	ok(KhanUtil.funcNotation("x",1000).f,"randomly choose a notation if out of range");
	equals(KhanUtil.funcNotation("x",0).diffHint,"y=Ax^{n} \\implies \\frac{dy}{dx}=n.Ax^{n-1}", "check diffHint");
	equals(KhanUtil.funcNotation("b",1).diffHint,"f'(Ab^{n})=n.Ab^{n-1}","check diffHint");
	equals(KhanUtil.funcNotation("x",2).diffHint,"g'(Ax^{n})=n.Ax^{n-1}","check diffHint");
	equals(KhanUtil.funcNotation("b",3).diffHint,"y=Ab^{n} \\implies y'=n.Ab^{n-1}","check diffHint");
	equals(KhanUtil.funcNotation("x",4).diffHint,"f(x)=Ax^{n} \\implies \\frac{d}{dx}f(x)=n.Ax^{n-1}","check diffHint");
	equals(KhanUtil.funcNotation("b",5).diffHint,"a=Ab^{n} \\implies a'=n.Ab^{n-1}","check diffHint");
	equals(KhanUtil.funcNotation("x",6).diffHint,"a=Ax^{n} \\implies \\frac{da}{dx}=n.Ax^{n-1}","check diffHint");
});