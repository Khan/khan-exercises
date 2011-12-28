({
	"nl" : {
		"question1"	: 'Place the black box on the position of <code><var>NICE_NUMBER</var></code> on the number line!',
		
		"hint1"		: 'Because <code><var>REDUCED_NUMBER</var></code> is <span data-if="NUMBER > 0">positive</span><span data-else>negative</span> we go <span data-if="NUMBER > 0">right</span><span data-else>left</span> from 0',
		"hint2"		: 'Therefore <code><var>REDUCED_NUMBER</var></code> is between <var>floor( NUMBER )</var> and <var>ceil( NUMBER )</var>',
		"hint3"		: 'If we zoom in to that portion of the number line:'+
						'<div class="graphie">'+
							'init({'+
								'scale: [ 640, 40 ],'+
								'range: [ [-0.007, 1.1 ], [-1, 1] ]'+
							'});'+
							'var start = floor( NUMBER ) - 0.001;'+
							'var end =  ceil( NUMBER ) + 0.001;'+
							'var originX = 0;'+
							'var x = NUMBER;'+
							'numberLine( start, end, 1 / reduce( NOMINATOR, DENOMINATOR)[1], 0 ,0, reduce( NOMINATOR, DENOMINATOR )[1] );'+
							'style({ stroke: "#6495ED", fill: "#6495ED" });'+
							'style({ stroke: "#FFA500", fill: "#FFA500", strokeWidth: 3.5 });'+
							'var already = [];'+
							'for( i = 0; i !=  WRONGS.length; i++ ){'+
									'if( WRONGS[ i ] >= start && WRONGS[ i ] <= end ){'+
										'ellipse(  [ WRONGS[ i ] - start, 0 ], [ 0.01, 0.12 ] );'+
										'label( [WRONGS[ i ] - start, 0 ], POSS_ANSWER[ i ] , "above", { labelDistance: 5 } );'+
									'}'+
							'}'+
						'</div>'
		}
})