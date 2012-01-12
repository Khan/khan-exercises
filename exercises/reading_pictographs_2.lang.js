({
	"nl" : {
		"question1"	: 'How many <var>BADGE</var> badges did <var>person( PERSON + 1 )</var> earn?',
		"question2"	: 'Who earned <code><var>VALUE</var></code> <var>BADGE</var> <var>plural( "badge", VALUE )</var>?',
		"question3"	: 'How many more <var>BADGE</var> badges did <var>person( PERSON1 + 1 )</var> earn than <var>person( PERSON2 + 1 )</var>?',
		"question4"	: 'How many <var>BADGE</var> badges were earned by everyone all together?',
		
		"span1"		: '<span style="text-transform:capitalize"><var>BADGE</var></span> badges earned by each student',
		
		"problem1"	: 'Use the pictograph to answer the question below:',
		
		"hint1"		: 'The key at the bottom of the pictograph shows that each full symbol represents <var>plural( VALUE_PER_IMG, "badge" )</var>.',
		"hint2"		: "Find <var>person( PERSON + 1 )</var>'s row in the table:"+
					  '<div class="fake_row">'+
					  '<span><var>person( PERSON + 1 )</var></span><span data-each="DATA[ PERSON ] times"><var>FULL_IMAGE</var>'+
					  '</span><span data-if="HALF[ PERSON ]"><var>HALF_IMAGE</var>'+
					  '</span><span data-else></span><span data-each="(7 - DATA[ PERSON ]) times">&nbsp;</span>'+
					  '</div>',
		"hint3"		: 'There <var>plural( "is", DATA[PERSON] )</var> <var>plural( DATA[ PERSON ], "full symbol" )</var><span data-if="HALF[ PERSON ]"> and 1 half symbol</span>.'+
					  '<span data-if="HALF[ PERSON ]">The full symbols represent <var>plural( VALUE_PER_IMG, "badge" )</var>, so the half symbol must represent <var>plural( VALUE_PER_IMG/2, "badge" )</var>.</span>',
		"hint4"		: '<code><var>DATA[ PERSON ]</var></code> <var>plural( "symbol", DATA[ PERSON ] )</var>'+
					  '<code> \times </code> <code><var>VALUE_PER_IMG</var></code> <var>plural( "badge", VALUE_PER_IMG )</var> per symbol <code> = <var>DATA[ PERSON ] * VALUE_PER_IMG</var></code>'+
					  '<var>plural( "badge", DATA[ PERSON ] * VALUE_PER_IMG )</var>.'+
					  '<span data-if="HALF[ PERSON ]">'+
					  '<br /><code>1</code> half symbol <code> \times <var>VALUE_PER_IMG/2</var></code> <var>plural( "badge", VALUE_PER_IMG / 2 )</var> per half symbol <code> = <var>VALUE_PER_IMG / 2</var></code>'+
					  '<var>plural( "badge", VALUE_PER_IMG / 2 )</var>.</span>',
		"hint5"		: '<var>person( PERSON + 1 )</var> earned <code><var>ANSWER</var></code> <var>BADGE</var> <var>plural( "badge", ANSWER )</var>.',
		"hint6"		: 'The key at the bottom of the pictograph shows that each full symbol represents <var>plural( VALUE_PER_IMG, "badge" )</var>.',
		"hint7"		: 'How many symbols are needed to represent <code><var>VALUE</var></code> <var>plural( "badge", VALUE )</var>?',
		"hint8"		: 'Who has <code><var>NUM_SYMBOLS</var></code> <var>plural( "symbol", VALUE / VALUE_PER_IMG )</var> next to <var>his( PERSON + 1 )</var> name?'+
					  '<div class="fake_row">'+
					  '<span>???</span><span data-each="DATA[ PERSON ] times"><var>FULL_IMAGE</var>'+
					  '</span><span data-if="HALF[ PERSON ]"><var>HALF_IMAGE</var>'+
					  '</span><span data-else></span><span data-each="(7 - DATA[ PERSON ]) times">&nbsp;</span></div>',
		"hint9"		: '<var>person( PERSON + 1 )</var> has <code><var>NUM_SYMBOLS</var></code> <var>plural( "symbol", VALUE / VALUE_PER_IMG )</var> next to <var>his( PERSON + 1 )</var> name.',
		"hint10"	: '<var>person( PERSON + 1 )</var> earned <code><var>VALUE</var></code> <var>BADGE</var> <var>plural( "badge", VALUE )</var>.',
		"hint10.1"	: 'The key at the bottom of the pictograph shows that each full symbol represents <var>plural( VALUE_PER_IMG, "badge" )</var>.',
		"hint11"	: "Find <var>person( PERSON1 + 1 )</var>'s and <var>person( PERSON2 + 1 )</var>'s rows in the table:"+
					  '<div class="fake_row">'+
					  '<span><var>person( PERSON1 + 1 )</var></span><span data-each="DATA[ PERSON1 ] times"><var>FULL_IMAGE</var>'+
					  '</span><span data-if="HALF[ PERSON1 ]"><var>HALF_IMAGE</var>'+
					  '</span><span data-else></span><span data-each="(7 - DATA[ PERSON1 ]) times">&nbsp;</span>'+
					  '</div>'+
					  '<div class="fake_row">'+
					  '<span><var>person( PERSON2 + 1 )</var></span><span data-each="DATA[ PERSON2 ] times"><var>FULL_IMAGE</var>'+
					  '</span><span data-if="HALF[ PERSON2 ]"><var>HALF_IMAGE</var>'+
					  '</span><span data-else></span><span data-each="(7 - DATA[ PERSON2 ]) times">&nbsp;</span>'+
					  '</div>',
		"hint12"	: '<var>person( PERSON1 + 1 )</var> has <code><var>PRETTY_SYM_DIFF</var></code> more <var>plural( "symbol", SYMBOL_DIFF )</var> next to <var>his( PERSON1 + 1 )</var> name than <var>person( PERSON2 + 1 )</var> does.',
		"hint13"	: '<code><var>PRETTY_SYM_DIFF</var></code> <var>plural( "symbol", SYMBOL_DIFF )</var>'+
					  '<code> \times </code> <code><var>VALUE_PER_IMG</var></code> <var>plural( "badge", VALUE_PER_IMG )</var> per symbol <code> = <var>VAL1 - VAL2</var></code>'+
					  '<var>plural( "badge", VAL1 - VAL2 )</var>.',
		"hint14"	: '<var>person( PERSON1 + 1 )</var> earned <code><var>VAL1 - VAL2</var></code> more <var>BADGE</var> <var>plural( "badge", VAL1 - VAL2 )</var> than <var>person( PERSON2 + 1 )</var>.',
		"hint15"	: 'Start by counting the total number of <var>BADGE</var> symbols.',
		"hint16"	: 'There are <code><var>FULL_SYM</var></code> symbols<span data-if="HALF_SYM !== 0"> and <code><var>HALF_SYM</var></code> half symbols</span>.',
		"hint17"	: 'Each symbol represents <code><var>VALUE_PER_IMG</var></code> <var>BADGE</var> <var>plural( "badge", VALUE_PER_IMG )</var><span data-if="HALF_SYM !== 0"> and each half symbol represents <code><var>VALUE_PER_IMG / 2</var></code> <var>BADGE</var> <var>plural( "badge", VALUE_PER_IMG / 2 )</var></span>.',
		"hint18"	: '<code><var>FULL_SYM</var></code> <var>plural( "symbol", FULL_SYM )</var>'+
					  '<code> \times </code> <code><var>VALUE_PER_IMG</var></code> <var>plural( "badge", VALUE_PER_IMG )</var> per symbol <code> = <var>FULL_SYM * VALUE_PER_IMG</var></code>'+
					  '<var>plural( "badge", FULL_SYM * VALUE_PER_IMG )</var>.'+
					  '<span data-if="HALF_SYM">'+
					  '<br /><code><var>HALF_SYM</var></code> half <var>plural( "symbol", HALF_SYM )</var>'+
					  '<code> \times <var>VALUE_PER_IMG/2</var></code> <var>plural( "badge", VALUE_PER_IMG / 2 )</var> per half symbol <code> = <var>HALF_SYM * VALUE_PER_IMG / 2</var></code>'+
					  '<var>plural( "badge", HALF_SYM * VALUE_PER_IMG / 2 )</var>.</span>',+
		"hint19"	: 'All together, everyone earned <code><var>TOTAL</var></code> <var>BADGE</var> <var>plural( "badge", TOTAL )</var>.'
		}
})