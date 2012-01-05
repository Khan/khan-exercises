({
	"nl" : {
		"question1"	: 'You have <code><var>NUM_COINS</var></code> coins in a bag. <code><var>NUM_UNFAIR_COINS</var></code> of them are unfair in that they have a <code><var>PERCENT_CHANCE_UNFAIR_HEADS</var>\%</code> chance of coming up heads when flipped (the rest are fair coins). You randomly choose one coin from the bag and flip it <code><var>NUM_FLIPS</var></code> times.',
		"question2"	: 'What is the probability, written as a percentage, of getting <code><var>NUM_FLIPS</var></code> heads? Round your answer to the nearest hundredth of a percent.',
		
		"hint1"		: 'You can only pick a fair coin or pick an unfair coin. There is no other outcome.',
		"hint2"		: 'What chance do you have of picking an unfair coin? How about a fair coin?',
		"hint3"		: 'An unfair coin occurs <code class="unfair"><var>UNFAIR_COIN_FRACTION_STRING</var></code> of the time.',
		"hint4"		: 'A fair coin occurs the rest of the time, or <code class="unfair"><var>FAIR_COIN_FRACTION_STRING</var></code> of the time.',
		"hint5"		: 'For that <code class="unfair"><var>UNFAIR_COIN_FRACTION_STRING</var></code> of the time that you pick an unfair coin,'+
			'what is the chance of flipping <code class="unfair"><var>NUM_FLIPS</var></code> heads using that unfair coin?',
		"hint6"		: 'The chance is <code class="unfair"><var>UNFAIR_HEADS_PERCENT_FORMULA</var></code>, or'+
			'<code class="unfair"><var>UNFAIR_HEADS_DECIMAL_FORMULA</var></code>.',
		"hint7"		: 'Now, then, your chance of both picking the unfair coin and also flipping'+
			'<code class="unfair"><var>NUM_FLIPS</var></code> heads--the chance that both these events occur--is what?',
		"hint8"		: 'It is <code class="unfair"><var>UNFAIR_COIN_FRACTION_STRING</var> \times <var>UNFAIR_HEADS_DECIMAL_FORMULA</var></code>.',
		"hint9"		: 'Now, the other possibility, picking the fair coin and flipping <code class="fair"><var>NUM_FLIPS</var></code> heads is what?',
		"hint10"	: 'It is <code class="fair"><var>FAIR_COIN_FRACTION_STRING</var> \times <var>FAIR_HEADS_DECIMAL_FORMULA</var></code>.',
		"hint11"	: 'How do you combine these two mutually exclusive events to find the chance that either occurs?',
		"hint12"	: 'Add them! So your answer is'+
				'<code class="unfair"><var>UNFAIR_COIN_FRACTION_STRING</var> \times <var>UNFAIR_HEADS_DECIMAL_FORMULA</var></code>+'+
				'<code class="fair"><var>FAIR_COIN_FRACTION_STRING</var> \times <var>FAIR_HEADS_DECIMAL_FORMULA</var></code>, or'+
				'<code><var>ANSWER</var>\%</code>.'
		}
})