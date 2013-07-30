$.extend(KhanUtil, {

    getPermutations: function(arr) {
        var permArr = [];
        var usedChars = [];

        function permute(input) {
            for (var i = 0; i < input.length; i++) {
                var term = input.splice(i, 1)[0];
                usedChars.push(term);
                if (input.length == 0) {
                    permArr.push(usedChars.slice());
                }
                permute(input);
                input.splice(i, 0, term);
                usedChars.pop();
            }
            return permArr;
        };

        return permute(arr);
    },

    writeExpressionFraction: function(numerator, denominator) {
        if (numerator.isNegative()) {
            return "-\\dfrac{" + numerator.multiply(-1).toString() + "}{" + denominator.toString() + "}";
        } else {
            return "\\dfrac{" + numerator.toString() + "}{" + denominator.toString() + "}";
        }
    },

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
        regex += vari + "\\s*";

        if (constant === 0) {
            regex += "$";
        } else {
            regex = "(" + regex;
            regex += constant < 0 ? "[-\\u2212]" : "\\+";
            regex += "\\s*" + Math.abs(constant) + "\\s*$)|(^\\s*";

            if (constant < 0) {
                regex += "[-\\u2212]\\s*";
            }

            regex += Math.abs(constant) + "\\s*";
            regex += coefficient < 0 ? "[-\\u2212]\\s*" : "\\+\\s*";

            if (coefficient !== 1 && coefficient !== -1) {
                regex += Math.abs(coefficient) + "\\s*";
            }
            regex += vari + "\\s*$)";
        }

        return regex;
    },

    /*
    Term in an expression
    Takes an array. The first value is the coefficient
    and subsequent values are variables and their degree
    e.g. Term(5) = 5
         Term(5, 'x') = 5x
         Term(5, 'xy') = 5xy
         Term(5, {'x': 1}) = 5x
         Term(5, {'x': 2}) = 5x^2
         Term(5, {'x': 1, 'y': 2}) = 5xy^2
    */
    Term: function(coefficient, variables) {
        this.coefficient = coefficient;
        this.variables = {};

        if (typeof variables === 'string') {
            for (var i = 0; i < variables.length; i++) {
                this.variables[variables.charAt(i)] = 1;
            }
        } else if (variables !== undefined){
            this.variables = variables;
        }

        // Use for hashing
        this.variableString = ''
        for (var vari in this.variables) {
            if (this.variables[vari] !== 0) {
                this.variableString += vari + this.variables[vari];
            } else {
                delete this.variables[vari];
            }
        }

        this.isNegative = function() {
            return this.coefficient < 0;
        }

        // Return a RationalExpression object representing the sum of this term with the passed object
        this.add = function(expression) {
            // Copy self so don't mutate original term
            var copy = [this.coefficient, this.variables];

            if (expression instanceof KhanUtil.RationalExpression) {
                return expression.add(this);
            } else if (expression instanceof KhanUtil.Term) {
                return new KhanUtil.RationalExpression([copy, [expression.coefficient, expression.variables]]);
            } else {
                return new KhanUtil.RationalExpression([copy, expression]);
            }
        }

        // Return a new term representing this term multiplied by another term or a number
        this.multiply = function(term) {
            var coefficient = this.coefficient;
            var variables = {};

            for (var i in this.variables) {
                variables[i] = this.variables[i];
            }

            if (typeof term === 'number') {
                coefficient *= term;
            } else {
                coefficient *= term.coefficient;
                for (var i in term.variables) {
                    if (variables[i] != null) {
                        variables[i] += term.variables[i];
                    } else {
                        variables[i] = term.variables[i];
                    }
                }
            }

            return new KhanUtil.Term(coefficient, variables);
        };

        // Return a new term representing this term divided by another term or a number
        this.divide = function(term) {
            var coefficient = this.coefficient;
            var variables = {}

            for (var i in this.variables) {
                variables[i] = this.variables[i];
            }

            if (typeof term === 'number') {
                coefficient /= term;
            } else {
                coefficient /= term.coefficient;
                for (var i in term.variables) {
                    if (variables[i]) {
                        variables[i] -= term.variables[i];
                    } else {
                        variables[i] = -term.variables[i];
                    }
                }
            }

            return new KhanUtil.Term(coefficient, variables);
        };

        // Return a Term object representing the greatest common factor between this term and another
        this.getGCD = function(expression) {
            if (expression instanceof KhanUtil.RationalExpression) {
                return expression.getGCD(this);
            }

            if (typeof expression === 'number') {
                return KhanUtil.getGCD(this.coefficient, expression);
            }
            
            var coefficient = KhanUtil.getGCD(this.coefficient, expression.coefficient);
            var variables = {};

            for (var i in this.variables) {
                if (expression.variables[i]) {
                    variables[i] = Math.min(this.variables[i], expression.variables[i]);
                }
            }

            return new KhanUtil.Term(coefficient, variables);
        };

        // includeSign if term is not the first in an expression
        this.toString = function(includeSign) {
            if (this.coefficient === 0) {
                return "";
            }

            var coefficient = Math.abs(this.coefficient);
            var s = "";

            if (includeSign) {
                s += this.coefficient >= 0 ? " + " : " - ";
            } else if (this.coefficient < 0) {
                s += "-";
            }

            if (!(coefficient === 1 && this.variableString !== "")) {
                s += coefficient;
            }

            for (var vari in this.variables) {
                var degree = this.variables[vari];

                if (degree === 0) {
                    continue;
                }
                s += vari;
                if (degree !== 1) {
                    s += "^" + degree;
                }
            }
            return s;
        };

        // Return a regex that will capture this term
        // If includeSign is true, then 4x is captured by +4x
        this.regex = function(includeSign) {
            if (this.coefficient === 0) {
                return "";
            }

            // Include leading space if there are earlier terms
            if (this.coefficient < 0){
                var regex = includeSign ? "[-\\u2212]\\s*" : "\\s*[-\\u2212]\\s*";
            } else {
                var regex = includeSign ? "\\+\\s*" : "\\s*";
            }

            if (!(Math.abs(this.coefficient) === 1 && this.variableString !== "")) {
                regex += Math.abs(this.coefficient);
            }

            // Add all permuations of variables
            var variable_array = [];
            for (var vari in this.variables) {
                if (degree !== 0) {
                    variable_array.push([vari, this.variables[vari]]);
                }
            }

            if (variable_array.length > 1) {
                permuations = KhanUtil.getPermutations(variable_array);

                regex += "(?:";
                for (var p=0; p<permuations.length; p++) {
                    var variables = permuations[p];

                    regex += "(?:";
                    for (var i=0; i<variables.length; i++) {
                        var vari = variables[i][0];
                        var degree = variables[i][1];
                        regex += degree > 1 ? vari + "\\s*\\^\\s*" + degree : vari;
                    }
                    regex += p < permuations.length - 1 ? ")|" : ")";
                }
                regex += ")";

            } else if (variable_array.length === 1) {
                var vari = variable_array[0][0];
                var degree = variable_array[0][1];
                regex += degree > 1 ? vari + "\\s*\\^\\s*" + degree : vari;
            }



            // Add variable of degree 1 in random order
            // Only captures one order if there are multiple variables

            /*
            for (var vari in this.variables) {
                var degree = this.variables[vari];
                if (degree !== 0) {
                    regex += vari;
                    if (degree > 1) {
                        regex += "\\s*\\^\\s*" + degree;
                    }
                } 
            }
            */

            return regex + "\\s*";
        };

    },

    /*
        A flat (i.e. no parentheses), multi-variable polynomial expression
        Represented as an array of terms that are added together
        Terms can be numbers or an array representing [coefficient, variable]
        e.g. [5, [1, 'x']] = 5 + x
        e.g. [5, [2, {'x': 2}] = 5 + 2x^2
        e.g. [5, [2, {'x': 2, 'y': 1}]] = 5 + 2x^2y
    */
    RationalExpression: function(terms) {
        this.terms = [];

        for (var i = 0; i < terms.length; i++) {
            var term = terms[i];
            if (typeof term === 'number') {
                var newTerm = new KhanUtil.Term(term);
            } else if (term instanceof KhanUtil.Term) {
                var newTerm = new KhanUtil.Term(term.coefficient, term.variables);
            } else {
                var newTerm = new KhanUtil.Term(term[0], term[1]);
            }
            if (newTerm.coefficient !== 0) {
                this.terms.push(newTerm);
            }
        }

        // Given a term, e.g. x1, return the coefficient of that term
        this.getCoefficient = function(variable) {
            var coefficient = 0;
            for (var i = 0; i < this.terms.length; i++) {
                if (this.terms[i].variableString === variable) {
                    coefficient += this.terms[i].coefficient;
                }
            }
            return coefficient;
        };

        // Combine any terms that have the same variable and remove any with a coefficient of 0
        this.combineLikeTerms = function() {
            var variables = {};

            for (var i = 0; i < this.terms.length; i++) {
                var term = this.terms[i];
                var s = term.variableString;

                if (variables[s]) {
                    variables[s].coefficient += term.coefficient;
                } else {
                    variables[s] = term;
                }
            }

            this.terms = [];
            for (var v in variables) {
                if (variables[v].coefficient !== 0) {
                    this.terms.push(variables[v]);
                }
            }
        };
        this.combineLikeTerms();

        this.isNegative = function() {
            return this.terms[0].coefficient < 0;
        };

        // Return the coefficient of term contain variable to the degree power
        // e.g. for 5x^2 + x + 2, getCoefficentOfTerm('x', 2) will return 5
        // getCoefficentOfTerm('x',) will return 1
        // getCoefficentOfTerm() will return 2
        this.getCoefficentOfTerm = function(variable, degree) {
            var variableString = "";

            if (variable !== undefined && degree !== 0) {
                degree = degree || 1;
                variableString += variable + degree;
            }

            for (var i = 0; i < this.terms.length; i++) {
                if (this.terms[i].variableString === variableString) {
                    return this.terms[i].coefficient;
                }
            }

            return 0;
        };

        // Return a new expression which is the sum of this one and the one passed in
        this.add = function(expression) {
            var terms = [];

            // Copy own terms
            for (var i = 0; i < this.terms.length; i++) {
                var term = this.terms[i];
                terms.push([term.coefficient, term.variables]);
            }

            if (expression instanceof KhanUtil.Term) {
                // Add single term
                terms.push(new KhanUtil.Term(expression.coefficient, expression.variables));
            } else if (typeof expression === 'number') {
                // Add single digit
                terms.push(new KhanUtil.Term(expression));
            } else {
                // Add all terms from another expression
                for (var i = 0; i < expression.terms.length; i++) {
                    var term = expression.terms[i];
                    terms.push([term.coefficient, term.variables]);
                }
            }

            var result = new KhanUtil.RationalExpression(terms);
            result.combineLikeTerms();

            return result;
        };

        // Return a new expression representing the product of this one and the one passed in
        this.multiply = function(expression) {
            if (expression instanceof KhanUtil.RationalExpression) {
                var multiplyTerms = expression.terms;
            } else if (typeof expression === 'number' || expression instanceof KhanUtil.Term) {
                var multiplyTerms = [expression];
            } else {
                // Assume it's a variable name
                var multiplyTerms = [new KhanUtil.Term(1, expression)];
            }

            var terms = [];

            for (var i = 0; i < multiplyTerms.length; i++) {
                var value = multiplyTerms[i];

                for (var j = 0; j < this.terms.length; j++) {
                    terms.push(this.terms[j].multiply(value));
                }
            }

            return new KhanUtil.RationalExpression(terms);
        };

        // Return a new expression representing this one divided by a term or number
        // Note you cannot divide by another expression
        this.divide = function(term) {
            var terms = [];

            for (var i = 0; i < this.terms.length; i++) {
                terms.push(this.terms[i].divide(term));
            }

            return new KhanUtil.RationalExpression(terms);
        };

        // Return a Term object representing the greatest common divisor of all the terms in this expression
        this.factor = function() {
            var GCD = this.terms[0];

            for (var i=0; i<this.terms.length; i++) {
                GCD = GCD.getGCD(this.terms[i]);
            }

            if (this.isNegative()) {
                GCD = GCD.multiply(-1);
            }

            return GCD;
        };

        // Return a Term object representing the greatest common factor between this expression and another
        this.getGCD = function(that) {
            var t1 = this.factor();
            var t2 = that.factor();
            return t1.getGCD(t2);
        }

        this.toString = function() {
            if (this.terms.length === 0) {
                return '0';
            }

            var s = this.terms[0].toString();
            for (var i = 1; i < this.terms.length; i++) {
                s += this.terms[i].toString(s !== "");
            }

            return s;
        };

        // Return a string of the factored expression
        this.toStringFactored = function(parenthesise) {
            var f = this.factor();

            if (this.terms.length === 1 || f.toString() === '1') {
                if (parenthesise) {
                   return "(" + this.toString() + ")";
                } else {
                    return this.toString();
                }
            }

            var s = (f.toString() === '-1') ? '-' : f.toString();
            var divided = this.divide(f);

            s += "(" + divided.toString() + ")";
            return s;
        };

        // Returns a regex that captures all permutation passed in
        this.getTermsRegex = function(permutations, start, stop) {
            var regex = "";

            start = start ?  "|(?:^" + start : "|(?:^";
            stop = stop ?  stop + "$)" : "$)";

            for (var p = 0; p < permutations.length; p++) {
                regex += start;

                var terms = permutations[p];
                for (var i = 0; i < terms.length; i++) {
                    regex += terms[i].regex(i);
                }

                regex += stop;
            }
            return regex;
        }

        // Returns a single regex to capture this expression.
        // It will capture every permutations of terms so is
        // not recommended for expressions with more than 3 terms
        // If allowFactors is true, 3(x + 4) will match 3x + 12
        this.regex = function(allowFactors) {
            var permutations = KhanUtil.getPermutations(this.terms);
            var regex = this.getTermsRegex(permutations).slice(1);

            if (!allowFactors || this.terms.length === 1) {
                return regex;
            }

            // Generate regex factored expression
            // If GCD is 1, will accept parenthesised expression
            // e.g. p - 5 will accept (p - 5)
            var factor = this.factor();
            var divided = this.divide(factor);
            permutations = KhanUtil.getPermutations(divided.terms);

            if (factor.toString() === '1') {
                regex += this.getTermsRegex(permutations, "\\s*\\(", "\\)\\s*");
            } else if (factor.toString() === '-1') {
                regex += this.getTermsRegex(permutations, "\\s*[-\\u2212]\\s*\\(", "\\)\\s*");
            } else {
                // Factor before parentheses
                regex += this.getTermsRegex(permutations, factor.regex() + "\\*?\\s*\\(", "\\)\\s*");
                // Factor after parentheses
                regex += this.getTermsRegex(permutations, "\\s*\\(", "\\)\\s*\\*?" + factor.regex());
            }

            // Factor out a negative
            factor = factor.multiply(-1);
            divided = divided.multiply(-1);
            permutations = KhanUtil.getPermutations(divided.terms);

            if (factor.toString === '1') {
                regex += this.getTermsRegex(permutations, "\\s*\\(", "\\)\\s*");
            } else if (factor.toString === '-1') {
                regex += this.getTermsRegex(permutations, "\\s*[-\\u2212]\\s*\\(", "\\)\\s*");
            } else {
                // Factor before parentheses
                regex += this.getTermsRegex(permutations, factor.regex() + "\\*?\\s*\\(", "\\)\\s*");
                // Factor after parentheses
                regex += this.getTermsRegex(permutations, "\\s*\\(", "\\)\\s*\\*?" + factor.regex());
            }

            return regex;
        };
    }

});
