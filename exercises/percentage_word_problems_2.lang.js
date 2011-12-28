({
	"nl" : {
		"question1"	: '<var>person(1)</var> has <var>YEAR_PERCENT_MORE</var>% more money today than <var>he(1)</var> did this time last year. If <var>person(1)</var> has $<var>YEAR_THIS</var> today, how much money did <var>he(1)</var> make over this past year? (Round to the nearest cent, or hundredth of a dollar.)</p>',
		"question2"	: ' <var>person(1)</var> has $<var>DOLLARS</var> to spend at a store. The store currently has a sale where the sale price is <var>PERCENT_OFF</var>% off the marked price. What is the highest marked price that <var>person(1)</var> can afford? (Round to the nearest cent, or hundredth of a dollar.)',
		
		"hint1"		: 'Let <code>x</code> be the amount of money that <var>he(1)</var> had last year.',
		"hint2"		: '<code>x = $<var>YEAR_LAST</var></code> (rounding to the nearest penny in this step)',
		"hint3"		: 'So, <var>he(1)</var> had $<var>YEAR_LAST</var> last year, but we want to know how much <var>he(1)</var> has made <b>over the past year!</b>',
		"hint4"		: '<code>\text{money made over the past year} = \text{amount of money today} - \text{amount of money last year}</code>',
		"hint5"		: 'So, the answer is $<var>round((YEAR_THIS - YEAR_LAST) * 100) / 100</var>.',
		"hint6"		: 'Let <code>x</code> be the highest marked price that <var>person(1)</var> can afford.',
		"hint7"		: '<code>x-<var>(PERCENT_OFF/100)</var>x = \text{sale price} = \text{amount <var>person( 1 )</var> has to spend}</code>'
		}
})