/*
 * Number Utils
 * A number is a js-number, e.g. 5.12
 */

(function(KhanUtil) {

var DEFAULT_TOLERANCE = 1e-9;
var MACHINE_EPSILON = Math.pow(2, -42);

var knumber = KhanUtil.knumber = {

    DEFAULT_TOLERANCE: DEFAULT_TOLERANCE,
    MACHINE_EPSILON: MACHINE_EPSILON,

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
        return knumber.roundTo(num, Math.pow(10, precision));
    },

    // Round a number to the nearest increment
    roundTo: function(num, increment) {
        return Math.round(num / increment) * increment;
    },

    floorTo: function(num, increment) {
        return Math.floor(num / increment) * increment;
    },

    ceilTo: function(num, increment) {
        return Math.ceil(num / increment) * increment;
    }
};

})(KhanUtil);
