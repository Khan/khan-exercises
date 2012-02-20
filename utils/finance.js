jQuery.extend(KhanUtil, {
  
  /* Rounds an amount to 2 decimal places, i.e. cents */
	roundToCurrency: function(amount) {
	  return Math.round(amount * 100)/100;
	},
	
  /* Given a single principal amount, interest, and time period,
	  calculate the future value of the investement with compound interest */
	futureValueSingleAmount: function( principal, interest, numPeriods ) {
		return KhanUtil.roundToCurrency(principal * Math.pow(1 + interest/100, numPeriods));
	},
	
	/* Given a single principal amount, interest, and time period,
	  calculate the future value of the investement with simple interest */
	futureValueSingleAmountSimpleInterest: function( principal, interest, numPeriods ) {
		return KhanUtil.roundToCurrency(principal * (1 + numPeriods * interest/100));
	},
	
	/* Given a future amount of money, calculate how much that money is worth today,
	  given the interest (discount) rate and the time period */
	presentValueSingleAmount: function( futureValue, interest, numPeriods ) {
		return KhanUtil.roundToCurrency(futureValue * (1/(Math.pow(1 + interest/100, numPeriods))));
	},
	
	/* Given uniform, equally spaced deposits of money earning a compound interest,
	  how much money will the deposits be worth at the end of the time period? */
	futureValueUniformDeposits: function(deposit, interest, period){
	  return KhanUtil.roundToCurrency(deposit * ((Math.pow(1 + interest/100, period) - 1)/(interest/100)));
	},
	
	/* Given uniform, equally spaced withdrawals of money, the principal of which earns a
	compound interest, what is the present value of the principal initially invested? */
	presentValueUniformWithdrawals: function(withdrawal, interest, period){
	  return KhanUtil.roundToCurrency(withdrawal * ((Math.pow(1 + interest/100, period) - 1)/(interest/100 * Math.pow(1 + interest/100, period))));
	},
	
	/*Sums the elements of an array */
	sumArray: function(array){
	  var total = 0;
	  for (var i=0; i<array.length; i++){
	    total += array[i];
	  }
	  return total;
	},
	
	/* Returns a string representation of a dollar amount */
	toDollarString: function(amount){
	  if (amount >= 0) return "$" + amount;
	  else return "($" + Math.abs(amount) + ")";
	},
	
});