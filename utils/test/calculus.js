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