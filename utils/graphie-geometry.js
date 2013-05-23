// TODO: shove these into KhanUtil or somewhere reasonable

function rotatePoint(p, deg, c) {
    var rad = KhanUtil.toRadians(deg),
        cos = Math.cos(rad),
        sin = Math.sin(rad),
        c = c || [0, 0],
        cx = c[0],
        cy = c[1],
        px = p[0],
        py = p[1],
        x = cx + (px - cx) * cos - (py - cy) * sin,
        y = cy + (px - cx) * sin + (py - cy) * cos;
    return [KhanUtil.roundTo(9, x), KhanUtil.roundTo(9, y)];
}

function getSideMidpoint(path) {
    return [(path[0][0] + path[1][0]) / 2,
            (path[0][1] + path[1][1]) / 2];
}

$.extend(KhanUtil, {
    rightAngleBox: function(path1, path2, style) {
        var graph = KhanUtil.currentGraph;

        var size = 0.5;

        var intersection = findIntersection(path1, path2),
        path = [intersection],
        curr = graph.cartToPolar(intersection)[1],
        offset;

        for (var i = 1; i < 4; i++) {
            offset = graph.polar(size, curr);

            path.push([path[i - 1][0] - offset[0],
                       path[i - 1][1] - offset[1]]);

            curr -= 90;
        }

        path.push(intersection);

        return graph.path(path, style);
    },

    parallel: function(path, num, style) {
        var graph = KhanUtil.currentGraph;

        var spacing = 0.5;

        point = getSideMidpoint(path);

        graph.path([path[0], point], $.extend(style, { arrows: "->" }));
    },

    congruent: function(path, num, style) {
        var graph = KhanUtil.currentGraph;

        var spacing = 5, scale = 5;

        for (var i = 0; i < num; i++) {
            var sPath = _.map(path, graph.scalePoint),
            sPoint = getSideMidpoint(sPath),
            angle = Math.atan((sPath[0][1] - sPath[1][1]) / (sPath[0][0] - sPath[1][0])),
            perpangle = angle + Math.PI / 2;

            var sMarkPath = [[sPoint[0] + Math.cos(angle)*spacing*i + Math.cos(perpangle)*scale,
                              sPoint[1] + Math.sin(angle)*spacing*i + Math.sin(perpangle)*scale],
                             [sPoint[0] + Math.cos(angle)*spacing*i - Math.cos(perpangle)*scale,
                              sPoint[1] + Math.sin(angle)*spacing*i - Math.sin(perpangle)*scale]];

            graph.path(_.map(sMarkPath, graph.unscalePoint), style);
        }
    }
});

function RegularPolygon(center, numSides, radius, rotation, fillColor) {
    var graph = KhanUtil.currentGraph;
    rotation = rotation || 0;
    rotation = KhanUtil.toRadians(rotation);
    var lines = [];

    this.draw = function() {
        var angle = 2 * Math.PI / numSides;
        var arr = [];
        for (var i = 0; i < numSides; i++) {
            arr.push([center[0] + radius * Math.cos(rotation + i * angle), center[1] + radius * Math.sin(rotation + i * angle)]);
            arr.push([center[0] + radius * Math.cos(rotation + (i + 1) * angle), center[1] + radius * Math.sin(rotation + (i + 1) * angle)]);
        }
        return KhanUtil.currentGraph.path(arr);
    }

    function getSymmetryCoordinates(i) {
        var angle = rotation + Math.PI * i * 1 / numSides;
        var extend = 2;
        var scaleToEnd = extend + 5.4;
        var p1 = [center[0] - Math.cos(angle) * scaleToEnd, center[1] - Math.sin(angle) * scaleToEnd];
        var p2 = [scaleToEnd * Math.cos(angle) + center[0], scaleToEnd * Math.sin(angle) + center[1]];
        return [p1, p2];
    }

    this.drawLineOfSymmetry = function(i, color) {
        var coords = getSymmetryCoordinates(i);
        color = color || KhanUtil.BLUE;
        return graph.line.apply(graph, $.merge(coords, [{ stroke: color }]));
    }

    this.drawFakeLineOfSymmetry = function(i, color) {
        color = color || KhanUtil.BLUE;
        var coords = getSymmetryCoordinates(i),
            angle = 360 / numSides / 2,
            fudge = KhanUtil.randRange(10, angle - 10) * KhanUtil.randFromArray([-1, 1]);
        return graph.line(rotatePoint(coords[0], fudge), rotatePoint(coords[1], fudge), { stroke: color });
    }

    this.drawSide = function(style) {
        return graph.line(this.path.graphiePath[0], this.path.graphiePath[1], style);
    }

    this.drawSideLabel = function(s, color) {
        var path = this.path.graphiePath;
        return graph.label(getSideMidpoint(path), "\\color{"+color+"}{"+s+"}", "right");
    }

    this.drawRadius = function(style) {
        var vertex = this.path.graphiePath[0];

        return graph.line(center, vertex, style);
    }

    this.drawRadiusLabel = function(r, color) {
        var vertex = this.path.graphiePath[0];

        return graph.label([(vertex[0] - center[0]) / 2, (vertex[1] - center[1]) / 2], "\\color{"+color+"}{"+r+"}", "below");
    }

    this.drawApothem = function(style) {
        return graph.line(center, getSideMidpoint(this.path.graphiePath), style);
    }

    this.drawApothemLabel = function(a, color) {
        var midpoint = getSideMidpoint(this.path.graphiePath);

        return graph.label([(midpoint[0] - center[0]) / 2, (midpoint[1] - center[1]) / 2], "\\color{"+color+"}{"+a+"}", "above");
    }

    this.drawRightBox = function(style) {

    }

    this.drawCentralAngle = function(style) {
        return graph.arc(center, 0.5, 0, 180 / numSides, null, style);
    }

    this.drawCentralAngleLabel = function(t, color) {
        return graph.label(center, "\\color{"+color+"}{"+t+"}", "above right");
    }

    this.drawIncircle = function(style) {
        return graph.circle(center, KhanUtil.getDistance(center, getSideMidpoint(this.path.graphiePath)), style);
    }

    this.drawCircumcircle = function(style) {
        return graph.circle(center, radius, style);
    }

    this.drawRightTriangle = function(i, fromMidpoint, style) {
        var vertex = this.path.graphiePath[i],
        vertex2 = this.path.graphiePath[i + 1],
        midpoint = lineMidpoint([vertex, vertex2]);

        if (fromMidpoint) {
            return graph.path([center, midpoint, vertex2, center], style);
        } else {
            return graph.path([center, vertex, midpoint, center], style);
        }
    }

    // Does not currently work with 2 points on one side
    this.splitPath = function(line) {
        var points = linePathIntersection(line, this.path),
            paths = [],
            currPath = [];
        for (var i = 0; i < this.path.graphiePath.length - 1; i = i + 2) {
            var pt1 = this.path.graphiePath[i];
            var pt2 = this.path.graphiePath[i + 1];
            var intersections = findPointsOnLine([pt1, pt2], points);

            currPath.push(pt1);

            if (intersections.length !== 0) {
                var point = intersections[0];
                currPath.push(point);
                paths.push(currPath);
                currPath = [point];
                points.splice(_(points).indexOf(point), 1);
            }
        }
        currPath.push(this.path[i]);
        paths.push(currPath);
        return graph.path(paths[1], { stroke: KhanUtil.ORANGE, "stroke-width": 5 });
    }

    this.path = this.draw();
}

