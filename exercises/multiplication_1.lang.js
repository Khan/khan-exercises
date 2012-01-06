({
	"nl" : {
		"exercise"	: 'label( [ 0, B - 1 ], "\\\\text{Teken " + plural( A, "cirkel" ) + ".}", "right" );'+
						'drawRow( A, B - 3, "#6495ED", 1 );',
		"hint1"	: 'label( [ 0, B - 2 ], "\\\\text{" '+
						'	+ "Als er " + plural( B, "rij" ) + ( B === 1 ? " is " : " zijn " ) '+
						'	+ " met " +  ( B === 1 ? " " : " elk " ) + plural( A, "cirkel" ) '+
						'	+ ", hoeveel cirkels zijn er dan totaal?"'+
						'	+ "}",'+
						'	"right" );'+
						'for ( var i = 1; i &lt; B; i++ ) {'+
						'	drawRow( A, B - 3 - i, "#28AE7B", A * i + 1 );'+
						'}',
		"hint2"	:	'label( [ 0, B - 1 ], "\\\\large{\\\\text{Een getal vermenigvuldigen met 0 geeft altijd een uitkomst van 0.}}", "right" );'
	}
})

