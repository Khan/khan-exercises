({
	"nl" : {
		"question1"	: 'A <var>CONTAINER</var> contains <code><var>RED</var></code> red <var>MARBLE</var>s,'+
				'<code><var>GREEN</var></code> green <var>MARBLE</var>s, and <code><var>BLUE</var></code> blue <var>MARBLE</var>s.',
		"question2"	: 'If a <var>MARBLE</var> is randomly chosen, what is the probability'+
				'that it is <em data-if="NOT">not</em> <var>CHOSEN_COLOR</var>? Write your answer as a simplified fraction.',
		"question3"	: 'A fair six-sided die is rolled. What is the probability that the'+
				'result is <var>RESULT_DESC</var>?  Write your answer as a simplified fraction.',
		"question4"	: 'A fair coin is flipped <var>REPS == 3 ? "three" : "four"</var> times. What is the'+
				'probability of getting <var>DESC</var>?  Write your answer as a simplified fraction.',
		"question5"	: 'A positive integer is picked randomly from <var>LOW</var> to <var>HIGH</var>, inclusive.',
		"question6"	: 'What is the probability that it is <strong><var>COND_DESC</var></strong>?  Write your answer as a simplified fraction.',
		
		"hint1"		: 'There are <code><var>RED</var> + <var>GREEN</var> + <var>BLUE</var> = <var>TOTAL</var></code> <var>MARBLE</var>s in the <var>CONTAINER</var>.',
		"hint2"		: 'There are <code><var>CHOSEN_NUMBER</var></code> <var>CHOSEN_COLOR</var> <var>MARBLE</var>s.'+
				'<span data-if="NOT" data-tt="hint3">That means <code><var>TOTAL</var> - <var>CHOSEN_NUMBER</var> = <var>NUMBER</var></code> are <em>not</em> <var>CHOSEN_COLOR</var>.</span>',
		"hint3"		: 'The probability is <code>\displaystyle <var>fractionSimplification(NUMBER, TOTAL)</var></code>.',
		"hint4"		: 'When rolling a die, there are <code>6</code> possibilities: 1, 2, 3, 4, 5, and 6.',
		"hint5"		: 'In this case, only <code>1</code> result is favorable: the number <var>RESULT_POSSIBLE[0]</var>.',
		"hint6"		: 'In this case, <code><var>RESULT_COUNT</var></code> results are favorable: <var>toSentence(RESULT_POSSIBLE)</var>.',
		"hint7"		: 'The probability is <code>\displaystyle <var>fractionSimplification(RESULT_COUNT, 6)</var></code>.',
		"hint8"		: 'There are <code><var>(new Array(REPS)).join("2 \\cdot ")</var>2 = 2^{<var>REPS</var>} = <var>TWO_TO_REPS</var></code> possibilities for the sequence of flips.',
		"hint9"		: 'The possibilities are <var>toSentence(ALL_SEQS)</var>.',
		"hint10"	: 'There <var>WANTED_COUNT == 1 ? "is only" : "are"</var> <var>plural(WANTED_COUNT, "favorable outcome")</var>: <var>toSentence(WANTED_LIST)</var>.',
		"hint11"	: 'The probability is <code>\displaystyle <var>fractionSimplification(WANTED_COUNT, TWO_TO_REPS)</var></code>.',
		"hint12"	: 'There are <var>POSSIBLE.length</var> possibilities for the chosen number.<br>The possibilities are <var>toSentence(POSSIBLE)</var>.',
		"hint13"	: 'There <var>WANTED_COUNT == 1 ? "is only" : "are"</var> <var>plural(WANTED_COUNT, "favorable outcome")</var>: <var>toSentence(WANTED_LIST)</var>.',
		"hint14"	: 'The probability is <code>\displaystyle <var>fractionSimplification(WANTED_COUNT, POSSIBLE.length)</var></code>.'
		}
})