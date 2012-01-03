({
	"nl" : {
		"question1"	: 'What is the range of possible sizes for side x?',
		"question2"	: 'two <em>exact</em> decimals, like <code>0.75</code>',
		"question3"	: 'Can this triangle exist?',
		"question4"	: 'Yes',
		"question5"	: 'No',
		
		"hint1"		: 'The triangle inequality theorem states that any side of a triangle is always shorter than the sum of the other two sides.',
		"hint2"		: 'Therefore the the third side must be less than <code><var>KNOWN[ 0 ]</var> + <var>KNOWN[ 1 ]</var> = <var>MAX</var></code>',
		"hint3"		: 'By the same theorem, the third side must be also larger than the difference between the other two sides.',
		"hint4"		: 'Therefore the third side must be larger than <code><var>KNOWN[0] &lt; KNOWN[1] ? KNOWN[1] : KNOWN[0]</var> - <var>KNOWN[0] &lt; KNOWN[1] ? KNOWN[0] : KNOWN[1]</var> = <var>MIN</var></code>',
		"hint5"		: 'So <code><var>MIN</var> &lt; x &lt; <var>MAX</var></code>',
		"hint6"		: 'Triangle inequality theorem states that a side must be smaller than the sum of the other two sides.',
		"hint7"		: "Let's check for all three sides:",
		"hint8"		: 'All three sides conform to the inequality theorem, so this triangle can exist.',
		"hint9"		: 'Not all three sides conform to the inequality theorem, so this triangle cannot exist.'
		}
})