function lineLength(line) {
    var a = line[0];
    var b = line[1];
    return Math.sqrt((a[0] - b[0]) * (a[0] - b[0]) + (a[1] - b[1]) * (a[1] - b[1]));
}

function dotProduct(a, b) {
        return a[0] * b[0] + a[1] * b[1];
}
//http://www.blackpawn.com/texts/pointinpoly/default.html
//Checks whether two points are on the same side of a line
function sameSide(p1, p2, l) {
    var a = l[0];
    var b = l[1];

    var cp1 = vectorProduct(b - a, p1 - a);
    var cp2 = vectorProduct(b - a, p2 - a);

    return (dotProduct(cp1, cp2) >= 0);
}
//Takes an array and an array of positions, all elements whose index is not in the positions array gets replaced by ""
//Very useful for labels, for example, clearArray(["x", "x", "x"], [ANGLE]), where ANGLE is 1, will give you ["", "x", ""], which you can use to label angles in a Triangle such that the second angle is labeled x

function clearArray(arr, i) {
    return $.map(arr, function(el, index) {
        if ($.inArray(index, i) !== -1) {
            return el;
        }
        else {
            return "";
       }
    });
}

//Used together with clearArray, for example mergeArray(clearArray(["x", "x", "x"], [ANGLE]), ["a","b","c"]), where ANGLE is 1, gives labels for a triangle ["a", "x", "c"]
//need to be same length
function mergeArray(ar1, ar2) {
    var i = 0;
    for (i = 0; i < ar1.length; i++) {
        if (ar1[i] === "") {
            ar1[i] = ar2[i];
        }
    }
    return ar1;
}

function isPointOnLineSegment(l, p, precision) {
    var precision = precision || 0.1;
    //If line is vertical
    if (Math.abs(l[1][0] - l[0][0]) < precision) {
        return (Math.abs(p[0] - l[0][0]) < precision) && (p[1] <= (Math.max(l[1][1], l[0][1]) + precision)) && (p[1] >= (Math.min(l[1][1], l[0][1]) - precision));
    }
    var m = (l[1][1] - l[0][1]) / (l[1][0] - l[0][0]);
    var k = l[0][1] - m * l[0][0];
    return (Math.abs(m * p[0] + k - p[1]) < precision);
}

function findPointsOnLine(l, ps) {
    var points = [];
    var ps = ps || [];
    var i = 0;
    for (i = 0; i < ps.length; i++) {
        if (isPointOnLineSegment(l, ps[i])) {
                points.push(ps[i]);
        }
    }
    return points;
}

//Are two polygons intersecting
function areIntersecting(pol1, pol2) {
    var i, k = 0;
    for (i = 0; i < pol1.length; i++) {
        for (k = 0; k < pol2.length; k++) {
            if (findIntersection(pol1[i], pol2[k])[2]) {
                return true;
            }
        }
    }
    return false;
}


//Returns an intersection of two lines, and whether that point is inside both line segments
function findIntersection(a, b) {
    var tY = [0, a[0][1], a[1][1], b[0][1], b[1][1]];
    var tX = [0, a[0][0], a[1][0], b[0][0], b[1][0]];

    var denominator = (tY[4] - tY[3]) * (tX[2] - tX[1]) - (tX[4] - tX[3]) * (tY[2] - tY[1]);
    var ua = ((tX[4] - tX[3]) * (tY[1] - tY[3]) - (tY[4] - tY[3]) * (tX[1] - tX[3])) / denominator;
    var ub = ((tX[2] - tX[1]) * (tY[1] - tY[3]) - (tY[2] - tY[1]) * (tX[1] - tX[3])) / denominator;
    var isContained = (ua >= -0.01) && (ua <= 1.01) && (ub >= -0.01) && (ub <= 1.01);
    return [tX[1] + ua * (tX[2] - tX[1]), tY[1] + ua * (tY[2] - tY[1]), isContained];

}


