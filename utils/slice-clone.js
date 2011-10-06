// Helper for fractions_cut_and_copy_1 and fractions_cut_and_copy_2
jQuery.extend( KhanUtil, {
	passVars: function( d, n_parent, n_offspring ) {
		KhanUtil.d = d;
		KhanUtil.n_parent = n_parent;
		KhanUtil.n_offspring = n_offspring;
		KhanUtil.pieces = 1;
		KhanUtil.times = 1;

		jQuery( "#check-answer-button" ).hide();
	},

	// Add or remove slices
	changePieces: function( increase ) {
		var pieces;

		if ( KhanUtil.pieces === 1 && !increase ) {
			return;
		}

		KhanUtil.pieces += ( increase ) ? 1 : -1;
		pieces = KhanUtil.pieces;

		jQuery( "#pieces" ).text( KhanUtil.plural(pieces, "piece") ); 

		KhanUtil.currentGraph = jQuery( "#problemarea" ).find( "#parent_block" ).data( "graphie" );

		rectchart( [ 1, pieces - 1 ], ["#e00", "#999" ] );
	},

	slice: function() {
		var pieces = KhanUtil.pieces;
		var n_parent = KhanUtil.n_parent;
		var d = KhanUtil.d;

		jQuery( "#slice_pieces" ).html( "<code>" + pieces + "</code>" ).tmpl();
		jQuery( ".slice_fraction" ).each(function( i, elem) {
			var code = jQuery( "<code>" + KhanUtil.fractionReduce(n_parent + d, d * pieces) + "</code>");
			jQuery( elem ).html( code ).tmpl();
		});
		jQuery( "#slice_equation" ).show();

		if ( pieces % ( n_parent + d ) !== 0 ) {
			jQuery( "#slice_explanation" ).show();
			jQuery( "#slice_button" ).val( "Try Again" );
			return;
		} else {
			jQuery( "#slice_explanation" ).hide();
		}

		jQuery( "#slice_controls" ).text( "Slice into " + KhanUtil.plural(pieces, "piece") + "." );
		jQuery( "#cloning" ).show();
		jQuery( "#clone_controls" ).show();

		var graph = KhanUtil.currentGraph = jQuery( "#problemarea" ).find( "#offspring_block" ).data( "graphie" );
		graph.init({ range: [ [ 0, 1 ], [ 0, 1 ] ],scale: [ 600 / pieces, 25 ] });
		rectchart( [ 1, 0 ], ["#e00", "#999" ] );
	},

	changeTimes: function( increase ) {
		var times; 
		var pieces = KhanUtil.pieces;
		var d = KhanUtil.d;
		var n_parent = KhanUtil.n_parent;

		if ( KhanUtil.times === 1 && !increase || KhanUtil.times === pieces && increase ) {
			return;
		}

		KhanUtil.times += ( increase ) ? 1 : -1;
		times = KhanUtil.times;

		jQuery( "#times" ).text( KhanUtil.plural(times, "time") );

		KhanUtil.currentGraph.init({ range: [ [ 0, 1 ], [ 0, 1 ] ],scale: [ 600 / pieces * times, 25 ] });
		rectchart( [ times, 0 ], ["#e00", "#999" ] );
	},

	clone: function() {
		var n_parent = KhanUtil.n_parent;
		var n_offspring = KhanUtil.n_offspring;
		var d = KhanUtil.d;
		var pieces = KhanUtil.pieces;
		var times = KhanUtil.times;

		jQuery( "#clone_times" ).html( "<code>" + times + "</code>" ).tmpl();
		jQuery( ".clone_fraction" ).each(function( i, elem) {
			var code = jQuery( "<code>" + KhanUtil.fractionReduce( ( n_parent + d ) * times, d * pieces ) + "</code>");
			jQuery( elem ).html( code ).tmpl();
		});
		jQuery( "#clone_equation" ).show();

		if ( times / ( pieces / ( n_parent + d ) ) !== n_offspring ) {
			jQuery( "#clone_button" ).val( "Try Again" );
			return;
		}

		rectchart( [ 1, 0 ], [ "#e00", "#999" ] );
		jQuery( "#clone_controls" ).text( "Copy " + KhanUtil.plural(times, "time") + "." );
		jQuery( "#slice_answer input" ).val( n_parent + d );
		jQuery( "#clone_answer input" ).val( n_offspring );
		jQuery( "#check-answer-button" ).click();
	}
});
