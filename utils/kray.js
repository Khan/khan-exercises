/*
 * Ray Utils
 * A ray is an array of an endpoint and another point along the ray.
 * For example, [[0, 0], [1, 0]] is the ray starting at the origin and
 * traveling along the positive x-axis.
 */

(function(KhanUtil) {

var kvector = KhanUtil.kvector;
var kpoint = KhanUtil.kpoint;
$.fn["krayLoad"] = function() {
    kvector = KhanUtil.kvector;
    kpoint = KhanUtil.kpoint;
};

var kray = KhanUtil.kray = {

    equal: function(ray1, ray2, tolerance) {
        // Compare the directions of the rays
        var v1 = kvector.subtract(ray1[1],ray1[0]);
        var v2 = kvector.subtract(ray2[1],ray2[0]);

        var sameOrigin = kpoint.equal(ray1[0], ray2[0]);
        var codirectional = kvector.codirectional(v1, v2, tolerance);

        return sameOrigin && codirectional;
    }
};

})(KhanUtil);
