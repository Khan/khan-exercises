({
	"nl" : {
		"question1"	: 'Schrijf dit getal in wetenschappelijke notatie.',
		"question2"	: 'Dus: <code><var>PRETTY_DECIMAL</var> = \\leadingColor{<var>LEADING</var>}<var>TRAIL</var> \\times 10^{\\exponentColor{<var>E</var>}}</code>',
		
		"hint1"		: 'Er staan <code>\\exponentColor{<var>E</var>}</code> getallen tussen het eerste getal <code>\\leadingColor{<var>LEADING</var>}</code> en het decimaalteken.',
		"hint2"		: 'Tel de nullen die rechts van de decimaal en voor het eerste getal <code>\\leadingColor{<var>LEADING</var>}</code> staan: er <span data-if="E + 1 === -1">is 1 nul</span><span data-else>zijn <code><var>(E + 1) * -1</var></code> nullen</span>.',
		"hint3"		: 'Als je het eerste getal <code>\\leadingColor{<var>LEADING</var>}</code><span data-if="E + 1 < -1"> en de nullen</span><span data-else-if="E + 1 === -1"> en de ene nul</span> telt, <var>E === -1 ? "is" : "zijn"</var> er <code>\\exponentColor{<var>E * -1</var>}</code> <var>E === -1 ? "getal" : "getallen"</var> <span style="color: purple;">rechts</span> van het decimaalteken.'
		}
})