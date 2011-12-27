({
	"nl" : {
		"question1" : "Round <code><var>commafy( NUM )</var></code> to the nearest <var>TPLACE</var>.",
		"hint1" : "There are two ways to think about this problem.",
		"hint2" : "1st way: Look at the <var>placesLeftOfDecimal[ -1 - PLACE ]</var>s digit <code><var>DIGITS[ 5 + PLACE ]</var></code> to see whether to round up or down.",
		"hint3" : 'Because it is <span data-if="DIGITS[ 5 + PLACE ] > 5">more than</span><span data-else>equal to</span> <code>5</code>, we round up, giving <code><var>commafy( ROUNDED )</var></code>.',
		"hint4" : "Because it is less than <code>5</code>, we round down, giving <code><var>commafy( ROUNDED )</var></code>.",
		"hint5" : "2nd way:  Consider which end of the number line is closer to <var>NUM</var> - this end is circled in blue."
	}
})