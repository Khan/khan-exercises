({
	"nl" : {
		"question1"	: 'Gebruik de infographic om onderstaande vraag te beantwoorden:',
		"question2"	: ' <i>badges</i> verdiend  per student',
		"question3"	: 'Wie heeft de meeste <var>BADGE</var> badges verdiend?',
		"question4"	: 'Wie heeft de minste <var>BADGE</var> badges verdiend?',
		"question5"	: 'Hoeveel <var>BADGE</var> badges heeft <var>person( PERSON + 1 )</var> verdiend?',
		"hint1"		: 'Wie heeft de meeste <var>BADGE</var> symbolen naast <var>his( MOST + 1 )</var> naam staan?',
		"hint2"		: '<var>person( MOST + 1 )</var> heeft de meeste symbolen naast <var>his( MOST + 1)</var> naam staan.',
		"hint3"		: '<var>person( MOST + 1 )</var> heeft de meeste <var>BADGE</var> badges verdiend.',
		"hint4"		: 'Wie heeft de minste <var>BADGE</var> symbolen naast <var>his( LEAST + 1 )</var> naam staan?',
		"hint5"		: '<var>person( LEAST + 1 )</var> heeft de minste symbolen naast <var>his( LEAST + 1)</var> naam staan.',
		"hint6"		: '<var>person( LEAST + 1 )</var> heeft de minste <var>BADGE</var> badges verdiend.',
		"hint7"		: 'Onderaan de infographic staat dat elk symbool een aantal van <var>plural( VALUE_PER_IMG, "badge" )</var> vertegenwoordigd.',
		"hint8"		: "Kijk naar de rij van <var>person( PERSON + 1 )</var> in de tabel: "+
					'<div class="fake_row">'+
						'<span><var>person( PERSON + 1 )</var></span><span data-each="DATA[ PERSON ] times"><var>FULL_IMAGE</var> '+
						'</span><span data-each="(8 - DATA[ PERSON ]) times">&nbsp;</span> '+
					'</div>',
		"hint9"		: 'There <var>plural( "is", DATA[PERSON] )</var> <var>plural( DATA[ PERSON ], "symbol" )</var>.',
		"hint10"	: 'person( PERSON + 1 )</var> heeft <code><var>ANSWER</var></code> <var>BADGE</var> <var>plural( "badge", ANSWER )</var> verdiend.'
		}
})