var tmpl = {
	VARS: {},
	
	attr: {
		"data-ensure": function( elem, ensure ) {
			return function( elem ) {
				return !!(ensure && tmpl.getVAR( ensure ));
			};
		},
		
		"data-if": function( elem, value ) {
			value = value && tmpl.getVAR( value );
			
			jQuery( elem ).next().data( "lastCond", value );
			
			if ( !value ) {
				return null;
			}
		},
		
		"data-else-if": function( elem, value ) {
			var lastCond = jQuery( elem ).data( "lastCond" );
			
			value = !lastCond && value && tmpl.getVAR( value );
			
			jQuery( elem ).next().data( "lastCond", lastCond || value );
			
			if ( !value ) {
				return null;
			}
		},
		
		"data-else": function( elem ) {
			if ( jQuery( elem ).data( "lastCond" ) ) {
				return null;
			}
		},
		
		"data-each": function( elem, value ) {
			var match;
			
			jQuery( elem ).removeAttr( "data-each" );
			
			if ( (match = /^(.*?)(?: as (?:(\w+), )?(\w+))?$/.exec( value )) ) {
				return {
					items: tmpl.getVAR( match[1] ),
					
					value: match[3],
					pos: match[2],
					
					oldValue: tmpl.VARS[ match[3] ],
					oldPos: tmpl.VARS[ match[2] ]
				};
			}
		}
	},
	
	type: {
		"var": function( elem, value ) {
			if ( !value && elem.getElementsByTagName("*").length > 0 ) {
				return function( elem ) {
					return tmpl.elem["var"]( elem, elem.innerHTML );
				};
			}
			
			var name = elem.id;
			
			value = value || tmpl.getVAR( elem );

			// If a name was specified then we're going to load the value
			if ( name ) {
				// Show an error if a variable definition is overriding a built-in method
				if ( KhanUtil[ name ] || ( typeof present !== "undefined" && ( typeof present[ name ] === "function" ) ) ) {
					Khan.error( "Defining variable '" + name + "' overwrites utility property of same name." );
				}

				tmpl.VARS[ name ] = value;
		
			// No value was specified so we replace it with a text node of the value
			} else {
				return document.createTextNode( value != null ?
					value + "" :
					"" );
			}
		},
		
		ul: function( elem ) {
			if ( elem.id ) {
				return jQuery( "<var>" )
					.attr( "id", elem.id )
					.append( jQuery( elem ).children().getRandom().contents() )[0];
			}
		},
	
		code: function( elem ) {
			return function( elem ) {
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
				if ( typeof MathJax !== "undefined") {
					MathJax.Hub.Queue([ "Typeset", MathJax.Hub, elem ]);
				}
			};
		}
	},
	
	getVAR: function( elem ) {
		// We need to compute the value
		var code = jQuery.trim( elem.nodeName ? jQuery(elem).text() : elem );

		// Make sure any HTML formatting is stripped
		code = tmpl.cleanHTML( code );

		// See if we're dealing with a multiline block of code
		if ( /;/.test( code ) && !/\bfunction\b/.test( code ) ) {
			code = "(function(){\n" + code + "\n})()";
		}

		try {
			// Use the methods from JavaScript's builtin Math methods
			with ( Math ) {
				// And the methods provided by the library
				with ( KhanUtil ) {
					// Use all the computed variables
					with ( tmpl.VARS ) {
						return eval( "(" + code	 + ")" );
					}
				}
			}

		} catch( e ) {
			Khan.error( code, e );
		}
	},

	// Make sure any HTML formatting is stripped
	cleanHTML: function( text ) {
		return text.replace(/&gt;/g, ">").replace(/&lt;/g, "<").replace(/&amp;/g, "&");
	}
};

jQuery.fn.tmpl = function() {
	for ( var i = 0, l = this.length; i < l; i++ ) {
		traverse( this[i] );
	}

	return this;

	function traverse( elem ) {
		var post = [],
			child = elem.childNodes,
			ret = process( elem, post );

		if ( ret === null ) {
			if ( elem.parentNode ) {
				elem.parentNode.removeChild( elem );
			}

			return ret;

		} else if ( ret === false ) {
			return traverse( elem );

		} else if ( ret && ret.nodeType && ret !== elem ) {
			if ( elem.parentNode ) {
				elem.parentNode.replaceChild( ret, elem );
			}

			elem = ret;
		
		} else if ( ret.items ) {
			var origParent = elem.parentNode,
				origNext = elem.nextSibling;
			
			jQuery.each( ret.items, function( pos, value ) {
				if ( ret.value ) {
					tmpl.VARS[ ret.value ] = value;
				}
				
				if ( ret.pos ) {
					tmpl.VARS[ ret.pos ] = pos;
				}
				
				var clone = jQuery( elem ).detach().clone( true )[0];
				
				if ( origNext ) {
					origParent.insertBefore( clone, origNext );
				} else {
					origParent.appendChild( clone );
				}
				
				traverse( clone );
			});
			
			if ( ret.value ) {
				tmpl.VARS[ ret.value ] = ret.oldValue;
			}
			
			if ( ret.pos ) {
				tmpl.VARS[ ret.pos ] = ret.oldPos;
			}
			
			return;
		}

		// loop through children if not null
		for ( var i = 0; i < child.length; i++ ) {
			if ( child[i].nodeType === 1 && traverse( child[i] ) === null ) {
				i--;
			}
		}

		for ( var i = 0, l = post.length; i < l; i++ ) {
			if ( post[i]( elem ) === false ) {
				return traverse( elem );
			}
		}
		
		return elem;
	}

	function process( elem, post ) {
		var ret, newElem, 
			$elem = jQuery( elem );

		for ( var attr in tmpl.attr ) {
			var value = $elem.attr( attr );

			if ( value !== undefined ) {
				ret = tmpl.attr[ attr ]( elem, value );

				if ( typeof ret === "function" ) {
					post.push( ret );

				} else if ( ret && ret.nodeType ) {
					newElem = ret;
					
				} else if ( ret !== undefined ) {
					return ret;
				}
			}
		}

		if ( newElem ) {
			elem = newElem;
		}

		for ( var type in tmpl.type ) {
			if ( elem.nodeName.toLowerCase() === type ) {
				ret = tmpl.type[ type ]( elem );

				if ( typeof ret === "function" ) {
					post.push( ret );
				}

				break;
			}
		}

		return ret === undefined ? elem : ret;
	}
};