//Checks whether there are duplicate points in an array
function checkDuplicate(arr, el) {
    var i = 0;
    for (i = 0; i < arr.length; i++) {
        if (Math.sqrt((arr[i][0] - el[0]) * (arr[i][0] - el[0]) + (arr[i][1] - el[1]) * (arr[i][1] - el[1])) < 0.1) {
            return true;
        }
    }
    return false;
}


function pointLineDistance(p, l) {
    var y = [l[0][1], l[1][1]];
    var x = [l[0][0], l[1][0]];
    var num = (y[0] - y[1]) * p[0] + (x[1] - x[0]) * p[1] + (x[0] * y[1] - x[1] * y[0]);
    var den = Math.sqrt((x[1] - x[0]) * (x[1] - x[0]) + (y[1] - y[0]) * (y[1] - y[0]));
    return num / den;
}

//Reflects a point p over line l
function reflectPoint(l, p) {
    var m = (l[1][1] - l[0][1]) / (l[1][0] - l[0][0]);
    var k = l[0][1] - m * l[0][0];
    var d = (p[0] + (p[1] - k) * m) / (1 + m * m);
    return ([2 * d - p[0], 2 * d * m - p[1] + 2 * k]);
}

//Returns an array of points where a path intersects a line
function linePathIntersection(l, p) {
    var points = [];
    var ps = p.graphiePath;
    var l = l.graphiePath;
    var i = 0;
    for (i = 0; i < ps.length - 1; i = i + 2) {
        var x = findIntersection([ps[i], ps[i + 1]], l);
        if (x[2] === true && ! checkDuplicate(points, [x[0], x[1]])) {
            points.push([x[0], x[1]]);
        }
    }
    return points;
}

function degToRad(deg) {
    return deg * Math.PI / 180;
}

//Returns [ m, k ] of y = mx + k
//Vulnerable to division by 0
function lineEquation(line) {
    var x = [line[0][0], line[1][0]];
    var y = [line[0][1], line[1][1]];

    var m = (line[1][1] - line[0][1]) / (line[1][0] - line[0][0]);
    var k = line[0][1] - m * line[0][0];

    return [m, k];

}

//Given a line, returns a segment of that line of length amount starting at start
function lineSegmentFromLine(start, line, amount) {

    var eq = lineEquation(line);
    var m = eq[0];
    var angle = Math.atan(m);
    return [start, [start[0] + Math.cos(angle) * amount, start[1] + Math.sin(angle) * amount]];

}

//Gives a line parralel to line going through point
function parallelLine(line, point) {

    var dif = [point[0] - line[0][0], point[1] - line[0][1]];
    return [point, [line[1][0] + dif[0], line[1][1] + dif[1]]];

}

function movePoint(p, a) {

    return [p[0] + a[0], p[1] + a[1]];
}


//Returns a line that bisects an angle defined by line1 and line2
function bisectAngle(line1, line2, scale) {
    var intPoint = findIntersection(line1, line2);
    var l1 = [];
    var l2 = [];

    if ((line1[1][0] - line1[0][0]) >= 0) {
        l1 = lineSegmentFromLine(intPoint, line1, scale);
    }
    else {
        l1 = lineSegmentFromLine(intPoint, line1, -scale);
    }
    if ((line2[1][0] - line2[0][0]) >= 0) {
        l2 = lineSegmentFromLine(intPoint, line2, scale);
    }
    else {
        l2 = lineSegmentFromLine(intPoint, line2, -scale);
    }
    return [intPoint, parallelLine(l1, l2[1])[1]];

}

//Midpoint of a line
function lineMidpoint(line) {
    return [(line[0][0] + line[1][0]) / 2, (line[0][1] + line[1][1]) / 2];
}

function vectorProduct(line1, line2) {
    var x1 = line1[1][0] - line1[0][0];
    var x2 = line2[1][0] - line2[0][0];
    var y1 = line1[1][1] - line1[0][1];
    var y2 = line2[1][1] - line2[0][1];
    return x1 * y2 - x2 * y1;
}

//For [a, b] returns [b , a]
function reverseLine(line) {
    return [line[1], line[0]];
}

