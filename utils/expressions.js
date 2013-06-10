$.extend(KhanUtil, {

    expr: function(expr, compute) {
        if (typeof expr === "object") {
            var op = expr[0],
                args = expr.slice(1),
                table = compute ? KhanUtil.computeOperators : KhanUtil.formatOperators;

            return table[op].apply(this, args);
        } else {
            return compute ? expr : expr.toString();
        }
    },

    exprType: function(expr) {

        if (typeof expr === "object") {

            return expr[0];

        } else {

            return typeof(expr);

        }
    },

    // Do I start with a minus sign?
    exprIsNegated: function(expr) {
        switch (KhanUtil.exprType(expr)) {
            case "color":
            return KhanUtil.exprIsNegated(expr[2]);

            case "/":
            return KhanUtil.exprIsNegated(expr[1]);

            case "+":
            case "-":
            return true;

            case "number":
            return expr < 0;

            case "string":
            return expr.charAt(0) === "-";

            default:
            // case "*":
            return false;
        }
    },

    // Mostly, is it okay to add a coefficient to me without adding parens?
    exprIsShort: function(expr) {
        switch (KhanUtil.exprType(expr)) {
            case "color":
            return KhanUtil.exprIsShort(expr[2]);

            case "+":
            case "-":
            case "*":
            case "/":
            case "frac":
            return false;

            case "^":
            return KhanUtil.exprType(expr[1]) !== "number" || expr[1] < 0;

            case "number":
            case "sqrt":
            return true;

            default:
            return expr.length <= 1;
        }
    },

    exprParenthesize: function(expr) {
        return KhanUtil.exprIsShort(expr) ?
            KhanUtil.expr(expr) :
            "(" + KhanUtil.expr(expr) + ")";
    },

    formatOperators: {
        "color": function(color, arg) {

            // Arguments should look like ["blue", [...]]
            return "\\color{" + color + "}{" + KhanUtil.expr(arg) + "}";
        },

        "+": function() {
            var args = [].slice.call(arguments, 0);
            var terms = $.grep(args, function(term, i) {
                return term != null;
            });

            // Remove terms that evaluate to 0
            terms = _.filter(terms, function(term) {
                return "" + KhanUtil.expr(term) !== "0";
            });

            terms = $.map(terms, function(term, i) {
                var parenthesize;
                switch (KhanUtil.exprType(term)) {
                    case "+":
                    parenthesize = true;
                    break;

                    case "-":
                    parenthesize = (term.length > 2);
                    break;

                    default:
                    // case "*":
                    // case "/":
                    // case "^":
                    parenthesize = false;
                }

                term = KhanUtil.expr(term);

                if (parenthesize) {
                    term = "(" + term + ")";
                }

                if (term.charAt(0) !== "-" || parenthesize) {
                    term = "+" + term;
                }

                return term;
            });

            var joined = terms.join("");

            if (joined.charAt(0) === "+") {
                return joined.slice(1);
            } else {
                return joined;
            }
        },

        "-": function() {
            if (arguments.length === 1) {
                return KhanUtil.expr(["*", -1, arguments[0]]);
            } else {
                var args = [].slice.call(arguments, 0);
                var terms = $.map(args, function(term, i) {
                    var negate = KhanUtil.exprIsNegated(term);
                    var parenthesize;
                    switch (KhanUtil.exprType(term)) {
                        case "+":
                        case "-":
                        parenthesize = true;
                        break;

                        default:
                        // case "*":
                        // case "/":
                        // case "^":
                        parenthesize = false;
                    }

                    term = KhanUtil.expr(term);

                    if ((negate && i > 0) || parenthesize) {
                        term = "(" + term + ")";
                    }

                    return term;
                });

                var joined = terms.join("-");

                return joined;
            }
        },

        "*": function() {
            var rest = Array.prototype.slice.call(arguments, 1);
            rest.unshift("*");

            // If we're multiplying by 1, ignore it, unless we have ["*", 1] and
            // should return 1
            if (arguments[0] === 0) {
                return 0;
            } else if (arguments[0] === 1 && rest.length > 1) {
                return KhanUtil.expr(rest);
            } else if (arguments[0] === -1 && rest.length > 1) {
                var form = KhanUtil.expr(rest);
                if (KhanUtil.exprIsNegated(rest[1])) {
                    return "-(" + form + ")";
                } else {
                    return "-" + form;
                }
            }

            if (arguments.length > 1) {
                var args = [].slice.call(arguments, 0);
                var parenthesizeRest = KhanUtil.exprType(arguments[0]) === "number" &&
                    KhanUtil.exprType(arguments[1]) === "number";
                var factors = $.map(args, function(factor, i) {
                    var parenthesize;
                    switch (KhanUtil.exprType(factor)) {
                        case "number":
                        if (i > 0) {
                            parenthesize = true;
                        }
                        break;

                        default:
                        parenthesize = !KhanUtil.exprIsShort(factor);
                        break;
                    }

                    parenthesizeRest || (parenthesizeRest = parenthesize);
                    factor = KhanUtil.expr(factor);

                    if (parenthesizeRest) {
                        factor = "(" + factor + ")";
                    }

                    return factor;
                });

                return factors.join("");
            } else {
                return KhanUtil.expr(arguments[0]);
            }
        },

        "times": function(left, right) {
            var parenthesizeLeft = !KhanUtil.exprIsShort(left);
            var parenthesizeRight = !KhanUtil.exprIsShort(right);

            left = KhanUtil.expr(left);
            right = KhanUtil.expr(right);

            left = parenthesizeLeft ? "(" + left + ")" : left;
            right = parenthesizeRight ? "(" + right + ")" : right;

            return left + " \\times " + right;
        },

        "dot": function(left, right) {
            var parenthesizeLeft = !KhanUtil.exprIsShort(left);
            var parenthesizeRight = !KhanUtil.exprIsShort(right);

            left = KhanUtil.expr(left);
            right = KhanUtil.expr(right);

            left = parenthesizeLeft ? "(" + left + ")" : left;
            right = parenthesizeRight ? "(" + right + ")" : right;

            return left + " \\cdot " + right;
        },

        "/": function(num, den) {
            var parenthesizeNum = !KhanUtil.exprIsShort(num);
            var parenthesizeDen = !KhanUtil.exprIsShort(den);

            num = KhanUtil.expr(num);
            den = KhanUtil.expr(den);

            num = parenthesizeNum ? "(" + num + ")" : num;
            den = parenthesizeDen ? "(" + den + ")" : den;

            return num + "/" + den;
        },

        "frac": function(num, den) {
            return "\\dfrac{" + KhanUtil.expr(num) + "}{" +
                KhanUtil.expr(den) + "}";
        },

        "^": function(base, pow) {
            if (pow === 0) {
                return "";
            } else if (pow === 1) {
                return KhanUtil.expr(base);
            }

            var parenthesizeBase, trigFunction;
            switch (KhanUtil.exprType(base)) {
                case "+":
                case "-":
                case "*":
                case "/":
                case "^":
                case "ln":
                parenthesizeBase = true;
                break;

                case "number":
                parenthesizeBase = base < 0;
                break;

                case "sin":
                case "cos":
                case "tan":
                case "csc":
                case "sec":
                case "cot":
                parenthesizeBase = false;
                trigFunction = true;
                break;

                default:
                parenthesizeBase = false;
                trigFunction = false;
            }

            base = KhanUtil.expr(base);
            if (parenthesizeBase) {
                base = "(" + base + ")";
            }

            pow = KhanUtil.expr(pow);

            if (trigFunction) {
                return base.replace(/\\(\S+?)\{/, function(match, word) {
                    return "\\" + word + "^{" + pow + "} {";
                });
            } else {
                return base + "^{" + pow + "}";
            }
        },

        "sqrt": function(arg) {
            return "\\sqrt{" + KhanUtil.exprParenthesize(arg) + "}";
        },

        "sin": function(arg) {
            return "\\sin{" + KhanUtil.exprParenthesize(arg) + "}";
        },

        "cos": function(arg) {
            return "\\cos{" + KhanUtil.exprParenthesize(arg) + "}";
        },

        "tan": function(arg) {
            return "\\tan{" + KhanUtil.exprParenthesize(arg) + "}";
        },

        "sec": function(arg) {
            return "\\sec{" + KhanUtil.exprParenthesize(arg) + "}";
        },

        "csc": function(arg) {
            return "\\sec{" + KhanUtil.exprParenthesize(arg) + "}";
        },

        "cot": function(arg) {
            return "\\sec{" + KhanUtil.exprParenthesize(arg) + "}";
        },

        "ln": function(arg) {
            return "\\ln{" + KhanUtil.exprParenthesize(arg) + "}";
        },

        "+-": function() {
            if (arguments.length === 1) {
                return "\\pm " + KhanUtil.exprParenthesize(arguments[0]);
            } else {
                var args = [].slice.call(arguments, 0);
                return $.map(args, function(term, i) {
                    return KhanUtil.expr(term);
                }).join(" \\pm ");
            }
        }
    },

    computeOperators: {
        "color": function(color, arg) {
            return KhanUtil.expr(arg, true);
        },

        "+": function() {
            var args = [].slice.call(arguments, 0);
            var sum = 0;

            $.each(args, function(i, term) {
                sum += KhanUtil.expr(term, true);
            });

            return sum;
        },

        "-": function() {
            if (arguments.length === 1) {
                return -KhanUtil.expr(arguments[0], true);
            } else {
                var args = [].slice.call(arguments, 0);
                var sum = 0;

                $.each(args, function(i, term) {
                    sum += (i === 0 ? 1 : -1) * KhanUtil.expr(term, true);
                });

                return sum;
            }
        },

        "*": function() {
            var args = [].slice.call(arguments, 0);
            var prod = 1;

            $.each(args, function(i, term) {
                prod *= KhanUtil.expr(term, true);
            });

            return prod;
        },

        "/": function() {
            var args = [].slice.call(arguments, 0);
            var prod = 1;

            $.each(args, function(i, term) {
                var e = KhanUtil.expr(term, true);
                prod *= (i === 0 ? e : 1 / e);
            });

            return prod;
        },

        "^": function(base, pow) {
            return Math.pow(KhanUtil.expr(base, true), KhanUtil.expr(pow, true));
        },

        "sqrt": function(arg) {
            return Math.sqrt(KhanUtil.expr(arg, true));
        },

        "+-": function() {
            return Number.NaN;
        }
    },

    // Remove ["color", ...] tags from an expression
    exprStripColor: function(expr) {
        if (typeof expr !== "object") {
            return expr;
        } else if (expr[0] === "color") {
            return KhanUtil.exprStripColor(expr[2]);
        } else {
            return $.map(expr, function(el, i) {

                // Wrap in an array because $.map flattens the result by one level
                return [(i === 0) ? el : KhanUtil.exprStripColor(el)];
            });
        }
    },

    // simplify an expression by collapsing all the associative
    // operations.  e.g. ["+", ["+", 1, 2], 3] -> ["+", 1, 2, 3]
    exprSimplifyAssociative: function(expr) {
        if (typeof expr !== "object") {
            return expr;
        }

        var simplified = $.map(expr.slice(1), function(x) {
            //encapsulate in a list so $.map unpacks it correctly
            return [KhanUtil.exprSimplifyAssociative(x)];
        });

        var flattenOneLevel = function(e) {
            switch (expr[0]) {
                case "+":
                if (e[0] === "+") {
                    return e.slice(1);
                }
                break;

                case "*":
                if (e[0] === "*") {
                    return e.slice(1);
                }
                break;
            }
            //make sure that we encapsulate e in an array so $'s map
            //does't accidently unpacks e itself.
            return [e];
        };

        //here we actually want the $ behavior of
        //having any lists that flattenOneLevel returns merged into
        //the result
        var ret = $.map(simplified, flattenOneLevel);
        ret.unshift(expr[0]);

        return ret;
    }
});

KhanUtil.computeOperators["frac"] = KhanUtil.computeOperators["/"];
