({
	"nl" : {
		"question1"	: 'Als er oorspronkelijk <var>TOTAL</var> stukken waren, welk gedeelte van de <var>pizza( 1 )</var> is dan opgegeten?',
		"question2"	: 'Als er <var>plural(LEFT, "stuk", "stukken")</var> over zijn, welk gedeelte van de <var>pizza( 1 )</var> is dan opgegeten?',
		"question3"	: 'Als <var>person( 1 )</var> <code>\\dfrac{<var>A</var>}{<var>TOTAL</var>}</code> van de <var>pizza( 1 )</var> opat, welk gedeelte van de <var>pizza( 1 )</var> was dan opgegeten?',
		"question4"	: 'Als er oorspronkelijk <var>TOTAL</var> stukken waren, welk gedeelte van de <var>pizza( 1 )</var> is dan nog over?',
		"question5"	: 'Als <var>person( 1 )</var> <code>\\dfrac{<var>A</var>}{<var>TOTAL</var>}</code> van de <var>pizza( 1 )</var> opat, welk gedeelte van de <var>pizza( 1 )</var> was dan nog over?',
		"question6"	: 'Hoeveel mensen zijn naar de verjaardag van <var>person( 1 )</var> gegaan?',
		"question7"	: 'Hoeveel geld heeft <var>person( 1 )</var> uitgegeven?',
		"question8"	: 'Hoeveel geld gaf <var>person( 1 )</var> uit aan voedsel?',
		"question9"	: 'Hoeveel liter benzine zat er nog in de tank?',
		"question10": 'Hoeveel volwassenen waren er op de picknick?',
		
		"info1"     : 'Rond af tot op de cent, of 1 honderdste van een euro.',
		"info2"     : 'Rond af tot op de cent, of 1 honderdste van een euro.',
		
		"problem1"  : '<var>person( 1 )</var> at <var>plural( A, "stuk", "stukken" )</var> <var>pizza( 1 )</var> en <var>person( 2 )</var> at <var>plural( B, "stuk","stukken")</var> <var>pizza( 1 )</var>.',
		"problem6"  : '<var>person( 1 )</var> nodigde <var>INVITEES</var> vrienden uit voor <var>his( 1 )</var> verjaardag. Sommige mensen hadden andere plannen en konden niet komen, maar <var>N</var>/<var>D</var> van de mensen die <var>person( 1 )</var> had uitgenodigd konden komen.',
		"problem7"  : 'Na een tijdje sparen had <var>person( 1 )</var> &euro;<var>AMOUNT</var> in <var>his( 1 )</var> spaarpot. <var>He( 1 )</var> gaf <var>N</var>/<var>D</var> van dat geld uit om boeken te kopen.',
		"problem8"  : 'Elke dag stopt <var>person( 1 )</var> het kleingeld uit <var>his( 1 )</var> zak in een glazen pot. Na <var>randRange( 10, 30 )</var> weken heeft <var>person( 1 )</var> &euro;<var>AMOUNT</var> gespaard. <var>person( 1 )</var> besluit om <var>N</var>/<var>D</var> van dat geld te gebruiken om voedsel te kopen voor een daklozentehuis.',
		"problem9"  : 'Voordat <var>person( 1 )</var> op vakantie gaat, gooit <var>he( 1 )</var> <var>his( 1 )</var> tank, waar totaal <var>GALLONS</var> liter in kan, vol met benzine. Na <var>0.5 * randRange( 3 / 0.5, 10 / 0.5 )</var> uur rijden, ziet <var>person( 1 )</var> dat <var>his( 1 )</var> benzinetank nog <var>N</var>/<var>D</var> vol is.',
		"problem10" : 'Op een picknick in het park waren in totaal <var>ATTENDEES</var> mensen. Van die mensen was <var>N</var>/<var>D</var> volwassen.',
		
		
		"hint0"     : '<code>\\text{gedeelte van <var>pizza( 1 )</var> opgegeten} = \\dfrac{\\text{aantal stukken gegeten}}{\\text{totaal aantal stukken}}</code>',
		"hint1"		: 'Ze aten <code>\\color{#6495ED}{<var>A + B</var>}</code> van de  <code><var>TOTAL</var></code> stukken.',
		"hint2"		: 'Ze aten <code>\\dfrac{<var>A + B</var>}{<var>TOTAL</var>}</code> van de <var>pizza( 1 )</var>.',
		"hint3"		: 'Omdat ze <var>A + B</var> stukken <var>pizza( 1 )</var> aten en er <var>plural( LEFT, "stuk","stukken" )</var> overbleven, moeten er aan het begin <var>TOTAL</var> stukken zijn geweest.',
		"hint6"		: 'Als <var>plural( A, "stuk","stukken")</var> gelijk is aan <code>\\dfrac{<var>A</var>}{<var>TOTAL</var>}</code> van de <var>pizza( 1 )</var>, dan moeten er totaal <var>TOTAL</var> stukken zijn geweest.',
		"hint9"		: 'Samen aten ze <var>A + B</var> stukken, zodat er <var>LEFT</var> van de <var>TOTAL</var> stukken overbleven.',
		"hint10"	: '<code>\\dfrac{<var>LEFT</var>}{<var>TOTAL</var>}</code> van de <var>pizza( 1 )</var> blijft over.',
		"hint10"	: '<code>\\text{gedeelte van de <var>pizza( 1 )</var> blijf over} = \\dfrac{\text{number of slices remaining}}{\\text{number slices total}}</code>',
		"hint12"	: 'Together they ate <var>A + B</var> stukken, which leaves <var>LEFT</var> out of <var>TOTAL</var> stukken remaining.',
		"hint13"	: 'There is <code>\\dfrac{<var>LEFT</var>}{<var>TOTAL</var>}</code> of the <var>pizza( 1 )</var> remaining.',
		"hint14"	: 'We can multiply <code>\\dfrac{<var>N</var>}{<var>D</var>}</code> by <code><var>INVITEES</var></code> to find out how many people attended the party.',
		"hint15"	: '<code>\\color{#e00}{\\dfrac{<var>N * INVITEES</var>}{<var>D</var>}} = <var>SOLUTION</var></code>',
		"hint16"	: 'We, we can multiply <code><var>AMOUNT</var></code> by <code>\\dfrac{<var>N</var>}{<var>D</var>}</code>  to find out how much money <var>person( 1 )</var> spent.',
		"hint17"	: '<strong><var>person( 1 )</var> spent $<var>SOLUTION</var> on books.</strong>',
		"hint18"	: 'We can multiply <code><var>AMOUNT</var></code> by <code>\\dfrac{<var>N</var>}{<var>D</var>}</code> to find out how much money <var>person( 1 )</var> spent on canned food.',
		"hint19"	: '<strong><var>person( 1 )</var> spent $<var>SOLUTION</var> on canned food for the homeless shelter.</strong>',
		"hint20"	: 'Since a fraction of the gas in <var>his( 1 )</var> tank was left, we can multiply <code><var>GALLONS</var></code> by <code>\\dfrac{<var>N</var>}{<var>D</var>}</code> to find out how much gas was left in the tank.',
		"hint21"	: '<strong><var>person( 1 )</var> had <var>SOLUTION</var> gallons of gas left in <var>his( 1 )</var> tank when <var>he( 1 )</var> checked.</strong>',
		"hint22"	: 'We can multiply <code><var>ATTENDEES</var></code> by <code>\\dfrac{<var>N</var>}{<var>D</var>}</code> to find out how many people at the picnic were adults.',
		"hint23"	: '<strong><var>SOLUTION</var> people at the picnic were adults.</strong>'
		}
})