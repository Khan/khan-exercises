({
	"nl" : {
		"question1"	: 'Hoeveel <var>BADGE</var> badges heeft <var>person( PERSON + 1 )</var> verdiend?',
		"question2"	: 'Wie heeft <code><var>VALUE</var></code> <var>BADGE</var> <var>plural( "badge", VALUE )</var> verdiend?',
		"question3"	: 'Hoeveel <var>BADGE</var> badges heeft <var>person( PERSON1 + 1 )</var> meer verdiend dan <var>person( PERSON2 + 1 )</var>?',
		"question4"	: 'Hoeveel <var>BADGE</var> badges zijn er totaal verdiend?',
		
		"span1"		: '<span style="text-transform:capitalize"><var>BADGE</var></span> badges verdiend per student',
		
		"problem1"	: 'Gebruik de infographic om onderstaande vraag te beantwoorden:',
		
		"hint1"		: 'Onderaan de infographic staat dat elk volledige afbeelding  <var>plural( VALUE_PER_IMG, "badge" )</var> vertegenwoordigt.',
		"hint2"		: 'Zoek de rij van <var>person( PERSON + 1 )</var> op in de tabel: '+
					  '<div class="fake_row"> '+
					  '<span><var>person( PERSON + 1 )</var></span><span data-each="DATA[ PERSON ] times"><var>FULL_IMAGE</var> '+
					  '</span><span data-if="HALF[ PERSON ]"><var>HALF_IMAGE</var> '+
					  '</span><span data-else></span><span data-each="(7 - DATA[ PERSON ]) times">&nbsp;</span> '+
					  '</div>',
		"hint3"		: 'Er <var>plural( "is", "zijn", DATA[PERSON] ) </var> <var>DATA[ PERSON ]</var> volledige <var>plural( "afbeelding", "afbeeldingen", DATA[ PERSON ])</var><span data-if="HALF[ PERSON ]"> en 1 halve afbeelding</span>. '+
					  '<span data-if="HALF[ PERSON ]">De volledige afbeeldingen vertegenwoordigen <var>plural( VALUE_PER_IMG, "badge" )</var>, dus een halve afbeelding vertegenwoordigt <var>plural( VALUE_PER_IMG/2, "badge" )</var>.</span> ',
		"hint4"		: '<code><var>DATA[ PERSON ]</var></code> <var>plural( "afbeelding", "afbeeldingen", DATA[ PERSON ] )</var> '+
					  '<code> \\times </code> <code><var>VALUE_PER_IMG</var></code> <var>plural( "badge", VALUE_PER_IMG )</var> per afbeelding <code> = <var>DATA[ PERSON ] * VALUE_PER_IMG</var></code> '+
					  '<var>plural( "badge", DATA[ PERSON ] * VALUE_PER_IMG )</var>. '+
					  '<span data-if="HALF[ PERSON ]"> '+
					  '<br /><code>1</code> halve afbeelding <code> \\times <var> VALUE_PER_IMG/2 </var></code> <var>plural( "badge", VALUE_PER_IMG / 2 )</var> per halve afbeelding <code> = <var>VALUE_PER_IMG / 2</var></code> '+
					  '<var>plural( "badge", VALUE_PER_IMG / 2 )</var>.</span>',
		"hint5"		: '<var>person( PERSON + 1 )</var> heeft <code><var>ANSWER</var></code> <var>BADGE</var> <var>plural( "badge", ANSWER )</var> verdiend.',
		"hint6"		: 'Onderaan de infographic staat dat elke volledige afbeelding <var>plural( VALUE_PER_IMG, "badge" )</var> vertegenwoordigt.',
		"hint7"		: 'Hoeveel afbeeldingen zijn er nodig om <code><var>VALUE</var></code> <var>plural( "badge", VALUE )</var> weer te geven?',
		"hint7.1"		: '<code>'+
						'\\dfrac{<var>VALUE</var> \\text{ <var>plural( "badge", VALUE )</var>}}{<var>VALUE_PER_IMG</var> \\text{ <var>plural( "afbeelding", "afbeeldingen", VALUE_PER_IMG )</var> per badge}} = '+
						'<var>NUM_SYMBOLS</var> \\text{ <var>plural( "afbeelding", "afbeeldingen", VALUE / VALUE_PER_IMG )</var>} '+
					'</code>',
		"hint8"		: 'Wie heeft <code><var>NUM_SYMBOLS</var></code> <var>plural( "afbeelding", "afbeeldingen", VALUE / VALUE_PER_IMG )</var> achter <var>his( PERSON + 1 )</var> naam staan? '+
					  '<div class="fake_row">'+
					  '<span>???</span><span data-each="DATA[ PERSON ] times"><var>FULL_IMAGE</var> '+
					  '</span><span data-if="HALF[ PERSON ]"><var>HALF_IMAGE</var>'+
					  '</span><span data-else></span><span data-each="(7 - DATA[ PERSON ]) times">&nbsp;</span></div>',
		"hint9"		: '<var>person( PERSON + 1 )</var> heeft <code><var>NUM_SYMBOLS</var></code> <var>plural( "afbeelding", "afbeeldingen", VALUE / VALUE_PER_IMG )</var> achter <var>his( PERSON + 1 )</var> naam staan.',
		"hint10"	: '<var>person( PERSON + 1 )</var> heeft <code><var>VALUE</var></code> <var>BADGE</var> <var>plural( "badge", VALUE )</var> verdiend.',
		"hint11"	: 'Zoek de rij van <var>person( PERSON1 + 1 )</var> en van <var>person( PERSON2 + 1 )</var> op in de tabel: '+
					  '<div class="fake_row"> '+
					  '<span><var>person( PERSON1 + 1 )</var></span><span data-each="DATA[ PERSON1 ] times"><var>FULL_IMAGE</var> '+
					  '</span><span data-if="HALF[ PERSON1 ]"><var>HALF_IMAGE</var> '+
					  '</span><span data-else></span><span data-each="(7 - DATA[ PERSON1 ]) times">&nbsp;</span> '+
					  '</div>'+
					  '<div class="fake_row">'+
					  '<span><var>person( PERSON2 + 1 )</var></span><span data-each="DATA[ PERSON2 ] times"><var>FULL_IMAGE</var> '+
					  '</span><span data-if="HALF[ PERSON2 ]"><var>HALF_IMAGE</var> '+
					  '</span><span data-else></span><span data-each="(7 - DATA[ PERSON2 ]) times">&nbsp;</span> '+
					  '</div>',
		"hint12"	: '<var>person( PERSON1 + 1 )</var> heeft <code><var>PRETTY_SYM_DIFF</var></code> <var>plural( "afbeelding", "afbeeldingen", SYMBOL_DIFF )</var> meer achter  <var>his( PERSON1 + 1 )</var> naam staan dan <var>person( PERSON2 + 1 )</var>.',
		"hint13"	: '<code><var>PRETTY_SYM_DIFF</var></code> <var>plural( "afbeelding", "afbeeldingen", SYMBOL_DIFF )</var>'+
					  '<code> \\times </code> <code><var>VALUE_PER_IMG</var></code> <var>plural( "badge", VALUE_PER_IMG )</var> per afbeelding <code> = <var>VAL1 - VAL2</var></code> '+
					  '<var>plural( "badge", VAL1 - VAL2 )</var>.',
		"hint14"	: '<var>person( PERSON1 + 1 )</var> heeft <code><var>VAL1 - VAL2</var></code> <var>BADGE</var> <var>plural( "badge", VAL1 - VAL2 )</var> meer dan <var>person( PERSON2 + 1 )</var>.',
		"hint15"	: 'Tel alle <var>BADGE</var> afbeeldingen.',
		"hint16"	: 'Er zijn <code><var>FULL_SYM</var></code> afbeeldingen<span data-if="HALF_SYM !== 0"> en <code><var>HALF_SYM</var></code> halve afbeeldingen</span>.',
		"hint17"	: 'Elke afbeelding staat voor <code><var>VALUE_PER_IMG</var></code> <var>BADGE</var> <var>plural( "badge", VALUE_PER_IMG )</var><span data-if="HALF_SYM !== 0"> en elke halve afbeelding vertegenwoordigt <code><var>VALUE_PER_IMG / 2</var></code> <var>BADGE</var> <var>plural( "badge", VALUE_PER_IMG / 2 )</var></span>.',
		"hint18"	: '<code><var>FULL_SYM</var></code> <var>plural( "afbeelding", "afbeeldingen", FULL_SYM )</var>'+
					  '<code> \\times </code> <code><var>VALUE_PER_IMG</var></code> <var>plural( "badge", VALUE_PER_IMG )</var> per afbeelding <code> = <var>FULL_SYM * VALUE_PER_IMG</var></code> '+
					  '<var>plural( "badge", FULL_SYM * VALUE_PER_IMG )</var>.'+
					  '<span data-if="HALF_SYM"> '+
					  '<br /><code><var>HALF_SYM</var></code> halve <var>plural( "afbeelding", "afbeeldingen", HALF_SYM )</var> '+
					  '<code> \\times  <var> VALUE_PER_IMG/2 </var></code> <var>plural( "badge", VALUE_PER_IMG / 2 )</var> per halve afbeelding <code> = <var>HALF_SYM * VALUE_PER_IMG / 2</var></code> '+
					  '<var>plural( "badge", HALF_SYM * VALUE_PER_IMG / 2 )</var>.</span>',
		"hint19"	: 'Alles bij elkaar zijn er <code><var>TOTAL</var></code> <var>BADGE</var> <var>plural( "badge", TOTAL )</var> verdiend.'
		}
})