/* TODO(csilvers): fix these lint errors (http://eslint.org/docs/rules): */
/* eslint-disable no-var */
/* To fix, remove an entry above, run ka-lint, and fix errors. */

/*global Calculator, Exercises, _, i18n, icu*/

Calculator.init = function() {
    var ansChars = ["+", "-", "/", "*", "^", " "];
    var calculator = $(".calculator");
    var history = calculator.children(".history");
    var output = $("#calc-output-content");
    var inputRow = history.children(".calc-row.input");
    var input = inputRow.children("input");
    var buttons = calculator.find("a");
    var previousInstrs = [];
    var currentInstrIndex = -1;
    var ans = 0;
    var prevAnswer;
    var containsAns = false;
    var separator = icu.getDecimalFormatSymbols().decimal_separator;

    var formatInputHistory = function(text) {
        return text.replace(/pi/g, "\u03c0") + " =";
    };

    var appendDiv = function(div) {
        output.append(div);
        output.scrollTop(output[0].scrollHeight);
    };

    var insertPrevAnswer = function() {
        var outdiv;
        if (prevAnswer !== undefined) {
            outdiv = $("<div>").addClass("output").text(prevAnswer);
            prevAnswer = undefined;
            appendDiv(outdiv);
        }
    };

    var evaluate = function() {
        var instr = input.val();
        var indiv;
        var output;
        var outstr;
        var isError = false;
        var newInputVal = instr;
        if ($.trim(instr) !== "") {
            previousInstrs.unshift(instr);
            indiv = $("<div>").addClass("input-history")
                              .text(formatInputHistory(instr));
            try {
                if (separator !== ".") {
                    // i18nize the input numbers' decimal point
                    instr = instr.split(separator).join(".");
                }
                output = ans = Calculator.calculate(instr, ans);
                if (typeof output === "number") {
                    outstr = Math.round(output * 1000000000) / 1000000000;
                    if (separator !== ".") {
                        // i18nize the output number's decimal point
                        outstr = ("" + outstr).replace(".", separator);
                    }
                } else {
                    outstr = output;
                }
                newInputVal = outstr;
            } catch (e) {
                if (e instanceof Calculator.CalculatorError) {
                    outstr = e.message;
                    newInputVal = instr;
                    isError = true;
                    containsAns = false;
                    input.css({
                        backgroundColor: "#ffcccc",
                    });
                    return;
                } else {
                    throw e;
                }
            }
            insertPrevAnswer();
            appendDiv(indiv);
            prevAnswer = outstr;
            // errors should appear immediately
            if (isError) {
                insertPrevAnswer();
            }
        }

        containsAns = true;
        currentInstrIndex = -1;
        input.val(newInputVal);
    };

    var selected = function(text) {
        return "<span class='selected-anglemode'>" + text + "</span>";
    };

    var unselected = function(text) {
        return "<span class='unselected-anglemode'>" + text + "</span>";
    };

    var updateAngleMode = function() {
        // I18N: "DEGrees" calculator button (3 chars or less)
        var deg = i18n._("DEG");
        // I18N: "RADians" calculator button (3 chars or less)
        var rad = i18n._("RAD");
        if (Calculator.settings.angleMode === "DEG") {
            $(".calculator-angle-mode").html(unselected(rad) +
                                             "<br>" +
                                             selected(deg));
        } else {
            $(".calculator-angle-mode").html(selected(rad) +
                                             "<br>" +
                                             unselected(deg));
        }
    };

    // backspace etc isn't caught by keypress...
    var BACKSPACE = 8;
    var LEFT = 37;
    var RIGHT = 39;
    var UP = 38;
    var DOWN = 40;
    var keysToCancel = [LEFT, RIGHT];
    input.on("keydown", function(e) {
        if (_.contains(keysToCancel, e.keyCode)) {
            containsAns = false;
        }
        if (e.which === BACKSPACE) {
            if (containsAns) {
                input.val("");
                insertPrevAnswer();
                return false;
            }
        }

        if (e.which === UP) {
            insertPrevAnswer();
            currentInstrIndex += 1;
            if (currentInstrIndex >= previousInstrs.length) {
                currentInstrIndex = previousInstrs.length - 1;
            }
            input.val(previousInstrs[currentInstrIndex]);
            return false;
        }
        if (e.which === DOWN) {
            insertPrevAnswer();
            currentInstrIndex -= 1;
            if (currentInstrIndex < -1) {
                currentInstrIndex = -1;
            }
            input.val(previousInstrs[currentInstrIndex] || ans);
            return false;
        }
    });

    var insertText = function(inputtedChar) {
        var shouldOverwriteAns = !_.contains(ansChars, inputtedChar) &&
                                containsAns;

        insertPrevAnswer();
        containsAns = false;
        if (shouldOverwriteAns) {
            input.val("");
        }
        input.css({
            backgroundColor: "white",
        });
    };

    history.on("click", function(e) {
        input.focus();
    });

    // The enter handler needs to bind to keypress to prevent the
    // surrounding form submit... (http://stackoverflow.com/a/587575)
    var ENTER = 13;
    var EQUALS = 61;
    input.on("keypress", function(e) {
        if (e.which === ENTER || e.which === EQUALS) {
            evaluate();
            return false;
        }
        insertText(String.fromCharCode(e.charCode));
    });

    input.on("click", function(e) {
        containsAns = false;
    });

    buttons.on("click", function() {
        var jel = $(this);
        var behavior = jel.data("behavior");

        if (behavior != null) {
            if (behavior === "bs") {
                var val = input.val();
                input.val(val.slice(0, val.length - 1));
            } else if (behavior === "clear") {
                input.val("");
                ans = undefined;
                prevAnswer = undefined;
                previousInstrs = [];
                currentInstrIndex = -1;
                containsAns = false;
                output.empty();
            } else if (behavior === "angle-mode") {
                Calculator.settings.angleMode =
                    Calculator.settings.angleMode === "DEG" ?
                    "RAD" : "DEG";
                if (typeof window.localStorage !== "undefined") {
                    var userID = window.KA && window.KA.userId;
                    window.localStorage["calculator_settings:" +
                        userID] = JSON.stringify(
                        Calculator.settings);
                }
                updateAngleMode();
            } else if (behavior === "evaluate") {
                evaluate();
            }
        } else {
            var text = jel.data("text") || jel.text();
            insertText(text);
            input.val(input.val() + text);
        }

        input.focus();
        return false;
    });

    updateAngleMode();

    if (typeof Exercises !== "undefined") {
        $(Exercises).on("gotoNextProblem", function() {
            input.val("");
            output.children().not(inputRow).remove();
        });
    }

    // i18nize the decimal point button
    $(".calculator-decimal").html(separator);
};
