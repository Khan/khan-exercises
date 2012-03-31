jQuery( Khan ).bind( "checkAnswer", function() {

	if ( !jQuery( ".hint-box" ).data("free") ) {

		jQuery( ".hint-box" )
			.data( "free", true )
			.css( "position", "relative" )
			.animate( {top: -10}, 250 )
			.find( ".info-box-header" )
				.slideUp( 250 )
				.end()
			.find( "#hint" )
				.switchClass( "orange", "green", 1 /* duration */, function() {
					$(this)
						.data( "buttonText", Khan.showSolutionButtonText )
						.val( Khan.showSolutionButtonText );
				});

	}

});

jQuery( Khan ).bind( "newProblem", function() {

	// Restore the hint button
	jQuery( "#hint" )
		.removeClass( "green" )
		.addClass( "orange" )
		.val( "I'd like a hint" )
		.data( "buttonText", false )
		.stop( true /* clear */, true /* jump */ )
		.appendTo( "#get-hint-button-container" );

	jQuery( ".hint-box" )
		.data( "free", false )
		.css( "top", "0" )
		.find( ".info-box-header" )
			.show();

	var examples = jQuery( "#examples" );
	if ( examples.length ) {

		// Tooltip-ify the example answer formats
		jQuery( "#examples-show" ).qtip({
			content: {
				text: examples.remove(),
				prerender: true
			},
			style: {
				classes: "ui-tooltip-light leaf-tooltip"
			},
			position: {
				my: "bottom center",
				at: "top center"
			},
			show: {
				delay: 200,
				effect: {
					length: 0
				}
			},
			hide: {
				delay: 0,
				fixed: true
			}
		});

	}

});
