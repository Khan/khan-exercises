jQuery.extend(KhanUtil, {
	// TODO: Generate more varied problems, e.g.
	// lim(x->2) x^2 - 3x + 2 / 2x - 4
	generateLHopitalProblem: function() {
		var approaches = "0"
		// Generate polynomials suitable for an L'Hopital's rule problem
		// (has no plain numbers, requires taking no more than 3
		// derivatives to solve)
		var degree = KhanUtil.randRange(2,3)
		var numerator = new KhanUtil.Polynomial(degree - 1, degree, KhanUtil.randCoefs(degree - 1, degree), "x")
		var denominator = new KhanUtil.Polynomial(degree - 1, degree, KhanUtil.randCoefs(degree - 1, degree), "x")

		// Find a list of successive derivatives of a polynomial until
		// resolving a 0/0 indeterminate form is possible (the denominator
		// has a plain number in it with no variable, and therefore the
		// result of evaluating the expression with x=0 will not be
		// undefined)

		// This list is used in hints and to find the actual solution to the
		// problem
		var steps = [[numerator, denominator]]

		while(denominator.findMinDegree() != 0) {
			numerator = KhanUtil.ddxPolynomial(numerator)
			denominator = KhanUtil.ddxPolynomial(denominator)
			steps.push([numerator, denominator])
		}

		// Get solution
		var solution_numerator = numerator.evalOf(0), solution_denominator = denominator.evalOf(0)

		// Reverse redunant negatives, e.g. -1/-1 becomes 1/1 
		if(solution_numerator < 0 && solution_denominator < 0) {
			solution_numerator = -solution_numerator
			solution_denominator = -solution_denominator
		}

		return { approaches: approaches, numerator: steps[0][0], denominator: steps[0][1],
						 solution_numerator: solution_numerator, solution_denominator: solution_denominator,
						 steps: steps }
	},

	formatLHopitalHint: function(problem) {
		var buffer = '', steps = problem.steps

		for(var i = 0; i != steps.length-1; i++) {
			var step = steps[i]

			buffer += "<code>\\displaystyle \\frac{\\frac{d}{dx} ( " + step[0].text() + ")}{\\frac{d}{dx} (" + step[1].text()+")} = " +
				"\\frac{"+steps[i+1][0].text()+"}{"+steps[i+1][1].text()+"}</code><br />"

			if(i+1 != steps.length-1) {
				buffer += "<br />Since evaluating the limit at this point still results in 0/0, we must apply L'Hopital's rule again.<br />"
			}
		}

		return buffer
	},
})
