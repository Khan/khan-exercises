jQuery.fn["software-keyboardPost"] = function() {
	var softwareKeyboard = jQuery( "#software-keyboard" ),
		solutionarea = jQuery( "#solutionarea" ),
		inputs = solutionarea.find( ":input" )
			.prop( "readonly", true )
			.css( "-webkit-tap-highlight-color", "rgba(0, 0, 0, 0)" ),
		field = inputs.first();

	var keyPressed = function( key ) {
		// Normal key
		if ( key !== "bs" ) {
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
			.append( "<div class='triangle'></div>" )
			.prependTo( "#problemarea" );

		var keys = [ [ "1", "2", "3" ], [ "4", "5", "6" ], [ "7", "8", "9" ], [ ".", "0", "bs" ] ];
		var corners = {
			"1": "ui-corner-tl",
			"3": "ui-corner-tr",
			".": "ui-corner-bl",
			"bs": "ui-corner-br"
		};

		jQuery.each( keys, function( i, row ) {
			var rowDiv = jQuery( "<div>" )
				.attr( "class", "row" )
				.appendTo( softwareKeyboard );

			jQuery.each( row, function( j, key ) {
				var keyClass = "key key-" + ( { ".": "dot" }[ key ] || key );
				var corner = corners[ key ] || "";
				var keySpan = jQuery( "<span class='ui-btn " + corner + " ui-btn-up-c'><span class='ui-btn-inner " + corner + "'>" +
				 	"<span class='ui-btn-text'>" + (key === "bs" ? "&nbsp;" : key) + "</span>" +
					(key === "bs" ? "<span class='ui-icon ui-icon-back ui-icon-shadow'></span>" : "") + "</span></span>" )
					.addClass( keyClass )
					.appendTo( rowDiv );
				var canceled = false, downTime;

				var evtPrefix = "";
				if ( jQuery.mobile != null ) {
					evtPrefix = "v";
					keySpan.bind( "vmousecancel", function() {
						keySpan.removeClass( "ui-btn-down-c" );
						canceled = true;
					} );
					keySpan.bind( "vmousemove", function() {
						// Prevent weirdo scrolling
						return false;
					} );
				}

				keySpan.bind( evtPrefix + "mousedown", function() {
					keySpan.addClass( "ui-btn-down-c" );
					canceled = false;
				} );
				keySpan.bind( evtPrefix + "mouseup", function() {
					keySpan.removeClass( "ui-btn-down-c" );

					if ( !canceled ) {
						return keyPressed( key );
					}
				} );
			} );
		} );
		
		jQuery( "#answercontent .simple-button" ).appendTo( softwareKeyboard );
	}
};