function Triangle(center, angles, scale, labels, points) {

    var fromPoints = false;
    if (points) {
            fromPoints = true;
    }

    this.labels = labels;
    if (fromPoints) {
        this.points = points;
        this.sides = [[this.points[0], this.points[1]], [this.points[1], this.points[2]] , [this.points[2], this.points[0]]];
        this.sideLengths = $.map(this.sides, lineLength);
        this.angles = anglesFromSides(this.sideLengths);
    }
    else {
        this.angles = angles;
    }

    this.radAngles = $.map(angles, degToRad);
    this.scale = (scale || 3);

    this.cosines = $.map(this.radAngles, Math.cos);
    this.sines = $.map(this.radAngles, Math.sin);


    this.x = center[0];
    this.y = center[1];
    this.rotation = 0;

    //Given the scale(which represensts the area of the triangle) and angles we want to find the side lengths.
    //http://en.wikipedia.org/wiki/Triangle#Using_trigonometry. Using the ASA equation in the link, we find the length of one side.
    var a = Math.sqrt((2 * this.scale * this.sines[1]) / (this.sines[0] * this.sines[2]));
    var b = a * this.sines[2] / this.sines[1];
    if (! fromPoints) {
        this.points = [[this.x, this.y], [b + this.x, this.y], [this.cosines[0] * a + this.x, this.sines[0] * a + this.y]];
    }
    this.sides = [[this.points[0], this.points[1]], [this.points[1], this.points[2]] , [this.points[2], this.points[0]]];

    this.sideLengths = $.map(this.sides, lineLength);

    this.niceSideLengths = $.map(this.sideLengths, function(x) { return parseFloat(x.toFixed(1)); });

    this.set = "";
    this.niceAngles = $.map(this.angles, function(x) { return x + "^{\\circ}"; });
    this.labelObjects = { "sides": [] , "angles" : [], "points" : [], "name" : [] };


    this.angleScale = function(ang) {
        if (ang > 90) {
            return 0.5;
        }
        else if (ang > 40) {
            return 0.6;
        }
        else if (ang < 25) {
            return 0.7;
        }
        return 0.8;
    }

    this.draw = function() {
        this.set = KhanUtil.currentGraph.raphael.set();
        this.set.push(KhanUtil.currentGraph.path(this.points.concat([this.points[0]])));
        return this.set;
    }

    this.color = "black";
    this.createLabel = function(p, v) {

        this.set.push(KhanUtil.currentGraph.label(p, v, "center", { color: this.color }));
    }

    this.boxOut = function(pol, amount, type) {
        var type = type || "simple";
        var intersectWith = this.sides;
        var shouldMove = areIntersecting(pol, this.sides);
        while (areIntersecting(pol, this.sides)) {
            this.translate(amount);
        }
        if (shouldMove) {
            this.translate(amount);
        }
    }

    this.boundingRange = function(margin) {
        margin = margin || 0;
        var X = $.map(this.points, function(p) { return p[0]; });
        var Y = $.map(this.points, function(p) { return p[1]; });
        return [[_.min(X) - margin, _.max(X) + margin],
             [_.min(Y) - margin, _.max(Y) + margin]];
    }

    this.findCenterPoints = function() {
        var Ax = this.points[0][0];
        var Ay = this.points[0][1];
        var Bx = this.points[1][0];
        var By = this.points[1][1];
        var Cx = this.points[2][0];
        var Cy = this.points[2][1];
        var D = 2 * (Ax * (By - Cy) + Bx * (Cy - Ay) + Cx * (Ay - By));
        var a = lineLength(this.sides[0]);
        var b = lineLength(this.sides[1]);
        var c = lineLength(this.sides[2]);
        var P = a + b + c;
        var x1 = (a * Ax + b * Bx + c * Cx) / P;
        var y1 = (a * Ay + b * By + c * Cy) / P;
        var x = ((Ay * Ay + Ax * Ax) * (By - Cy) + (By * By + Bx * Bx) * (Cy - Ay) + (Cy * Cy + Cx * Cx) * (Ay - By)) / D;
        var y = ((Ay * Ay + Ax * Ax) * (Cx - Bx) + (By * By + Bx * Bx) * (Ax - Cx) + (Cy * Cy + Cx * Cx) * (Bx - Ax)) / D;
        this.circumCenter = [x, y];
        this.centroid = [1 / 3 * (Ax + Bx + Cx), 1 / 3 * (Ay + By + Cy)];
        this.inCenter = [x1, y1];
    }

    this.findCenterPoints();

    this.rotationCenter = this.centroid;

    this.rotate = function(amount) {
        amount = amount * Math.PI / 180;
        var tr = this;
        this.points = $.map(this.points, function(el, i) {
                return [tr.rotatePoint(el, amount)];
        });
        this.genSides();
        this.findCenterPoints();
    }

    this.genSides = function() {
        this.sides = [];
        var x = 0;
        for (x = 0; x < this.points.length; x++) {
            this.sides.push([this.points[x], this.points[(x + 1) % this.points.length]]);
        }
    }

    this.translate = function(amount) {
        this.points = $.map(this.points, function(el, i) {
                return [movePoint(el, amount)];
        });
        this.genSides();
        this.findCenterPoints();
    }

    this.rotatePoint = function(pos, theta) {
        var theta = theta || this.rotation;
        return [this.rotationCenter[0] + (pos[0] - this.rotationCenter[0]) * Math.cos(theta) + (pos[1] - this.rotationCenter[1]) * Math.sin(theta), this.rotationCenter[1] + (-1) * ((pos[0] - this.rotationCenter[0]) * Math.sin(theta)) + ((pos[1] - this.rotationCenter[1]) * Math.cos(theta))];
    }

    this.drawLabels = function() {
        var i = 0;
        if ("points" in this.labels) {
            //Need to change the position of placement into label objects
            for (i = this.angles.length - 1; i >= 0; i--) {
                this.labelObjects.points.push(this.createLabel(bisectAngle(reverseLine(this.sides[(i + 1) % this.angles.length]), this.sides[i], 0.3)[1], this.labels.points[(i + 1) % this.angles.length]));
            }
        }

        if ("angles" in this.labels) {
            for (i = this.angles.length - 1; i >= 0; i--) {
                this.labelObjects.angles.push(this.createLabel(bisectAngle(this.sides[(i + 1) % this.angles.length], reverseLine(this.sides[i]), this.angleScale(this.angles[(i + 1) % this.angles.length]))[1], this.labels.angles[(i + 1) % this.angles.length]));
            }
        }

        if ("sides" in this.labels) {
            for (i = 0; i < this.sides.length; i++) {
                //http://www.mathworks.com/matlabcentral/newsreader/view_thread/142201
                var midPoint = lineMidpoint(this.sides[i]);
                var t = lineLength([this.sides[i][1], midPoint]);
                var d = 0.5;
                var x3 = midPoint[0] + (this.sides[i][1][1] - midPoint[1]) / t * d;
                var y3 = midPoint[1] - (this.sides[i][1][0] - midPoint[0]) / t * d;
                this.labelObjects.sides.push(this.createLabel([x3, y3], this.labels.sides[i]));
            }
        }

        if ("name" in this.labels) {
                this.labelObjects["name"] = this.createLabel(bisectAngle(reverseLine(this.sides[2]), this.sides[1], 0.3)[1], this.labels.name);
        }


//DEPRECATED
        if ("c" in this.labels) {
            this.createLabel([(this.points[0][0] + this.points[1][0]) / 2, (this.points[0][1] + this.points[1][1]) / 2 - 0.4] , labels.c);
        }
        if ("a" in this.labels) {
            this.createLabel([(this.points[1][0] + this.points[2][0]) / 2 + 0.4, (this.points[1][1] + this.points[2][1]) / 2] , labels.a);
        }
        if ("b" in this.labels) {
            this.createLabel([(this.points[0][0] + this.points[2][0]) / 2 - 0.4, (this.points[0][1] + this.points[2][1]) / 2] , labels.b);
        }


        return this.set;
    }

}
function Quadrilateral(center, angles, sideRatio, labels, size) {

    this.sideRatio = sideRatio;
    this.angles = angles;
    this.radAngles = $.map(angles, degToRad);
    this.scale = 1;
    this.rotation = 0;
    this.x = center[0];
    this.y = center[1];
    this.rotationCenter = [center[0], center[1]];
    this.set = "";
    this.size = 10;
    this.cosines = $.map(this.radAngles, Math.cos);
    this.sines = $.map(this.radAngles, Math.sin);
    this.labels = labels || {};
    this.sides = [];

    this.generatePoints = function() {
        var once = false;
        while ((! once) || this.isCrossed()) {
            var len = Math.sqrt(2 * this.scale * this.scale * this.sideRatio * this.sideRatio - 2 * this.sideRatio * this.scale * this.scale * this.sideRatio * this.cosines[3]);
            once = true;
            var tX = [0, this.scale * this.sideRatio * this.cosines[0] , len * Math.cos((this.angles[0] - (180 - this.angles[3]) / 2) * Math.PI / 180), this.scale, this.scale + Math.cos((180 - this.angles[1]) * Math.PI / 180)];
            var tY = [0, this.scale * this.sideRatio * this.sines[0] , len * Math.sin((this.angles[0] - (180 - this.angles[3]) / 2) * Math.PI / 180), 0, Math.sin((180 - this.angles[1]) * Math.PI / 180)];

            var denominator = (tY[4] - tY[3]) * (tX[2] - tX[1]) - (tX[4] - tX[3]) * (tY[2] - tY[1]);

            var ua = ((tX[4] - tX[3]) * (tY[1] - tY[3]) - (tY[4] - tY[3]) * (tX[1] - tX[3])) / denominator;

            this.points = [[this.x, this.y], [this.x + this.scale * this.sideRatio * this.cosines[0], this.y + this.scale * this.sideRatio * this.sines[0]], [this.x + tX[1] + ua * (tX[2] - tX[1]), this.y + tY[1] + ua * (tY[2] - tY[1])], [this.x + this.scale, this.y]];

            this.sides = [[this.points[0], this.points[3]], [this.points[3], this.points[2]], [this.points[2], this.points[1]], [this.points[1], this.points[0]]];
            this.sideLengths = $.map(this.sides, lineLength);
            this.niceSideLengths = $.map(this.sideLengths, function(x) { return parseFloat(x.toFixed(1)); });

            if (vectorProduct([this.points[0], this.points[1]], [this.points[0], this.points[2]]) > 0 || this.sideLengths[2] < 0.09) {
                this.sideRatio -= 0.3;
            }

            if (vectorProduct([this.points[0], this.points[3]], [this.points[0], this.points[2]]) < 0) {
                this.sideRatio += 0.3;
            }
        }
    }

    this.isCrossed = function() {
        return (vectorProduct([this.points[0], this.points[1]], [this.points[0], this.points[2]]) > 0) || (vectorProduct([this.points[0], this.points[3]], [this.points[0], this.points[2]]) < 0);
    }

    this.genSides = function() {
        this.sides = [[this.points[0], this.points[3]], [this.points[3], this.points[2]], [this.points[2], this.points[1]], [this.points[1], this.points[0]]];
    }

    this.generatePoints();

    var area = 0.5 * vectorProduct([this.points[0], this.points[2]], [this.points[3], this.points[1]]);
    this.scale = this.scale * Math.sqrt(this.size / area);
    this.generatePoints();

    area = 0.5 * vectorProduct([this.points[0], this.points[2]], [this.points[3], this.points[1]]);

}


