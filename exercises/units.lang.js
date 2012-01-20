({
	"nl" : {
		"question1"		: '['+
					'{ str: "milli", math: "\\\\dfrac{1}{1000}", inverse: "1000" },'+
					'{ str: "centi", math: "\\\\dfrac{1}{100}", inverse: "100" },'+
					'{ str: "deci", math: "\\\\dfrac{1}{10}", inverse: "10" },'+
					'{ str: "", math: "1" },'+
					'{ str: "deca", math: "10", inverse: "\\\\dfrac{1}{10}" },'+
					'{ str: "hecto", math: "100", inverse: "\\\\dfrac{1}{100}" },'+
					'{ str: "kilo", math: "1000", inverse: "\\\\dfrac{1}{1000}" } ]',
		"question2"		: 'shuffle( [ "meter", "liter", "gram", "watt" ] ).shift()',
		"question3"		: 'Hoeveel <var>END_UNIT</var> zit er in <var>QUANTITY + " " + START_UNIT</var>?',
		"question4"		: 'In de tabel staan de voorvoegsels en hun betekenis.',
		"question5"		: '<th>Voorvoegsel &nbsp;&nbsp;</th><th>hoeveelheid</th>',
		"question6"		: 'In de tabel zie je dat 1 <var>START_UNIT</var> overeenkomt met <code><var>START_PREFIX.math</var></code> <var>UNIT</var>.',
		"question7"		: 'We zien ook dat 1 <var>END_UNIT</var> overeenkomt met <code><var>END_PREFIX.math</var></code> <var>UNIT</var>.',
		"question8"		: '['+
					'{ str: "kilometer", plural: "kilometer", multiplier: 100000 },'+
					'{ str: "meter", plural: "meter", multiplier: 100 },'+
					'{ str: "centimeter", plural: "centimeter", multiplier: 1 } ]',
		"question9"		: '['+
					'{ str: "uur", plural: "uur", multiplier: 3600 },'+
					'{ str: "minuut", plural: "minuten", multiplier: 60 },'+
					'{ str: "seconde", plural: "seconden", multiplier: 1 }'+
				']',
		"question10"	: 'Een buitenaards ruimteschip beweegt met een snelheid van <code><var>commafy( START_SPEED )</var></code> <var>D_UNITS[START_D_INDEX].plural</var> per <var>T_UNITS[START_T_INDEX].str</var> door de ruimte.<br/>Hoeveel <var>D_UNITS[END_D_INDEX].plural</var> legt het ruimteschip bij deze snelheid af in 1 <var>T_UNITS[END_T_INDEX].str</var>? Rond af op duizendste nauwkeurig.'
		}
})