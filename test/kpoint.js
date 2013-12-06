(function() {
    module("kpoint");

    var point = KhanUtil.kpoint;

    asyncTest('point.compare should return positive if the first element is larger', 1, function() {
        var result = point.compare([5, 2], [3, 4]);
        strictEqual(result > 0, true);
        start();
    });

    asyncTest('point.compare should return negative if the first element is smaller', 1, function() {
        var result = point.compare([2, 2], [4, 0]);
        strictEqual(result < 0, true);
        start();
    });

    asyncTest('point.compare should return positive if the second element is larger', 1, function() {
        var result = point.compare([5, 2], [5, 1]);
        strictEqual(result > 0, true);
        start();
    });

    asyncTest('point.compare should return negative if the second element is smaller', 1, function() {
        var result = point.compare([2, 2], [2, 4]);
        strictEqual(result < 0, true);
        start();
    });

    asyncTest('point.compare should return positive if the third element is larger', 1, function() {
        var result = point.compare([5, 3, -2], [5, 3, -4]);
        strictEqual(result > 0, true);
        start();
    });

    asyncTest('point.compare should return negative if the third element is smaller', 1, function() {
        var result = point.compare([2, -1, -4], [2, -1, -2]);
        strictEqual(result < 0, true);
        start();
    });

    asyncTest('point.compare should return 0 if the vectors are equal', 1, function() {
        var result = point.compare([2, 4, 3], [2, 4, 3]);
        strictEqual(result, 0);
        start();
    });

    asyncTest('point.compare should return negative if v1 is shorter than v2', 1, function() {
        var result = point.compare([2, 4], [2, 4, 3]);
        strictEqual(result < 0, true);
        start();
    });

    asyncTest('point.compare should return positive if v1 is longer than v2', 1, function() {
        var result = point.compare([2, 4, -2], [2, 2]);
        strictEqual(result > 0, true);
        start();
    });

})();
