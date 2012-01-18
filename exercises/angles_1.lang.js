({
	"nl" : {
		"question1"	: 'Given the following angles:'+
						'<ul>'+
							'<li>'+
								'<code>\overline{AB} \perp \overline{CD}</code>,'+
								'lines AB and CD are perpendicular.'+
							'</li>'+
							'<li>'+
								'<span data-if="RAND3===0">'+
									'<code>\color{green}{\angle{CGE}} = <var>ACCUTEANGLE</var>&deg;</code>'+
								'</span>'+
								'<span data-else-if="RAND3===1">'+
									'<code>\color{green}{\angle{AGF}} = <var>90 - ACCUTEANGLE</var>&deg;</code>'+
								'</span>'+
								'<span data-else>'+
									'<code>\color{green}{\angle{DGF}} = <var>ACCUTEANGLE</var>&deg;</code>'+
								'</span>'+
							'</li>'+
						'</ul>'+
						'What is'+
						'<span data-if="RAND3 === 0"><code>\color{blue}{\angle{AGF}} = {?}</code></span>'+
						'<span data-else-if="RAND3 === 1"><code>\color{blue}{\angle{CGE}} = {?}</code></span>'+
						'<span data-else><code>\color{blue}{\angle{BGE}} = {?}</code></span>',
		"question2"	: '<p>Given the following:</p>'+
						'<div data-if="RAND2===0">'+
							'<ul>'+
								'<li><code>\color{purple}{\angle{ABC}} = <var>Tri_Z</var>&deg;</code></li>'+
								'<li><code>\color{green}{\angle{ACB}} = <var>Tri_Y</var>&deg;</code></li>'+
							'</ul>'+
							'<p>What is <code>\color{blue}{\angle{DAB}}</code>?</p>'+
						'</div>'+
						'<div data-else>'+
							'<ul>'+
								'<li><code>\color{purple}{\angle{ABC}} = <var>Tri_Z</var>&deg;</code></li>'+
								'<li><code>\color{green}{\angle{DAB}} = <var>180 - Tri_X</var>&deg;</code></li>'+
							'</ul>'+
							'<p>What is <code>\color{blue}{\angle{ACB}}</code>?</p>',
		"question3"	: 'Given the following:'+
							'<ul>'+
								'<li><code>\overline{HI} \parallel \overline{JK}</code>,'+
								'lines HI and JK are parallel.</li>'+
								'<li data-if="RAND3 == 0 || RAND3 == 1">'+
									'<code>\color{purple}{\angle{BAC}} = <var>Tri_X</var>&deg;</code>'+
								'</li>'+
								'<li data-else>'+
									'<code>\color{purple}{\angle{AKJ}} = <var>Tri_Y</var>&deg;</code>'+
								'</li>'+

								'<li data-if="RAND3 == 0">'+
									'<code>\color{green}{\angle{AJK}} = <var>Tri_Z</var>&deg;</code>'+
								'</li>'+
								'<li data-else>'+
									'<code>\color{green}{\angle{AHI}} = <var>Tri_Z</var>&deg;</code>'+
								'</li>'+

							'</ul>'+

							'What is'+
							'<code data-if="RAND3 === 0">\color{blue}{\angle{AIH}} = {?}</code>'+
							'<code data-else-if="RAND3 === 1">\color{blue}{\angle{AKJ}} = {?}</code>'+
							'<code data-else>\color{blue}{\angle{BAC}} = {?}</code>',
		"question4"	: 'Given the following:'+
						'<ul>'+
							'<li><code>\overline{DE} \parallel \overline{FG}</code>,'+
							'lines DE and FG are parallel.</li>'+
							'<li><code>\overline{KL} \perp \overline{DE}</code>,'+
							'Lines KL and DE are perpendicular.</li>'+
							'<li data-if="RAND2 === 0">'+
								'<code>\color{green}{\angle{GCJ}} = <var>Tri_Y</var>&deg;</code>'+
							'</li>'+
							'<li data-else>'+
								'<code>\color{green}{\angle{IAK}} = <var>Tri_Y</var>&deg;</code>'+
							'</li>'+
						'</ul>'+
						'What is'+
						'<span data-if="RAND2 === 0"><code>\color{blue}{\angle{IAK}} = {?}</code></span>'+
						'<span data-else><code>\color{blue}{\angle{GCJ}} = {?}</code></span>',
		
		"note1"     : '<strong>NOTE:</strong> Angles not necessarily drawn to scale.',
		"note2"     : '<strong>NOTE:</strong> Angles not necessarily drawn to scale.',
		"note3"     : '<strong>NOTE:</strong> Angles not necessarily drawn to scale.',
		"note4" 	: '<strong>NOTE:</strong> Angles not necessarily drawn to scale.',
		
		"hint1"		: 'Because we know <code>\overline{AB} \perp \overline{CD}</code>, we know '+
						'<code>\color{purple}{\angle{CGB}} = 90&deg;</code>'+
						'<span class="graphie" data-update="complementary-and-opposite">'+
							'label( [2.2, 1.7], "\\color{purple}{90&deg;}", '+
								'"above right" );'+
							'arc( [0, 0], 3, 0, 90, { stroke: "purple" } );'+
						'</span>',
		"hint2"		: '<code>\color{orange}{\angle{EGB}} = \color{green}{\angle{AGF}}'+
							'= <var>90 - ACCUTEANGLE</var>&deg;</code>,'+
						'because they are opposite angles from each other.  Opposite angles '+
						'are congruent (equal).'+
						'<span class="graphie" data-update="complementary-and-opposite">'+
							'label( [1.2, 0], "\\color{orange}{<var>90 - ACCUTEANGLE</var>&deg;}", '+
							'	"above right" );'+
							'arc( [0, 0], 1.2, 0, 68, { stroke: "orange" } );'+
						'</span>',
		"hint3"		: 'Because we know <code>\overline{AB} \perp \overline{CD}</code>, we know '+
						'<code>\color{purple}{\angle{AGD}} = 90&deg;</code>'+
						'<span class="graphie" data-update="complementary-and-opposite">'+
							'label( [-2.2, -1.7], "\\color{purple}{90&deg;}", '+
								'"below left" );'+
							'arc( [0, 0], 3, 180, 270, { stroke: "purple" } );'+
						'</span>',
		"hint4"		: '<code>\color{orange}{\angle{EGB}} = \color{purple}{90&deg;} '+
							'- \color{green}{\angle{CGE}} = <var>90 - ACCUTEANGLE</var>&deg;</code>'+
						'<span class="graphie" data-update="complementary-and-opposite">'+
							'label( [1.2, 0], "\\color{orange}{<var>90 - ACCUTEANGLE</var>&deg;}", '+
							'	"above right" );'+
							'arc( [0, 0], 1.2, 0, 68, { stroke: "orange" } );'+
						'</span>',
		"hint5"		: 'Because we know <code>\overline{AB} \perp \overline{CD}</code>, we know '+
						'<code>\color{purple}{\angle{CGB}} = 90&deg;</code>'+
						'<span class="graphie" data-update="complementary-and-opposite">'+
							'label( [2.2, 1.7], "\\color{purple}{90&deg;}", '+
								'"above right" );'+
							'arc( [0, 0], 3, 0, 90, { stroke: "purple" } );'+
						'</span>',
		"hint6"		: '<code>\color{orange}{\angle{AGF}} = '+
							'\color{purple}{90&deg;} - \color{green}{\angle{DGF}} = '+
							'<var>90 - ACCUTEANGLE</var>&deg;</code>'+
						'<span class="graphie" data-update="complementary-and-opposite">'+
							'label( [-1.2, 0], "\\color{orange}{<var>90 - ACCUTEANGLE</var>&deg;}", '+
								'"below left" );'+
							'arc( [0, 0], 1.2, 180, 248, { stroke: "orange" } );'+
						'</span>',
		"hint7"		: '<code>\color{blue}{\angle{AGF}} = \color{orange}{\angle{EGB}} ='+
						'<var>90 - ACCUTEANGLE</var>&deg;</code>, '+
						'because they are opposite from each other.  Opposite angles are '+
						'congruent (equal).'+
						'<span class="graphie" data-update="complementary-and-opposite">'+
							'ORIGINAL_LABEL.remove();'+
							'label( [-1.2, -0.75], '+
								'"\\color{blue}{\\angle{AGF}}=<var>90 - ACCUTEANGLE</var>&deg;", '+
								'"below left" );',
		"hint8"		: '<code>\color{blue}{\angle{CGE}} = '+
							'\color{purple}{90&deg;} - \color{orange}{\angle{EGB}} = '+
							'<var>ACCUTEANGLE</var>&deg;'+
						'</code>'+
						'<span class="graphie" data-update="complementary-and-opposite">'+
							'ORIGINAL_LABEL.remove();'+
							'label( [0.5, 1.8], '+
								'"\\color{blue}{\\angle{CGE}} = <var>ACCUTEANGLE</var>&deg;", '+
								'"above" )'+
						'</span>',
		"hint9"		: '<code>\color{blue}{\angle{BGE}} = \color{orange}{\angle{AGF}} = '+
						'<var>90 - ACCUTEANGLE</var>&deg;</code>, '+
						'because they are opposite from each other.  Opposite angles are '+
						'congruent (equal).'+
						'<span class="graphie" data-update="complementary-and-opposite">'+
							'ORIGINAL_LABEL.remove();'+
							'label( [1.5, 0], '+
								'"\\color{blue}{\\angle{BGE}} = <var>90 - ACCUTEANGLE</var>&deg;", '+
								'"above right" );'+
						'</span>',
		"hint10"	: '<code>'+
							'\color{orange}{\angle{BAC}} = '+
								'180&deg; - \color{purple}{\angle{ABC}} - \color{green}{\angle{ACB}} = '+
								'<var>180 - Tri_Y - Tri_Z</var>&deg;'+
						'</code>,'+
							'This is because angles inside a triangle add up to 180 degrees.'+
						'<span class="graphie" data-update="supplementary-and-triangle">'+
							'label( [-3.3, -2], "\\color{orange}{<var>Tri_X</var>&deg;}",'+
								'"above right" );'+
							'arc( [-4, -2], 0.75, 0, 49, {stroke: "orange"} );'+
						'</span>',
		"hint11"	: '<code>'+
							'\color{orange}{\angle{BAC}} = '+
								'180&deg; - \color{green}{\angle{DAB}} = '+
								'<var>180 - Tri_Y - Tri_X</var>&deg;'+
						'</code>,'+
							'because supplementary angles along a line add up to '+
							'180 degrees.'+
						'<span class="graphie" data-update="supplementary-and-triangle">'+
							'label( [-3.3, -2], "\\color{orange}{<var>Tri_X</var>&deg;}",'+
								'"above right" );'+
							'arc( [-4, -2], 0.75, 0, 49, {stroke: "orange"} );'+
						'</span>',
		"hint12"	: '<code>'+
							'\color{blue}{\angle{DAB}} = '+
								'180&deg; - \color{orange}{\angle{BAC}} = '+
								'<var>Tri_Y + Tri_Z</var>&deg;'+
						'</code>, '+
						'because supplementary angles along a line add up to 180&deg;'+
						'<span class="graphie" data-update="supplementary-and-triangle">'+
							'ORIGINAL_LABEL.remove();'+
							'label( [-4.7, -2], '+
								'"\\color{blue}{\\angle{DAB}} = <var>Tri_Y + Tri_Z</var>&deg;", '+
								'"above left" );'+
						'</span>',
		"hint13"	: '<code>'+
							'\color{blue}{\angle{ACB}} = '+
								'180&deg; - \color{orange}{\angle{BAC}} - \color{purple}{\angle{ABC}} = '+
								'<var>Tri_Y</var>&deg;'+
						'</code>,'+
						'because angles inside a triangle add up to 180&deg;.'+
						'<span class="graphie" data-update="supplementary-and-triangle">'+
							'ORIGINAL_LABEL.remove();'+
							'label( [2.80, -2], '+
								'"\\color{blue}{\\angle{ACB}} = <var>Tri_Y</var>&deg;", '+
								'"above left" );'+
						'</span>',
		"hint14"	: '<code>\color{orange}{\angle{AHI}} = \color{green}{\angle{AJK}}</code>, '+
						'because they are corresponding angles formed by 2 parallel lines and '+
						'a transversal line. Corresponding angles are congruent (equal).'+
						'<span class="graphie" data-update="parallel-and-triangle">'+
							'label( [-4.60, 0.75], "\\color{orange}{<var>Tri_Z</var>&deg;}", '+
								'"below" );'+
							'arc( [-5.07, 1.75], 1, 260, 325, {stroke: "orange"} );'+
						'</span>',
		"hint15"	: '<code>\color{orange}{\angle{AJK}} = \color{green}{\angle{AHI}}</code>, '+
						'because they are corresponding angles formed by 2 parallel lines and '+
						'a transversal line. Corresponding angles are congruent (equal).'+
						'<span class="graphie" data-update="parallel-and-triangle">'+
							'label( [-4.00, 4.25], "\\color{orange}{<var>Tri_Z</var>&deg;}", '+
								'"below" );'+
							'arc( [-4.47, 5.25], 1, 257, 325, {stroke: "orange"} );'+
						'</span>',
		"hint16"	: '<code>'+
							'\color{blue}{\angle{AIH}} = '+
								'180&deg; - \color{orange}{\angle{AHI}} - \color{purple}{\angle{BAC}} = '+
								'<var>180 - Tri_X - Tri_Z</var>&deg; '+
						'</code>,'+
						'because the 3 angles are contained in <code>\triangle{AHI}</code>. '+
						'Angles inside a triangle add up to 180&deg;.'+
						'<span class="graphie" data-update="parallel-and-triangle">'+
							'ORIGINAL_LABEL.remove();'+
							'label( [0, -2.50], '+
								'"\\color{blue}{\\angle{AIH}} = <var>180 - Tri_X - Tri_Z</var>&deg;", '+
								'"left" ); '+
						'</span>',
		"hint17"	: '<span class="graphie" data-update="parallel-and-triangle">'+
							'ORIGINAL_LABEL.remove(); '+
							'if ( RAND3 === 1 ) {'+
								'label( [3.3, -2.6], '+
									'"\\color{blue}{\\angle{AKJ}} = <var>Tri_Y</var>&deg;", '+
									'"above" );'+
							'} else {'+
								'label( [-5.5, -3.5], '+
									'"\\color{blue}{\\angle{BAC}} = <var>Tri_X</var>&deg;", '+
									'"above right" );'+
							'}'+
						'</span>'+
						'<code data-if="RAND3 === 1">'+
							'\color{blue}{\angle{AKJ}} = '+
								'180&deg; - \color{orange}{\angle{AJK}} - \color{purple}{\angle{BAC}} = '+
								'<var>Tri_Y</var>&deg; '+
						'</code>'+
						'<code data-else>'+
							'\color{blue}{\angle{BAC}} = '+
								'180&deg; - \color{orange}{\angle{AJK}} - \color{purple}{\angle{AKJ}} = '+
								'<var>Tri_X</var>&deg;'+
						'</code>, '+
						'because the 3 angles are contained in <code>\triangle{AJK}</code>. '+
						'Angles inside a triangle add up to 180&deg;.',
		"hint18"	: '<code>\color{orange}{\angle{DAI}} = \color{green}{\angle{GCJ}} = '+
						'<var>Tri_Y</var>&deg;</code>, '+
						'because they are alternate exterior angles, formed by 2 parallel lines '+
						'and a transversal line, they are congruent (equal).'+
						'<span class="graphie" data-update="alternate-exterior-and-complementary">'+
							'label( [-.80, 2], "\\color{orange}{<var>Tri_Y</var>&deg;}", '+
								'"above left" );'+
							'arc( [0, 2], 1, 135, 180, {stroke: "orange"} );'+
						'</span>'+
						'Alternatively, you can pair up using opposite angles and alternate interior'+
						'angles to achieve the same result (as seen using '+
						'<code>\color{pink}{pink}</code>).'+
						'<span class="graphie" data-update="alternate-exterior-and-complementary">'+
							'label( [1, 2], "\\color{pink}{<var>Tri_Y</var>&deg;}", '+
								'"below right" );'+
							'arc( [0, 2], 1, 315, 360, {stroke: "pink"} );'+
							'label( [3, -2], "\\color{pink}{<var>Tri_Y</var>&deg;}", '+
								'"above left" );'+
							'arc( [4, -2], 1, 135, 180, {stroke: "pink"} );'+
						'</span>',
		"hint19"	: '<code>\color{purple}{\angle{DAK}} = 90&deg;</code>,  '+
						'because angles formed by perpendicular lines are equal to 90&deg;.'+
						'<span class="graphie" data-update="alternate-exterior-and-complementary">'+
							'label( [-1.68, 2], "\\color{purple}{90&deg;}", "above left" );'+
							'arc( [0, 2], 1.65, 90, 180, {stroke: "purple"} );'+
						'</span>',
		"hint20"	: '<code>\color{blue}{\angle{IAK}} = 90&deg; - \color{orange}{\angle{DAI}} = '+
						'<var>90 - Tri_Y</var>&deg;</code>, '+
 						'because angles <code>\color{blue}{\angle{IAK}}</code> '+
 						'and <code>\color{orange}{\angle{DAI}}</code> make up angle '+
 						'<code>\color{purple}{\angle{DAK}}</code>.'+
 						'<span class="graphie" data-update="alternate-exterior-and-complementary">'+
							'ORIGINAL_LABEL.remove();'+
							'label( [0, 3.5], '+
								"\\color{blue}{\\angle{IAK}} = <var>90 - Tri_Y</var>&deg;", '+
								"above left" );							'+
						'</span>',
		"hint21"	: '<code>\color{orange}{\angle{IAK}} = 90&deg; - \color{green}{\angle{IAK}} = '+
						'<var>90 - Tri_Y</var>&deg;</code>, '+
						'because angles <code>\color{green}{\angle{IAK}}</code> '+
						'and <code>\color{orange}{\angle{DAI}}</code>, make up angle '+
						'<code>\color{purple}{\angle{DAK}}</code>.'+
						'<span class="graphie" data-update="alternate-exterior-and-complementary">'+
							'label( [-.80, 2], "\\color{orange}{<var>90-Tri_Y</var>&deg;}", '+
								"above left" );'+
							'arc( [0, 2], 1, 135, 180, {stroke: "orange"} );'+
						'</span>',
		"hint22"	: '<code>\color{blue}{\angle{GCJ}} = \color{orange}{\angle{DAI}} = '+
						'<var>90 - Tri_Y</var>&deg;</code>,  '+
						'because they are alternate exterior angles formed by 2 parallel lines '+
						'and a transversal line, they are congruent (equal).'+

						'Alternatively, you can pair up using opposite angles and alternate interior'+
						'angles to achieve the same result (as seen using '+
						'<code>\color{pink}{pink}</code>).'+
						'<span class="graphie" data-update="alternate-exterior-and-complementary">'+
						'	label( [1, 2], "\\color{pink}{<var>90-Tri_Y</var>&deg;}", '+
							'	"below right" );'+
							'arc( [0, 2], 1, 315, 360, {stroke: "pink"} );'+
							'label( [3, -2], "\\color{pink}{<var>90-Tri_Y</var>&deg;}", '+
								'"above left" );'+
							'arc( [4, -2], 1, 135, 180, {stroke: "pink"} );'+
							
							'ORIGINAL_LABEL.remove();'+
							'label( [4.75, -2], '+
								'"\\color{blue}{\\angle{GCJ} = <var>90-Tri_Y</var>&deg;}", '+
								'"below right" );'+
						'</span>'
		}
})