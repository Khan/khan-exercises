/*
 * Line Utils 
 * A line is an array of two points e.g. [[-5, 0], [5, 0]].
 */

(function(KhanUtil) {

var kpoint = KhanUtil.kpoint;

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
    }
};

})(KhanUtil);
