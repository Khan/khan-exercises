/*
 * Line Utils 
 * A line is an array of two points e.g. [[-5, 0], [5, 0]].
 */

(function(KhanUtil) {

var kpoint = KhanUtil.kpoint;
var kvector = KhanUtil.kvector;
$.fn["klineLoad"] = function() {
    kpoint = KhanUtil.kpoint;
    kvector = KhanUtil.kvector;
};

var kline = KhanUtil.kline = {

    distanceToPoint: function(line, point) {
        return kpoint.distanceToLine(point, line);
    },

    reflectPoint: function(line, point) {
        return kpoint.reflectOverLine(point, line);
    },

    midpoint: function(line) {
        return [
            (line[0][0] + line[1][0]) / 2,
            (line[0][1] + line[1][1]) / 2
        ];
    },

    equal: function(line1, line2, tolerance) {
        // TODO (jack): A nicer implementation might just check collinearity of
        // vectors using underscore magick
        // Compare the directions of the lines
        var v1 = kvector.subtract(line1[1],line1[0]);
        var v2 = kvector.subtract(line2[1],line2[0]);
        if (!kvector.collinear(v1, v2, tolerance)) {
            return false;
        }
        // If the start point is the same for the two lines, then they are the same
        if (kpoint.equal(line1[0], line2[0])) {
            return true;
        }
        // Make sure that the direction to get from line1 to
        // line2 is the same as the direction of the lines
        var line1ToLine2Vector = kvector.subtract(line2[0], line1[0]);
        return kvector.collinear(v1, line1ToLine2Vector, tolerance);
    }
};

})(KhanUtil);
