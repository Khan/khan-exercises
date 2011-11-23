(function() {
	jQuery.fn.arbitraryjs = function( problem ) {
		return this.find( ".arbitraryjs " ).andSelf().filter( ".arbitraryjs " ).each(function() {
			// Grab code for later execution
			var code = jQuery( this ).text();

			// Remove any of the code that's in there
			jQuery( this ).empty();

			code = "(function() {" + code + "})()";

			// Execute the graph-specific code
			jQuery.tmpl.getVAR( code );
			// delete KhanUtil.currentGraph;
		}).end();
	};
})();
