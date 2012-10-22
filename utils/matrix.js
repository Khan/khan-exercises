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
     * Apply the given function to each element of the given matrix and return
     * the resulting matrix.
     */
    matrixMap: function(fn, mat) {
        return _.map(mat, function(row, i) {
            return _.map(row, function(elem, j) {
                return fn(elem, i, j);
            });
        });
    },

    /**
     * Given a matrix and list of row-col indices to exclude from masking,
     * return a new matrix with all but the elements in excludeList overwritten
     * by the value "?".
     *
     * @param mat {result of makeMatrix}
     * @param excludeList {array of arrays} List of row-col indices to keep
     *          from being overwritten. Note that these indices start at 1, not
     *          0, to match with common math notation.
     */
    maskMatrix: function(mat, excludeList) {
        var result = [];

        _.times(mat.r, function(i) {
            var row = [];
            _.times(mat.c, function(j) {
                if (KhanUtil.contains(excludeList, [i+1, j+1])) {
                    row.push(mat[i][j]);
                } else {
                    row.push("?");
                }
            });
            result.push(row);
        });
        return result;
    },

    /**
     * Given one or more same-dimension 2d matrices and a function for
     * how to combine and format their elements in the output matrix,
     * return the LaTeX code for rendering the matrix. Inherits syntax from
     * deepZipWith().
     *
     * Example usage:
     *
     * printMatrix(function(a, b) {
     *  return colorMarkup(a, "#FF0000") + "-" + colorMarkup(b, "#00FF00");
     * }, matA, matB);
     *
     */
    printMatrix: function(fn) {
        var args = Array.prototype.slice.call(arguments);
        mat = KhanUtil.deepZipWith.apply(this, [2].concat(args));

        var table = _.map(mat, function(row, i) {
                        return row.join(" & ");
                    }).join(" \\\\ ");

        var prefix = "\\left[\\begin{array}";
        var suffix = "\\end{array}\\right]";

        // to generate the alignment info needed for LaTeX table markup
        var alignment = "{";
        var cols = mat[0].length;
        _(cols).times(function (){
            alignment += "r";
        });
        alignment += "}";

        return prefix + alignment + table + suffix;
    },

    /**
     * Given a matrix and a color, format all elements with the given color
     * (if supplied) and return the LaTeX code for rendering the matrix.
     *
     * @param mat {array of arrays} the matrix to format
     * @param color {string}
     */
    printSimpleMatrix: function(mat, color) {
        return KhanUtil.printMatrix(function(item) {
            if (color) {
                return KhanUtil.colorMarkup(item, color);
            }
            return item;
        }, mat);
    },

    /**
     * Format the rows or columns of the given matrix with the colors in the
     * given colors array, and return the LaTeX code for rendering the matrix.
     *
     * @param mat {array of arrays} the matrix to format
     * @param colors {array of strings} list of colors
     * @param isRow {bool} whether to apply the colors by row or by column
     */
    printColoredDimMatrix: function(mat, colors, isRow) {
        var matrix = KhanUtil.matrixMap(function(item, i, j) {
            var color = colors[isRow ? i : j];
            return KhanUtil.colorMarkup(item, color);
        }, mat);
        return KhanUtil.printSimpleMatrix(matrix);
    },

    /**
     * Generate markup for a color-coded matrix illustrating the calculations
     * behind each element in matrix multiplication.
     *
     * @param a {result of makeMatrix} the first matrix
     * @param b {result of makeMatrix} the second matrix
     * @param rowColors {array of strings} list of colors to apply to the
     *                                     rows of the first matrix
     * @param colColors {array of strings} list of colors to apply to the
     *                                     columns of the second matrix
     */
    makeMultHintMatrix: function(a, b, rowColors, colColors) {
        var c = [];
        // create the new matrix
        _.times(a.r, function() {
            c.push([]);
        });

        // perform the multiply
        _.times(a.r, function(i) {
            var c1 = rowColors[i];
            _.times(b.c, function(j) {
                var c2 = colColors[j];
                var temp = "";
                _.times(a.c, function(k) {
                    if (k > 0) {
                        temp += "+";
                    }
                    var elem1 = KhanUtil.colorMarkup(a[i][k], c1);
                    var elem2 = KhanUtil.colorMarkup(b[k][j], c2);
                    temp += elem1 + "\\cdot" + elem2;
                });
                c[i][j] = temp;
            });
        });

        return KhanUtil.makeMatrix(c);
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
        _.times(a.r, function() {
            c.push([]);
        });

        // perform the multiply
        _.times(a.r, function(i) {
            _.times(b.c, function(j) {
                var temp = 0;
                _.times(a.c, function(k) {
                    temp += a[i][k] * b[k][j];
                });
                c[i][j] = temp;
            });
        });

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
