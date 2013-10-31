/*
 * Point Utils
 * A point is an array of two numbers e.g. [0, 0].
 */

(function(KhanUtil) {

var kvector;
$.fn["kpointLoad"] = function() {
    kvector = KhanUtil.kvector;
};

var kpoint = KhanUtil.kpoint = {

    // Add and subtract vector(s)
    addVector: KhanUtil.kvector.add,
    addVectors: KhanUtil.kvector.add,
    subtractVector: KhanUtil.kvector.subtract,

    // Convert from cartesian to polar and back
    polarRadFromCart: KhanUtil.kvector.polarRadFromCart,
    polarDegFromCart: KhanUtil.kvector.polarDegFromCart,
    cartFromPolarRad: KhanUtil.kvector.cartFromPolarRad,
    cartFromPolarDeg: KhanUtil.kvector.cartFromPolarDeg,

    // Rotate point (around origin unless a center is specified)
    rotateRad: function(point, theta, center) {
        if (center === undefined) {
            return kvector.rotateRad(point, theta);
        } else {
            return kvector.add(
                center,
                kvector.rotateRad(
                    kvector.subtract(point, center),
                    theta
                )
            );
        }
    },

    rotateDeg: function(point, theta, center) {
        if (center === undefined) {
            return kvector.rotateDeg(point, theta);
        } else {
            return kvector.add(
                center,
                kvector.rotateDeg(
                    kvector.subtract(point, center),
                    theta
                )
            );
        }
    },

    // Distance between two points
    distanceToPoint: function(point1, point2) {
        return kvector.length(kvector.subtract(point1, point2));
    },

    // Distance between point and line
    distanceToLine: function(point, line) {
        var lv = kvector.subtract(line[1], line[0]);
        var pv = kvector.subtract(point, line[0]);
        var projectedPv = kvector.projection(pv, lv);
        var distancePv = kvector.subtract(projectedPv, pv);
        return kvector.length(distancePv);
    },

    // Reflect point over line
    reflectOverLine: function(point, line) {
        var lv = kvector.subtract(line[1], line[0]);
        var pv = kvector.subtract(point, line[0]);
        var projectedPv = kvector.projection(pv, lv);
        var reflectedPv = kvector.subtract(kvector.scale(projectedPv, 2), pv);
        return kvector.add(line[0], reflectedPv);
    }
};

})(KhanUtil);
