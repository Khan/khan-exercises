(function() {
    module("knumber");

    var number = KhanUtil.knumber;

    asyncTest('two equal numbers should be equal', 1, function() {
        var result = number.equal(1 / 3, 1 / 90 * 30);
        strictEqual(result, true);
        start();
    });

    asyncTest('two different numbers should be equal', 1, function() {
        var result = number.equal(1 / 3, 1.333333);
        strictEqual(result, false);
        start();
    });

    asyncTest('sign(0) should be 0', 1, function() {
        strictEqual(number.sign(0), 0);
        start();
    });

    asyncTest('sign(-0.0) should be 0', 1, function() {
        strictEqual(number.sign(-0.0), 0);
        start();
    });

    asyncTest('sign(3.2) should be 1', 1, function() {
        strictEqual(number.sign(3.2), 1);
        start();
    });

    asyncTest('sign(-2.8) should be -1', 1, function() {
        strictEqual(number.sign(-2.8), -1);
        start();
    });

    asyncTest('isInteger(-2.8) should be false', 1, function() {
        strictEqual(number.isInteger(-2.8), false);
        start();
    });

    asyncTest('isInteger(-2) should be true', 1, function() {
        strictEqual(number.isInteger(-2), true);
        start();
    });

    asyncTest('toFraction(-2) should be -2/1', 1, function() {
        deepEqual(number.toFraction(-2), [-2, 1]);
        start();
    });

    asyncTest('toFraction(-2.5) should be -5/2', 1, function() {
        deepEqual(number.toFraction(-2.5), [-5, 2]);
        start();
    });

    asyncTest('toFraction(2/3) should be 2/3', 1, function() {
        deepEqual(number.toFraction(2/3), [2, 3]);
        start();
    });

    asyncTest('toFraction(283.33...) should be 850/3', 1, function() {
        deepEqual(number.toFraction(283 + 1/3), [850, 3]);
        start();
    });

    asyncTest('toFraction(0) should be 0/1', 1, function() {
        deepEqual(number.toFraction(0), [0, 1]);
        start();
    });

    asyncTest('toFraction(pi) should be pi/1', 1, function() {
        deepEqual(number.toFraction(Math.PI), [Math.PI, 1]);
        start();
    });

    asyncTest('toFraction(0.66) should be 33/50', 1, function() {
        deepEqual(number.toFraction(0.66), [33, 50]);
        start();
    });

    asyncTest('toFraction(0.66, 0.01) should be 2/3', 1, function() {
        deepEqual(number.toFraction(0.66, 0.01), [2, 3]);
        start();
    });

})();
