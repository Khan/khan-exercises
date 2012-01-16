({
	"nl" : {
		"question1" : "Op welke plaats staat <var>DIGIT</var> in <var>NUMBER</var>?",
		"hint1" : "<var>NUMBER</var> kan als volgt worden uitgeschreven:",
		"hint2" : "Daar uit volgt dat de <var>DIGIT</var> op de plaats van de <var>SOLUTION</var> staat.",
		"question2" : "Hoe schrijf je  <var>kardinaal( NUMBER )</var> in cijfers?",
		"hint3" : "Tel al deze getallen bij elkaar op:",
		"hint4" : '(function() {'+
					'		var maxPower = DIGITS.length - 1;'+
					'		return jQuery.map(DIGITS, function(digit, index) {'+
					'			if ( digit === 0 ) {'+
					'				return null;'+
					'			}'+
					'		if ( index === DIGITS.length - 1 ) {'+
					'				if ( DIGITS[ index - 1] === 0 ) {'+
					'					ADDENDS.push( digit );'+
					'					return kardinaal( digit ) + "len is hetzelfde als " + digit;'+
					'				}'+
					'			} else if ( index === DIGITS.length - 2 ) {'+
					'				var addend = digit * 10 + DIGITS[ DIGITS.length - 1 ];'+
					'				ADDENDS.push( addend );'+
					'				return kardinaal( addend ) + " is hetzelfde als " + addend;'+
					'			} else {'+
					'				var words = kardinaal( digit ) + " " + powerToPlace(maxPower - index);'+
					'				var input = [ "*", digit, pow(10, maxPower - index) ];'+
					'				var ex = expr( input );'+
					'				var addend = expr( input, true );'+
					'				ADDENDS.push( addend );'+
					'				return words + " is hetzelfde als " + ex + " = " + addend;'+
					'			}'+
					'		});'+
					'	})()'
	}
})