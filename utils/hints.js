jQuery( Khan ).bind( "checkAnswer", function() {
	if ( !jQuery( "#hint" ).parent().is( '#show-solution-button-container' ) ) {
		// Transform the hint button into the "Show Solution" button
		// Note: IE craps out if 0 is passed as duration
		jQuery( "#hint" ).switchClass("orange", "green", 1 /* duration */, function() {
			jQuery( this ).data( "buttonText", Khan.showSolutionButtonText )
				.val( Khan.showSolutionButtonText )
				.hide()
				.appendTo( "#show-solution-button-container" )
				.fadeIn('slow');
		});
	}

	jQuery( ".hint-box" ).hide();
});

jQuery( Khan ).bind( "newProblem", function() {
	// Restore the hint button
	jQuery( "#hint" )
		.switchClass( "green", "orange" )
		.val( "I'd like a hint" )
		.data( "buttonText", false )
		.stop( true /* clear */, true /* jump */ )
		.appendTo( "#get-hint-button-container" );

	jQuery( ".hint-box" ).show();
});
