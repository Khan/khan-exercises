({
	"nl" : {
		"exercise1"	: '{This afternoon, an outdoor temperature had a reading of|On a cold February afternoon, the temperature outside was} <var>abs( X )</var> degrees below zero. {By evening, the temperature had dropped by|In the evening, you take a quick look at the thermometer, and see that the temperature had dropped by} <var>Y</var> degrees.',
		"exercise2"	: 'What was the temperature in the evening?',
		"exercise3"	: '<var>Z</var></span> degrees',
		"exercise4"	: '{When <var>person( 1 )</var> went outside to go sledding in the morning|As <var>person( 1 )</var> prepared for <var>his( 1 )</var> daily sledding practice}, <var>he( 1 )</var> {looked at the thermometer and saw|heard on the radio} that the temperature was <var>abs( X )</var> degrees below zero. {After sledding for <var>plural( randRange( 1, 8 ), "hour" )</var>,|After a long day of sledding <var>he( 1 )</var> saw that} the temperature was now <var>Z</var> degrees.',
		"exercise5"	: 'By how many degrees had the temperature increased?',
		"exercise6"	: '<span class="sol" data-forms="integer"><var>Y</var></span> degrees',
		"exercise7"	: '<var>person( 1 )</var> was scuba diving <var>X</var> meters below sea level when <var>he( 1 )</var> spotted a beautiful fish below. {From a distance, the fish looked to be about <var>randRange( 25, 35 )</var> cm wide. |}{To take a proper photograph|To see the fish up close}, <var>person( 1 )</var> dove <var>Y</var> meters until <var>he( 1 )</var> was level with the fish, staring into its eyes.',
		"exercise8"	: 'Where was the fish relative to sea level?',
		"exercise9"	: '<span class="sol" data-forms="integer"><var>Z</var></span> meters',
		"exercise10"	: 'A spinner dolphin jumped from <var>X</var> meters below sea level and flipped through the air at <var>Y</var> meters above sea level. {The jump itself took about 1.<var>randRange( 1, 9 )</var> seconds.|}',
		"exercise11"	: 'How many meters did the dolphin travel to reach the highest point of the jump?',
		"exercise12"	: '<span class="sol" data-forms="integer"><var>Z</var></span> meters',		
		"exercise13"	: 'person( 1 )</var> received a loan of $<var>commafy( X )</var> from the bank to start a baseball camp. <var>person( 1 )</var> used the loan to buy baseball bats, mitts, baseballs, and water bottles and to pay the coaches� salaries. Over the course of the summer, <var>N</var> campers attended <var>person( 1 )</var>�s baseball camp, and each camper paid a fee of $<var>COST</var> to attend. <var>person( 1 )</var> used all of the money from the campers� fees to start paying back the loan.',
		"exercise14"	: 'At the end of the summer what was <var>person( 1 )</var>'s net worth?',
		"hint1"		: '<code><var>abs( X )</var></code> degrees below zero is the same as <code><var>X</var>^{\circ}</code>.',
		"hint2"		: 'Since the temperature dropped by <code><var>Y</var>^{\circ}</code>, subtract this amount from the afternoon temperature.',
		"hint3"		: 'The temperature in the evening was <code><var>Z</var>^{\circ}</code>.',
		"hint4"		: '<code><var>abs( X )</var></code> degrees below zero is the same as <code><var>X</var>^{\circ}</code>.',
		"hint5"		: 'Change in temperature = final temperature - initial temperature',
		"hint6"		: 'Change in temperature = <code><var>Z</var>^{\circ} - (<var>X</var>^{\circ}) = <var>Z</var>^{\circ} - <var>X</var>^{\circ} = <var>Y</var>^{\circ}</code>',
		"hint7"		: 'The temperature had increased by <code><var>Y</var>^{\circ}</code>.',
		"hint8"		: '<var>person( 1 )</var> was initially <code><var>X</var></code> meters below sea level, which can be written as a negative number, <code>-<var>X</var></code> meters.',
		"hint9"		: '<var>person( 1 )</var> dove down <code><var>Y</var></code> meters, so we can subtract that distance from <var>person( 1 )</var>�s initial level to find out where the fish is.',
		"hint10"		: 'Fish�s position relative to sea level <code>=-<var>X</var>\text{ meters} - <var>Y</var>\text{ meters} = <var>Z</var>\text{ meters}</code>',
		"hint11"		: 'The dolphin was initially <var>X</var> meters below sea level, which can be written as a negative number, -<var>X</var> meters.',
		"hint12"		: 'Distance the dolphin jumped = final position - initial position',
		"hint13"		: '<code><var>Y</var>\text{ meters} - (-<var>X</var>\text{ meters}) = <var>Y</var>\text{ meters} + <var>X</var>\text{ meters} = <var>Z</var>\text{ meters}</code>',
		"hint14"		: '<var>person( 1 )</var> started out the summer with <code>$<var>commafy( X )</var></code> of debt, which can be represented as a negative number, <code>-$<var>commafy( X )</var></code>.',
		"hint15"		: 'Amount of money <var>person( 1 )</var> earned from campers = <code><var>N</var> \times $<var>COST</var>=$<var>commafy(  Y )</var></code>',
		"hint16"		: 'debt + earnings = <var>person( 1 )</var>'s account balance',
		"hint17"		: '<code>-$<var>commafy( X )</var> + $<var>commafy( Y )</var> = -$<var>commafy( Z )</var></code>'
		}
})