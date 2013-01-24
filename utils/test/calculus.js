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
	var powerRule = new KhanUtil.PowerRule ( -1, 2, neg_coefs, "x", KhanUtil.derivNotation ( "x", 1 ) ); //-2x^{2}+6x+4-x^{-1}
	equals ( powerRule.hints.length, 4 );
	equals ( powerRule.hints[0], "\\dfrac{d (-2x^{2})}{dx} \\implies 2 \\cdot -2x^{2-1} = -4x" );
	equals ( powerRule.hints[1], "\\dfrac{d (6x)}{dx} \\implies 1 \\cdot 6x^{1-1} = 6" );
	equals ( powerRule.hints[2], "\\dfrac{d (4)}{dx} \\implies 0 \\cdot 4x^{0-1} = 0" );
	equals ( powerRule.hints[3], "\\dfrac{d (-x^{-1})}{dx} \\implies -1 \\cdot -1x^{-1-1} = x^{-2}");

	powerRule = new KhanUtil.PowerRule ( -1, 2, neg_coefs, "x", KhanUtil.derivNotation ( "x", 4 ) ); //-2x^{2}+6x+4-x^{-1}
	equals ( powerRule.hints.length, 4 );
	equals ( powerRule.hints[0], "\\dfrac{d (-2x^{2})}{dx} \\implies 2 \\cdot -2x^{2-1} = -4x" );
});

test("derivNotation - helper for randomly choosing a notation for the function", function(){
	ok(KhanUtil.derivNotation().f, "generates a notation for the function");
	ok(KhanUtil.derivNotation().ddxF, "generates a notation for the function derivative");
	equals(KhanUtil.derivNotation("x",1).f, "f(x)","index works and variable is substituted");
	equals(KhanUtil.derivNotation("x",1).ddxF,"f'(x)","index works and variable is substituted");
	ok(KhanUtil.derivNotation("x",1000).f,"randomly choose a notation if out of range");
	equals(KhanUtil.derivNotation("x",0).diffHint,"y=Ax^{n} \\implies \\frac{dy}{dx}=n \\cdot Ax^{n-1}", "check diffHint");
	equals(KhanUtil.derivNotation("b",1).diffHint,"f'(Ab^{n})=n \\cdot Ab^{n-1}","check diffHint");
	equals(KhanUtil.derivNotation("x",2).diffHint,"g'(Ax^{n})=n \\cdot Ax^{n-1}","check diffHint");
	equals(KhanUtil.derivNotation("b",3).diffHint,"y=Ab^{n} \\implies y'=n \\cdot Ab^{n-1}","check diffHint");
	equals(KhanUtil.derivNotation("x",4).diffHint,"f(x)=Ax^{n} \\implies \\frac{d}{dx}f(x)=n \\cdot Ax^{n-1}","check diffHint");
	equals(KhanUtil.derivNotation("b",5).diffHint,"a=Ab^{n} \\implies a'=n \\cdot Ab^{n-1}","check diffHint");
	equals(KhanUtil.derivNotation("x",6).diffHint,"a=Ax^{n} \\implies \\frac{da}{dx}=n \\cdot Ax^{n-1}","check diffHint");
});

test("integralPolynomial - Antiderivatives of Polynomials", function() {
	equals((KhanUtil.integralPolynomial(new KhanUtil.Polynomial(2, 5, coefs, "x", null))).toString(), "0.833x^{6}+0.8x^{5}+0.75x^{4}+0.667x^{3}+C", "antidifferentiate 5x^{5}+4x^{4}+3x^{3}+2x^{2}" );
});

test("IntegralOfPolynomial - helper object for polynomial antidifferentiation", function(){

	var integralPoly = new KhanUtil.IntegralOfPolynomial();
	ok(integralPoly.fText, "null constructor produces a displayable function");
	ok(integralPoly.integralFText, "null constructor produces a displayable antidifferentiated function");

	integralPoly = new KhanUtil.IntegralOfPolynomial(2, 5, coefs, "x");
	equals(integralPoly.fText,"5x^{5}+4x^{4}+3x^{3}+2x^{2}","check it correctly converts polynomial to LaTeX");
	equals(integralPoly.integralFText,"0.833x^{6}+0.8x^{5}+0.75x^{4}+0.667x^{3}+C", "check it correctly converts the antiderivative of the polynomial to LaTeX" );

	for (var index in integralPoly.wrongsText){
		notEqual(integralPoly.wrongsText[index],integralPoly.integralFText,"none of the wrong answers should match the right one");
	}
	ok(KhanUtil.IntegralOfPolynomial() instanceof KhanUtil.IntegralOfPolynomial, "check that 'new' operator is optional");

});


