({
	"nl" : {
		"question1"	: 'How many people went to <var>person( 1 )</var> his/her birthday party?',
		"question2"	: 'How much money did <var>person( 1 )</var> spend?',
		"question3"	: 'How much money did <var>person( 1 )</var> spend on canned food?',
		"question4"	: 'How many gallons of gas were left in the tank?',
		"question5"	: 'How many adults were at the picnic?',
		"question6"	: 'How many cups of chocolate chips did <var>person(1)</var> need in total?',
		"question7"	: '',
		
		"problem1"	: '<var>person( 1 )</var> invited <var>INVITEES</var> friends to <var>his( 1 )</var> birthday party. Some people had other plans and could not attend, but <code>\frac{<var>N</var>}{<var>D</var>}</code> of the people <var>person( 1 )</var> invited were able to attend.',
		"problem2"	: 'After saving up for a while, <var>person( 1 )</var> had $<var>AMOUNT</var>.00 in <var>his( 1 )</var> piggy bank, and <var>he( 1 )</var> spent <code>\frac{<var>N</var>}{<var>D</var>}</code> of that money on books at the bookstore.',
		"problem3"	: 'Every day <var>person( 1 )</var> put the extra change from <var>his( 1 )</var> pockets into a glass jar. After <var>randRange( 10, 30 )</var> weeks, <var>he( 1 )</var> had saved up $<var>AMOUNT</var>.00. <var>person( 1 )</var> decided to use <code>\frac{<var>N</var>}{<var>D</var>}</code> of the money from the jar to buy canned food for a homeless shelter.',
		"problem4"	: 'Before leaving on a road trip, <var>person( 1 )</var> filled up <var>his( 1 )</var> gas tank, which holds <var>GALLONS</var> gallons of gas. After <var>0.5 * randRange( 3 / 0.5, 10 / 0.5 )</var> hours, <var>person( 1 )</var> noticed that the gas tank was <code>\frac{<var>N</var>}{<var>D</var>}</code> full.',
		"problem5"	: '<var>ATTENDEES</var> people had a picnic in the park. <code>\frac{<var>N</var>}{<var>D</var>}</code> of the people at the picnic were adults.',
		"problem6"	: '<var>person(1)</var> decided to bake cookies for the school bake sale. <var>He(1)</var> found a recipe that called for <code>\frac{<var>N</var>}{<var>D</var>}</code> of a cup of chocolate chips.',
		"problem7"	: 'To have enough cookies for the bake sale, <var>person(1)</var> needed to make <var>BATCHES</var> batches of cookies.',
		
		"hint1"		: 'We need to figure out what <code>\dfrac{<var>N</var>}{<var>D</var>}</code> of <code><var>INVITEES</var></code> is to find out how many people attended the party.',
		"hint2"		: 'We can find <code>\dfrac{<var>N</var>}{<var>D</var>}</code> of <code><var>INVITEES</var></code> by multiplying <code class="hint_blue">\dfrac{<var>N</var>}{<var>D</var>}</code> and <code class="hint_orange"><var>INVITEES</var></code>.',
		"hint3"		: 'We can also visually see that <code class="hint_blue">\dfrac{<var>N</var>}{<var>D</var>}</code> of <code class="hint_orange"><var>INVITEES</var></code> is <code class="hint_green"><var>SOLUTION</var></code>:',
		"hint4"		: '<strong><var>SOLUTION</var> people attended <var>person( 1 )</var> his party.</strong>',
		"hint5"		: 'We need to figure out what <code>\dfrac{<var>N</var>}{<var>D</var>}</code> of <code>$<var>AMOUNT</var>.00</code> is to find out how much <var>person(1)</var> spent.',
		"hint6"		: 'We can find <code>\dfrac{<var>N</var>}{<var>D</var>}</code> of <code>$<var>AMOUNT</var>.00</code> by multiplying <code class="hint_blue">\dfrac{<var>N</var>}{<var>D</var>}</code> and <code class="hint_orange"><var>AMOUNT</var></code>.',
		"hint7"		: 'We can also visually see that <code class="hint_blue">\dfrac{<var>N</var>}{<var>D</var>}</code> of <code class="hint_orange"><var>AMOUNT</var></code> is <code class="hint_green"><var>SOLUTION</var></code>:',
		"hint8"		: '<strong><var>person( 1 )</var> spent $<var>SOLUTION</var>.00 on books.</strong>',
		"hint9"		: 'We need to figure out what <code>\dfrac{<var>N</var>}{<var>D</var>}</code> of <code>$<var>AMOUNT</var>.00</code> is to find out how much <var>person(1)</var> spent.',
		"hint10"	: 'We can find <code>\dfrac{<var>N</var>}{<var>D</var>}</code> of <code>$<var>AMOUNT</var>.00</code> by multiplying <code class="hint_blue">\dfrac{<var>N</var>}{<var>D</var>}</code> and <code class="hint_orange"><var>AMOUNT</var></code>.'
		"hint11"	: 'We can also visually see that <code class="hint_blue">\dfrac{<var>N</var>}{<var>D</var>}</code> of <code class="hint_orange"><var>AMOUNT</var></code> is <code class="hint_green"><var>SOLUTION</var></code>:',
		"hint12"	: '<strong><var>person( 1 )</var> spent $<var>SOLUTION</var>.00 on canned food for the homeless shelter.</strong>',
		"hint13"	: 'Since a fraction of the gas in <var>his( 1 )</var> tank was left, we just need to figure out what <code>\dfrac{<var>N</var>}{<var>D</var>}</code> of <code><var>GALLONS</var></code> gallons is to find out how much gas was left in the tank.',
		"hint14"	: 'We can find <code>\dfrac{<var>N</var>}{<var>D</var>}</code> of <code><var>GALLONS</var></code> gallons by multiplying <code class="hint_blue">\dfrac{<var>N</var>}{<var>D</var>}</code> and <code class="hint_orange"><var>GALLONS</var></code>.',
		"hint15"	: 'We can also visually see that <code class="hint_blue">\dfrac{<var>N</var>}{<var>D</var>}</code> of <code class="hint_orange"><var>GALLONS</var></code> is <code class="hint_green"><var>SOLUTION</var></code>:',
		"hint16"	: '<strong><var>person( 1 )</var> had <var>SOLUTION</var> gallons of gas left in <var>his( 1 )</var> tank when <var>he( 1 )</var> checked.</strong>',
		"hint17"	: 'We need to figure out what <code>\dfrac{<var>N</var>}{<var>D</var>}</code> of <code><var>ATTENDEES</var></code> is to find out how many people at the picnic were adults.',
		"hint18"	: 'We can find <code>\dfrac{<var>N</var>}{<var>D</var>}</code> of <code><var>ATTENDEES</var></code> by multiplying <code class="hint_blue">\dfrac{<var>N</var>}{<var>D</var>}</code> and <code class="hint_orange"><var>ATTENDEES</var></code>.',
		"hint19"	: 'We can also visually see that <code class="hint_blue">\dfrac{<var>N</var>}{<var>D</var>}</code> of <code class="hint_orange"><var>ATTENDEES</var></code> is <code class="hint_green"><var>SOLUTION</var></code>:',
		"hint20"	: '<strong><var>SOLUTION</var> people at the picnic were adults.</strong>',
		"hint21"	: 'We can multiply <code class="hint_blue">\dfrac{<var>N</var>}{<var>D</var>}</code> cup by <code class="hint_orange"><var>BATCHES</var></code> batches to find out how many cups of chocolate chips <var>person(1)</var> needed.',
		"hint22"	: '<strong><var>person(1)</var> needed <var>plural(<var>SOLUTION</var>,"cup")</var> of chocolate chips to make enough cookies for the bake sale.</strong>',
	
		}
})