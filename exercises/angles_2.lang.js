({
	"nl" : {
		"question1"	: 'Given the following:',
		"question2"	: 'What is <code>\color{blue}{\angle{<var>RAND_SWITCH2 === 0 ? "DAF" : "CAE"</var>}} {?}</code>',
		"question3"	: 'Given the following:',
		"question4"	: 'What is <code>\color{blue}{\angle{<var>RAND_SWITCH2 === 0 ? "GHD" : "CHF"</var>}} {?}</code>',
		"question5"	: 'Given the following:',
		"question6"	: 'What is <code>\color{blue}{\angle{<var>RAND_SWITCH3 === 0 ? "CHE" : ( RAND_SWITCH3 === 1 ? "GHC" : "DHE" )</var>}} {?}</code>',
		"question7" : 'Given the following:',
		"question8" : 'What is <code>\color{blue}{\angle{<var>RAND_SWITCH2 === 0 ? "AJF" : "IHE"</var>}} {?}</code>',
		
		
		"note1"		: '<strong>NOTE:</strong> Angles not drawn to scale.',
		"note2"		: '<strong>NOTE:</strong> Angles not drawn to scale.',
		"note3"		: '<strong>NOTE:</strong> Angles not drawn to scale.',
		"note4"		: '<strong>NOTE:</strong> Angles not drawn to scale.',
		
		"hint1"		: 'Remember that the measure of the angles in a triangle sum to 180&deg;.
						Solve for <code>\color{orange}{\angle{BCA}}</code> by subtracting the
						measures of angles <code>\color{purple}{\angle{BAC}}</code> and
						<code>\color{green}{\angle{ABC}}</code> from 180&deg;.  We find that
						<code>\color{orange}{\angle{BCA}} = <var>Tri_X</var>&deg;</code>.
						<span class="graphie" data-update="tri-and-parallel">
							// label angle BAC
							arc([2.5, 3], .75, 180, 220, { stroke: "orange" });
							label([1.8, 3], "\\color{orange}{<var>Tri_X</var>&deg;}",
								"below left", {color: "orange"});
						</span>',
		"hint2"		: 'Solve for
						<span data-if="RAND_SWITCH2 === 0">
							<code>\color{blue}{\angle{DAF}}</code> by using the fact
							that it is a corresponding angle to
							<span class="graphie" data-update="tri-and-parallel">
								LABEL.remove();
								LABEL = label([-3.3, 0],
									"\\color{blue}{\\angle{DAF}}=<var>Tri_X</var>&deg;",
									"below");
							</span>
						</span>
						<span data-else>
							<code>\color{blue}{\angle{CAE}}</code> by using the fact
							that it is an alternate interior angle to
							<span class="graphie" data-update="tri-and-parallel">
								LABEL.remove();
								LABEL = label([1, 0],
									"\\color{blue}{&ang;CAE} = <var>Tri_X</var>&deg;",
									"above", { color: "blue"});
							</span>
						</span>
						<code>\color{orange}{\angle{BCA}}.</code> That means those
						angles are equal because they are both created by the same
						set of parallel lines <code>\overline{BC}</code>
						and <code>\overline{DE}</code>, and transversal line
						<code>\overline{CF}</code>.',
		"hint3"		: '<code>\color{blue}{\angle{GHD}} = \color{purple}{\angle{EGB}}</code>.
						We know this because they are 2 complementary angles of a set of
						parallel lines bisected by a single line.',
		"hint4"		: 'First solve for <code>\color{orange}{\angle{AGH}}</code>.  We know that
						<code>\color{orange}{\angle{AGH}} = \color{purple}{\angle{EGB}}</code>
						because opposite angles are equal.
						<span class="graphie" data-update="opposite-parallel">
							arc([1,2], .88, 180, 225, {stroke:"orange"});
							label([0,2], "\\color{orange}{<var>X</var>&deg;}", "below left");
						</span>',
		"hint5"		: '<code>\color{blue}{\angle{GHD}} = \color{purple}{\angle{AGH}}</code>
						We know this because they are 2 alternate interior angles of a set of
						parallel lines bisected by a single line.',
		"hint6"		: '<code>\color{blue}{\angle{CHF}} = \color{purple}{\angle{AGH}}</code>.
						We know this because they are 2 corresponding angles of a set of
						parallel lines bisected by a single line.',
		"hint7"		: 'First solve for  <code>\color{orange}{\angle{AGH}}</code>.  We know that
						<code>
							\color{orange}{\angle{AGH}} = 180&deg; - \color{purple}{\angle{BGH}}
						</code>,
						because angles along a line plane add up to 180&deg;.
						<span class="graphie" data-update="opposite-parallel">
							arc([1,2], .88, 180, 225, {stroke:"orange"});
							label([0,2], "\\color{orange}{<var>X</var>&deg;}", "below left");
						</span>',
		"hint8"		: '<code>\color{blue}{\angle{GHD}} = \color{orange}{\angle{AGH}}</code>.
						We know those 2 angles are equal because they are alternate interior angles
						of 2 parallel lines.',
		"hint9"		: '<code>\color{blue}{\angle{CHF}} = \color{orange}{\angle{AGH}}</code>.
						We know those 2 angles are equal because they are corresponding angles
						formed by parallel lines, and a single bisecting lines.',
		"hint10"	: 'Therefore,
						<span data-if="RAND_SWITCH2 == 0">
							<code>\angle{GHD} = <var>X</var>&deg;</code>
							<span class="graphie" data-update="opposite-parallel">
								LABEL.remove();
								label([-2, -2], "\\color{blue}{\\angle{GHD}}=<var>X</var>&deg;",
									"above right");
							</span>
						</span>
						<span data-else>
							<code>\angle{CHF} = <var>X</var>&deg;</code>
							<span class="graphie" data-update="opposite-parallel">
								LABEL.remove();
								label([-4, -2.5], "\\color{blue}{\\angle{CHF}}=<var>X</var>&deg;",
									"below left");
							</span>
						</span>.',
		"hint11"	: '<code>
							\color{purple}{\angle{BHD}} =
							180&deg; - \color{green}{\angle{BDC}} - \color{orange}{\angle{DBE}} =
							<var>Tri1_Z</var>&deg;.
						</code> This is because the interior angles of a triangle add up to 180&deg;.
						<span class="graphie" data-update="star1">
							// label angle BHD
							arc([3.2, 1.3], .75, 118, 220, { stroke: "purple" });
							label([2.6, 2], "\\color{purple}{<var>Tri1_Z</var>^\\circ}",
								"below left");
						</span>',
		"hint12"	: '<p><code>\color{blue}{\angle{CHE}} = \color{purple}{\angle{BHD}}</code>.
						This is because they are opposite each other, and opposite angles are
						equal.</p>
						<p><code>\color{blue}{\angle{CHE}} = <var>Tri1_Z</var>&deg;</code></p>
						<span class="graphie" data-update="star1">
							LABEL.remove();
							label([4.8, 1.0],
								"\\color{blue}{\\angle{CHE}}=<var>Tri1_Z</var>^\\circ",
								"right");
						</span>',
		"hint13"	: '<p>
						<span data-if="RAND_SWITCH3 === 1">
							<code>\color{blue}{\angle{CHG}}</code>
						</span>
						<span data-else>
							<code>\color{blue}{\angle{DHE}}</code>
						</span>
						<code> = 180&deg; - \color{purple}{\angle{BHD}}</code>.
						This is because angles along a line add up to
						180&deg;.
						</p>
						<p>
						<span data-if="RAND_SWITCH3 === 1">
							<code>\color{blue}{\angle{GHC}}</code>
							<span class="graphie" data-update="star1">
								LABEL.remove();
								label([4, 2.5],
									"\\color{blue}{\\angle{GHC}}=<var>180 - Tri1_Z</var>^\\circ",
									"above");
							</span>
						</span>
						<span data-else>
							<code>\color{blue}{\angle{DHE}}</code>
							<span class="graphie" data-update="star1">
								LABEL.remove();
								label([2.5, -0.5],
									"\\color{blue}{\\angle{DHE}}=<var>180 - Tri1_Z</var>^\\circ",
									"below");
							</span>
						</span>
						<code> = <var>180 - Tri1_Z</var>&deg;</code>
						</p>',
		"hint14"	: '<code>\color{purple}{\angle{DIJ}} = 180&deg; - \color{orange}{\angle{AIC}}</code>.
						This is because angles along a line total 180&deg;.
						<span class="graphie" data-update="star2">
							// label angle JID
							arc([0, -1.2], .75, 143, 220, { stroke: "purple" });
							label([-.75, -1.2], "\\color{purple}{<var>Tri2_Z</var>&deg;}",
								"left");
						</span>',
		"hint15"	: '<code>\color{purple}{\angle{HGC}} = 180&deg; - \color{orange}{\angle{FGH}}</code>.
						This is because angles along a line or flat plane total 180&deg;.
						<span class="graphie" data-update="star2">
							// label angle HGC
							arc([1.8, 5], 1, 280, 0, { stroke: "purple" });
							label([2.5, 4.3], "\\color{purple}{<var>Tri2_Z</var>&deg;}",
								"below right");
						</span>',
		"hint16"	: '<code>\color{teal}{\angle{DJI}} = 180&deg; - \color{green}{\angle{BDC}} -
							\color{purple}{\angle{DIJ}}</code>.
						We know this because the sum of angles inside a triangle add up to 180&deg;.
						<span class="graphie" data-update="star2">
							// label angle JID
							arc([-3.2, 1.3], .75, 260, 320, { stroke: "teal" });
							label([-3.2, 0.50], "\\color{teal}{<var>Tri2_X</var>&deg;}",
								"below right");
						</span>',
		"hint17"	: '<code>\color{teal}{\angle{CHG}} = 180&deg; - \color{green}{\angle{ACD}} -
							\color{purple}{\angle{HGC}}</code>.
						We know this, because the sum of angles inside a triangle add up to 180&deg;.
						<span class="graphie" data-update="star2">
							// label angle CHG
							arc([3.2, 1.3], .75, 38, 120, { stroke: "teal" });
							label([3.4, 1.78], "\\color{teal}{<var>Tri2_X</var>&deg;}",
								"above");
						</span>',
		"hint18"	: '<code>\color{blue}{\angle{AJF}} = \color{teal}{\angle{DJI}}</code>.
						We know they are equal because they are opposite angles.',
		"hint19"	: '<code>\color{blue}{\angle{IHE}} = \color{teal}{\angle{CHG}}</code>.
						We know they are equal because they are opposite angles.',
		"hint20"	: 'Therefore,
						<span data-if="RAND_SWITCH2 == 0">
							<code>\angle{AJF} = <var>Tri2_X</var>&deg;</code>
							<span class="graphie" data-update="star2">
								LABEL.remove();
								label([-3.7, 2.5],
									"\\color{blue}{\\angle{AJF}}=<var>Tri2_X</var>&deg;", "above");
							</span>
						</span>
						<span data-else>
							<code>\angle{IHE} = <var>Tri2_X</var>&deg;</code>
							<span class="graphie" data-update="star2">
								LABEL.remove();
								label([4.0, -0.3],
									"\\color{blue}{\\angle{IHE}}=<var>Tri2_X</var>&deg;",
									"below left");
							</span>
						</span>.'
		}
})