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
	
	// For the present value multiple choice exercise, return the correct choice wording
	presentValueCorrect: function( singlePayment, twoPayments ) {
		return (singlePayment > twoPayments) ? "Single Payment Now" : "Two Separate Payments";
	},
	
	//Sums the elements of an array
	sumArray: function(array){
	  var total = 0;
	  for (var i=0; i<array.length; i++){
	    total += array[i];
	  }
	  return total;
	},
	
	//Returns a string representation of a dollar amount
	toDollarString: function(amount){
	  if (amount >= 0) return "$" + amount;
	  else return "($" + Math.abs(amount) + ")";
	},
	
});