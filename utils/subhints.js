(function() {

	jQuery( "a.show-subhint" ).live( "click", function( event ) {
		var subhint = jQuery( "#" + jQuery( this ).data( "subhint" ) );
		var visibleText = jQuery( this ).data( "visible-text" ) || jQuery( this ).text();
		var hiddenText = jQuery( this ).data( "hidden-text" ) || "Hide explanation";
		jQuery( this ).data({ "visible-text": visibleText, "hidden-text": hiddenText });

		if ( subhint.is( ":visible" ) ) {
			jQuery( this ).text( visibleText );
		} else {
			jQuery( this ).text( hiddenText );
		}
		jQuery( "#" + jQuery( this ).data( "subhint" ) ).toggle( 200 );
		return false;
	});

})();
