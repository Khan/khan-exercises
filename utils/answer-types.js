/* TODO(csilvers): fix these lint errors (http://eslint.org/docs/rules): */
/* eslint-disable brace-style, comma-dangle, indent, max-len, no-redeclare, no-undef, no-var, one-var, prefer-spread, space-after-keywords */
/* To fix, remove an entry above, run ka-lint, and fix errors. */

define(function(require) {

var MAXERROR_EPSILON = Math.pow(2, -42);

// Function used to get the text of the choices, which is then used
// to check against the correct answer
var extractRawCode = function(elem) {
    var $elem = $(elem).clone(true);
    var code = $elem.find("code");
    if (code.length) {
        // If there are <code> tags in the element, remove them and replace
        // them with their original formulas
        $.each(code, function(i, elem) {
            $(elem).replaceWith(
                // TODO(emily): Adding <code> and <script> tags around this is
                // a horrible hack to make this code backwards-compatible with
                // the old extractRawCode (so that timeline works, etc). Remove
                // this at some point and make it just return the formula, not
                // the wrapping.
                '<code><script type="math/tex">' +
                KhanUtil.retrieveMathFormula(elem) +
                '</script></code>'
            );
        });
    }
    return $elem.html();
};

function getTextSquish(elem) {
    return $(elem).text().replace(/\s+/g, "");
}

// TODO(alpert): Don't duplicate from khan-exercise.js
function checkIfAnswerEmpty(guess) {
    // If multiple-answer, join all responses and check if that's empty
    // Remove commas left by joining nested arrays in case multiple-answer is
    // nested
    return $.trim(guess) === "" || (guess instanceof Array &&
             $.trim(guess.join("").replace(/,/g, "")) === "");
}

function addExamplesToInput($input, examples) {
    if ($input.data("qtip")) {
        $input.qtip("destroy", /* immediate */ true);
    }

    var $examples = $('<ul class="examples" style="display: none"></ul>');

    _.each(examples, function(example) {
        $examples.append("<li>" + example + "</li>");
    });

    $input.qtip({
        content: {
            text: $examples.remove(),
            prerender: true
        },
        style: {classes: "qtip-light leaf-tooltip"},
        position: {
            my: "top left",
            at: "bottom left"
        },
        show: {
            delay: 0,
            effect: {
                length: 0
            },
            event: "focus"
        },
        hide: {
            delay: 0,
            event: "blur"
        },
        events: {
            render: function() {
                // Only run the modules when the qtip is actually shown
                $examples.children().runModules();
            }
        }
    });
}

/*
 * Answer types
 *
 * Utility for creating answerable questions displayed in exercises
 *
 * Different answer types produce different kinds of input displays, and do
 * different kinds of checking on the solutions.
 *
 * Each of the objects contain two functions, setup and createValidator.
 *
 * The setup function takes a solutionarea and solution, and performs setup
 * within the solutionarea, and then returns an object which contains:
 *
 * answer: a function which, when called, will retrieve the current answer from
 *         the solutionarea, which can then be validated using the validator
 *         function
 * validator: a function returned from the createValidator function (defined
 *            below)
 * solution: the correct answer to the problem
 * showGuess: a function which, when given a guess, shows the guess within the
 *            provided solutionarea
 * showGuessCustom: a function which displays parts of a guess that are not
 *                  within the solutionarea; currently only used for custom
 *                  answers
 *
 * The createValidator function only takes a solution, and it returns a
 * function which can be used to validate an answer.
 *
 * The resulting validator function returns:
 * - true: if the answer is fully correct
 * - false: if the answer is incorrect
 * - "" (the empty string): if no answer has been provided (e.g. the answer box
 *   is left unfilled)
 * - a string: if there is some slight error
 *
 * In most cases, setup and createValidator don't really need the solution DOM
 * element so we have setupFunctional and createValidatorFunctional for them
 * which take only $solution.text() and $solution.data(). This makes it easier
 * to reuse specific answer types.
 *
 * TODO(alpert): Think of a less-absurd name for createValidatorFunctional.
 *
 */

Khan.answerTypes = $.extend(Khan.answerTypes, {
    /*
     * letters answer type. Inherits from `text` type, with a grammar hint of
     * `letters`
     */
    letters: {
        setupFunctional: function(solutionarea, solutionText, solutionData) {
            return Khan.answerTypes.text.setupFunctional(solutionarea, solutionText, solutionData, 'letters');
        },
        createValidatorFunctional: function(correct, options) {
            return Khan.answerTypes.text.createValidatorFunctional(correct, options);
        },
    },

    /*
     * lowers answer type. Inherits from `text` type, with a grammar hint of
     * `lowers`. Intended for lower-case answers.
     */
    lowers: {
        setupFunctional: function(solutionarea, solutionText, solutionData) {
            return Khan.answerTypes.text.setupFunctional(solutionarea, solutionText, solutionData, 'lowers');
        },
        createValidatorFunctional: function(correct, options) {
            return Khan.answerTypes.text.createValidatorFunctional(correct, options);
        },
    },

    /*
     * caps answer type. Inherits from `text` type, with a grammar hint of
     * `caps`
     */
    caps: {
        setupFunctional: function(solutionarea, solutionText, solutionData) {
            return Khan.answerTypes.text.setupFunctional(solutionarea, solutionText, solutionData, 'caps');
        },
        createValidatorFunctional: function(correct, options) {
            return Khan.answerTypes.text.createValidatorFunctional(correct, options);
        },
    },

    /*
     * text answer type
     *
     * Displays a simple text box, and performs direct string matching on the
     * value typed in an the answer provided
     *
     * solutionGrammar is a string used by the mobile app to determine what
     * characters should be allowed.
     */
    text: {
        setupFunctional: function(solutionarea, solutionText, solutionData, solutionGrammar) {
            solutionGrammar = solutionGrammar || 'text';
            // Add a text box
            var input;
            if (window.Modernizr && Modernizr.touchevents) {
                // special flag for iOS devices
                input = $('<input data-solution-grammar="' + solutionGrammar + '" type="text" autocapitalize="off">');
            } else {
                input = $('<input data-solution-grammar="' + solutionGrammar + '" type="text">');
            }
            $(solutionarea).append(input);

            return {
                validator: Khan.answerTypes.text.createValidatorFunctional(
                        solutionText, solutionData),
                answer: function() {
                    return input.val();
                },
                solution: $.trim(solutionText),
                showGuess: function(guess) {
                    input.val(guess === undefined ? "" : guess);
                }
            };
        },
        createValidatorFunctional: function(correct, options) {
            options = $.extend({
                correctCase: "required"
            }, options);

            correct = $.trim(correct);

            return function(guess) {
                // The fallback variable is used in place of the answer, if no
                // answer is provided (i.e. the field is left blank)
                var fallback =
                    options.fallback != null ? "" + options.fallback : "";

                guess = $.trim(guess) || fallback;
                var score = {
                    empty: false,
                    correct: false,
                    message: null,
                    guess: guess
                };
                if (guess.toLowerCase() === correct.toLowerCase()) {
                    if (correct === guess || options.correctCase === "optional") {
                        score.correct = true;
                    } else {
                        if (guess === guess.toLowerCase()) {
                            score.message = i18n._("Your answer is almost correct, but " +
                                       "must be in capital letters.");
                        } else if (guess === guess.toUpperCase()) {
                            score.message = i18n._("Your answer is almost correct, but " +
                                       "must not be in capital letters.");
                        } else {
                            score.message = i18n._("Your answer is almost correct, but " +
                                       "must be in the correct case.");
                        }
                    }
                }
                return score;
            };
        }
    },

    /*
     * predicate answer type
     *
     * performs simple predicate-based checking of a numeric solution, with
     * different kinds of number formats
     *
     * Uses the data-forms option on the solution to choose which number formats
     * are acceptable. Available data-forms:
     *
     * - integer:  3
     * - proper:   3/5
     * - improper: 5/3
     * - pi:       3 pi
     * - log:      log(5)
     * - percent:  15%
     * - mixed:    1 1/3
     * - decimal:  1.7
     *
     * The solution should be a predicate of the form:
     *
     * function(guess, maxError) {
     *     return abs(guess - 3) < maxError;
     * }
     *
     */
    predicate: {
        defaultForms: "integer, proper, improper, mixed, decimal",
        setupFunctional: function(solutionarea, solutionText, solutionData) {
            // retrieve the options from the solution data
            var options = $.extend({
                simplify: "required",
                ratio: false,
                forms: Khan.answerTypes.predicate.defaultForms
            }, solutionData);
            var acceptableForms = options.forms.split(/\s*,\s*/);

            // TODO(jack): remove options.inexact in favor of options.maxError
            if (options.inexact === undefined) {
                // If we aren't allowing inexact, ensure that we don't have a
                // large maxError as well.
                options.maxError = 0;
            }
            // Allow a small tolerance on maxError, to avoid numerical
            // representation issues (2.3 should be correct for a solution of
            // 2.45 with maxError=0.15).
            options.maxError = +options.maxError + MAXERROR_EPSILON;

            var $input = $('<input type="text" autocapitalize="off">');
            $(solutionarea).append($input);

            // retrieve the example texts from the different forms
            var exampleForms = {
                integer: i18n._("an integer, like <code>6</code>"),

                proper: (function() {
                        if (options.simplify === "optional") {
                            return i18n._("a <em>proper</em> fraction, like " +
                                       "<code>1/2</code> or <code>6/10</code>");
                        } else {
                            return i18n._("a <em>simplified proper</em> " +
                                       "fraction, like <code>3/5</code>");
                        }
                    })(),

                improper: (function() {
                        if (options.simplify === "optional") {
                            return i18n._("an <em>improper</em> fraction, like " +
                                       "<code>10/7</code> or <code>14/8</code>");
                        } else {
                            return i18n._("a <em>simplified improper</em> " +
                                       "fraction, like <code>7/4</code>");
                        }
                    })(),

                pi: i18n._("a multiple of pi, like <code>12\\ \\text{pi}</code> " +
                    "or <code>2/3\\ \\text{pi}</code>"),

                log: i18n._("an expression, like <code>\\log(100)</code>"),

                percent: i18n._("a percent, like <code>%(NUM)s\\%</code>", {NUM: KhanUtil.localeToFixed(12.34, 2)}),

                mixed: i18n._("a mixed number, like <code>1\\ 3/4</code>"),

                decimal: (function() {
                        if (options.inexact === undefined) {
                            return i18n._("an <em>exact</em> decimal, like " +
                                "<code>%(NUM)s</code>", {NUM: KhanUtil.localeToFixed(0.75, 2)});
                        } else {
                            return i18n._("a decimal, like <code>%(NUM)s</code>", {NUM: KhanUtil.localeToFixed(0.75, 2)});
                        }
                    })()
            };

            // extract the examples for the given forms
            var examples = [];
            $.each(acceptableForms, function(i, form) {
                if (exampleForms[form] != null) {
                    examples.push(exampleForms[form]);
                }
            });

            // Add examples directly to input
            // unless any generic number is accepted
            if (options.forms !== Khan.answerTypes.predicate.defaultForms) {
                addExamplesToInput($input, examples);
            }

            return {
                validator: Khan.answerTypes.predicate.createValidatorFunctional(
                        solutionText, solutionData),
                answer: function() {
                    return $input.val();
                },
                solution: $.trim(solutionText),
                showGuess: function(guess) {
                    $input.val(guess === undefined ? "" : guess);
                }
            };
        },
        createValidatorFunctional: function(predicate, options) {
            // Extract the options from the given solution object
            options = $.extend({
                simplify: "required",
                ratio: false,
                forms: Khan.answerTypes.predicate.defaultForms
            }, options);
            var acceptableForms;
            // this is maintaining backwards compatibility
            // TODO(merlob) fix all places that depend on this, then delete
            if (!_.isArray(options.forms)) {
                acceptableForms = options.forms.split(/\s*,\s*/);
            } else {
                acceptableForms = options.forms;
            }

            // TODO(jack): remove options.inexact in favor of options.maxError
            if (options.inexact === undefined) {
                // If we aren't allowing inexact, ensure that we don't have a
                // large maxError as well.
                options.maxError = 0;
            }
            // Allow a small tolerance on maxError, to avoid numerical
            // representation issues (2.3 should be correct for a solution of
            // 2.45 with maxError=0.15).
            options.maxError = +options.maxError + MAXERROR_EPSILON;

            // If percent is an acceptable form, make sure it's the last one
            // in the list so we don't prematurely complain about not having
            // a percent sign when the user entered the correct answer in a
            // different form (such as a decimal or fraction)
            if (_.contains(acceptableForms, "percent")) {
                acceptableForms = _.without(acceptableForms, "percent");
                acceptableForms.push("percent");
            }

            predicate = _.isFunction(predicate) ?
                    predicate :
                    KhanUtil.tmpl.getVAR(predicate);

            // Take text looking like a fraction, and turn it into a number
            var fractionTransformer = function(text) {
                text = text
                    // Replace unicode minus sign with hyphen
                    .replace(/\u2212/, "-")

                    // Remove space after +, -
                    .replace(/([+-])\s+/g, "$1")

                    // Remove leading/trailing whitespace
                    .replace(/(^\s*)|(\s*$)/gi, "");

                    // Extract numerator and denominator
                var match = text.match(/^([+-]?\d+)\s*\/\s*([+-]?\d+)$/);
                var parsedInt = parseInt(text, 10);
                if (match) {
                    var num = parseFloat(match[1]),
                        denom = parseFloat(match[2]);
                    var simplified = denom > 0 &&
                        (options.ratio || match[2] !== "1") &&
                        KhanUtil.getGCD(num, denom) === 1;
                    return [{
                        value: num / denom,
                        exact: simplified
                    }];
                } else if (!isNaN(parsedInt) && "" + parsedInt === text) {
                    return [{
                        value: parsedInt,
                        exact: true
                    }];
                }

                return [];
            };

            /*
             * Different forms of numbers
             *
             * Each function returns a list of objects of the form:
             *
             * {
             *    value: numerical value,
             *    exact: true/false
             * }
             */
            var forms = {
                // integer, which is encompassed by decimal
                integer: function(text) {
                    // Compare the decimal form to the decimal form rounded to
                    // an integer. Only accept if the user actually entered an
                    // integer.
                    var decimal = forms.decimal(text);
                    var rounded = forms.decimal(text, 1);
                    if ((decimal[0].value != null &&
                            decimal[0].value === rounded[0].value) ||
                            (decimal[1].value != null &&
                            decimal[1].value === rounded[1].value)) {
                        return decimal;
                    }
                    return [];
                },

                // A proper fraction
                proper: function(text) {
                    return $.map(fractionTransformer(text), function(o) {
                        // All fractions that are less than 1
                        if (Math.abs(o.value) < 1) {
                            return [o];
                        } else {
                            return [];
                        }
                    });
                },

                // an improper fraction
                improper: function(text) {
                    return $.map(fractionTransformer(text), function(o) {
                        // All fractions that are greater than 1
                        if (Math.abs(o.value) >= 1) {
                            return [o];
                        } else {
                            return [];
                        }
                    });
                },

                // pi-like numbers
                pi: function(text) {
                    var match, possibilities = [];

                    // Replace unicode minus sign with hyphen
                    text = text.replace(/\u2212/, "-");

                    // - pi
                    // (Note: we also support \pi (for TeX), p, tau (and \tau,
                    // and t), pau.)
                    if ((match = text.match(
                                    /^([+-]?)\s*(\\?pi|p|\u03c0|\\?tau|t|\u03c4|pau)$/i
                                ))) {
                        possibilities = [{ value: parseFloat(match[1] + "1"), exact: true }];

                    // 5 / 6 pi
                    } else if ((match = text.match(/^([+-]?\s*\d+\s*(?:\/\s*[+-]?\s*\d+)?)\s*\*?\s*(\\?pi|p|\u03c0|\\?tau|t|\u03c4|pau)$/i))) {
                        possibilities = fractionTransformer(match[1]);

                    // 4 5 / 6 pi
                    } else if ((match = text.match(/^([+-]?)\s*(\d+)\s*([+-]?\d+)\s*\/\s*([+-]?\d+)\s*\*?\s*(\\?pi|p|\u03c0|\\?tau|t|\u03c4|pau)$/i))) {
                        var sign = parseFloat(match[1] + "1"),
                            integ = parseFloat(match[2]),
                            num = parseFloat(match[3]),
                            denom = parseFloat(match[4]);
                        var simplified = num < denom &&
                            KhanUtil.getGCD(num, denom) === 1;

                        possibilities = [{
                            value: sign * (integ + num / denom),
                            exact: simplified
                        }];

                    // 5 pi / 6
                    } else if ((match = text.match(/^([+-]?\s*\d+)\s*\*?\s*(\\?pi|p|\u03c0|\\?tau|t|\u03c4|pau)\s*(?:\/\s*([+-]?\s*\d+))?$/i))) {
                        possibilities = fractionTransformer(match[1] +
                                                            "/" + match[3]);

                    // - pi / 4
                    } else if ((match = text.match(/^([+-]?)\s*\*?\s*(\\?pi|p|\u03c0|\\?tau|t|\u03c4|pau)\s*(?:\/\s*([+-]?\d+))?$/i))) {
                        possibilities = fractionTransformer(match[1] +
                                                            "1/" + match[3]);

                    // 0
                    } else if (text === "0") {
                        possibilities = [{ value: 0, exact: true }];

                    // 0.5 pi (fallback)
                    } else if ((match = text.match(
                                /^(.+)\s*\*?\s*(\\?pi|p|\u03c0|\\?tau|t|\u03c4|pau)$/i
                                        ))) {
                        possibilities = forms.decimal(match[1]);
                    } else {
                        possibilities = _.reduce(Khan.answerTypes.predicate.defaultForms.split(/\s*,\s*/), function(memo, form) {
                            return memo.concat(forms[form](text));
                        }, []);
                        // If the answer is a floating point number that's
                        // near a multiple of pi, mark is as being possibly
                        // an approximation of pi.  We actually check if
                        // it's a plausible approximation of pi/12, since
                        // sometimes the correct answer is like pi/3 or pi/4.
                        // We also say it's a pi-approximation if it involves
                        // x/7 (since 22/7 is an approximation of pi.)
                        // Never mark an integer as being an approximation
                        // of pi.
                        var approximatesPi = false;
                        var number = parseFloat(text);
                        if (!isNaN(number) && number !== parseInt(text)) {
                            var piMult = Math.PI / 12;
                            var roundedNumber = piMult * Math.round(number / piMult);
                            if (Math.abs(number - roundedNumber) < 0.01) {
                                approximatesPi = true;
                            }
                        } else if (text.match(/\/\s*7/)) {
                            approximatesPi = true;
                        }
                        if (approximatesPi) {
                            $.each(possibilities, function(ix, possibility) {
                                possibility.piApprox = true;
                            });
                        }
                        return possibilities;
                    }

                    var multiplier = Math.PI;
                    if (text.match(/\\?tau|t|\u03c4/)) {
                        multiplier = Math.PI * 2;
                    }

                    // We're taking an early stand along side xkcd in the
                    // inevitable ti vs. pau debate... http://xkcd.com/1292
                    if (text.match(/pau/)) {
                        multiplier = Math.PI * 1.5;
                    }

                    $.each(possibilities, function(ix, possibility) {
                        possibility.value *= multiplier;
                    });
                    return possibilities;
                },

                // Converts '' to 1 and '-' to -1 so you can write "[___] x"
                // and accept sane things
                coefficient: function(text) {
                    var possibilities = [];

                    // Replace unicode minus sign with hyphen
                    text = text.replace(/\u2212/, "-");

                    if (text === "") {
                        possibilities = [{ value: 1, exact: true }];
                    } else if (text === "-") {
                        possibilities = [{ value: -1, exact: true }];
                    }
                    return possibilities;
                },

                // simple log(c) form
                log: function(text) {
                    var match, possibilities = [];

                    // Replace unicode minus sign with hyphen
                    text = text.replace(/\u2212/, "-");
                    text = text.replace(/[ \(\)]/g, "");

                    if ((match = text.match(/^log\s*(\S+)\s*$/i))) {
                        possibilities = forms.decimal(match[1]);
                    } else if (text === "0") {
                        possibilities = [{ value: 0, exact: true }];
                    }
                    return possibilities;
                },

                // Numbers with percent signs
                percent: function(text) {
                    text = $.trim(text);
                    // store whether or not there is a percent sign
                    var hasPercentSign = false;

                    if (text.indexOf("%") === (text.length - 1)) {
                        text = $.trim(text.substring(0, text.length - 1));
                        hasPercentSign = true;
                    }

                    var transformed = forms.decimal(text);
                    $.each(transformed, function(ix, t) {
                        t.exact = hasPercentSign;
                        t.value = t.value / 100;
                    });
                    return transformed;
                },

                // Mixed numbers, like 1 3/4
                mixed: function(text) {
                    var match = text
                        // Replace unicode minus sign with hyphen
                        .replace(/\u2212/, "-")

                        // Remove space after +, -
                        .replace(/([+-])\s+/g, "$1")

                        // Extract integer, numerator and denominator
                        .match(/^([+-]?)(\d+)\s+(\d+)\s*\/\s*(\d+)$/);

                    if (match) {
                        var sign = parseFloat(match[1] + "1"),
                            integ = parseFloat(match[2]),
                            num = parseFloat(match[3]),
                            denom = parseFloat(match[4]);
                        var simplified = num < denom &&
                            KhanUtil.getGCD(num, denom) === 1;

                        return [{
                            value: sign * (integ + num / denom),
                            exact: simplified
                        }];
                    }

                    return [];
                },

                // Decimal numbers -- compare entered text rounded to
                // 'precision' Reciprical of the precision against the correct
                // answer. We round to 1/1e10 by default, which is healthily
                // less than machine epsilon but should be more than any real
                // decimal answer would use. (The 'integer' answer type uses
                // precision == 1.)
                decimal: function(text, precision) {
                    if (precision == null) {
                        precision = 1e10;
                    }

                    var normal = function(text) {
                        text = $.trim(text);

                        var match = text
                            // Replace unicode minus sign with hyphen
                            .replace(/\u2212/, "-")
                            // Remove space after +, -
                            .replace(/([+-])\s+/g, "$1")
                            // Extract integer, numerator and denominator. If
                            // commas or spaces are used, they must be in the
                            // "correct" places
                            .match(/^([+-]?(?:\d{1,3}(?:[, ]?\d{3})*\.?|\d{0,3}(?:[, ]?\d{3})*\.(?:\d{3}[, ]?)*\d{1,3}))$/);

                        // You can't start a number with `0,`, to prevent us
                        // interpeting '0.342' as correct for '342'
                        var badLeadingZero = text.match(/^0[0,]*,/);

                        if (match && !badLeadingZero) {
                            var x = parseFloat(match[1].replace(/[, ]/g, ""));

                            if (options.inexact === undefined) {
                                x = Math.round(x * precision) / precision;
                            }

                            return x;
                        }
                    };

                    var commas = function(text) {
                        text = text.replace(/([\.,])/g, function(_, c) {
                            return (c === "." ? "," : ".");
                        });
                        return normal(text);
                    };

                    return [
                        { value: normal(text), exact: true },
                        { value: commas(text), exact: true }
                    ];
                }
            };

            // validator function
            return function(guess) {
                // The fallback variable is used in place of the answer, if no
                // answer is provided (i.e. the field is left blank)
                var fallback =
                    options.fallback != null ? "" + options.fallback : "";

                guess = $.trim(guess) || fallback;
                var score = {
                    empty: guess === "",
                    correct: false,
                    message: null,
                    guess: guess
                };

                // iterate over all the acceptable forms, and if one of the
                // answers is correct, return true
                $.each(acceptableForms, function(i, form) {
                    var transformed = forms[form](guess);

                    for (var j = 0, l = transformed.length; j < l; j++) {
                        var val = transformed[j].value;
                        var exact = transformed[j].exact;
                        var piApprox = transformed[j].piApprox;
                        // If a string was returned, and it exactly matches,
                        // return true
                        if (predicate(val, options.maxError)) {
                            // If the exact correct number was returned,
                            // return true
                            if (exact || options.simplify === "optional") {
                                score.correct = true;
                                score.message = options.message || null;
                                // If the answer is correct, don't say it's
                                // empty. This happens, for example, with the
                                // coefficient type where guess === "" but is
                                // interpreted as "1" which is correct.
                                score.empty = false;
                            } else if (form === "percent") {
                                // Otherwise, an error was returned
                                score.empty = true;
                                score.message = i18n._("Your answer is almost correct, " +
                                          "but it is missing a " +
                                          "<code>\\%</code> at the end.");
                            } else {
                                if (options.simplify !== "enforced") {
                                    score.empty = true;
                                }
                                score.message = i18n._("Your answer is almost correct, " +
                                          "but it needs to be simplified.");
                            }

                            return false; // break;
                        } else if (piApprox &&
                                   predicate(val, Math.abs(val * 0.001))) {
                            score.empty = true;
                            score.message = i18n._("Your answer is close, but you may " +
                                      "have approximated pi. Enter your " +
                                      "answer as a multiple of pi, like " +
                                      "<code>12\\ \\text{pi}</code> or " +
                                      "<code>2/3\\ \\text{pi}</code>");
                        }
                    }
                });

                if (score.correct === false) {
                    var interpretedGuess = false;
                    _.each(forms, function(form) {
                        if(_.any(form(guess), function(t) {
                                return t.value != null && !_.isNaN(t.value);})) {
                            interpretedGuess = true;
                        }
                    });
                    if (!interpretedGuess) {
                        score.empty = true;
                        score.message = i18n._("We could not understand your answer. " +
                            "Please check your answer for extra text or symbols.");
                        return score;
                    }
                }

                return score;
            };
        }
    },

    /*
     * number answer type
     *
     * wraps the predicate answer type to performs simple number-based checking
     * of a solution
     */
    number: {
        convertToPredicate: function(correct, options) {
            // TODO(alpert): Don't think this $.trim is necessary
            var correctFloat = parseFloat($.trim(correct));

            return [
                    function(guess, maxError) {
                        return Math.abs(guess - correctFloat) < maxError;
                    },
                    $.extend({}, options, {type: "predicate"})
                ];
        },
        setupFunctional: function(solutionarea, solutionText, solutionData) {
            var args = Khan.answerTypes.number.convertToPredicate(
                    solutionText, solutionData);
            return Khan.answerTypes.predicate.setupFunctional(
                    solutionarea,
                    /* text: */ args[0], /* data: */ args[1]);
        },
        createValidatorFunctional: function(correct, options) {
            return Khan.answerTypes.predicate.createValidatorFunctional.apply(
                Khan.answerTypes.predicate,
                Khan.answerTypes.number.convertToPredicate(correct, options));
        }
    },

    /*
     * These next four answer types are just synonyms for number with given
     * forms. Set the correct forms on the solution, and pass it on to number
     */
    decimal: numberAnswerType("decimal"),

    rational: numberAnswerType("integer, proper, improper, mixed"),

    // A little bit of a misnomer as proper fractions are also accepted
    improper: numberAnswerType("integer, proper, improper"),

    mixed: numberAnswerType("integer, proper, mixed"),

    // Perform a regex match on the entered string
    regex: {
        setupFunctional: function(solutionarea, solutionText, solutionData) {
            var input;
            if (window.Modernizr && Modernizr.touchevents) {
                // special flag for iOS devices
                input = $('<input type="text" autocapitalize="off">');
            } else {
                input = $('<input type="text">');
            }
            $(solutionarea).append(input);

            return {
                validator: Khan.answerTypes.regex.createValidatorFunctional(
                        solutionText, solutionData),
                answer: function() {
                   return input.val();
                },
                solution: $.trim(solutionText),
                showGuess: function(guess) {
                    input.val(guess === undefined ? "" : guess);
                }
            };
        },
        createValidatorFunctional: function(regex, options) {
            var flags = "";

            if (options.caseInsensitive != null) {
                flags += "i";
            }

            regex = new RegExp($.trim(regex), flags);

            return function(guess) {
                // The fallback variable is used in place of the answer, if no
                // answer is provided (i.e. the field is left blank)
                var fallback =
                    options.fallback != null ? "" + options.fallback : "";

                guess = $.trim(guess) || fallback;
                return {
                    empty: false,
                    correct: guess.match(regex) != null,
                    message: null,
                    guess: guess
                };
            };
        }
    },

    // An answer type with two text boxes, for solutions of the form a sqrt(b)
    radical: {
        setupFunctional: function(solutionarea, solutionText, solutionData) {
            var options = $.extend({
                simplify: "required"
            }, solutionData);

            // Add two input boxes
            var inte = $('<input type="text" autocapitalize="off">');
            var rad = $('<input type="text" autocapitalize="off">');

            var examples = (options.simplify === "required") ?
                [i18n._("a simplified radical, like <code>\\sqrt{2}</code> " +
                     "or <code>3\\sqrt{5}</code>")] :
                [i18n._("a radical, like <code>\\sqrt{8}</code> or " +
                     "<code>2\\sqrt{2}</code>")];

            // Add the same example message to both inputs
            addExamplesToInput(inte, examples);
            addExamplesToInput(rad, examples);

            // Make them look pretty
            $("<div class='radical'>")
                .append($("<span>").append(inte))
                .append('<span class="surd">&radic;</span>')
                .append($("<span>").append(rad).addClass("overline"))
                .appendTo(solutionarea);

            var ansSquared = parseFloat(solutionText);
            var ans = KhanUtil.splitRadical(ansSquared);

            return {
                validator: Khan.answerTypes.radical.createValidatorFunctional(
                        solutionText, solutionData),
                answer: function() {
                    return [$.trim(inte.val()), $.trim(rad.val())];
                },
                solution: ans,
                showGuess: function(guess) {
                    inte.val(guess ? guess[0] : "");
                    rad.val(guess ? guess[1] : "");
                }
            };
        },
        createValidatorFunctional: function(ansSquared, options) {
            options = $.extend({
                simplify: "required"
            }, options);

            // The provided answer is the square of what is meant to be
            // entered. Use KhanUtil.splitRadical to find the different parts
            ansSquared = parseFloat(ansSquared);
            var ans = KhanUtil.splitRadical(ansSquared);

            return function(guess) {
                // If nothing typed into either box, don't grade the answer
                if (guess[0].length === 0 && guess[1].length === 0) {
                    return {
                        empty: true,
                        correct: false,
                        message: null,
                        guess: guess
                    };
                }
                // If nothing is typed into one of the boxes, use 1
                guess[0] = guess[0].length > 0 ? guess[0] : "1";
                guess[1] = guess[1].length > 0 ? guess[1] : "1";
                // Parse the two floats from the guess
                var inteGuess = parseFloat(guess[0]);
                var radGuess = parseFloat(guess[1]);

                // The answer is correct if the guess square is equal to the
                // given solution
                var correct =
                    Math.abs(inteGuess) * inteGuess * radGuess === ansSquared;
                // the answer is simplified if the sqrt portion and integer
                // portion are the same as what is given by splitRadical
                var simplified = inteGuess === ans[0] && radGuess === ans[1];

                var score = {
                    empty: false,
                    correct: false,
                    message: null,
                    guess: guess
                };

                if (correct) {
                    if (simplified || options.simplify === "optional") {
                        score.correct = true;
                    } else {
                        score.message = i18n._("Your answer is almost correct, but it " +
                                   "needs to be simplified.");
                    }
                }
                return score;
            };
        }
    },

    // An answer type with two text boxes, for solutions of the form a cuberoot(b)
    cuberoot: {
        setupFunctional: function(solutionarea, solutionText, solutionData) {
            var options = $.extend({
                simplify: "required"
            }, solutionData);

            // Add two input boxes
            var inte = $('<input type="text" autocapitalize="off">');
            var rad = $('<input type="text" autocapitalize="off">');

            var examples = (options.simplify === "required") ?
                [i18n._("a simplified radical, like <code>\\sqrt[3]{2}</code> " +
                     "or <code>3\\sqrt[3]{5}</code>")] :
                [i18n._("a radical, like <code>\\sqrt[3]{8}</code> or " +
                     "<code>2\\sqrt[3]{2}</code>")];

            // Add the same example message to both inputs
            addExamplesToInput(inte, examples);
            addExamplesToInput(rad, examples);

            // Make them look pretty
            $("<div class='radical'>")
                .append($("<span>").append(inte))
                .append('<span class="surd" style="vertical-align: 6px;"><code>\\sqrt[3]{}</code></span>')
                .append($("<span>").append(rad).addClass("overline"))
                .appendTo(solutionarea).tex();

            var ansCubed = parseFloat(solutionText);
            var ans = KhanUtil.splitCube(ansCubed);

            return {
                validator: Khan.answerTypes.cuberoot.createValidatorFunctional(
                        solutionText, solutionData),
                answer: function() {
                    return [inte.val(), rad.val()];
                },
                solution: ans,
                showGuess: function(guess) {
                    inte.val(guess ? guess[0] : "");
                    rad.val(guess ? guess[1] : "");
                }
            };
        },
        createValidatorFunctional: function(ansCubed, options) {
            options = $.extend({
                simplify: "required"
            }, options);

            // The provided answer is the cube of what is meant to be
            // entered. Use KhanUtil.splitCube to find the different parts
            ansCubed = parseFloat(ansCubed);
            var ans = KhanUtil.splitCube(ansCubed);

            return function(guess) {
                // If nothing typed into either box, don't grade the answer
                if (guess[0].length === 0 && guess[1].length === 0) {
                    return {
                        empty: true,
                        correct: false,
                        message: null,
                        guess: guess
                    };
                }
                // If nothing is typed into one of the boxes, use 1
                guess[0] = guess[0].length > 0 ? guess[0] : "1";
                guess[1] = guess[1].length > 0 ? guess[1] : "1";
                // Parse the two floats from the guess
                var inteGuess = parseFloat(guess[0]);
                var radGuess = parseFloat(guess[1]);

                // The answer is correct if the guess square is equal to the
                // given solution
                var correct =
                    Math.abs(inteGuess) * inteGuess * inteGuess * radGuess === ansCubed;
                // the answer is simplified if the sqrt portion and integer
                // portion are the same as what is given by splitCube
                var simplified = inteGuess === ans[0] && radGuess === ans[1];

                var score = {
                    empty: false,
                    correct: false,
                    message: null,
                    guess: guess
                };

                if (correct) {
                    if (simplified || options.simplify === "optional") {
                        score.correct = true;
                    } else {
                        score.message = i18n._("Your answer is almost correct, but it " +
                                   "needs to be simplified.");
                    }
                }
                return score;
            };
        }
    },

    /*
     * Multiple answer type
     *
     * This answer type allows for multiple different other answer types to be
     * combined into a single answer.
     *
     * It works by finding html elements with the "sol" class, and converting
     * them into mini solutionareas, which are then filled in by the setup
     * functions of their cooresponding answer types. In order to do solution
     * checking, the answers of each of the areas are placed in an array, and
     * then the validator works by iterating over the array and making sure
     * each of the individual solutions are correct
     */
    multiple: {
        setup: function(solutionarea, solution) {
            // Very quickly place all of the elements in the solution area
            // Clone it, because we don't want to modify or move it
            $(solutionarea).append(
                    $(solution).clone(true).texCleanup().contents()
                        .runModules()
            );

            var answerDataArray = [];

            // Iterate over each of the .sol elements
            $(solutionarea).find(".sol").each(function(idx) {
                var type = $(this).data("type");
                type = type != null ? type : "number";

                // find the corresponding answer
                var sol = $(solution).find(".sol").eq(idx);

                // empty the .sol element in preperation for treating it as a
                // solutionarea
                var solarea = $(this).empty();

                // perform setup on each of the areas
                var answerData = Khan.answerTypes[type].setup(solarea, sol);

                // Store the returned data, for use later
                answerDataArray.push(answerData);
            });

            return {
                validator: Khan.answerTypes.multiple.createValidator(solution),
                answer: function() {
                    var answer = [];

                    // Go through each of the answerDatas, and call the answer
                    // functions in turn, storing each of the answers in an
                    // array
                    $.each(answerDataArray, function(i, answerData) {
                        answer.push(answerData.answer());
                    });

                    return answer;
                },
                solution: (function() {
                    // Retrieve each of the solutions from the answerDatas
                    $.map(answerDataArray, function(answerData) {
                        return answerData.solution;
                    });
                })(),
                showGuess: function(guess) {
                    // Iterate through each of the answerDatas, and show the
                    // cooresponding guess for each
                    $.each(answerDataArray, function(i, answerData) {
                        if (guess !== undefined) {
                            answerData.showGuess(guess[i]);
                        } else {
                            answerData.showGuess();
                        }
                    });
                },
                showCustomGuess: function(guess) {
                    // Iterate through each of the answerDatas, and show the
                    // cooresponding custom guess for each if it exists
                    $.each(answerDataArray, function(i, answerData) {
                        if (!_.isFunction(answerData.showCustomGuess)) {
                            return;
                        }
                        if (guess !== undefined) {
                            answerData.showCustomGuess(guess[i]);
                        } else {
                            answerData.showCustomGuess();
                        }
                    });
                }
            };
        },
        createValidator: function(solution) {
            var validators = [];

            // Iterate over all of the .sols in the answer
            $(solution).find(".sol").each(function() {
                var sol = $(this);

                var type = sol.data("type");
                type = type != null ? type : "number";

                // create a validator for each of the solutions
                var validator = Khan.answerTypes[type].createValidator(sol);
                validators.push(validator);
            });

            return function(guess) {
                var score = {
                    empty: true,
                    correct: true,
                    message: null,
                    guess: guess
                };
                var blockGradingMessage = null;

                // If the answer is completely empty, don't grade it
                if (checkIfAnswerEmpty(guess)) {
                    score.empty = true;
                    score.correct = false;
                    return score;
                }

                // Iterate over each of the elements in the guess
                $.each(guess, function(i, g) {
                    // Check whether that answer is right by validating it
                    // with the corresponding validator
                    var pass = validators[i](g);

                    if (pass.message && pass.empty) {
                        // Special case where a validator returns a message
                        // for an "empty" response. This probably means it's
                        // not really empty, but a correct-but-not-simplified
                        // answer. Rather that treating this as actually empty,
                        // possibly leading to the entire multiple being marked
                        // wrong for being incomplete, note the situation but
                        // continue determining whether the entire answer is
                        // otherwise correct or not before forwarding on the
                        // message.
                        blockGradingMessage = pass.message;
                    } else {
                        score.empty = score.empty && pass.empty;
                        score.correct = score.correct && pass.correct;
                        // TODO(eater): This just forwards one message
                        score.message = score.message || pass.message;
                    }
                });

                if (score.correct && blockGradingMessage != null) {
                    return {
                        empty: true,
                        correct: false,
                        message: blockGradingMessage,
                        guess: guess
                    };
                } else {
                    score.empty = false;
                    return score;
                }
            };
        }
    },

    /*
     * The set answer type allows for multiple different answers with the same
     * kind of input.
     *
     * The different correct answers are stored in .set-sol elements, each of
     * which describes a different correct answer
     *
     * the method of input is stored in the .input-format element, with each
     * .entry element within that describing an answer-type from which input
     * should be retrieved
     *
     * The guess is retrieved as a list of the answers given from each of the
     * .entry elements within the solution area
     *
     * If there are more solutions given than inputs, then all of the inputs
     * must be filled. If there are more inputs than solutions, then all of the
     * solutions must be given. Either way, every given solution must be
     * correct, or the whole thing is wrong.
     */
    set: {
        setup: function(solutionarea, solution) {
            // Append the input format to the solution area
            $(solutionarea).append(
                $(solution).find(".input-format").clone(true).texCleanup()
                        .contents().runModules()
            );

            var inputArray = [];
            var showGuessArray = [];
            // For each of the entry elements
            $(solutionarea).find(".entry").each(function() {
                var input = $(this), type = $(this).data("type");
                type = type != null ? type : "number";

                var sol = input.clone(true),
                    solarea = input.empty();

                // Perform setup within that element
                var validator = Khan.answerTypes[type].setup(solarea, sol);
                // Store the answer and showGuess functions
                inputArray.push(validator.answer);
                showGuessArray.push(validator.showGuess);
            });

            var solutionArray = [];

            // Make fake solutionareas, and store the solutions from each
            // TODO(emily): fix this horrible hack, by making the solution
            //              easier to access
            $(solution).find(".set-sol").clone(true).each(function() {
                var type = $(this).data("type");
                type = type != null ? type : "number";

                var solarea = $("<div>");

                var validator = Khan.answerTypes[type].setup(solarea, $(this));

                solutionArray.push(validator.solution);
            });

            // TODO(alex): Figure out how to add tooltips to all of the inputs
            // within a set that need them. Not trivial due to the hack above.

            return {
                validator: Khan.answerTypes.set.createValidator(solution),
                answer: function() {
                    var answer = [];

                    // For each of the inputs, get the answer and store it in
                    // the answer array
                    $.each(inputArray, function(i, getAns) {
                        answer.push(getAns());
                    });

                    return answer;
                },
                solution: solution,
                showGuess: function(guess) {
                    // For each of the inputs, call the appropriate showGuess
                    // function
                    $.each(showGuessArray, function(i, showGuess) {
                        if (guess === undefined) {
                            showGuess();
                        } else {
                            showGuess(guess[i]);
                        }
                    });
                }
            };
        },
        createValidator: function(solution) {
            var validatorArray = [];

            // Fill validatorArray with validators for each acceptable answer
            $(solution).find(".set-sol").clone(true).each(function() {
                var type = $(this).data("type");
                type = type != null ? type : "number";

                var validator = Khan.answerTypes[type]
                                    .createValidator($(this));

                validatorArray.push(validator);
            });

            return function(guess) {
                var score = {
                    // If there are no validators, empty input is correct
                    empty: validatorArray.length === 0 ? false : true,
                    correct: true,
                    message: null,
                    guess: guess
                };
                var blockGradingMessage = null;

                // Store a copy of each of the validators. If one correctly
                // identifies a guess, remove it from this array, so duplicate
                // answers aren't marked correct twice
                var unusedValidators = validatorArray.slice(0);

                // Go through each of the guesses
                $.each(guess, function(i, g) {
                    // Whether or not the guess is correct
                    var correct = false;

                    // Go through each of the unused validators
                    $.each(unusedValidators, function(i, validator) {
                        var pass = validator(g);

                        // If this validator is trying to block grading
                        if (pass.empty && pass.message) {
                            // remove the working validator
                            unusedValidators.splice(i, 1);
                            // We want to block the entire answer from being
                            // accepted as correct but continue checking in
                            // case another part is wrong.
                            blockGradingMessage = pass.message;
                            correct = true;
                            // break
                            return false;
                        }

                        // If this validator completely accepts this answer
                        if (pass.correct) {
                            // store correct
                            correct = pass.correct;
                            // remove the matching validator
                            unusedValidators.splice(i, 1);
                            // break
                            return false;
                        }

                        // If the validator matches, grades wrong, and provides
                        // a message, we want to continue trying the other
                        // validators in the hopes the answer may yet be
                        // correct. But in case it isn't, store the message.
                        if (!pass.correct && pass.message) {
                            correct = pass.message;
                        }
                    });

                    if (!checkIfAnswerEmpty(g) &&
                            !checkIfAnswerEmpty(correct)) {
                        score.empty = false;
                    }

                    // If we didn't get it right, and the answer isn't empty,
                    // the entire solution is false
                    //
                    // TODO(emily): make the "is the answer empty" part of this
                    //              work better for all the different answer
                    //              types
                    // TODO(emily): Perhaps provide insight to the student
                    //              about whether or not part of their answer
                    //              is correct? While this could be abused, it
                    //              would seem more friendly.
                    if (!correct && $.trim([g].join("")) !== "") {
                        score.correct = false;
                        return false;  // break
                    }

                    // If we have a check answer message
                    if (typeof correct === "string") {
                        score.message = correct;
                        score.correct = false;
                    }
                });

                // If there were more correct answers than possible guesses
                if (validatorArray.length > guess.length) {
                    // If not all of the guesses were filled in with correct
                    // answers
                    if (unusedValidators.length >
                        validatorArray.length - guess.length) {
                        // incorrect, more answers needed
                        score.correct = false;
                    }
                // Otherwise, if not all of the answers were provided
                } else if (unusedValidators.length > 0) {
                    // incorrect, some of the answers are missing
                    score.correct = false;
                }

                if (score.correct && blockGradingMessage != null) {
                    return {
                        empty: true,
                        correct: false,
                        message: blockGradingMessage,
                        guess: guess
                    };
                } else {
                    return score;
                }
            };
        }
    },

    /*
     * The radio answer type provides multiple choice type answers
     *
     * The different possible multiple choice answers are provided in a
     * seperate .choices element siblings with the main .solution element, with
     * the correct answer residing within the .solution element.
     *
     * There are two different modes of operation. Category mode and
     * non-category mode.
     *
     * In non-category mode, the answers (which don't include the correct
     * answer) combined with the correct answer are scrambled together. This is
     * meant for questions where the answers radically change from question to
     * question, and thus scrambling increases the difficulty, and makes the
     * solutions harder to pattern match. This is the default.
     *
     * In category mode, the answers are provided in the order they are given
     * within the .choices element, and the correct answer is duplicated in
     * both the solution and within the choices. This is meant for questions
     * where the solutions generally do not change from problem to problem.
     * This is enabled by adding data-category to the .choices element.
     */
    radio: {
        setup: function(solutionarea, solution) {
            // Add a list to the solution area
            var $list = $("<ul></ul>");
            $(solutionarea).append($list);

            // Retrieve the list of choices from the problem
            var $choices = $(solution).siblings(".choices");

            // Get the wrong choices and the solution. Note that we cleanup all
            // the math here, so we don't have to deal with annoying MathJax
            // stuff in our solutions, and also that we can directly compare
            // the .text() values of all of the nodes
            var $choicesClone = $choices.clone(true).texCleanup();
            var $solutionClone = $(solution).clone(true).texCleanup();

            // Retrieve the text of the solution so we can store it later
            var solutionText = $solutionClone.text();

            // Whether this is a category question, or if we should shuffle the
            // answers up.
            var isCategory = !!$choices.data("category");

            var possibleChoices;
            if (isCategory) {
                // If it's a category question, insert the solution into the
                // list of choices at the correct place, by comparing by the
                // text value of the elements.
                var correctText = getTextSquish($solutionClone);
                possibleChoices = _.map(
                    $choicesClone.children().get(),
                    function(elem) {
                        if (getTextSquish(elem) === correctText) {
                            return $solutionClone[0];
                        } else {
                            return elem;
                        }
                    });
            } else {
                // Otherwise, the possible choices is just the correct answer
                // and the other choices. We shuffle the choices here so that
                // when we slice off some of the choices later, we don't always
                // slice off the same ones.
                possibleChoices = $solutionClone.get().concat(
                    KhanUtil.shuffle($choicesClone.children().get())
                );
            }

            // The number of choices is either the number specified or the
            // number of choices in the list of possible choices.
            var numChoices = +$choices.data("show") || possibleChoices.length;

            // Whether to show a "none of the above" solution in our set of
            // answers.
            var showNone = !!$choices.data("none");

            // This code removes duplicate answers by looking at the text
            // values of the choices and keeping the non-duplicate answers
            var shownChoices = _.uniq(possibleChoices, false, function(elem) {
                return getTextSquish(elem);
            });

            // Here, we duplicate the old behaviour where, if there is one less
            // choice than we want, we will just add in the "none of the above"
            // choice instead of having it replace one of the real ones.
            var addNoneChoice = showNone &&
                    shownChoices.length === numChoices - 1;

            // If removing duplicates made it so there aren't enough showing
            // solutions (and we're not going to add in one last choice),
            // regenerate the problem
            if (shownChoices.length < numChoices && !addNoneChoice) {
                return false;
            // Otherwise, if there are too many choices, throw away some from
            // the end
            } else if (shownChoices.length > numChoices) {
                shownChoices = shownChoices.slice(0, numChoices);
            }

            // Shuffle the answers if we're not in category mode
            if (!isCategory) {
                shownChoices = KhanUtil.shuffle(shownChoices);
            }

            // Find the index of the correct answer
            var correctIndex;
            _.each(shownChoices, function(choice, i) {
                if (choice === $solutionClone[0]) {
                    correctIndex = i;
                }
            });

            // We figure out if the "none of the above" choice is correct if we
            // have such an answer and if the last shown answer is correct.
            // Note that we check against numChoices to decide if it is the
            // last choice, not shownChoices.length, because in the case that
            // we're going to be strictly adding the "none of the above"
            // choice, shownChoices.length won't accurately show the number of
            // choices that will be shown.
            var noneIsCorrect = showNone && correctIndex === numChoices - 1;

            // If showNone, replace the last solution with "None of the above",
            // which reveals the correct answer when it is picked and is right.
            if (showNone) {
                var $none = $("<span>").html(i18n._("None of the above"));
                $none.data("noneOfTheAbove", true);

                // If the answer is correct, we add some data about what the
                // true answer is so we can show it later
                if (noneIsCorrect) {
                    $list.data("realAnswer",
                        $("<span>").addClass("value").append(
                            $solutionClone.clone(true).contents()
                        )
                    );
                }

                var noneIndex = shownChoices.length - 1;
                if (addNoneChoice) {
                    noneIndex = shownChoices.length;
                }

                shownChoices.splice(noneIndex, 1,
                    // We have to wrap this in something so that when we unwrap
                    // it below, it maintains its data attributes
                    $("<span>").append($none));
            }

            // Wrap each of the choices in elements and add radio buttons
            var wrappedChoices = _.map(shownChoices, function(choice, i) {
                return $("<li><label></label></li>").find("label").append([
                    $('<input type="radio" name="solution">').val(i),
                    $('<span class="value"></span>').append(
                        $(choice).contents()
                    )
                ]).end();
            });

            // Here we finally re-run modules, so that the math is reformatted
            $list.append(wrappedChoices).runModules();

            return {
                // We send some extra data to the validator so that it is
                // easier to grade
                validator: Khan.answerTypes.radio.createValidator({
                    solution: solution,
                    index: correctIndex,
                    noneIsCorrect: noneIsCorrect
                }),
                answer: function() {
                    // Find the chosen answer
                    var $choice = $list.find("input:checked");

                    // If nothing's checked, return null immediately
                    if ($choice.length === 0) {
                        return null;
                    }

                    // Find it's cooresponding value
                    var $choiceVal = $choice.siblings(".value");

                    // This (probably) only does something useful when the
                    // selected answer is the "none of the above" one
                    var $choiceNoneChild = $choiceVal.children().eq(0);

                    return {
                        // Some data about the "none of the above" answer
                        isNone: $choiceNoneChild.data("noneOfTheAbove"),
                        // The raw text value that was chosen
                        // TODO(emily): Remove this at the same time references
                        // to guess.value are removed down below, maybe (unless
                        // we want to have the text of the correct answer in
                        // the database)
                        value: extractRawCode($choiceVal),
                        // The index of the value that was chosen
                        index: +$choice.val()
                    };
                },
                solution: solutionText,
                showGuess: function(guess) {
                    if (guess == null) {
                        $(solutionarea).find("input:checked")
                                       .attr("checked", false);
                    } else {
                        // Select the correct radio button
                        $list.children().filter(function() {
                            // Filter using the index to choose the radio
                            return guess.index ===
                                $(this).find("input").val();
                        }).find("input").attr("checked", true);
                    }
                }
            };
        },
        createValidator: function(solution) {
            // TODO(emily): Remove this backwards compatible code sometime
            // after 8/2013
            var correct = extractRawCode(solution.solution || solution);

            function showReal() {
                // Hacky stuff to make the correct solution appear when "none
                // of the above" is the correct answer
                var $list = $("#solutionarea").find("ul");
                var $choice =
                    $list.children().filter(function() {
                        return $(this).find("span.value > span")
                                      .data("noneOfTheAbove");
                    }).find("input");
                $choice.next().fadeOut("fast", function() {
                    var $real = $list.data("realAnswer");
                    $(this).replaceWith($real);
                    $real.tex().fadeIn("fast");
                });
            }

            return function(guess) {
                var score = {
                    empty: false,
                    correct: false,
                    message: null,
                    guess: guess
                };

                if (guess == null) {
                    score.empty = true;
                    return score;
                }

                if (guess.index) {
                    // New solutions include information about the correct
                    // answer like the correct index, etc. We can use that to
                    // make checking a lot simpler.

                    if (guess.isNone && solution.noneIsCorrect) {
                        showReal();
                        score.correct = true;
                    } else {
                        score.correct = guess.index === solution.index;
                    }
                } else {
                    // Old solutions just included the solution element, so we
                    // have to use the old checks to see if the solution is
                    // correct
                    // TODO(emily): Remove this backwards compatible code
                    // sometime after 8/2013

                    // Check to see if the "none of the above" answer is
                    // checked
                    if (guess.isNone &&
                            $("#solutionarea").find("ul").data("real-answer") != null) {
                        showReal();
                        score.correct = true;
                    // Otherwise, just compare the text
                    } else if ($.trim(guess.value).replace(/\r\n?|\n/g, "") ===
                               $.trim(correct.replace(/\r\n?|\n/g, ""))) {
                        score.correct = true;
                    } else {
                        score.correct = false;
                    }
                }
                return score;
            };
        }
    },

    /*
     * The list answer type provides a drop-down menu to select from a list of
     * different answers
     *
     * The different choices are stored as an array in the data-choices value
     * of the solution element
     */
    list: {
        setupFunctional: function(solutionarea, solutionText, solutionData) {
            var input = $("<select></select>");
            $(solutionarea).append(input);

            // Get the choices
            var choices = $.tmpl.getVAR(solutionData.choices);
            $.each(choices, function(index, value) {
                // Add each one to the selection
                input.append('<option value="' + value + '">' +
                    value + "</option>");
            });

            return {
                validator: Khan.answerTypes.list.createValidatorFunctional(
                        solutionText, solutionData),
                answer: function() {
                    return input.val();
                },
                solution: $.trim(solutionText),
                showGuess: function(guess) {
                    input.val(guess === undefined ? "" : guess);
                }
            };
        },
        createValidatorFunctional: function(correct, options) {
            correct = $.trim(correct);

            return function(guess) {
                guess = $.trim(guess);
                return {
                    empty: false,
                    correct: correct === guess,
                    message: null,
                    guess: guess
                };
            };
        }
    },

    /*
     * The custom answer type provides a very general way to create answers,
     * which generally have input methods beyond the answer area, and have to
     * do more complex checking for answers
     *
     * There are 5 elements within the custom solution that are used.
     *
     * The .instruction element is directly copied into the solution area. This
     * is meant for instructions and any extra input needed by the question
     *
     * The .guess element is evaluated as javascript whenever the current
     * answer needs to be checked. Its result is passed in to the validator,
     * and show guess functions.
     *
     * The .validator element is evaluated as javascript with the added guess
     * variable. It should return one of the usual return types depending on
     * whether the answer is correct or not.
     *
     * The .show-guess and .show-guess-solutionarea elements are evaluated as
     * javascript whenever the guess needs to be re-displayed (mostly in the
     * timeline). The .show-guess function should be used to change elements
     * outside of the solutionarea, and the .show-guess-solutionarea one should
     * be used to modify elements within the solutionarea
     */
    custom: {
        setup: function(solutionarea, solution) {
            // copy the instruction element into the solution area
            solution.find(".instruction")
                    .appendTo(solutionarea)
                    .runModules();

            // Retrieve some code
            var guessCode = solution.find(".guess").text();
            var showCustomGuessCode = solution.find(".show-guess").text();
            var showGuessCode = solution.find(".show-guess-solutionarea").text();

            return {
                validator: Khan.answerTypes.custom.createValidator(solution),
                answer: function() {
                    // Run the guess code
                    return KhanUtil.tmpl.getVAR(guessCode,
                                                KhanUtil.currentGraph);
                },
                solution: $.trim($(solution).text()),
                showCustomGuess: function(guess) {
                    // run the show guess code
                    var code =
                        "(function() { " +
                            "var guess = " + JSON.stringify(guess) + ";" +
                            showCustomGuessCode +
                        "})()";
                    KhanUtil.tmpl.getVAR(code, KhanUtil.currentGraph);
                },
                showGuess: function(guess) {
                    // run the answer area show guess code
                    var code =
                        "(function() { " +
                            "var guess = " + JSON.stringify(guess) + ";" +
                            showGuessCode +
                        "})()";
                    KhanUtil.tmpl.getVAR(code, KhanUtil.currentGraph);
                }
            };
        },
        createValidator: function(solution) {
            // store some code
            var validatorCode = $(solution).find(".validator-function").text();

            var validator = function(guess) {
                // run the validator code
                var code = "(function() { " +
                                "var guess = " + JSON.stringify(guess) + ";" +
                                validatorCode +
                            "})()";
                return KhanUtil.tmpl.getVAR(code, KhanUtil.currentGraph);
            };

            return function(guess) {
                var pass = validator(guess);
                // If `pass` is an object, it's a new-style return type
                if (typeof pass === "object") {
                    return pass;
                } else {
                    // TODO(eater): For now most custom answers use the "old"
                    // true/false/""/"..." return type.
                    return {
                        empty: pass === "",
                        correct: pass === true,
                        message: typeof pass === "string" ? pass : null,
                        guess: guess
                    };
                }
            };
        }
    },

    /*
     * The prime factorization answer type checks whether the correct list of
     * prime factors matches the guess, by ordering the prime factors in
     * ascending order, and placing "x"s between them
     */
    primeFactorization: {
        // Same as the text function, the differences lie in the validator
        // TODO(alpert): Use predicate or something like that?
        setupFunctional: function(solutionarea, solutionText, solutionData) {
            var $input;
            if (window.Modernizr && Modernizr.touchevents) {
                // special flag for iOS devices
                $input = $('<input type="text" autocapitalize="off">');
            } else {
                $input = $('<input type="text">');
            }
            $input.addClass("prime-factorization");
            $(solutionarea).append($input);

            var examples = [
                i18n._("a product of prime factors, like <code>2 \\times 3</code>"),
                i18n._("a single prime number, like <code>5</code>")
            ];

            addExamplesToInput($input, examples);

            return {
                validator: Khan.answerTypes.primeFactorization.createValidatorFunctional(
                        solutionText, solutionData),
                answer: function() {
                    return $input.val();
                },
                solution: $.trim(solutionText),
                showGuess: function(guess) {
                    $input.val(guess === undefined ? "" : guess);
                }
            };
        },
        createValidatorFunctional: function(correct, options) {
            correct = $.trim(correct);

            return function(guess) {
                // Get rid of all the whitespace
                guess = guess.split(" ").join("").toLowerCase();
                // Get rid of LaTeX braces
                guess = guess.replace(/{|}/g, "");
                // Split on x, *, unicode x, or LaTeX \times and \cdot
                guess = guess.split(/x|\*|\u00d7|\\times|\\cdot/);

                // Replace a^b with b lots of axa
                var terms = [];
                for (var i = 0; i < guess.length; i++) {
                    var t = guess[i].split('^');
                    if (t.length > 1) {
                        for (var j = 0; j < t[1]; j++) {
                            terms.push(t[0]);
                        }
                    } else {
                        terms.push(guess[i]);
                    }
                }

                // Sort, and join with xs
                guess = KhanUtil.sortNumbers(terms).join("x");
                // perform simple string comparison
                return {
                    empty: guess === "",
                    correct: guess === correct,
                    message: null,
                    guess: guess
                };
            };
        }
    },

    /*
     * The checkbox answer type provides a single checkbox, with the solution
     * being true or false
     */
    checkbox: {
        setupFunctional: function(solutionarea, solutionText, solutionData) {
            // Make a checkbox
            var input = $('<input type="checkbox">');
            $(solutionarea).append(input);

            return {
                validator: Khan.answerTypes.checkbox.createValidatorFunctional(
                        solutionText, solutionData),
                answer: function() {
                    // False as "" so that checkIfAnswerEmpty recognizes it as
                    // empty
                    return input.is(":checked") || "";
                },
                solution: $.trim(solutionText),
                showGuess: function(guess) {
                    input.attr("checked", guess === undefined ? false : guess);
                }
            };
        },
        createValidatorFunctional: function(correct, options) {
            // store whether the correct answer is true or false
            correct = $.trim(correct) === "true";

            return function(guess) {
                var score = {
                    empty: false,
                    correct: false,
                    message: null,
                    guess: guess
                };
                // If checkbox is unchecked, guess will be ""; cast to bool
                /* jshint -W018 */
                if (!!correct === !!guess) {
                /* jshint +W018 */
                    score.correct = true;
                } else if (!guess) {
                    // If unchecked, we'll say that the answer is empty, which
                    // is necessary to ensure that a new question with
                    // checkboxes counts as empty. Empty in a multiple grades
                    // as false though so this shouldn't have any adverse
                    // effects.
                    score.empty = true;
                } else {
                    score.correct = false;
                }
                return score;
            };
        }
    },

    /*
     * The expression answer type parses a given expression or equation
     * and semantically compares it to the solution. In addition, instant
     * feedback is provided by rendering the last answer that fully parsed.
     *
     * Parsing options:
     * functions (e.g. data-functions="f g h")
     *     A space or comma separated list of single-letter variables that
     *     should be interpreted as functions. Case sensitive. "e" and "i"
     *     are reserved.
     *
     *     no functions specified: f(x+y) == fx + fy
     *     with "f" as a function: f(x+y) != fx + fy
     *
     * Comparison options:
     * same-form (e.g. data-same-form)
     *     If present, the answer must match the solution's structure in
     *     addition to evaluating the same. Commutativity and excess negation
     *     are ignored, but all other changes will trigger a rejection. Useful
     *     for requiring a particular form of an equation, or if the answer
     *     must be factored.
     *
     *     example question:    Factor x^2 + x - 2
     *     example solution:    (x-1)(x+2)
     *     accepted answers:    (x-1)(x+2), (x+2)(x-1), ---(-x-2)(-1+x), etc.
     *     rejected answers:    x^2+x-2, x*x+x-2, x(x+1)-2, (x-1)(x+2)^1, etc.
     *     rejection message:   Your answer is not in the correct form
     *
     * simplify (e.g. data-simplify)
     *     If present, the answer must be fully expanded and simplified. Use
     *     carefully - simplification is hard and there may be bugs, or you
     *     might not agree on the definition of "simplified" used. You will
     *     get an error if the provided solution is not itself fully expanded
     *     and simplified.
     *
     *     example question:    Simplify ((n*x^5)^5) / (n^(-2)*x^2)^-3
     *     example solution:    x^31 / n
     *     accepted answers:    x^31 / n, x^31 / n^1, x^31 * n^(-1), etc.
     *     rejected answers:    (x^25 * n^5) / (x^(-6) * n^6), etc.
     *     rejection message:   Your answer is not fully expanded and simplified
     *
     * Rendering options:
     * times (e.g. data-times)
     *     If present, explicit multiplication (such as between numbers) will
     *     be rendered with a cross/x symbol (TeX: \times) instead of the usual
     *     center dot (TeX: \cdot).
     *
     *     normal rendering:    2 * 3^x -> 2 \cdot 3^{x}
     *     but with "times":    2 * 3^x -> 2 \times 3^{x}
     */
    expression: {
        setup: function(solutionarea, solution) {
            var options = this._parseOptions($(solution).data());

            // Assemble the solution area
            var $tex = $('<span class="tex"/>');
            var $input = $('<input type="text">');
            var $error = $('<div class="error-div" style="display: none;"/>');

            $(solutionarea).append(
                $('<span class="expression"/>').append(
                    $('<span class="output"/>').append(
                        $tex
                    ),
                    $('<span class="input"/>').append(
                        $input,
                        $error.append(
                            // Requires FontAwesome
                            $('<i class="icon-exclamation-sign error-icon"/>')
                        )
                    )
                )
            );

            // Specify how instant render (and error message) should update
            var errorTimeout = null;
            var lastParsedTex = "";

            var update = function() {
                clearTimeout(errorTimeout);
                var result = KAS.parse($input.val(), options);
                if (result.parsed) {
                    hideError();
                    $tex.css({opacity: 1.0});
                    var tex = result.expr.asTex(options);
                    if (tex !== lastParsedTex) {
                        $tex.empty().append($("<code>").text(tex)).tex();
                        lastParsedTex = tex;
                    }
                } else {
                    errorTimeout = setTimeout(showError, 2000);
                    $tex.css({opacity: 0.5});
                }
            };

            var showError = function() {
                if (!$error.is(":visible")) {
                    $error.show();
                    $input.addClass("error");
                }
            };

            var hideError = function() {
                if ($error.is(":visible")) {
                    $error.hide();
                    $input.removeClass("error");
                }
            };

            // Define event handlers
            $input.on("input propertychange", update);

            $input.on("keydown", function(event) {
                var input = $input[0];

                var start = input.selectionStart;
                var end = input.selectionEnd;
                var supported = start !== undefined;

                if (supported && event.which === 8 /* backspace */) {
                    var val = input.value;
                    if (start === end && val.slice(start - 1, start + 1) === "()") {
                        // "f(|)" + backspace -> "f|" (| is the cursor position)
                        event.preventDefault();
                        input.value = val.slice(0, start - 1) + val.slice(start + 1);
                        input.selectionStart = start - 1;
                        input.selectionEnd = end - 1;
                        update();
                    }
                }
            });

            $input.on("keypress", function(event) {
                var input = $input[0];

                var start = input.selectionStart;
                var end = input.selectionEnd;
                var supported = start !== undefined;

                if (supported && event.which === 40 /* left paren */) {
                    var val = input.value;
                    event.preventDefault();

                    if (start === end) {
                        // "f|" + "(" -> "f(|)"
                        var insertMatched = _.any([" ", ")", ""], function(c) {
                            return val.charAt(start) === c;
                        });

                        input.value = val.slice(0, start) +
                                (insertMatched ? "()" : "(") + val.slice(end);
                    } else {
                        // "f|x+y|" + "(" -> "f(|x+y|)"
                        input.value = val.slice(0, start) +
                                "(" + val.slice(start, end) + ")" + val.slice(end);
                    }

                    input.selectionStart = start + 1;
                    input.selectionEnd = end + 1;
                    update();

                } else if (supported && event.which === 41 /* right paren */) {
                    var val = input.value;
                    if (start === end && val.charAt(start) === ")") {
                        // f(|) + ")" -> "f()|"
                        event.preventDefault();
                        input.selectionStart = start + 1;
                        input.selectionEnd = end + 1;
                        update();
                    }
                }
            });

            // Examples
            var explicitMul = i18n._("For <code>2\\cdot2</code>, enter <strong>2*2</strong>");
            // Will only use the options from the final set-sol
            // but it's unlikely different set-sols will have different times options
            if (options.times) {
                explicitMul = explicitMul.replace(/\\cdot/g, "\\times");
            }

            var examples = [
                explicitMul,
                i18n._("For <code>3y</code>, enter <strong>3y</strong> or <strong>3*y</strong>"),
                i18n._("For <code>\\dfrac{1}{x}</code>, enter <strong>1/x</strong>"),
                i18n._("For <code>x^{y}</code>, enter <strong>x^y</strong>"),
                i18n._("For <code>\\sqrt{x}</code>, enter <strong>sqrt(x)</strong>"),
                i18n._("For <code>\\pi</code>, enter <strong>pi</strong>"),
                i18n._("For <code>\\sin \\theta</code>, enter <strong>sin(theta)</strong>"),
                i18n._("For <code>\\le</code> or <code>\\ge</code>, enter <strong><=</strong> or <strong>>=</strong>"),
                i18n._("For <code>\\neq</code>, enter <strong>=/=</strong>")
            ];

            addExamplesToInput($input, examples);

            return {
                validator: Khan.answerTypes.expression.createValidator(solution),
                answer: function() { return $input.val(); },
                solution: solution,
                showGuess: function(guess) {
                    $input.val(guess === undefined ? "" : guess);
                }
            };
        },

        parseSolution: function(solutionString, options) {
            var solution = KAS.parse(solutionString, options);
            if (!solution.parsed) {
                throw new Error("The provided solution (" + solutionString +
                    ") didn't parse.");
            } else if (options.simplified && !solution.expr.isSimplified()) {
                throw new Error("The provided solution (" + solutionString +
                    ") isn't fully expanded and simplified.");
            } else {
                solution = solution.expr;
            }
            return solution;
        },

        _parseOptions: function(solutionData) {
            // Convert options to a form KAS can understand
            var form = solutionData.form !== undefined ?
                solutionData.form :
                solutionData.sameForm;
            var notFalseOrNil = function(x) {
                return x != null && x !== false;
            };
            var options = {
                form: notFalseOrNil(form),
                simplify: notFalseOrNil(solutionData.simplify),
                times: notFalseOrNil(solutionData.times)
            };
            if (_.isString(solutionData.functions)) {
                options.functions = _.compact(
                    solutionData.functions.split(/[ ,]+/));
            } else if (_.isArray(solutionData.functions)) {
                options.functions = _.compact(solutionData.functions);
            }
            return options;
        },

        createValidator: function(solution) {
            var $solution = $(solution);
            var validatorArray = [];

            var createValidatorFunctional = this.createValidatorFunctional;
            var parseOptions = this._parseOptions;

            // Find solutions and options in a set
            $(solution).find(".set-sol").each(function() {
                var options = parseOptions($(this).data());
                validatorArray.push(createValidatorFunctional(
                    $(this).text(), options));
            });

            // Single solution, not a set
            if (validatorArray.length === 0) {
                var options = parseOptions($solution.data());
                validatorArray.push(createValidatorFunctional(
                    $solution.text(), options));
            }

            return function(guess) {
                var score = {
                    empty: false,
                    correct: false,
                    message: null,
                    guess: guess
                };

                // Check guess against all validators
                $.each(validatorArray, function(i, validator) {
                    var result = validator(guess);

                    if (result.correct) {
                        score.correct = true;
                        score.message = null;
                        return false;
                    }
                    if (result.message) {
                        score.message = result.message;
                    }
                    if (result.empty) {
                        score.empty = true;
                    }
                });

                return score;
            };
        },

        createValidatorFunctional: function(solution, options) {
            return function(guess) {
                var score = {
                    empty: false,
                    correct: false,
                    message: null,
                    guess: guess
                };
                // Don't bother parsing an empty input
                if (!guess) {
                    score.empty = true;
                    return score;
                }

                var answer = KAS.parse(guess, options);

                // An unsuccessful parse doesn't count as wrong
                if (!answer.parsed) {
                    score.empty = true;
                    return score;
                }

                // Solution will need to be parsed again if we're creating
                // this from a multiple question type
                if (typeof solution === 'string') {
                    solution = Khan.answerTypes.expression.parseSolution(solution, options);
                }

                var result = KAS.compare(answer.expr, solution, options);

                if (result.equal) {
                    // Correct answer
                    score.correct = true;
                } else if (result.message) {
                    // Nearly correct answer
                    score.message = result.message;
                } else {
                    // Replace x with * and see if it would have been correct
                    var answerX = KAS.parse(guess.replace(/[xX]/g, "*"), options);
                    if (answerX.parsed) {
                        var resultX = KAS.compare(answerX.expr, solution, options);
                        if (resultX.equal) {
                            score.empty = true;
                            score.message = "I'm a computer. I only " +
                                    "understand multiplication if you use an " +
                                    "asterisk (*) as the multiplication sign.";
                        } else if (resultX.message) {
                            score.message = resultX.message + " Also, " +
                                    "I'm a computer. I only " +
                                    "understand multiplication if you use an " +
                                    "asterisk (*) as the multiplication sign.";
                        }
                    }
                }
                return score;
            };
        }
    }
});

/**
 * Return a new answer type that uses number but with the passed-in forms only.
 */
function numberAnswerType(forms) {
    return {
        setupFunctional: function(solutionarea, solutionText, solutionData) {
            return Khan.answerTypes.number.setupFunctional(
                    solutionarea,
                    solutionText,
                    $.extend({}, solutionData, {forms: forms}));
        },
        createValidatorFunctional: function(correct, options) {
            return Khan.answerTypes.number.createValidatorFunctional(
                    correct,
                    $.extend({}, options, {forms: forms}));
        }
    };
}

_.each(Khan.answerTypes, function(info, type) {
    if (!("setup" in info)) {
        info.setup = function(solutionarea, solution) {
            var $solution = $(solution);
            return info.setupFunctional(
                    solutionarea, $solution.text(), $solution.data());
        };
    }

    if (!("createValidator" in info)) {
        info.createValidator = function(solution) {
            var $solution = $(solution);
            return info.createValidatorFunctional(
                    $solution.text(), $solution.data());
        };
    }
});

});
