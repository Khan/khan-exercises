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

    /**
     * Given a 2d matrix, return the LaTeX (MathJax) code for printing
     * the matrix.
     *
     * If optional parameters mat2, color2, and operation are included, this
     * can be used to generate intermediate hint matrices as in
     * matrix_addition.html.
     *
     * @param mat {array} a 2d matrix
     *      ex: [[0, 2], [1, 3], [4, 5]] (3 x 2 matrix)
     * @param color {string} (optional) color to format the elements of /mat/,
            in hexadecimal. ex: "#28AE7B" (KhanUtil.GREEN)
     * @param mat2 {array} (optional) a 2d matrix w/ same dimensions as /mat/
     * @param color2 {string} (optional) color to format the elements of /mat2/
     * @param operation {string} (optional) operation being explained in hints
     *      ex: "+"
     */
    printMatrix: function(mat, color, mat2, color2, operation) {
        // return prematurely if no matrix included
        if (!_.isArray(mat) || !mat.length) {
            return "";
        }

        var isCombo = (_.isArray(mat2) && mat2.length === mat.length &&
                        mat2[0].length === mat[0].length &&
                        _.isString(color2) && _.isString(operation));

        var table = _.map(mat, function(row, i) {
            if (isCombo) {
                row = _.map(row, function(elem, j) {
                    var elem1 = "\\color{" + color + "}{" + elem + "}";
                    var elem2 = "\\color{" + color2 + "}{" + mat2[i][j] + "}";
                    return elem1 + operation + elem2;
                });
            }
            return row.join(" & ");
        }).join(" \\\\ ");

        var prefix = "\\left[ \\begin{array}";
        var suffix = "\\end{array} \\right]";

        if (!isCombo && color) {
            prefix = "\\left[ \\color{" + color + "}{\\begin{array}";
            suffix = "\\end{array}} \\right]";
        }

        // to generate the alignment info needed for LaTeX table markup
        var alignment = "{";
        var cols = mat[0].length;
        _(cols).times(function (){
            alignment += "r";
        });
        alignment += "}";

        return prefix + alignment + table + suffix;
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
