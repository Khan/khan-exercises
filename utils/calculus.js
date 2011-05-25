jQuery.extend(KhanUtil, {
	trigFuncs: ["\\sin", "\\cos", "\\tan"],
	ddxTrigFuncs: {
		"\\sin": "\\cos",
		"\\cos": "-\\sin",
		"\\tan": "\\sec^2"
	},

	generateFunction: function( variable ) {
		// Generate a differentiable expression object
		// {fofx, ddxF, wrongs}
		// x being the name of the variable we differentiate with respect to
		// ensure that the function isn"t just 0 as well
		var f;
		do {
    		f = KhanUtil.randFromArray(KhanUtil.funcGens)( variable );
		} while (f.fofx === "0");
		return f;
	},

	generateSpecialFunction: function( variable ) {
		// Different emphasis from normal generateFunction
		// For the special_derivatives exercise
		var f;
		do {
			var r = KhanUtil.rand(10);
			if ( r < 2 ) { // 20% chance of power rule
				f = KhanUtil.funcGens[0]( variable );
			} else if ( r < 6 ) { // 40% chance of trig
				f = KhanUtil.funcGens[1]( variable );
			} else if ( r < 10 ) { // 40% chance of e^x / ln x
				f = KhanUtil.funcGens[3]( variable );
			}
		} while (f.f === "0");
		return f;
	},

	randCoefs: function( minDegree, maxDegree ) {
		var coefs = [];
		for (var i = maxDegree; i >= minDegree; i--) {
			coefs[i] = KhanUtil.randRange(-7, 7);
		}
		return coefs;
	},

	ddxPolynomial: function( poly ) {
		var ddxCoefs = [];
		
		for (var i = poly.maxDegree; i >= poly.minDegree; i--) {
			ddxCoefs[i - 1] = i * poly.coefs[i];
		}
		
		return new KhanUtil.Polynomial(poly.minDegree - 1, poly.maxDegree - 1, ddxCoefs, poly.variable);
	},

	// doesn't decrement exponents
	ddxPolynomialWrong1: function( poly ) {
		var ddxCoefs = [];
		
		for (var i = poly.maxDegree; i >= poly.minDegree; i--) {
			ddxCoefs[i] = i * poly.coefs[i];
		}
		
		return new KhanUtil.Polynomial( poly.minDegree, poly.maxDegree, ddxCoefs, poly.variable );
	},

	// increments negative exponents
	ddxPolynomialWrong2: function( poly ) {
		var ddxCoefs = [];
		
		for (var i = poly.maxDegree; i >= poly.minDegree; i--) {
			if (i < 0) {
				ddxCoefs[i + 1] = i * poly.coefs[i];
			} else {
				ddxCoefs[i - 1] = i * poly.coefs[i];
			}
		}
		
		return new KhanUtil.Polynomial( poly.minDegree, poly.maxDegree, ddxCoefs, poly.variable );
	},

	// reversed signs on all terms
	ddxPolynomialWrong3: function( poly ) {
		var ddxCoefs = [];
		
		for (var i = poly.maxDegree; i >= poly.minDegree; i--) {
			ddxCoefs[i - 1] = -1 * i * poly.coefs[i];
		}
		
		return new KhanUtil.Polynomial( poly.minDegree - 1, poly.maxDegree - 1, ddxCoefs, poly.variable );
	},

	// doesn't multiply coefficients
	ddxPolynomialWrong4: function( poly ) {
		var ddxCoefs = [];
		
		for (var i = poly.maxDegree; i >= poly.minDegree; i--) {
			ddxCoefs[i - 1] = poly.coefs[i];
		}
		
		return new KhanUtil.Polynomial( poly.minDegree - 1, poly.maxDegree - 1, ddxCoefs, poly.variable );
	},

	// original with flipped signs
	ddxPolynomialWrong5: function( poly ) {
		var ddxCoefs = [];
		
		for (var i = poly.maxDegree; i >= poly.minDegree; i--) {
			ddxCoefs[i] = poly.coefs[i] * -1;
		}
		
		return new KhanUtil.Polynomial( poly.minDegree, poly.maxDegree, ddxCoefs, poly.variable );
	},

	funcNotation: function( variable ) {
		if (!variable) {
			variable = "x";
		}
		
		var notations = [
			["y", "\\frac{dy}{d"+variable+"}"],
			["f("+variable+")", "f'("+variable+")"],
			["g("+variable+")", "g'("+variable+")"],
			["y", "y'"],
			["f("+variable+")", "\\frac{d}{d"+variable+"} f("+variable+")"],
			["a", "a'"],
			["a", "\\frac{da}{d"+variable+"}"]
		];
		var n_idx = KhanUtil.rand( notations.length );
		return {
			f: notations[n_idx][0],
			ddxF: notations[n_idx][1]
		};
	},

	funcGens: [
		function( variable ) {
			// power rule, polynomials
			var maxDegree = KhanUtil.randRange(2, 4);
			var minDegree = KhanUtil.randRange(-2, 2);
			var coefs = KhanUtil.randCoefs(minDegree, maxDegree);
			
			var f = new KhanUtil.Polynomial(minDegree, maxDegree, coefs, variable);
			
			return { f: f.text(),
					 ddxF: KhanUtil.ddxPolynomial(f).text(),
					 wrongs: [
						 KhanUtil.ddxPolynomialWrong1(f).text(),
						 KhanUtil.ddxPolynomialWrong2(f).text(),
						 KhanUtil.ddxPolynomialWrong3(f).text(),
						 KhanUtil.ddxPolynomialWrong4(f).text(),
						 KhanUtil.ddxPolynomialWrong5(f).text()
					 ] };
		},

		function( variable ) {
			// random trig func
			var idx = KhanUtil.rand(2); // 0 - 2 in trig funcs
			var wrongs = [];
			
			wrongs[0] = "\\sin{" + variable + "}";
			wrongs[1] = "\\csc{" + variable + "}";
			wrongs[2] = "\\sec{" + variable + "}";
			wrongs[3] = "\\tan{" + variable + "}";
			wrongs[4] = "-\\sec{" + variable + "}";
			wrongs[5] = "-\\cos{" + variable + "}";
			
			return { f: KhanUtil.trigFuncs[idx] + "{" + variable + "}",
					 ddxF: KhanUtil.ddxTrigFuncs[ KhanUtil.trigFuncs[idx] ] + "{" + variable + "}",
					 wrongs: wrongs };
		},

		function( variable ) {
			// basic x^power, simplified version of polynomials in [0]
			// kept KhanUtil around mainly for easy wrong answer generation
			var maxDegree = KhanUtil.randRange(2, 6);
			var minDegree = maxDegree;
			
			var coefs = [];
			coefs[maxDegree] = 1;

			var f = new KhanUtil.Polynomial(minDegree, maxDegree, coefs, variable);
			
			return { f: f.text(),
					 ddxF: KhanUtil.ddxPolynomial(f).text(),
					 wrongs: [
						 KhanUtil.ddxPolynomialWrong1(f).text(),
						 KhanUtil.ddxPolynomialWrong2(f).text(),
						 KhanUtil.ddxPolynomialWrong3(f).text(),
						 KhanUtil.ddxPolynomialWrong4(f).text(),
						 KhanUtil.ddxPolynomialWrong5(f).text()
					 ] };
		},

		function( variable ) {
			// ln x and e^x, combined in one because these should not be too likely
			var wrongs = [];
										   
			if (KhanUtil.rand(1)) {
				wrongs[0] = "\\frac{1}{\\ln "+variable+"}";
				wrongs[1] = "e^" + variable;
				wrongs[2] = "\\frac{1}{e^"+ variable + "}";
				wrongs[3] = "\\ln "+variable+"";
				wrongs[4] = "\\frac{1}{"+variable+"^2}";
				wrongs[5] = variable;
				
				return { f: "\\ln " + variable,
						 ddxF: "\\frac{1}{" + variable + "}",
						 wrongs: wrongs };
			} else {
				wrongs[0] = variable + "e^{"+variable+"-1}";
				wrongs[1] = "\\frac{1}{"+ variable+"}";
				wrongs[2] = variable+"e^{"+variable+"}";
				wrongs[3] = "e^{"+variable+"-1}";
				wrongs[4] = "(e-"+variable+")^{"+variable+"}";
				wrongs[5] = "\\frac{e}{" + variable + "}";
				
				return { f: "e^"+ variable,
						 ddxF: "e^"+ variable,
						 wrongs: wrongs };
			}
		} ]
});