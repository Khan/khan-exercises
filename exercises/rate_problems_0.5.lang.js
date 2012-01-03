({
	"nl" : {
		"question1"	: 'If <var>person( 1 )</var> can <var>VERB</var> <var>RATE</var> <var>NOUN</var>s per <var>TIME_UNIT</var>, how many <var>TIME_UNIT</var>s will it take <var>him( 1 )</var> to <var>VERB</var> <span data-if="INDEX !== 3">a </span> <var>PROJECT1</var>?',
		"question2"	: 'If <var>person( 1 )</var> can <var>VERB</var> <var>RATE</var> <var>NOUN</var>s per <var>TIME_UNIT</var> and it took <var>him( 1 )</var> <var>TIME</var> <var>TIME_UNIT</var>s to <var>VERB</var> <var>his( 1 )</var> <var>PROJECT2</var>, how many <var>NOUN</var>s did the <var>PROJECT3</var> have?',
		"question3"	: 'If <var>person( 1 )</var> can <var>VERB</var> <span data-if="INDEX !== 3">a </span><var>PROJECT1</var> in <var>TIME</var> <var>TIME_UNIT</var>s, how many <var>NOUN</var>s per <var>TIME_UNIT</var> can <var>he( 1 )</var> <var>VERB</var>?',
	
		"var1"		: '[ "type", "eat", "hit", "paint" ][ INDEX ]',
		"var2"		: '[ "word", "pretzel", "golf ball", "portrait" ][ INDEX ]',
		"var3"		: '[ "minute", "hour", "hour", "week" ][ INDEX ]',
		"var4"		: '[ AMOUNT + " word essay", "bag of " + AMOUNT + " pretzels", "bucket of " + AMOUNT + " golf balls", AMOUNT + " portraits" ][ INDEX ]',
		"var5"		: '[ "latest essay", "bag of pretzels", "bucket of balls at the driving range", "portraits for the art exhibit" ][ INDEX ]',
		"var6"		: '[ "essay", "bag", "bucket", "exhibit" ][ INDEX ]',

		"hint1"		: '<code>\text{amount} = \text{rate} \times \text{time}</code>',
		"hint2"		: '<code><var>AMOUNT</var>\text{ <var>NOUN</var>s} = <var>RATE</var>\dfrac{\text{ <var>NOUN</var>s}}{\text{<var>TIME_UNIT</var>}} \times \text{ time in <var>TIME_UNIT</var>s}</code>',
		"hint3"		: '<code>\text{time in <var>TIME_UNIT</var>s} = \dfrac{<var>AMOUNT</var>\text{ <var>NOUN</var>s}}{<var>RATE</var>\dfrac{\text{<var>NOUN</var>s}}{\text{<var>TIME_UNIT</var>}}}</code>',
		"hint4"		: '<code>\hphantom{\text{time in <var>TIME_UNIT</var>s}} = \dfrac{<var>AMOUNT</var>}{<var>RATE</var>}\text{ <var>TIME_UNIT</var>s}</code>',
		"hint5"		: '<code>\hphantom{\text{time in <var>TIME_UNIT</var>s}} = <var>TIME</var>\text{ <var>TIME_UNIT</var>s}</code>',
		"hint6"		: '<code>\text{amount} = \text{rate} \times \text{time}</code>',
		"hint7"		: '<code>\text{number of <var>NOUN</var>s} = <var>RATE</var>\dfrac{\text{<var>NOUN</var>s}}{\text{<var>TIME_UNIT</var>}} \times <var>TIME</var>\text{ <var>TIME_UNIT</var>s}</code>',
		"hint8"		: '<code>\hphantom{\text{number of <var>NOUN</var>s}} = <var>RATE</var> \times <var>TIME</var>\text{ <var>NOUN</var>s}</code>',
		"hint9"		: '<code>\hphantom{\text{number of <var>NOUN</var>s}} = <var>AMOUNT</var>\text{ <var>NOUN</var>s}</code>',
		"hint10"	: '<code>\text{amount} = \text{rate} \times \text{time}</code>',
		"hint11"	: '<code><var>AMOUNT</var>\text{ <var>NOUN</var>s} = \text{rate in <var>NOUN</var>s per <var>TIME_UNIT</var>} \times <var>TIME</var>\text{ <var>TIME_UNIT</var>s}</code>',
		"hint12"	: '<code>\text{rate in <var>NOUN</var>s per <var>TIME_UNIT</var>} = \dfrac{<var>AMOUNT</var>\text{ <var>NOUN</var>s}}{<var>TIME</var>\text{ <var>TIME_UNIT</var>s}}</code>',
		"hint13"	: '<code>\hphantom{\text{rate in <var>NOUN</var>s per <var>TIME_UNIT</var>}} = \dfrac{<var>AMOUNT</var>}{<var>TIME</var>}\text{<var>NOUN</var>s per <var>TIME_UNIT</var>}</code>',
		"hint14"	: '<code>\hphantom{\text{rate in <var>NOUN</var>s per <var>TIME_UNIT</var>}} = <var>RATE</var>\text{ <var>NOUN</var>s per <var>TIME_UNIT</var>}</code>'
		}
})