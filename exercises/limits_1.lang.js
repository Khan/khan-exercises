({
	"nl" : {
		"question1"	: 'Does not exist.',
		"question2"	: 'Does not exist.',
		
		"hint1"		: "The limit as we approach from the left doesn't match the limit as we approach from the right, so <code>f(x)</code> has no limit as <code>x \to <var>a</var></code>.",
		"hint2"		: 'What happens as we approach <code>x = <var>a</var></code> from the left?',
		"hint3"		: '<table class="limit">'+ 
					'<tr><th><code>x</code></th><th><var>a - 0.1</var></th><th><var>a - 0.01</var></th><th><var>a - 0.001</var></th></tr>'+
					'<tr><th><code>f(x)</code></th><td><var>curFunc(a - 0.1).toFixed(4)</var></td><td><var>curFunc(a - 0.01).toFixed(4)</var></td><td><var>curFunc(a - 0.001).toFixed(4)</var></td></tr>'+
				'</table>'+
				'It looks like <code>f(x)</code> is approaching <code><var>l_limtoa</var></code> from the left.',
		"hint4"		: '<p>When we approach <code>x = <var>a</var></code> from the right, we get:</p>'+
				'<table class="limit">'+
					'<tr><th><code>x</code></th><th><var>a + 0.1</var></th><th><var>a + 0.01</var></th><th><var>a + 0.001</var></th></tr>'+
					'<tr><th><code>f(x)</code></th><td><var>curFunc(a + 0.1).toFixed(4)</var></td><td><var>curFunc(a + 0.01).toFixed(4)</var></td><td><var>curFunc(a + 0.001).toFixed(4)</var></td></tr>'+
				'</table>'+
				'It looks like <code>f(x)</code> is approaching <code><var>r_limtoa</var></code> from the right.'+
				'<div class="graphie" data-update="graph" data-style="stroke: orange; marker: arrow;">'+
					'line( [a + 2, 0], [a, 0], {'+
						'stroke: "#ff00af",'+
						'arrows: "->"'+
					'});'+
				'</div>',
		"hint6"		: 'So the limit is <code><var>limtoa</var></code>.'
		}
})