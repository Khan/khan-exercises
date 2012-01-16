({
	"nl" : {
		"vars1"		: 	'<var id="ROWS">[ [ school(1), school(2), school(3), school(4) ], [ person(1), person(2), person(3), person(4) ], [ person(1), person(2), person(3), person(4) ], [ "Drenthe", "Groningen", "Friesland", "Utrecht" ] ][ INDEX ]</var>',
					:	'<var id="COLUMNS">[ [ "Groep 6", "Groep 7", "Groep 8", "Totaal" ], [ "Januari", "Februari", "Maart", "Totaal" ], [ "1e kwart", "2e kwart", "3e kwart", "4e kwart", "Totaal" ], [ "Q1", "Q2", "Q3", "Q4", "Totaal" ] ][ INDEX ]</var>',
					:	'<var id="COL_INDEX">randRange( 0, COLUMNS.length - 1 )</var>',
					:	'<var id="ROW_INDEX">randRange( 0, ROWS.length - 1 )</var>',
					:	'<var id="ENROLLMENTS, ANSWER">',
					:	'<var id="PROBLEM">[ "toont het aantal leerlingen in groep 6 t/m 8 op vier basisscholen", "toont het aantal kippen dat van januari t/m maart is verkocht door vier vrienden", "geeft het aantal punten aan dat door vier spelers is gescoord in een basketball wedstrijd", "toont het aantal in het afgelopen jaar ge&iuml;nstalleerde zonnepanelen per provincie" ][ INDEX ]</var>',
					:	'<var id="HEADER">[ "Scholen", "Boeren", "Spelers", "Provincies" ][ INDEX ]</var>',
					:	'<var id="UNIT">[ "leerlingen", "kippen", "punten", "zonnepanelen" ][ INDEX ]</var>',
					:	'<var id="HINT1">'+
									'(function() {'+
										'if ( COL_INDEX === COLUMNS.length - 1 ) {'+
										'return [ "het totale aantal leerlingen in de bovenbouw van " + ROWS[ ROW_INDEX ] + " ", "het totale aantal kippen verkocht door " + ROWS[ ROW_INDEX ], "Het totale aantal punten gescoord door " + ROWS[ ROW_INDEX ], "het totale aantal ge&iuml;nstalleerde zonnepanelen in " + ROWS [ ROW_INDEX ] ][ INDEX ];'+
									'} else {'+
									'return [ "het aantal leerlingen in " + COLUMNS[ COL_INDEX ] + " op de  " + ROWS[ ROW_INDEX ], "het aantal kippen in " + COLUMNS[ COL_INDEX ] + " verkocht door " + ROWS[ ROW_INDEX ], "het aantal punten gescoord in het " + COLUMNS[ COL_INDEX ] + " door " + ROWS[ ROW_INDEX ], "het aantal in " + COLUMNS[ COL_INDEX ] + " ge&iuml;nstalleerde zonnepanelen in " + ROWS[ ROW_INDEX ] ][ INDEX ];'+
								'}'+
							'})()'+
						'</var>'+
					:	'<var id="HINT2">[ "Het totale aantal leerlingen op de " + ROWS[ ROW_INDEX ], "Het totale aantal kippen verkocht door " + ROWS[ ROW_INDEX ], "Het totale aantal punten gescoord door " + ROWS[ ROW_INDEX ], "Het totale aantal ge&iuml;nstalleerde zonnepanelen in " + ROWS [ ROW_INDEX ] ][ INDEX ]</var>',
		"hint1"		: 'Onderstaande tabel toont <var>PROBLEM</var>, maar 1 waarde ontbreekt.',
		"hint2"		: 'Welk getal moet op de lege plaats in de tabel?',
		"hint3"		: 'In de tabel ontbreekt <var>HINT1</var>.',
		"hint4"		: 'In de tabel staan <span class="hint_orange"><var>ENROLLMENTS[ ROW_INDEX ].slice( 0, COL_INDEX ).join( "+" )</var></span> <var>UNIT</var>.',
		"hint5"		: '<var>HINT2</var> is gewoon de optelsom daarvan, oftewel <span class="hint_pink"><var>ANSWER</var></span>.',
		"hint6"		: 'In de tabel staan al <span class="hint_orange"><var>ENROLLMENTS[ ROW_INDEX ].slice( 0, COL_INDEX ).concat( ENROLLMENTS[ ROW_INDEX ].slice( COL_INDEX + 1, COLUMNS.length - 1 ) ).join( "+" )</var> ='+
                    '<var>ENROLLMENTS[ ROW_INDEX ][ COLUMNS.length - 1 ] - ANSWER</var></span> <var>UNIT</var>.',
		"hint7"		: 'Het ontbrekende getal is het verschil tussen <var>HINT2.slice( 0, 1 ).toLowerCase() + HINT2.slice( 1 )</var>, <span class="hint_blue"><var>ENROLLMENTS[ ROW_INDEX ][ COLUMNS.length - 1 ]</var></span>, en de waarden die al in de tabel staan, <span class="hint_orange"><var>ENROLLMENTS[ ROW_INDEX ][ COLUMNS.length - 1 ] - ANSWER</var></span>.'
		}
})