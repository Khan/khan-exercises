({
	"nl" : {
		"vars1"	: 'randFromArray([ "dier", "kleur", "fruit", "vak" ])', 
		"vars2"	: 'randFromArray([ "studenten", "docenten", "personen" ])', 
		"question1"	: '<var>TOTAL</var></code> <var>RESPONDENT</var> werd gevraagd naar hun favoriete <var>SUBJECT</var>.',
		"question2"	: 'toSentence( shuffle( jQuery.map( DATA, function( num, i ) { ' +
				' return "&lt;code&gt;" + num + "&lt;/code&gt; " + plural( RESPONDENT, num ) + " zei " + CATEGORIES[ i ];' +
			' }) ) ) ',
		"question3"	: 'Maak een staafdiagram met ieders favoriete <var>( SUBJECT )</var>: ',
		"question4"	: 'Maak een staafdiagram door de bovenkant van elke staaf omhoog en omlaag te bewegen.',
		"hint1"		: 'De top van de staaf voor "<span style="text-transform: capitalize"><var>CATEGORIES[ INDEX ]</var></span>" moet ter hoogte van het getal '+
					'<code><var>NUM</var></code> aan de linkerzijde van het diagram komen.',
		"hint2"		: 'Er moet dus geen staaf zijn boven "<span style="text-transform: capitalize"><var>CATEGORIES[ INDEX ]</var></span>". Sleep de bovenkant van de staaf helemaal '+
					'naar beneden om \'m te laten verdwijnen.',
		"hint3"	: '<code><var>NUM</var></code> <var>plural( RESPONDENT, NUM )</var> zei dat <var>CATEGORIES[ INDEX ]</var> <var>plural( randFromArray([ "zijn", "haar" ]), "hun", NUM )</var>'+
				'favoriete <var>SUBJECT</var> was.'
		}
})