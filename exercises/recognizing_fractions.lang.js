({
	"nl" : {
		"question1"	: "Wat is de teller in de breuk <code>\\dfrac{<var>NUMERATOR</var>}{<var>DENOMINATOR</var>}</code>?",
		"question2"	: "Wat is de noemer in de breuk  <code>\\dfrac{<var>NUMERATOR</var>}{<var>DENOMINATOR</var>}</code>?",
		"hint1"		: 'Een breuk helpt bij het aangeven van een aantal gelijke delen van een geheel.',
		"hint2"		: 'Zo kun je de breuk <code>\\dfrac{<var>NUMERATOR</var>}{<var>DENOMINATOR</var>}</code> zien als <var>NUMERATOR</var> van de <var>DENOMINATOR</var> stukken van een taart. Oftewel: de taart is in <var>DENOMINATOR</var> stukken gesneden, en wij hebben het over <var>NUMERATOR</var> van die stukken.',
		"hint3"		: 'De teller is het aantal stukken dat we pakken, en wordt boven de lijn geschreven.  De noemer is het totale aantal stukken waar de taart in is verdeeld, en wordt onder de streep geschreven.',
		"hint4"		: 'De teller is dus <code><var>NUMERATOR</var></code>.',
		"hint5"		: 'De noemer is dus <code><var>DENOMINATOR</var></code>.',
		"hint6"		: 'init({'+
								'range: [ [-2, 10], [-2, 2] ],'+
								'scale: 25'+
							'});'+
							''+
							'piechart( [NUMERATOR, DENOMINATOR - NUMERATOR], ["#6495ED", "#FFA500"], 2 );'+
							'label( [2, 0], "=\\\\dfrac{\\\\color{#6495ED}{" + NUMERATOR + "}}{" + DENOMINATOR + "}"'+
								'+ "=\\\\dfrac{\\\\color{#6495ED}{\\\\text{teller}}}{\\\\text{noemer}}", "right");'
		}
})