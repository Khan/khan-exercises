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

    equal: function(x, y, tolerance) {
        if (tolerance == null) {
            tolerance = DEFAULT_TOLERANCE;
        }
        return Math.abs(x - y) < tolerance;
    },

    sign: function(x, tolerance) {
        return knumber.equal(x, 0, tolerance) ? 0 : Math.abs(x) / x;
    }
};

})(KhanUtil);
