({
	"nl" : {
		"question1"	: 'Kies het juiste aantal biljetten en munten om te komen tot<br />'+
				'<code>\\Huge{&euro;'+
				'<span data-if="THOUSANDS !== 0">\\color{<var>PINK</var>}{<var>THOUSANDS</var>}</span>'+
				'\\color{<var>ORANGE</var>}{<var>HUNDREDS</var>}'+
				'\\color{<var>GREEN</var>}{<var>TENS</var>}'+
				'\\color{<var>BLUE</var>}{<var>ONES</var>},'+
				'\\color{purple}{<var>TENTHS</var>}'+
				'\\color{gray}{<var>HUNDREDTHS</var>}'+
				'}</code>',
		"question2"	: 'Kies het juiste aantal van elke waarde om tot een totaal te komen van<br />'+
				'<code>\\Huge{'+
				'<span data-if="THOUSANDS !== 0">\\color{<var>PINK</var>}{<var>THOUSANDS</var>}</span>'+
				'\\color{<var>ORANGE</var>}{<var>HUNDREDS</var>}'+
				'\\color{<var>GREEN</var>}{<var>TENS</var>}'+
				'\\color{<var>BLUE</var>}{<var>ONES</var>},'+
				'\\color{purple}{<var>TENTHS</var>}'+
				'\\color{gray}{<var>HUNDREDTHS</var>}'+
				'\\color{#a52a2a}{<var>THOUSANDTHS</var>}'+
				'}</code>',
		"question3"	: 'Duizendtallen',
		"question4"	: 'Honderdtallen',
		"question5"	: 'Tientallen',
		"question6"	: 'Eenheden',
		"question7"	: 'Tienden',
		"question8"	: 'Honderdsten',
		"question9"	: 'Duizendsten',
		"question10"	: 'Click op de getallen in de rechthoeken om ze te selecteren.',
		"question11"	: 'click op een rechthoek om te selecteren',
		"question12"	: 'click op een rechthoek om te deselecteren',
		"question13"	: 'Click op de biljetten en de munten om ze te selecteren.',
		"question14"	: 'Click op een biljet of munt om ze te selecteren.',
		"question15"	: 'Click nogmaals op een biljet of munt om ze te deselecteren.',
		"question16"	: 'Duizendjes',
		"question17"	: 'Honderdjes',
		"question18"	: 'Tientjes',
		"question19"	: 'Euro\'s',
		"question20"	: 'Dubbeltjes',
		"question21"	: 'Centen',
		
		"hint1"		: '<code>\\Large{'+
				'<span data-if="THOUSANDS !== 0">\\color{<var>PINK</var>}{<var>THOUSANDS</var>}</span>'+
				'\\color{<var>ORANGE</var>}{<var>HUNDREDS</var>}'+
				'\\color{<var>GREEN</var>}{<var>TENS</var>}'+
				'\\color{<var>BLUE</var>}{<var>ONES</var>},'+
				'\\color{purple}{<var>TENTHS</var>}'+
				'\\color{gray}{<var>HUNDREDTHS</var>}'+
				'<span data-if="THOUSANDTHS !== 0">\\color{brown}{<var>THOUSANDTHS</var>}</span>'+
				'}'+
			'</code>'+
			' is gelijk aan '+
			'<code>\\large{'+
				'<span data-if="THOUSANDS !== 0">\\color{<var>PINK</var>}{<var>THOUSANDS</var>000} + </span> '+
				'<span data-if="HUNDREDS !== 0">\\color{<var>ORANGE</var>}{<var>HUNDREDS</var>00} + </span> '+
				'<span data-if="TENS !== 0">\\color{<var>GREEN</var>}{<var>TENS</var>0} + </span> '+
				'<span data-if="ONES !== 0">\\color{<var>BLUE</var>}{<var>ONES</var>} + </span> '+
				'<span data-if="TENTHS !== 0">\\color{purple}{0,<var>TENTHS</var>} + </span> '+
				'<span data-if="HUNDREDTHS !== 0">\\color{gray}{0,0<var>HUNDREDTHS</var>}</span> '+
				'<span data-if="THOUSANDTHS !== 0"> + \\color{brown}{0,00<var>THOUSANDTHS</var>}</span> '+
			'}</code>.',
		"hint2"		: '<code>\\large{\\color{<var>PINK</var>} {<var>THOUSANDS</var>000}}</code> is gelijk aan <code>\\large{\\color{<var>PINK</var>}{<var>THOUSANDS</var>}}</code> '+
		'<var>plural( "duizendtal", "duizendtallen", THOUSANDS )</var>, op de plaats vier getallen links van het decimaalteken.',
		"hint3"		: 'Omdat er geen getal staat op de plaats van de <span class="hint_pink">duizendtallen</span>, selecteer je geen <span class="hint_pink">duizendtallen</span>.',
		"hint4"		: '<code>\\large{\\color{<var>ORANGE</var>}{<var>HUNDREDS</var>00}}</code> is gelijk aan <code>\\large{\\color{<var>ORANGE</var>}{<var>HUNDREDS</var>}}</code> '+
			'<var>plural( "honderdtal", "honderdtallen", HUNDREDS )</var>, op de plaats drie getallen links van het decimaalteken.',
		"hint5"		: 'Omdat op de plaats van de <span class="hint_orange">honderdtallen</span> een <code class="hint_orange">\\large{0}</code> staat, heb je geen <span class="hint_orange">honderdtallen</span> nodig.',
		"hint6"		: '<code>\\large{\\color{<var>GREEN</var>}{<var>TENS</var>0}}</code> is gelijk aan <code>\\large{\\color{<var>GREEN</var>}{<var>TENS</var>}}</code> '+
			'<var>plural( "tiental", "tientallen", TENS )</var>, op de plaats twee getallen links van het decimaalteken.',
		"hint7"		: 'Omdat op de plaats van de <span class="hint_green">tens</span> een <code class="hint_green">\\large{0}</code> staat, heb je geen <span class="hint_green">tientallen</span> nodig.',
		"hint8"		: '<code>\\large{\\color{<var>BLUE</var>}{<var>ONES</var>}}</code> is gelijk aan <code>\\large{\\color{<var>BLUE</var>}{<var>ONES</var>}}</code> '+
			'<var>plural( "eenheid", "eenheden", ONES )</var>, op de plaats links van het decimaalteken.',
		"hint9"		: 'Omdat op de plaats van de <span class="hint_blue">eenheden</span> een <code class="hint_blue">\\large{0}</code> staat, heb je geen <span class="hint_blue">eenheden</span> nodig.',
		"hint10"	: '<code>\\large{\\color{purple}{0,<var>TENTHS</var>}}</code> is gelijk aan <code>\\large{\\color{purple}{<var>TENTHS</var>}}</code> '+
			'<var>plural( "tiende", "tienden", TENTHS )</var>, op de plaats rechts van het decimaalteken.',
		"hint11"	: 'Omdat op de plaats van de <span class="hint_purple">tienden</span> een <code class="hint_purple">\\large{0}</code> staat, heb je geen <span class="hint_purple">dubbeltjes</span> nodig.',
		"hint12"	: '<code>\\large{\\color{gray}{0,0<var>HUNDREDTHS</var>}}</code> is gelijk aan <code>\\large{\\color{gray}{<var>HUNDREDTHS</var>}}</code> '+
			'<var>plural( "honderdste", "honderdsten", HUNDREDTHS )</var>, op de plaats twee getallen rechts van het decimaalteken.',
		"hint13"	: 'Omdat op de plaats van de <span class="hint_gray">honderdsten</span> een <code class="hint_gray">\\large{0}</code> staat, heb je geen <span class="hint_gray">honderdsten</span> nodig.',
		"hint14"	: '<code>\\large{\\color{#a52a2a}{0,00<var>THOUSANDTHS</var>}}</code> is gelijk aan <code>\\large{\\color{#a52a2a}{<var>THOUSANDTHS</var>}}</code> '+
			'<var>plural( "duizendste", "duizendsten", THOUSANDTHS )</var>, op de plaats drie getallen rechts van het decimaalteken.',
		"hint15"	: 'Voor dit getal heb je dus nodig: '+
			'<span data-if="THOUSANDS !== 0"><code>\\large{\\color{<var>PINK</var>}{<var>THOUSANDS</var>}}</code> <var>plural( "duizendtal", "duizendtallen", THOUSANDS )</var>, </span> '+
			'<span data-if="HUNDREDS !== 0"><code>\\large{\\color{<var>ORANGE</var>}{<var>HUNDREDS</var>}}</code> <var>plural( "honderdtal", "honderdtallen", HUNDREDS )</var>, </span> '+
			'<span data-if="TENS !== 0"><code>\\large{\\color{<var>GREEN</var>}{<var>TENS</var>}}</code> <var>plural( "tiental", "tientallen", TENS )</var>, </span> '+
			'<span data-if="ONES !== 0"><code>\\large{\\color{<var>BLUE</var>}{<var>ONES</var>}}</code> <var>plural( "eenheid", "eenheden", ONES )</var>, </span> '+
			'<span data-if="TENTHS !== 0"><code>\\large{\\color{purple}{<var>TENTHS</var>}}</code> <var>plural( "tiende", "tienden", TENTHS )</var>, </span> '+
			'<span data-if="THOUSANDTHS === 0" data-unwrap>'+
				'en <code>\\large{\\color{gray}{<var>HUNDREDTHS</var>}}</code> <var>plural( "honderdste", "honderdsten", HUNDREDTHS )</var>. '+
			'</span>'+
			'<span data-else data-unwrap>'+
				'<span data-if="HUNDREDTHS !== 0"><code>\\large{\\color{gray}{<var>HUNDREDTHS</var>}}</code> <var>plural( "honderdste", "honderdsten", HUNDREDTHS )</var>, </span> '+
				'en <code>\\large{\\color{#a52a2a}{<var>THOUSANDTHS</var>}}</code> <var>plural( "duizendste", "duizendsten", THOUSANDTHS )</var>. '+
			'</span>'
		}
})
