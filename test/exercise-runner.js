var Khan = Khan || {};

jQuery.extend(Khan, {
	testExercise: function( json ) {
		var exerciseName = json.exercise;
		var iframe;
		var makeProblem;

		var testsRemaining = json.problems.length;
		module( exerciseName, {
			setup: function() {
				if ( typeof iframe === "undefined" ) {
					iframe = jQuery( "<iframe>" ).hide().appendTo( "body" );

					// Wait for the first problem to be made but throw it out
					stop();
					jQuery( document ).one( "problemLoaded", function( e, mp ) {
						makeProblem = mp;
						start();
					} );
					iframe.attr( "src", "../exercises/" + exerciseName + ".html" );
				}
			},

			teardown: function() {
				if ( --testsRemaining <= 0 ) {
					iframe.remove();
				}
			}
		});

		jQuery.each( json.problems, function( index, problem, next ) {
			asyncTest( problem.type + " / " + problem.seed, function() {
				var iwindow = iframe[0].contentWindow;
				var iKhan = iwindow.Khan;

				var varCount = 0;
				for ( var key in problem.VARS ) {
					varCount++;
				}

				expect( varCount + 2 );

				jQuery( document ).one( "problemLoaded", function( e, mp, solution ) {
					var VARS = iwindow.jQuery.tmpl.VARS;

					for ( var key in problem.VARS ) {
						// Removes unserializable properties like functions (e.g., on polynomial objects)
						var vark = VARS[key] == null ? VARS[key] : JSON.parse( JSON.stringify( VARS[key] ) );
						deepEqual( vark, problem.VARS[key], "var " + key );
					}

					deepEqual( solution, problem.solution, "solution" );
					strictEqual( problem.pass, true, "pass" );

					start();
				} );

				makeProblem( problem.type, problem.seed );
			} );
		} );
	}
});