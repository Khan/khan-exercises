jQuery.extend(KhanUtil, {
	fraction: function( n, d ) {
		if ( d === 0 ) {
			return "\\text{undefined}";
		}
		
		if ( n === 0 ) {
			return "0";
		}
		
		var sign = n / d < 0 ? "-" : "";
		n = Math.abs(n);
		d = Math.abs(d);
		
		var gcd = this.getGCD(n, d);
		n = n / gcd;
		d = d / gcd;
		
		return d > 1 ?
			sign + "\\frac{" + n + "}{" + d + "}" :
			sign + n;
	},

	fractionSimplification: function(n, d) {
		var result = "\\frac{" + n + "}{" + (d < 0 ? "(" + d + ")" : d) + "}";

		if ( this.getGCD( n, d ) > 1 ) {
			result += " = " + this.fraction( n, d );
		}

		return result;
	},

	negParens: function( n ) {
		return n < 0 ? "(" + n + ")" : n;
	},

	/* formattedSquareRootOf(24) gives 2\sqrt{6} */
	formattedSquareRootOf: function(n) {
		if(n == 1) {
			/* so as to not return "" later */
			return "1";
		}

		var coefficient = 1;
		var radical = n;

		for(var i = 2; i * i <= n; i++) {
			while(radical % (i * i) == 0) {
				radical /= i * i;
				coefficient *= i;
			}
		}

		var cString = coefficient == 1 ? "" : coefficient.toString();
		var rString = radical == 1 ? "" : "\\sqrt{" + radical + "}";
		return cString + rString;
	},

	squareRootCanSimplify: function(n) {
		return KhanUtil.formattedSquareRootOf(n) != ("\\sqrt{" + n + "}");
	}
});