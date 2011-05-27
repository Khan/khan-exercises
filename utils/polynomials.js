jQuery.extend(KhanUtil, {
	Polynomial: function( minDegree, maxDegree, coefs, variable ) {
		var term = function( coef, vari, degree ) {
			if ( coef == 0 ) {
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
		this.coefs = coefs;
		this.variable = variable;

		this.expr = function( vari ) {
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

		this.hintEvalOf = function( val ) {
			return KhanUtil.expr( this.expr( val ) );
		};

		this.evalOf = function( val ) {
			return KhanUtil.expr( this.expr( val ), true );
		};

		return this;
	},
});