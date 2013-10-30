/*
 * Vector Utils 
 * A vector is an array of numbers e.g. [0, 3, 4].
 */

(function(KhanUtil) {

function arraySum(array) {
    return _.reduce(array, function(memo, arg) { return memo + arg; }, 0);
}

function arrayProduct(array) {
    return _.reduce(array, function(memo, arg) { return memo * arg; }, 1);
}

var kvector = KhanUtil.kvector = {

    // Length/magnitude of a vector
    length: function(v) {
        return Math.sqrt(kvector.dot(v, v));
    },

    // Normalize to a unit vector
    normalize: function(v) {
        return kvector.scale(v, 1 / kvector.length(v));
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

    // Scale a vector
    scale: function(v1, scalar) {
        return _.map(v1, function(x) {
            return x * scalar;
        });
    },

    // Convert from cartesian to polar and back
    polarRadFromCart: function(v) {
        var radius = kvector.length(v);
        var theta = Math.atan2(v[1], v[0]);

        // Convert angle range from [-pi, pi] to [0, 2pi]
        if (theta < 0) {
            theta += 2 * Math.PI;
        }

        return [radius, theta];
    },

    polarDegFromCart: function(v) {
        var polar = kvector.polarRadFromCart(v);
        return [polar[0], polar[1] * 180 / Math.PI];
    },

    cartFromPolarRad: function(radius, theta) {
        if (_.isNumber(radius)) {
            radius = [radius, radius];
        }

        return [radius[0] * Math.cos(theta), radius[1] * Math.sin(theta)];
    },

    cartFromPolarDeg: function(radius, theta) {
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
