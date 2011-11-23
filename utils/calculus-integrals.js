jQuery.extend(KhanUtil, {
	// Generate exponents suitable for a polynomial integration problem.

	// max-min should be greater than terms, otherwise this could get
	// caught in an endless loop as it does not allow repeat exponents
	randIntegralExpts: function(terms, min, max) {
		var expts = []
		while(terms--) {
			var expt = KhanUtil.randRange(min, max)
			// Discard 1/x because they haven't learned it yet,
			// discard repeat exponents
			if(expt == -1 || jQuery.inArray(expt, expts) != -1) {
				terms++
				continue
			}
			expts.push(expt)
		}
		return expts
	},

	// Generate a polynomial suitable for an integration problem
	randIntegralPolynomial: function(expts) {
		console.log('randIntegralPolynomial expts: '+expts)
		var coefs = []

		//return new KhanUtil.Polynomial(poly.minDegree - 1, poly.maxDegree - 1, ddxCoefs, poly.variable);

		// Generate coefficients
		jQuery.each(expts, function(_, expt) {
			// When we get 0 as an exponent, we'll generate a constant in its
			// place
			if(expt == 0) {
				coefs[expt] = KhanUtil.randRange(-99, 99)
				if(coefs[expt] == 0) {
					coefs[expt] = 1
				}
				return
			}

			// Generate one of three types of coefficients
			
			// A multiple of n+1, ex: 8x => 4x^2
			// A coefficient of 1, ex: x^2 => (1/3)x^3
			// The same as the exponent ex: 5x^5 => (5/6)x^6

			switch(KhanUtil.randRange(1,4)) {
			case 1:
			case 2:
				coefs[expt] = (expt + 1) * KhanUtil.randRange(1,4)
				break
			case 3:
				coefs[expt] = 1
				break
			case 4:
				coefs[expt] = expt
				break
			}

			// Randomly make coefficients negative just to mix things up
			coefs[expt] = KhanUtil.randFromArray([coefs[expt], -coefs[expt]])
		})

		var min = Math.min.apply(Math, expts)
		var max = Math.max.apply(Math, expts)

		// for ddxPolynomial
		for(var i = max; i != min; i--) {
			if(coefs[i] === undefined)
				coefs[i] = 0
		}

		console.log('randIntegralPolynomial coefs: ' + jQuery.map(coefs, function(elt, i) { return i+':'+elt }))	 
		
		var poly = new KhanUtil.Polynomial(min, max, coefs)

/*
		// tmp for testing
		var tmpcoefs=[]
		tmpcoefs[5]=-1
		var tmppoly = new KhanUtil.Polynomial(0, 5, tmpcoefs)

		if(tmppoly!= undefined) return tmppoly
		//console.log('poly minDegree: ' + poly.findMinDegree() + ', maxDegree: ' + poly.findMaxDegree() + ' numberOfTerms: ' + poly.getNumberOfTerms())
*/

		console.log('randIntegralPolynomial: ' + poly)
		return poly
	},

	// Mainly meant for output of randIntegralPolynomial, will probably not work well with generic expressions
	integratePolynomial: function(poly) {
		// We'll create a new polynomial using this array to store the results of the integration
		var coefs = []

		// Iterate through the polynomial
		for(var i = poly.maxDegree; i >= poly.minDegree; i--) {
			var new_coef = 0

			if(poly.coefs[i] == undefined || poly.coefs[i] == 0) {
				new_coef = 0
			} else if(Math.abs(poly.coefs[i]) == i) {
				// Deal with coefficients that are the same as the power
				// ex: 3x^3 => (3/4)x^4
				new_coef = ["frac", poly.coefs[i] < 0 ? -i : i, i+1]
			} else if(Math.abs(poly.coefs[i]) == 1 && i != 0 && i != -2) {
				// Deal with coefficients of one, unless the power is 0 or -2
				new_coef = ["frac", poly.coefs[i], i+1]
			} else {
				new_coef = poly.coefs[i] * 1/(i+1)
			}

			// Touch up fractions
			if(jQuery.isArray(new_coef)) {
				// If the division can be represented with an integer, do that instead,
				// because the above will occasionally produce silly results, ex: 
				// -2x^2 => (-2/-1)x^-1, which is correct but silly
				var new_coef_int = new_coef[1] / new_coef[2]
				if(new_coef_int % 1 == 0) {
					console.log('we got us a bad ' + new_coef)
					new_coef = new_coef_int
				} else {
					// Remove negative signs from inside fractions
					if(new_coef[1] < 0 && new_coef[2] < 0) {
						// numerator & denominator are negative
						new_coef = ["frac", -new_coef[1], -new_coef[2]]
					} else if(new_coef[1] < 0) {
						// numerator is negative
						new_coef = ["-", ["frac", -new_coef[1], new_coef[2]]];
					} else if(new_coef[2] < 0) {
						// denominator is negative
						new_coef = ["-", ["frac", new_coef[1], -new_coef[2]]];
					}
					console.log('we got us a frac ' + new_coef)
				}
			}

			// Increment power and store
			coefs[i+1] = new_coef
		}

		console.log('integratePolynomial coefs: ' + coefs)
		var poly = new KhanUtil.Polynomial(poly.minDegree + 1, poly.maxDegree + 1, coefs, poly.variable)
		console.log('integratePolynomial poly: ' + poly)
		return poly
	},
})
