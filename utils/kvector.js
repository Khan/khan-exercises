/*
 * Vector Utils 
 * A vector is an array of numbers e.g. [0, 3, 4].
 */

(function(KhanUtil) {

var knumber = KhanUtil.knumber;
$.fn["kvectorLoad"] = function() {
    knumber = KhanUtil.knumber;
};

function arraySum(array) {
    return _.reduce(array, function(memo, arg) { return memo + arg; }, 0);
}

function arrayProduct(array) {
    return _.reduce(array, function(memo, arg) { return memo * arg; }, 1);
}

var kvector = KhanUtil.kvector = {

    // Normalize to a unit vector
    normalize: function(v) {
        return kvector.scale(v, 1 / kvector.length(v));
    },

    // Length/magnitude of a vector
    length: function(v) {
        return Math.sqrt(kvector.dot(v, v));
    },

    // Dot product of two vectors
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

    negate: function(v) {
        return _.map(v, function(x) {
            return -x;
        });
    },

    // Scale a vector
    scale: function(v1, scalar) {
        return _.map(v1, function(x) {
            return x * scalar;
        });
    },

    equal: function(v1, v2, tolerance) {
        return _.all(_.zip(v1, v2), function(pair) {
            return knumber.equal.call(knumber, pair[0], pair[1], tolerance);
        });
    },

    collinear: function(v1, v2, tolerance) {
        // The origin is trivially collinear with all other vectors.
        // This gives nice semantics for collinearity between points when
        // comparing their difference vectors.
        if (knumber.equal(kvector.length(v1), 0, tolerance) ||
                knumber.equal(kvector.length(v2), 0, tolerance)) {
            return true;
        }

        v1 = kvector.normalize(v1);
        v2 = kvector.normalize(v2);

        return kvector.equal(v1, v2, tolerance) ||
                kvector.equal(v1, kvector.negate(v2), tolerance);
    },

    // Convert a cartesian coordinate into a radian polar coordinate
    polarRadFromCart: function(v) {
        var radius = kvector.length(v);
        var theta = Math.atan2(v[1], v[0]);

        // Convert angle range from [-pi, pi] to [0, 2pi]
        if (theta < 0) {
            theta += 2 * Math.PI;
        }

        return [radius, theta];
    },

    // Converts a cartesian coordinate into a degree polar coordinate
    polarDegFromCart: function(v) {
        var polar = kvector.polarRadFromCart(v);
        return [polar[0], polar[1] * 180 / Math.PI];
    },

    /* Convert a polar coordinate into a cartesian coordinate
     *
     * Examples:
     * cartFromPolarRad(5, Math.PI)
     * cartFromPolarRad([5, Math.PI])
     */
    cartFromPolarRad: function(radius, theta) {
        if (_.isUndefined(theta)) {
            theta = radius[1];
            radius = radius[0];
        }

        return [radius * Math.cos(theta), radius * Math.sin(theta)];
    },

    /* Convert a polar coordinate into a cartesian coordinate
     *
     * Examples:
     * cartFromPolarDeg(5, 30)
     * cartFromPolarDeg([5, 30])
     */
    cartFromPolarDeg: function(radius, theta) {
        if (_.isUndefined(theta)) {
            theta = radius[1];
            radius = radius[0];
        }

        return kvector.cartFromPolarRad(radius, theta * Math.PI / 180);
    },

    // Rotate vector
    rotateRad: function(v, theta) {
        var polar = kvector.polarRadFromCart(v);
        var angle = polar[1] + theta;
        return kvector.cartFromPolarRad(polar[0], angle);
    },

    rotateDeg: function(v, theta) {
        var polar = kvector.polarDegFromCart(v);
        var angle = polar[1] + theta;
        return kvector.cartFromPolarDeg(polar[0], angle);
    },

    // Angle between two vectors
    angleRad: function(v1, v2) {
        return Math.acos(kvector.dot(v1, v2) /
            (kvector.length(v1) * kvector.length(v2)));
    },

    angleDeg: function(v1, v2) {
        return kvector.angleRad(v1, v2) * 180 / Math.PI;
    },

    // Vector projection of v1 onto v2
    projection: function(v1, v2) {
        var scalar = kvector.dot(v1, v2) / kvector.dot(v2, v2);
        return kvector.scale(v2, scalar);
    }
};

})(KhanUtil);
