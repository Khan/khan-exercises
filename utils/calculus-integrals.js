jQuery.extend(KhanUtil, {
	// Generate a expression suitable for an integration problem using the power rule and constant rules
	randBasicIntegral: function() {
		var coefs = []
		var terms = KhanUtil.randRange(1,4)
		var expts = []

		while(terms) {
			var expt = KhanUtil.randRange(-3, 5)
			// Discard 1/x because they haven't learned it yet,
			// discard repeat exponents
			if(expt == -1 || jQuery.inArray(expt, expts) != -1) {
				continue
			}
			expts.push(expt)
			terms--
		}

		// Generate coefficients
		jQuery.each(expts, function(_, expt) {
			// When we get 0 as an exponent, we'll generate a constant in its
			// place
			if(expt == 0) {
				coefs[expt] = KhanUtil.randRangeNonZero(-99, 99)
				return
			}

			// Generate one of three types of coefficients
			
			// A multiple of n+1, ex: 8x => 4x^2
			// A coefficient of 1, ex: x^2 => (1/3)x^3
			// The same as the exponent ex: 5x^5 => (5/6)x^6

			var multiple = (expt + 1) * KhanUtil.randRange(1,4)

			coefs[expt] = KhanUtil.randFromArray([multiple, multiple, 1, expt])

			// Coefficients will randomly be made negative
			coefs[expt] *= KhanUtil.randRangeNonZero(-1, 1)
		})

		var min = Math.min.apply(Math, expts)
		var max = Math.max.apply(Math, expts)

		// Zero out coefficients
		for(var i = max; i != min; i--) {
			if(coefs[i] === undefined)
				coefs[i] = 0
		}
		
		return new KhanUtil.Polynomial(min, max, coefs)
	},

	// Meant for output of randBasicIntegral
	integrateBasic: function(poly) {
		// Given a numerator and a denominator, converts them to a
		// nicely-formatted fraction (or integer if possible)
		var maybeFraction = function(n, d) {
			var as_int = n / d
			// If the division results in an integer, return that
			if(as_int % 1 == 0)
				return as_int

			var negative = n * d < 0
			var fraction = ["frac", Math.abs(n), Math.abs(d)]
			
			return negative ? ["-", fraction] : fraction
		}

		// We'll create a new expression using these arrays to store the results of the integration
		var coefs = [], wrong_coefs1 = [], wrong_coefs2 = [], wrong_coefs3 = []

		// Perform the actual integration
		for(var i = poly.maxDegree; i >= poly.minDegree; i--) {
			// Ignore terms set to zero
			if(poly.coefs[i] == 0)
				continue

			// Constant rule
			if(i == 0) {
				coefs[i+1] = poly.coefs[i]
				wrong_coefs1[i] = poly.coefs[i]
				wrong_coefs2[i+1] = poly.coefs[i]
				wrong_coefs3[i+1] = poly.coefs[i]
				continue
			} else { 
				// Power rule

				// Instead of dividing and ending up with some gross
				// floating-point number, we'll attempt to format the answer
				// using fractions
				coefs[i+1] = maybeFraction(poly.coefs[i], i+1)

				// Wrong answer 1: Does not increment exponents at all
				wrong_coefs1[i] = maybeFraction(poly.coefs[i], i)

				// Wrong answer 2: Decrements negative exponents
				if(i < 0) {
					wrong_coefs2[i-1] = maybeFraction(poly.coefs[i], i-1)
				} else {
					wrong_coefs2[i+1] = maybeFraction(poly.coefs[i], i+1)
				}

				// Wrong answer 3: Reversed signs
				wrong_coefs3[i+1] = maybeFraction(-poly.coefs[i], i+1)
			}
		}

		// Generate answers


		this.answer = new KhanUtil.Polynomial(poly.minDegree, poly.maxDegree + 1, coefs, poly.variable)

		this.wrongs = []

		this.wrongs.push(new KhanUtil.Polynomial(poly.minDegree, poly.maxDegree + 1, wrong_coefs1, poly.variable))
		this.wrongs.push(new KhanUtil.Polynomial(poly.minDegree - 1, poly.maxDegree + 1, wrong_coefs2, poly.variable).text())
		this.wrongs.push(new KhanUtil.Polynomial(poly.minDegree, poly.maxDegree + 1, wrong_coefs3, poly.variable).text())
		// Wrong answer 4: expression is differentiated instead of integrated
		this.wrongs.push(KhanUtil.ddxPolynomial(poly))

		// Generate hints

		// This hint shows the sum rule
		this.hint_addition = ''

		for(var i = poly.maxDegree; i >= poly.minDegree; i--) {
			if(poly.coefs[i] != 0) {
				var string = "\\int "
				// Add coefficient, unless it is 1 or -1 then add nothing or -
				string += Math.abs(poly.coefs[i] != 1) ? poly.coefs[i] : (poly.coefs[i] == 1 ? "" : "-");
				// Add variable, exponent if this is not a constant
				if(i != 0) {
					string += poly.variable + '^{' + i + '}'
				}
				string += " dx "
				// Unless this is the last term, append a +
				if(i != poly.minDegree)
					string += "+"
				this.hint_addition += string
			}
		}

		// This hint shows the integration of each term in the problem
		this.hint_integration = []

		for(var i = poly.maxDegree; i >= poly.minDegree; i--) {
			var coef = poly.coefs[i]

			// Ignore terms set to zero
			if(coef == 0) continue

			var variable = poly.variable
			var string = ''
			// Constant rule
			if(i == 0) {
				// Restate the term with the integral symbol
				string = '\\int ' + coef + ' dx = '
				string += '\\color{' + KhanUtil.BLUE + '}{' + coef + variable + '}'
			} else {
				// Power rule

				// Restate the term with the integral symbol
				string = '\\int ' + coef + variable + '^{'+ (i == 1 ? "" : i) +'} dx = '
				// Show increment of exponent
				string += coef + '\\frac{1}{' + i + '+1}' + variable + '^{'+i+'+1} = '
				// Now actually increment it
				string += coef + '\\frac{1}{' + (i+1) + '}' + variable + '^{'+(i+1)+'} = '
				// Give answer
				var ncoef = this.answer.coefs[i+1]
				// Make 1 implicit
				if(Math.abs(ncoef) == 1)
					ncoef = ncoef < 0 ? "-" : ""
				string += '\\color{' + KhanUtil.BLUE + '}{' + KhanUtil.expr(ncoef) + variable + '^{' + (i+1) + '}}'
			}

			this.hint_integration.push(string)
		}
		console.log(this.hint_integration)
	},
})
