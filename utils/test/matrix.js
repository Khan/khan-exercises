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

    testMatrixTranspose([[1],[2],[3,4]], "ill-formatted");
    testMatrixTranspose([[1], [2], [3], [4]]);

    testMatrixTranspose([[1, 2], [3, 4], [5, 6]]);
    testMatrixTranspose([[1, 2, 3], [4, 5, 6]]);
    testMatrixTranspose([[1, 2, 3], [4, 5, 6], [7, 8, 9]]);
});

})();