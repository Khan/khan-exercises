({
	"nl" : {
		"question1"	: 'In <var>his(1)</var> <var>course(1)</var> class, <var>person(1)</var> took <var>LENGTH</var> <var>plural(exam(1))</var>. <var>His(1)</var> scores were <var>toSentence(SCORES)</var>.',
		"question2"	: 'What was <var>his(1)</var> average score on the <var>plural(exam(1))</var>?',
		"question3"	: 'On the first <var>COUNT</var> <var>plural(exam(1))</var> of <var>his(1)</var> <var>course(1)</var> class, <var>person(1)</var> got an average score of <var>OLD_AVG</var>.',
		"question4"	: 'What does <var>he(1)</var> need on the next <var>exam(1)</var> to have an overall average of <var>NEW_AVG</var>?',
		"question5"	: '<var>person(1)</var> has taken <var>COUNT</var> <var>plural(exam(1))</var> and <var>his(1)</var> average score so far is <var>OLD_AVG</var>.',
		"question6" : 'If <var>he(1)</var> gets 100, a perfect score, on the remaining <var>REMAINING</var> <var>plural(exam(1))</var>, what will <var>his(1)</var> new average be?'
		
		"hint1"		: 'The average is the sum of <var>his(1)</var> scores divided by the number of scores.',
		"hint2"		: 'There are <var>LENGTH</var> scores and their sum is <code><var>SCORES.join(" + ")</var> = <var>SUM</var></code>.',
		"hint3"		: '<var>His(1)</var> average score is <code><var>SUM</var> \div <var>LENGTH</var> = <var>SUM / LENGTH</var></code>.',
		"hint4"		: 'Let <var>his(1)</var> score on the next <var>exam(1)</var> be <code>x</code>.',
		"hint5"		: 'The sum of all of <var>his(1)</var> scores is then <code><var>COUNT</var> \cdot <var>OLD_AVG</var> + x</code>.',
		"hint6"		: 'The same sum must also be equal to <code><var>COUNT + 1</var> \cdot <var>NEW_AVG</var></code>.',
		"hint7"		: 'Solve: <code>x = <var>COUNT + 1</var> \cdot <var>NEW_AVG</var> - <var>COUNT</var> \cdot <var>OLD_AVG</var> = <var>(COUNT + 1) * NEW_AVG - COUNT * OLD_AVG</var></code>.',
		"hint8"		: 'If <var>he(1)</var> gets 100 on the remaining <var>plural(exam(1))</var>, the sum of <var>his(1)</var> scores will be <code><var>COUNT</var> \cdot <var>OLD_AVG</var> + <var>REMAINING</var> \cdot <var>100</var> = <var>COUNT * OLD_AVG + 100 * REMAINING</var></code>.',
		"hint9"		: '<var>His(1)</var> overall average will then be <code><var>COUNT * OLD_AVG + 100 * REMAINING</var> \div <var>COUNT + REMAINING</var> = <var>NEW_AVG</var></code>.'
		}
})