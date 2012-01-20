({
	"nl" : {
		"question1"	: 'De eerste balk is <code><var>CODE_PARENT</var></code> eenheden lang. Gebruik de instrumenten aan de rechterkant om de eerste balk om te vormen in de laatste (blauwe) balk van <code><var>CODE_OFFSPRING</var></code> eenheden lang. Je ziet je voortgang in de middelste (huidige) balk.',
		"question2"	: 'Begin:',
		"question3"	: 'Huidig:',
		"question4"	: 'Doel:',
		
		"answer1"	: 'Hak in '+
						'<input type="button" value="-" class="simple-button action-gradient" onclick="KhanUtil.changePieces( false )">'+
						'<span id="pieces" style="display: inline-block; width: 54px; text-align: center;">1 stukje</span>'+
						'<input type="button" value="+" class="simple-button action-gradient" onclick="KhanUtil.changePieces( true )">',
		"answer2"	: '<span style="display:inline-block; width: 42px;">Kopi&euml;er</span> '+
						'<input type="button" value="-" class="simple-button action-gradient" onclick="KhanUtil.changeTimes( false, \'current_block\' )" disabled="disabled">'+
						'<span id="current_block_times" style="display: inline-block; width: 54px; text-align: center;">1 keer</span>'+
						'<input type="button" value="+" class="simple-button action-gradient" onclick="KhanUtil.changeTimes( true, \'current_block\' )">',
		
		"hint1"		: 'De eerste balk is <code><var>CODE_PARENT</var></code> eenheden lang en kan geschreven worden als <code><var>fraction( N_PARENT_EXPANDED, D )</var></code>.',
		"hint2"		: 'Het doel met een lengte van <code><var>CODE_OFFSPRING</var></code> eenheden kan geschreven worden als <code><var>fraction( N_OFFSPRING_EXPANDED, D )</var></code>.',
		"hint3"		: 'De eerste balk in <code>x</code> stukken hakken is hetzelfde als de balk delen door <code>x</code>.',
		"hint4"		: 'Daarom is het in <code><var>N_PARENT_EXPANDED</var></code> stukken hakken van de eerste balk hetzelfde als:',
		"hint5"		: 'Dat blokje <code>y</code> keer kopi&euml;ren is hetzelfde als het met <code>y</code> vermenigvuldigen.',
		"hint6"		: 'Daarom is het blokje <code><var>N_OFFSPRING_EXPANDED</var></code> keer kopi&euml;ren hetzelfde als:',
		"hint7"		: 'Je ziet dat we nu een balk hebben die net zo groot is als het doel.',
		"hint8"		: '<strong>De oplossing is dus de eerste balk ophakken in <code><var>N_PARENT_EXPANDED</var></code> stukjes en het resulterende blokje <code><var>N_OFFSPRING_EXPANDED</var></code> keer vermenigvuldigen.</strong>'
		}
})