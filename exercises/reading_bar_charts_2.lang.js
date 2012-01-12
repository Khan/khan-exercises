({
	"nl" : {
		"question1"	: "Which student's score improved the most between the midterm and final exams?",
		"question2"	: "By how many points did <var>STUDENT</var>'s score improve from the midterm to the final exam?",
		"question3"	: 'How many points did <var>STUDENT</var> earn on the <var>TEST</var>?',
		"question4"	: 'How many students improved their scores from the midterm to the final exam?',
		
		"problem1"	: 'Use the following graph to answer the question below:',

		"hint1"		: "<var>person( INDEX + 1 )</var>'s final exam bar is taller than <var>his( INDEX + 1 )</var>"+ 
					  'midterm bar, so <var>person( INDEX + 1 )</var> improved <var>his( INDEX + 1 )</var> score. <var>His( INDEX + 1 )</var> midterm score was'+ 
					  '<code><var>MIDTERM[ INDEX ]</var></code> and <var>his( INDEX + 1 )</var> final exam score was <code><var>FINAL[ INDEX ]</var></code>, so'+ 
					  '<var>he( INDEX + 1 )</var> improved by <code><var>IMPROVEMENT[ INDEX ]</var></code> points.',
		"hint2"		: "<var>person( INDEX + 1 )</var>'s final exam bar is shorter than <var>his( INDEX + 1 )</var>"+ 
					  'midterm bar, so <var>person( INDEX + 1 )</var> did not improve <var>his( INDEX + 1 )</var> score.',
		"hint3"		: "<var>person( INDEX + 1 )</var>'s final exam bar is the same height as <var>his( INDEX + 1 )</var>"+ 
					  'midterm bar, so <var>person( INDEX + 1 )</var> did not improve <var>his( INDEX + 1 )</var> score.',
		"hint4"		: '<var>MOST_IMPROVED</var> improved <var>his( MOST_IMPROVED_IDX + 1 )</var> score the most, scoring <code><var>BEST_IMPROVEMENT</var></code> more points'+ 
					  'on <var>his( MOST_IMPROVED_IDX + 1 )</var> final exam than on <var>his( MOST_IMPROVED_IDX + 1 )</var> midterm.',
		"hint5"		: 'Find the two bars for <var>STUDENT</var>.',
		"hint6"		: "Compare the height of <var>STUDENT</var>'s blue bar to the scale on the left to find <var>his( INDEX + 1 )</var> midterm score."+ 
					  '<span data-if="MIDTERM[ INDEX ] % 10 === 5">'+ 
					  "The bar's height is halfway between <code><var>MIDTERM[ INDEX ] - 5</var></code> and <code><var>MIDTERM[ INDEX ] + 5</var></code>, so </span>"+ 
					  '<var>STUDENT</var> earned <code class="hint_blue"><var>MIDTERM[ INDEX ]</var></code> points on the midterm.',
		"hint7"		: "Compare the height of <var>STUDENT</var>'s orange bar to the scale on the left to find <var>his( INDEX + 1 )</var> final exam score."+ 
					  '<span data-if="FINAL[ INDEX ] % 10 === 5">'+ 
					  "The bar's height is halfway between <code><var>FINAL[ INDEX ] - 5</var></code> and <code><var>FINAL[ INDEX ] + 5</var></code>, so</span>"+ 
					  '<var>STUDENT</var> earned <code class="hint_orange"><var>FINAL[ INDEX ]</var></code> points on the final exam.',
		"hint8"		: 'Subtract the midterm score from the final exam score to find out how much <var>STUDENT</var> improved.',
		"hint9"		: '<code>\color{ORANGE}{<var>FINAL[ INDEX ]</var>} - \color{#6495ED}{<var>MIDTERM[ INDEX ]</var>} = <var>IMPROVEMENT[ INDEX ]</var></code>, so'+ 
					  '<var>STUDENT</var> improved by <code><var>IMPROVEMENT[ INDEX ]</var></code> points from the midterm to the final exam.',
		"hint10"	: 'Find the two bars for <var>STUDENT</var>.',
		"hint11"	: 'Use the key to figure out which of the two bars shows the score for the <var>TEST</var>.',
		"hint12"	: 'Compare the height of <var>STUDENT</var>s <span data-if="COLUMN === 0">blue</span><span data-else>orange</span> bar to the scale on the left.',
		"hint13"	: "The bar's height is halfway between <code><var>ANSWER - 5</var></code> and <code><var>ANSWER + 5</var></code>, so"+
					  '<var>STUDENT</var> earned <code><var>ANSWER</var></code> points on the <var>TEST</var>.',
		"hint14"	: '<var>STUDENT</var> earned <code><var>ANSWER</var></code> points on the <var>TEST</var>.',
		"hint15"	: "<var>person( INDEX + 1 )</var>'s final exam bar is taller than <var>his( INDEX + 1 )</var>"+
					  'midterm bar, so <var>person( INDEX + 1 )</var> improved <var>his( INDEX + 1 )</var> score.',
		"hint16"	: "<var>person( INDEX + 1 )</var>'s final exam bar is shorter than <var>his( INDEX + 1 )</var>"+
					  'midterm bar, so <var>person( INDEX + 1 )</var> did not improve <var>his( INDEX + 1 )</var> score.',
		"hint17"	: "<var>person( INDEX + 1 )</var>'s final exam bar is the same height as <var>his( INDEX + 1 )</var>"+
					  'midterm bar, so <var>person( INDEX + 1 )</var> did not improve <var>his( INDEX + 1 )</var> score.',
		"hint18"	: 'Count the number of students who improved their scores.',
		"hint19"	: '<code><var>NUM_IMPROVED</var></code> students improved their scores from the midterm to the final exam.'
		}
})