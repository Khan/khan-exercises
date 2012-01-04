({
	"nl" : {
		"variables1"	: '<var id="FIRST">randRange( 1, 10 )</var>'+
							'<var id="SECOND">randRangeExclude( 1, 10, [ FIRST ] )</var>'+
							'<var id="OP, OP_WORD, ADDENDS">randFromArray( [ [ "+", "optellen", "getallen" ], [ "\\keer", "vermenigvuldigen", "factoren" ] ] )</var>'+
							'<var id="SYMBOL">binop( 1 )</var>',
		"exercise1"		: 'Welk getal kan onderstaand <code><var>SYMBOL</var></code> vervangen?',
		"exercise2"		: 'Vereenvoudig de uitdrukking.',
		"hint1"			: 'Bij <var>OP_WORD</var> maakt de volgorde van de <var>ADDENDS</var> niet uit.',
		"hint2"			: 'Kijkend naar de linkerkant:',
		"hint3"			: 'Op andere volgorde zetten van de <var>ADDENDS</var> geeft:',
		"hint4"			: 'We zien dat het op andere volgorde zetten van <var>ADDENDS</var> niet uitmaakt voor het uiteindelijke resultaat:',
		"hint5"			: 'Vergelijken met de oorspronkelijke vergelijking, zien we dat het symbool <code><var>SYMBOL</var></code> vervangen kan worden door het getal <code><var>ANSWER</var></code>.',
		"hint6"			: 'Deze wetmatigheid over <var>OP_WORD</var> staat bekend als XXXXXXXXXXX the commutative property. XXXXXXXXXXXXXXXXXXXX',
		"hint7"			: 'Bij <var>OP_WORD</var> hebben de haakjes om de <var>ADDENDS</var> geen effect op het uiteindelijke resultaat.',
		"hint8"			: 'Kijkend naar de linkerkant:',
		"hint9"			: 'Veranderen van de plaats van de haakje geeft:',
		"hint10"		: 'We zien dat het anders zetten van de haakjes geen invloed heeft op het eindresulaat:',
		"hint11"		: 'Vergelijken met de oorspronkelijke vergelijking geeft dat het symbool <code><var>SYMBOL</var></code> vervangen kan worden door het getal <code><var>ANSWER</var></code>.',
		"hint12"		: "Deze wetmatigheid over <var>OP_WORD</var> staat bekend als XXXXXXXXXXXXX associative property.XXXXXXXXXXXXXXXXXXXXXXXXXXXX"
		}
})