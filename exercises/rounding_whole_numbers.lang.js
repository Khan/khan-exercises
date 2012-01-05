({
	"nl" : {
		"question1" : "Rond <code><var>( NUM )</var></code> af op het dichtsbijzijnde <var>TPLACE</var>.",
		"hint1" : "Er zijn twee manieren om dit probleem aan te pakken.",
		"hint2" : "Eerste manier: Kijk naar het getal dat op de plaats van de <var>placesLeftOfDecimal[ -1 - PLACE ]</var> staat, in dit geval het getal <code><var>DIGITS[ 5 + PLACE ]</var></code> om te bepalen of je naar boven of naar beneden af moet ronden.",
		"hint3" : "Omdat dit <span data-if="DIGITS[ 5 + PLACE ] > 5">groter dan</span><span data-else>gelijk aan</span> <code>5</code> is, ronden we naar boven af, naar <code><var>ROUNDED</var></code>.',
		"hint4" : 'Omdat dit kleiner dan <code>5</code>, ronden we naar beneden af, naar <code><var>( ROUNDED )</var></code>.',
		"hint5" : 'Tweede manier:  Bedenk welke kant van de getallenlijn dichterbij <var>NUM</var> is - deze kant is blauw omcirkeld.'
	}
})