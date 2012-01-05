({
	"nl" : {
		"question1"	: 'The equation of an ellipse <code>E</code> is <code><var>rand(2) == 1 ? expr(["+", Y2T, X2T]) : expr(["+", X2T, Y2T])</var> = 1</code>.',
		"question2"	: 'What are its center <code>(h, k)</code> and its  major and minor radius?',
		
		"hint1"		: 'The equation of an ellipse with center <code>(h, k)</code> is <code> \dfrac{(x - h)^2}{a^2} + \dfrac{(y - k)^2}{b^2} = 1</code>.',
		"hint2"		: 'We can rewrite the given equation as <code>\dfrac{(x - <var>negParens(H)</var>)^2}{<var>A*A</var>} + \dfrac{(y - <var>negParens(K)</var>)^2}{<var>B*B</var>} = 1 </code>.',
		"hint3"		: 'Thus, the center <code>(h, k) = (<var>H</var>, <var>K</var>)</code>.',
		"hint4"		: '<code><var>MAJ*MAJ</var></code> is bigger than <code><var>MIN*MIN</var></code> so the major radius is <code>\sqrt{<var>MAJ*MAJ</var>} = <var>MAJ</var></code> and the minor radius is <code>\sqrt{<var>MIN*MIN</var>} = <var>MIN</var></code>.'
		}
})