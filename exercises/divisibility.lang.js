({
	"nl" : {
		"question1"	: 'Alle getallen deelbaar door  <code><var>A</var></code> en <code><var>B</var></code> zijn ook deelbaar door welk getal?',
		"question2"	: '<li data-each="WRONGS as index, wrong"><code><var>wrong</var></code></li>',
		
		"hint1"		: '<code><var>A</var></code> ontbinden in priemfactoren geeft <code><var>getPrimeFactorization( A ).join( "\\\\times" )</var></code>.',
		"hint2"		: '<code><var>B</var></code> ontbinden in priemfactoren geeft <code><var>getPrimeFactorization( B ).join( "\\\\times" )</var></code>.',
		"hint3"		: 'Dus elk getal deelbaar door zowel <code><var>A</var></code> als <code><var>B</var></code> moet een gedeelte van <code><var>LCM_FACTORIZATION.join( "\\\\times" )</var></code> als priemfactoren hebben.',
		"hint4"		: 'Zo\'n getal is ook deelbaar door <code><var>ANSWER</var></code>, omdat <code><var>getPrimeFactorization( ANSWER ).join( "\\\\times" )</var></code> de priemfactoren van <code><var>ANSWER</var></code> zijn.'
		}
})