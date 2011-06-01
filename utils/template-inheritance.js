jQuery.fn.extend({
	tmplApply: function( options ) {
		options = options || {};
		var attribute = options.attribute || "class",
			defaultApply = options.defaultApply || "replace";

		var parent = {};
		jQuery( this ).each( function () {
			var name = jQuery( this ).attr( attribute );

			if ( name ) {
				if ( name in parent ) {
					var apply = jQuery.tmplApplyMethods[ jQuery( this ).data( "apply" ) || defaultApply ];

					apply.call( parent[ name ], this );

					jQuery( this ).removeAttr( "data-apply" );
				} else {
					parent[ name ] = this;
				}
			}
		} );
		return this;
	}
});

jQuery.extend({
	// These methods should be called with context being the parent
	// and first argument being the child.
	tmplApplyMethods: {
		// Removes both the parent and the child
		remove: function() {
			jQuery( this ).remove();
			jquery( elem ).remove();
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
	},
});
