$.extend(KhanUtil, {
	getExpressionRegex: function(coefficient, vari, constant) {
        // Capture Ax + B or B + Ax, either A or B can be 0
        
        if (coefficient === 0) {
            var regex = "^\\s*";
            regex += constant < 0 ? "[-\\u2212]\\s*" + (-constant) + "\\s*$" : constant + "\\s*$";
            return regex;
        }

        var regex = "^\\s*";
        if (coefficient < 0) {
            regex += "[-\\u2212]\\s*";
        }
        if (coefficient !== 1 && coefficient !== -1) {
            regex += Math.abs(coefficient) + "\\s*";
        }
        regex += vari + "\\s*"

        if (constant === 0) {
            regex += "$";
        } else {
            regex = "(" + regex;
            regex += constant < 0 ? "[-\\u2212]" : "\\+";
            regex += "\\s*" + Math.abs(constant) + "\\s*$)|(^\\s*"
            if (constant < 0) {
                regex += "[-\\u2212]\\s*";
            }
            regex += Math.abs(constant) + "\\s*"
            regex += coefficient < 0 ? "[-\\u2212]\\s*" : "\\+\\s*";
            if (coefficient !== 1 && coefficient !== -1) {
                regex += Math.abs(coefficient) + "\\s*";
            }
            regex += vari + "\\s*$)";
        }

        return regex;
	},

    // Term in an expression
    // e.g. [5, x, 2] = 5x^2
    Term: function(value) {
        this.variables = [];

        if (typeof value === "number") {
            this.coefficient = value;
        } else {
            this.coefficient = value[0];
            this.variables = value.slice(1);
        }

        // includeSign if term is not the first in an expression
        this.toString = function(includeSign) {
            if (this.coefficient === 0) {
                return "";
            }

            if (includeSign) {
                var s = this.coefficient > 1 ? " + " + this.coefficient : " - " + (-this.coefficient);
            } else {
                var s = this.coefficient;
            }

            for (var i = 0; i < this.variables.length; i+=2) {
                var degree = this.variables[i + 1];
                
                if (degree === 0) {
                    continue;
                }
                s += this.variables[i];
                if (degree > 1) {
                    s += "^" + degree;
                }
            }
            return this.coefficient;
        }
    },

    // Array of terms which are added together
    // Terms can be numbers, of [variable, degree]
    // e.g. [5, [1, x]] = 5 + x
    // e.g. [5, [2, x, 2]] = 5 + 2x^2
    // e.g. [5, [2, x, 2, y]] = 5 + 2x^2y
    RationalExpression: function(terms) {
        this.terms = terms;

        this.multiply = function(value) {
            var terms = [];

            for (var i = 0; i < this.terms.length; i++) {
                terms[i] = this.terms[i].coefficient * value;
            }

            return new KhanUtil.RationalExpression(terms);
        };

        this.toString = function() {
            var s = this.terms[0].toString();

            for (var i = 1; i < this.terms.length; i++) {
                s += this.terms[i].toString(true)
            }
            return s;
        };

        return this;
    }
});