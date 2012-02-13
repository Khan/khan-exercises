({
	"nl" : {
		"question1"	: 'Uitgaande van de volgende hoeken:'+
						'<ul>'+
							'<li>'+
								'<code>\\overline{AB} \\perp \\overline{CD}</code>,'+
								'lijnen AB en CD staan loodrecht op elkaar.'+
							'</li>'+
							'<li>'+
								'<span data-if="RAND3===0">'+
									'<code>\\color{green}{\\angle{CGE}} = <var>ACCUTEANGLE</var>&deg;</code>'+
								'</span>'+
								'<span data-else-if="RAND3===1">'+
									'<code>\\color{green}{\\angle{AGF}} = <var>90 - ACCUTEANGLE</var>&deg;</code>'+
								'</span>'+
								'<span data-else>'+
									'<code>\\color{green}{\\angle{DGF}} = <var>ACCUTEANGLE</var>&deg;</code>'+
								'</span>'+
							'</li>'+
						'</ul>'+
						'Hoe groot is'+
						'<span data-if="RAND3 === 0"><code>\\color{blue}{\\angle{AGF}} = {?}</code></span>'+
						'<span data-else-if="RAND3 === 1"><code>\\color{blue}{\\angle{CGE}} = {?}</code></span>'+
						'<span data-else><code>\\color{blue}{\\angle{BGE}} = {?}</code></span>',
		"question2"	: '<p>Uitgaande van:</p>'+
						'<div data-if="RAND2===0">'+
							'<ul>'+
								'<li><code>\\color{purple}{\\angle{ABC}} = <var>Tri_Z</var>&deg;</code></li>'+
								'<li><code>\\color{green}{\\angle{ACB}} = <var>Tri_Y</var>&deg;</code></li>'+
							'</ul>'+
							'<p>Hoe groot is <code>\\color{blue}{\\angle{DAB}}</code>?</p>'+
						'</div>'+
						'<div data-else>'+
							'<ul>'+
								'<li><code>\\color{purple}{\\angle{ABC}} = <var>Tri_Z</var>&deg;</code></li>'+
								'<li><code>\\color{green}{\\angle{DAB}} = <var>180 - Tri_X</var>&deg;</code></li>'+
							'</ul>'+
							'<p>Hoe groot is <code>\\color{blue}{\\angle{ACB}}</code>?</p>',
		"question3"	: 'Uitgaande van:'+
							'<ul>'+
								'<li><code>\\overline{HI} \\parallel \\overline{JK}</code>,'+
								'lijnen HI en JK lopen evenwijdig.</li>'+
								'<li data-if="RAND3 == 0 || RAND3 == 1">'+
									'<code>\\color{purple}{\\angle{BAC}} = <var>Tri_X</var>&deg;</code>'+
								'</li>'+
								'<li data-else>'+
									'<code>\\color{purple}{\\angle{AKJ}} = <var>Tri_Y</var>&deg;</code>'+
								'</li>'+

								'<li data-if="RAND3 == 0">'+
									'<code>\\color{green}{\\angle{AJK}} = <var>Tri_Z</var>&deg;</code>'+
								'</li>'+
								'<li data-else>'+
									'<code>\\color{green}{\\angle{AHI}} = <var>Tri_Z</var>&deg;</code>'+
								'</li>'+

							'</ul>'+

							'Hoe groot is'+
							'<code data-if="RAND3 === 0">\\color{blue}{\\angle{AIH}} = {?}</code>'+
							'<code data-else-if="RAND3 === 1">\\color{blue}{\\angle{AKJ}} = {?}</code>'+
							'<code data-else>\\color{blue}{\\angle{BAC}} = {?}</code>',
		"question4"	: 'Uitgaande van:'+
						'<ul>'+
							'<li><code>\\overline{DE} \\parallel \\overline{FG}</code>,'+
							'lijnen DE en FG zijn evenwijdig.</li>'+
							'<li><code>\\overline{KL} \\perp \\overline{DE}</code>,'+
							'Lijnen KL en DE staan loodrecht op elkaar.</li>'+
							'<li data-if="RAND2 === 0">'+
								'<code>\\color{green}{\\angle{GCJ}} = <var>Tri_Y</var>&deg;</code>'+
							'</li>'+
							'<li data-else>'+
								'<code>\\color{green}{\\angle{IAK}} = <var>Tri_Y</var>&deg;</code>'+
							'</li>'+
						'</ul>'+
						'What is'+
						'<span data-if="RAND2 === 0"><code>\\color{blue}{\\angle{IAK}} = {?}</code></span>'+
						'<span data-else><code>\\color{blue}{\\angle{GCJ}} = {?}</code></span>',
		
		"note1"     : '<strong>NOTE:</strong> Hoeken zijn niet noodzakelijkerwijs op schaal getekend.',
		"note2"     : '<strong>NOTE:</strong> Hoeken zijn niet noodzakelijkerwijs op schaal getekend.',
		"note3"     : '<strong>NOTE:</strong> Hoeken zijn niet noodzakelijkerwijs op schaal getekend.',
		"note4" 	: '<strong>NOTE:</strong> Hoeken zijn niet noodzakelijkerwijs op schaal getekend.',
		
		"hint1"		: 'Omdat we weten dat <code>\\overline{AB} \\perp \\overline{CD}</code>, weten we dat '+
						'<code>\\color{purple}{\\angle{CGB}} = 90&deg;</code>'+
						'<span class="graphie" data-update="complementary-and-opposite">'+
							'label( [2.2, 1.7], "\\\\color{purple}{90&deg;}", '+
								'"above right" );'+
							'arc( [0, 0], 3, 0, 90, { stroke: "purple" } );'+
						'</span>',
		"hint2"		: '<code>\\color{orange}{\\angle{EGB}} = \\color{green}{\\angle{AGF}}'+
							'= <var>90 - ACCUTEANGLE</var>&deg;</code>,'+
						'omdat het overstaande hoeken van elkaar zijn.  Overstaande hoeken '+
						'zijn congruent (gelijk).'+
						'<span class="graphie" data-update="complementary-and-opposite">'+
							'label( [1.2, 0], "\\\\color{orange}{<var>90 - ACCUTEANGLE</var>&deg;}", '+
							'	"above right" );'+
							'arc( [0, 0], 1.2, 0, 68, { stroke: "orange" } );'+
						'</span>',
		"hint3"		: 'Omdat we weten dat <code>\\overline{AB} \\perp \\overline{CD}</code>, weten we dat '+
						'<code>\\color{purple}{\\angle{AGD}} = 90&deg;</code>'+
						'<span class="graphie" data-update="complementary-and-opposite">'+
							'label( [-2.2, -1.7], "\\\\color{purple}{90&deg;}", '+
								'"below left" );'+
							'arc( [0, 0], 3, 180, 270, { stroke: "purple" } );'+
						'</span>',
		"hint4"		: '<code>\\color{orange}{\\angle{EGB}} = \\color{purple}{90&deg;} '+
							'- \\color{green}{\\angle{CGE}} = <var>90 - ACCUTEANGLE</var>&deg;</code>'+
						'<span class="graphie" data-update="complementary-and-opposite">'+
							'label( [1.2, 0], "\\\\color{orange}{<var>90 - ACCUTEANGLE</var>&deg;}", '+
							'	"above right" );'+
							'arc( [0, 0], 1.2, 0, 68, { stroke: "orange" } );'+
						'</span>',
		"hint5"		: 'Because we know <code>\\overline{AB} \\perp \\overline{CD}</code>, we know '+
						'<code>\\color{purple}{\\angle{CGB}} = 90&deg;</code>'+
						'<span class="graphie" data-update="complementary-and-opposite">'+
							'label( [2.2, 1.7], "\\\\color{purple}{90&deg;}", '+
								'"above right" );'+
							'arc( [0, 0], 3, 0, 90, { stroke: "purple" } );'+
						'</span>',
		"hint6"		: '<code>\\color{orange}{\\angle{AGF}} = '+
							'\\color{purple}{90&deg;} - \\color{green}{\\angle{DGF}} = '+
							'<var>90 - ACCUTEANGLE</var>&deg;</code>'+
						'<span class="graphie" data-update="complementary-and-opposite">'+
							'label( [-1.2, 0], "\\\\color{orange}{<var>90 - ACCUTEANGLE</var>&deg;}", '+
								'"below left" );'+
							'arc( [0, 0], 1.2, 180, 248, { stroke: "orange" } );'+
						'</span>',
		"hint7"		: '<code>\\color{blue}{\\angle{AGF}} = \\color{orange}{\\angle{EGB}} ='+
						'<var>90 - ACCUTEANGLE</var>&deg;</code>, '+
						'omdat het overstaande hoeken van elkaar zijn.  Overstaande hoeken '+
						'zijn congruent (gelijk).'+
						'<span class="graphie" data-update="complementary-and-opposite">'+
							'ORIGINAL_LABEL.remove();'+
							'label( [-1.2, -0.75], '+
								'"\\\\color{blue}{\\\\angle{AGF}}=<var>90 - ACCUTEANGLE</var>&deg;", '+
								'"below left" );',
		"hint8"		: '<code>\\color{blue}{\\angle{CGE}} = '+
							'\\color{purple}{90&deg;} - \\color{orange}{\\angle{EGB}} = '+
							'<var>ACCUTEANGLE</var>&deg;'+
						'</code>'+
						'<span class="graphie" data-update="complementary-and-opposite">'+
							'ORIGINAL_LABEL.remove();'+
							'label( [0.5, 1.8], '+
								'"\\\\color{blue}{\\\\angle{CGE}} = <var>ACCUTEANGLE</var>&deg;", '+
								'"above" )'+
						'</span>',
		"hint9"		: '<code>\\color{blue}{\\angle{BGE}} = \\color{orange}{\\angle{AGF}} = '+
						'<var>90 - ACCUTEANGLE</var>&deg;</code>, '+
						'omdat het overstaande hoeken van elkaar zijn.  Overstaande hoeken '+
						'zijn congruent (gelijk)..'+
						'<span class="graphie" data-update="complementary-and-opposite">'+
							'ORIGINAL_LABEL.remove();'+
							'label( [1.5, 0], '+
								'"\\\\color{blue}{\\\\angle{BGE}} = <var>90 - ACCUTEANGLE</var>&deg;", '+
								'"above right" );'+
						'</span>',
		"hint10"	: '<code>'+
							'\\color{orange}{\\angle{BAC}} = '+
								'180&deg; - \\color{purple}{\\angle{ABC}} - \\color{green}{\\angle{ACB}} = '+
								'<var>180 - Tri_Y - Tri_Z</var>&deg;'+
						'</code>,'+
							'Omdat de hoeken binnen een driehoek bij elkaar 180&deg; zijn.'+
						'<span class="graphie" data-update="supplementary-and-triangle">'+
							'label( [-3.3, -2], "\\\\color{orange}{<var>Tri_X</var>&deg;}",'+
								'"above right" );'+
							'arc( [-4, -2], 0.75, 0, 49, {stroke: "orange"} );'+
						'</span>',
		"hint11"	: '<code>'+
							'\\color{orange}{\\angle{BAC}} = '+
								'180&deg; - \\color{green}{\\angle{DAB}} = '+
								'<var>180 - Tri_Y - Tri_X</var>&deg;'+
						'</code>,'+
							'omdat supplementaire hoeken samen 180&deg; zijn.'+
						'<span class="graphie" data-update="supplementary-and-triangle">'+
							'label( [-3.3, -2], "\\\\color{orange}{<var>Tri_X</var>&deg;}",'+
								'"above right" );'+
							'arc( [-4, -2], 0.75, 0, 49, {stroke: "orange"} );'+
						'</span>',
		"hint12"	: '<code>'+
							'\\color{blue}{\\angle{DAB}} = '+
								'180&deg; - \\color{orange}{\\angle{BAC}} = '+
								'<var>Tri_Y + Tri_Z</var>&deg;'+
						'</code>, '+
						'omdat supplementaire hoeken samen 180&deg; zijn'+
						'<span class="graphie" data-update="supplementary-and-triangle">'+
							'ORIGINAL_LABEL.remove();'+
							'label( [-4.7, -2], '+
								'"\\\\color{blue}{\\\\angle{DAB}} = <var>Tri_Y + Tri_Z</var>&deg;", '+
								'"above left" );'+
						'</span>',
		"hint13"	: '<code>'+
							'\\color{blue}{\\angle{ACB}} = '+
								'180&deg; - \\color{orange}{\\angle{BAC}} - \\color{purple}{\\angle{ABC}} = '+
								'<var>Tri_Y</var>&deg;'+
						'</code>,'+
						'omdat de hoeken binnen een driehoek bij elkaar 180&deg; zijn.'+
						'<span class="graphie" data-update="supplementary-and-triangle">'+
							'ORIGINAL_LABEL.remove();'+
							'label( [2.80, -2], '+
								'"\\\\color{blue}{\\\\angle{ACB}} = <var>Tri_Y</var>&deg;", '+
								'"above left" );'+
						'</span>',
		"hint14"	: '<code>\\color{orange}{\\angle{AHI}} = \\color{green}{\\angle{AJK}}</code>, '+
						'omdat het because they are overeenkomende hoeken formed by 2 parallel lines and '+
						'a transversal line. Overeenkomende hoeken zijn congruent (gelijk).'+
						'<span class="graphie" data-update="parallel-and-triangle">'+
							'label( [-4.60, 0.75], "\\\\color{orange}{<var>Tri_Z</var>&deg;}", '+
								'"below" );'+
							'arc( [-5.07, 1.75], 1, 260, 325, {stroke: "orange"} );'+
						'</span>',
		"hint15"	: '<code>\\color{orange}{\\angle{AJK}} = \\color{green}{\\angle{AHI}}</code>, '+
						'omdat het overeenkomende hoeken zijn, gevormd door twee evenwijdige lijnen die '+
						'worden doorsneden door een derde lijn. Overeenkomende hoeken zijn congruent (gelijk).'+
						'<span class="graphie" data-update="parallel-and-triangle">'+
							'label( [-4.00, 4.25], "\\\\color{orange}{<var>Tri_Z</var>&deg;}", '+
								'"below" );'+
							'arc( [-4.47, 5.25], 1, 257, 325, {stroke: "orange"} );'+
						'</span>',
		"hint16"	: '<code>'+
							'\\color{blue}{\\angle{AIH}} = '+
								'180&deg; - \\color{orange}{\\angle{AHI}} - \\color{purple}{\\angle{BAC}} = '+
								'<var>180 - Tri_X - Tri_Z</var>&deg; '+
						'</code>,'+
						'omdat de 3 hoeken samen de <code>\\triangle{AHI}</code> vormen. '+
						'De hoeken binnen een driehoek zijn bij elkaar 180&deg;.'+
						'<span class="graphie" data-update="parallel-and-triangle">'+
							'ORIGINAL_LABEL.remove();'+
							'label( [0, -2.50], '+
								'"\\\\color{blue}{\\\\angle{AIH}} = <var>180 - Tri_X - Tri_Z</var>&deg;", '+
								'"left" ); '+
						'</span>',
		"hint17"	: '<span class="graphie" data-update="parallel-and-triangle">'+
							'ORIGINAL_LABEL.remove(); '+
							'if ( RAND3 === 1 ) {'+
								'label( [3.3, -2.6], '+
									'"\\\\color{blue}{\\\\angle{AKJ}} = <var>Tri_Y</var>&deg;", '+
									'"above" );'+
							'} else {'+
								'label( [-5.5, -3.5], '+
									'"\\\\color{blue}{\\\\angle{BAC}} = <var>Tri_X</var>&deg;", '+
									'"above right" );'+
							'}'+
						'</span>'+
						'<code data-if="RAND3 === 1">'+
							'\\color{blue}{\\angle{AKJ}} = '+
								'180&deg; - \\color{orange}{\\angle{AJK}} - \\color{purple}{\\angle{BAC}} = '+
								'<var>Tri_Y</var>&deg; '+
						'</code>'+
						'<code data-else>'+
							'\\color{blue}{\\angle{BAC}} = '+
								'180&deg; - \\color{orange}{\\angle{AJK}} - \\color{purple}{\\angle{AKJ}} = '+
								'<var>Tri_X</var>&deg;'+
						'</code>, '+
						'omdat de 3 hoeken samen de <code>\\triangle{AJK}</code> vormen. '+
						'De hoeken binnen een driehoek zijn bij elkaar 180&deg;.',
		"hint18"	: '<code>\\color{orange}{\\angle{DAI}} = \\color{green}{\\angle{GCJ}} = '+
						'<var>Tri_Y</var>&deg;</code>, '+
						'because they are alternate exterior angles, formed by 2 parallel lines '+
						'and a transversal line, they are congruent (equal).'+
						'<span class="graphie" data-update="alternate-exterior-and-complementary">'+
							'label( [-.80, 2], "\\\\color{orange}{<var>Tri_Y</var>&deg;}", '+
								'"above left" );'+
							'arc( [0, 2], 1, 135, 180, {stroke: "orange"} );'+
						'</span>'+
						'Alternatively, you can pair up using overstaande hoeken and alternate interior'+
						'angles to achieve the same result (as seen using '+
						'<code>\\color{pink}{pink}</code>).'+
						'<span class="graphie" data-update="alternate-exterior-and-complementary">'+
							'label( [1, 2], "\\\\color{pink}{<var>Tri_Y</var>&deg;}", '+
								'"below right" );'+
							'arc( [0, 2], 1, 315, 360, {stroke: "pink"} );'+
							'label( [3, -2], "\\\\color{pink}{<var>Tri_Y</var>&deg;}", '+
								'"above left" );'+
							'arc( [4, -2], 1, 135, 180, {stroke: "pink"} );'+
						'</span>',
		"hint19"	: '<code>\\color{purple}{\\angle{DAK}} = 90&deg;</code>,  '+
						'omdat de hoek gevormd door twee lijnen die loodrecht op elkaar staan gelijk is aan 90&deg;.'+
						'<span class="graphie" data-update="alternate-exterior-and-complementary">'+
							'label( [-1.68, 2], "\\\\color{purple}{90&deg;}", "above left" );'+
							'arc( [0, 2], 1.65, 90, 180, {stroke: "purple"} );'+
						'</span>',
		"hint20"	: '<code>\\color{blue}{\\angle{IAK}} = 90&deg; - \\color{orange}{\\angle{DAI}} = '+
						'<var>90 - Tri_Y</var>&deg;</code>, '+
 						'omdat de hoeken <code>\\color{blue}{\\angle{IAK}}</code> '+
 						'en <code>\\color{orange}{\\angle{DAI}}</code> samen de hoek '+
 						'<code>\\color{purple}{\\angle{DAK}}</code> vormen.'+
 						'<span class="graphie" data-update="alternate-exterior-and-complementary">'+
							'ORIGINAL_LABEL.remove();'+
							'label( [0, 3.5], '+
								"\\\\color{blue}{\\\\angle{IAK}} = <var>90 - Tri_Y</var>&deg;", '+
								"above left" );							'+
						'</span>',
		"hint21"	: '<code>\\color{orange}{\\angle{IAK}} = 90&deg; - \\color{green}{\\angle{IAK}} = '+
						'<var>90 - Tri_Y</var>&deg;</code>, '+
						'omdat de hoeken <code>\\color{green}{\\angle{IAK}}</code> '+
						'en <code>\\color{orange}{\\angle{DAI}}</code> samen de hoek '+
						'<code>\\color{purple}{\\angle{DAK}}</code> vormen.'+
						'<span class="graphie" data-update="alternate-exterior-and-complementary">'+
							'label( [-.80, 2], "\\\\color{orange}{<var>90-Tri_Y</var>&deg;}", '+
								"above left" );'+
							'arc( [0, 2], 1, 135, 180, {stroke: "orange"} );'+
						'</span>',
		"hint22"	: '<code>\\color{blue}{\\angle{GCJ}} = \\color{orange}{\\angle{DAI}} = '+
						'<var>90 - Tri_Y</var>&deg;</code>,  '+
						'because they are alternate exterior angles formed by 2 parallel lines '+
						'and a transversal line, they are congruent (equal).'+

						'Alternatively, you can pair up using overstaande hoeken and alternate interior'+
						'angles to achieve the same result (as seen using '+
						'<code>\\color{pink}{pink}</code>).'+
						'<span class="graphie" data-update="alternate-exterior-and-complementary">'+
						'	label( [1, 2], "\\\\color{pink}{<var>90-Tri_Y</var>&deg;}", '+
							'	"below right" );'+
							'arc( [0, 2], 1, 315, 360, {stroke: "pink"} );'+
							'label( [3, -2], "\\\\color{pink}{<var>90-Tri_Y</var>&deg;}", '+
								'"above left" );'+
							'arc( [4, -2], 1, 135, 180, {stroke: "pink"} );'+
							
							'ORIGINAL_LABEL.remove();'+
							'label( [4.75, -2], '+
								'"\\\\color{blue}{\\\\angle{GCJ} = <var>90-Tri_Y</var>&deg;}", '+
								'"below right" );'+
						'</span>'
		}
})