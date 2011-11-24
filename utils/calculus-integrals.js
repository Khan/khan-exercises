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

		for(var i = max; i != min; i--) {
			if(coefs[i] === undefined)
				coefs[i] = 0
		}
		
		return new KhanUtil.Polynomial(min, max, coefs)
	},

	// Meant for output of randBasicIntegral
	integrateBasic: function(poly) {
		var fixFraction = function(n) {
			if(!jQuery.isArray(n)) return n

			var as_int = n[1] / n[2]			
   		// If the division can be represented with an integer, do that instead,
			// because the above will occasionally produce silly results, ex: 
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

			// Fraction has no negative signs
			return n
		}

		// We'll create a new expression using this array to store the results of the integration
		var coefs = []
		var wrong_coefs1 = []

		// Iterate through the polynomial
		for(var i = poly.maxDegree; i >= poly.minDegree; i--) {
			var answer_coef = 0

			// Wrong answer 1: Does not increment exponents
			var wrong_coef1 = 0

			// Instead of dividing and ending up with some gross
			// floating-point number, we'll attempt to format the answer
			// using fractions
			if(poly.coefs[i] == undefined || poly.coefs[i] == 0) {
				answer_coef = wrong_coef1 = 0
			} else if(Math.abs(poly.coefs[i]) == Math.abs(i)) {
				// Deal with coefficients that are the same as the power
				// ex: 3x^3 => (3/4)x^4
				answer_coef = ["frac", poly.coefs[i], i+1]
				wrong_coef1 = poly.coefs[i] / i
			} else if(Math.abs(poly.coefs[i]) == 1 && i != 0 && i != -2) {
				// Deal with coefficients of one, unless the power is 0 or -2
				answer_coef = ["frac", poly.coefs[i], i+1]
				wrong_coef1 = ["frac", poly.coefs[i], i]
			} else {
				answer_coef = poly.coefs[i] * 1/(i+1)
				wrong_coef1 = poly.coefs[i] * 1/i
			}

			console.log('answer_coef = '+ answer_coef)
			console.log('answer_coef fixFraction =  ' + fixFraction(answer_coef))

			// Increment power and store
			coefs[i+1] = fixFraction(answer_coef)
		}

		this.answer = new KhanUtil.Polynomial(poly.minDegree + 1, poly.maxDegree + 1, coefs, poly.variable)

		this.wrongs = []
		this.wrongs.push(1)
		this.wrongs.push(2)
		this.wrongs.push(3)
		this.wrongs.push(4)
		this.wrongs.push(5)

		this.hint_addition = ''

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
