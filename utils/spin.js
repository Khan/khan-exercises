jQuery.extend( KhanUtil, { 
	spin: function( content ) { 
		// First find all top-level blocks and spin them
		var startingBracePos = -1;
		var nestingLevel = 0;

		for ( var i = 0; i < content.length; i++ ) {
			if ( content.charAt( i ) === "{" ) {

				// We encounter our first "{"
				if ( startingBracePos === -1 ) {
					startingBracePos = i;		

				// We are already inside a top-level block, this starts a nested block
				} else {
					nestingLevel++;
				}

			// We encounter a "}" and have seen a "{" before
			} else if ( content.charAt( i ) === "}" && startingBracePos !== -1 ) {

				// This is the closing brace for a top-level block
				if ( nestingLevel === 0 ) {
					// Spin the top-level block
					var spun = KhanUtil.spin( content.substring(startingBracePos + 1, i) );
					content = content.substring( 0, startingBracePos ) + spun + content.substring( i + 1 );
					i -= ( i - startingBracePos ) - spun.length + 1;
					startingBracePos = -1;

				// This brace closes a nested block
				} else {
					nestingLevel--;
				}
			}
		}

		return KhanUtil.randFromArray( content.split("|") );
	}
});


jQuery.fn.spin = function() {
	this.find( ".spin" ).each(function() {
		var spun = KhanUtil.spin( jQuery( this ).html() );
		jQuery( this ).html( spun );
	});
};
