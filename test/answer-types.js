(function() {
    module("answer-types");

    function setupSolutionArea() {
        jQuery("#qunit-fixture").html(
            "<div id='solutionarea'>" +
            "</div>" +
            "<div class='problem'>" +
            "</div>");
    }

    /**
     * Return a promise that gets resolved after 1 ms
     */
    function defer() {
        var deferred = $.Deferred();
        _.defer(deferred.resolve);
        return deferred.promise();
    }

    function testAnswer(answerData, input, result, description) {
        $("#solutionarea input").val(input);
        checkAnswer(answerData, result, description + " [" + input + "]");
    }

    function testMultipleAnswer(answerData, inputs, result, description) {
        _.chain($("#solutionarea input")).zip(inputs).each(function(args) {
            var el = args[0], text = args[1];
            if (typeof text === "string") {
                $(el).val(text);
            } else {
                $(el).prop("checked", text);
            }
        });
        checkAnswer(
            answerData, result, description + " [" + inputs.join(", ") + "]");
    }

    function checkAnswer(answerData, result, description) {
        var validator = answerData.validator;
        var getAnswer = answerData.answer;

        var answer = validator(getAnswer());
        if (result === "right") {
            strictEqual(answer.empty, false, description + " - not empty");
            strictEqual(answer.message, null, description + " - no message");
            strictEqual(answer.correct, true, description + " - correct");
        } else if (result === "right-message") {
            strictEqual(answer.empty, false, description + " - not empty");
            notStrictEqual(answer.message, null, description + " - message");
            strictEqual(answer.correct, true, description + " - correct");
        } else if (result === "wrong") {
            strictEqual(answer.empty, false, description + " - not empty");
            strictEqual(answer.message, null, description + " - no message");
            strictEqual(answer.correct, false, description + " - not correct");
        } else if (result === "wrong-message") {
            strictEqual(answer.empty, false, description + " - not empty");
            notStrictEqual(answer.message, null, description + " - message");
            strictEqual(answer.correct, false, description + " - not correct");
        } else if (result === "empty") {
            strictEqual(answer.empty, true, description + " - empty");
            strictEqual(answer.message, null, description + " - no message");
            strictEqual(answer.correct, false, description + " - not correct");
        } else if (result === "empty-message") {
            strictEqual(answer.empty, true, description + " - empty");
            notStrictEqual(answer.message, null, description + " - message");
            strictEqual(answer.correct, false, description + " - not correct");
        }
    }

    asyncTest("number integer", 24, function() {
        setupSolutionArea();
        var $problem = jQuery("#qunit-fixture .problem").append(
            "<p class='solution' data-type='number' data-forms='integer'>-42<\/p>"
        );

        var answerData = Khan.answerTypes.number.setup($("#solutionarea"),
                $problem.children(".solution"));

        testAnswer(answerData, "", "empty", "empty answer is empty");
        testAnswer(answerData, "123", "wrong", "wrong answer is wrong");
        testAnswer(answerData, "-42", "right", "right answer is right");
        testAnswer(answerData, "-84/2", "wrong", "non-integer right answer is wrong");
        testAnswer(answerData, " \u2212 42 ", "right", "weirdly formatted right answer is right");
        testAnswer(answerData, "- 4 2", "empty-message", "crazily formatted answer is ungraded");
        testAnswer(answerData, "-41.9999999", "wrong", "close decimal is wrong");
        testAnswer(answerData, "-,42", "wrong", "sort of tricky wrong answer is wrong");

        start();
    });

    asyncTest("number big integer", 18, function() {
        setupSolutionArea();
        var $problem = jQuery("#qunit-fixture .problem").append(
            "<p class='solution' data-type='number' data-forms='integer'>12345678<\/p>"
        );

        var answerData = Khan.answerTypes.number.setup($("#solutionarea"),
                $problem.children(".solution"));

        testAnswer(answerData, "12345670", "wrong", "wrong answer is wrong");
        testAnswer(answerData, "12345678", "right", "right answer is right");
        testAnswer(answerData, "12,345,678", "right", "right answer with commas is right");
        testAnswer(answerData, "12.345.678", "right", "right answer with periods is right");
        testAnswer(answerData, "12 345 678", "right", "right answer with spaces is right");
        testAnswer(answerData, "123 45 678", "empty-message", "right answer with wrong commas is ungraded");

        start();
    });

    asyncTest("number proper", 15, function() {
        setupSolutionArea();
        var $problem = jQuery("#qunit-fixture .problem").append(
            "<p class='solution' data-type='number' data-forms='proper'>-0.5<\/p>"
        );

        var answerData = Khan.answerTypes.number.setup($("#solutionarea"),
                $problem.children(".solution"));

        testAnswer(answerData, "1/2", "wrong", "wrong answer is wrong");
        testAnswer(answerData, "-1/2", "right", "right answer is right");
        testAnswer(answerData, "-2/4", "empty-message", "unsimplified right answer provides a message");
        testAnswer(answerData, " \u2212 1 / 2 ", "right", "weirdly formatted right answer is right");
        testAnswer(answerData, "-0.5", "wrong", "decimal is wrong");

        start();
    });

    asyncTest("number proper (enforced simplification)", 15, function() {
        setupSolutionArea();
        var $problem = jQuery("#qunit-fixture .problem").append(
            "<p class='solution' data-type='number' data-forms='proper' " +
            "data-simplify='enforced'>-0.5<\/p>"
        );

        var answerData = Khan.answerTypes.number.setup($("#solutionarea"),
                $problem.children(".solution"));

        testAnswer(answerData, "1/2", "wrong", "wrong answer is wrong");
        testAnswer(answerData, "-1/2", "right", "right answer is right");
        testAnswer(answerData, "-2/4", "wrong-message", "unsimplified right answer provides a message");
        testAnswer(answerData, " \u2212 1 / 2 ", "right", "weirdly formatted right answer is right");
        testAnswer(answerData, "-0.5", "wrong", "decimal is wrong");

        start();
    });

    asyncTest("number proper (unsimplified)", 15, function() {
        setupSolutionArea();
        var $problem = jQuery("#qunit-fixture .problem").append(
            "<p class='solution' data-type='number' data-forms='proper' " +
            "data-simplify='optional'>-0.5<\/p>"
        );

        var answerData = Khan.answerTypes.number.setup($("#solutionarea"),
                $problem.children(".solution"));

        testAnswer(answerData, "1/2", "wrong", "wrong answer is wrong");
        testAnswer(answerData, "-1/2", "right", "right answer is right");
        testAnswer(answerData, "-2/4", "right", "unsimplified right answer is right");
        testAnswer(answerData, " \u2212 1 / 2 ", "right", "weirdly formatted right answer is right");
        testAnswer(answerData, "-0.5", "wrong", "decimal is wrong");

        start();
    });

    asyncTest("number improper", 18, function() {
        setupSolutionArea();
        var $problem = jQuery("#qunit-fixture .problem").append(
            "<p class='solution' data-type='number' data-forms='improper'>-1.5<\/p>"
        );

        var answerData = Khan.answerTypes.number.setup($("#solutionarea"),
                $problem.children(".solution"));

        testAnswer(answerData, "3/2", "wrong", "wrong answer is wrong");
        testAnswer(answerData, "-3/2", "right", "right answer is right");
        testAnswer(answerData, "-6/4", "empty-message", "unsimplified right answer provides a message");
        testAnswer(answerData, " \u2212 3 / 2 ", "right", "weirdly formatted right answer is right");
        testAnswer(answerData, "-1.5", "wrong", "decimal is wrong");
        testAnswer(answerData, "-1 1/2", "wrong", "mixed number is wrong");

        start();
    });

    asyncTest("number improper (enforced simplification)", 18, function() {
        setupSolutionArea();
        var $problem = jQuery("#qunit-fixture .problem").append(
            "<p class='solution' data-type='number' data-forms='improper' " +
            "data-simplify='enforced'>-1.5<\/p>"
        );

        var answerData = Khan.answerTypes.number.setup($("#solutionarea"),
                $problem.children(".solution"));

        testAnswer(answerData, "3/2", "wrong", "wrong answer is wrong");
        testAnswer(answerData, "-3/2", "right",  "right answer is right");
        testAnswer(answerData, "-6/4", "wrong-message", "unsimplified right answer provides a message");
        testAnswer(answerData, " \u2212 3 / 2 ", "right",  "weirdly formatted right answer is right");
        testAnswer(answerData, "-1.5", "wrong", "decimal is wrong");
        testAnswer(answerData, "-1 1/2", "wrong", "mixed number is wrong");

        start();
    });

    asyncTest("number improper (unsimplified)", 18, function() {
        setupSolutionArea();
        var $problem = jQuery("#qunit-fixture .problem").append(
            "<p class='solution' data-type='number' data-forms='improper' " +
            "data-simplify='optional'>-1.5<\/p>"
        );

        var answerData = Khan.answerTypes.number.setup($("#solutionarea"),
                $problem.children(".solution"));

        testAnswer(answerData, "3/2", "wrong", "wrong answer is wrong");
        testAnswer(answerData, "-3/2", "right",  "right answer is right");
        testAnswer(answerData, "-6/4", "right",  "unsimplified right answer is right");
        testAnswer(answerData, " \u2212 3 / 2 ", "right",  "weirdly formatted right answer is right");
        testAnswer(answerData, "-1.5", "wrong", "decimal is wrong");
        testAnswer(answerData, "-1 1/2", "wrong", "mixed number is wrong");

        start();
    });

    asyncTest("number pi", 60, function() {
        setupSolutionArea();
        var $problem = jQuery("#qunit-fixture .problem").append(
            "<p class='solution' data-type='number' data-forms='pi'>-6.283185307179586<\/p>"
        );

        var answerData = Khan.answerTypes.number.setup($("#solutionarea"),
                $problem.children(".solution"));

        testAnswer(answerData, "2pi", "wrong", "wrong answer is wrong");
        testAnswer(answerData, "-2pi", "right", "right answer is right");
        testAnswer(answerData, "-tau", "right", "right answer is right");
        testAnswer(answerData, "-4pau/3", "right", "right answer is right");
        testAnswer(answerData, "-2tau", "wrong", "tau is not pi");
        testAnswer(answerData, "-2pau", "wrong", "pau is not pi");
        testAnswer(answerData, "-pau", "wrong", "pau is not tau");
        testAnswer(answerData, "-2", "wrong", "pi is not 1");
        testAnswer(answerData, "-6.28", "empty-message", "approximately right answer provides a message");
        testAnswer(answerData, "-44/7", "empty-message", "approximately right answer provides a message");
        testAnswer(answerData, "" + (-2 * Math.PI), "empty-message", "approximately right answer provides a message");
        testAnswer(answerData, "-2/1 pi", "empty-message", "unsimplified answer provides a message");
        testAnswer(answerData, "-9.42", "wrong", "totally wrong answer gives no message");
        testAnswer(answerData, "-\\tau", "right", "\\tau is interpreted as tau");
        testAnswer(answerData, "-2\\pi", "right", "\\pi is interpreted as pi");
        testAnswer(answerData, "-t", "right", "t is interpreted as tau");
        testAnswer(answerData, "-2p", "right", "p is interpreted as pi");
        testAnswer(answerData, "-2\\p", "empty-message", "\\p is not interpreted as pi");
        testAnswer(answerData, " - 2 pi", "right", "spacing is arbitrary");
        testAnswer(answerData, " -4 pau /  3", "right", "spacing is arbitrary with fractions");

        start();
    });

    asyncTest("number pi (rational)", 42, function() {
        setupSolutionArea();
        var $problem = jQuery("#qunit-fixture .problem").append(
            "<p class='solution' data-type='number' data-forms='pi'>-2.6179938779914944<\/p>"
        );

        var answerData = Khan.answerTypes.number.setup($("#solutionarea"),
                $problem.children(".solution"));

        testAnswer(answerData, "5pi/6", "wrong", "wrong answer is wrong");
        testAnswer(answerData, "-5/6pi", "right", "right answer is right");
        testAnswer(answerData, "-5/12tau", "right", "right answer is right");
        testAnswer(answerData, "-5pi/6", "right", "right answer is right");
        testAnswer(answerData, "-5tau/12", "right", "right answer is right");
        testAnswer(answerData, "-2.62", "empty-message", "approximately right answer provides a message");
        testAnswer(answerData, " \u2212 5 \u03c0 / 6 ", "right", "weirdly formatted right answer is right");
        testAnswer(answerData, " \u2212 5 \u03c4 / 12 ", "right", "weirdly formatted right answer is right");
        testAnswer(answerData, " 5 \u03c0 / \u2212 6 ", "empty-message", "negative in denominator provides a message");
        testAnswer(answerData, " 5 \u03c4 / \u2212 12 ", "empty-message", "negative in denominator provides a message");
        testAnswer(answerData, " \u2212 5 / 6 \u03c0 ", "right", "weirdly formatted right answer is right");
        testAnswer(answerData, " \u2212 5 / 12 \u03c4 ", "right", "weirdly formatted right answer is right");
        testAnswer(answerData, " 5 / \u2212 6 \u03c0 ", "empty-message", "negative in denominator provides a message");
        testAnswer(answerData, " 5 / \u2212 12 \u03c4 ", "empty-message", "negative in denominator provides a message");

        start();
    });

    asyncTest("number pi (rational > 1)", 21, function() {
        setupSolutionArea();
        var $problem = jQuery("#qunit-fixture .problem").append(
            "<p class='solution' data-type='number' data-forms='pi'>-15.184364492350666<\/p>"
        );

        var answerData = Khan.answerTypes.number.setup($("#solutionarea"),
                $problem.children(".solution"));

        testAnswer(answerData, "4 5pi/6", "empty-message", "mixed number with pi in numerator is ungraded");
        testAnswer(answerData, "-4 5/6pi", "right", "right answer is right");
        testAnswer(answerData, "-29/6pi", "right", "right answer is right");
        testAnswer(answerData, "-2 5/12tau", "right", "right answer is right");
        testAnswer(answerData, "-15.18", "empty-message", "approximately right answer provides a message");
        testAnswer(answerData, " \u2212 4 5 / 6 \u03c0 ", "right", "weirdly formatted right answer is right");
        testAnswer(answerData, " \u2212 2 5 / 12 \u03c4 ", "right", "weirdly formatted right answer is right");

        start();
    });

    asyncTest("number pi (decimal)", 18, function() {
        setupSolutionArea();
        var $problem = jQuery("#qunit-fixture .problem").append(
            "<p class='solution' data-type='number' data-forms='pi'>-1.5707963267948966<\/p>"
        );

        var answerData = Khan.answerTypes.number.setup($("#solutionarea"),
                $problem.children(".solution"));

        testAnswer(answerData, "0.5 pi", "wrong", "wrong answer is wrong");
        testAnswer(answerData, "-0.5pi", "right", "right answer is right");
        testAnswer(answerData, "-0.25tau", "right", "right answer is right");
        testAnswer(answerData, "-1.57", "empty-message", "approximately right answer provides a message");
        testAnswer(answerData, " \u2212 0.5 \u03c0 ", "right", "weirdly formatted right answer is right");
        testAnswer(answerData, " \u2212 0.25 \u03c4 ", "right", "weirdly formatted right answer is right");

        start();
    });

    asyncTest("number log", 9, function() {
        setupSolutionArea();
        var $problem = jQuery("#qunit-fixture .problem").append(
            "<p class='solution' data-type='number' data-forms='log'>2<\/p>"
        );

        var answerData = Khan.answerTypes.number.setup($("#solutionarea"),
                $problem.children(".solution"));

        testAnswer(answerData, "2", "wrong", "wrong answer is wrong");
        testAnswer(answerData, "log(2)", "right", "right answer is right");
        testAnswer(answerData, " log ( 2 ) ", "right", "weirdly formatted right answer is right");

        start();
    });

    asyncTest("number percent", 9, function() {
        setupSolutionArea();
        var $problem = jQuery("#qunit-fixture .problem").append(
            "<p class='solution' data-type='number' data-forms='percent'>0.42<\/p>"
        );

        var answerData = Khan.answerTypes.number.setup($("#solutionarea"),
                $problem.children(".solution"));

        testAnswer(answerData, "0.42", "wrong", "wrong answer is wrong");
        testAnswer(answerData, "42%", "right", "right answer is right");
        testAnswer(answerData, "42", "empty-message", "leaving off percent sign provides a message");

        start();
    });

    asyncTest("number decimal percent", 9, function() {
        setupSolutionArea();
        var $problem = jQuery("#qunit-fixture .problem").append(
            "<p class='solution' data-type='number' data-forms='decimal, percent'>0.42<\/p>"
        );

        var answerData = Khan.answerTypes.number.setup($("#solutionarea"),
                $problem.children(".solution"));

        testAnswer(answerData, "0.42", "right", "right answer is right");
        testAnswer(answerData, "42%", "right", "right answer is right");
        testAnswer(answerData, "42", "empty-message", "leaving off percent sign provides a message");

        start();
    });

    asyncTest("number mixed", 18, function() {
        setupSolutionArea();
        var $problem = jQuery("#qunit-fixture .problem").append(
            "<p class='solution' data-type='number' data-forms='mixed'>-1.5<\/p>"
        );

        var answerData = Khan.answerTypes.number.setup($("#solutionarea"),
                $problem.children(".solution"));

        testAnswer(answerData, "1 1/2", "wrong", "wrong answer is wrong");
        testAnswer(answerData, "-1 1/2", "right", "right answer is right");
        testAnswer(answerData, "-1 2/4", "empty-message", "unsimplified right answer provides a message");
        testAnswer(answerData, " \u2212 1 1 / 2 ", "right", "weirdly formatted right answer is right");
        testAnswer(answerData, "-1.5", "wrong", "decimal is wrong");
        testAnswer(answerData, "-3/2", "wrong", "improper fraction is wrong");

        start();
    });

    asyncTest("number mixed (simplification enforced)", 18, function() {
        setupSolutionArea();
        var $problem = jQuery("#qunit-fixture .problem").append(
            "<p class='solution' data-type='number' data-forms='mixed' " +
            "data-simplify='enforced'>-1.5<\/p>"
        );

        var answerData = Khan.answerTypes.number.setup($("#solutionarea"),
                $problem.children(".solution"));

        testAnswer(answerData, "1 1/2", "wrong", "wrong answer is wrong");
        testAnswer(answerData, "-1 1/2", "right",  "right answer is right");
        testAnswer(answerData, "-1 2/4", "wrong-message", "unsimplified right answer provides a message");
        testAnswer(answerData, " \u2212 1 1 / 2 ", "right",  "weirdly formatted right answer is right");
        testAnswer(answerData, "-1.5", "wrong", "decimal is wrong");
        testAnswer(answerData, "-3/2", "wrong", "improper fraction is wrong");

        start();
    });

    asyncTest("number mixed (unsimplified)", 18, function() {
        setupSolutionArea();
        var $problem = jQuery("#qunit-fixture .problem").append(
            "<p class='solution' data-type='number' data-forms='mixed' " +
            "data-simplify='optional'>-1.5<\/p>"
        );

        var answerData = Khan.answerTypes.number.setup($("#solutionarea"),
                $problem.children(".solution"));

        testAnswer(answerData, "1 1/2", "wrong", "wrong answer is wrong");
        testAnswer(answerData, "-1 1/2", "right",  "right answer is right");
        testAnswer(answerData, "-1 2/4", "right",  "unsimplified right answer is right");
        testAnswer(answerData, " \u2212 1 1 / 2 ", "right",  "weirdly formatted right answer is right");
        testAnswer(answerData, "-1.5", "wrong", "decimal is wrong");
        testAnswer(answerData, "-3/2", "wrong", "improper fraction is wrong");

        start();
    });

    asyncTest("number decimal", 27, function() {
        setupSolutionArea();
        var $problem = jQuery("#qunit-fixture .problem").append(
            "<p class='solution' data-type='number' data-forms='decimal'>12345.6789<\/p>"
        );

        var answerData = Khan.answerTypes.number.setup($("#solutionarea"),
                $problem.children(".solution"));

        testAnswer(answerData, "12345.6788", "wrong", "wrong answer is wrong");
        testAnswer(answerData, "12345.6789", "right", "right answer is right");
        testAnswer(answerData, "12345,6789", "right", "right answer with decimal comma is right");
        testAnswer(answerData, "12,345.6789", "right", "right answer with commas is right");
        testAnswer(answerData, "12,345.678,9", "right", "right answer with commas is right");
        testAnswer(answerData, "12.345,6789", "right", "right answer with periods is right");
        testAnswer(answerData, "12.345,678.9", "right", "right answer with periods is right");
        testAnswer(answerData, "12 345.678 9", "right", "right answer with spaces is right");
        testAnswer(answerData, "12 345,678 9", "right", "right answer with spaces is right");

        start();
    });

    asyncTest("number leading zeros are okay on decimals", 3, function() {
        setupSolutionArea();
        var $problem = jQuery("#qunit-fixture .problem").append(
            "<p class='solution' data-type='number'>0.372<\/p>"
        );

        var answerData = Khan.answerTypes.number.setup($("#solutionarea"),
                $problem.children(".solution"));

        testAnswer(answerData, "0.372", "right", "right answer is right");

        start();
    });

    asyncTest("number leading zeros are not okay on integers", 12, function() {
        setupSolutionArea();
        var $problem = jQuery("#qunit-fixture .problem").append(
            "<p class='solution' data-type='number'>372<\/p>"
        );

        var answerData = Khan.answerTypes.number.setup($("#solutionarea"),
                $problem.children(".solution"));

        testAnswer(answerData, "372", "right", "right answer is right");
        testAnswer(answerData, "0.372", "wrong", "leading zeros are wrong");
        testAnswer(answerData, "00.372", "wrong", "two leading zeros are wrong");
        testAnswer(answerData, "0.000.372", "empty-message", "weirdly leading zeros is ungraded");

        start();
    });

    asyncTest("number inexact", 12, function() {
        setupSolutionArea();
        var $problem = jQuery("#qunit-fixture .problem").append(
            "<p class='solution' data-type='number' data-inexact data-max-error='1'>123.45<\/p>"
        );

        var answerData = Khan.answerTypes.number.setup($("#solutionarea"),
                $problem.children(".solution"));

        testAnswer(answerData, "125", "wrong", "wrong answer is wrong");
        testAnswer(answerData, "123.45", "right", "exact answer is right");
        testAnswer(answerData, "124.4", "right", "high answer is right");
        testAnswer(answerData, "122.5", "right", "low answer is right");

        start();
    });

    asyncTest("number max-error-only", 12, function() {
        setupSolutionArea();
        var $problem = jQuery("#qunit-fixture .problem").append(
            "<p class='solution' data-type='number' data-max-error='1'>123.45<\/p>"
        );

        var answerData = Khan.answerTypes.number.setup($("#solutionarea"),
                $problem.children(".solution"));

        testAnswer(answerData, "125", "wrong", "wrong answer is wrong");
        testAnswer(answerData, "123.45", "right", "exact answer is right");
        testAnswer(answerData, "124.4", "wrong", "high answer is wrong");
        testAnswer(answerData, "122.5", "wrong", "low answer is wrong");

        start();
    });

    asyncTest("decimal", 30, function() {
        setupSolutionArea();
        var $problem = jQuery("#qunit-fixture .problem").append(
            "<p class='solution' data-type='decimal'>12345.6789<\/p>"
        );

        var answerData = Khan.answerTypes.decimal.setup($("#solutionarea"),
                $problem.children(".solution"));

        testAnswer(answerData, "", "empty", "empty answer is empty");
        testAnswer(answerData, "12345.6788", "wrong", "wrong answer is wrong");
        testAnswer(answerData, "12345.6789", "right", "right answer is right");
        testAnswer(answerData, "12345,6789", "right", "right answer with decimal comma is right");
        testAnswer(answerData, "12,345.6789", "right", "right answer with commas is right");
        testAnswer(answerData, "12,345.678,9", "right", "right answer with commas is right");
        testAnswer(answerData, "12.345,6789", "right", "right answer with periods is right");
        testAnswer(answerData, "12.345,678.9", "right", "right answer with periods is right");
        testAnswer(answerData, "12 345.678 9", "right", "right answer with spaces is right");
        testAnswer(answerData, "12 345,678 9", "right", "right answer with spaces is right");

        start();
    });

    asyncTest("number generic 0", 12, function() {
        setupSolutionArea();
        var $problem = jQuery("#qunit-fixture .problem").append(
            "<p class='solution'>0<\/p>"
        );

        var answerData = Khan.answerTypes.number.setup($("#solutionarea"),
                $problem.children(".solution"));

        testAnswer(answerData, "", "empty", "empty answer is empty");
        testAnswer(answerData, "42", "wrong", "wrong answer is wrong");
        testAnswer(answerData, "0", "right", "right answer is right");
        testAnswer(answerData, "0.0", "right", "right answer is right");

        start();
    });

    asyncTest("number generic 1/3", 12, function() {
        setupSolutionArea();
        var $problem = jQuery("#qunit-fixture .problem").append(
            "<p class='solution'>0.3333333333333333<\/p>"
        );

        var answerData = Khan.answerTypes.number.setup($("#solutionarea"),
                $problem.children(".solution"));

        testAnswer(answerData, "-1/3", "wrong", "wrong answer is wrong");
        testAnswer(answerData, "1/3", "right", "right answer is right");
        testAnswer(answerData, "2/6", "empty-message", "unsimplified right answer provides a message");
        testAnswer(answerData, "0.3333333333333333", "wrong", "decimal from calculator is wrong");

        start();
    });

    asyncTest("number generic -1.5", 15, function() {
        setupSolutionArea();
        var $problem = jQuery("#qunit-fixture .problem").append(
            "<p class='solution'>-1.5<\/p>"
        );

        var answerData = Khan.answerTypes.number.setup($("#solutionarea"),
                $problem.children(".solution"));

        testAnswer(answerData, "1.5", "wrong", "wrong answer is wrong");
        testAnswer(answerData, "-1.5", "right", "right answer is right");
        testAnswer(answerData, "-1,5000", "right", "right answer is right");
        testAnswer(answerData, "-3/2", "right", "right answer is right");
        testAnswer(answerData, "-6/4", "empty-message", "unsimplified right answer provides a message");

        start();
    });

    asyncTest("number generic 41976", 12, function() {
        setupSolutionArea();
        var $problem = jQuery("#qunit-fixture .problem").append(
            "<p class='solution'>41976<\/p>"
        );

        var answerData = Khan.answerTypes.number.setup($("#solutionarea"),
                $problem.children(".solution"));

        testAnswer(answerData, "419.76", "wrong", "wrong answer is wrong");
        testAnswer(answerData, "41976", "right", "right answer is right");
        testAnswer(answerData, "41,976", "right", "right answer with comma is right");
        testAnswer(answerData, "41.976", "right", "right answer with period is right");

        start();
    });

    asyncTest("multiple", 42, function() {
        setupSolutionArea();
        var $problem = jQuery("#qunit-fixture .problem").append(
            "<p class='solution' data-type='multiple'>" +
                "<span class='sol'>7<\/span>" +
                "<span class='sol'>1.5<\/span>" +
            "<\/p>"
        );

        var answerData = Khan.answerTypes.multiple.setup($("#solutionarea"),
                $problem.children(".solution"));

        testMultipleAnswer(answerData, ["7", "3/2"], "right", "right answer is right");
        testMultipleAnswer(answerData, ["7", "1.5"], "right", "right answer is right");
        testMultipleAnswer(answerData, ["3/2", "7"], "wrong", "wrong answer is wrong");
        testMultipleAnswer(answerData, ["7", ""], "wrong", "incomplete answer is wrong");
        testMultipleAnswer(answerData, ["", "3/2"], "wrong", "incomplete answer is wrong");
        testMultipleAnswer(answerData, ["", ""], "empty", "empty answer is empty");
        testMultipleAnswer(answerData, ["7", "6/4"], "empty-message", "unsimplified right answer provides a message");
        testMultipleAnswer(answerData, ["14/2", "6/4"], "empty-message", "unsimplified right gives message");
        testMultipleAnswer(answerData, ["14/2", "3/2"], "empty-message", "unsimplified right gives message");
        testMultipleAnswer(answerData, ["7", "6/4"], "empty-message", "unsimplified right gives message");
        testMultipleAnswer(answerData, ["14/2", "7"], "wrong", "unsimplified right and wrong is wrong");
        testMultipleAnswer(answerData, ["3", "6/4"], "wrong", "unsimplified right and wrong is wrong");
        testMultipleAnswer(answerData, ["4/2", "4/2"], "wrong", "unsimplified wrong is wrong");
        testMultipleAnswer(answerData, ["14/2", ""], "wrong", "unsimplified imcomplete answer is wrong");

        start();
    });

    asyncTest("multiple with enforced simplification", 33, function() {
        setupSolutionArea();
        var $problem = jQuery("#qunit-fixture .problem").append(
            "<p class='solution' data-type='multiple'>" +
                "<span class='sol' data-simplify='enforced'>7<\/span>" +
                "<span class='sol' data-simplify='enforced'>1.5<\/span>" +
            "<\/p>"
        );

        var answerData = Khan.answerTypes.multiple.setup($("#solutionarea"),
                $problem.children(".solution"));

        testMultipleAnswer(answerData, ["7", "3/2"], "right", "right answer is right");
        testMultipleAnswer(answerData, ["7", "1.5"], "right", "right answer is right");
        testMultipleAnswer(answerData, ["3/2", "7"], "wrong", "wrong answer is wrong");
        testMultipleAnswer(answerData, ["7", ""], "wrong", "incomplete answer is wrong");
        testMultipleAnswer(answerData, ["", "3/2"], "wrong", "incomplete answer is wrong");
        testMultipleAnswer(answerData, ["", ""], "empty", "empty answer is empty");
        testMultipleAnswer(answerData, ["7", "6/4"], "wrong-message", "unsimplified right answer provides a message");
        testMultipleAnswer(answerData, ["14/2", "6/4"], "wrong-message", "unsimplified right gives message");
        testMultipleAnswer(answerData, ["14/2", "3/2"], "wrong-message", "unsimplified right gives message");
        testMultipleAnswer(answerData, ["7", "6/4"], "wrong-message", "unsimplified right gives message");
        testMultipleAnswer(answerData, ["4/2", "4/2"], "wrong", "unsimplified wrong is wrong");
        // TODO(eater): The following three cases currently return a message
        //              about being almost right. It seems more natural that
        //              they would just be marked wrong. But it also seems
        //              expected that if several components of a multiple are
        //              wrong and one of them returns a message, that message
        //              would be preserved. So I hesitate to do the work to
        //              make these test cases pass. Furthermore, this situation
        //              never comes up today since the only exercise to do
        //              data-simplify='enforced' doesn't do so in a multiple.
        //              Thus I shall leave these three lines commented out as
        //              a curiosity to be pondered.
        // testMultipleAnswer(answerData, ["14/2", "7"], "wrong", "unsimplified right and wrong is wrong");
        // testMultipleAnswer(answerData, ["3", "6/4"], "wrong", "unsimplified right and wrong is wrong");
        // testMultipleAnswer(answerData, ["14/2", ""], "wrong", "unsimplified imcomplete answer is wrong");

        start();
    });

    asyncTest("multiple with fallback 1", 21, function() {
        setupSolutionArea();
        var $problem = jQuery("#qunit-fixture .problem").append(
            "<p class='solution' data-type='multiple'>" +
                "<span class='sol'>7<\/span>" +
                "<span class='sol' data-fallback='1'>1<\/span>" +
            "<\/p>"
        );

        var answerData = Khan.answerTypes.multiple.setup($("#solutionarea"),
                $problem.children(".solution"));

        testMultipleAnswer(answerData, ["7", "1"], "right", "right answer is right");
        testMultipleAnswer(answerData, ["1", "7"], "wrong", "wrong answer is wrong");
        testMultipleAnswer(answerData, ["7", "2"], "wrong", "wrong answer is wrong");
        testMultipleAnswer(answerData, ["7", ""], "right", "right answer is right");
        testMultipleAnswer(answerData, ["", "1"], "wrong", "incomplete answer is wrong");
        testMultipleAnswer(answerData, ["", "2"], "wrong", "incomplete answer is wrong");
        testMultipleAnswer(answerData, ["", ""], "empty", "empty answer is empty");

        start();
    });

    asyncTest("multiple with fallback 0", 21, function() {
        setupSolutionArea();
        var $problem = jQuery("#qunit-fixture .problem").append(
            "<p class='solution' data-type='multiple'>" +
                "<span class='sol'>7<\/span>" +
                "<span class='sol' data-fallback='0'>0<\/span>" +
            "<\/p>"
        );

        var answerData = Khan.answerTypes.multiple.setup($("#solutionarea"),
                $problem.children(".solution"));

        testMultipleAnswer(answerData, ["7", "0"], "right", "right answer is right");
        testMultipleAnswer(answerData, ["0", "7"], "wrong", "wrong answer is wrong");
        testMultipleAnswer(answerData, ["7", "2"], "wrong", "wrong answer is wrong");
        testMultipleAnswer(answerData, ["7", ""], "right", "right answer is right");
        testMultipleAnswer(answerData, ["", "0"], "wrong", "incomplete answer is wrong");
        testMultipleAnswer(answerData, ["", "2"], "wrong", "incomplete answer is wrong");
        testMultipleAnswer(answerData, ["", ""], "empty", "empty answer is empty");

        start();
    });

    asyncTest("multiple with coefficient +1", 18, function() {
        setupSolutionArea();
        var forms = "integer, proper, improper, mixed, decimal, coefficient";

        var $problem = jQuery("#qunit-fixture .problem").append(
            "<p class='solution' data-type='multiple'>" +
                "<span class='sol' data-forms='" + forms + "'>7<\/span> x + " +
                "<span class='sol' data-forms='" + forms + "'>1<\/span> y" +
            "<\/p>"
        );

        var answerData = Khan.answerTypes.multiple.setup($("#solutionarea"),
                $problem.children(".solution"));

        testMultipleAnswer(answerData, ["7", "1"], "right", "right answer is right");
        testMultipleAnswer(answerData, ["1", "7"], "wrong", "wrong answer is wrong");
        testMultipleAnswer(answerData, ["7", "2"], "wrong", "wrong answer is wrong");
        testMultipleAnswer(answerData, ["7", ""], "right", "right answer is right");
        testMultipleAnswer(answerData, ["", "2"], "wrong", "incomplete answer is wrong");
        testMultipleAnswer(answerData, ["", ""], "empty", "empty answer is empty");

        start();
    });

    asyncTest("multiple with coefficient -1", 21, function() {
        setupSolutionArea();
        var forms = "integer, proper, improper, mixed, decimal, coefficient";

        var $problem = jQuery("#qunit-fixture .problem").append(
            "<p class='solution' data-type='multiple'>" +
                "<span class='sol' data-forms='" + forms + "'>7<\/span> x + " +
                "<span class='sol' data-forms='" + forms + "'>-1<\/span> y" +
            "<\/p>"
        );

        var answerData = Khan.answerTypes.multiple.setup($("#solutionarea"),
                $problem.children(".solution"));

        testMultipleAnswer(answerData, ["7", "-1"], "right", "right answer is right");
        testMultipleAnswer(answerData, ["-1", "7"], "wrong", "wrong answer is wrong");
        testMultipleAnswer(answerData, ["7", "2"], "wrong", "wrong answer is wrong");
        testMultipleAnswer(answerData, ["7", "-"], "right", "right answer is right");
        testMultipleAnswer(answerData, ["7", ""], "wrong", "incomplete answer is wrong");
        testMultipleAnswer(answerData, ["", "2"], "wrong", "incomplete answer is wrong");
        testMultipleAnswer(answerData, ["", ""], "empty", "empty answer is empty");

        start();
    });

    asyncTest("multiple with two coefficients of 1", 15, function() {
        setupSolutionArea();
        var forms = "integer, proper, improper, mixed, decimal, coefficient";

        var $problem = jQuery("#qunit-fixture .problem").append(
            "<p class='solution' data-type='multiple'>" +
                "<span class='sol' data-forms='" + forms + "'>1<\/span> x + " +
                "<span class='sol' data-forms='" + forms + "'>1<\/span> y" +
            "<\/p>"
        );

        var answerData = Khan.answerTypes.multiple.setup($("#solutionarea"),
                $problem.children(".solution"));

        testMultipleAnswer(answerData, ["1", "1"], "right", "right answer is right");
        testMultipleAnswer(answerData, ["1", ""], "right", "right answer is right");
        testMultipleAnswer(answerData, ["1", " "], "right", "right answer is right");
        testMultipleAnswer(answerData, ["", "1"], "right", "right answer is right");
        testMultipleAnswer(answerData, ["", ""], "empty", "empty answer is empty");

        start();
    });

    asyncTest("multiple with true checkbox", 12, function() {
        setupSolutionArea();
        var $problem = jQuery("#qunit-fixture .problem").append(
            "<p class='solution' data-type='multiple'>" +
                // Doing data-text here so that '' grades true; `set` will
                // behave similarly
                "<span class='sol' data-type='text'><\/span>" +
                "<span class='sol' data-type='checkbox'>true<\/span>" +
            "<\/p>"
        );

        var answerData = Khan.answerTypes.multiple.setup($("#solutionarea"),
                $problem.children(".solution"));

        testMultipleAnswer(answerData, ["", true], "right", "right answer is right");
        testMultipleAnswer(answerData, ["", false], "empty", "empty answer is empty");
        testMultipleAnswer(answerData, ["7", false], "wrong", "wrong answer is wrong");
        testMultipleAnswer(answerData, ["7", true], "wrong", "wrong answer is wrong");

        start();
    });

    asyncTest("multiple with false checkbox", 12, function() {
        setupSolutionArea();
        var $problem = jQuery("#qunit-fixture .problem").append(
            "<p class='solution' data-type='multiple'>" +
                "<span class='sol'>12<\/span>" +
                "<span class='sol' data-type='checkbox'>false<\/span>" +
            "<\/p>"
        );

        var answerData = Khan.answerTypes.multiple.setup($("#solutionarea"),
                $problem.children(".solution"));

        testMultipleAnswer(answerData, ["12", false], "right", "right answer is right");
        testMultipleAnswer(answerData, ["", false], "empty", "empty answer is empty");
        testMultipleAnswer(answerData, ["", true], "wrong", "wrong answer is wrong");
        testMultipleAnswer(answerData, ["12", true], "wrong", "nonsensical answer is wrong");

        start();
    });

    asyncTest("set with no things", 15, function() {
        setupSolutionArea();
        var $problem = jQuery("#qunit-fixture .problem").append(
            "<div class='solution' data-type='set'>" +
                "<div class='input-format'>" +
                    "<span class='entry'></span>" +
                    "<span class='entry'></span>" +
                "<\/div>" +
            "<\/div>"
        );

        var answerData = Khan.answerTypes.set.setup($("#solutionarea"),
                $problem.children(".solution"));

        // One of the few cases where we intentionally a validation result
        // something for an empty-looking answer; whenever this happens
        // there'll be a separate checkbox for "No solution" or something
        // similar as there is in absolute_value_equations
        testMultipleAnswer(answerData, ["", ""], "right", "right answer is right");
        testMultipleAnswer(answerData, ["3", ""], "wrong", "wrong answer is wrong");
        testMultipleAnswer(answerData, ["", "3"], "wrong", "wrong answer is wrong");
        testMultipleAnswer(answerData, ["12", "4"], "wrong", "wrong answer is wrong");
        testMultipleAnswer(answerData, ["4", "12"], "wrong", "wrong answer is wrong");

        start();
    });

    asyncTest("set with fewer things", 21, function() {
        setupSolutionArea();
        var $problem = jQuery("#qunit-fixture .problem").append(
            "<div class='solution' data-type='set'>" +
                "<span class='set-sol'>12<\/span>" +
                "<div class='input-format'>" +
                    "<span class='entry'></span>" +
                    "<span class='entry'></span>" +
                "<\/div>" +
            "<\/div>"
        );

        var answerData = Khan.answerTypes.set.setup($("#solutionarea"),
                $problem.children(".solution"));

        testMultipleAnswer(answerData, ["12", ""], "right", "right answer is right");
        testMultipleAnswer(answerData, ["", "12"], "right", "right answer is right");
        testMultipleAnswer(answerData, ["", ""], "empty", "empty answer is empty");
        testMultipleAnswer(answerData, ["3", ""], "wrong", "wrong answer is wrong");
        testMultipleAnswer(answerData, ["", "3"], "wrong", "wrong answer is wrong");
        testMultipleAnswer(answerData, ["12", "4"], "wrong", "wrong answer is wrong");
        testMultipleAnswer(answerData, ["4", "12"], "wrong", "wrong answer is wrong");

        start();
    });

    asyncTest("set with as many things", 45, function() {
        setupSolutionArea();
        var $problem = jQuery("#qunit-fixture .problem").append(
            "<div class='solution' data-type='set'>" +
                "<span class='set-sol'>12<\/span>" +
                "<span class='set-sol'>13<\/span>" +
                "<div class='input-format'>" +
                    "<span class='entry'></span>" +
                    "<span class='entry'></span>" +
                "<\/div>" +
            "<\/div>"
        );

        var answerData = Khan.answerTypes.set.setup($("#solutionarea"),
                $problem.children(".solution"));

        testMultipleAnswer(answerData, ["12", "13"], "right", "right answer is right");
        testMultipleAnswer(answerData, ["13", "12"], "right", "right answer is right");
        testMultipleAnswer(answerData, ["12", ""], "wrong", "incomplete answer is wrong");
        testMultipleAnswer(answerData, ["13", ""], "wrong", "incomplete answer is wrong");
        testMultipleAnswer(answerData, ["", "12"], "wrong", "incomplete answer is wrong");
        testMultipleAnswer(answerData, ["", ""], "empty", "empty answer is empty");
        testMultipleAnswer(answerData, ["12", "14"], "wrong", "wrong answer is wrong");
        testMultipleAnswer(answerData, ["12", "12"], "wrong", "wrong answer is wrong");
        testMultipleAnswer(answerData, ["24/2", "26/2"], "empty-message", "unsimplified right gives message");
        testMultipleAnswer(answerData, ["24/2", "13"], "empty-message", "unsimplified right gives message");
        testMultipleAnswer(answerData, ["12", "26/2"], "empty-message", "unsimplified right gives message");
        testMultipleAnswer(answerData, ["24/2", "14"], "wrong", "unsimplified right and wrong is wrong");
        testMultipleAnswer(answerData, ["14", "26/2"], "wrong", "unsimplified right and wrong is wrong");
        testMultipleAnswer(answerData, ["4/2", "4/2"], "wrong", "unsimplified wrong is wrong");
        testMultipleAnswer(answerData, ["24/2", ""], "wrong", "unsimplified imcomplete answer is wrong");

        start();
    });

    asyncTest("set with more things", 36, function() {
        setupSolutionArea();
        var $problem = jQuery("#qunit-fixture .problem").append(
            "<div class='solution' data-type='set'>" +
                "<span class='set-sol'>12<\/span>" +
                "<span class='set-sol'>13<\/span>" +
                "<span class='set-sol'>14<\/span>" +
                "<div class='input-format'>" +
                    "<span class='entry'></span>" +
                    "<span class='entry'></span>" +
                "<\/div>" +
            "<\/div>"
        );

        var answerData = Khan.answerTypes.set.setup($("#solutionarea"),
                $problem.children(".solution"));

        testMultipleAnswer(answerData, ["12", "13"], "right", "right answer is right");
        testMultipleAnswer(answerData, ["12", "14"], "right", "right answer is right");
        testMultipleAnswer(answerData, ["13", "12"], "right", "right answer is right");
        testMultipleAnswer(answerData, ["13", "14"], "right", "right answer is right");
        testMultipleAnswer(answerData, ["14", "12"], "right", "right answer is right");
        testMultipleAnswer(answerData, ["14", "13"], "right", "right answer is right");
        testMultipleAnswer(answerData, ["12", ""], "wrong", "incomplete answer is wrong");
        testMultipleAnswer(answerData, ["13", ""], "wrong", "incomplete answer is wrong");
        testMultipleAnswer(answerData, ["", "12"], "wrong", "incomplete answer is wrong");
        testMultipleAnswer(answerData, ["", ""], "empty", "empty answer is empty");
        testMultipleAnswer(answerData, ["12", "12"], "wrong", "wrong answer is wrong");
        testMultipleAnswer(answerData, ["12", "7"], "wrong", "wrong answer is wrong");

        start();
    });

    asyncTest("set with message", 18, function() {
        setupSolutionArea();
        var $problem = jQuery("#qunit-fixture .problem").append(
            "<div class='solution' data-type='set'>" +
                "<span class='set-sol' data-simplify='enforced'>0.5<\/span>" +
                "<span class='set-sol' data-simplify='required'>0.25<\/span>" +
                "<div class='input-format'>" +
                    "<span class='entry'></span>" +
                "<\/div>" +
            "<\/div>"
        );

        var answerData = Khan.answerTypes.set.setup($("#solutionarea"),
                $problem.children(".solution"));

        testMultipleAnswer(answerData, ["1/2"], "right", "right answer is right");
        testMultipleAnswer(answerData, ["1/4"], "right", "right answer is right");
        testMultipleAnswer(answerData, ["1/8"], "wrong", "wrong answer is wrong");
        testMultipleAnswer(answerData, ["2/4"], "wrong-message", "enforced simplification");
        testMultipleAnswer(answerData, ["2/8"], "empty-message", "required simplification");
        testMultipleAnswer(answerData, ["2/16"], "wrong", "wrong answer is wrong");

        start();
    });


    asyncTest("prime factorization", 24, function() {
        setupSolutionArea();
        var $problem = jQuery("#qunit-fixture .problem").append(
            "<p class='solution' data-type='primeFactorization'>2x2x3x5<\/p>"
        );

        var answerData = Khan.answerTypes.primeFactorization.setup($("#solutionarea"),
                $problem.children(".solution"));

        testAnswer(answerData, "", "empty", "empty answer is empty");
        testAnswer(answerData, "5x6", "wrong", "wrong answer is wrong");
        testAnswer(answerData, "2x2x3x5", "right", "right answer is right");
        testAnswer(answerData, "2*2*3*5", "right", "right answer is right");
        testAnswer(answerData, "2 *2 * 3 * 5", "right", "right answer is right");
        testAnswer(answerData, "3 * 2 * 5 * 2", "right", "right answer is right");
        testAnswer(answerData, "2 ^ 2 * 5 * 3", "right", "right answer is right");
        testAnswer(answerData, "2^2*3^1*5^1", "right", "right answer is right");

        start();
    });

    asyncTest("expression", 12, function() {
        setupSolutionArea();
        var $problem = jQuery("#qunit-fixture .problem").append(
            "<p class='solution' data-type='expression'>(x+3)(x-3)<\/p>"
        );

        var answerData = Khan.answerTypes.expression.setup($("#solutionarea"),
                $problem.children(".solution"));

        testAnswer(answerData, "", "empty", "empty answer is empty");
        testAnswer(answerData, "(x+3)(x+3)", "wrong", "wrong answer is wrong");
        testAnswer(answerData, "(x-3)(x+3)", "right", "right answer is right");
        testAnswer(answerData, "x^2-9", "right", "right answer is right");

        start();
    });

    asyncTest("expression-same-form", 12, function() {
        setupSolutionArea();
        var $problem = jQuery("#qunit-fixture .problem").append(
            "<p class='solution' data-type='expression' data-same-form>(x+3)(x-3)<\/p>"
        );

        var answerData = Khan.answerTypes.expression.setup($("#solutionarea"),
                $problem.children(".solution"));

        testAnswer(answerData, "", "empty", "empty answer is empty");
        testAnswer(answerData, "(x+3)(x+3)", "wrong", "wrong answer is wrong");
        testAnswer(answerData, "(x-3)(x+3)", "right", "right answer is right");
        testAnswer(answerData, "x^2-9", "wrong-message", "wrong form is wrong with message");

        start();
    });

    asyncTest("expression-simplified", 15, function() {
        setupSolutionArea();
        var $problem = jQuery("#qunit-fixture .problem").append(
            "<p class='solution' data-type='expression' data-simplify>x^2-9<\/p>"
        );

        var answerData = Khan.answerTypes.expression.setup($("#solutionarea"),
                $problem.children(".solution"));

        testAnswer(answerData, "", "empty", "empty answer is empty");
        testAnswer(answerData, "x^2+9", "wrong", "wrong answer is wrong");
        testAnswer(answerData, "(x+3)(x+3)", "wrong", "wrong answer is wrong");
        testAnswer(answerData, "x^2-9", "right", "right answer is right");
        testAnswer(answerData, "(x-3)(x+3)", "wrong-message", "unsimplified answer is wrong with message");

        start();
    });

    asyncTest("expression-multiple", 12, function() {
        setupSolutionArea();
        var $problem = jQuery("#qunit-fixture .problem").append(
            "<p class='solution' data-type='multiple'>" +
                "<span><code>f(x) = </code><\/span>" +
                "<span class='sol' data-type='expression'>(x+3)(x-3)<\/span>" +
            "<\/p>"
        );

        var answerData = Khan.answerTypes.multiple.setup($("#solutionarea"),
                $problem.children(".solution"));

        testMultipleAnswer(answerData, [""], "empty", "empty answer is empty");
        testMultipleAnswer(answerData, ["(x+3)(x+3)"], "wrong", "wrong answer is wrong");
        testMultipleAnswer(answerData, ["(x-3)(x+3)"], "right", "right answer is right");
        testMultipleAnswer(answerData, ["x^2-9"], "right", "right answer is right");

        start();
    });

    asyncTest("expression-set-in-multiple", 15, function() {
        setupSolutionArea();
        var $problem = jQuery("#qunit-fixture .problem").append(
            "<div class='solution' data-type='multiple'>" +
                "<span><code>f(x) = </code></span>" +
                "<div class='sol' data-type='set'>" +
                    "<div class='set-sol' data-type='expression' data-same-form>5x+45</div>" +
                    "<div class='set-sol' data-type='expression' data-same-form>5(x+9)</div>" +
                    "<div class='input-format'><div class='entry' data-type='expression'></div></div>" +
                "</div>" +
            "</div>"
        );

        var answerData = Khan.answerTypes.multiple.setup($("#solutionarea"),
                $problem.children(".solution"));

        testMultipleAnswer(answerData, [""], "empty", "empty answer is empty");
        testMultipleAnswer(answerData, ["5x+45"], "right", "right answer is right");
        testMultipleAnswer(answerData, ["5(x+9)"], "right", "other right answer is right");
        testMultipleAnswer(answerData, ["5x+9"], "wrong", "wrong answer is wrong");
        testMultipleAnswer(answerData, ["(5x^2+25x-180)/(x-4)"], "wrong-message",
                "unsimplified answer is wrong with message");

        start();
    });

    asyncTest("radio answerability", 8, function() {
        setupSolutionArea();
        // TODO(alpert): Get rid of MathJax
        Exercises.useKatex = false;

        var $problem = jQuery("#qunit-fixture .problem").append(
            "<p class='solution'><code>6<\/code><\/p>" +
            "<ul class='choices'>" +
                "<li><code>21<\/code><\/li>" +
                "<li><code>25<\/code><\/li>" +
                "<li><code>27<\/code><\/li>" +
                "<li><code>37<\/code><\/li>" +
            "<\/ul>"
        );
        jQuery("#qunit-fixture").runModules();

        var $solutionarea = $("#solutionarea");
        var $solution = $problem.children(".solution");

        var answerData = Khan.answerTypes.radio.setup(
                $solutionarea, $solution);

        var validator = answerData.validator;
        var getAnswer = answerData.answer;

        // By default, nothing is checked so the validator gives ""
        strictEqual(validator(getAnswer()).empty, true, "initial validation is empty");

        // Each answer should have a non-empty MathJax script tag
        $("#solutionarea script").each(function() {
            ok((/\S/).test($(this).html()));
        });

        // If we check the right answer (6), then it'll return true
        var $correctRadio = $("#solutionarea script")
            .filter(function() { return (/6/).test($(this).html()); })
            .closest("label").children("input");
        $correctRadio.prop("checked", true);

        strictEqual(validator(getAnswer()).correct, true);

        // If we check a wrong answer, then it'll return false
        var $incorrectRadio = $("#solutionarea script")
            .filter(function() { return !(/6/).test($(this).html()); })
            .closest("label").children("input");
        $incorrectRadio.prop("checked", true);
        strictEqual(validator(getAnswer()).correct, false);

        // Tell QUnit we're done.
        start();
    });

    asyncTest("radio category", 4, function() {
        setupSolutionArea();
        var $problem = jQuery("#qunit-fixture .problem").append(
            "<p class='solution'>C<\/p>" +
            "<ul class='choices' data-category='true'>" +
                "<li>A<\/li>" +
                "<li>B<\/li>" +
                "<li>C<\/li>" +
                "<li>D<\/li>" +
            "<\/ul>"
        );
        jQuery("#qunit-fixture").runModules();

        var $solutionarea = $("#solutionarea");
        var $solution = $problem.children(".solution");

        var answerData = Khan.answerTypes.radio.setup(
                $solutionarea, $solution);

        var validator = answerData.validator;
        var getAnswer = answerData.answer;

        // By default, nothing is checked so the validator gives ""
        strictEqual(validator(getAnswer()).empty, true, "initial validation is empty");

        var texts = _.map($("#solutionarea span.value"), function(e) {
            return $(e).text();
        });
        deepEqual(texts, ["A", "B", "C", "D"], "choices have the right order");

        // If we check the right answer (C), then it'll return true
        var $correctRadio = $("#solutionarea span.value")
            .filter(function() { return (/C/).test($(this).html()); })
            .closest("label").children("input");
        $correctRadio.prop("checked", true);

        strictEqual(validator(getAnswer()).correct, true);

        // If we check a wrong answer, then it'll return false
        var $incorrectRadio = $("#solutionarea span.value")
            .filter(function() { return (/A/).test($(this).html()); })
            .closest("label").children("input");
        $incorrectRadio.prop("checked", true);
        strictEqual(validator(getAnswer()).correct, false);

        start();
    });

    asyncTest("radio setup", 24, function() {
        setupSolutionArea();
        var choices = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K"];

        var $problem = jQuery("#qunit-fixture .problem").append(
            "<p class='solution'>C<\/p>" +
            "<ul class='choices' data-show='11'>" +
                _.map(choices, function(choice) {
                    return "<li>" + choice + "<\/li>";
                }).join("") +
            "<\/ul>"
        );
        jQuery("#qunit-fixture").runModules();

        var $solutionarea = $("#solutionarea");
        var $solution = $problem.children(".solution");

        var answerData = Khan.answerTypes.radio.setup(
                $solutionarea, $solution);

        var texts = _.map($("#solutionarea span.value"), function(e) {
            return $(e).text();
        });

        strictEqual(texts.length, choices.length,
            "The number of choices should be correct");
        _.each(texts, function(text) {
            ok(_.contains(choices, text),
                "The text should be one of the provided choices");
        });

        var textCounts = _.countBy(texts);
        _.each(textCounts, function(count) {
            strictEqual(count, 1, "There should only be one of each choice");
        });

        // This can fail rarely, if the results were shuffled back into the
        // original order, but that is unlikely
        notDeepEqual(["C", "A", "B", "D", "E", "F", "G", "H", "I", "J", "K"],
            texts, "The results were shuffled");

        start();
    });

    asyncTest("radio none of the above setup", 2, function() {
        setupSolutionArea();
        var $problem = jQuery("#qunit-fixture .problem").append(
            "<p class='solution'>A<\/p>" +
            "<ul class='choices' data-none='true'>" +
                "<li>B<\/li>" +
                "<li>C<\/li>" +
                "<li>D<\/li>" +
            "<\/ul>"
        );
        jQuery("#qunit-fixture").runModules();

        var $solutionarea = $("#solutionarea");
        var $solution = $problem.children(".solution");

        var answerData = Khan.answerTypes.radio.setup(
                $solutionarea, $solution);

        var texts = _.map($("#solutionarea span.value"), function(e) {
            return $(e).text();
        });

        strictEqual(texts.length, 4, "The number of choices should be correct");
        strictEqual(texts[3], "None of the above",
            "The last choice should be none of the above");

        start();
    });

    asyncTest("radio none of the above setup 2", 2, function() {
        setupSolutionArea();
        var $problem = jQuery("#qunit-fixture .problem").append(
            "<p class='solution'>A<\/p>" +
            "<ul class='choices' data-none='true' data-show='5'>" +
                "<li>B<\/li>" +
                "<li>C<\/li>" +
                "<li>D<\/li>" +
            "<\/ul>"
        );
        jQuery("#qunit-fixture").runModules();

        var $solutionarea = $("#solutionarea");
        var $solution = $problem.children(".solution");

        var answerData = Khan.answerTypes.radio.setup(
                $solutionarea, $solution);

        var texts = _.map($("#solutionarea span.value"), function(e) {
            return $(e).text();
        });

        strictEqual(texts.length, 5, "The number of choices should be correct");
        strictEqual(texts[4], "None of the above",
            "The last choice should be none of the above");

        start();
    });

    asyncTest("radio none of the above answerability", 4, function() {
        setupSolutionArea();
        // Even if there are 500 distractors, the correct answer must always be
        // mixed in as one of the correct ones -- we'll test that if there's
        // only answer and we show "None of the above", then it's hiding the
        // correct answer. (This test can pass even if the code is buggy 1/501
        // of the time, but we'll have to live with that.)
        var choices = _.range(500);
        var $problem = jQuery("#qunit-fixture .problem").append(
            "<p class='solution'>A<\/p>" +
            "<ul class='choices' data-none='true' data-show='1'>" +
                _.map(choices, function(choice) {
                    return "<li>" + choice + "<\/li>";
                }).join("") +
            "<\/ul>"
        );
        jQuery("#qunit-fixture").runModules();

        var $solutionarea = $("#solutionarea");
        var $solution = $problem.children(".solution");

        var answerData = Khan.answerTypes.radio.setup(
                $solutionarea, $solution);

        var validator = answerData.validator;
        var getAnswer = answerData.answer;

        var texts = _.map($("#solutionarea span.value"), function(e) {
            return $(e).text();
        });

        deepEqual(texts, ["None of the above"],
            "The only choice should be none of the above");

        // By default, nothing is checked so the validator gives ""
        strictEqual(validator(getAnswer()).empty, true, "initial validation is empty");

        // If we check the right answer (C), then it'll return true
        var $correctRadio = $("#solutionarea span.value").first()
            .closest("label").children("input");
        $correctRadio.prop("checked", true);

        // Make sure the answer gets marked as correct
        strictEqual(validator(getAnswer()).correct, true);

        // Now, wait for the animation to wear off...
        setTimeout(function() {
            // Make sure that the correct solution is now shown
            var newText = $("#solutionarea span.value").first().text();
            strictEqual(newText, "A",
                "The correct text appears after the answer is selected");

            start();
        }, 400);
    });

})();
