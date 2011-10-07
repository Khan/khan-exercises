// Helper for fractions_cut_and_copy_1 and fractions_cut_and_copy_2
jQuery.extend( KhanUtil, {
	mixedOrImproper: function( n, d ) {
		if ( n < d || KhanUtil.rand( 2 ) > 0 ) {
			return KhanUtil.fraction( n, d );
		} else {
			return "1" + KhanUtil.fraction( n - d, d );
		}
	},

	passVars: function( n_parent, d_parent, n_offspring, d_offspring ) {
		KhanUtil.n_parent = n_parent;
		KhanUtil.d_parent = d_parent;
		KhanUtil.n_offspring = n_offspring;
		KhanUtil._offspring = d_offspring;
		KhanUtil.pieces = 1;
		KhanUtil.times = 1;
	},

	// Add or remove slices
	changePieces: function( increase ) {
		var times = KhanUtil.times;
		var pieces;

		if ( KhanUtil.pieces === 1 && !increase ) {
			return;
		}

		KhanUtil.pieces += ( increase ) ? 1 : -1;
		pieces = KhanUtil.pieces;

		jQuery( "#pieces" ).text( KhanUtil.plural(pieces, "piece") ); 

		KhanUtil.currentGraph = jQuery( "#problemarea" ).find( "#parent_block" ).data( "graphie" );
		rectchart( [ 1, pieces - 1 ], ["#e00", "#999" ] );

		KhanUtil.updateGraphAndAnswer();
	},

	changeTimes: function( increase ) {
		var times; 
		var pieces = KhanUtil.pieces;
		var n_parent = KhanUtil.n_parent;

		if ( KhanUtil.times === 1 && !increase ) {
			return;
		}

		KhanUtil.times += ( increase ) ? 1 : -1;
		times = KhanUtil.times;

		jQuery( "#times" ).text( KhanUtil.plural(times, "time") );

		KhanUtil.updateGraphAndAnswer();
	},

	updateGraphAndAnswer: function() {
		var times = KhanUtil.times;
		var pieces = KhanUtil.pieces;

		KhanUtil.currentGraph = jQuery( "#problemarea" ).find( "#current_block" ).data( "graphie" );
		KhanUtil.currentGraph.init({ range: [ [ 0, 1 ], [ 0, 1 ] ],scale: [ 600 / pieces * times, 25 ] });
		rectchart( [ times, 0 ], ["#e00", "#999" ] );

		jQuery( "#answer input" ).val( KhanUtil.roundTo(3, times / pieces) );
	}
});