test ( "Hints for IngegralOfPoly", function(){
	var integralPoly = new KhanUtil.IntegralOfPolynomial( 2, 5, coefs, "x", KhanUtil.integralNotation ( "x", 1 ) ); //5x^{5}+4x^{4}+3x^{3}+2x^{2}
	equals ( integralPoly.hints.length, 4 );
	equals ( integralPoly.hints[0], "\\displaystyle \\int \\!5x^{5}\\mathrm{d}x\\implies  \\frac{5}{5 + 1}x^{5+1} = 0.833x^{6}" );
	equals ( integralPoly.hints[1], "\\displaystyle \\int \\!4x^{4}\\mathrm{d}x\\implies  \\frac{4}{4 + 1}x^{4+1} = 0.8x^{5}" );
	equals ( integralPoly.hints[2], "\\displaystyle \\int \\!3x^{3}\\mathrm{d}x\\implies  \\frac{3}{3 + 1}x^{3+1} = 0.75x^{4}" );
	equals ( integralPoly.hints[3], "\\displaystyle \\int \\!2x^{2}\\mathrm{d}x\\implies  \\frac{2}{2 + 1}x^{2+1} = 0.667x^{3}");
	integralPoly = new KhanUtil.IntegralOfPolynomial( 2, 5, coefs, "x", KhanUtil.integralNotation ( "x", 4 ) ); //5x^{5}+4x^{4}+3x^{3}+2x^{2}
	equals ( integralPoly.hints.length, 4 );
	equals ( integralPoly.hints[0], "\\displaystyle \\int \\!5x^{5}\\mathrm{d}x\\implies  \\frac{5}{5 + 1}x^{5+1} = 0.833x^{6}" );
});

test("integralNotation - helper for randomly choosing a notation for the function", function(){
	ok(KhanUtil.integralNotation().f, "generates a notation for the function");
	ok(KhanUtil.integralNotation().integralF, "generates a notation for the function antiderivative");
	equals(KhanUtil.integralNotation("x",1).f, "f(x)","index works and variable is substituted");
	equals(KhanUtil.integralNotation("x",1).integralF,"\\displaystyle \\int \\!f\\, \\mathrm{d}x","index works and variable is substituted");
	ok(KhanUtil.integralNotation("x",1000).f,"randomly choose a notation if out of range");
	equals(KhanUtil.integralNotation("x",0).integralHint,"y=Ax^{n} \\implies\\displaystyle \\int \\!Ax^{n}\\, \\mathrm{d}x=\\frac{A}{n+1}x^{n+1} + C, \\hspace{5 mm} \\text{for } n \\not= -1", "check integralHint");
	equals(KhanUtil.integralNotation("b",1).integralHint,"\\displaystyle \\int \\!Ab^{n}\\, \\mathrm{d}b=\\frac{A}{n+1}b^{n+1} + C, \\hspace{5 mm} \\text{for } n \\not= -1","check integralHint");
	equals(KhanUtil.integralNotation("x",2).integralHint,"\\displaystyle \\int \\!Ax^{n}\\, \\mathrm{d}x=\\frac{A}{n+1}x^{n+1} + C, \\hspace{5 mm} \\text{for } n \\not= -1","check integralHint");
	equals(KhanUtil.integralNotation("b",3).integralHint,"y=Ab^{n} \\implies\\displaystyle \\int \\!Ab^{n}\\, \\mathrm{d}b=\\frac{A}{n+1}b^{n+1} + C, \\hspace{5 mm} \\text{for } n \\not= -1","check integralHint");
	equals(KhanUtil.integralNotation("x",4).integralHint,"f(x)=Ax^{n} \\implies\\displaystyle \\int \\!Ax^{n}\\, \\mathrm{d}x=\\frac{A}{n+1}x^{n+1} + C, \\hspace{5 mm} \\text{for } n \\not= -1","check integralHint");
	equals(KhanUtil.integralNotation("b",5).integralHint,"a=Ab^{n} \\implies\\displaystyle \\int \\!Ab^{n}\\, \\mathrm{d}b=\\frac{A}{n+1}b^{n+1} + C, \\hspace{5 mm} \\text{for } n \\not= -1","check integralHint");
	equals(KhanUtil.integralNotation("x",6).integralHint,"a=Ax^{n} \\implies\\displaystyle \\int \\!Ax^{n}\\, \\mathrm{d}x=\\frac{A}{n+1}x^{n+1} + C, \\hspace{5 mm} \\text{for } n \\not= -1","check integralHint");
});
})();
