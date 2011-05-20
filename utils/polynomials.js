jQuery.extend(KhanUtil, {
	firstTerm: function( c, variable, degree ) {
		if ( typeof c === "undefined" || c == 0 ) {
			return "";
		}
		
		if ( degree == 0 ) {
			return c;
		} else {
			if ( c == 1 ) {
				c = "";
			} else if ( c == -1 ) {
				c = "-";
			}

			if ( degree === 1 ) {
				return c + "" + variable;
			} else {
				return c + "" + variable + "^{" + degree + "}";
			}
		}
	},

	term: function( c, variable, degree ) {
		if ( typeof c === "undefined" || c === 0 ) {
			return "";
		}

		if ( degree === 0 ) {
			if ( c > 0 ) {
				return "+" + c;
			} else {
				return c;
			}
		} else {
			if ( c > 0 ) {
				if ( c === 1 ) {
					return "+ " + variable;
				}
				
				if ( degree === 1 ) {
					return "+ " + c + variable;
				} else {
					return "+ " + c + variable + "^{" + degree + "}";
				}
			} else if ( c < 0 ) {
				if ( c === -1 ) {
					return "- " + variable;
				}

				if ( degree === 1 ) {
					return "- " + (c * -1) + variable;
				} else {
					return "- " + (c * -1) + variable + "^{" + degree + "}";
				}
			} else if ( c === 0 ) {
				return "";
			}
		}
	},

	textOf: function( poly, variable ) {
		var exp = "";
		for ( var i = poly.maxDegree; i >= poly.minDegree; i-- ) {
			if ( exp.length === 0 ) {
				exp += KhanUtil.firstTerm( poly.coefs[i], variable, i );
			} else {
				exp += KhanUtil.term( poly.coefs[i], variable, i );
			}
		}
		return exp;
	},
	
	Polynomial: function( minDegree, maxDegree, coefs, variable ) {
		this.minDegree = minDegree;
		this.maxDegree = maxDegree;
		this.coefs = coefs;
		this.variable = variable;

		this.text = function() {
			return KhanUtil.textOf( this, this.variable );
		};

		this.hintEvalOf = function( val ) {
			return KhanUtil.textOf( this, val );
		};

		this.evalOf = function( val ) {
			var result = 0;
			for ( var i = this.minDegree; i <= this.maxDegree; i++ ) {
				result += coefs[i] * Math.pow( val, i );
			}
			return result;
		};

		return this;
	},

	// It's a polynomial, but with another expression tacked on at the end
	CompositeExpression: function( minDegree, maxDegree ) {
		
	}
});