Quadrilateral.prototype = new Triangle([0, 0], [30, 30, 30], 3, "");

//From http://en.wikipedia.org/wiki/Law_of_cosines
function anglesFromSides(sides) {
        var c = sides[0];
        var a = sides[1];
        var b = sides[2];
        var gamma = Math.round(Math.acos((a * a + b * b - c * c) / (2 * a * b)) * 180 / Math.PI);
        var beta = Math.round(Math.acos((a * a + c * c - b * b) / (2 * a * c)) * 180 / Math.PI);
        var alpha = Math.round(Math.acos((b * b + c * c - a * a) / (2 * b * c)) * 180 / Math.PI);
        return [alpha, beta, gamma];
}



var randomTriangleAngles = {

        triangle: function() {
            var a, b, c;
            a = KhanUtil.randRange(35, 150);
            b = KhanUtil.randRange(35, 180 - a);
            if (a + b > 160) {
                a = Math.max(30, a - 15);
                b = Math.max(30, b - 15);
            }
            c = 180 - a - b;
            return [a, b, c];
        },

        scalene: function() {
            var a, b, c;
            do {
                a = KhanUtil.randRange(25, 150);
                b = KhanUtil.randRange(25, 180 - a);
                if (a + b > 170) {
                    a = Math.max(30, a - 15);
                    b = Math.max(30, b - 15);
                }
                c = 180 - a - b;
            } while (a === b || a === c || b === c);
            return [a, b, c];
        },

        isosceles: function() {
            var a = KhanUtil.randRangeExclude(25, 75, [60]);
            var c = 180 - 2 * a;
            return KhanUtil.shuffle([a, a, c]);
        },
        equilateral: function() {
            return [60, 60, 60];
        }
};


