({
	"nl" : {
		"hint 1.1" : 'label( [ 0, B - 1 ], "\\\\text{Teken " + plural( A, "cirkel" ) + ".}", "right" ); drawRow( A, B - 3, "#6495ED", 1 );',
		"hint 1.2" : 'label( [ 0, B - 2 ], "\\\\text{"+ "Als er " + B + ( B === 1 ? " rij is " : " rijen zijn " )+ " met " +  ( B === 1 ? " " : " elk " )+ plural( A, "cirkel" )  + ", hoeveel cirkels zijn er dan in totaal?"+ "}","right" );for ( var i = 1; i &lt; B; i++ ) {drawRow( A, B - 3 - i, "#28AE7B", A * i + 1 );}',
		"hint 2" : 'label( [ 0, B - 1 ], "\\large{\\text{Elk getal keer 0 is 0.}}", "right" );',
	}
})