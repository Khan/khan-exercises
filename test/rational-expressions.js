(function() {
    module("rational-expressions");

    var t1 = new KhanUtil.Term(4);
    var t2 = new KhanUtil.Term(1, "x");
    var t3 = new KhanUtil.Term(-12, "x");
    var t4 = new KhanUtil.Term(12, {x: 2});
    var t5 = new KhanUtil.Term(3, "y");
    var t6 = new KhanUtil.Term(2, {x: 2, y: 3});

    var e1 = new KhanUtil.RationalExpression([4]);
    var e2 = new KhanUtil.RationalExpression([t3, 4]);
    var e3 = new KhanUtil.RationalExpression([[1, 'x'], 5]);
    var e4 = new KhanUtil.RationalExpression([[2, {x: 2, y: 3, z: 0}], t3, 4]);
    var e5 = new KhanUtil.RationalExpression([[2, {x: 2, y: 3}], t3, t4]);

    function checkRegex(regex, testString, result, description) {
        strictEqual(testString.search("^\\s*" + regex + "$") > -1, result, description);
    }

    asyncTest("terms to string", 7, function() {
        strictEqual(t1.toString(), "4", "single digit");
        strictEqual(new KhanUtil.Term(0, "x").toString(), '', "no variable");
        strictEqual(t2.toString(), 'x', "just variable");
        strictEqual(new KhanUtil.Term(2, {x: 1}).toString(), '2x', "variable degree 1");
        strictEqual(t3.toString(), '-12x', "coefficient and variable");
        strictEqual(t4.toString(), '12x^2', "variable degree 2");
        strictEqual(t6.toString(), '2x^2y^3', "two variables");
        start();
    });

    asyncTest("add term", 4, function() {
        strictEqual(t1.add(3).toString(), "7", "term digit add digit");
        strictEqual(t2.add(3).toString(), "x + 3", "term add digit");
        strictEqual(t2.add(t3).toString(), "-11x", "term add term");
        strictEqual(t3.add(e2).toString(), "-24x + 4", "term add expression");
        start();
    });

    asyncTest("multiply term", 5, function() {
        strictEqual(t1.multiply(3).toString(), "12", "term digit by digit");
        strictEqual(t2.multiply(2).toString(), "2x", "term by digit");
        strictEqual(t3.multiply(t1).toString(), "-48x", "term by term digit");
        strictEqual(t3.multiply(t4).toString(), "-144x^3", "same variable");
        strictEqual(t4.multiply(t5).toString(), "36x^2y", "different variable");
        start();
    });

    asyncTest("divide term", 5, function() {
        strictEqual(t1.divide(2).toString(), "2", "term digit by digit");
        strictEqual(t3.divide(3).toString(), "-4x", "term by digit");
        strictEqual(t3.divide(t1).toString(), "-3x", "term by term digit");
        strictEqual(t4.divide(t3).toString(), "-x", "same variable");
        strictEqual(t4.divide(t5).toString(), "4x^2y^-1", "different variable");
        start();
    });

    asyncTest("term GCD", 5, function() {
        strictEqual(t1.getGCD(2).toString(), "2", "term digit by digit");
        strictEqual(t3.getGCD(3).toString(), "3", "term by digit");
        strictEqual(t3.getGCD(t1).toString(), "4", "term by term digit");
        strictEqual(t4.getGCD(t3).toString(), "12x", "same variable");
        strictEqual(t4.getGCD(t5).toString(), "3", "different variable");
        start();
    });

    asyncTest("term regex", 8, function() {
        checkRegex(t1.regex(), "4", true, "right answer is right");
        checkRegex(t1.regex(), "-4", false, "wrong answer is wrong");
        checkRegex(t1.regex(), "4x", false, "wrong answer is wrong");
        checkRegex(t1.regex(), "  4 ", true, "right answer with spaces is right");
        checkRegex(t1.regex(true), "4", true, "ignore passed in true");
        checkRegex(t3.regex(), "-12x", true, "right answer is right");
        checkRegex(t3.regex(), " 1 2 x ", false, "wrong answer with spaces is wrong");
        checkRegex(t4.regex(), "12x^2", true, "right answer is right");
        start();
    });

    asyncTest("expression to string", 7, function() {
        strictEqual(new KhanUtil.RationalExpression([]).toString(), "0", "empty list");
        strictEqual(new KhanUtil.RationalExpression([0, 0, [0]]).toString(), "0", "lots of zeros");
        strictEqual(e1.toString(), "4", "single digit");
        strictEqual(new KhanUtil.RationalExpression([4, 3]).toString(), "7", "digits combined");
        strictEqual(e2.toString(), "-12x + 4", "term plus digit");
        strictEqual(e3.toString(), "x + 5", "array plus digit");
        strictEqual(e4.toString(), "2x^2y^3 - 12x + 4", "array plus term plus digit");
        start();
    });

    asyncTest("expression to factored string", 6, function() {
        strictEqual(e1.toStringFactored(), "4", "single digit");
        strictEqual(e1.toStringFactored(true), "(4)", "single digit parethesised");
        strictEqual(e2.toStringFactored(), "-4(3x - 1)", "term plus digit");
        strictEqual(e3.toStringFactored(), "x + 5", "non-factorable");
        strictEqual(e3.toStringFactored(true), "(x + 5)", "non-factorable parethesised");
        strictEqual(e4.toStringFactored(), "2(x^2y^3 - 6x + 2)", "array plus term plus digit");
        start();
    });

    asyncTest("get coefficient from expression", 3, function() {
        strictEqual(e3.getCoefficentOfTerm().toString(), "5", "single digit");
        strictEqual(e3.getCoefficentOfTerm('x').toString(), "1", "single digit");
        strictEqual(e3.getCoefficentOfTerm('y').toString(), "0", "single digit");
        start();
    });

    asyncTest("add expressions", 6, function() {
        strictEqual(e2.add(3).toString(), "-12x + 7", "expr plus digit");
        strictEqual(e2.add(t2).toString(), "-11x + 4", "expr plus term");
        strictEqual(e1.add(e1).toString(), "8", "expr digit plus expr digit");
        strictEqual(e2.add(e3).toString(), "-11x + 9", "expr plus expr");
        strictEqual(e3.add(e2).toString(), "-11x + 9", "expr plus expr reversed");
        strictEqual(e2.add(new KhanUtil.RationalExpression([[12, 'x'], -4])).toString(), "0", "cancel expr");
        start();
    });

    asyncTest("multiply expression", 4, function() {
        strictEqual(e4.multiply(3).toString(), "6x^2y^3 - 36x + 12", "expr by digit");
        strictEqual(e2.multiply(t3).toString(), "144x^2 - 48x", "expr by term");
        strictEqual(e2.multiply(t5).toString(), "-36xy + 12y", "expr by term diff variable");
        strictEqual(e2.multiply(e4).toString(), "-24x^3y^3 + 8x^2y^3 + 144x^2 - 96x + 16", "expr by expr");
        start();
    });

    asyncTest("divide expression", 7, function() {
        strictEqual(e4.divide(2).toString(), "x^2y^3 - 6x + 2", "expr by digit");
        strictEqual(e2.divide(t1).toString(), "-3x + 1", "expr by term digit");
        strictEqual(e4.divide(t2).toString(), "2xy^3 - 12 + 4x^-1", "expr by term");
        strictEqual(e2.divide(new KhanUtil.RationalExpression([[2]])).toString(), "-6x + 2", "expr by one-term expr");
        strictEqual(e2.divide(new KhanUtil.RationalExpression([[3, 'x'], -1])).toString(), "-4", "expr by expr");
        strictEqual(e2.divide(new KhanUtil.RationalExpression([[-6, 'x'], 2])).toString(), "2", "expr by expr different factor");
        strictEqual(e2.divide(new KhanUtil.RationalExpression([[3, 'x'], 1])), false, "expr by expr doesn't go");
        start();
    });

    asyncTest("expression term GCD", 3, function() {
        strictEqual(e1.getTermsGCD().toString(), "4", "single digit");
        strictEqual(e4.getTermsGCD().toString(), "2", "digit factor");
        strictEqual(e5.getTermsGCD().toString(), "2x", "term factor");
        start();
    });

    asyncTest("expression GCD", 3, function() {
        strictEqual(e1.getGCD(e2).toString(), "4", "expr digit and expr term");
        strictEqual(e4.getGCD(e5).toString(), "2", "expr and expr");
        strictEqual(e5.getGCD(new KhanUtil.RationalExpression([t3])).toString(), "2x", "expr and expr variable");
        start();
    });

    asyncTest("is negative", 4, function() {
        strictEqual(t3.isNegative(), true, "term is negative");
        strictEqual(t4.isNegative(), false, "term is not negative");
        strictEqual(e2.isNegative(), true, "expression is negative");
        strictEqual(e4.isNegative(), false, "expression is not negative");
        start();
    });

    asyncTest("coefficient of term", 4, function() {
        strictEqual(e3.getCoefficentOfTerm('x'), 1, "coefficient of positive term");
        strictEqual(e4.getCoefficentOfTerm('x'), -12, "coefficient of negative term");
        strictEqual(e4.getCoefficentOfTerm('x2'), 0, "coefficient of non-existant term");
        strictEqual(e5.getCoefficentOfTerm('x2y3'), 0, "coefficient of multi-variable term");
        start();
    });

    asyncTest("evaluation expression", 4, function() {
        strictEqual(e1.evaluate(3), 4, "constant expression");
        strictEqual(e2.evaluate(3), -32, "evaluate positive");
        strictEqual(e3.evaluate(-3), 2, "evaluate negative");
        strictEqual(e4.evaluate({x: 3, y: 2}), 112, "evaluate multiple");
        start();
    });

    asyncTest("expression regex", 14, function() {
        checkRegex(e1.regex(), "4", true, "digit right answer is right");
        checkRegex(e1.regex(), "-4", false, "digit wrong answer is wrong");
        checkRegex(e1.regex(), "  4 ", true, "digit right answer with spaces is right");
        checkRegex(e2.regex(), "-12x+4", true, "right answer is right");
        checkRegex(e2.regex(), " - 12x + 4  ", true, "right answer with spaces is right");
        checkRegex(e2.regex(), "-12 x + 4", false, "space after coefficient is wrong (?)");
        checkRegex(e2.regex(), "4-12x", true, "reversed is right");
        checkRegex(e2.regex(), "(-12x+4)", false, "right answer parenthesised is wrong (?)");
        checkRegex(e2.regex(true), "4(-3x+1)", true, "factored positive is right");
        checkRegex(e2.regex(true), "-4(3x-1)", true, "factored negative is right");
        checkRegex(e2.regex(true), "(-3x+1)4", false, "factor following is wrong");
        checkRegex(e2.regex(true), "4(1-3x)", true, "factored reversed is right");
        checkRegex(e3.regex(true), "x + 5", true, "coefficient of one ignored is right");
        checkRegex(e3.regex(true), "1x + 5", false, "coefficient of one included is wrong (?)");
        start();
    });

    asyncTest("trinomal expression regex", 8, function() {
        checkRegex(e4.regex(), "2x^2y^3 - 12x + 4", true, "right answer ABC is right");
        checkRegex(e4.regex(), "2x^2y^3 + 4 - 12x", true, "right answer ACB is right");
        checkRegex(e4.regex(), "-12x + 2x^2y^3 + 4", true, "right answer BAC is right");
        checkRegex(e4.regex(), "-12x + 4 + 2x^2y^3", true, "right answer BCA is right");
        checkRegex(e4.regex(), "4 + 2x^2y^3 - 12x", true, "right answer CAB is right");
        checkRegex(e4.regex(), "4 - 12x + 2x^2y^3", true, "right answer CBA is right");
        checkRegex(e4.regex(true), "2(x^2y^3 - 6x + 2)", true, "right answer variables factored is right");
        checkRegex(e4.regex(), "2y^3x^2 - 12x + 4", true, "right answer variables reversed is right");
        start();
    });

    asyncTest("isEqual", 2, function() {
        strictEqual(e1.isEqualTo(new KhanUtil.RationalExpression([4])), true, "single digit equal to single digit");
        strictEqual(e2.isEqualTo(e1.add(t3)), true, "expression equal to sum of terms");
        start();
    });

})();
