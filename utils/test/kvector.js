module("kvector");

(function() {

    var vector = KhanUtil.kvector;

    test('vector.add should add two 2D vectors', function() {
        var result = vector.add([1, 2], [3, 4]);
        deepEqual(result, [4, 6]);
    });

    test('vector.add should add two 3D vectors', function() {
        var result = vector.add([1, 2, 3], [4, 5, 6]);
        deepEqual(result, [5, 7, 9]);
    });

    test('vector.add should add three 2D vectors', function() {
        var result = vector.add([1, 2], [3, 4], [5, 6]);
        deepEqual(result, [9, 12]);
    });

    test('vector.subtract should subtract two 2D vectors', function() {
        var result = vector.subtract([1, 2], [3, 4]);
        deepEqual(result, [-2, -2]);
    });

    test('vector.subtract should subtract two 3D vectors', function() {
        var result = vector.subtract([1, 2, 3], [4, 5, 6]);
        deepEqual(result, [-3, -3, -3]);
    });

    test('vector.dot should take the dot product of 2 2D vectors', function() {
        var result = vector.dot([1, 2], [3, 4]);
        strictEqual(result, 3 + 8);
    });

    test('vector.dot should take the dot product of 2 3D vectors', function() {
        var result = vector.dot([1, 2, 3], [4, 5, 6]);
        strictEqual(result, 4 + 10 + 18);
    });

    test('vector.scale should scale a 2D vector', function() {
        var result = vector.scale([4, 2], 0.5);
        deepEqual(result, [2, 1]);
    });

    test('vector.scale should scale a 3D vector', function() {
        var result = vector.scale([1, 2, 3], 2);
        deepEqual(result, [2, 4, 6]);
    });

    test('vector.length should take the length of a 2D vector', function() {
        var result = vector.length([3, 4]);
        strictEqual(result, 5);
    });

    test('vector.length should take the length of a 3D vector', function() {
        var result = vector.length([4, 0, 3]);
        strictEqual(result, 5);
    });

})();
