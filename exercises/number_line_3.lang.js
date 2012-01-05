({
	"nl" : {
		"exercise" : 'Welk getal staat <strong><var>plural( abs( DISTANCE ), "positie")</var> aan de <span data-if="DISTANCE < 1">links</span><span data-else>rechts</span> van de oranje stip</strong>? De afstand tussen twee streepjes is 1.',
		"exercise1"	: "Welk getal hoort bij de oranje stip?",
		"hint1"	:	"We weten waar <code><var>MIDPOINT</var></code> is op deze getallenlijn, want daar staat het getal <code><var>MIDPOINT</var></code> bij.",
		"hint2"	:	"Getallen aan de linkerkant van de 0 zijn kleiner, en getallen aan de rechterkant zijn groter dan 0",
		"hint3"	:	'We zoeken eerst het getal dat hoort bij de blauwe stip. Deze is  <var>plural( abs( DISTANCE ), "positie")</var> <span data-if="DISTANCE < 1">links</span><span data-else>rechts</span> van de oranje stip.',
		"hint4"	:	'Beginnend bij <code><var>MIDPOINT</var></code>, schuiven we <code><var>abs( NUMBER-MIDPOINT+DISTANCE )</var></code> naar <span data-if="NUMBER-MIDPOINT+DISTANCE < 0">links</span><span data-else>rechts</span> om de <span data-if="DISTANCE !== 0">blauwe</span><span data-else>oranje</span> stip te bereiken.',
		"hint5"	:	'De <span data-if="DISTANCE !== 0">blauwe</span><span data-else>oranje</span> stip staat dus bij het getal <code><var>NUMBER+DISTANCE</var></code>.'
	}
})
