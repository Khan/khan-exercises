(function() {
    module("kray");

    var ray = KhanUtil.kray;

    asyncTest('two identical rays should be equal', 1, function() {
        var result = ray.equal([[0, 0], [1, 0]], [[0, 0], [2, 0]]);
        strictEqual(result, true);
        start();
    });

    asyncTest('two rays with different directions should not be equal', 1, function() {
        var result = ray.equal([[0, 0], [1, 0]], [[0, 0], [0, 1]]);
        strictEqual(result, false);
        start();
    });

    asyncTest('two parallel rays should not be equal', 1, function() {
        var result = ray.equal([[0, 0], [1, 0]], [[0, 1], [1, 1]]);
        strictEqual(result, false);
        start();
    });

    asyncTest('two rays with different endpoint should not be equal', 1, function() {
        var result = ray.equal([[0, 0], [2, 0]], [[1, 0], [2, 0]]);
        strictEqual(result, false);
        start();
    });

})();
