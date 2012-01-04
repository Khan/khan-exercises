({
	"nl" : {
		"exercise1"	: 'Hoe laat is het?',
		"exercise2"	: 'Het is <span class="sol"><var>HOUR</var></span> : <span class="sol"><var>NICE_MINUTE</var></span> uur.',
		"exercise3"	: 'een 12-uurs notatie in uren en minuten',
		"hint1"		: 'De kleine wijzer wijst de uren aan, en de grote wijzer wijst de minuten aan.',
		"hint2"		: 'De urenwijzer wijst naar de <code><var>HOUR</var></code>, het uur is dus <code><var>HOUR</var></code>.',
		"hint3"		: 'De urenwijzer staat tussen de <code><var>HOUR</var></code> en <code><var>HOUR + 1 === 13 ? 1 : HOUR + 1</var></code>, het uur is dus <code><var>HOUR</var></code>.',
		"hint4"		: "De urenwijzer is dichtbij, maar nog niet voorbij de <code><var>HOUR + 1 === 13 ? 1 : HOUR + 1</var></code>, dus het uur is nog steeds <code><var>HOUR</var></code>.",
		"hint5"		: 'De minutenwijzer begint recht omhoog voor <code>0</code> minuten, en maakt vervolgens een heel rondje in <code>1</code> uur.',
		"hint6"		: 'Voor elk kwart van de cirkel dat de grote wijzer voorbijgaat, tellen we <code>15</code> minuten bij de tijd op.',
		"hint7"		: 'De grote wijzer is voorbij <var>plural( MINUTE / 15, "kwart", "kwart" )</var> van een cirkel, wat gelijk is aan <span data-if="MINUTE === 0"><code>0</code></span><span data-else><code><var>MINUTE</var></code></span> minuten.',
		"hint8"		: 'Het is <code><var>HOUR</var></code>:<code><var>NICE_MINUTE</var></code> uur.'
		}
})