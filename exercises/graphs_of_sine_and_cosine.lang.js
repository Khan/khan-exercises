({
	"nl" : {
		"question1"	: 'What is <code>f(x)</code>?',
		
		"problem1"	: '<code>f(x)</code> is graphed below.',
		
		"hint1"		: 'The function starts at its maximum value (ie, <code>f(0)=<var>VSCALE</var></code>), so what kind of function is it?',
		"hint2"		: 'The cosine function, <code>\cos(x)</code>, starts at 1 (ie, <code>\cos(0)=1</code>), so <code>f(x)</code> must be a scaled version of the cosine function.',
		"hint3"		: 'The function starts at zero (ie, <code>f(0)=0</code>), so what kind of function is it?',
		"hint4"		: 'The sine function, <code>\sin(x)</code>, starts at 0 (ie, <code>\sin(0)=0</code>), so <code>f(x)</code> must be a scaled version of the sine function.',
		"hint5"		: 'The distance from peak to peak is <code><var>piFraction( PERIOD )</var></code>, so the period of <code>f(x)</code> is <code><var>piFraction( PERIOD )</var></code>.',
		"hint6"		: 'The distance between every other zero is <code><var>piFraction( PERIOD )</var></code>, so the period of <code>f(x)</code> is <code><var>piFraction( PERIOD )</var></code>.',
		"hint7"		: 'The period of a normal <var>FNS</var> function is <code>2\pi</code>, and the period we want is <code><var>piFraction( PERIOD )</var></code>, so we dont need to worry about scaling the function horizontally.',
		"hint8"		: 'The period of a normal <var>FNS</var> function is <code>2\pi</code>, and the period we want is <code><var>piFraction( PERIOD )</var></code>, so we need to scale the <var>FNS</var> function horizontally by <code><var>decFrac( PERIOD / 2 / PI )</var></code>.',
		"hint9"		: 'To horizontally scale <code>\<var>FN</var>(x)</code> by <code><var>decFrac( PERIOD / 2 / PI )</var></code>, we need to substitute <code><var>decFrac( 2 * PI / PERIOD )</var>x</code> in for <code>x</code> to get <code>\<var>FN</var>(<var>decFrac( 2 * PI / PERIOD )</var>x)</code>.',
		"hint10"	: 'The height of <code>f(x)</code> is <code><var>decFrac( VSCALE )</var></code>, so the amplitude of <code>f(x)</code> is <code><var>decFrac( VSCALE )</var></code>.',
		"hint10"	: 'The amplitude of <code>f(x)</code> is 1, so we dont need to worry about scaling the function vertically.',
		"hint10"	: 'The amplitude of <code>f(x)</code> is <code><var>decFrac( VSCALE )</var></code>, so we need to scale <var>FNS</var> function vertically by <code><var>decFrac( VSCALE )</var></code>.',
		"hint10"	: 'To scale the function vertically, multiply the whole thing by <code><var>decFrac( VSCALE )</var></code>.',
		"hint10"	: 'So the resulting function (after we perform all these manipulations) is <code><var>plus( toFractionTex( VSCALE ) + "\\" + FN + "(" + plus( toFractionTex( 1 / HSCALE ) + "x" ) + ")" )</var></code>.'
		
		}
})