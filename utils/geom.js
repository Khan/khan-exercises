(function() {
    var eps = 1e-9;
    var eq = function(x, y) { return Math.abs(x - y) < eps; };
    var signum = function(x) { return eq(x, 0) ? 0 : x / Math.abs(x); };

    var sub = function(p1, p2) { return {x: p1.x - p2.x, y: p1.y - p2.y}; };
    var len = function(p) { return Math.sqrt(p.x * p.x + p.y * p.y); };
    var dist = function(p1, p2) { return len(sub(p1, p2)); };
    var dot = function(p1, p2) { return p1.x * p2.x + p1.y * p2.y; };
    var cross = function(p1, p2) { return p1.x * p2.y - p1.y * p2.x; };
    var ccw = function(p1, p2, p3) { return cross(sub(p2, p1), sub(p3, p1)); };

    var Geom = {
        convexhull: function(points) {
            var v0;

            _.each(points, function(p) {
                if (v0 == null || p.x < v0.x - eps ||
                        (eq(p.x, v0.x) && p.y < v0.y)) {
                    v0 = p;
                }
            });

            points = points.slice(0);
            points.sort(function(a, b) {
                if (a == v0) {
                    return -1;
                } else if (b == v0) {
                    return 1;
                }

                var c = ccw(v0, a, b);
                if (eq(c, 0)) {
                    var d1 = dist(v0, a);
                    var d2 = dist(v0, b);

                    if (d1 < d2) {
                        return -1;
                    } else if (d1 > d2) {
                        return 1;
                    } else {
                        return 0;
                    }
                } else {
                    return -signum(c);
                }
            });

            var ch = [];
            _.each(points, function(p) {
                var l = ch.length;
                while (ch.length >= 2 &&
                        ccw(ch[ch.length - 2], ch[ch.length - 1], p) <= eps) {
                    ch.pop();
                }
                ch.push(p);
            });

            return ch;
        },

        /**
         * Return a list of angles between 0 and 2 pi, in radians, through
         * which the passed-in set of points have rotational symmetry (about
         * the origin).
         */
        rotationalSymmetries: function(points) {
            var n = points.length,
                v0 = points[0],
                angles = [],
                tau = 2 * Math.PI;

            out: for (var i = 1; i < n; i++) {
                var v1 = points[i];

                var mag = len(v0) * len(v1);
                var cos = dot(v0, v1) / mag;
                var sin = -cross(v0, v1) / mag;

                var rotated = [];
                for (var j = 0; j < n; j++) {
                    var p = points[(i + j) % n];
                    var rotP = {
                        x: cos * p.x - sin * p.y,
                        y: sin * p.x + cos * p.y
                    };

                    if (!eq(dist(rotP, points[j]), 0.0)) {
                        // Points don't line up; no good.
                        continue out;
                    }
                }

                var angle = (eps + tau + Math.atan2(sin, cos)) % tau - eps;
                if (!eq(angle, 0.0)) {
                    angles.push(angle);
                }
            }

            angles = KhanUtil.sortNumbers(angles);
            angles = _.uniq(angles, /* isSorted: */ true, function() {
                return KhanUtil.roundToNearest(eps);
            });

            return angles;
        }
    };

    KhanUtil.Geom = Geom;
})();
