({
	"nl" : {
		"question1"	: 'Is deze driehoek gelijkzijdig, gelijkbenig of ongelijkzijdig?',
			"vars1"	: '<var id="TYPES">[ "Equilateral", "Isosceles", "Scalene" ]</var>'+
			'<var id="TYPE">randFromArray( TYPES )</var>'+
			'<var id="TRIANGLE">function(){'+
								'if ( TYPE === "Equilateral" ){'+
									'return eqTriangle();'+
								'}'+
								'if ( TYPE === "Isosceles" ){'+
									'return isoTriangle();'+
								'}'+
								'if ( TYPE === "Scalene" ){'+
									'return scTriangle();'+
								'}'+
							'}()'+ 
			'</var>',
		
		"hint1"		: 'We weten al twee hoeken van deze driehoek, dus we kunnen de derde hoek berekenen door af te trekken van <code>180</code>',
		"hint2"		: 'Omdat alledrie de hoeken verschillend zijn, is deze driehoek ongelijkzijdig.',
		"hint3"		: 'Twee hoeken zijn gelijk, dus daarom zijn twee zijden ook gelijk. Daarom is deze driehoek gelijkbenig. Gelijkbenig betekent een driehoek met twee dezelfde zijden.',
		"hint4"		: 'Alle hoeken zijn 60 graden. Dat betekent dat alle zijden gelijk zijn en dan noemen we een driehoek gelijkzijdig.',
		"hint5"		: 'Omdat alle zijden verschillend zijn, is deze driehoek ongelijkzijdig.',
		"hint6"		: 'Twee zijden zijn gelijk, daarom is deze driehoek gelijkbenig. Gelijkbenig betekent een driehoek met twee dezelfde (Gelijk) zijden (benig).',
		"hint7"		: 'Alle zijden zijn gelijk. Dat betekent dat alle hoeken 60 graden zijn en dat de driehoek gelijkzijdig is.'
		}
})