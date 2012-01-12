({
	"nl" : {
		"question1"	: '{Next week|On Saturday}, <var>person(1)</var> is having a party{ and <var>he(1)</var>s planning to play <var>his(1)</var>'+
				'<var>randRange(2,30)</var> favorite songs. <var>He(1)</var> also|. <var>He(1)</var>} wants to get some hot dogs for the party. When <var>he(1)</var>'+
				'goes to the store, <var>he(1)</var> finds that hot dogs come in packages of <var>A</var> and buns come in packages of <var>B</var>.',
		"question2"	: 'If <var>person(1)</var> wants to have the same number of hot dogs and buns,'+
				'what is the minimum number of hot dogs <var>he(1)</var> will have to buy?',
		"question3"	: '<var>person(1)</var> is organizing a {baseball|softball} league, and <var>he(1)</var> needs to purchase jerseys and'+
				'visors for the players. Jerseys come in sets of <var>A</var>, and visors come in sets of <var>B</var>.',
		"question4"	: 'If <var>person(1)</var> wants to buy the same number of jerseys and visors,'+
				'what is the minimum number of jerseys or visors <var>he(1)</var> will have to purchase?',
		"question5"	: '<var>person(1)</var> and <var>person(2)</var> are in different <var>course(1)</var> classes at <var>school(1)</var>.'+
					'<span data-if="A > B">'+
						'<var>person(1)</var>s teacher always gives <var>plural( exam(1) )</var> with <var>A</var> questions on them while'+
						'<var>person(2)</var>s teacher gives more frequent <var>plural( exam(1) )</var> with only <var>B</var> questions.'+
					'</span>'+
					'<span data-else>'+
						'<var>person(2)</var>s teacher always gives <var>plural( exam(1) )</var> with <var>B</var> questions on them while'+
						'<var>person(1)</var>s teacher gives more frequent <var>plural( exam(1) )</var> with only <var>A</var> questions.'+
					'</span>'+
					'{<var>person(1)</var> has <var>randRange(15,40)</var> other students in <var>his(1)</var> class.'+
					'|<var>person(2)</var>s teacher also assigns <var>randRange(3,10)</var> projects per year.}',
		"question6"	: 'Even though the two classes have to take a different number of <var>plural( exam(1) )</var>, their teachers have'+
					'told them that both classes will get the same total number of <var>exam(1)</var> questions each year.',
		"question7"	: 'What is the minimum number of <var>exam(1)</var> questions <var>person(1)</var>s or <var>person(2)</var>s class'+
				'can expect to get in a year?',
		"question8"	: 'At a track and field competition, there are <var>A</var> sprinters and <var>B</var> long-distance'+
					'runners{ and <var>randRange(5,100)</var> fans|}. <var>person(1)</var> has to assign all of the athletes'+
					'to teams. <var>He(1)</var> wants to make sure all of the teams have the same number of sprinters and'+
					'the same number of long-distance runners.',
		"question9"	: '<strong>What is the greatest number of teams <var>person(1)</var> can form?</strong>',
		"question10"	: 'At <var>person(1)</var>s bakery, <var>person(1)</var> bakes one batch of <var>A</var> chocolate chip cookies'+
					'and one batch of <var>B</var> oatmeal cookies each day. <var>person(1)</var> sells all <var>his(1)</var> cookies'+
					'the same day in gift baskets.',
		"question11"	: '{Because <var>his(1)</var> customers expect consistency|To keep the price the same}, <var>person(1)</var> wants'+
					'to make sure each gift basket is identical.',
		"question12"	: 'What is the greatest number of gift baskets <var>person(1)</var> can sell each day?',
		"question13"	: '<var>person(1)</var> just bought 1 package of <var>plural( A, deskItem(1) )</var> and 1 package of'+
					'<var>plural( B, deskItem(2) )</var>. <var>He(1)</var> wants to use all of the <var>plural( deskItem(1) )</var>'+
					'and <var>plural( deskItem(2) )</var> to create identical sets of office supplies for <var>his(1)</var>'+
					'{coworkers|friends|classmates}.',
		"question14"	: 'What is the greatest number of sets of office supplies <var>person(1)</var> can make?',

		
		"hint1"		: 'We know that hot dogs come in packages of <code><var>A</var></code>. Write out the first few multiples'+
						'of <code><var>A</var></code> to see the possible numbers of hot dogs <var>person(1)</var> can buy:',
		"hint2"		: 'We know that buns come in packages of <code><var>B</var></code>. Write out the first few multiples'+
						'of <code><var>B</var></code> to see the possible numbers of buns <var>person(1)</var> can buy:',
		"hint3"		: 'Since <var>person(1)</var> wants to have the same number of hot dogs and buns, look for <em>common multiples</em> where its'+
						'possible to buy the same number of hot dogs and buns:',
		"hint4"		: 'The <em>least</em> common multiple is the minimum number of hot dogs <var>person(1)</var> will have to buy to get'+
					'the same number of hot dogs and buns.',
		"hint5"		: 'To get the same number of each, <strong>the smallest amount of food <var>person(1)</var> can buy is <var>LCM</var> hot dogs and buns</strong>,'+
					'or <var>plural(LCM/A,"package")</var> of hot dogs and <var>plural(LCM/B,"package")</var> of buns.',
		"hint6"		: 'We know that jerseys come in packages of <code><var>A</var></code>. Write out the first few multiples'+
						'of <code><var>A</var></code> to see the possible numbers of jerseys <var>person(1)</var> can buy:',
		"hint7"		: 'We know that visors come in packages of <code><var>B</var></code>. Write out the first few multiples'+
						'of <code><var>B</var></code> to see the possible numbers of visors <var>person(1)</var> can buy:',
		"hint8"		: 'Since <var>person(1)</var> wants to have the same number of jerseys and visors, look for <em>common multiples</em> where its'+
						'possible to buy the same number of jerseys and visors:',
		"hint9"		: 'The <em>least</em> common multiple is the minimum number of jerseys <var>person(1)</var> will have to buy to get'+
					'the same number of jerseys and visors.',
		"hint10"	: '<code class="hint_pink"><var>LCM</var></code> is the least common multiple of <code><var>A</var></code> and <code><var>B</var></code>.',
		"hint11"		: 'To get the same number of each, <strong>the smallest number <var>person(1)</var> can buy is <var>LCM</var> jerseys and visors</strong>,'+
					'or <var>plural( LCM / A, "set" )</var> of jerseys and <var>plural( LCM / B, "set" )</var> of visors.',
		"hint12"		: 'We know that in <var>person(1)</var>s class, all the <var>plural( exam(1) )</var> have <code><var>A</var></code> questions. Write'+
						'out the first few multiples of <code><var>A</var></code> to see the possible numbers of questions'+
						'<var>person(1)</var> might have to answer over the whole year:',
		"hint13"		: 'We know that in <var>person(2)</var>s class, all the <var>plural( exam(1) )</var> have <code><var>B</var></code> questions. Write'+
						'out the first few multiples of <code><var>B</var></code> to see the possible numbers of questions'+
						'<var>person(2)</var> might have to answer over the whole year:',
		"hint14"		: 'Since <var>person(1)</var>s and <var>person(2)</var>s teachers have told them that both classes will have the same total'+
						'number of <var>exam(1)</var> questions over the whole year, look for the <em>common multiples</em> to find the possible'+
						'numbers of <var>exam(1)</var> questions they will have to answer.',
		"hint15"		: 'The <em>least</em> common multiple is the minimum number questions <var>person(1)</var> and <var>person(2)</var> might'+
					'have to answer over the year.',
		"hint16"		: '<code class="hint_pink"><var>LCM</var></code> is the least common multiple of <code><var>A</var></code> and <code><var>B</var></code>.',
		"hint17"		: 'If <var>person(1)</var>s and <var>person(2)</var>s classes get the same total number of questions,'+
					'<strong>the minimum number of <var>exam(1)</var> questions they can expect to get in a year is <var>LCM</var> questions</strong>,'+
					'or <var>plural( LCM / A, exam(1) )</var> in <var>person(1)</var>s class and <var>plural( LCM / B, exam(1) )</var> in <var>person(2)</var>s class.',
		"hint18"		: 'Lets start by just thinking about the sprinters. We can think about all the ways to divide the'+
					'<var>A</var> sprinters into equally sized teams by finding the factors of <var>A</var>.',
		"hint19"		: 'The factors of <var>A</var> are <span class="hint_blue"><var>toSentence( getFactors( A ) )</var></span> since'+
						'those are all the numbers that divide evenly into <var>A</var>.'+
						'That means we can divide the sprinters into equally sized teams in any of the following ways:',
		"hint20"	: 'Now lets think about the long-distance runners. We can also list all the ways to divide the'+
					'<var>B</var> long-distance runners into equally sized teams by finding the factors of <var>B</var>.',
		"hint21"		: 'The factors of <var>B</var> are <span class="hint_green"><var>toSentence( getFactors( B ) )</var></span> since'+
						'those are all the numbers that divide evenly into <var>B</var>.'+
						'That means we can divide the long-distance runners into equally sized teams in any of the following ways:',
		"hint22"		: 'Since each team will have sprinters and long-distance runners, compare the numbers of teams the sprinters can be divided into and'+
						'the numbers of teams the runners can be divided into to find the <em>common divisors</em>:',
		"hint23"		: 'The common divisors of <var>A</var> and <var>B</var> are <span class="hint_pink"><var>toSentence( _.intersection( A_FACTORS, B_FACTORS ) )</var></span>.'+
						'In other words, with <var>A</var> sprinters and <var>B</var> long-distance runners,'+
						'<var>person(1)</var> can make the following equal teams:',
		"hint24"		: 'We want to know the <em>greatest</em> number of equal teams <var>person(1)</var> can make, so from the common divisors above,'+
					'we want the <em>greatest common divisor</em>.',
		"hint25"		: 'Lets start by just thinking about the chocolate chip cookies. We can think about all the ways to equally'+
					'divide the <var>A</var> chocolate chip cookies into gift baskets by finding the factors of <var>A</var>.',
		"hint26"		: 'The factors of <var>A</var> are <span class="hint_blue"><var>toSentence( getFactors( A ) )</var></span> since'+
						'those are all the numbers that divide evenly into <var>A</var>.'+
						'That means we can equally divide the chocolate chip cookies into gift baskets in any of the following ways:',
		"hint27"		: '<var>plural( F, "basket" )</var> with <var>plural( A / F, "chocolate chip cookie" )</var> <var>plural( "", "each", F )</var><br />',
		"hint28"		: 'Now lets think about the oatmeal cookies. We can also list all the ways to equally divide the'+
					'<var>B</var> oatmeal cookies into gift baskets by finding the factors of <var>B</var>.',
		"hint29"		: 'The factors of <var>B</var> are <span class="hint_green"><var>toSentence( getFactors( B ) )</var></span> since'+
						'those are all the numbers that divide evenly into <var>B</var>.'+
						'That means we can equally divide the oatmeal cookies into gift baskets in any of the following ways:',
		"hint30"	: '<var>plural( F, "basket" )</var> with <var>plural( B / F, "oatmeal cookie" )</var> <var>plural( "", "each", F )</var><br />',
		"hint31"		: 'Since each gift basket will have chocolate chip and oatmeal cookies, compare the ways of dividing the chocolate chip cookies'+
						'and the ways of dividing the oatmeal cookies to find the <em>common divisors</em>:',
		"hint32"		: '<var>plural( N + 1, "basket" )</var> with <var>plural( A / ( N + 1 ), "chocolate chip cookie" )</var><br />',
		"hint33"		: '<var>plural( N + 1, "basket" )</var> with <var>plural( B / ( N + 1 ), "oatmeal cookie" )</var><br />',
		"hint34"		: 'The common divisors of <var>A</var> and <var>B</var> are <span class="hint_pink"><var>toSentence( _.intersection( A_FACTORS, B_FACTORS ) )</var></span>.'+
						'In other words, with <var>A</var> chocolate chip and <var>B</var> oatmeal cookies,'+
						'<var>person(1)</var> can make any of the following gift baskets:',
		"hint35"		: '<var>plural( F, "basket" )</var> with <var>plural( A / F, "chocolate chip cookie" )</var> and'+
							'<var>plural( B / F, "oatmeal cookie" )</var>'+
							'<br />',
		"hint36"		: 'We want to know the <em>greatest</em> number of identical gift baskets <var>person(1)</var> can make, so from the common divisors above,'+
					'we want the <em>greatest common divisor</em>.',
		"hint37"		: '<strong>The greatest number of gift baskets that <var>person(1)</var> can make each day is <var>GCD</var> baskets</strong>,'+
					'with <var>plural( A / GCD, "chocolate chip cookie" )</var> and <var>plural( B / GCD, "oatmeal cookie" )</var> per basket.',
		"hint38"		: 'Lets start by just thinking about the <var>plural( deskItem(1) )</var>. We can think about all the ways to'+
					'equally divide the <var>plural( A, deskItem(1) )</var> into sets by finding the factors of <var>A</var>.',
		"hint39"		: 'The factors of <var>A</var> are <span class="hint_blue"><var>toSentence( getFactors( A ) )</var></span> since'+
						'those are all the numbers that divide evenly into <var>A</var>.'+
						'That means we can equally divide the <var>plural( deskItem(1) )</var> into sets in any of the following ways:',
		"hint40"	: '<var>plural( F, "set" )</var> with <var>plural( A / F, deskItem(1) )</var> <var>plural( "", "each", F )</var><br />',
		"hint41"		: 'Now lets think about the <var>plural( deskItem(2) )</var>. We can also list all the ways to equally divide the'+
					'<var>plural( B, deskItem(2) )</var> into sets by finding the factors of <var>B</var>.',
		"hint42"		: 'The factors of <var>B</var> are <span class="hint_green"><var>toSentence( getFactors( B ) )</var></span> since'+
						'those are all the numbers that divide evenly into <var>B</var>.'+
						'That means we can equally divide the <var>plural( deskItem(2) )</var> into sets in any of the following ways:',
		"hint43"		: 'Since each set will have <var>plural( deskItem(1) )</var> and <var>plural( deskItem(2) )</var>, compare the'+
						'ways of dividing the <var>plural( deskItem(1) )</var> and the ways of dividing the'+
						'<var>plural( deskItem(2) )</var> to find the <em>common divisors</em>:',
		"hint44"		: '<var>plural( N + 1, "set" )</var> with <var>plural( A / ( N + 1 ), deskItem(1) )</var><br />',
		"hint45"		: '<var>plural( N + 1, "set" )</var> with <var>plural( B / ( N + 1 ), deskItem(2) )</var><br />',
		"hint46"		: 'The common divisors of <var>A</var> and <var>B</var> are <span class="hint_pink"><var>toSentence( _.intersection( A_FACTORS, B_FACTORS ) )</var></span>.'+
						'In other words, with <var>plural( A, deskItem(1) )</var> and <var>plural( B, deskItem(2) )</var>,'+
						'<var>person(1)</var> can make any of the following sets:',
		"hint47"		: '<var>plural( F, "set" )</var> with <var>plural( A / F, deskItem(1) )</var> and'+
							'<var>plural( B / F, deskItem(2) )</var>'+
							'<br />',
		"hint48"		: 'We want to know the <em>greatest</em> number of identical sets <var>person(1)</var> can make, so from the common divisors above,'+
					'we want the <em>greatest common divisor</em>.',
		"hint49"		: '<strong>The greatest number of sets of office supplies that <var>person(1)</var> can make is <var>GCD</var> sets</strong>,'+
					'with <var>plural( A / GCD, deskItem(1) )</var> and <var>plural( B / GCD, deskItem(2) )</var> each.',
		"hint50"		: '<var>LCM</var></code> is the least common multiple of <code><var>A</var></code> and <code><var>B</var></code>.',
		"hint51"		: '<var>plural( F, "team" )</var> with <var>plural( A / F, "sprinter" )</var> <var>plural( "", "each", F )</var><br />',
		"hint52"		: '<var>plural( F, "team" )</var> with <var>plural( B / F, "long-distance runner" )</var> <var>plural( "", "each", F )</var><br />',
		"hint57"		: '<var>plural( F, "set" )</var> with <var>plural( B / F, deskItem(2) )</var> <var>plural( "", "each", F )</var><br />',
		"hint53"		: '<var>plural( N + 1, "team" )</var> with <var>plural( A / ( N + 1 ), "sprinter" )</var><br />',
		"hint54"		: '<var>plural( N + 1, "team" )</var> with <var>plural( B / ( N + 1 ), "long-distance runner" )</var><br />',
		"hint55"		: '<var>plural( F, "team" )</var> with <var>plural( A / F, "sprinter" )</var> and'+
							'<var>plural( B / F, "long-distance runner" )</var>'+
							'<br />',
		"hint56"		: '<strong>The greatest number of teams that <var>person(1)</var> can form is <var>GCD</var> teams</strong>,'+
					'with <var>plural( A / GCD, "sprinter" )</var> and <var>plural( B / GCD, "long-distance runner" )</var> per team.',
		}
})