var randomQuadAngles = {

        square: function() {
            return [90, 90, 90, 90];
        },

        rectangle: function() {
            return [90, 90, 90, 90];
        },

        rhombus: function() {
            var angA, angB;
            do {
                angA = KhanUtil.randRange(30, 160);
                angB = 180 - angA;
            }while (Math.abs(angA - angB) < 5);
            return [angA, angB, angA, angB];
        },

        parallelogram: function() {
            var angA, angB;
            do {
                angA = KhanUtil.randRange(30, 160);
                angB = 180 - angA;
            } while (angA === angB);
            return [angA, angB, angA, angB];
        },

        trapezoid: function() {
            var angA, angB, angC, angD;
            do {
                angA = KhanUtil.randRange(30, 160);
                angB = 180 - angA;
                angC = KhanUtil.randRange(30, 160);
                angD = 180 - angC;
            } while (Math.abs(angA - angC) < 6 || angA + angC === 180);
            return [angA, angC, angD, angB];
        },

        isoscelesTrapezoid: function() {
            var angC, angD;
            do {
                angC = KhanUtil.randRange(30, 160);
                angD = 180 - angC;
            } while (angC === angD);
            return [angC, angC, angD, angD];
        },

        kite: function() {
            var angA, angB, angC;
            do {
                angA = KhanUtil.randRange(90, 140);
                angB = KhanUtil.randRange(30, (360 - (2 * angA)) - 30);
                angC = 360 - angB - 2 * angA;
            } while (angA === angB);
            return [angB, angA, angC, angA];
        }
};

function newSquare(center) {
    var center = center || [0, 0];
    return new Quadrilateral(center, randomQuadAngles.square(), 1 , "", 3);
}

function newRectangle(center) {
    var center = center || [0, 0];
    return new Quadrilateral(center, randomQuadAngles.rectangle() , KhanUtil.randFromArray([0.2, 0.5, 0.7, 1.5]) , "", 3);
}

function newRhombus(center) {
    var center = center || [0, 0];
    return new Quadrilateral(center, randomQuadAngles.rhombus(), 1 , "", 3);
}

function newParallelogram(center) {
    var center = center || [0, 0];
    return new Quadrilateral(center, randomQuadAngles.parallelogram(), KhanUtil.randFromArray([0.2, 0.5, 0.7, 1.5]) , "", 3);
}

function newTrapezoid(center) {
    var center = center || [0, 0];
    return new Quadrilateral(center, randomQuadAngles.trapezoid(), KhanUtil.randFromArray([0.2, 0.5, 0.7, 1.5]) , "", 3);
}

function newKite(center) {
    var center = center || [0, 0];
    var angA = KhanUtil.randRange(90, 140);
    var angB = KhanUtil.randRange(30, (360 - (2 * angA)) - 30);
    var angC = 360 - angB - 2 * angA;
    return new Quadrilateral(center, randomQuadAngles.kite(), 1 , "", 2);
}

$.extend(KhanUtil, {

    // Creates a representation of a weird blocky shape that you can find
    // the perimeter or area of
    createOddShape: function(options) {
        shape = $.extend({
            width: 10,
            height: 10,
            squares: [],
            sides: []
        }, options);

        // Start at the top of the shape and pick a random left and right
        // edge for the top row.
        var y = shape.height - 1;
        var left = KhanUtil.randRange(0, shape.width - 1);
        var right = KhanUtil.randRange(left + 1, shape.width);

        // Add the top side
        shape.sides.push({
            start: [left, y],
            end: [right, y],
            length: right - left,
            labelPos: "above"
        });
        // The y-positions where the next vertical line on the left and
        // right sides of the figure starts.
        var leftStart = y;
        var rightStart = y;

        // Add each square in the top row
        _(right - left).times(function(dx) {
            shape.squares.push([left + dx, y]);
        });

        // Iterate through each subsequent row
        while (y > 2) {
            y -= 1;
            // Pick a new left and right edge for each row, with a 70%
            // probability of continuing on the same row as the row above
            var prevLeft = left;
            var prevRight = right;
            left = KhanUtil.randRangeWeighted(0, prevRight - 1, prevLeft, 0.7);
            right = KhanUtil.randRangeWeighted(Math.max(left, prevLeft) + 1,
                shape.width, prevRight, 0.7);

            // Add each square in this row
            _(right - left).times(function(dx) {
                shape.squares.push([left + dx, y]);
            });

            // If the left side isn't the same as the row above,
            // add a new vertical and horizontal side
            if (left !== prevLeft) {
                shape.sides.push({
                    start: [prevLeft, leftStart],
                    end: [prevLeft, y],
                    length: leftStart - y,
                    labelPos: "left"
                });
                shape.sides.push({
                    start: [prevLeft, y],
                    end: [left, y],
                    length: Math.abs(left - prevLeft),
                    labelPos: "center"
                });
                // record where the next vertical side on the left starts
                leftStart = y;
            }

            // If the right side isn't the same as the row above,
            // add a new vertical and horizontal side
            if (right !== prevRight) {
                shape.sides.push({
                    start: [prevRight, rightStart],
                    end: [prevRight, y],
                    length: rightStart - y,
                    labelPos: "right"
                });
                shape.sides.push({
                    start: [prevRight, y],
                    end: [right, y],
                    length: Math.abs(right - prevRight),
                    labelPos: "center"
                });
                // record where the next vertical side on the right starts
                rightStart = y;
            }
        }

        // Add the last left and right vertical sides
        shape.sides.push({
            start: [left, leftStart],
            end: [left, 1],
            length: leftStart - 1,
            labelPos: "left"
        });
        shape.sides.push({
            start: [right, rightStart],
            end: [right, 1],
            length: rightStart - 1,
            labelPos: "right"
        });

        // Add the bottom side
        shape.sides.push({
            start: [left, 1],
            end: [right, 1],
            length: right - left,
            labelPos: "below"
        });

        shape.perimeter = _.reduce(shape.sides, function(perimeter, side) {
                return perimeter + side.length;
            }, 0);

        shape.area = shape.squares.length;

        shape.numSides = shape.sides.length;

        shape.labelSquares = function() {
            _.each(shape.squares, function(square, n) {
                KhanUtil.currentGraph.label([square[0] + 0.5, square[1] - 0.5],
                    n + 1, "center", false);
            });
        };

        shape.labelSides = function() {
            _.each(shape.sides, function(side) {
                KhanUtil.currentGraph.label([(side.start[0] + side.end[0]) / 2,
                    (side.start[1] + side.end[1]) / 2], side.length,
                    side.labelPos);
            });
        };

        return shape;
    }
});


