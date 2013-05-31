$.extend(KhanUtil, {
    Polynomial: function(minDegree, maxDegree, coefs, variable, name) {
        var term = function(coef, vari, degree) {

            // sort of a weird error behavior
            if (typeof coef === "undefined" || coef === 0) {
                return null;
            }

            if (degree === 0) {
                return coef;
            } else if (degree === 1) {
                return ["*", coef, vari];
            } else {
                return ["*", coef, ["^", vari, degree]];
            }

        };

        // inverse of term.    Given an expression it returns the coef and degree.
        // calculus needs this for hints
        var extractFromExpr = function(expr) {
            var coef, degree;
            if (typeof expr === "number") {
                coef = expr;
                degree = 0;
            } else if ($.isArray(expr) && !$.isArray(expr[2])) {
                coef = expr[1];
                degree = 1;
            } else if ($.isArray(expr) && $.isArray(expr[2])) {
                coef = expr[1];
                degree = expr[2][2];
            }
            return {
                coef: coef,
                degree: degree
            };
        };

        // These seem royally useless to me
        if (maxDegree >= minDegree) {
            this.minDegree = minDegree;
            this.maxDegree = maxDegree;
        } else {
            this.minDegree = maxDegree;
            this.maxDegree = minDegree;
        }

        this.coefs = coefs || KhanUtil.randCoefs(this.minDegree, this.maxDegree);

        this.variable = (typeof variable !== "undefined") ? variable : "x";

        this.name = name || "f";

        this.findMaxDegree = function(coefs) {
            if (!coefs) {
                for (var i = this.maxDegree; i >= this.minDegree; i--) {
                    if (this.coefs[i] !== 0) {
                        return i;
                    }
                }
            } else {
                for (var i = coefs.length - 1; i >= 0; i--) {
                    if (coefs[i] !== 0) {
                        return i;
                    }
                }
                return -1;
            }
        };

        this.findMinDegree = function(coefs) {
            if (!coefs) {
                for (var i = this.minDegree; i <= this.maxDegree; i++) {
                    if (this.coefs[i] !== 0) {
                        return i;
                    }
                }
            } else {
                for (var i = 0; i < coefs.length; i++) {
                    if (coefs[i] !== 0) {
                        return i;
                    }
                }
                return -1;
            }
        };

        this.expr = function(vari) {
            if (typeof vari === "undefined") {
                vari = this.variable;
            }

            var expr = ["+"];

            for (var i = this.maxDegree; i >= this.minDegree; i--) {
                var theTerm = term(this.coefs[i], vari, i);

                if (theTerm != null) {
                    expr.push(theTerm);
                }
            }

            return expr;
        };

        this.getNumberOfTerms = function() {

            // -1 as the first term in the expression for a polynomial is always a "+"
            return this.expr().length - 1;

        };

        this.getCoefAndDegreeForTerm = function(termIndex) {

            //returns the coef and degree for a particular term
            var numberOfTerms = this.getNumberOfTerms();

            //mod twice to always get positive
            termIndex = ((termIndex % numberOfTerms) + numberOfTerms) % numberOfTerms;

            //upshift by one due to "+" sign at the front of the expression
            return extractFromExpr(this.expr()[termIndex + 1]);

        };

        this.text = function() {
            return KhanUtil.expr(this.expr(this.variable));
        };

        this.toString = this.text;

        this.hintEvalOf = function(val) {
            return KhanUtil.expr(this.expr(val));
        };

        this.evalOf = function(val) {
            return KhanUtil.expr(this.expr(val), true);
        };

        this.hint = function(val) {
            var hints = [];
            hints.push("<p><code>" + this.name + "(" + val + ") = " +
                this.hintEvalOf(val) + "</code></p>");
            hints.push("<p><code>" + this.name + "(" + val + ") = " +
                this.evalOf(val) + "</code></p>");

            return hints;
        };

        this.derivative = function() {
            var ddxCoefs = [];

            for (var i = this.maxDegree; i >= this.minDegree; i--) {
                ddxCoefs[i - 1] = i * this.coefs[i];
            }

            // if the term's degree is zero, the derivative degree is not
            // decremented
            var ddxMinDegree = this.minDegree ? this.minDegree - 1 : 0;
            var ddxMaxDegree = this.maxDegree ? this.maxDegree - 1 : 0;

            return new KhanUtil.Polynomial(ddxMinDegree, ddxMaxDegree, ddxCoefs, this.variable);
        },

        /**
         * Add this polynomial to a number or other polynomial.
         *
         * Assumes the second polynomial's variable is the same as the first
         * polynomial's.
         *
         * Does not change the polynomials, returns the result.
         */
        this.add = function(addend) {
            var coefs = [];

            if (typeof addend === "number") {
                addend = new KhanUtil.Polynomial(0, 0, [addend], this.variable);
            }

            // Assume if it's not a number it's a polynomial
            var minDegree = Math.min(this.minDegree, addend.minDegree);
            var maxDegree = Math.max(this.maxDegree, addend.maxDegree);
            for (var i = minDegree; i <= maxDegree; i++) {
                var value = 0;

                value += i <= this.maxDegree ? this.coefs[i] : 0;
                value += i <= addend.maxDegree ? addend.coefs[i] : 0;

                coefs[i] = value;
            }

            return new KhanUtil.Polynomial(minDegree, maxDegree, coefs, this.variable);
        };

        /**
         * Subtracts a number or other polynomial from this polynomial.
         *
         * Assumes the second polynomial's variable is the same as the first
         * polynomial's.
         *
         * Does not change the polynomials, returns the result.
         */
        this.subtract = function(addend) {
            if (typeof addend === "number") {
                return this.add(-addend);
            } else {
                return this.add(addend.multiply(-1));
            }
        };

        /**
         * Multiplies this polynomial by a number or other polynomial.
         *
         * Assumes the second polynomial's variable is the same as the first
         * polynomial's.
         *
         * Does not change the polynomials, returns the result.
         */
        this.multiply = function(value) {
            var coefs = [];
            if (typeof value === "number") {

                for (var i = 0; i < this.coefs.length; i++) {
                    coefs[i] = this.coefs[i] * value;
                }

                return new KhanUtil.Polynomial(this.minDegree, this.maxDegree, coefs, this.variable);

            // Assume if it's not a number it's a polynomial
            } else {
                for (var i = this.minDegree; i <= this.maxDegree; i++) {
                    if (this.coefs[i] === 0) {
                        continue;
                    }
                    for (var j = value.minDegree; j <= value.maxDegree; j++) {
                        if (value.coefs[j] === 0) {
                            continue;
                        }

                        var coef = this.coefs[i] * value.coefs[j];

                        if (coefs[i + j] === undefined) {
                            coefs[i + j] = coef;
                        } else {
                            coefs[i + j] += coef;
                        }
                    }
                }

                // Fill in any missing values of coefs with 0s
                for (var i = 0; i < coefs.length; i++) {
                    if (coefs[i] === undefined) {
                        coefs[i] = 0;
                    }
                }

                return new KhanUtil.Polynomial(Math.min(this.minDegree, value.minDegree), coefs.length - 1, coefs, this.variable);
            }
        };

        // Scale or shift a polynomial
        // Example: f(x) = Ax^2 + Bx + C ==>
        //          f(mx + b) = A(mx + b)^2 + B(mx + b) + C
        this.scale = function(m, b) {

            // v = mx + b
            var v = new KhanUtil.Polynomial(0, 1, [b, m]);

            var n = this.getNumberOfTerms();

            // nothing to scale of the polynomial is y = 0
            if (n === 0) {
                return this;
            }

            // expand each substituted term of the polynomial
            var self = this;
            var termPolys = _.map(_.range(0, n), function(i) {
                var term = self.getCoefAndDegreeForTerm(i);

                // start with the coefficient in front of the term
                var termPoly = new KhanUtil.Polynomial(0, 0, [term.coef]);

                // expand the substituted term
                // ex: A(mx + b)^3 = A(mx + b)(mx + b)(mx + b)
                _.times(term.degree, function(j) {
                    termPoly = termPoly.multiply(v);
                });
                return termPoly;
            });

            // add all of the substituted terms
            var scaledPoly = _.reduce(termPolys, function(memo, curr) {
                return memo.add(curr);
            });

            return scaledPoly;
        };

        return this;
    },

    CompositePolynomial: function(minDegree, maxDegree, coefs, variable, name,
            composed, composedCoef) {
        var base = new KhanUtil.Polynomial(
            minDegree, maxDegree, coefs, variable, name);

        $.extend(this, base);

        if (!composedCoef) {
            composedCoef = KhanUtil.randRangeNonZero(-5, 5);
        }
        var composedFunc = composed.name + "(" + this.variable + ")";

        var tackOn = function(expr, tack) {
            expr = $.merge([], expr);

            if (expr[0] === "+") {
                expr.push(tack);
            } else {
                expr = ["+", expr, tack];
            }

            return expr;
        };

        this.expr = function(vari) {
            return tackOn(base.expr(vari), ["*", composedCoef, composedFunc]);
        };

        this.text = function() {
            return KhanUtil.expr(this.expr(this.variable));
        };

        this.toString = this.text;

        this.hintEvalOf = function(val, evalInner) {
            if (evalInner) {

                return KhanUtil.expr(tackOn(base.expr(val),
                    ["*", composedCoef, composed.evalOf(val)]));

            } else {

                return KhanUtil.expr(tackOn(base.expr(val),
                    ["*", composedCoef, composed.name + "(" + val + ")"]));

            }
        };

        this.evalOf = function(val) {
            return base.evalOf(val) + composedCoef * composed.evalOf(val);
        };

        this.hint = function(val) {
            var hints = [];
            hints.push("<p><code>" + this.name + "(" + val + ") = " +
                this.hintEvalOf(val) + "</code></p>");

            var composedFuncWithVal = composed.name + "(" + val + ")";

            hints.push(
                $._("<p>To solve for the value of <code>%(name)s</code>, we " +
                "need to solve for the value of " +
                "<code>%(composedFuncWithVal)s</code>.</p>",
                {name: this.name, composedFuncWithVal: composedFuncWithVal}));

            hints = hints.concat(composed.hint(val));

            hints.push($._("<p>That means <code>%(name)s(%(val)s) = " +
                "%(hintEvalOf)s</code></p>",
                {name: this.name, val: val,
                    hintEvalOf: this.hintEvalOf(val, true)}));

            hints.push("<p><code>" + this.name + "(" + val + ") = " +
                this.evalOf(val) + "</code></p>");

            return hints;

        };

        return this;

    },

    randCoefs: function randCoefs(minDegree, maxDegree) {
        var coefs = [];
        var allZero = true;

        for (var i = maxDegree; i >= minDegree; i--) {
            coefs[i] = KhanUtil.randRange(-7, 7);
            allZero = allZero && coefs[i] === 0;
        }

        return allZero ? randCoefs(minDegree, maxDegree) : coefs;
    },

    findRootsNumerically: function(fn, range, step) {
        step = step || 0.05;
        var x = range[0];
        var positive = fn(x) > 0;
        var roots = [];
        while (x < range[1]) {
            x += step;
            if ((fn(x) > 0) !== positive) {
                roots.push(KhanUtil.roundToNearest(step, x - step));
                positive = !positive;
            }
        }
        return roots;
    }
});
