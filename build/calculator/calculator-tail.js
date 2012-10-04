var Calculator = (function(parser) {
    var CalculatorError = function(message) {
        this.message = message;
    };
    CalculatorError.prototype = new Error();
    CalculatorError.prototype.constructor = CalculatorError;

    parser.parseError = function parseError(str, hash) {
        throw new CalculatorError("err");
    };

    return _.bindAll({
        angleMode: "DEG",
        parser: parser,
        parse: _.bind(parser.parse, parser),

        evaluate: function(tree, ans) {
            var toRad = function(ang) {
                if (Calculator.angleMode === "DEG") {
                    return ang * Math.PI / 180;
                }
                return ang;
            };
            var fromRad = function(ang) {
                if (Calculator.angleMode === "DEG") {
                    return ang / Math.PI * 180;
                }
                return ang;
            };
            if (tree === "ans") {
                if (ans != null) {
                    return ans;
                } else {
                    throw new CalculatorError("Invalid variable ans");
                }
            } else if (_.isNumber(tree)) {
                return tree;
            } else if (_.isArray(tree)) {
                var fns = {
                    "+": function(a, b) { return a + b; },
                    "-": function(a, b) { return b == null ? -a : a - b; },
                    "*": function(a, b) { return a * b; },
                    "/": function(a, b) { return a / b; },
                    "^": function(a, b) { return Math.pow(a, b); },
                    "!": function f(a) { return a <= 1 ? 1 : a * f(a - 1); },
                    sqrt: function(a) { return Math.pow(a, 0.5); },
                    sin: function(a) { return Math.sin(toRad(a)); },
                    cos: function(a) { return Math.cos(toRad(a)); },
                    tan: function(a) {
                        var ans = Math.tan(toRad(a));
                        if (isNaN(ans) || Math.abs(ans) > Math.pow(2, 53)) {
                            throw new CalculatorError("undefined");
                        }
                        return ans;
                    },
                    asin: function(a) {
                        var ans = fromRad(Math.asin(a));
                        if (isNaN(ans)) {
                            throw new CalculatorError("undefined");
                        }
                        return ans;
                    },
                    acos: function(a) {
                        var ans = fromRad(Math.acos(a));
                        if (isNaN(ans)) {
                            throw new CalculatorError("undefined");
                        }
                        return ans;
                    },
                    atan: function(a) {
                        var ans = fromRad(Math.atan(a));
                        if (isNaN(ans)) {
                            throw new CalculatorError("undefined");
                        }
                        return ans;
                    }
                };

                if (tree[0] in fns) {
                    var self = this;
                    return fns[tree[0]].apply(
                        this, _.map(tree.slice(1), function(t) {
                            return self.evaluate(t, ans); }));
                } else {
                    throw new CalculatorError("err");
                }
            } else {
                throw new CalculatorError(
                    "Invalid type " + Object.prototype.toString.call(tree));
            }
        },

        calculate: function(str, ans) {
            var tree = this.parse(str);
            return this.evaluate(tree, ans);
        },
        CalculatorError: CalculatorError
    }, "evaluate", "calculate");
})(Calculator);
