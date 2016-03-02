/* TODO(csilvers): fix these lint errors (http://eslint.org/docs/rules): */
/* eslint-disable comma-dangle, indent, max-len, no-trailing-spaces, no-undef, no-var, space-infix-ops */
/* To fix, remove an entry above, run ka-lint, and fix errors. */

/*
 * Line Utils
 * A line is an array of two points e.g. [[-5, 0], [5, 0]].
 */
define(function(require) {

var kpoint = require("./kpoint.js");
var knumber = require("./knumber.js");

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

    /**
    * Tests if two lines are collinear.
    * https://en.wikipedia.org/wiki/Collinearity
    */
    equal: function(line1, line2, tolerance) {
        /**
        * line1's points are trivially collinear.
        * So check against each point in line2.
        * Form a triangle of the points (line1 and a single point from line2)
        * iff the area of the triangle is zero, are the points collinear
        * http://mathworld.wolfram.com/Collinear.html
        */
        var x1 = line1[0][0];
        var y1 = line1[0][1];
        var x2 = line1[1][0];
        var y2 = line1[1][1];
        return _.every(line2, function(point) {
            var x3 = point[0];
            var y3 = point[1];
            
            //calculating area of triangle formed by the three points
            //https://en.wikipedia.org/wiki/Shoelace_formula#Examples
            //A = 1/2|x1*y2 + x2*y3 + x3*y1 - x2*y1 - x3*y2 - x1*y3|
            var area = (1/2)*Math.abs(x1*y2 + x2*y3 + x3*y1 -
                x2*y1 - x3*y2 - x1*y3);

            return knumber.equal(area, 0, tolerance);
        });
    },

    intersect: function(px, py, rx, ry, qx, qy, sx, sy) {
        // Returns true is the line from (px, py) to (rx, ry) intersections the line (qx, qy) to (sx, sy)
        // http://stackoverflow.com/questions/563198/how-do-you-detect-where-two-line-segments-intersect/565282#565282
        function cross(vx, vy, wx, wy) {
            return vx * wy - vy * wx;
        }

        if (cross(rx, ry, sx, sy) === 0) {
            return cross(qx - px, qy - py, rx, ry) === 0;
        } else {
            var t = cross(qx - px, qy - py, sx, sy) / cross(rx, ry, sx, sy);
            var u = cross(qx - px, qy - py, rx, ry) / cross(rx, ry, sx, sy);
            return 0 <= t && t <= 1 && 0 <= u && u <= 1;
        }
    }
};

return kline;

});
