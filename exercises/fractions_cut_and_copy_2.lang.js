({
	"nl" : {
		"question1"	: 'The starting block below is <code><var>CODE_PARENT</var></code> units long. Use the tools to the right to convert the starting block into both of the goal blocks that are <code><var>CODE_OFFSPRING_1</var></code> units long and <code><var>CODE_OFFSPRING_2</var></code> units long. You can see your progress as the current blocks.',
	
		"span1"		: 'Cut Starting Block into',
		"span2"		: '1 piece',
		"span3"		: 'Copy Current Block 1',
		"span4"		: '1 time',
		"span5"		: 'Copy Current Block 2',
		"span6"		: '1 time'
		
		"hint1"		: 'Starting Block:',
		"hint2"		: 'Current Block 1:',
		"hint3"		: 'Goal Block 1:',
		"hint4"		: 'Current Block 2:',
		"hint5"		: 'Goal Block 2:',
		"hint6"		: 'The goal block 1 of length <code><var>CODE_OFFSPRING_1</var></code> units can be rewritten as <code><var>fraction( N_OFFSPRING_1, D_OFFSPRING_1 )</var></code>.',
		"hint7"		: 'The goal block 1 of length <code><var>CODE_OFFSPRING_2</var></code> units can be rewritten as <code><var>fraction( N_OFFSPRING_2, D_OFFSPRING_2 )</var></code>.',
		"hint8"		: 'Cutting the starting block into <code>x</code> pieces is the same as dividing it by <code>x</code>.',
		"hint9"		: 'We want to cut the starting block into a piece that can be copied into both goal block 1 and goal block 2.',
		"hint10"	: 'The least common denominator of <code><var>D_OFFSPRING_1</var></code> and <code><var>D_OFFSPRING_2</var></code> (the denominators of the goal blocks) is <code><var>LCM</var></code>. Therefore you can copy a block <code>\dfrac{1}{<var>LCM</var>}</code> units long to make both goal blocks.',
		"hint11"	: 'To find the number of slices to cut the starting block into we solve for <code>s</code> in the following equation:',
		"hint12"	: 'We now have a resulting block that is <code>\dfrac{1}{<var>LCM</var>}</code> units long. Now we simply divide our goal blocks by this value to see how many times we need to copy the resulting block.',
		"hint13"	: 'Therefore the solution is to cut the starting block into <code><var>SLICES</var></code> pieces, copy current block 1 <code><var>N_OFFSPRING_1 * LCM / D_OFFSPRING_1</var></code> times and current block 2 <code><var>N_OFFSPRING_2 * LCM / D_OFFSPRING_2</var></code> times.</strong>'
		}
})