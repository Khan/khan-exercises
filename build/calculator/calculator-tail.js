/* TODO(csilvers): fix these lint errors (http://eslint.org/docs/rules): */
/* eslint-disable brace-style, comma-dangle, max-len, no-undef, no-var */
/* To fix, remove an entry above, run ka-lint, and fix errors. */

window.Calculator = (function(parser) {
    // I18N: calculator error message
    var ERROR_TEXT = i18n._("Error");
    var CalculatorError = function(message) {
        this.message = message;
    };
    CalculatorError.prototype = new Error();
    CalculatorError.prototype.constructor = CalculatorError;

    parser.yy.parseError = function parseError(str, hash) {
        throw new CalculatorError(ERROR_TEXT);
    };

    var userID = window.KA && window.KA.getUserID && window.KA.getUserID();
    var settings = {};
    if (window.localStorage != null) {
        try {
            settings = $.parseJSON(
                window.localStorage["calculator_settings:" + userID] || "{}");
        } catch (e) {
            // Some IE11 users can get into a situation where
            // window.localStorage exists (the "Enable DOM Storage" GPO is
            // set), but where it is not actually usable (likely because
            // %APPDATA%\..\LocalLow has bad integrity settings). In this
            // situation, the above attempt to access window.localStorage will
            // succeed--i.e., it won't be == null--but attempting to access it
            // will throw an error. Instead, we catch here and move on with
            // our lives.
            //
            // To repro this/verify that any changes you do don't make this
            // problem worse, grab a Windows box, make an account, and then,
            // from an elevated ("Administrator") command prompt, run
            //
            //    icacls %APPDATA%\..\LocalLow /t /setintegritylevel (OI)(CI)H
            //
            // To undo the damage when you're done testing, run
            //
            //    icacls %APPDATA%\..\LocalLow /t /setintegritylevel (OI)(CI)L
        }
    }
    if (settings.angleMode == null) {
        settings.angleMode = "DEG";
    }

    return _.bindAll({
        settings: settings,
        parser: parser,
        parse: _.bind(parser.parse, parser),

        evaluate: function(tree, ans) {
            var toRad = function(ang) {
                if (settings.angleMode === "DEG") {
                    return ang * Math.PI / 180;
                }
                return ang;
            };
            var fromRad = function(ang) {
                if (settings.angleMode === "DEG") {
                    return ang / Math.PI * 180;
                }
                return ang;
            };
            if (tree === "ans") {
                if (ans !== undefined) {
                    return ans;
                } else {
                    throw new CalculatorError(i18n._("Invalid variable ans"));
                }
            } else if (tree === "pi") {
                return Math.PI;
            } else if (tree === "e") {
                return Math.E;
            } else if (_.isNumber(tree)) {
                return tree;
            } else if (_.isArray(tree)) {
                var fns = {
                    "+": function(a, b) { return a + b; },
                    "-": function(a, b) { return b === undefined ? -a : a - b; },
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
                            throw new CalculatorError(i18n._("undefined"));
                        }
                        return ans;
                    },
                    asin: function(a) {
                        var ans = fromRad(Math.asin(a));
                        if (isNaN(ans)) {
                            throw new CalculatorError(i18n._("undefined"));
                        }
                        return ans;
                    },
                    acos: function(a) {
                        var ans = fromRad(Math.acos(a));
                        if (isNaN(ans)) {
                            throw new CalculatorError(i18n._("undefined"));
                        }
                        return ans;
                    },
                    atan: function(a) {
                        var ans = fromRad(Math.atan(a));
                        if (isNaN(ans)) {
                            throw new CalculatorError(i18n._("undefined"));
                        }
                        return ans;
                    },
                    ln: function(a) {
                        var ans = Math.log(a);
                        if (isNaN(ans) || !isFinite(ans)) {
                            throw new CalculatorError(i18n._("undefined"));
                        }
                        return ans;
                    },
                    log: function(a) {
                        var ans = Math.log(a) / Math.LN10;
                        if (isNaN(ans) || !isFinite(ans)) {
                            throw new CalculatorError(i18n._("undefined"));
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
                    throw new CalculatorError(ERROR_TEXT);
                }
            } else {
                throw new CalculatorError(
                    i18n._("Invalid type %(type)s",
                        {type: Object.prototype.toString.call(tree)}));
            }
        },

        calculate: function(str, ans) {
            var tree = this.parse(str);
            return this.evaluate(tree, ans);
        },
        CalculatorError: CalculatorError
    }, "evaluate", "calculate");
})(Calculator);
