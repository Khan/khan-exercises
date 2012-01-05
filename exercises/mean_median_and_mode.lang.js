({
	"nl" : {
		"question1"	: 'What is the arithmetic mean of the following numbers?',
		"question2"	: 'What is the median of the following numbers?',
		"question3"	: 'What is the mode of the following numbers?',
		
		"hint1"		: 'To find the mean, add all the numbers and then divide by the number of numbers.',
		"hint2"		: 'There are <code><var>INTEGERS_COUNT</var></code> numbers.',
		"hint3"		: 'The mean is <code>\displaystyle <var>fractionSimplification( sum(INTEGERS), INTEGERS_COUNT )</var></code>.',
		"hint4"		: 'First, order the numbers, giving:',
		"hint5"		: 'Since we have <code>2</code> middle numbers, the median is the mean of <strong>those</strong> two numbers!',
		"hint6"		: "The median is the 'middle' number:",
		"hint7"		: 'The median is <code>\dfrac{<var>SORTED_INTS[ SORTED_INTS.length / 2 - 1 ]</var> + <var>SORTED_INTS[ SORTED_INTS.length / 2 ]</var>}{2}</code>.',
		"hint8"		: 'So the median is <code><var>fractionReduce(2 * MEDIAN, 2)</var></code>.',
		"hint9"		: 'Another way to find the middle number is to draw the numbers on a number line. If a number appears multiple times, count its corresponding dot multiple times.',
		"hint10"	: 'The mode is the most frequent number.',
		"hint11"	: 'We can draw a histogram to see how many times each number appears.',
		"hint12"	: 'There are more <code><var>MODE</var></code>s than any other number, so <code><var>MODE</var></code> is the mode.'
		}
})