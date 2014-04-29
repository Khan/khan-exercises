(function() {
    module("kline");

    var line = KhanUtil.kline;

    asyncTest('two identical lines should be equal', 1, function() {
        var result = line.equal([[1, 1], [3, 3]], [[1, 1], [3, 3]]);
        strictEqual(result, true);
        start();
    });

    asyncTest('two parallel lines should not be equal', 1, function() {
        var result = line.equal([[1, 1], [3, 3]], [[1, 2], [3, 4]]);
        strictEqual(result, false);
        start();
    });

    asyncTest('two intersecting lines should not be equal', 1, function() {
        var result = line.equal([[1, 1], [3, 3]], [[1, 1], [3, 4]]);
        strictEqual(result, false);
        start();
    });

    asyncTest('two collinear lines should be equal #1', 1, function() {
        var result = line.equal([[1, 1], [3, 3]], [[0, 0], [5, 5]]);
        strictEqual(result, true);
        start();
    });

    asyncTest('two collinear lines should be equal #2', 1, function() {
        var result = line.equal([[4, 4], [5, 5]], [[0, 0], [1, 1]]);
        strictEqual(result, true);
        start();
    });

    asyncTest('two collinear lines should be equal #3', 1, function() {
        var result = line.equal([[0, 0], [1, 1]], [[3, 3], [6, 6]]);
        strictEqual(result, true);
        start();
    });

    asyncTest('Two line segments that do not inersect and are not collinear, not equal', 1, function() {
        var result = line.equal([[3, 4], [5, 11]], [[5, 6], [9, 5]]);
        strictEqual(result, false);
        start();
    });

})();
