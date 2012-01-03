({
	"nl" : {
		"question1"	: 'Express <code><var>A</var>\%</code> as a fraction. Reduce to lowest terms.',
		
		"hint1"		: '<code><var>A</var>\%</code> literally means <code><var>A</var></code> per 100',
		"hint2"		: 'Putting this in fraction form: <code><var>fraction( A , 100 )</var></code>',
		"hint3"		: 'Both numerator and denominator are divisible by <code><var>getGCD( A , 100 )</var></code>.',
		"hint4"		: 'Reducing to lowest terms, <code><var>fractionReduce( A , 100 )</var></code>.',
		"hint5"		: 'Optionally, the improper fraction <code><var>fractionReduce( A , 100 )</var></code> can be converted to the mixed number <code><var>( A - A % 100 ) / 100 + fractionReduce( round ( A % 100 ), 100 )</var></code>.',
		"hint6"		: '<code><var>A</var>\%</code> literally means <code><var>A</var></code> per 100',
		"hint7"		: 'Putting this in fraction form: <code><var>fraction( A , 100 )</var></code>',
		"hint8"		: 'Multiplying top and bottom by 10 to get rid of the decimal: <code><var>fraction( A * 10 , 1000 )</var></code>',
		"hint9"		: 'Both numerator and denominator are divisible by <code><var>getGCD( A * 10 , 1000 )</var></code>.',
		"hint10"	: 'Reducing to lowest terms, <code><var>fractionReduce( A * 10 , 1000 )</var></code>.',
		"hint11"	: 'Optionally, the improper fraction <code><var>fractionReduce( A * 10 , 1000 )</var></code> can be converted to the mixed number <code><var>( A * 10 - A * 10 % 1000 ) / 1000 + fractionReduce( round ( A * 10 % 1000 ), 1000 )</var></code>.'
		}
})