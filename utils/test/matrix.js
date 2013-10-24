module("matrix");

(function() {

    test("matrixTranspose", function() {

        function matrixToString(m) {
            return m.join("; ");
        }

        function testMatrixTranspose(m, text) {

            m = KhanUtil.makeMatrix(m);
            var n = KhanUtil.matrixTranspose(m);
            var d = KhanUtil.matrixTranspose(n);

            var ms = matrixToString(m);
            if (text) {
                ms = ms + ": " + text;
            }

            deepEqual(m, d, ms);
        }

        testMatrixTranspose([[1, 2, 3, 4]]);
        testMatrixTranspose([[1,2],[3,4]]);

        testMatrixTranspose([[1], [2], [3], [4]]);

        testMatrixTranspose([[1, 2], [3, 4], [5, 6]]);
        testMatrixTranspose([[1, 2, 3], [4, 5, 6]]);
        testMatrixTranspose([[1, 2, 3], [4, 5, 6], [7, 8, 9]]);
    });

    test('vectorAdd should add two 2D vectors', function() {
        var result = KhanUtil.vectorAdd([1, 2], [3, 4]);
        deepEqual(result, [4, 6]);
    });

    test('vectorAdd should add two 3D vectors', function() {
        var result = KhanUtil.vectorAdd([1, 2, 3], [4, 5, 6]);
        deepEqual(result, [5, 7, 9]);
    });

    test('vectorAdd should add three 2D vectors', function() {
        var result = KhanUtil.vectorAdd([1, 2], [3, 4], [5, 6]);
        deepEqual(result, [9, 12]);
    });

    test('vectorSubtract should subtract two 2D vectors', function() {
        var result = KhanUtil.vectorSubtract([1, 2], [3, 4]);
        deepEqual(result, [-2, -2]);
    });

    test('vectorSubtract should subtract two 3D vectors', function() {
        var result = KhanUtil.vectorSubtract([1, 2, 3], [4, 5, 6]);
        deepEqual(result, [-3, -3, -3]);
    });

    test('vectorDot should take the dot product of 2 2D vectors', function() {
        var result = KhanUtil.vectorDot([1, 2], [3, 4]);
        equal(result, 3 + 8);
    });

    test('vectorDot should take the dot product of 2 3D vectors', function() {
        var result = KhanUtil.vectorDot([1, 2, 3], [4, 5, 6]);
        equal(result, 4 + 10 + 18);
    });

    test('vectorScale should scale a 2D vector', function() {
        var result = KhanUtil.vectorScale([4, 2], 0.5);
        deepEqual(result, [2, 1]);
    });

    test('vectorScale should scale a 3D vector', function() {
        var result = KhanUtil.vectorScale([1, 2, 3], 2);
        deepEqual(result, [2, 4, 6]);
    });

    test('vectorLength should take the length of a 2D vector', function() {
        var result = KhanUtil.vectorLength([3, 4]);
        equal(result, 5);
    });

    test('vectorLength should take the length of a 3D vector', function() {
        var result = KhanUtil.vectorLength([4, 0, 3]);
        equal(result, 5);
    });

})();
