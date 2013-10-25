module("matrix");

(function() {

    test("matrix transpose", function() {
        function checkMatrixTranspose(fromMatrix, toMatrix) {
            var message = 'from ' + fromMatrix.length + 'x' + fromMatrix[0].length + 
                ' to ' + toMatrix.length + 'x' + toMatrix[0].length;

            deepEqual(KhanUtil.matrixTranspose(fromMatrix), toMatrix, message);
        }

        checkMatrixTranspose([[1, 2, 3, 4]], [[1], [2], [3], [4]]);
        checkMatrixTranspose([[1, 2],[3, 4]], [[1, 3], [2, 4]]);
        checkMatrixTranspose([[1], [2], [3], [4]], [[1, 2, 3, 4]]);
        checkMatrixTranspose([[1, 2], [3, 4], [5, 6]], [[1, 3, 5], [2, 4, 6]]);
        checkMatrixTranspose([[1, 2, 3], [4, 5, 6]], [[1, 4], [2, 5], [3, 6]]);
        checkMatrixTranspose([[1, 2, 3], [4, 5, 6], [7, 8, 9]], [[1, 4, 7], [2, 5, 8], [3, 6, 9]]);
    });

    test('matrix multiplication', function() {
        var result = KhanUtil.matrixMult([[3, 2, 1], [1, 0, 2]], [[1, 2], [0, 1], [4, 0]]);
        deepEqual(result, [[7, 8], [9, 2]]);
    });

    test('matrix 2x2 determinant', function() {
        var result = KhanUtil.matrixDet([[2, 3], [4, 5]]);
        strictEqual(result, -2);
    });

    test('matrix 3x3 determinant', function() {
        var result = KhanUtil.matrixDet([[0, 1, 2], [3, 2, 1], [1, 1, 0]]);
        strictEqual(result, 3);
    });

    test('adjugate matrix 2x2', function() {
        var result = KhanUtil.matrixAdj([[1, 2], [3, 4]]);
        deepEqual(result, [[4, -2], [-3, 1]]);
    });

    test('adjugate matrix 3x3', function() {
        var result = KhanUtil.matrixAdj([[1, 2, 3], [4, 5, 6], [7, 8, 9]]);
        deepEqual(result, [[-3, 6, -3], [6, -12, 6], [-3, 6, -3]]);
    });

    test('inverse matrix 3x3', function() {
        var result = KhanUtil.matrixInverse([[1, 2, 0], [2, 3, 0], [3, 4, 1]]);
        deepEqual(result, [[-3, 2, 0], [2, -1, 0], [1, -2, 1]]);
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
        strictEqual(result, 3 + 8);
    });

    test('vectorDot should take the dot product of 2 3D vectors', function() {
        var result = KhanUtil.vectorDot([1, 2, 3], [4, 5, 6]);
        strictEqual(result, 4 + 10 + 18);
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
        strictEqual(result, 5);
    });

    test('vectorLength should take the length of a 3D vector', function() {
        var result = KhanUtil.vectorLength([4, 0, 3]);
        strictEqual(result, 5);
    });

})();
