({
	"nl" : {
		"question1"	: 'All numbers divisible by <code><var>A</var></code> and <code><var>B</var></code> are also divisible by which of the following?',
		"question2"	: '<li data-each="WRONGS as index, wrong"><code><var>wrong</var></code></li>',
		
		"hint1"		: 'The prime factorization of <code><var>A</var></code> is <code><var>getPrimeFactorization( A ).join( "\\times" )</var></code>.',
		"hint2"		: 'The prime factorization of <code><var>B</var></code> is <code><var>getPrimeFactorization( B ).join( "\\times" )</var></code>.',
		"hint3"		: 'So, any number divisible by both must have <code><var>LCM_FACTORIZATION.join( "\\times" )</var></code> as part of its prime factorization.',
		"hint4"		: 'Such a number is divisible by <code><var>ANSWER</var></code>, since the prime factorization of <code><var>ANSWER</var></code> is <code><var>getPrimeFactorization( ANSWER ).join( "\\times" )</var></code>.'
		}
})