$.extend(KhanUtil, {
    // To add two 2-dimensional matrices, use
    //     deepZipWith(2, function(a, b) { return a + b; }, matrixA, matrixB);
    deepZipWith: function deepZipWith(depth, fn) {
        var arrays = [].slice.call(arguments, 2);

        if (depth === 0) {
            return fn.apply(null, arrays);
        } else {
            return _.map(_.zip.apply(_, arrays), function(els) {
                return deepZipWith.apply(this, [depth - 1, fn].concat(els));
            });
        }
    },

    // add matrix properties to a 2d matrix
    //   currently only rows and columns
    makeMatrix: function(m) {
        m.r = m.length;
        m.c = m[0].length;

        return m;
    },

    // multiply two matrices
    matrixMult: function(a, b) {
        var c = [];
        // create the new matrix
        for (var i = 0; i < a.r; ++i) {
            c.push([]);
        }

        // perform the multiply
        for (var i = 0; i < a.r; ++i) {
            for (var j = 0; j < b.c; ++j) {
                var temp = 0;
                for (var k = 0; k < a.c; ++k) {
                    temp += a[i][k] * b[k][j];
                }
                c[i][j] = temp;
            }
        }

        // add matrix properties to the result
        return KhanUtil.makeMatrix(c);
    },

    // convert an array to a column matrix
    arrayToColumn: function(arr) {
        var col = [];

        _.each(arr, function(e) {
            col.push([e]);
        });

        return KhanUtil.makeMatrix(col);
    },

    // convert a column matrix to an array
    columnToArray: function(col) {
        var arr = [];

        _.each(col, function(e) {
            arr.push(e[0]);
        });

        return arr;
    },

    // find the length of a 3d vector
    vectorLength: function(v) {
        return Math.sqrt(v[0] * v[0] +
                         v[1] * v[1] +
                         v[2] * v[2]);
    },

    // find the dot-product of two 3d vectors
    vectorDot: function(a, b) {
        return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
    }
});
