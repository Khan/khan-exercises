({
	"nl" : {
		"array1" :	'[ [ "Noordwijkse school", "Leonardoschool", "Julianaschool", "Emmaschool" ], [ person(1), person(2), person(3), person(4) ], [ person(1), person(2), person(3), person(4) ], [ "Noord-Holland", "Zuid-Holland", "Friesland", "Utrecht" ] ][ INDEX ]',
		"array2" :	'[ [ "Groep 6", "Groep 7", "Groep 8", "Totaal" ], [ "Januari", "Februari", "Maart", "Totaal" ], [ "1e kwart", "2e kwart", "3e kwart", "4e kwart", "???" ], [ "Q1", "Q2", "Q3", "Q4", "Totaal" ] ][ INDEX ]',
		"array3" :	'[ "toont het aantal leerlingen in groep 6 t/m groep 8 op vier verschillende scholen", "toont het aantal kippen dat in januari tot en met maart is verkocht door vier boeren", "toont het aantal punten dat vier spelers scoorden in een basketbalwedstrijd", "toont het aantal ge&iuml;nstalleerde zonnepanelen per provincie in het afgelopen jaar" ][ INDEX ]',
		"array4" :	'(function() {'+
						'if ( COL_INDEX === COLUMNS.length - 1 ) {'+
						'return [ "Hoeveel leerlingen heeft de " + ROWS[ ROW_INDEX ] + " school in totaal?", "Hoeveel kippen heeft " + ROWS[ ROW_INDEX ] + " in totaal verkocht?", "Hoeveel punten heeft " + ROWS[ ROW_INDEX ] + " in totaal gescoord?", "Hoeveel zonnepanelen zijn er afgelopen jaar ge&iuml;nstalleerd in " + ROWS[ ROW_INDEX ] + "?" ][ INDEX ];'+
						'} else {'+
						'return [ "Hoeveel leerlingen uit " + COLUMNS[ COL_INDEX ] + " heeft de " + ROWS[ ROW_INDEX ] + "?", "Hoeveel kippen heeft " + ROWS[ ROW_INDEX ] + " verkocht in " + COLUMNS[ COL_INDEX ] + "?", "Hoeveel punten heeft " + ROWS[ ROW_INDEX ] + " gescoord in het " + COLUMNS[ COL_INDEX ] + "?", "Hoeveel zonnepanelen zijn er in " + ROWS[ ROW_INDEX ] + " in " + COLUMNS[ COL_INDEX ] + " ge&iuml;nstalleerd?" ][ INDEX ];'+
						'}'+
				'})()',
		"array5" :	'[ "Scholen", "Boeren", "Spelers", "Provincies" ][ INDEX ]',
		"array6" :	'[ "leerlingen", "kippen", "punten", "zonnepanelen" ][ INDEX ]',	
		"array7" :	'[ "het aantal leerlingen op de " + ROWS[ ROW_INDEX ], "het aantal door " + ROWS[ ROW_INDEX ] + "verkochte kippen", "het aantal door " + ROWS[ ROW_INDEX ] + "gescoorde punten", "het aantal ge&iuml;nstalleerde zonnepanelen in " + ROWS [ ROW_INDEX ] ][ INDEX ]</var>',
		"hint1"	 : 	'(function() {'+
						'if ( COL_INDEX === COLUMNS.length - 1 ) { '+
							'return [ "het totale aantal leerlingen op elke school", "het totale aantal kippen verkocht door elk persoon", "het totale aantal punten gescoord door elk persoon", "het totale aantal zonnepanelen ge&iuml;nstalleerd in elke provincie" ][ INDEX ];'+
						'} else {'+
							'return [ "het aantal leerlingen in  " + COLUMNS[ COL_INDEX ] + " op elke school", "het aantal verkochte kippen in " + COLUMNS[ COL_INDEX ], "het aantal gescoorde punten in het " + COLUMNS[ COL_INDEX ], "het aantal ge&iuml;nstalleerde zonnepanelen in " + COLUMNS[ COL_INDEX ] ][ INDEX ];'+
						'}'+
						'})()',
		"hint2"	 :  '[ "Er zijn " + ANSWER + " leerlingen in " + COLUMNS[ COL_INDEX ].toLowerCase() + " op de  " + ROWS[ ROW_INDEX ] + ".", ROWS[ ROW_INDEX ] + " verkocht " + ANSWER + " " + ( ANSWER === 1 ? "kip" : "kippen" ) + " in " + ( COL_INDEX === COLUMNS.length - 1 ? "total" : COLUMNS[ COL_INDEX ] )  + ".", ROWS[ ROW_INDEX ] + " scoorde " + ANSWER + " punten in " +( COL_INDEX === COLUMNS.length - 1 ? "totaal" : "het " + COLUMNS[ COL_INDEX ] )  + ".', 
		"exercise": "Onderstaande tabel <var>PROBLEM</var>.",
		"hint3"	:   "De blauwe rij toont <var>ROW_HINT</var>.",
		"hint4"	:   "De oranje kolom toont <var>COL_HINT</var>."
	}
})		