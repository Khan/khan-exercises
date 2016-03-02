/* TODO(csilvers): fix these lint errors (http://eslint.org/docs/rules): */
/* eslint-disable brace-style, comma-dangle, indent, max-len, no-redeclare, no-trailing-spaces, no-undef, no-var, one-var, prefer-spread, space-unary-ops */
/* To fix, remove an entry above, run ka-lint, and fix errors. */

define(function(require) {

require("./math-format.js");

// Temporary not really following convention file, see #160

window.numberLine = function(start, end, step, x, y, denominator) {
    step = step || 1;
    x = x || 0;
    y = y || 0;
    var decPlaces = (step + "").length - (step + "").indexOf(".") - 1;
    if ((step + "").indexOf(".") < 0) {
        decPlaces = 0;
    }
    var graph = KhanUtil.currentGraph;
    var set = graph.raphael.set();
    set.push(graph.line([x, y], [x + end - start, y]));
    set.labels = [];
    for (var i = 0; i <= end - start; i += step) {
        set.push(graph.line([x + i, y - 0.2], [x + i, y + 0.2]));

        if (denominator) {
            var base = KhanUtil.roundTowardsZero(start + i + 0.001);
            var frac = start + i - base;
            var lab = base;

            if (! (Math.abs(Math.round(frac * denominator)) === denominator || Math.round(frac * denominator) === 0)) {
                if (base === 0) {
                    lab = KhanUtil.fraction(Math.round(frac * denominator), denominator, false, false, true);
                }
                else {
                    lab = base + "\\frac{" + Math.abs(Math.round(frac * denominator)) + "}{" + denominator + "}";
                }
            }
            var label = graph.label([x + i, y - 0.2], "\\small{" + lab + "}",
                "below", { labelDistance: 3 });
            set.labels.push(label);
            set.push(label);
        }
        else {
            var label = graph.label([x + i, y - 0.2],
                "\\small{" + KhanUtil.localeToFixed(start + i, decPlaces) + "}",
                "below", { labelDistance: 3 });
            set.labels.push(label);
            set.push(label);
        }
    }
    return set;
};

window.piechart = function(divisions, colors, radius, strokeColor, x, y) {
    var graph = KhanUtil.currentGraph;
    var set = graph.raphael.set();
    var arcColor = strokeColor || "none";
    var lineColor = strokeColor || "#fff";
    x = x || 0;
    y = y || 0;

    var sum = 0;
    $.each(divisions, function(i, slice) {
        sum += slice;
    });

    var partial = 0;
    $.each(divisions, function(i, slice) {
        if (slice === sum) {
            set.push(graph.ellipse([x, y], [radius, radius], {
                stroke: arcColor,
                fill: colors[i]
            }));
        } else {
            set.push(graph.arc([x, y], radius, partial * 360 / sum, (partial + slice) * 360 / sum, true, {
                stroke: arcColor,
                fill: colors[i]
            }));
        }
        partial += slice;
    });

    for (var i = 0; i < sum; i++) {
        var p = graph.polar(radius, i * 360 / sum);
        set.push(graph.line([x, y], [x + p[0], y + p[1]], { stroke: lineColor }));
    }

    return set;
};

// Shade a rectangular area with diagonal stripes. We need to use clipRect so
// that the ends of the diagonal lines are beveled at each end such that they
// conform to the overall area of the rectangle being shaded. So this actually
// draws the diagonal stripes over the entire graphie area and uses clipRect to
// only show them where desired.
//
// The pad argument is an optional number of pixels of padding. Positive
// numbers make the shaded area smaller.
window.shadeRect = function(x, y, width, height, pad) {
    var graph = KhanUtil.currentGraph;
    var set = graph.raphael.set();
    var x2 = graph.range[0][0];
    var y1 = graph.range[1][0];
    var y2 = graph.range[1][1];
    var x1 = x2 - (y2 - y1) * graph.scale[1] / graph.scale[0];
    var step = 8 / graph.scale[0];
    var xpad = (pad || 0) / graph.scale[0];
    var ypad = (pad || 0) / graph.scale[1];

    while (x1 < graph.range[0][1]) {
        set.push(graph.line([x1, y1], [x2, y2], {
            clipRect: [[x + xpad, y + ypad],
                      [width - 2 * xpad, height - 2 * ypad]]
        }));
        x1 += step;
        x2 += step;
    }
    return set;
};

window.rectchart = function(divisions, fills, y, strokes, shading) {
    var graph = KhanUtil.currentGraph;
    var set = graph.raphael.set();

    y = y || 0;

    var sum = 0;
    $.each(divisions, function(i, slice) {
        sum += slice;
    });

    var unit = graph.unscaleVector([1, 1]);
    var partial = 0;
    $.each(divisions, function(i, slice) {
        var fill = fills[i];
        // If no stroke is provided, match the fill color so the rectangle
        // appears to be the same size
        var stroke = strokes && strokes[i] || fill;

        for (var j = 0; j < slice; j++) {
            var x = partial / sum, w = 1 / sum;
            set.push(graph.path(
                [
                    [x + 2 * unit[0], y + 2 * unit[1]],
                    [x + w - 2 * unit[0], y + 2 * unit[1]],
                    [x + w - 2 * unit[0], y + 1 - 2 * unit[1]],
                    [x + 2 * unit[0], y + 1 - 2 * unit[1]],
                    true
                ],
                {
                    stroke: stroke,
                    fill: fill
                }
            ));
            if (shading && shading[i]) {
                graph.style({
                    stroke: "#000",
                    strokeWidth: 2,
                    strokeOpacity: 0.5,
                    fillOpacity: 0,
                    fill: null
                }, function() {
                    // We add or subtract a pixel of padding depending on
                    // whether there's a stroke. If there is, we only shade
                    // inside, otherwise we shade over the whole area. That's
                    // why the last argument to shadeRect is 1 or -1 (the width
                    // of the stroke is assumed to be 2)
                    set.push(shadeRect(
                        x + 2 * unit[0], y + 2 * unit[1],
                        w - 4 * unit[0], 1 - 4 * unit[1],
                        (strokes && strokes[i]) ? 1 : -1));
                });
            }
            partial += 1;
        }
    });

    return set;
};

window.Parabola = function(lc, x, y) {
    var leadingCoefficient = lc;
    var x1 = x;
    var y1 = y;
    var raphaelObjects = [];

    this.graphieFunction = function(x) {
        return (leadingCoefficient * (x - x1) * (x - x1)) + y1;
    };

    this.plot = function(fShowFocusDirectrix) {
        var graph = KhanUtil.currentGraph;
        raphaelObjects.push(graph.plot(this.graphieFunction, [-10, 10]));
        if (fShowFocusDirectrix) {
            var focusX = this.getFocusX();
            var focusY = this.getFocusY();
            var directrixK = this.getDirectrixK();

            graph.style({
                fill: "#6495ED"
            }, function() {
                raphaelObjects.push(graph.circle([focusX, focusY], 0.1));
                raphaelObjects.push(graph.line([-10, directrixK], [10, directrixK]));
            });
        }
    };

    this.redraw = function(fShowFocusDirectrix) {
        $.each(raphaelObjects, function(i, el) {
            el.remove();
        });
        raphaelObjects = [];
        this.plot(fShowFocusDirectrix);
    };

    this.update = function(newLC, newX, newY) {
        leadingCoefficient = newLC;
        x1 = newX;
        y1 = newY;
    };

    this.delta = function(deltaLC, deltaX, deltaY) {
        this.update(leadingCoefficient + deltaLC, x1 + deltaX, y1 + deltaY);
    };

    this.deltaFocusDirectrix = function(deltaX, deltaY, deltaK) {
        var focusY = this.getFocusY() + deltaY;
        var k = this.getDirectrixK() + deltaK;

        if (focusY === k) {
            focusY += deltaY;
            k += deltaK;
        }
        var newVertexY = (focusY + k) / 2;
        var newLeadingCoefficient = 1 / (2 * (focusY - k));

        this.update(newLeadingCoefficient, this.getVertexX() + deltaX, newVertexY);
    };

    this.getVertexX = function() {
        return x1;
    };

    this.getVertexY = function() {
        return y1;
    };

    this.getLeadingCoefficient = function() {
        return leadingCoefficient;
    };

    this.getFocusX = function() {
        return x1;
    };

    this.getFocusY = function() {
        return y1 + (1 / (4 * leadingCoefficient));
    };

    this.getDirectrixK = function() {
        return y1 - (1 / (4 * leadingCoefficient));
    };
};

window.redrawParabola = function(fShowFocusDirectrix) {
    var graph = KhanUtil.currentGraph;
    var storage = graph.graph;
    var currParabola = storage.currParabola;
    currParabola.redraw(fShowFocusDirectrix);

    var leadingCoefficient = currParabola.getLeadingCoefficient();
    var vertexX = currParabola.getVertexX();
    var vertexY = currParabola.getVertexY();

    if (fShowFocusDirectrix) {
        $("#focus-x-label").html("<code>" + currParabola.getFocusX() + "</code>").runModules();
        $("#focus-y-label").html("<code>" + KhanUtil.localeToFixed(currParabola.getFocusY(), 2) + "</code>").runModules();
        $("#directrix-label").html("<code>" + "y = " + KhanUtil.localeToFixed(currParabola.getDirectrixK(), 2) + "</code>").runModules();
    } else {
        var equation = "y - " + vertexY + "=" + leadingCoefficient + "(x - " + vertexX + ")^{2}";
        equation = KhanUtil.cleanMath(equation);
        $("#equation-label").html("<code>" + equation + "</code>").runModules();
    }
    $("#leading-coefficient input").val(leadingCoefficient);
    $("#vertex-x input").val(vertexX);
    $("#vertex-y input").val(vertexY);
};

window.updateParabola = function(deltaA, deltaX, deltaY, fShowFocusDirectrix) {
    KhanUtil.currentGraph.graph.currParabola.delta(deltaA, deltaX, deltaY);
    redrawParabola(fShowFocusDirectrix);
};

window.updateFocusDirectrix = function(deltaX, deltaY, deltaK) {
    KhanUtil.currentGraph.graph.currParabola.deltaFocusDirectrix(deltaX, deltaY, deltaK);
    redrawParabola(true);
};

window.ParallelLineMarkers = function(x, y, rotation) {
    var graph = KhanUtil.currentGraph;
    rotation = rotation || 0;

    var s = 8 / graph.scaleVector([1, 1])[0];
    var x2 = x + 0.75 * s * Math.cos(rotation);
    var y2 = y + 0.75 * s * Math.sin(rotation);
    var dx1 = s * Math.cos(rotation + Math.PI / 4);
    var dy1 = s * Math.sin(rotation + Math.PI / 4);
    var dx2 = s * Math.cos(rotation - Math.PI / 4);
    var dy2 = s * Math.sin(rotation - Math.PI / 4);

    graph.path([[x - dx1, y - dy1], [x, y], [x - dx2, y - dy2]]);
    graph.path([[x2 - dx1, y2 - dy1], [x2, y2], [x2 - dx2, y2 - dy2]]);
};

// A pair of parallel lines with a line traversing them.
// Lines are centered on x, y, with a given length and a given distance apart.
window.ParallelLines = function(x, y, length, distance, rotation) {
    var lowerIntersection;
    var upperIntersection;
    var anchorAngle;

    var dx1 = distance / 2 * Math.cos(rotation + Math.PI / 2);
    var dy1 = distance / 2 * Math.sin(rotation + Math.PI / 2);
    var dx2 = length / 2 * Math.cos(rotation);
    var dy2 = length / 2 * Math.sin(rotation);
    var labels = {};

    this.draw = function() {
        var graph = KhanUtil.currentGraph;
        graph.line([x + dx1 + dx2, y + dy1 + dy2], [x + dx1 - dx2, y + dy1 - dy2]);
        graph.line([x - dx1 + dx2, y - dy1 + dy2], [x - dx1 - dx2, y - dy1 - dy2]);
    };

    this.drawMarkers = function(position) {
        var graph = KhanUtil.currentGraph;
        var pmarkX = 0;
        var pmarkY = 0;
        var s = 120 / graph.scaleVector([1, 1])[0];

        if (position === "right" || (position >= 40 && position <= 140)) {
            pmarkX += s * Math.cos(rotation);
            pmarkY += s * Math.sin(rotation);
        } else if (position === "left") {
            pmarkX -= s * Math.cos(rotation);
            pmarkY -= s * Math.sin(rotation);
        }
        ParallelLineMarkers(x + dx1 + pmarkX, y + dy1 + pmarkY, rotation);
        ParallelLineMarkers(x - dx1 + pmarkX, y - dy1 + pmarkY, rotation);
    };

    this.drawTransverse = function(angleDeg) {
        var graph = KhanUtil.currentGraph;
        var angleRad = KhanUtil.toRadians(angleDeg);

        var cosAngle = Math.cos(rotation + angleRad);
        var sinAngle = Math.sin(rotation + angleRad);
        var dx3 = 0.5 * length * cosAngle;
        var dy3 = 0.5 * length * sinAngle; 
        graph.line([x + dx3, y + dy3], [x - dx3, y - dy3]);

        // Find intersections
        var hypot = 0.5 * distance / Math.cos(Math.PI / 2 - angleRad);
        var dx4 = hypot * cosAngle;
        var dy4 = hypot * sinAngle;

        upperIntersection = [x + dx4, y + dy4];
        lowerIntersection = [x - dx4, y - dy4];
        anchorAngle = angleDeg;
    };

    function labelAngle(index, coords, angles, color, text) {
        var graph = KhanUtil.currentGraph;
        var measure = (angles[1] - angles[0]);
        var bisect = KhanUtil.toRadians(angles[0] + measure / 2);
        var radius = 0.7;

        if (measure < 70) { // control for angle label getting squeezed between intersecting lines
            radius /= Math.cos(KhanUtil.toRadians(70 - measure));
        }

        var dx = radius * Math.cos(bisect);
        var dy = radius * Math.sin(bisect);
        var placement = "center";

        if (typeof text === "boolean") {
            text = (angles[1] - angles[0]) + "^\\circ";
        }

        // Slightly hacky way to align the equations in vertical_angles_2
        if (text.length > 10 && Math.abs(dx) > 0.25) {
            dx *= 0.6;
            dy *= 0.8;
            placement = dx > 0 ? "right" : "left";
        }

        // Remove old label
        if (labels[index]) {
            labels[index].remove();
        }

        labels[index] = graph.label([coords[0] + dx, coords[1] + dy], text, placement, { color: color });
    }

    this.drawAngle = function(index, label, color) {
        var graph = KhanUtil.currentGraph;
        var radius = 0.4;

        color = color || KhanUtil.BLUE;
        index = (index + 8) % 8;
        var args = index < 4 ? [lowerIntersection, radius] : [upperIntersection, radius];

        var angles = [KhanUtil.toDegrees(rotation), KhanUtil.toDegrees(rotation)];
        switch (index % 4) {
            case 0: // Quadrant 1
                angles[1] += anchorAngle;
                break;
            case 1: // Quadrant 2
                angles[0] += anchorAngle;
                angles[1] += 180;
                break;
            case 2: // Quadrant 3
                angles[0] += 180;
                angles[1] += 180 + anchorAngle;
                break;
            case 3: // Quadrant 4
                angles[0] += 180 + anchorAngle;
                angles[1] += 360;
                break;
        }
        $.merge(args, angles);

        graph.style({ stroke: color}, function() {
            if (!labels[index]) {
                graph.arc.apply(graph, args);
            }

            if (label) {
                labelAngle(index, args[0], angles, color, label);
            }
        });
    };

    this.drawVerticalAngle = function(index, label, color) {
        index = (index + 8) % 8;
        var vert = (index + 2) % 4;
        if (index >= 4) {
            vert += 4;
        }
        this.drawAngle(vert, label, color);
    };

    this.drawAdjacentAngles = function(index, label, color) {
        index = (index + 8) % 8;
        var adj1 = (index + 1) % 4;
        var adj2 = (index + 3) % 4;
        if (index >= 4) {
            adj1 += 4;
            adj2 += 4;
        }
        this.drawAngle(adj1, label, color);
        this.drawAngle(adj2, label, color);
    };
};

window.drawComplexChart = function(radius, denominator) {
    var graph = KhanUtil.currentGraph;
    var safeRadius = radius * Math.sqrt(2);
    var color = "#ddd";

    // Draw lines of complex numbers with same angle and
    // circles of complex numbers with same radius to help the intuition.

    graph.style({
        strokeWidth: 1.0
    });

    for (var i = 1; i <= safeRadius; i++) {
        graph.circle([0, 0], i, {
            fill: "none",
            stroke: color
        });
    }

    for (var i = 0; i < denominator; i++) {
        var angle = i * 2 * Math.PI / denominator;
        if (denominator % 4 === 0 && i % (denominator / 4) !== 0) { // Don't draw over axes.
            graph.line([0, 0], [Math.sin(angle) * safeRadius, Math.cos(angle) * safeRadius], {
                stroke: color
            });
        }
    }

    graph.label([radius, 0.5], "Re", "left");
    graph.label([0.5, radius - 1], "Im", "right");
};

window.ComplexPolarForm = function(angleDenominator, maxRadius, euler) {
    var denominator = angleDenominator;
    var maximumRadius = maxRadius;
    var angle = 0, radius = 1;
    var circle;
    var useEulerForm = euler;

    this.update = function(newAngle, newRadius) {
        angle = newAngle;
        while (angle < 0) {
            angle += denominator;
        }
        angle %= denominator;

        radius = Math.max(1, Math.min(newRadius, maximumRadius)); // keep between 0 and maximumRadius...

        this.redraw();
    };

    this.delta = function(deltaAngle, deltaRadius) {
        this.update(angle + deltaAngle, radius + deltaRadius);
    };

    this.getAngleNumerator = function() {
        return angle;
    };

    this.getAngleDenominator = function() {
        return denominator;
    };

    this.getAngle = function() {
        return angle * 2 * Math.PI / denominator;
    };

    this.getRadius = function() {
        return radius;
    };

    this.getRealPart = function() {
        return Math.cos(this.getAngle()) * radius;
    };

    this.getImaginaryPart = function() {
        return Math.sin(this.getAngle()) * radius;
    };

    this.getUseEulerForm = function() {
        return useEulerForm;
    };

    this.plot = function() {
        circle = KhanUtil.currentGraph.circle([this.getRealPart(), this.getImaginaryPart()], 1 / 4, {
            fill: KhanUtil.ORANGE,
            stroke: "none"
        });
    };

    this.redraw = function() {
        if (circle) {
            circle.remove();
        }
        this.plot();
    };
};

window.updateComplexPolarForm = function(deltaAngle, deltaRadius) {
    KhanUtil.currentGraph.graph.currComplexPolar.delta(deltaAngle, deltaRadius);
    redrawComplexPolarForm();
};

window.redrawComplexPolarForm = function(angle, radius) {
    var graph = KhanUtil.currentGraph;
    var storage = graph.graph;
    var point = storage.currComplexPolar;
    point.redraw();

    if (typeof radius === "undefined") {
        radius = point.getRadius();
    }
    if (typeof angle === "undefined") {
        angle = point.getAngleNumerator();
    }

    angle *= 2 * Math.PI / point.getAngleDenominator();

    var equation = KhanUtil.polarForm(radius, angle, point.getUseEulerForm());

    $("#number-label").html("<code>" + equation + "</code>").runModules();
    $("#current-radius").html("<code>" + radius + "</code>").runModules();
    $("#current-angle").html("<code>" + KhanUtil.piFraction(angle, true) + "</code>").runModules();
};

window.labelDirection = function(angle) {
    angle = angle % 360;
    if (angle === 0) {
        return "right";
    } else if (angle > 0 && angle < 90) {
        return "above right";
    } else if (angle === 90) {
        return "above";
    } else if (angle > 90 && angle < 180) {
        return "above left";
    } else if (angle === 180) {
        return "left";
    } else if (angle > 180 && angle < 270) {
        return "below left";
    } else if (angle === 270) {
        return "below";
    } else if (angle > 270 && angle < 360) {
        return "below right";
    }
};

// arc orientation is "top"|"left"|"bottom"|"right".
// arrow direction is clockwise (true) or counter-clockwise (false)
window.curvyArrow = function(center, radius, arcOrientation, arrowDirection, styles) {
    styles = styles || {};
    var graph = KhanUtil.currentGraph;
    var set = graph.raphael.set();
    var angles;
    if (arcOrientation === "left") {
        angles = [90, 270];
    } else if (arcOrientation === "right") {
        angles = [270, 90];
    } else if (arcOrientation === "top") {
        angles = [0, 180];
    } else if (arcOrientation === "bottom") {
        angles = [180, 0];
    }
    angles.push(styles);
    var arcArgs = [center, radius].concat(angles);
    set.push(graph.arc.apply(graph, arcArgs));

    var offset = graph.unscaleVector([1, 1]);

    // draw Arrows
    var from = _.clone(center);
    var to = _.clone(center);
    if (arcOrientation === "left" || arcOrientation === "right") {
        var left = arcOrientation === "left";
        from[1] = to[1] = to[1] + radius * (arrowDirection === left ? 1 : -1);
        to[0] = from[0] + offset[0] * (left ? 1 : -1);
    } else {
        var bottom = arcOrientation === "bottom";
        from[0] = to[0] = to[0] + radius * (arrowDirection === bottom ? 1 : -1);
        to[1] = from[1] + offset[1] * (bottom ? 1 : -1);
    }
    set.push(graph.line(from, to, _.extend({arrows: "->"}, styles)));
    return set;
};

window.curlyBrace = function(startPointGraph, endPointGraph) {
    var graph = KhanUtil.currentGraph;

    var startPoint = graph.scalePoint(startPointGraph);
    var endPoint = graph.scalePoint(endPointGraph);
    var angle = KhanUtil.findAngle(endPoint, startPoint);
    var length = KhanUtil.getDistance(endPoint, startPoint);
    var midPoint = _.map(startPoint, function(start, i) {
        return (start + endPoint[i]) / 2;
    });

    var specialLen = 16 * 2 + 13 * 2;
    if (length < specialLen) {
        throw new Error("Curly brace length is too short.");
    }
    var straight = (length - specialLen) / 2;
    var half = length / 2;

    var firstHook = "c 1 -3 6 -5 10 -6" +
                    "c 0 0 3 -1 6 -1";

    // Mirror of first hook.
    var secondHook = "c 3 1 6 1 6 1" +
                     "c 4 1 9 3 10 6";

    var straightPart = "l " + straight + " 0";

    var firstMiddle =
            "c 5 0 10 -3 10 -3" +
            "l 3 -4";

    // Mirror of second middle
    var secondMiddle =
            "l 3 4" +
            "c 0 0 5 3 10 3";

    var path = [
        "M -" + half + " 0",
        firstHook,
        straightPart,
        firstMiddle,
        secondMiddle,
        straightPart,
        secondHook
    ].join("");

    var brace = graph.raphael.path(path);
    brace.rotate(angle);
    brace.translate(midPoint[0], midPoint[1]);
    return brace;
};

});
