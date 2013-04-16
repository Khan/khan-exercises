module("polynomial");

(function(){

//define the polynomial 2x^{4}-3x^{2}+12x+5+3x^{-1}
var polyX = "x"; // polynomial is specified using x
var polyCoefs = [];//add in the coefs for the range that we are using minDegree 2, maxDegree 5
polyCoefs[-1] = 3;
polyCoefs[0] = 5;
polyCoefs[1] = 12;
polyCoefs[2] = -3;
polyCoefs[4] = 2;

test("Polynomial constructor defaults", function(){
	equal((new KhanUtil.Polynomial(-1, 4, polyCoefs)).toString(),"2x^{4}-3x^{2}+12x+5+3x^{-1}", "defaults variable name to x");
	ok((new KhanUtil.Polynomial(-1, 4)).toString(), "randomly generate coefs (3rd param) if not passed");
	equal(new KhanUtil.Polynomial(-1, 4, polyCoefs).getNumberOfTerms(),5,"should only have 5 terms as no 3 coef");
});

test("Polynomial evalOf", function(){
	equal((new KhanUtil.Polynomial(-1, 4, polyCoefs, polyX)).evalOf(1),19,"2*1^4-3*1^2+12*1+5+3*1^-1 = 2-3+12+5+3 = 19");
});

test( "Polynomial extractFromExpr", function(){
	var polynomial = new KhanUtil.Polynomial(-1, 4, polyCoefs);
	equal(polynomial.getCoefAndDegreeForTerm( 0 ).coef,2,"leading term is 2x^4");
	equal(polynomial.getCoefAndDegreeForTerm( 0 ).degree,4,"leading term is 2x^4");
	equal(polynomial.getCoefAndDegreeForTerm( 1 ).coef,-3,"second term is -3x^2");
	equal(polynomial.getCoefAndDegreeForTerm( 1 ).degree,2,"second term is -3x^2");
	equal(polynomial.getCoefAndDegreeForTerm( 2 ).coef,12,"third term is 12x");
	equal(polynomial.getCoefAndDegreeForTerm( 2 ).degree,1,"third term is 12x");
});

})();
