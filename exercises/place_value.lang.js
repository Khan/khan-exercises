({
	"nl" : {
		"question1" : "What is the place value of <var>DIGIT</var> in <var>NUMBER</var>?",
		"hint1" : "<var>NUMBER</var> can be represented as follows.",
		"hint2" : "Thus, <var>DIGIT</var> is in the <var>SOLUTION</var> place.",
		"question2" : "What is <var>cardinal( NUMBER )</var> in standard form?",
		"hint3" : "Add all these parts up:",
		"hint4" : '(function() {
							var maxPower = DIGITS.length - 1;
							return jQuery.map(DIGITS, function(digit, index) {
								if ( digit === 0 ) {
									return null;
								}

								if ( index === DIGITS.length - 1 ) {
									if ( DIGITS[ index - 1] === 0 ) {
										ADDENDS.push( digit );
										return cardinal( digit ) + " is the same as " + digit;
									}
								} else if ( index === DIGITS.length - 2 ) {
									var addend = digit * 10 + DIGITS[ DIGITS.length - 1 ];
									ADDENDS.push( addend );
									return cardinal( addend ) + " is the same as " + addend;
								} else {
									var words = cardinal( digit ) + " " + powerToPlace(maxPower - index);
									var input = [ "*", digit, pow(10, maxPower - index) ];
									var ex = expr( input );
									var addend = expr( input, true );

									ADDENDS.push( addend );
									return words + " is the same as " + ex + " = " + addend;
								}
							});
						})()'
	}
})