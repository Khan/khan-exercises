({
	"nl" : {
		"vars1"		: 	'<var id="ROWS">[ [ school(1), school(2), school(3), school(4) ], [ person(1), person(2), person(3), person(4) ], [ person(1), person(2), person(3), person(4) ], [ "Alabama", "Michigan", "New York", "Wyoming" ] ][ INDEX ]</var>',
					:	'<var id="COLUMNS">[ [ "3rd grade", "4th grade", "5th grade", "Total" ], [ "January", "February", "March", "Total" ], [ "1st Quarter", "2nd Quarter", "3rd Quarter", "4th Quarter", "Final" ], [ "Q1", "Q2", "Q3", "Q4", "Total" ] ][ INDEX ]</var>',
					:	'<var id="COL_INDEX">randRange( 0, COLUMNS.length - 1 )</var>',
					:	'<var id="ROW_INDEX">randRange( 0, ROWS.length - 1 )</var>',
					:	'<var id="ENROLLMENTS, ANSWER">',
					:	'<var id="PROBLEM">[ "shows the enrollment at four different elementary schools that have 3rd through 5th grade students", "shows the number of chickens sold by four friends from January to March", "indicates the points scored by four players in a charity basketball game", "shows solar panel installations by state during the last fiscal year" ][ INDEX ]</var>',
					:	'<var id="HEADER">[ "Schools", "Farmers", "Players", "States" ][ INDEX ]</var>',
					:	'<var id="UNIT">[ "students", "chickens", "points", "solar panels" ][ INDEX ]</var>',
					:	'<var id="HINT1">'+
									'(function() {'+
										'if ( COL_INDEX === COLUMNS.length - 1 ) {'+
										'return [ "the total number of students at " + ROWS[ ROW_INDEX ] + " Elementary School", "the total number of chickens sold by " + ROWS[ ROW_INDEX ], "the total number of points scored by " + ROWS[ ROW_INDEX ], "the total number of solar panels installed in " + ROWS [ ROW_INDEX ] ][ INDEX ];'+
									'} else {'+
									'return [ "the number of " + COLUMNS[ COL_INDEX ] + " students at " + ROWS[ ROW_INDEX ] + " Elementary School", "the number of chickens sold in " + COLUMNS[ COL_INDEX ] + " by " + ROWS[ ROW_INDEX ], "the number of points scored in the " + COLUMNS[ COL_INDEX ] + " by " + ROWS[ ROW_INDEX ], "the number of solar panels installed in " + COLUMNS[ COL_INDEX ] + " in " + ROWS[ ROW_INDEX ] ][ INDEX ];'+
								'}'+
							'})()'+
						'</var>'+
					:	'<var id="HINT2">[ "The total number of students at " + ROWS[ ROW_INDEX ] + " Elementary School", "The total number of chickens sold by " + ROWS[ ROW_INDEX ], "The total number of points scored by " + ROWS[ ROW_INDEX ], "The total number of solar panels installed in " + ROWS [ ROW_INDEX ] ][ INDEX ]</var>',
		"hint1"		: 'The table below <var>PROBLEM</var>, except one entry is missing.',
		"hint2"		: 'What number should go in the empty cell?',
		"hint3"		: 'The table is missing <var>HINT1</var>.',
		"hint4"		: 'The table accounts for <span class="hint_orange"><var>ENROLLMENTS[ ROW_INDEX ].slice( 0, COL_INDEX ).join( "+" )</var></span> <var>UNIT</var>.',
		"hint5"		: '<var>HINT2</var> is simply the sum, or <span class="hint_pink"><var>ANSWER</var></span>.',
		"hint6"		: 'The table already accounts for <span class="hint_orange"><var>ENROLLMENTS[ ROW_INDEX ].slice( 0, COL_INDEX ).concat( ENROLLMENTS[ ROW_INDEX ].slice( COL_INDEX + 1, COLUMNS.length - 1 ) ).join( "+" )</var> ='+
                    '<var>ENROLLMENTS[ ROW_INDEX ][ COLUMNS.length - 1 ] - ANSWER</var></span> <var>UNIT</var>.',
		"hint7"		: 'The missing number must be the difference between <var>HINT2.slice( 0, 1 ).toLowerCase() + HINT2.slice( 1 )</var>, <span class="hint_blue"><var>ENROLLMENTS[ ROW_INDEX ][ COLUMNS.length - 1 ]</var></span>, and the values already accounted for, <span class="hint_orange"><var>ENROLLMENTS[ ROW_INDEX ][ COLUMNS.length - 1 ] - ANSWER</var></span>.'
		}
})