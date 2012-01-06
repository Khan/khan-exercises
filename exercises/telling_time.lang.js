({
	"nl" : {
		"exercise1"	: 'Hoe laat is het?',
		"solution1"	: 'Het is <span class="sol"><var>HOUR</var></span> : <span class="sol"><var>NICE_MINUTE</var></span> uur.',
		"solution2"	: 'een 12-uurs tijd in uren en minuten.',
		"hint1"		: 'De kleine wijzer wijst de uren aan en de grote wijzer wijst de minuten aan.',
		"hint2"		: 'De urenwijzer wijst naar de <code><var>HOUR</var></code>, dus het aantal uur is <code><var>HOUR</var></code>.',
		"hint3"		: 'De urenwijzer staat tussen de <code><var>HOUR</var></code> en de <code><var>HOUR + 1 === 13 ? 1 : HOUR + 1</var></code>, dus het uur is <code><var>HOUR</var></code>.',
		"hint4"		: 'De urenwijzer is dichtbij maar niet voorbij de <code><var>HOUR + 1 === 13 ? 1 : HOUR + 1</var></code>, dus het uur is nog steeds <code><var>HOUR</var></code>.',
		"hint5"		: 'De minutenwijzer wijst eerst recht naar boven voor <code>0</code> minuten, en maakt dan een heel rondje in een uur (en komt dus voorbij alle <code>12</code> getallen in <code>60</code> minuten).',
		"hint6"		: 'Voor elk getal dat de minutenwijzer voorbijgaat, tel je <code>\\dfrac{60}{12} = 5</code> minuten bij de tijd op.',
		"hint7"		: 'De minutenwijzer wijst naar de <code><var> (MINUTE / 5) === 0 ? 12: MINUTE / 5 </var></code>, dat betekent <span data-if="MINUTE === 0"><code>0</code></span><span data-else><code>5 \\times <var>(MINUTE / 5) === 0 ? 12: MINUTE / 5</var> = <var>MINUTE</var></code></span> minuten.',
		"hint8"		: "Het is <code><var>HOUR</var></code>:<code><var>NICE_MINUTE</var></code> uur."
		}
})