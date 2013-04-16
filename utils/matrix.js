$.extend(KhanUtil, {
    // To add two 2-dimensional matrices, use
    //     deepZipWith(2, function(a, b) { return a + b; }, matrixA, matrixB);
    deepZipWith: function(depth, fn) {
        var arrays = [].slice.call(arguments, 2);

        // if any of the "array" arguments to deepZipWith are null, return null
        var hasNullValue = _.any(arrays, function(array) {
            if (array === null) {
                return true;
            }
        });
        if (hasNullValue) {
            return null;
        }

        if (depth === 0) {
            return fn.apply(null, arrays);
        } else {
            return _.map(_.zip.apply(_, arrays), function(els) {
                return KhanUtil.deepZipWith.apply(this, [depth - 1, fn].concat(els));
            });
        }
    },

    matrixCopy: function(mat) {
        return $.extend(true, [], mat);
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

        if (!mat) {
            return null;
        }

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
     * Prints matrix as determinant, like |matrix| rather than [matrix]
     */
    printSimpleMatrixDet: function(mat, color) {
        return KhanUtil.printSimpleMatrix(mat,color)
                .replace("left[","left|")
                .replace("right]","right|");
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
    makeMatrix: function(mat) {
        mat.r = mat.length;
        mat.c = mat[0].length;

        return mat;
    },

    // remove specified row and column from the matrix
    cropMatrix: function(mat, rowIndex, colIndex) {
        var cropped = KhanUtil.matrixCopy(mat);
        cropped.splice(rowIndex, 1);
        _.each(cropped, function(row) {
            row.splice(colIndex, 1);
        });
        return cropped;
    },

    matrix2x2DetHint: function(mat) {
        // if terms in the matrix are letters, omit the dot
        var operator = (typeof mat[0][0] === "string") ? "*" : "dot";
        var termA = [operator, mat[0][0], mat[1][1]];
        var termB = [operator, mat[0][1], mat[1][0]];
        return KhanUtil.expr(["-", termA, termB]);
    },

    matrix3x3DetHint: function(mat, isIntermediate) {
        var tex = "";

        // iterate over columns
        _.times(mat.c, function(j) {
            var hintMat = KhanUtil.cropMatrix(mat, 0, j);

            var sign = j % 2 ? "-" : "+";
            sign = j === 0 ? "" : sign;

            var multiplier = mat[0][j];

            var term;
            if (isIntermediate) {
                term = KhanUtil.printSimpleMatrixDet(hintMat);
            } else {
                term = KhanUtil.matrix2x2DetHint(hintMat);
                term = KhanUtil.exprParenthesize(term);
            }

            tex += sign + multiplier + term;
        });

        return tex;
    },

    // multiply two matrices
    matrixMult: function(a, b) {
        a = KhanUtil.makeMatrix(a);
        b = KhanUtil.makeMatrix(b);

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

    /**
     * Makes a matrix of minors
     *
     * @param m {result of makeMatrix} the matrix
     */
    matrixMinors: function(mat) {
        mat = KhanUtil.makeMatrix(mat);
        if (!mat.r || !mat.c) {
            return null;
        }
        var rr = KhanUtil.matrixMap(function(input, row, elem) {
            return KhanUtil.cropMatrix(mat, row, elem);
        }, mat);
        return rr;
    },

    /**
     * Find the transpose of a matrix.
     *
     * @param m {result of makeMatrix} the matrix
     */
     matrixTranspose: function(mat) {
        mat = KhanUtil.makeMatrix(mat);

        var r = mat.c;
        var c = mat.r;

        if (!r || !c) {
            return null;
        }

        var matT = [];

        _.times(r, function(i) {
            var row = [];
            _.times(c, function(j) {
                row.push(mat[j][i]);
            });
            matT.push(row);
        });

        return KhanUtil.makeMatrix(matT);
     },

    /**
     * Find the determinant of a matrix.
     *
     * Note: Only works for 2x2 and 3x3 matrices.
     *
     * @param m {result of makeMatrix} the matrix
     */
    matrixDet: function(mat) {
        mat = KhanUtil.makeMatrix(mat);

        // determinant is only defined for a square matrix
        if (mat.r !== mat.c) {
            return null;
        }

        var a, b, c, d, e, f, g, h, k, det;

        // 2x2 case
        // [[a, b], [c, d]]
        if (mat.r === 2) {

            a = mat[0][0];
            b = mat[0][1];
            c = mat[1][0];
            d = mat[1][1];

            det = a*d - b*c;

        // 3x3 case
        // [[a, b, c], [d, e, f], [g, h, k]]
        } else if (mat.r === 3) {

            a = mat[0][0];
            b = mat[0][1];
            c = mat[0][2];
            d = mat[1][0];
            e = mat[1][1];
            f = mat[1][2];
            g = mat[2][0];
            h = mat[2][1];
            k = mat[2][2];

            det = a*(e*k - f*h) - b*(k*d - f*g) + c*(d*h - e*g);
        }

        return det;
    },

    /**
     * Find the adjugate of a matrix.
     *
     * Note: Only works for 2x2 and 3x3 matrices.
     *
     * @param m {result of makeMatrix} the matrix
     */
    matrixAdj: function(mat) {
        mat = KhanUtil.makeMatrix(mat);

        var a, b, c, d, e, f, g, h, k;
        var adj;

        // 2x2 case
        // [[a, b], [c, d]]
        if (mat.r === 2) {

            a = mat[0][0];
            b = mat[0][1];
            c = mat[1][0];
            d = mat[1][1];

            adj = [[d, -b], [-c, a]];

        // 3x3 case
        // [[a, b, c], [d, e, f], [g, h, k]]
        } else if (mat.r === 3) {

            a = mat[0][0];
            b = mat[0][1];
            c = mat[0][2];
            d = mat[1][0];
            e = mat[1][1];
            f = mat[1][2];
            g = mat[2][0];
            h = mat[2][1];
            k = mat[2][2];

            var A =  (e*k - f*h);
            var B = -(d*k - f*g);
            var C =  (d*h - e*g);
            var D = -(b*k - c*h);
            var E =  (a*k - c*g);
            var F = -(a*h - b*g);
            var G =  (b*f - c*e);
            var H = -(a*f - c*d);
            var K =  (a*e - b*d);

            adj = [[A, D, G], [B, E, H], [C, F, K]];
        }

        if (adj) {
            adj = KhanUtil.makeMatrix(adj);
        }

        return adj;
    },

    /**
     * Find the inverse of a matrix.
     *
     * Note: Only works for 2x2 and 3x3 matrices.
     *
     * @param m {result of makeMatrix} the matrix
     * @param precision {int} number of decimal places to round to (optional)
     */
    matrixInverse: function(mat, precision) {
        var det = KhanUtil.matrixDet(mat);

        // if determinant is undefined or 0, inverse does not exist
        if (!det) {
            return null;
        }

        var adj = KhanUtil.matrixAdj(mat);

        if (!adj) {
            return null;
        }

        var inv = KhanUtil.deepZipWith(2, function(val) {
            val = val / det;
            if (precision) {
                val = KhanUtil.roundTo(precision, val);
            }
            return val;
        }, adj);

        inv = KhanUtil.makeMatrix(inv);

        return inv;
    },

    /**
     * Pad (or crop) the given matrix with the given padding value (`padval`)
     * until it is of dimensions `rows` x `cols`
     * @param  {result of makeMatrix} m
     * @param  {int} rows
     * @param  {int} cols
     * @param  {anything} padVal [defaults to "" if not specified]
     * @return {result of makeMatrix}
     */
    matrixPad: function(mat, rows, cols, padVal) {
        if (!mat) {
            return null;
        }

        mat = KhanUtil.makeMatrix(mat);
        matP = KhanUtil.matrixCopy(mat);

        finalCols = Math.max(cols, mat.c);

        if (padVal === undefined) {
            padVal = "";
        }

        // first add padding to the columns
        var dcols = cols - matP.c;
        if (dcols > 0) {
            _.times(matP.r, function(i) {
                _.times(dcols, function() {
                    matP[i].push(padVal);
                });
            });
        }

        // make new rows and fill with padding
        var drows = rows - matP.r;
        if (drows > 0) {
            _.times(drows, function() {
                var row = [];
                _.times(finalCols, function() {
                    row.push(padVal);
                });
                matP.push(row);
            });
        }

        return KhanUtil.makeMatrix(matP);
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