// The following triangley code creates hopefully more legible triangles
// TODO(eater): Collapse this stuff into the existing triangle code above
//              without breaking a bunch of stuff (and refactor things so
//              Quadrilateral no longer inherits from Triangle)
//
//            angles[0]
//               /\
//              /  \
//    sides[1] /    \ sides[2]
//            /      \
//           /________\
// angles[2]  sides[0]  angles[1]
//

// The following solves the triangle by filling in any side and angle measures
// that were not included.
//
// The sides and angles included must unambiguously specify one triangle. duh.
// If not, behavior is undefined.
//
KhanUtil.solveTriangle = function(triangle) {
    var sides = triangle.sides;
    var angles = triangle.angles;
    var numSides = _.reduce(sides, function(n, side) {
        return n + (typeof side === "number" ? 1 : 0);
    }, 0);
    var numAngles = _.reduce(angles, function(n, angle) {
        return n + (typeof angle === "number" ? 1 : 0);
    }, 0);

    // If we have 2 sides, we must have the angle opposite the unknown side.
    // (SAS is the only valid postulate in this case)
    // We can use the law of cosines to find the third side
    if (numSides === 2) {
        var missingSide = sides.indexOf(null);
        var side1 = sides[(missingSide + 1) % 3];
        var side2 = sides[(missingSide + 2) % 3];
        sides[missingSide] = Math.sqrt(side1 * side1 + side2 * side2 - 2 *
            side1 * side2 * Math.cos(angles[missingSide] * Math.PI / 180));
        numSides = 3;
    }

    // If we have all three sides, we can use the law of cosines to find all
    // the angles
    if (numSides === 3) {
        // Use law of cosines to find all the angles
        angles = _.map(angles, function(angle, n) {
            var oppSide = sides[n];
            var adjSide1 = sides[(n + 1) % 3];
            var adjSide2 = sides[(n + 2) % 3];
            return Math.acos((adjSide1 * adjSide1 + adjSide2 * adjSide2 -
                oppSide * oppSide) / (2 * adjSide1 * adjSide2));
        });
        angles = _.map(angles, KhanUtil.toDegrees);
    }

    // If we have 2 angles, we can easily fill in the third angle
    if (numAngles === 2) {
        var missingAngle = angles.indexOf(null);
        angles[missingAngle] = 180 - angles[(missingAngle + 1) % 3] -
            angles[(missingAngle + 2) % 3];
        numAngles = 3;
    }

    // 3 angles and 1 side is enough to figure out the rest of the sides using
    // the law of sines
    if (numAngles === 3 && numSides >= 1) {
        var knownSide = sides.indexOf(sides[0] || sides[1] || sides[2]);
        sides[(knownSide + 1) % 3] = (sides[knownSide] *
            Math.sin(angles[(knownSide + 1) % 3] * Math.PI / 180))
            / Math.sin(angles[knownSide] * Math.PI / 180);
        sides[(knownSide + 2) % 3] = (sides[knownSide] *
            Math.sin(angles[(knownSide + 2) % 3] * Math.PI / 180))
            / Math.sin(angles[knownSide] * Math.PI / 180);
    }

    triangle.sides = sides;
    triangle.angles = angles;

    triangle.isRight = function() {
        return (this.angles[0] === 90 || this.angles[1] === 90 ||
            this.angles[2] === 90);
    };

    triangle.isScalene = function() {
        return (this.angles[0] !== this.angles[1] &&
            this.angles[1] !== this.angles[2] &&
            this.angles[0] !== this.angles[2]);
    }

    triangle.isNotDegenerate = function() {
        return (this.sides[1] + this.sides[2] > this.sides[0] &&
            this.sides[0] + this.sides[2] > this.sides[1] &&
            this.sides[0] + this.sides[1] > this.sides[2]);
    };

    return triangle;
};


