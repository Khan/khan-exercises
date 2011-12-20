({
	"nl" : {
		"exercise1"		: 'function(){ '+
						'var trB = new Triangle( [0,0],[], 3, {}, [ TR_A.points[ 0 ], TR_A.points[ 1 ], POINT_D ] ); '+
						'trB.labels = { "angles" : clearArray( trB.niceAngles, [ 0 ] ), "sides" : mergeArray( clearArray( trB.niceSideLengths, SIDES_B[ 0 ] ), clearArray( [ "?", "?", "?" ], SIDES_B[ 1 ] ) ),  "points": [ "A", "B", "D" ] };'+
						'return trB;'+
						'}()',
		"exercise2"			: 'function(){ '+
						'var trC = new Triangle( [0,0],[], 3, {}, [ TR_A.points[ 0 ], POINT_D, TR_A.points[ 2 ] ] );'+
						'trC.labels = { "angles" : clearArray( trC.niceAngles, [ 0 ] ) , "sides" :  mergeArray( clearArray( trC.niceSideLengths, SIDES_C[ 0 ] ), clearArray( [ "?", "?", "?" ], SIDES_C[ 1 ] ) ),  "points": [ "", "", "C" ] };'+
						'return trC; '+
						'}()',
		"exercise3"			: 'Hoe lang is de zijde AC?',
		"hint1"			: 'Angles <code>DAB</code> and <code>DAC</code> are equal.',
		"hint2"			: 'Therefore <code>AD</code> is the bisector of <code>CAB</code>',		
		"hint3"			: 'Angle Bisector Theorem states that <code>\dfrac{ AB }{ BD }	= \dfrac{ AC }{ CD }</code>'
		}
})