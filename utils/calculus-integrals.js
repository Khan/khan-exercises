// FIXME: 3x^-3 is integrated wrong!

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

			// Coefficients will randomly be made negative

			var multiple = (expt + 1) * KhanUtil.randRange(1,4)

			coefs[expt] = KhanUtil.randFromArray([multiple, multiple, 1, expt])
			coefs[expt] *= KhanUtil.randRangeNonZero(-1, 1)
		})

		var min = Math.min.apply(Math, expts)
		var max = Math.max.apply(Math, expts)

		// Zero out coefficients
		for(var i = max; i != min; i--) {
			if(coefs[i] === undefined)
				coefs[i] = 0
		}
		
		if(true) {
			var tmpcoefs = []
			tmpcoefs[-4] = -3
			tmpcoefs[-3] = 3
			tmpcoefs[-2] = -2
			tmpcoefs[-1] = 0
			tmpcoefs[0] = 100
			tmpcoefs[1] = 10
			tmpcoefs[2] = -6
			tmpcoefs[3] = 0
			tmpcoefs[4] = 0 
			tmpcoefs[5] = 12
			return new KhanUtil.Polynomial(-4, 5, tmpcoefs)
		}

		return new KhanUtil.Polynomial(min, max, coefs)
	},

	// Meant for output of randBasicIntegral
	integrateBasic: function(poly) {
		// Given a numerator and a denominator, converts them to a
		// nicely-formatted fraction (or integer if possible)
		var maybeFraction = function(n, d) {
			var as_int = n[1] / n[2]
			// If the division results in an integer, return that
			if(as_int % 1 == 0)
				return as_int

			var negative = n < 0 || d < 0
			var fraction = ["frac", Math.abs(n), Math.abs(d)]
			
			return negative ? ["-", fraction] : fraction
		}


		// Function for touching up fractions
		var fixFraction = function(n) {
			if(!jQuery.isArray(n)) return n

			var as_int = n[1] / n[2]			
   		// If the division can be represented with an integer, do that instead,
			// because integration will occasionally produce silly results, ex: 
			// -2x^2 => (-2/-1)x^-1, which is correct but silly
			if(as_int % 1 == 0)
				return as_int

			// Remove negative signs from inside fractions
			if(n[1] < 0 && n[2] < 0) {
				// numerator & denominator are negative
				return ["frac", -n[1], -n[2]]
			} else if(n[1] < 0) {
				// numerator is negative
				return ["-", ["frac", -n[1], n[2]]];
			} else if(n[2] < 0) {
				// denominator is negative
				return ["-", ["frac", n[1], -n[2]]];
			}

			// fraction has no negatives
			return n
		}

		// We'll create a new expression using this array to store the results of the integration
		var coefs = []
		var wrong_coefs1 = []
		var wrong_coefs2 = []
		var wrong_coefs3 = []
		var wrong_coefs4 = []

		// Iterate through the polynomial
		for(var i = poly.maxDegree; i >= poly.minDegree; i--) {
			// Ignore terms set to zero
			if(poly.coefs[i] == 0)
				continue

			var answer_coef = 0

			// Wrong answer 1: Does not increment exponents at all
			var wrong_coef1 = 0

			// Wrong answer 2: Decrements negative exponents
			var wrong_coef2 = 0

			// Deal with constants
			if(i == 0) {
				coefs[i+1] = poly.coefs[i]
				wrong_coefs1[i] = poly.coefs[i]
				continue
			}

			// Instead of dividing and ending up with some gross
			// floating-point number, we'll attempt to format the answer
			// using fractions

			answer_coef = ["frac", poly.coefs[i], i+1]
			wrong_coef1 = ["frac", poly.coefs[i], i]


			// Increment power and store
			coefs[i+1] = fixFraction(answer_coef)
			wrong_coefs1[i] = fixFraction(wrong_coef1)
		}

		this.answer = new KhanUtil.Polynomial(poly.minDegree + 1, poly.maxDegree + 1, coefs, poly.variable)

		this.wrongs = []
		this.wrongs.push(new KhanUtil.Polynomial(poly.minDegree, poly.maxDegree, wrong_coefs1, poly.variable))
		this.wrongs.push(2)
		this.wrongs.push(3)
		this.wrongs.push(4)

		this.hint_addition = ''

		console.log('answer ' + this.answer)
		console.log('wrong1 ' + this.wrongs[0] + ' ' + wrong_coefs1)

		// Generate hints

		// This hint shows the sum rule
		for(var i = poly.minDegree; i <= poly.maxDegree; i++) {
			if(poly.coefs[i] != 0) {
				var string = "\\int "
				// Add coefficient, unless it is 1 or -1 then add nothing or -
				string += Math.abs(poly.coefs[i] != 1) ? poly.coefs[i] : (poly.coefs[i] == 1 ? "" : "-");
				// Add variable
				var constant = i == 0
				string += constant ? "" : poly.variable
				// Add exponent
				string += constant ? "" :  "^{" + i + "}"

				string += " dx "

				if(i != poly.maxDegree)
					string += "+"
				this.hint_addition += string
			}
		}

		// This hint shows the integration of each term in the problem
		this.hint_integration = []

		for(var i = 0; i != poly.getNumberOfTerms(); i++) {
			var term = poly.getCoefAndDegreeForTerm(i)

			var coef = term.coef
			var expt = term.degree
			var variable = poly.variable
			var constant = expt == 0

			var expt_s = constant ? "" : ("^{" + expt + "}")

			var string = "\\int " + coef + (constant ? "" : variable) + expt_s + " dx = "

			// Constant rule
			if(expt == 0) {
				string += coef + variable
			} else {
				// Power rule

				// Show increment of exponent
				string += coef + "\\frac{1}{" + expt + " + 1}" + variable + "^{"+expt+"+1} = "

				// Show multiplication of coefficient
				string += coef + "\\frac{1}{" + (expt+1) + "}" + variable + "^{"+(expt+1)+ "} = "

				var nterm = this.answer.getCoefAndDegreeForTerm(i)
				var ncoef = nterm.coef
				var nexpt = nterm.degree

				string += KhanUtil.expr(ncoef).toString() + variable + "^{" + (expt+1) + "}"
			}

			this.hint_integration.push(string)
		}
	},
})
