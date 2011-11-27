jQuery.extend( KhanUtil, {
	initialArray: [],

	inOrder: function() {
		var last_card = 0;
		var all_shown_ordered = true;
		$( ".content" ).not( ".hidden" ).each( function( index ) {
			if ( parseInt( $( this ).text() ) < last_card ) {
				$( this ).parent().removeClass( "correct-card" );
				all_shown_ordered = false;
			}
			else {
				$( this ).parent().addClass( "correct-card" );
			}

			last_card = parseInt( $( this ).text() );
		} );
		return all_shown_ordered;
	},

	showCards: function() {
		if ( KhanUtil.inOrder() ) {
			if ( !$( ".hidden" ).length ) {
				return;
			}
			var firstHiddenContent = $( ".hidden:first" );
			firstHiddenContent.removeClass( 'hidden' );
			firstHiddenContent.parent().find( ".card-bg" ).remove();
			KhanUtil.showCards();
		}
	},

	getCardValueArray: function() {
		var a = [];
		$( ".content" ).each( function( index ) {
			a.push( parseInt( $( this ).text() ) );
		} );
		return a;
	},

	setInitialCardArrayValue: function() {
		$( ".content" ).each( function( index ) {
			$( this ).text( KhanUtil.initialArray[ index ] );
		} );
	},

	setInitialHiddenStates: function() {
		$( ".content" ).each( function( index ) {
			$( this ).parent().removeClass( "correct-card" ); //make all cards incorrect to start
			$( this ).addClass( "hidden" );
			if ( !$( this ).parent().find( ".card-bg" ).length ) //card-bg is contained in card, not content.
			{
				$( this ).parent().append( "<div class='card-bg'></div>" ); //there is a better way to do this...
			}
		} );
		$( "#count" ).text( "0" ); // Reset counter
		KhanUtil.showCards(); // Show all ordered cards
	},

	calculateInsertionSortAnswer: function( col ) {
		var swaps = 0;
		col = KhanUtil.getCardValueArray();

		// Perform programmatic insertion sort
		for ( var j = 1; j < col.length; j++ ) {
			var key = col[ j ];
			var i = j - 1;

			while ( i >= 0 && col[ i ] > key ) {
				col[ i + 1 ] = col[ i ];
				i = i - 1;
				swaps += 1;
			}
			col[ i + 1 ] = key;
		}

		return swaps;
	},

	initInsertionSort: function() {
		KhanUtil.initialArray = KhanUtil.getCardValueArray();
		$( ".card" ).click( function() {
			//Swapping with a hidden card is prohibited
			if ( $( this ).find( ".content" ).hasClass( "hidden" ) ) return;
			if ( $( ".selected-card" ).size() > 0 ) {
				if ( $( ".selected-card" )[ 0 ] !== $( this )[ 0 ] ) { //Don't count deselection of curr card
					//Swap card contents:
					var a = $( ".selected-card" ).find( ".content" ).html();
					var b = $( this ).find( ".content" ).html();
					$( ".selected-card" ).find( ".content" ).html( b );
					$( this ).find( ".content" ).html( a );

					$( "#count" ).text( parseInt( $( "#count" ).text() ) + 1 );
				}

				$( ".card" ).removeClass( "selected-card" );
				KhanUtil.showCards();
			}
			else {
				$( this ).removeClass( "correct-card" );
				$( this ).addClass( "selected-card" );
			}
		}

		);
		$( "#start-over" ).click( function() {
			KhanUtil.setInitialCardArrayValue();
			KhanUtil.setInitialHiddenStates();
		} );
	}

} );

