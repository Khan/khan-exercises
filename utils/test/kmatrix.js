module("kmatrix");

(function() {

    var matrix = KhanUtil.kmatrix;

    test("matrix transpose", function() {
        function checkMatrixTranspose(fromMatrix, toMatrix) {
            var message = 'from ' + fromMatrix.length + 'x' + fromMatrix[0].length + 
                ' to ' + toMatrix.length + 'x' + toMatrix[0].length;

            deepEqual(matrix.matrixTranspose(fromMatrix), toMatrix, message);
        }

        checkMatrixTranspose([[1, 2, 3, 4]], [[1], [2], [3], [4]]);
        checkMatrixTranspose([[1, 2],[3, 4]], [[1, 3], [2, 4]]);
        checkMatrixTranspose([[1], [2], [3], [4]], [[1, 2, 3, 4]]);
        checkMatrixTranspose([[1, 2], [3, 4], [5, 6]], [[1, 3, 5], [2, 4, 6]]);
        checkMatrixTranspose([[1, 2, 3], [4, 5, 6]], [[1, 4], [2, 5], [3, 6]]);
        checkMatrixTranspose([[1, 2, 3], [4, 5, 6], [7, 8, 9]], [[1, 4, 7], [2, 5, 8], [3, 6, 9]]);
    });

    test('matrix multiplication', function() {
        var result = matrix.matrixMult([[3, 2, 1], [1, 0, 2]], [[1, 2], [0, 1], [4, 0]]);
        deepEqual(result, [[7, 8], [9, 2]]);
    });

    test('matrix 2x2 determinant', function() {
        var result = matrix.matrixDet([[2, 3], [4, 5]]);
        strictEqual(result, -2);
    });

    test('matrix 3x3 determinant', function() {
        var result = matrix.matrixDet([[0, 1, 2], [3, 2, 1], [1, 1, 0]]);
        strictEqual(result, 3);
    });

    test('adjugate matrix 2x2', function() {
        var result = matrix.matrixAdj([[1, 2], [3, 4]]);
        deepEqual(result, [[4, -2], [-3, 1]]);
    });

    test('adjugate matrix 3x3', function() {
        var result = matrix.matrixAdj([[1, 2, 3], [4, 5, 6], [7, 8, 9]]);
        deepEqual(result, [[-3, 6, -3], [6, -12, 6], [-3, 6, -3]]);
    });

    test('inverse matrix 3x3', function() {
        var result = matrix.matrixInverse([[1, 2, 0], [2, 3, 0], [3, 4, 1]]);
        deepEqual(result, [[-3, 2, 0], [2, -1, 0], [1, -2, 1]]);
    });

})();
