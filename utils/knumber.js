/* TODO(csilvers): fix these lint errors (http://eslint.org/docs/rules): */
/* eslint-disable camelcase, comma-dangle, indent, no-undef, no-var, one-var, space-infix-ops */
/* To fix, remove an entry above, run ka-lint, and fix errors. */

/*
 * Number Utils
 * A number is a js-number, e.g. 5.12
 */
define(function(require) {

var DEFAULT_TOLERANCE = 1e-9;
var EPSILON = Math.pow(2, -42);

var knumber = KhanUtil.knumber = {

    DEFAULT_TOLERANCE: DEFAULT_TOLERANCE,
    EPSILON: EPSILON,

    is: function(x) {
        return _.isNumber(x) && !_.isNaN(x);
    },

    equal: function(x, y, tolerance) {
        // Checking for undefined makes this function behave nicely
        // with vectors of different lengths that are _.zip'd together
        if (x == null || y == null) {
            return x === y;
        }
        if (tolerance == null) {
            tolerance = DEFAULT_TOLERANCE;
        }
        return Math.abs(x - y) < tolerance;
    },

    sign: function(x, tolerance) {
        return knumber.equal(x, 0, tolerance) ? 0 : Math.abs(x) / x;
    },

    // Round a number to a certain number of decimal places
    round: function(num, precision) {
        var factor = Math.pow(10, precision);
        return Math.round(num * factor) / factor;
    },

    // Round num to the nearest multiple of increment
    // i.e. roundTo(83, 5) -> 85
    roundTo: function(num, increment) {
        return Math.round(num / increment) * increment;
    },

    floorTo: function(num, increment) {
        return Math.floor(num / increment) * increment;
    },

    ceilTo: function(num, increment) {
        return Math.ceil(num / increment) * increment;
    },

    isInteger: function(num, tolerance) {
        return knumber.equal(Math.round(num), num, tolerance);
    },

    /**
     * toFraction
     *
     * Returns a [numerator, denominator] array rational representation
     * of `decimal`
     *
     * See http://en.wikipedia.org/wiki/Continued_fraction for implementation
     * details
     *
     * toFraction(4/8) => [1, 2]
     * toFraction(0.66) => [33, 50]
     * toFraction(0.66, 0.01) => [2/3]
     * toFraction(283 + 1/3) => [850, 3]
     */
    toFraction: function(decimal, tolerance, max_denominator) {
        max_denominator = max_denominator || 1000;
        tolerance = tolerance || EPSILON; // can't be 0

        // Initialize everything to compute successive terms of
        // continued-fraction approximations via recurrence relation
        var n = [1, 0], d = [0, 1];
        var a = Math.floor(decimal);
        var rem = decimal - a;

        while (d[0] <= max_denominator) {
            if (knumber.equal(n[0] / d[0], decimal, tolerance)) {
                return [n[0], d[0]];
            }
            n = [a*n[0] + n[1], n[0]];
            d = [a*d[0] + d[1], d[0]];
            a = Math.floor(1 / rem);
            rem = 1/rem - a;
        }

        // We failed to find a nice rational representation,
        // so return an irrational "fraction"
        return [decimal, 1];
    }
};

return knumber;

});
