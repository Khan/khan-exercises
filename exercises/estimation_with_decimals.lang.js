({
	"nl" : {
	"variables1" : '<var id="VALUES">$.map( randRange( 1000, 16000, randRange( 3, 7 ) ), function( n ){ return ( n / 1000 ).toFixed( randRange( 1, 2 ) ); } )</var>'+
					'<var id="ANSWER">eval( $.map( VALUES, round ).join("+") )</var>'+
					'<var id="TYPES">randFromArray( [ [ "hardgelopen", "gerend", "kilometer" ], [ "gefietst", "afgelegd", "kilometer" ], [ "paddestoelen verzameld", "verzameld", "kilo" ], [ "geverfd", "geverfd", "vierkante meter" ], [ "graan geoogst", "geoogst", "ton" ] ] )</var>'+
					'<var id="ACC">0</var>'+
					'<var id="SIZE">$.map( VALUES, function( i ){ '+
					'			if ( round( i ) &lt; i ) {'+
					'				return "kleiner dab";'+
					'			}'+
					'			else{'+
					'				return "groter dan of gelijk aan";'+
					'			}'+
					'		}  ) </var>'+
					'<var id="SUM">'+
					'	(function() {'+
					'		var sum = 0;'+
					'		jQuery.each( VALUES, function( i, val ) {'+
					'			sum += parseFloat( val );'+
					'		});'+
					'		return roundTo( 2, sum );'+
					'	})()'+
					'</var>',
		"question1"	: '<var>person( 1 )</var> heeft de afgelopen <var>VALUES.length</var> dagen elke dag <var>TYPES[ 0 ]</var>.',
		"question2"	: 'In onderstaande tabel staan de hoeveelheden die <var>he( 1 )</var> elke dag heeft <var>TYPES[ 0 ]</var>. Schat hoeveel <var>he( 1 )</var> in totaal heeft <var>TYPES[ 1 ]</var> door de hoeveelheid per dag eerst af te ronden en vervolgens bij elkaar op te tellen.',
		"note1"     : "Als je alle hoeveelheden bij elkaar optelt voordat je afrondt, kom je uit op <var>SUM.toFixed( 2 )</var>. Vergelijk dat voor de grap zometeen eens met jouw uitkomst.",		
		"hint1"		: 'Rond alle getallen af tot op de hele <var>TYPES[ 2 ]</var> en tel ze dan bij elkaar op.',
		"hint2"		: 'De schatting komt dus uit op <code><var>ANSWER</var></code> <var>( TYPES[ 2 ] )</var>.',
		"header1"	: '				<span>Dag</span> '+
						'			<span>Hoeveelheid</span>',
		"header2"	:   '			<span>Dag</span>'+
						'			<span>Hoeveelheid</span>'+
						'			<span>Afgerond</span>'+
						'			<span>Totaal</span>'
		}
})