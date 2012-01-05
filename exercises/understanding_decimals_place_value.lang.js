({
	"nl" : {
		"question1"	: 'Choose the right number of bills and coins to make<br />'+
				'<code>\Huge{$'+
				'<span data-if="THOUSANDS !== 0">\color{<var>PINK</var>}{<var>THOUSANDS</var>}</span>'+
				'\color{<var>ORANGE</var>}{<var>HUNDREDS</var>}'+
				'\color{<var>GREEN</var>}{<var>TENS</var>}'+
				'\color{<var>BLUE</var>}{<var>ONES</var>}.'+
				'\color{purple}{<var>TENTHS</var>}'+
				'\color{gray}{<var>HUNDREDTHS</var>}'+
				'}</code>',
		"quesion2"	: 'Choose the right number of each place value to make<br />'+
				'<code>\Huge{'+
				'<span data-if="THOUSANDS !== 0">\color{<var>PINK</var>}{<var>THOUSANDS</var>}</span>'+
				'\color{<var>ORANGE</var>}{<var>HUNDREDS</var>}'+
				'\color{<var>GREEN</var>}{<var>TENS</var>}'+
				'\color{<var>BLUE</var>}{<var>ONES</var>}.'+
				'\color{purple}{<var>TENTHS</var>}'+
				'\color{gray}{<var>HUNDREDTHS</var>}'+
				'\color{#a52a2a}{<var>THOUSANDTHS</var>}'+
				'}</code>',
		"quesion3"	: 'Thousands',
		"quesion4"	: 'Hundreds',
		"quesion5"	: 'Tens',
		"quesion6"	: 'Ones',
		"quesion7"	: 'Tenths',
		"quesion8"	: 'Hundredths',
		"quesion9"	: 'Thousandths',
		"quesion10"	: 'Click on the numbers in rectangles to select them.',
		"quesion11"	: 'click a number to select it',
		"quesion12"	: 'click a number again to deselect it',
		"quesion13"	: 'Click on the bills and coins to select them.',
		"quesion14"	: '',
		"quesion15"	: '',
		"quesion16"	: '',
		
		"hint1"		: '<code>\Large{'+
				'<span data-if="THOUSANDS !== 0">\color{<var>PINK</var>}{<var>THOUSANDS</var>}</span>'+
				'\color{<var>ORANGE</var>}{<var>HUNDREDS</var>}'+
				'\color{<var>GREEN</var>}{<var>TENS</var>}'+
				'\color{<var>BLUE</var>}{<var>ONES</var>}.'+
				'\color{purple}{<var>TENTHS</var>}'+
				'\color{gray}{<var>HUNDREDTHS</var>}'+
				'<span data-if="THOUSANDTHS !== 0">\color{brown}{<var>THOUSANDTHS</var>}</span>'+
				'}'+
			'</code>'+
			'is the same as'+
			'<code>\large{'+
				'<span data-if="THOUSANDS !== 0">\color{<var>PINK</var>}{<var>THOUSANDS</var>000} + </span>'+
				'<span data-if="HUNDREDS !== 0">\color{<var>ORANGE</var>}{<var>HUNDREDS</var>00} + </span>'+
				'<span data-if="TENS !== 0">\color{<var>GREEN</var>}{<var>TENS</var>0} + </span>'+
				'<span data-if="ONES !== 0">\color{<var>BLUE</var>}{<var>ONES</var>} + </span>'+
				'<span data-if="TENTHS !== 0">\color{purple}{0.<var>TENTHS</var>} + </span>'+
				'<span data-if="HUNDREDTHS !== 0">\color{gray}{0.0<var>HUNDREDTHS</var>}</span>'+
				'<span data-if="THOUSANDTHS !== 0"> + \color{brown}{0.00<var>THOUSANDTHS</var>}</span>'+
			'}</code>.',
		"hint2"		: '<code>\large{\color{<var>PINK</var>}{<var>THOUSANDS</var>000}}</code> is the same as <code>\large{\color{<var>PINK</var>}{<var>THOUSANDS</var>}}</code>'+
		'<var>plural( "thousand", THOUSANDS )</var>, the place value four places to the left of the decimal point.',
		"hint3"		: 'Because there is no number in the <span class="hint_pink">thousands</span> place, you dont need any <span class="hint_pink">thousands</span>.',
		"hint4"		: '<code>\large{\color{<var>ORANGE</var>}{<var>HUNDREDS</var>00}}</code> is the same as <code>\large{\color{<var>ORANGE</var>}{<var>HUNDREDS</var>}}</code>'+
			'<var>plural( "hundred", HUNDREDS )</var>, the place value three places to the left of the decimal point.',
		"hint5"		: 'Because the <span class="hint_orange">hundreds</span> place is <code class="hint_orange">\large{0}</code>, you dont need any <span class="hint_orange">hundreds</span>.',
		"hint6"		: '<code>\large{\color{<var>GREEN</var>}{<var>TENS</var>0}}</code> is the same as <code>\large{\color{<var>GREEN</var>}{<var>TENS</var>}}</code>'+
			'<var>plural( "ten", TENS )</var>, the place value two places to the left of the decimal point.',
		"hint7"		: 'Because the <span class="hint_green">tens</span> place is <code class="hint_green">\large{0}</code>, you dont need any <span class="hint_green">tens</span>.',
		"hint8"		: '<code>\large{\color{<var>BLUE</var>}{<var>ONES</var>}}</code> is the same as <code>\large{\color{<var>BLUE</var>}{<var>ONES</var>}}</code>'+
			'<var>plural( "one", ONES )</var>, the place value one place to the left of the decimal point.',
		"hint9"		: 'Because the <span class="hint_blue">ones</span> place is <code class="hint_blue">\large{0}</code>, you dont need any <span class="hint_blue">ones</span>.',
		"hint10"	: '<code>\large{\color{purple}{0.<var>TENTHS</var>}}</code> is the same as <code>\large{\color{purple}{<var>TENTHS</var>}}</code>'+
			'<var>plural( "tenth", TENTHS )</var>, the place value one place to the right of the decimal point.',
		"hint11"	: 'Because the <span class="hint_purple">tenths</span> place is <code class="hint_purple">\large{0}</code>, you dont need any <span class="hint_purple">tenths</span>.',
		"hint12"	: '<code>\large{\color{gray}{0.0<var>HUNDREDTHS</var>}}</code> is the same as <code>\large{\color{gray}{<var>HUNDREDTHS</var>}}</code>'+
			'<var>plural("hundredth", HUNDREDTHS )</var>, the place value two places to the right of the decimal point.',
		"hint13"	: 'Because the <span class="hint_gray">hundreds</span> place is <code class="hint_gray">\large{0}</code>, you dont need any <span class="hint_gray">hundreds</span>.',
		"hint14"	: '<code>\large{\color{#a52a2a}{0.00<var>THOUSANDTHS</var>}}</code> is the same as <code>\large{\color{#a52a2a}{<var>THOUSANDTHS</var>}}</code>'+
			'<var>plural("thousandth", THOUSANDTHS )</var>, the place value three places to the right of the decimal point.',
		"hint15"	: 'Therefore you need'+
			'<span data-if="THOUSANDS !== 0"><code>\large{\color{<var>PINK</var>}{<var>THOUSANDS</var>}}</code> <var>plural( "thousand", THOUSANDS )</var>, </span>'+
			'<span data-if="HUNDREDS !== 0"><code>\large{\color{<var>ORANGE</var>}{<var>HUNDREDS</var>}}</code> <var>plural( "hundred", HUNDREDS )</var>, </span>'+
			'<span data-if="TENS !== 0"><code>\large{\color{<var>GREEN</var>}{<var>TENS</var>}}</code> <var>plural( "ten", TENS )</var>, </span>'+
			'<span data-if="ONES !== 0"><code>\large{\color{<var>BLUE</var>}{<var>ONES</var>}}</code> <var>plural( "one", ONES )</var>, </span>'+
			'<span data-if="TENTHS !== 0"><code>\large{\color{purple}{<var>TENTHS</var>}}</code> <var>plural( "tenth", TENTHS )</var>, </span>'+
			'<span data-if="THOUSANDTHS === 0" data-unwrap>'+
				'and <code>\large{\color{gray}{<var>HUNDREDTHS</var>}}</code> <var>plural( "hundredth", HUNDREDTHS )</var>.'+
			'</span>'+
			'<span data-else data-unwrap>'+
				'<span data-if="HUNDREDTHS !== 0"><code>\large{\color{gray}{<var>HUNDREDTHS</var>}}</code> <var>plural( "hundredth", HUNDREDTHS )</var>, </span>'+
				'and <code>\large{\color{#a52a2a}{<var>THOUSANDTHS</var>}}</code> <var>plural( "thousandth", THOUSANDTHS )</var>.'+
			'</span>',
					"hint15"	: '<span data-if="HUNDREDTHS !== 0"><code>\large{\color{gray}{<var>HUNDREDTHS</var>}}</code> <var>plural( "hundredth", HUNDREDTHS )</var>, </span>'+
				'and <code>\large{\color{#a52a2a}{<var>THOUSANDTHS</var>}}</code> <var>plural( "thousandth", THOUSANDTHS )</var>.'
		}
})