(function() {

// Keep the template variables private, to prevent external access
var VARS = {};

jQuery.tmpl = {
	DATA_ENSURE_LOOPS: 0,

	// Processors that act based on element attributes
	attr: {
		"data-ensure": function( elem, ensure ) {
			// Returns a function in order to run after other templating and var assignment
			return function( elem ) {
				// Return a boolean corresponding to the ensure's value
				// False means all templating will be run again, so new values will be chosen
				var result = !!(ensure && jQuery.tmpl.getVAR( ensure ));
				if ( !result ) {
					++jQuery.tmpl.DATA_ENSURE_LOOPS;
				}
				return result;
			};
		},

		"data-if": function( elem, value ) {
			var $elem = jQuery( elem );

			value = value && jQuery.tmpl.getVAR( value );

			// Save the result of this data-if in the next sibling for data-else-if and data-else
			$elem.next().data( "lastCond", value );

			if ( !value ) {
				// Delete the element if the data-if evaluated to false
				return [];
			}
		},

		"data-else-if": function( elem, value ) {
			var $elem = jQuery( elem );

			var lastCond = $elem.data( "lastCond" );

			// Show this element iff the preceding element was hidden AND this data-if returns truthily
			value = !lastCond && value && jQuery.tmpl.getVAR( value );

			// Succeeding elements care about the visibility of both me and my preceding siblings
			$elem.next().data( "lastCond", lastCond || value );

			if ( !value ) {
				// Delete the element if appropriate
				return [];
			}
		},

		"data-else": function( elem ) {
			var $elem = jQuery( elem );

			if ( $elem.data( "lastCond" ) ) {
				// Delete the element if the data-if of the preceding element was true
				return [];
			}
		},

		"data-each": function( elem, value ) {
			var match;

			// Remove the data-each attribute so it doesn't end up in the generated elements
			jQuery( elem ).removeAttr( "data-each" );

			// HINT_COUNT times
			// HINT_COUNT times as INDEX
			if ( (match = /^(.+) times(?: as (\w+))?$/.exec( value )) ) {
				var times = jQuery.tmpl.getVAR( match[1] );

				return {
					items: jQuery.map( new Array( times ), function ( e, i ) { return i; } ),
					value: match[2],
					oldValue: VARS[ match[2] ]
				};

			// Extract the 1, 2, or 3 parts of the data-each attribute, which could be
			//   - items
			//   - items as value
			//   - items as pos, value
			} else if ( (match = /^(.*?)(?: as (?:(\w+), )?(\w+))?$/.exec( value )) ) {
				// See "if ( ret.items )" in traverse() for the other half of the data-each code
				return {
					// The collection which we'll iterate through
					items: jQuery.tmpl.getVAR( match[1] ),

					// "value" and "pos" as strings
					value: match[3],
					pos: match[2],

					// Save the values of the iterator variables so we don't permanently overwrite them
					oldValue: VARS[ match[3] ],
					oldPos: VARS[ match[2] ]
				};
			}
		},

		"data-unwrap": function( elem ) {
			return jQuery( elem ).contents();
		}
	},

	// Processors that act based on tag names
	type: {
		"var": function( elem, value ) {
			// When called by process(), value is undefined

			// If the <var> has any child elements, run later with the innerHTML
			// Use jQuery instead of getElementsByTagName to exclude comment nodes in IE
			if ( !value && jQuery( elem ).children().length > 0 ) {
				return function( elem ) {
					return jQuery.tmpl.type["var"]( elem, elem.innerHTML );
				};
			}

			// Evaluate the contents of the <var> as a JS string
			value = value || jQuery.tmpl.getVAR( elem );

			// If an ID was specified then we're going to save the value
			var name = elem.id;
			if ( name ) {

				// Utility function for VARS[ name ] = value, warning if the name overshadows a KhanUtil property
				var setVAR = function( name, value ) {
					if ( KhanUtil[ name ] ) {
						Khan.error( "Defining variable '" + name + "' overwrites utility property of same name." );
					}

					VARS[ name ] = value;
				};

				// Destructure the array if appropriate
				if ( name.indexOf( "," ) !== -1 ) {
					// Nested arrays are not supported
					var parts = name.split(/\s*,\s*/);

					jQuery.each( parts, function( i, part ) {
						// Ignore empty parts
						if ( part.length > 0 ) {
							setVAR( part, value[i] );
						}
					});

				// Just a normal assignment
				} else {
					setVAR( name, value );
				}

			// No value was specified so we replace it with a text node of the value
			} else {
				if ( value == null ) {
					// Don't show anything
					return [];
				} else {
					// Convert the value to a string and replace with those elements and text nodes
					// Add a space so that it can end with a "<" in Safari
					var div = jQuery( "<div>" );
					var html = div.append( value + " " ).html();
					return div.html( html.slice( 0, -1 ) ).contents();
				}
			}
		},

		code: function( elem ) {
			// Returns a function in order to run after other templating and var assignment
			return function( elem ) {
				if ( typeof elem.MathJax === "undefined" ) {
					var $elem = jQuery( elem );

					// Maintain the classes from the original element
					if ( elem.className ) {
						$elem.wrap( "<span class='" + elem.className + "'></span>" );
					}

					// Trick MathJax into thinking that we're dealing with a script block
					elem.type = "math/tex";

					// Make sure that the old value isn't being displayed anymore
					elem.style.display = "none";

					// Clean up any strange mathematical expressions
					var text = $elem.text();
					$elem.text( KhanUtil.cleanMath ? KhanUtil.cleanMath( text ) : text );

					// Stick the processing request onto the queue
					if ( typeof MathJax !== "undefined" ) {
						MathJax.Hub.Queue([ "Typeset", MathJax.Hub, elem ]);
					}
				} else {
					MathJax.Hub.Queue([ "Reprocess", MathJax.Hub, elem ]);
				}
			};
		}
	},

	// Eval a string in the context of Math, KhanUtil, VARS, and optionally another passed context
	getVAR: function( elem, ctx ) {
		// We need to compute the value
		var code = elem.nodeName ? jQuery(elem).text() : elem;

		// Make sure any HTML formatting is stripped
		code = jQuery.trim( jQuery.tmpl.cleanHTML( code ) );

		// If no extra context was passed, use an empty object
		if ( ctx == null ) {
			ctx = {};
		}

		try {
			// Use the methods from JavaScript's built-in Math methods
			with ( Math ) {
				// And the methods provided by the library
				with ( KhanUtil ) {
					// And the passed-in context
					with ( ctx ) {
						// And all the computed variables
						with ( VARS ) {
							return eval( "(function() { return (" + code + "); })()" );
						}
					}
				}
			}

		} catch ( e ) {
			var info;

			if ( elem.nodeName ) {
				info = elem.nodeName.toLowerCase();

				if ( elem.id != null && elem.id.length > 0 ) {
					info += "#" + elem.id;
				}
			} else {
				info = JSON.stringify( code );
			}

			Khan.error( "Error while evaluating " + info, e );
		}
	},

	// Make sure any HTML formatting is stripped
	cleanHTML: function( text ) {
		return ("" + text).replace(/&gt;/g, ">").replace(/&lt;/g, "<").replace(/&amp;/g, "&");
	}
};

if ( typeof KhanUtil !== "undefined" ) {
	KhanUtil.tmpl = jQuery.tmpl;
}

// Reinitialize VARS for each problem
jQuery.fn.tmplLoad = function( problem, info ) {
	VARS = {};
	jQuery.tmpl.DATA_ENSURE_LOOPS = 0;

	// Check to see if we're in test mode
	if ( info.testMode ) {
		// Expose the variables if we're in test mode
		jQuery.tmpl.VARS = VARS;
	}
};

jQuery.fn.tmplCleanup = function() {
	this.find( "code" ).each( function() {
		MathJax.Hub.getJaxFor( this ).Remove();
	} );
};

jQuery.fn.tmpl = function() {
	// Call traverse() for each element in the jQuery object
	for ( var i = 0, l = this.length; i < l; i++ ) {
		traverse( this[i] );
	}

	return this;

	// Walk through the element and its descendants, process()-ing each one using the processors defined above
	function traverse( elem ) {
		// Array of functions to run after doing the rest of the processing
		var post = [],

			// Live NodeList of child nodes to traverse if we don't remove/replace this element
			child = elem.childNodes,

			// Result of running the attribute and tag processors on the element
			ret = process( elem, post );

		// If false, rerun all templating (like data-ensure)
		if ( ret === false ) {
			return traverse( elem );

		// If undefined, do nothing
		} else if ( ret === undefined ) {
			;

		// If a (possibly-empty) array of nodes, replace this one with those
		// The type of ret is checked to ensure it is not a function
		} else if ( typeof ret === "object" && typeof ret.length !== "undefined" ) {
			if ( elem.parentNode ) {
				// All nodes must be inserted before any are traversed
				jQuery.each( ret, function( i, rep ) {
					if ( rep.nodeType ) {
						elem.parentNode.insertBefore( rep, elem );
					}
				} );

				jQuery.each( ret, function( i, rep ) {
					traverse( rep );
				} );

				elem.parentNode.removeChild( elem );
			}

			return null;

		// If { items: ... }, this is a data-each loop
		} else if ( ret.items ) {
			// We need these references to insert the elements in the appropriate places
			var origParent = elem.parentNode,
				origNext = elem.nextSibling;

			// Loop though the given array
			jQuery.each( ret.items, function( pos, value ) {
				// Set the value if appropriate
				if ( ret.value ) {
					VARS[ ret.value ] = value;
				}

				// Set the position if appropriate
				if ( ret.pos ) {
					VARS[ ret.pos ] = pos;
				}

				// Do a deep clone (including event handlers and data) of the element
				var clone = jQuery( elem ).clone( true )
					.removeAttr( "data-each" ).removeData( "each" )[0];

				// Prepend all conditional statements with a declaration of ret.value
				// and ret.post and an assignment of their current values so that
				// the conditional will still make sense even when outside of the
				// data-each context
				var conditionals = [ "data-if", "data-else-if", "data-else" ];

				var declarations = "";
				declarations += ( ret.pos ) ? "var " + ret.pos + " = " + JSON.stringify( pos ) + ";" : "";
				declarations += ( ret.value ) ? "var " + ret.value + " = " + JSON.stringify( value ) + ";" : "";

				for ( var i = 0; i < conditionals.length; i++ ) {
					var conditional = conditionals[i];
					jQuery( clone ).find( "[" + conditional + "]" ).each(function() {
						var code = jQuery( this ).attr( conditional );
						code = "(function() {  " + declarations + " return " + code + " })()";
						jQuery( this ).attr( conditional, code );
					});
				}

				// Do the same for graphie code
				jQuery( clone ).find( ".graphie" ).andSelf().filter( ".graphie" ).each(function() {
					var code = jQuery( this ).text();
					jQuery( this ).text( declarations + code );
				});

				// Insert in the proper place (depends on whether the loops is the last of its siblings)
				if ( origNext ) {
					origParent.insertBefore( clone, origNext );
				} else {
					origParent.appendChild( clone );
				}

				// Run all templating on the new element
				traverse( clone );
			});

			// Restore the old value of the value variable, if it had one
			if ( ret.value ) {
				VARS[ ret.value ] = ret.oldValue;
			}

			// Restore the old value of the position variable, if it had one
			if ( ret.pos ) {
				VARS[ ret.pos ] = ret.oldPos;
			}

			// Remove the loop element and its handlers now that we've processed it
			jQuery( elem ).remove();

			// Say that the element was removed so that child traversal doesn't skip anything
			return null;
		}

		// Loop through the element's children if it was not removed
		for ( var i = 0; i < child.length; i++ ) {
			// Traverse the child; decrement the counter if the child was removed
			if ( child[i].nodeType === 1 && traverse( child[i] ) === null ) {
				i--;
			}
		}

		// Run through each post-processing function
		for ( var i = 0, l = post.length; i < l; i++ ) {
			// If false, rerun all templating (for data-ensure and <code> math)
			if ( post[i]( elem ) === false ) {
				return traverse( elem );
			}
		}

		return elem;
	}

	// Run through the attr and type processors, return as soon as one of them is decisive about a plan of action
	function process( elem, post ) {
		var ret, newElem,
			$elem = jQuery( elem );

		// Look through each of the attr processors, see if our element has the matching attribute
		for ( var attr in jQuery.tmpl.attr ) {
			var value;

			if ( ( /^data-/ ).test( attr ) ) {
				value = $elem.data( attr.replace( /^data-/, "" ) );
			} else {
				value = $elem.attr( attr );
			}

			if ( value !== undefined ) {
				ret = jQuery.tmpl.attr[ attr ]( elem, value );

				// If a function, run after all of the other templating
				if ( typeof ret === "function" ) {
					post.push( ret );

				// Return anything else (boolean, array of nodes for replacement, object for data-each)
				} else if ( ret !== undefined ) {
					return ret;
				}
			}
		}

		// Look up the processor based on the tag name
		var type = elem.nodeName.toLowerCase();
		if ( jQuery.tmpl.type[ type ] != null ) {
			ret = jQuery.tmpl.type[ type ]( elem );

			// If a function, run after all of the other templating
			if ( typeof ret === "function" ) {
				post.push( ret );
			}
		}

		return ret;
	}
};

jQuery.extend( jQuery.expr[":"], {
	inherited: function(el) {
		return jQuery( el ).data( "inherited" );
	}
} );

jQuery.fn.extend({
	tmplApply: function( options ) {
		options = options || {};

		// Get the attribute which we'll be checking, defaults to "id"
		// but "class" is sometimes used
		var attribute = options.attribute || "id",

			// Figure out the way in which the application will occur
			defaultApply = options.defaultApply || "replace",

			// Store for elements to be used later
			parent = {};

		return this.each(function() {
			var $this = jQuery( this ),
				name = $this.attr( attribute ),
				hint = $this.data( "apply" ) && !$this.data( "apply" ).indexOf( "hint" );

			// Only operate on the element if it has the attribute that we're using
			if ( name ) {
				// The inheritance only works if we've seen an element already
				// that matches the particular name and we're not looking at hint
				// templating
				if ( name in parent && !hint ) {
					// Get the method through which we'll be doing the application
					// You can specify an application style directly on the sub-element
					parent[ name ] = jQuery.tmplApplyMethods[ $this.data( "apply" ) || defaultApply ]

						// Call it with the context of the parent and the sub-element itself
						.call( parent[ name ], this );

					if ( parent[ name ] == null ) {
						delete parent[ name ];
					}

				// Store the parent element for later use if it was inherited from somewhere else
				} else if ( $this.closest( ":inherited" ).length > 0 ) {
					parent[ name ] = this;
				}
			}
		});
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
			return elem;
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
			return this;
		},

		// Appends the child element's contents to the parent element.
		appendContents: function( elem ) {
			jQuery( this ).append( jQuery( elem ).contents() );
			jQuery( elem ).remove();
			return this;
		},

		// Prepends the child element to the parent.
		prepend: function( elem ) {
			jQuery( this ).prepend( elem );
			return this;
		},

		// Prepends the child element's contents to the parent element.
		prependContents: function( elem ) {
			jQuery( this ).prepend( jQuery( elem ).contents() );
			jQuery( elem ).remove();
			return this;
		},

		// Insert child before the parent.
		before: function( elem ) {
			jQuery( this ).before( elem );
			return this;
		},

		// Insert child's contents before the parent.
		beforeContents: function( elem ) {
			jQuery( this ).before( jQuery( elem ).contents() );
			jQuery( elem ).remove();
			return this;
		},

		// Insert child after the parent.
		after: function( elem ) {
			jQuery( this ).after( elem );
			return this;
		},

		// Insert child's contents after the parent.
		afterContents: function( elem ) {
			jQuery( this ).after( jQuery( elem ).contents() );
			jQuery( elem ).remove();
			return this;
		},

		// Like appendContents but also merges the data-ensures
		appendVars: function( elem ) {
			var parentEnsure = jQuery( this ).data("ensure") || "1";
			var childEnsure = jQuery( elem ).data("ensure") || "1";
			jQuery( this ).data("ensure",
				"(" + parentEnsure + ") && (" + childEnsure + ")");

			return jQuery.tmplApplyMethods.appendContents.call( this, elem );
		}
	}
});

})();
