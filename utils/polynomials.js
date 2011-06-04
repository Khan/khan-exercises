jQuery.extend(KhanUtil, {
	Polynomial: function( minDegree, maxDegree, coefs, variable, name ) {
		var term = function( coef, vari, degree ) {
			// sort of a weird error behavior
			if ( !coef ) {
				coef = 1;
			} else if ( coef == 0 ) {
				return null;
			}

			if ( degree == 0 ) {
				return coef;
			} else if ( degree == 1 ) {
				return ["*", coef, vari];
			} else {
				return ["*", coef, ["^", vari, degree]];
			}
		};

		this.minDegree = minDegree;
		this.maxDegree = maxDegree;
		if (!coefs) {
			this.coefs = KhanUtil.randCoefs( minDegree, maxDegree );
		} else {
			this.coefs = coefs;
		}
		this.variable = variable;

		if ( name ) {
			this.name = name;
		} else {
			this.name = "f";
		}

		this.expr = function( vari ) {
			if ( !vari ) {
				vari = this.variable;
			}
			
			var expr = ["+"];

			for ( var i = this.maxDegree; i >= this.minDegree; i-- ) {
				var theTerm = term( this.coefs[i], vari, i );

				if ( theTerm != null ) {
					expr.push( theTerm );
				}
			}

			return expr;
		};

		this.text = function() {
			return KhanUtil.expr( this.expr( this.variable ) );
		};

		this.toString = this.text;

		this.hintEvalOf = function( val ) {
			return KhanUtil.expr( this.expr( val ) );
		};

		this.evalOf = function( val ) {
			return KhanUtil.expr( this.expr( val ), true );
		};

		this.hint = function() {
			
		};
		
		return this;
	},

	CompositePolynomial: function( minDegree, maxDegree, coefs, variable, name,
								   composed ) {
		var base = new KhanUtil.Polynomial( minDegree, maxDegree, coefs, variable, name );

		jQuery.extend(this, base);
		var composedFunc = composed.name + "(" + base.variable + ")";

		this.expr = function( vari ) {
			var expr = base.expr( vari );

			expr.push( composedFunc );

			return expr;
		};

		this.text = function() {
			return base.text() + " + " + composedFunc;
		};

		this.toString = this.text;

		this.hintEvalOf = function( val ) {
			return base.hintEvalOf(val) + " + " + composed.name + "(" + val + ")";
		};

		this.evalOf = function( val ) {
			return base.evalOf( val ) + composed.evalOf( val );
		};

		this.hint = function( val ) {
			var hint = "<p>First, let's solve for the value of the inner function, <code>"
					   + composedFunc+"</code>. Then we'll know what to plug into the outer function.</p>";
			hint += base.hint( val );

			hint += "<p>Now we know that <code>"+composedFunc+" = "+composed.evalOf( val )+"."
				+ "Let's solve for <code>"+base.name+"("+base.variable+")</code>, which is <code>"
				+ base.name+"("+val+")</code>.";
		};

		return this;
	},

	randCoefs: function( minDegree, maxDegree ) {
		var coefs = [];
		for ( var i = maxDegree; i >= minDegree; i-- ) {
			coefs[i] = KhanUtil.randRange( -7, 7 );
		}
		return coefs;
	}
});
