({
	"nl" : {
		"question1"		: '['+
					'{ str: "milli", math: "\\dfrac{1}{1000}", inverse: "1000" },'+
					'{ str: "centi", math: "\\dfrac{1}{100}", inverse: "100" },'+
					'{ str: "deci", math: "\\dfrac{1}{10}", inverse: "10" },'+
					'{ str: "", math: "1" },'+
					'{ str: "deca", math: "10", inverse: "\\dfrac{1}{10}" },'+
					'{ str: "hecto", math: "100", inverse: "\\dfrac{1}{100}" },'+
					'{ str: "kilo", math: "1000", inverse: "\\dfrac{1}{1000}" } ]',
		"question2"		: 'shuffle( [ "meter", "liter", "gram", "watt" ] ).shift()',
		"question3"		: 'How many <var>END_UNIT</var>s are in <var>QUANTITY + " " + START_UNIT</var>s?',
		"question4"		: 'The following table shows a few prefixes and their meanings.',
		"question5"		: '<th>Prefix</th><th>Meaning</th>',
		"question6"		: 'Looking at the table, we see that 1 <var>START_UNIT</var> corresponds to <code><var>START_PREFIX.math</var></code> <var>UNIT</var>s.',
		"question7"		: 'We can also see that, 1 <var>END_UNIT</var> corresponds to <code><var>END_PREFIX.math</var></code> <var>UNIT</var>s.',
		"question8"		: '['+
					'{ str: "mile", plural: "miles", multiplier: 63360 },'+
					'{ str: "foot", plural: "feet", multiplier: 12 },'+
					'{ str: "inch", plural: "inches", multiplier: 1 } ]',
		"question9"		: '['+
					'{ str: "hour", plural: "hours", multiplier: 3600 },'+
					'{ str: "minute", plural: "minutes", multiplier: 60 },'+
					'{ str: "second", plural: "seconds", multiplier: 1 }'+
				']',
		"question10"	: 'An alien rocketship is traveling at a speed of <code><var>commafy( START_SPEED )</var></code> <var>D_UNITS[START_D_INDEX].plural</var> per <var>T_UNITS[START_T_INDEX].str</var>. At this speed, how many <var>D_UNITS[END_D_INDEX].plural</var> will it travel in 1 <var>T_UNITS[END_T_INDEX].str</var>? Round to the nearest thousandth.'
		}
})