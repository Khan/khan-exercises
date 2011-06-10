//define the polynomial 5x^5+4x^4+3x^3+2x^2
var x = "x"; // polynomial is specified using x
var coefs = [];//add in the coefs for the range that we are using minDegree 2, maxDegree 5
coefs[2] = 2;
coefs[3] = 3;
coefs[4] = 4;
coefs[5] = 5;

test("Polynomial #constructor defaults", function(){
	equals((new KhanUtil.Polynomial(2, 5, coefs)).toString(),"5x^{5}+4x^{4}+3x^{3}+2x^{2}", "defaults variable name to x");
	ok((new KhanUtil.Polynomial(2, 5)).toString(), "randomly generate coefs (3rd param) if not passed");
});

test("Polynomial #evalOf", function(){
	equals((new KhanUtil.Polynomial(2, 5, coefs, x)).evalOf(1),14,"5*1^5+4*1^4+3*1^3+2*1^2 = 5+4+3+2 = 14");
});