KhanUtil.Graphie.prototype.addTriangle = function(triangle) {
    var graphie = this;
    triangle = $.extend({
        sides: [],
        angles: [],
        points: [],
        sideLabels: [],
        angleLabels: [],
        vertexLabels: [],
        labels: [],
        rot: 0,
        xPos: 0,
        yPos: 0,
        width: 10,
        height: 10,
        color: KhanUtil.BLUE
    }, triangle);

    var getDistance = function(point1, point2) {
        return Math.sqrt((point1[0] - point2[0]) * (point1[0] - point2[0])
            + (point1[1] - point2[1]) * (point1[1] - point2[1]));
    };

    var rotatePoint = function(point, angle) {
        var matrix = KhanUtil.makeMatrix([
            [Math.cos(angle), -Math.sin(angle), 0],
            [Math.sin(angle), Math.cos(angle), 0],
            [0, 0, 1]
        ]);
        var vector = KhanUtil.makeMatrix([[point[0]], [point[1]], [1]]);
        var prod = KhanUtil.matrixMult(matrix, vector);
        return [prod[0][0], prod[1][0]];
    };

    var findCenterPoints = function(triangle, points) {
        var Ax = points[0][0];
        var Ay = points[0][1];
        var Bx = points[1][0];
        var By = points[1][1];
        var Cx = points[2][0];
        var Cy = points[2][1];
        var D = 2 * (Ax * (By - Cy) + Bx * (Cy - Ay) + Cx * (Ay - By));
        var a = triangle.sides[0];
        var b = triangle.sides[1];
        var c = triangle.sides[2];
        var P = a + b + c;
        var x1 = (a * Ax + b * Bx + c * Cx) / P;
        var y1 = (a * Ay + b * By + c * Cy) / P;
        var x = ((Ay * Ay + Ax * Ax) * (By - Cy) + (By * By + Bx * Bx) *
            (Cy - Ay) + (Cy * Cy + Cx * Cx) * (Ay - By)) / D;
        var y = ((Ay * Ay + Ax * Ax) * (Cx - Bx) + (By * By + Bx * Bx) *
            (Ax - Cx) + (Cy * Cy + Cx * Cx) * (Bx - Ax)) / D;
        return {
            circumCenter: [x, y],
            centroid: [1 / 3 * (Ax + Bx + Cx), 1 / 3 * (Ay + By + Cy)],
            inCenter: [x1, y1]
        };
    };

    triangle.draw = function() {
        if (triangle.set != null) {
            triangle.set.remove();
        }
        _.each(triangle.labels, function(lbl) {
            lbl.remove();
        });
        triangle.set = graphie.raphael.set();
        triangle.set.push(graphie.path(triangle.points.concat([true]),{
            stroke: triangle.color
        }));

        var centerPoints = findCenterPoints(triangle, triangle.points);
        _(3).times(function(i) {
            if (triangle.angleLabels[i] != null) {
                var ang = Math.atan2(centerPoints.inCenter[1] -
                    triangle.points[i][1], centerPoints.inCenter[0] -
                    triangle.points[i][0]);

                // The angle measure label needs to be further from the vertex
                // for small angles and closer for large angles. This is an
                // empirically determined formula for figuring out how far.
                var labelDist = (3.51470560176242 - 0.5687298702748785) *
                    Math.exp(-0.037587715462826674 * triangle.angles[i]) +
                    0.5687298702748785;

                triangle.labels.push(graphie.label([
                    triangle.points[i][0] + Math.cos(ang) * labelDist,
                    triangle.points[i][1] + Math.sin(ang) * labelDist],
                    triangle.angleLabels[i], "center"));
            }
        });

        _(3).times(function(i) {
            if (triangle.sideLabels[i] != null) {
                var x = (triangle.points[(i + 1) % 3][0] +
                    triangle.points[(i + 2) % 3][0]) / 2;
                var y = (triangle.points[(i + 1) % 3][1] +
                    triangle.points[(i + 2) % 3][1]) / 2;
                var ang;
                var labelDist = 0.4;
                if (triangle.angles[i] < 90) {
                    ang = Math.atan2(y - centerPoints.circumCenter[1],
                        x - centerPoints.circumCenter[0]);
                } else if (triangle.angles[i] > 90) {
                    ang = Math.atan2(centerPoints.circumCenter[1] - y,
                        centerPoints.circumCenter[0] - x);
                } else {
                    ang = Math.atan2(y - centerPoints.centroid[1],
                        x - centerPoints.centroid[0]);
                }

                triangle.labels.push(graphie.label([x, y],
                    triangle.sideLabels[i], ang));
            }
        });

        _(3).times(function(i) {
            if (triangle.vertexLabels[i] != null) {
                var ang = Math.atan2(triangle.points[i][1] -
                    centerPoints.inCenter[1], triangle.points[i][0] -
                    centerPoints.inCenter[0]);
                var labelDist = 0.4;

                var lbl = graphie.label([
                    triangle.points[i][0] + Math.cos(ang) * labelDist,
                    triangle.points[i][1] + Math.sin(ang) * labelDist],
                    triangle.vertexLabels[i], "center");
                lbl.css("color", triangle.color);
                triangle.labels.push(lbl);
            }
        });
    };

    triangle.points[2] = [0, 0];
    triangle.points[1] = [triangle.sides[0], 0];
    triangle.points[0] = [Math.cos(triangle.angles[2] * Math.PI / 180) *
        triangle.sides[1], Math.sin(triangle.angles[2] * Math.PI / 180) *
        triangle.sides[1]];

    // Rotate the triangle
    triangle.points[0] = rotatePoint(triangle.points[0], triangle.rot *
        Math.PI / 180);
    triangle.points[1] = rotatePoint(triangle.points[1], triangle.rot *
        Math.PI / 180);
    triangle.points[2] = rotatePoint(triangle.points[2], triangle.rot *
        Math.PI / 180);

    // Scale and translate the triangle such that it fits within the
    // specified width/height constraint and is positioned at xPos, yPos
    var minX = _.min(_.map(triangle.points, function(p) { return p[0]; }));
    var maxX = _.max(_.map(triangle.points, function(p) { return p[0]; }));
    var minY = _.min(_.map(triangle.points, function(p) { return p[1]; }));
    var maxY = _.max(_.map(triangle.points, function(p) { return p[1]; }));
    var xScale = triangle.width / (maxX - minX);
    var yScale = triangle.height / (maxY - minY);
    var scale = _.min([xScale, yScale]);
    triangle.width = (maxX - minX) * scale;
    triangle.height = (maxY - minY) * scale;

    triangle.points = _.map(triangle.points, function(p) {
        return [(p[0] - minX) * scale + triangle.xPos,
            (p[1] - minY) * scale + triangle.yPos];
    });

    return triangle;
};
