(function() {
    module("kvector");

    var vector = KhanUtil.kvector;

    asyncTest('vector.add should add two 2D vectors', 1, function() {
        var result = vector.add([1, 2], [3, 4]);
        deepEqual(result, [4, 6]);
        start();
    });

    asyncTest('vector.add should add two 3D vectors', 1, function() {
        var result = vector.add([1, 2, 3], [4, 5, 6]);
        deepEqual(result, [5, 7, 9]);
        start();
    });

    asyncTest('vector.add should add three 2D vectors', 1, function() {
        var result = vector.add([1, 2], [3, 4], [5, 6]);
        deepEqual(result, [9, 12]);
        start();
    });

    asyncTest('vector.subtract should subtract two 2D vectors', 1, function() {
        var result = vector.subtract([1, 2], [3, 4]);
        deepEqual(result, [-2, -2]);
        start();
    });

    asyncTest('vector.subtract should subtract two 3D vectors', 1, function() {
        var result = vector.subtract([1, 2, 3], [4, 5, 6]);
        deepEqual(result, [-3, -3, -3]);
        start();
    });

    asyncTest('vector.dot should take the dot product of 2 2D vectors', 1, function() {
        var result = vector.dot([1, 2], [3, 4]);
        strictEqual(result, 3 + 8);
        start();
    });

    asyncTest('vector.dot should take the dot product of 2 3D vectors', 1, function() {
        var result = vector.dot([1, 2, 3], [4, 5, 6]);
        strictEqual(result, 4 + 10 + 18);
        start();
    });

    asyncTest('vector.scale should scale a 2D vector', 1, function() {
        var result = vector.scale([4, 2], 0.5);
        deepEqual(result, [2, 1]);
        start();
    });

    asyncTest('vector.scale should scale a 3D vector', 1, function() {
        var result = vector.scale([1, 2, 3], 2);
        deepEqual(result, [2, 4, 6]);
        start();
    });

    asyncTest('vector.length should take the length of a 2D vector', 1, function() {
        var result = vector.length([3, 4]);
        strictEqual(result, 5);
        start();
    });

    asyncTest('vector.length should take the length of a 3D vector', 1, function() {
        var result = vector.length([4, 0, 3]);
        strictEqual(result, 5);
        start();
    });

    asyncTest('vector.equal should return true on two equal 3D vectors', 1, function() {
        var result = vector.equal([6, 3, 4], [6, 3, 4]);
        strictEqual(result, true);
        start();
    });

    asyncTest('vector.equal should return false on two inequal 3D vectors', 1, function() {
        var result = vector.equal([6, 3, 4], [6, 4, 4]);
        strictEqual(result, false);
        start();
    });

    asyncTest('vector.equal should return false on a 2D and 3D vector', 1, function() {
        var result = vector.equal([6, 4], [6, 4, 4]);
        strictEqual(result, false);
        start();
    });

    asyncTest('vector.equal should return false on a 2D and 3D vector', 1, function() {
        var result = vector.equal([6, 3, 4], [6, 3]);
        strictEqual(result, false);
        start();
    });

    asyncTest('vector.equal should return false on a 2D and 3D vector with a trailing 0', 1, function() {
        var result = vector.equal([6, 3, 0], [6, 3]);
        strictEqual(result, false);
        start();
    });

    asyncTest("vector.collinear should return true on two collinear vectors of "
            + "the same magnitude but different direction", 1, function() {
        var result = vector.collinear([3, 3], [-3, -3]);
        strictEqual(result, true);
        start();
    });

    asyncTest("vector.collinear should return true on two collinear vectors of "
            + "different magnitudes", 1, function() {
        var result = vector.collinear([2, 1], [6, 3]);
        strictEqual(result, true);
        start();
    });

    asyncTest("vector.collinear should return false on non-collinear vectors",
            1, function() {
        var result = vector.collinear([1, 2], [-1, 2]);
        strictEqual(result, false);
        start();
    });

    asyncTest("vector.negate of [-2, 2] is [2, -2]", 1, function() {
        var result = vector.negate([-2, 2]);
        deepEqual(result, [2, -2]);
        start();
    });

})();
