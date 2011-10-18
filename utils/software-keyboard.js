jQuery.fn["software-keyboardPost"] = function() {
	var softwareKeyboard = jQuery( "#software-keyboard" );
	var solutionarea = jQuery("#solutionarea");

	var inputs = solutionarea.find( ":input" );
	inputs.prop( "readonly", true )
		.css( "-webkit-tap-highlight-color", "rgba(0, 0, 0, 0)" );

	var keyPressed = function( key ) {
		var field = solutionarea.find( ":input" ).first();

		// Normal key
		if ( key.length === 1 ) {
			field.val( field.val() + key );
		} else {
			// Assume for now that it is backspace
			field.val( field.val().slice( 0, -1 ) );
		}

		return false;
	};

	if ( !softwareKeyboard.length ) {
		softwareKeyboard = jQuery( "<div>" )
			.attr( "id", "software-keyboard" )
			.prependTo( "#problemarea" );

		var keys = [ [ "1", "2", "3" ], [ "4", "5", "6" ], [ "7", "8", "9" ], [ ".", "0", "bs" ] ];

		jQuery.each( keys, function( i, row ) {
			var rowDiv = jQuery( "<div>" )
				.attr( "class", "row" )
				.appendTo( softwareKeyboard );

			jQuery.each( row, function( j, key ) {
				var keyClass = "key key-" + ( { ".": "dot" }[ key ] || key );
				var keySpan = jQuery( "<span>" )
					.attr( "class", keyClass )
					.text( key )
					.appendTo( rowDiv );
				var canceled = false, downTime;

				var evtPrefix = "";
				if ( jQuery.mobile != null ) {
					evtPrefix = "v";
					keySpan.bind( "vmousecancel", function() {
						keySpan.removeClass( "down" );
						canceled = true;
					} );
					keySpan.bind( "vmousemove", function() {
						// Prevent weirdo scrolling
						return false;
					} );
				}

				keySpan.bind( evtPrefix + "mousedown", function() {
					keySpan.addClass( "down" );
					canceled = false;
				} );
				keySpan.bind( evtPrefix + "mouseup", function() {
					keySpan.removeClass( "down" );

					if ( !canceled ) {
						return keyPressed( key );
					}
				} );
			} );
		} );
	}
};
