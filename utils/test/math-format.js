module("math-format" );

(function(){
test("cardinal", function() {
	// Bad values
	equal(KhanUtil.cardinal("1ab"), "undefined", "Does not catch illegal argument string");
	equal(KhanUtil.cardinal("23"), "undefined", "Does not catch illegal argument string");
	// Positive Values
	equal(KhanUtil.cardinal(0.00), "zero", "Cardinal fails for 0.00");
	equal(KhanUtil.cardinal(0), "zero", "Cardinal fails for zero");
	equal(KhanUtil.cardinal(0.000001), "one millionth", "Cardinal fails for decimals less than 1");
	equal(KhanUtil.cardinal(.1), "one tenth", "fails when no digit before decimal point");
	equal(KhanUtil.cardinal(0.1), "one tenth", "Cardinal fails for tenths");
	equal(KhanUtil.cardinal(0.10), "one tenth", "Cardinal fails for tenths");
	equal(KhanUtil.cardinal(0.15), "fifteen hundredths", "Cardinal fails for decimals less than 1");
	equal(KhanUtil.cardinal(0.33), "thirty-three hundredths", "Cardinal fails for decimals less than 1");
	equal(KhanUtil.cardinal(0.99), "ninety-nine hundredths", "Cardinal fails for decimals less than 1");
	equal(KhanUtil.cardinal(1),"one","can't detect one");
	equal(KhanUtil.cardinal(1.0000000000), "one", "Cardinal fails for decimals");
	equal(KhanUtil.cardinal(1.11), "one and eleven hundredths", "Cardinal fails for decimals");
	equal(KhanUtil.cardinal(1.01), "one and one hundredth", "Cardinal fails for decimals");
	equal(KhanUtil.cardinal(99.99), "ninety-nine and ninety-nine hundredths", "Cardinal fails for decimals");
	equal(KhanUtil.cardinal(1234), "one thousand two hundred thirty-four", "Number's greater than 1000 fail");
	equal(KhanUtil.cardinal(-1), "negative one", "Negative Integers fail");
	equal(KhanUtil.cardinal(-99), "negative ninety-nine", "Negative Integers fail");
	equal(KhanUtil.cardinal(333.90909091), "three hundred thirty-three and ninety million nine hundred nine thousand ninety-one hundred-millionths", "Cardinal fails for hundred millionth");
	equal(KhanUtil.cardinal(7.123456789), "seven and one hundred twenty-three million four hundred fifty-six thousand seven hundred eighty-nine billionths", "Cardinal fails for billionths");
	equal(KhanUtil.cardinal(7.1234567893), "seven and one billion two hundred thirty-four million five hundred sixty-seven thousand eight hundred ninety-three ten-billionths", "Cardinal fails for ten billionths");
	equal(KhanUtil.cardinal(0.43578961253), "forty-three billion five hundred seventy-eight million nine hundred sixty-one thousand two hundred fifty-three hundred-billionths", "Cardinal fails for hundred billionths");
	
	equal(KhanUtil.cardinal(0.435789612534), "four hundred thirty-five billion seven hundred eighty-nine million six hundred twelve thousand five hundred thirty-four trillionths", "Cardinal fails for trillionths");
	equal(KhanUtil.cardinal(7.0000000001), "seven and one ten-billionth", "Cardinal fails for one ten billionth");
	equal(KhanUtil.cardinal(123456), "one hundred twenty-three thousand four hundred fifty-six", "Hundred thousaands fail");
	equal(KhanUtil.cardinal(1000000.000001), "one million and one millionth", "fails for big numbers with ten millionth");
	// negative values
	equal(KhanUtil.cardinal(- 0.00), "zero", "Cardinal fails for - 0.00");
	equal(KhanUtil.cardinal(-0.15 ), "negative fifteen hundredths", "negative numbers between 0 and 1 fail");
	equal(KhanUtil.cardinal(-0.000001), "negative one millionth", "Cardinal fails for decimals less than 1");
	equal(KhanUtil.cardinal(-1), "negative one", "Cardinal fails for decimals less than 1");
	equal(KhanUtil.cardinal(-1.0), "negative one", "Cardinal fails for decimals less than 1");
	equal(KhanUtil.cardinal(-1.1), "negative one and one tenth", "Cardinal fails for decimals just more than 1");
	equal(KhanUtil.cardinal(-1.000001), "negative one and one millionth", "Cardinal fails for decimals less than 1");
	equal(KhanUtil.cardinal(-345.4554), "negative three hundred forty-five and four thousand five hundred fifty-four ten-thousandths", "Cardinal fails for decimals");

});
})();
