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

})();
