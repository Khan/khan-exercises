jQuery.extend(KhanUtil, {
  // Generate exponents suitable for a polynomial problem.

  // max-min should be greater than terms, otherwise this could get
  // caught in an endless loop as it does not allow repeat exponents
  randIntegralExpts: function(terms, min, max) {
    var expts = []
    while(terms--) {
      var expt = KhanUtil.randRange(min, max)
      // Discard 1/x because they haven't learned it yet,
      // Do not repeat exponents
      if(expt == -1 || jQuery.inArray(expt, expts) != -1) {
        terms++
        continue
      }
      // 0 on the other hand is acceptable, the indefinite integrals
      // exercise will generate a constant in its place
      expts.push(expt)
    }
    return expts
  },

  randIntegralPolynomial: function(expts) {
    console.log('expts: '+expts)
    var coefs = []

		//return new KhanUtil.Polynomial(poly.minDegree - 1, poly.maxDegree - 1, ddxCoefs, poly.variable);

    for(var i = 0; i != expts.length; i++) {
      var expt = expts[i]

      // When we get 0 as an exponent, we'll generate a constant in its
      // place
      if(expt == 0) {
        coefs.push(KhanUtil.randRange(-99,99))
        continue
      }

      // Generate one of three types of coefficients
      
      // A multiple of n+1, ex: 8x => 4x^2
      // A coefficient of 1, ex: x^2 => (1/3)x^3
      // An irrelevant number 

      // Randomly make them negative as well
      switch(KhanUtil.randRange(1,3)) {
      case 1:
        coefs.push((expt + 1) * KhanUtil.randRange(1,4))
        break;
      case 2: 
        coefs.push(1)
        break;
      case 3:
        coefs.push(expt)
        break;
      }
    }
    console.log('coefs: ' + coefs)  
    
    // Expand coefs to include zero coefficients for Polynomial
    var min = Math.min.apply(Math, expts)
    var max = Math.max.apply(Math, expts)
    var pcoefs = {}

    //console.log('max: ' + max + ', min: ' + min)
    
    for(var i = min; i <= max; i++) {
      var coefIndice = jQuery.inArray(i, expts)
      if(coefIndice != -1) {
        pcoefs[i] = coefs[coefIndice]
      } else {
        pcoefs[i] = 0
      }
    }

    //console.log('pcoefs: ' +pcoefs)

    var poly = new KhanUtil.Polynomial(min, max, pcoefs)

    //console.log('poly minDegree: ' + poly.findMinDegree() + ', maxDegree: ' + poly.findMaxDegree() + ' numberOfTerms: ' + poly.getNumberOfTerms())

    console.log(poly)
    return poly
  },
  
  integratePolynomial: function(poly) {
    var coefs = []
  }
})