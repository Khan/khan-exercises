({
	"nl" : {
		"question1"	: 'Kies het juiste aantal biljetten en munten om te komen tot<br />'+
				'<code>\\Huge{&euro;'+
				'<span data-if="THOUSANDS !== 0">\\color{<var>PINK</var>}{<var>THOUSANDS</var>}</span>'+
				'\\color{<var>ORANGE</var>}{<var>HUNDREDS</var>}'+
				'\\color{<var>GREEN</var>}{<var>TENS</var>}'+
				'\\color{<var>BLUE</var>}{<var>ONES</var>}.'+
				'\\color{purple}{<var>TENTHS</var>}'+
				'\\color{gray}{<var>HUNDREDTHS</var>}'+
				'}</code>',
		"question2"	: 'Kies het juiste aantal van elke waarde om tot een totaal te komen van<br />'+
				'<code>\\Huge{'+
				'<span data-if="THOUSANDS !== 0">\\color{<var>PINK</var>}{<var>THOUSANDS</var>}</span>'+
				'\\color{<var>ORANGE</var>}{<var>HUNDREDS</var>}'+
				'\\color{<var>GREEN</var>}{<var>TENS</var>}'+
				'\\color{<var>BLUE</var>}{<var>ONES</var>}.'+
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
		
		"hint1"		: '<code>\\Large{'+
				'<span data-if="THOUSANDS !== 0">\\color{<var>PINK</var>}{<var>THOUSANDS</var>}</span>'+
				'\\color{<var>ORANGE</var>}{<var>HUNDREDS</var>}'+
				'\\color{<var>GREEN</var>}{<var>TENS</var>}'+
				'\\color{<var>BLUE</var>}{<var>ONES</var>}.'+
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
				'<span data-if="TENTHS !== 0">\\color{purple}{0.<var>TENTHS</var>} + </span> '+
				'<span data-if="HUNDREDTHS !== 0">\\color{gray}{0.0<var>HUNDREDTHS</var>}</span> '+
				'<span data-if="THOUSANDTHS !== 0"> + \\color{brown}{0.00<var>THOUSANDTHS</var>}</span> '+
			'}</code>.',
		"hint2"		: '<code>\\large{\\color{<var>PINK</var>} {<var>THOUSANDS</var>000}}</code> is gelijk aan <code>\\large{\\color{<var>PINK</var>}{<var>THOUSANDS</var>}}</code> '+
		'<var>plural( "thousand", THOUSANDS )</var>, the place value four places to the left of the decimal point.',
		"hint3"		: 'Because there is no number in the <span class="hint_pink">thousands</span> place, you dont need any <span class="hint_pink">thousands</span>.',
		"hint4"		: '<code>\\large{\\color{<var>ORANGE</var>}{<var>HUNDREDS</var>00}}</code> is the same as <code>\\large{\\color{<var>ORANGE</var>}{<var>HUNDREDS</var>}}</code> '+
			'<var>plural( "hundred", HUNDREDS )</var>, the place value three places to the left of the decimal point.',
		"hint5"		: 'Because the <span class="hint_orange">hundreds</span> place is <code class="hint_orange">\\large{0}</code>, you dont need any <span class="hint_orange">hundreds</span>.',
		"hint6"		: '<code>\\large{\\color{<var>GREEN</var>}{<var>TENS</var>0}}</code> is the same as <code>\\large{\\color{<var>GREEN</var>}{<var>TENS</var>}}</code> '+
			'<var>plural( "ten", TENS )</var>, the place value two places to the left of the decimal point.',
		"hint7"		: 'Because the <span class="hint_green">tens</span> place is <code class="hint_green">\\large{0}</code>, you dont need any <span class="hint_green">tens</span>.',
		"hint8"		: '<code>\\large{\\color{<var>BLUE</var>}{<var>ONES</var>}}</code> is the same as <code>\\large{\\color{<var>BLUE</var>}{<var>ONES</var>}}</code> '+
			'<var>plural( "one", ONES )</var>, the place value one place to the left of the decimal point.',
		"hint9"		: 'Because the <span class="hint_blue">ones</span> place is <code class="hint_blue">\\large{0}</code>, you dont need any <span class="hint_blue">ones</span>.',
		"hint10"	: '<code>\\large{\\color{purple}{0.<var>TENTHS</var>}}</code> is the same as <code>\\large{\\color{purple}{<var>TENTHS</var>}}</code> '+
			'<var>plural( "tenth", TENTHS )</var>, the place value one place to the right of the decimal point.',
		"hint11"	: 'Because the <span class="hint_purple">tenths</span> place is <code class="hint_purple">\\large{0}</code>, you dont need any <span class="hint_purple">tenths</span>.',
		"hint12"	: '<code>\\large{\\color{gray}{0.0<var>HUNDREDTHS</var>}}</code> is the same as <code>\\large{\\color{gray}{<var>HUNDREDTHS</var>}}</code> '+
			'<var>plural("hundredth", HUNDREDTHS )</var>, the place value two places to the right of the decimal point.',
		"hint13"	: 'Because the <span class="hint_gray">hundreds</span> place is <code class="hint_gray">\\large{0}</code>, you dont need any <span class="hint_gray">hundreds</span>.',
		"hint14"	: '<code>\\large{\\color{#a52a2a}{0.00<var>THOUSANDTHS</var>}}</code> is the same as <code>\\large{\\color{#a52a2a}{<var>THOUSANDTHS</var>}}</code> '+
			'<var>plural("thousandth", THOUSANDTHS )</var>, the place value three places to the right of the decimal point.',
		"hint15"	: 'Therefore you need'+
			'<span data-if="THOUSANDS !== 0"><code>\\large{\\color{<var>PINK</var>}{<var>THOUSANDS</var>}}</code> <var>plural( "thousand", THOUSANDS )</var>, </span> '+
			'<span data-if="HUNDREDS !== 0"><code>\\large{\\color{<var>ORANGE</var>}{<var>HUNDREDS</var>}}</code> <var>plural( "hundred", HUNDREDS )</var>, </span> '+
			'<span data-if="TENS !== 0"><code>\\large{\\color{<var>GREEN</var>}{<var>TENS</var>}}</code> <var>plural( "ten", TENS )</var>, </span> '+
			'<span data-if="ONES !== 0"><code>\\large{\\color{<var>BLUE</var>}{<var>ONES</var>}}</code> <var>plural( "one", ONES )</var>, </span> '+
			'<span data-if="TENTHS !== 0"><code>\\large{\\color{purple}{<var>TENTHS</var>}}</code> <var>plural( "tenth", TENTHS )</var>, </span> '+
			'<span data-if="THOUSANDTHS === 0" data-unwrap>'+
				'and <code>\\large{\\color{gray}{<var>HUNDREDTHS</var>}}</code> <var>plural( "hundredth", HUNDREDTHS )</var>. '+
			'</span>'+
			'<span data-else data-unwrap>'+
				'<span data-if="HUNDREDTHS !== 0"><code>\\large{\\color{gray}{<var>HUNDREDTHS</var>}}</code> <var>plural( "hundredth", HUNDREDTHS )</var>, </span> '+
				'and <code>\\large{\\color{#a52a2a}{<var>THOUSANDTHS</var>}}</code> <var>plural( "thousandth", THOUSANDTHS )</var>. '+
			'</span>',
					"hint15"	: '<span data-if="HUNDREDTHS !== 0"><code>\\large{\\color{gray}{<var>HUNDREDTHS</var>}}</code> <var>plural( "hundredth", HUNDREDTHS )</var>, </span> '+
				'and <code>\\large{\\color{#a52a2a}{<var>THOUSANDTHS</var>}}</code> <var>plural( "thousandth", THOUSANDTHS )</var>.'
		}
})