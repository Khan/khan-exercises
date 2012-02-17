jQuery.extend(KhanUtil, {
  
  //Rounds an amount to 2 decimal places, i.e. cents
	roundToCurrency: function(amount) {
	  return Math.round(amount * 100)/100;
	},
	
  // Given a single principal amount, interest, and time period,
	// calculate the future value of the investement with compound interest
	futureValueSingleAmount: function( principal, interest, numPeriods ) {
		return KhanUtil.roundToCurrency(principal * Math.pow(1 + interest/100, numPeriods));
	},
	
	// Given a single principal amount, interest, and time period,
	// calculate the future value of the investement with simple interest
	futureValueSingleAmountSimpleInterest: function( principal, interest, numPeriods ) {
		return KhanUtil.roundToCurrency(principal * (1 + numPeriods * interest/100));
	},
	
	// Given a future amount of money, calculate how much that money is worth today,
	// given the interest (discount) rate and the time period
	presentValueSingleAmount: function( futureValue, interest, numPeriods ) {
		return KhanUtil.roundToCurrency(futureValue * (1/(Math.pow(1 + interest/100, numPeriods))));
	},
	
});