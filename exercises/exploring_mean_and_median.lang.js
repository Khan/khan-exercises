({
	"nl" : {
		"question1"	: 'Orden de <var>POINTS</var> oranje punten op de getallenlijn zo dat het '+
					'<span class="hint_blue">rekenkundig gemiddelde gelijk is aan <code><var>MEAN</var></code></span> '+
					'en de <span class="hint_green">mediaan gelijk is aan <code><var>MEDIAN</var></code></span>. '+
					'De afstand tussen twee opeenvolgende streepjes is 1.',
		"question2"	: 'Verplaats de oranje stippen om je antwoord te selecteren.',
		"example1"	: 'elke ordening van de oranje stippen waarbij gemiddelde en mediaan correct zijn',
		
		"hint1"		: 'De mediaan is het middelste getal. Er zijn dus altijd evenveel punten links, '+
						'als rechts van de mediaan.',
		"hint2"		: 'Sleep de punten zo dat de helft zich links van '+
						'<span class="hint_green"><code><var>MEDIAN</var></code></span> '+
						 'bevindt en de andere helft zich rechts van '+
						'<span class="hint_green"><code><var>MEDIAN</var></code></span> bevindt. '+
						'<span data-if="POINTS % 2 === 0">'+
							'De twee punten in het midden moeten even ver af staan van '+
							'<span class="hint_green"><code><var>MEDIAN</var></code></span>.'+
						'</span>'+
						'<span data-else>'+
							'Het middelste punt moet zich bevinden op '+
							'<span class="hint_green"><code><var>MEDIAN</var></code></span>.'+
						'</span><br />'+
						'<input type="button" value="Show me an example" onClick="javascript: '+
							'KhanUtil.showMedianExample();'+
						'"></button>',
		"hint3"		: 'Zolang er zich evenveel punten links als rechts van de mediaan bevinden, blijft '+
						'de mediaan hetzelfde. Het rekenkundig gemiddelde wordt echter berekend op basis '+
						'van de waarden van alle punten. Probeer de punten aan beide kanten van de mediaan '+
						'dichterbij of verder van de mediaan af te bewegen om te zien hoe dit het gemiddelde be&iuml;nvloed. ',
		"hint4"		: 'Er zijn meerdere mogelijkheden om de punten zo te plaatsen dat het gemiddelde gelijk is aan '+
						'<span class="hint_blue"><code><var>MEAN</var></code></span> '+
						'en de mediaan gelijk is aan '+
						'<span class="hint_green"><code><var>MEDIAN</var></code></span>. '+
						'<input type="button" value="Toon me een oplossing" onClick="javascript:'+
							'KhanUtil.showMeanExample();'+
						'"></button>'
		}
})