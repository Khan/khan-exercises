(function(KhanUtil) {

function arraySum(array) {
    return _.reduce(array, function(memo, arg) { return memo + arg; }, 0);
}

function arrayProduct(array) {
    return _.reduce(array, function(memo, arg) { return memo * arg; }, 1);
}

var kvector = KhanUtil.kvector = {

    // find the length of a vector
    length: function(v) {
        return Math.sqrt(kvector.dot(v, v));
    },

    // find the dot-product of two vectors
    dot: function(a, b) {
        var vecs = _.toArray(arguments);
        var zipped = _.zip.apply(_, vecs);
        var multiplied = _.map(zipped, arrayProduct);
        return arraySum(multiplied);
    },

    /* vector-add multiple [x, y] coords/vectors
     *
     * kvector.add([1, 2], [3, 4]) -> [4, 6]
     */
    add: function() {
        var points = _.toArray(arguments);
        var zipped = _.zip.apply(_, points);
        return _.map(zipped, arraySum);
    },

    subtract: function(v1, v2) {
        return _.map(_.zip(v1, v2), function(dim) {
            return dim[0] - dim[1];
        });
    },

    scale: function(v1, scalar) {
        return _.map(v1, function(x) {
            return x * scalar;
        });
    }
};

})(KhanUtil);
