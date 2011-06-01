jQuery.fn.extend({
	tmplApply: function( options ) {
		options = options || {};
		
		// Get the attribute which we'll be checking
		// defaults to "class", "id" is also sometimes used
		var attribute = options.attribute || "class",
		
			// Figure out the way in which the application will occur
			defaultApply = options.defaultApply || "replace",
			
			// Store for elements to be used later
			parent = {};
			
		jQuery( this ).each(function() {
			var $this = jQuery( this ),
				name = $this.attr( attribute );

			// Only operate on the element if it has the attribute that we're using
			if ( name ) {
				// The inheritance only works if we've seen an element already
				// that matches the particular name
				if ( name in parent ) {
					// Get the method through which we'll be doing the application
					// You can specify an application style directly on the sub-element
					jQuery.tmplApplyMethods[ $this.data( "apply" ) || defaultApply ]
					
						// Call it with the context of the parent and the sub-element itself
						.call( parent[ name ], this );

				// Store the parent element for later use
				} else {
					parent[ name ] = this;
				}
			}
		});
		
		return this;
	}
});

jQuery.extend({
	// These methods should be called with context being the parent
	// and first argument being the child.
	tmplApplyMethods: {
		// Removes both the parent and the child
		remove: function( elem ) {
			jQuery( this ).remove();
			jQuery( elem ).remove();
		},
		
		// Replaces the parent with the child
		replace: function( elem ) {
			jQuery( this ).replaceWith( elem );
		},
		
		// Replaces the parent with the child's content. Useful when
		// needed to replace an element without introducing additional
		// wrappers.
		splice: function( elem ) {
			jQuery( this ).replaceWith( jQuery( elem ).contents() );
		},
		
		// Appends the child element to the parent element
		append: function( elem ) {
			jQuery( this ).append( elem );
		},
		
		// Appends the child element's contents to the parent element.
		appendContents: function( elem ) {
			jQuery( this ).append( jQuery( elem ).contents() );
			jQuery( elem ).remove();
		},
		
		// Prepends the child element to the parent.
		prepend: function( elem ) {
			jQuery( this ).prepend( elem );
		},
		
		// Prepends the child element's contents to the parent element.
		prependContents: function( elem ) {
			jQuery( this ).prepend( jQuery( elem ).contents() );
			jQuery( elem ).remove();
		},
		
		// Insert child before the parent.
		before: function( elem ) {
			jQuery( this ).before( elem );
		},
		
		// Insert child's contents before the parent.
		beforeContents: function( elem ) {
			jQuery( this ).before( jQuery( elem ).contents() );
			jQuery( elem ).remove();
		},
		
		// Insert child after the parent.
		after: function( elem ) {
			jQuery( this ).after( elem );
		},
		
		// Insert child's contents after the parent.
		afterContents: function( elem ) {
			jQuery( this ).after( jQuery( elem ).contents() );
			jQuery( elem ).remove();
		}
	}
});
