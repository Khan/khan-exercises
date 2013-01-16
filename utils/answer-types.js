(function() {

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
 * examples: a list of example formats to be shown in the "acceptable formats"
 *           popup
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
 */

Khan.answerTypes = $.extend(Khan.answerTypes, {
    /*
     * text answer type
     *
     * Displays a simple text box, and performs direct string matching on the
     * value typed in an the answer provided
     */
    text: {
        setup: function(solutionarea, solution) {
            // Add a text box
            var input = $('<input type="text">');
            $(solutionarea).append(input);

            // The fallback variable is used in place of the answer, if no
            // answer is provided (i.e. the field is left blank)
            var fallback = $(solution).data("fallback");

            return {
                validator: Khan.answerTypes.text.createValidator(solution),
                answer: function() {
                    // return the value in the text box, or the fallback
                    return input.val().length > 0 ?
                        input.val() :
                        (fallback != null ? fallback + "" : "");
                },
                solution: $.trim($(solution).text()),
                examples: [],
                showGuess: function(guess) {
                    input.val(guess === undefined ? "" : guess);
                }
            };
        },
        createValidator: function(solution) {
            var correct = $.trim($(solution).text());

            return function(guess) {
                guess = $.trim(guess);
                return correct === guess;
            };
        }
    },

    /*
     * number answer type
     *
     * performs simple number-based checking of a solution, with different
     * kinds of number formats
     *
     * Uses the data-type option on the solution to choose which number formats
     * are acceptable. Available data-types:
     *
     * - integer:  3
     * - proper:   3/5
     * - improper: 5/3
     * - pi:       3 pi
     * - log:      log(5)
     * - percent:  15%
     * - dollar:   $10
     * - mixed:    1 1/3
     * - decimal:  1.7
     */
    number: {
        setup: function(solutionarea, solution) {
            // retrieve the options from the solution data
            var options = $.extend({
                simplify: "required",
                ratio: false,
                maxError: Math.pow(2, -42),
                forms: "literal, integer, proper, improper, mixed, decimal"
            }, $(solution).data());
            var acceptableForms = options.forms.split(/\s*,\s*/);

            if (window.Modernizr && Modernizr.touch) {
                // only some answer types can be represented with type=number
                var inputMarkup = "<input type='number' step='any'>";
                var numberForms = ["integer", "decimal"];
                $.each(acceptableForms, function (i,form) {
                    if (numberForms.indexOf(form) < 0) {
                        inputMarkup = "<input type='text'>";
                    }
                });
                var input = $(inputMarkup);
            } else {
                // people don't always set their locale right, so use a text
                // box to allow for alternative radix points
                var input = $("<input type='text'>");
            }
            $(solutionarea).append(input);

            // retrieve the example texts from the different forms
            var exampleForms = {
                integer: "an integer, like <code>6</code>",

                proper: (function() {
                        if (options.simplify === "optional") {
                            return "a <em>proper</em> fraction, like " +
                                   "<code>1/2</code> or <code>6/10</code>";
                        } else {
                            return "a <em>simplified proper</em> fraction, " +
                                   "like <code>3/5</code>";
                        }
                    })(),

                improper: (function() {
                        if (options.simplify === "optional") {
                            return "an <em>improper</em> fraction, like " +
                                   "<code>10/7</code> or <code>14/8</code>";
                        } else {
                            return "a <em>simplified improper</em> " +
                                   "fraction, like <code>7/4</code>";
                        }
                    })(),

                pi: "a multiple of pi, like <code>12\\ \\text{pi}</code> or " +
                    "<code>2/3\\ \\text{pi}</code>",

                log: "an expression, like <code>\\log(100)</code>",

                percent: "a percent, like <code>12.34\\%</code>",

                dollar: "a money amount, like <code>$2.75</code>",

                mixed: "a mixed number, like <code>1\\ 3/4</code>",

                decimal: (function() {
                        if (options.inexact === undefined) {
                            return "an <em>exact</em> decimal, like " +
                                   "<code>0.75</code>";
                        } else {
                            return "a decimal, like <code>0.75</code>";
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

            var fallback = $(solution).data("fallback");

            return {
                validator: Khan.answerTypes.number.createValidator(solution),
                answer: function() {
                    return input.val().length > 0 ?
                        input.val() :
                        (fallback != null ? fallback + "" : "");
                },
                solution: $.trim($(solution).text()),
                examples: examples,
                showGuess: function(guess) {
                    input.val(guess === undefined ? "" : guess);
                }
            };
        },
        createValidator: function(solution) {
            // Extract the options from the given solution object
            var options = $.extend({
                simplify: "required",
                ratio: false,
                maxError: Math.pow(2, -42),
                forms: "literal, integer, proper, improper, mixed, decimal"
            }, $(solution).data());
            var acceptableForms = options.forms.split(/\s*,\s*/);

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
                // a literal, decimal looking number
                literal: function(text) {
                    // Prevent literal comparisons for decimal-looking-like
                    // strings
                    return [{
                        value: (/[^+-\u2212\d\.\s]/).test(text) ? text : null
                    }];
                },

                // integer, which is encompassed by decimal
                integer: function(text) {
                    return forms.decimal(text);
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
                    if (match = text.match(
                                    /^([+-]?)\s*(pi?|\u03c0|t(?:au)?|\u03c4)$/i
                                )) {
                        possibilities = [{ value: parseFloat(match[1] + "1"), exact: true }];

                    // 5 / 6 pi
                    } else if (match = text.match(/^([+-]?\d+\s*(?:\/\s*[+-]?\d+)?)\s*\*?\s*(pi?|\u03c0|t(?:au)?|\u03c4)$/i)) {
                        possibilities = fractionTransformer(match[1]);

                    // 5 pi / 6
                    } else if (match = text.match(/^([+-]?\d+)\s*\*?\s*(pi?|\u03c0|t(?:au)?|\u03c4)\s*(?:\/\s*([+-]?\d+))?$/i)) {
                        possibilities = fractionTransformer(match[1] +
                                                            "/" + match[3]);

                    // - pi / 4
                    } else if (match = text.match(/^([+-]?)\s*\*?\s*(pi?|\u03c0|t(?:au)?|\u03c4)\s*(?:\/\s*([+-]?\d+))?$/i)) {
                        possibilities = fractionTransformer(match[1] +
                                                            "1/" + match[3]);

                    // 0
                    } else if (text === "0") {
                        possibilities = [{ value: 0, exact: true }];

                    // 0.5 pi (fallback)
                    } else if (match = text.match(
                                /^(\S+)\s*\*?\s*(pi?|\u03c0|t(?:au)?|\u03c4)$/i
                                        )) {
                        possibilities = forms.decimal(match[1]);
                    }

                    var multiplier = Math.PI;
                    if (match && match[2].match(/t(?:au)?|\u03c4/)) {
                        multiplier = Math.PI * 2;
                    }

                    $.each(possibilities, function(ix, possibility) {
                        possibility.value *= multiplier;
                    });
                    return possibilities;
                },

                // simple log(c) form
                log: function(text) {
                    var match, possibilities = [];

                    // Replace unicode minus sign with hyphen
                    text = text.replace(/\u2212/, "-");
                    text = text.replace(/[ \(\)]/g, "");

                    if (match = text.match(/^log\s*(\S+)\s*$/i)) {
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
                    });
                    return transformed;
                },

                // Numbers with dollar signs
                dollar: function(text) {
                    text = $.trim(text.replace("$", ""));

                    return forms.decimal(text);
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

                // Decimal numbers
                decimal: function(text) {
                    var normal = function(text) {
                        var match = text

                            // Replace unicode minus sign with hyphen
                            .replace(/\u2212/, "-")

                            // Remove space after +, -
                            .replace(/([+-])\s+/g, "$1")

                            // Extract integer, numerator and denominator If
                            // commas or spaces are used, they must be in the
                            // "correct" places
                            .match(/^([+-]?(?:\d{1,3}(?:[, ]?\d{3})*\.?|\d{0,3}(?:[, ]?\d{3})*\.(?:\d{3}[, ]?)*\d{1,3}))$/);

                        if (match) {
                            var x = parseFloat(match[1].replace(/[, ]/g, ""));

                            if (options.inexact === undefined) {
                                var factor = Math.pow(10, 10);
                                x = Math.round(x * factor) / factor;
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

            // Store the correct text and float values
            var correct = $.trim($(solution).text());
            var correctFloat = parseFloat(correct);

            // validator function
            return function(guess) {
                guess = $.trim(guess);
                var ret = false;

                // iterate over all the acceptable forms, and if one of the
                // answers is correct, return true
                $.each(acceptableForms, function(i, form) {
                    var transformed = forms[form](guess);

                    for (var j = 0, l = transformed.length; j < l; j++) {
                        var val = transformed[j].value;
                        var exact = transformed[j].exact;

                        // If a string was returned, and it exactly matches,
                        // return true
                        if (typeof val === "string" &&
                                correct.toLowerCase() === val.toLowerCase()) {
                            ret = true;
                            return false; // break;
                        } if (typeof val === "number" &&
                                Math.abs(correctFloat - val) <
                                options.maxError) {
                            // If the exact correct number was returned,
                            // return true
                            if (exact || options.simplify === "optional") {
                                ret = true;
                            } else if (form === "percent") {
                                // Otherwise, an error was returned
                                ret = "Your answer is almost correct, but " +
                                      "it is missing a <code>\\%</code> at " +
                                      "the end.";
                            } else {
                                ret = "Your answer is almost correct, but " +
                                      "it needs to be simplified.";
                            }

                            return false; // break;
                        }
                    }
                });

                return ret;
            };
        }
    },

    /*
     * These next four answer types are just synonyms for number with given
     * forms. Set the correct forms on the solution, and pass it on to number
     */
    decimal: {
        setup: function(solutionarea, solution) {
            solution.data("forms", "decimal");
            return Khan.answerTypes.number.setup(solutionarea, solution);
        },
        createValidator: function(solution) {
            return Khan.answerTypes.number.createValidator(solution);
        }
    },

    rational: {
        setup: function(solutionarea, solution) {
            solution.data("forms", "integer, proper, improper, mixed");
            return Khan.answerTypes.number.setup(solutionarea, solution);
        },
        createValidator: function(solution) {
            return Khan.answerTypes.number.createValidator(solution);
        }
    },

    // A little bit of a misnomer as proper fractions are also accepted
    improper: {
        setup: function(solutionarea, solution) {
            solution.data("forms", "integer, proper, improper");
            return Khan.answerTypes.number.setup(solutionarea, solution);
        },
        createValidator: function(solution) {
            return Khan.answerTypes.number.createValidator(solution);
        }
    },

    mixed: {
        setup: function(solutionarea, solution) {
            solution.data("forms", "integer, proper, mixed");
            return Khan.answerTypes.number.setup(solutionarea, solution);
        },
        createValidator: function(solution) {
            return Khan.answerTypes.number.createValidator(solution);
        }
    },

    // Perform a regex match on the entered string
    regex: {
        setup: function(solutionarea, solution) {
            var input = $('<input type="text">');
            $(solutionarea).append(input);

            return {
                validator: Khan.answerTypes.regex.createValidator(solution),
                answer: function() {
                    return input.val().length > 0 ? input.val() : "";
                },
                solution: $.trim($(solution).text()),
                examples: [],
                showGuess: function(guess) {
                    input.val(guess === undefined ? "" : guess);
                }
            };
        },
        createValidator: function(solution) {
            var correct = $.trim($(solution).text());

            return function(guess) {
                guess = $.trim(guess);
                return guess.match(correct) != null;
            };
        }
    },

    // An answer type with two text boxes, for solutions of the form a sqrt(b)
    radical: {
        setup: function(solutionarea, solution) {
            var options = $.extend({
                simplify: "required"
            }, $(solution).data());

            // Add two input boxes
            var inte = $("<input type='text'>"),
                rad = $("<input type='text'>");
            // Make them look pretty
            solutionarea.addClass("radical")
                .append($("<span>").append(inte))
                .append('<span class="surd">&radic;</span>')
                .append($("<span>").append(rad).addClass("overline"));

            var ansSquared = parseFloat($(solution).text());
            var ans = KhanUtil.splitRadical(ansSquared);

            return {
                validator: Khan.answerTypes.radical.createValidator(solution),
                answer: function() {
                    // Store the entered values in a list
                    // If nothing is typed into one of the boxes, use 1
                    return [
                        inte.val().length > 0 ? inte.val() : "1",
                        rad.val().length > 0 ? rad.val() : "1"
                    ];
                },
                solution: ans,
                examples: (options.simplify === "required") ?
                    ["a simplified radical, like <code>\\sqrt{2}</code> or " +
                     "<code>3\\sqrt{5}</code>"] :
                    ["a radical, like <code>\\sqrt{8}</code> or " +
                     "<code>2\\sqrt{2}</code>"],
                showGuess: function(guess) {
                    inte.val(guess ? guess[0] : "");
                    rad.val(guess ? guess[1] : "");
                }
            };
        },
        createValidator: function(solution) {
            var options = $.extend({
                simplify: "required"
            }, $(solution).data());

            // The provided answer is the square of what is meant to be
            // entered. Use KhanUtil.splitRadical to find the different parts
            var ansSquared = parseFloat($(solution).text());
            var ans = KhanUtil.splitRadical(ansSquared);

            return function(guess) {
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

                if (correct) {
                    if (simplified || options.simplify === "optional") {
                        return true;
                    } else {
                        return "Your answer is almost correct, but it needs " +
                               "to be simplified.";
                    }
                } else {
                    return false;
                }
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
            $(solutionarea).append($(solution).clone().contents().tmpl());

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

            // Remove the examples from the solutionarea
            $(solutionarea).find(".example").remove();

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
                // Find all the example classes from the solution, and store
                // those
                examples: (function() {
                    var ex = solution.find(".example").map(function(i, el) {
                        return $(el).html();
                    });
                    if (ex.length === 0 && answerDataArray.length === 1) {
                        ex = answerDataArray[0].examples;
                    }
                    return ex;
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
                        if (!$.isFunction(answerData.showCustomGuess)) {
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

                // Store each of the validators, and whether or not that
                // answer is required
                validators.push({
                    validator: validator,
                    required: sol.attr("required") != undefined
                });
            });

            return function(guess) {
                var valid = true;
                var missing_required_answer = false;
                var invalid_reason = "";

                // Iterate over each of the elements in the guess
                $.each(guess, function(i, g) {
                    // Check whether that answer is right by validating it
                    // with the cooresponding validator
                    var pass = validators[i].validator(g);

                    // If the answer is required, and no answer was provided,
                    // break;
                    if (pass === "" && validators[i].required) {
                        missing_required_answer = true;
                        return false;
                    } else if (typeof pass === "string") {
                        invalid_reason = pass;
                    } else {
                        valid = valid && pass;
                    }
                });

                if (missing_required_answer) {
                    return "";
                } else if (invalid_reason.length > 0) {
                    return invalid_reason;
                } else {
                    return valid;
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
                $(solution).find(".input-format").clone().contents().tmpl()
            );

            var inputArray = [];
            var showGuessArray = [];
            // For each of the entry elements
            $(solutionarea).find(".entry").each(function() {
                var input = $(this), type = $(this).data("type");
                type = type != null ? type : "number";

                var sol = input.clone(),
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
            $(solution).find(".set-sol").clone().each(function() {
                var type = $(this).data("type");
                type = type != null ? type : "number";

                var solarea = $("<div>");

                var validator = Khan.answerTypes[type].setup(solarea, $(this));

                solutionArray.push(validator.solution);
            });

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
                examples: [],
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
            $(solution).find(".set-sol").clone().each(function() {
                var type = $(this).data("type");
                type = type != null ? type : "number";

                var validator = Khan.answerTypes[type]
                                    .createValidator($(this));

                validatorArray.push(validator);
            });

            return function(guess) {
                // Whether the entire solution is correct or not
                var valid = true,
                // Store a copy of each of the validators. If one correctly
                // identifies a guess, remove it from this array, so duplicate
                // answers aren't marked correct twice
                    unusedValidators = validatorArray.slice(0);

                // Go through each of the guesses
                $.each(guess, function(i, g) {
                    // Whether or not the guess is correct
                    var correct = false;

                    // Go through each of the unused validators
                    $.each(unusedValidators, function(i, validator) {
                        var pass = validator(g);

                        // If this validator completely accepts this answer
                        if (pass === true) {
                            // remove the working validator
                            unusedValidators.splice(i, 1);
                            // store correct
                            correct = true;
                            // break
                            return false;
                        }
                    });

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
                        valid = false;
                        return false;
                    }

                    // If we've run out of validators, stop
                    if (unusedValidators.length === 0) {
                        return false;
                    }
                });

                // If there were more correct answers than possible guesses
                if (validatorArray.length > guess.length) {
                    // If not all of the guesses were filled in with correct
                    // answers
                    if (unusedValidators.length >
                        validatorArray.length - guess.length) {
                        // incorrect, more answers needed
                        valid = false;
                    }
                // Otherwise, if not all of the answers were provided
                } else if (unusedValidators.length > 0) {
                    // incorrect, some of the answers are missing
                    valid = false;
                }

                return valid;
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
            // Function used to get the text of the choices, which is then used
            // to check against the correct answer
            var extractRawCode = function(solution) {
                return $(solution).clone()
                    .find(".MathJax").remove().end()
                    .find("code").removeAttr("id").end()
                    .html();
            };

            // Add a list to the solution area
            var list = $("<ul></ul>");
            list.on("click", "input:radio", function() {
                $(this).focus();
            });
            $(solutionarea).append(list);

            // Get all of the wrong choices
            var choices = $(solution).siblings(".choices");

            var solutionClone = $(solution).clone();

            // Set number of choices equal to all wrong plus one correct
            var numChoices = choices.children().length + 1;
            // Or set number as specified
            if (choices.data("show")) {
                numChoices = parseFloat(choices.data("show"));
            }

            // Optionally include none of the above as a choice
            var showNone = choices.data("none");
            var noneIsCorrect = false;
            if (showNone) {
                noneIsCorrect = KhanUtil.rand(numChoices) === 0;
                numChoices -= 1;
            }

            // If a category exercise, the correct answer is already included
            // in .choices and choices are always presented in the same order
            var isCategory = choices.data("category");
            var possibleChoices = choices.children().get();
            if (isCategory) {
                numChoices -= 1;
            } else {
                possibleChoices = KhanUtil.shuffle(possibleChoices);
            }

            // Add the correct answer
            if (!noneIsCorrect && !isCategory) {
                $(solutionClone).data("correct", true);
            }

            // Insert correct answer as first of possibleChoices
            if (!isCategory) {
                possibleChoices.splice(0, 0, $(solutionClone));
            }

            // Remove duplicates
            var dupes = {};
            var shownChoices = [];
            var solutionTextSquish = solutionClone.text().replace(/\s+/g, "");
            for (var i = 0; i < possibleChoices.length &&
                                shownChoices.length < numChoices; i++) {
                var choice = $(possibleChoices[i]);
                choice.runModules();
                var choiceTextSquish = choice.text().replace(/\s+/g, "");

                if (isCategory && solutionTextSquish === choiceTextSquish) {
                    choice.data("correct", true);
                }

                if (!dupes[choiceTextSquish]) {
                    dupes[choiceTextSquish] = true;

                    // i == 0 is the solution except in category mode; skip it
                    // when none is correct
                    if (!(noneIsCorrect && i === 0) || isCategory) {
                        shownChoices.push(choice);
                    }
                }
            }

            // If removing duplicates made it so there aren't enough showing
            // solutions, regenerate the problem
            if (shownChoices.length < numChoices) {
                return false;
            }

            // Shuffle the answers if we're not in category mode
            if (!isCategory) {
                shownChoices = KhanUtil.shuffle(shownChoices);
            }

            // If showNone, replace the last solution with "None of the above",
            // which reveals the correct answer when it is picked and is right
            if (showNone) {
                var none = $("<span>None of the above.</span>");

                if (noneIsCorrect) {
                    none.data("correct", true);
                    solutionText = none.text();
                    list.data("real-answer",
                            $(solutionClone)
                                .runModules()
                                .contents()
                                .wrapAll('<span class="value""></span>')
                                .parent());
                }

                shownChoices.push(none);
            }

            $.each(shownChoices, function(i, choice) {
                if (choice.data("correct")) {
                    correctIndex = i + "";
                }
                // Wrap each of the choices in elements and add a radio button
                choice.contents()
                    .wrapAll('<li><label><span class="value"></span></label></li>')
                    .parent()
                    .before(
                        $('<input type="radio" name="solution">')
                            .val(i)
                    )
                    .parent().parent()
                    .appendTo(list);
            });

            return {
                validator: Khan.answerTypes.radio.createValidator(solution),
                answer: function() {
                    // Find the chosen answer
                    var choice = list.find("input:checked");

                    // Find it's cooresponding value
                    var choiceVal = choice.siblings(".value");

                    // return the raw code of the chosen value
                    return extractRawCode(choiceVal);
                },
                solution: $.trim($(solution).text()),
                examples: [],
                showGuess: function(guess) {
                    if (guess === undefined) {
                        $(solutionarea).find("input:checked")
                                       .attr("checked", false);
                    } else {
                        // Select the correct radio button
                        var list = $("#solutionarea").find("ul");
                        list.children().filter(function() {
                            return $.trim(extractRawCode($(this).find("span")))
                                === $.trim(guess);
                        }).find("input").attr("checked", true);
                    }
                }
            };
        },
        createValidator: function(solution) {
            var extractRawCode = function(solution) {
                return $(solution).clone()
                    .find(".MathJax").remove().end()
                    .find("code").removeAttr("id").end()
                    .html();
            };
            var correct = extractRawCode(solution);

            return function(guess) {
                if (guess == null) {
                    return "";
                } else if (guess === "None of the above." &&
                        $("#solutionarea").find("ul").data("real-answer") !=
                        null) {
                    // Hacky stuff to make the correct solution appear when
                    // "none of the above" is the correct answer
                    var list = $("#solutionarea").find("ul");
                    var choice = list.children().filter(function() {
                            return $.trim(extractRawCode($(this).find("span")))
                            === $.trim(guess);
                        }).find("input");
                    choice.next().fadeOut("fast", function() {
                            $(this).replaceWith(list.data("real-answer"))
                                .fadeIn("fast");
                        });
                    return true;
                } else if ($.trim(guess) === $.trim(correct)) {
                    return true;
                }

                return false;
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
        setup: function(solutionarea, solution) {
            var input = $("<select></select>");
            $(solutionarea).append(input);

            // Get the choices
            var choices = $.tmpl.getVAR($(solution).data("choices"));
            $.each(choices, function(index, value) {
                // Add each one to the selection
                input.append('<option value="' + value + '">'
                    + value + "</option>");
            });

            return {
                validator: Khan.answerTypes.list.createValidator(solution),
                answer: function() {
                    return input.val();
                },
                solution: $.trim($(solution).text()),
                examples: [],
                showGuess: function(guess) {
                    input.val(guess === undefined ? "" : guess);
                }
            };
        },
        createValidator: function(solution) {
            var correct = $.trim($(solution).text());

            return function(guess) {
                guess = $.trim(guess);
                return correct === guess;
            };
        }
    },

    /*
     * The custom answer type provides a very general way to create answers,
     * which generally have input methods beyond the answer area, and have to
     * do more complex checking for answers
     *
     * There are 6 elements within the custom solution that are used.
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
     * The .show-guess and .show-guess-answerarea elements are evaluated as
     * javascript whenever the guess needs to be re-displayed (mostly in the
     * timeline). The .show-guess function should be used to change elements
     * outside of the answerarea, and the .show-guess-answerarea one should be
     * used to modify elements within the answerarea
     *
     * The text of the .example elements are used in the acceptable formats
     * popup
     */
    custom: {
        setup: function(solutionarea, solution) {
            // copy the instruction element into the solution area
            solution.find(".instruction")
                    .appendTo(solutionarea)
                    .tmpl();

            // Retrieve some code
            var guessCode = solution.find(".guess").text();
            var showCustomGuessCode = solution.find(".show-guess").text();
            var showGuessCode = solution.find(".show-guess-answerarea").text();

            return {
                validator: Khan.answerTypes.custom.createValidator(solution),
                answer: function() {
                    // Run the guess code
                    return KhanUtil.tmpl.getVAR(guessCode,
                                                KhanUtil.currentGraph);
                },
                solution: $.trim($(solution).text()),
                examples: solution.find(".example").map(function(i, el) {
                    return $(el).html();
                }),
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
                return validator(guess);
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
        setup: function(solutionarea, solution) {
            var input = $('<input type="text">');
            $(solutionarea).append(input);

            var fallback = $(solution).data("fallback");

            return {
                validator: Khan.answerTypes
                               .primeFactorization.createValidator(solution),
                answer: function() {
                    return input.val().length > 0 ?
                        input.val() :
                        (fallback != null ? fallback + "" : "");
                },
                solution: $.trim($(solution).text()),
                examples: [
                    "a product of prime factors, like " +
                        "<code>2 \\times 3</code>",
                    "a single prime number, like <code>5</code>"
                ],
                showGuess: function(guess) {
                    input.val(guess === undefined ? "" : guess);
                }
            };
        },
        createValidator: function(solution) {
            var correct = $.trim($(solution).text());

            return function(guess) {
                // Get rid of all the whitespace
                guess = guess.split(" ").join("").toLowerCase();
                // Split on x, *, or unicode x, sort, and join with xs
                guess = KhanUtil.sortNumbers(guess.split(/x|\*|\u00d7/))
                                .join("x");
                // perform simple string comparison
                return guess === correct;
            };
        }
    },

    /*
     * The checkbox answer type provides a single checkbox, with the solution
     * being true or false
     */
    checkbox: {
        setup: function(solutionarea, solution) {
            // Make a checkbox
            var input = $('<input type="checkbox">');
            $(solutionarea).append(input);

            return {
                validator: Khan.answerTypes.checkbox.createValidator(solution),
                answer: function() {
                    return input.is(":checked");
                },
                solution: $.trim($(solution).text()),
                examples: [],
                showGuess: function(guess) {
                    input.attr("checked", guess === undefined ? false : guess);
                }
            };
        },
        createValidator: function(solution) {
            // store whether the correct answer is true or false
            var correct = $.trim($(solution).text()) === "true";

            return function(guess) {
                return correct === guess;
            };
        }
    }
});

})();
