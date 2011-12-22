({
	"nl" : {
		"exersice1"	: 'What time is it?',
		"exersice2"	: 'The time is <span class="sol"><var>HOUR</var></span> : <span class="sol"><var>NICE_MINUTE</var></span> <var>AM_PM</var>',
		"exersice3"	: 'a 12-hour time in hours and minutes',
		"hint1"		: 'The small hand is for the hour, and the big hand is for the minutes.',
		"hint2"		: ' The hour hand is pointing at <code><var>HOUR</var></code>, so the hour is <code><var>HOUR</var></code>.',
		"hint3"		: 'The hour hand is between <code><var>HOUR</var></code> and <code><var>HOUR + 1 === 13 ? 1 : HOUR + 1</var></code>, so the hour is <code><var>HOUR</var></code>.',
		"hint4"		: "The hour hand is close to but hasn't passed <code><var>HOUR + 1 === 13 ? 1 : HOUR + 1</var></code>, so the hour is still <code><var>HOUR</var></code>.",
		"hint5"		: 'The minute hand starts pointing straight up for <code>0</code> minutes, and makes a complete circle in <code>1</code> hour.',
		"hint6"		: 'For each quarter of the circle that the minute hand passes, add <code>15</code> minutes.',
		"hint7"		: 'The minute hand has passed <var>plural( MINUTE / 15, "fourth" )</var> of a circle, which represents <span data-if="MINUTE === 0"><code>0</code></span><span data-else><code><var>MINUTE</var></code></span> minutes.',
		"hint8"		: "The time is <code><var>HOUR</var></code>:<code><var>NICE_MINUTE</var></code>."
		}
})