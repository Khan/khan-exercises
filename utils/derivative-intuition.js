$.extend(KhanUtil, {
    FN_COLOR: "#6495ED",
    DDX_COLOR: "#FFA500",
    TANGENT_COLOR: "#AAA",
    TANGENT_LINE_LENGTH: 200,
    TANGENT_GROWTH_FACTOR: 3,
    TANGENT_SHIFT: 5,

    // Wrap graphInit to create a 600x600px graph properly scaled to the given range
    initAutoscaledGraph: function(range, options) {
        var graph = KhanUtil.currentGraph;
        options = $.extend({
            xpixels: 500,
            ypixels: 500,
            xdivisions: 20,
            ydivisions: 20,
            labels: true,
            unityLabels: true,
            range: (typeof range === "undefined" ? [[-10, 10], [-10, 10]] : range)
        }, options);

        options.scale = [options.xpixels / (options.range[0][1] - options.range[0][0]),
                          options.ypixels / (options.range[1][1] - options.range[1][0])];
        options.gridStep = [(options.range[0][1] - options.range[0][0]) / options.xdivisions,
                             (options.range[1][1] - options.range[1][0]) / options.ydivisions];

        // Attach the resulting metrics to the graph for later reference
        graph.xpixels = options.xpixels;
        graph.ypixels = options.ypixels;
        graph.range = options.range;
        graph.scale = options.scale;

        graph.graphInit(options);
    },


    // start the magic
    initDerivativeIntuition: function(fnx, ddx, points) {
        var graph = KhanUtil.currentGraph;

        KhanUtil.fnx = fnx;
        KhanUtil.ddx = ddx;
        KhanUtil.points = points;
        KhanUtil.highlight = false;
        KhanUtil.dragging = false;
        KhanUtil.ddxShown = false;

        // to store the SVG paths
        graph.tangentLines = [];
        graph.tangentPoints = [];
        graph.slopePoints = [];
        graph.mouseTargets = [];

        // graphie puts text spans on top of the SVG, which looks good, but gets
        // in the way of mouse events. So we add another SVG element on top
        // of everything else where we can add invisible shapes with mouse
        // handlers wherever we want. Is there a better way?
        graph.mouselayer = Raphael("ddxplot", graph.xpixels, graph.ypixels);
        $(graph.mouselayer.canvas).css("z-index", 1);

        // plot all the tangent lines first so they're underneath the tangent/slope points
        $(points).each(function(index, xval) {
            KhanUtil.plotTangentLine(index);
        });

        $(points).each(function(index, xval) {
            // blue points
            KhanUtil.plotTangentPoint(index);
            // orange points and mouse magic
            KhanUtil.plotSlopePoint(index);
        });

        // Once the problem loads, call setSlope() for each point to set the
        // slopes to 0. This replicates the action of the user placing each point
        // at zero and applies the same "close enough" test so very small slopes
        // aren't graded wrong even if they look almost right.
        $(Exercises).one("newProblem", function() {
            $(points).each(function(index, xval) {
                KhanUtil.setSlope(index, 0);
            });
        });
    },


    plotTangentLine: function(index) {
        var graph = KhanUtil.currentGraph;
        var xval = KhanUtil.points[index];
        var yval = KhanUtil.fnx(xval);

        // Now the fun bit: To make it clear that the tangent line only
        // touches at a single point, it's shifted a little bit above or
        // below the curve.

        // The shifted pivot point; defaults to unshifted xval/yval in
        // case we're dealing with an inflection point.
        var xshift = xval;
        var yshift = yval;

        // The slope of a line perpendicular to the tangent line. It is
        // along this direction that we shift the tangent line.
        var perpslope = 0;

        // First and second derivative at the point we're dealing with.
        var ddx1 = KhanUtil.ddx(xval);
        var ddx2 = (KhanUtil.ddx(xval - 0.001) - KhanUtil.ddx(xval + 0.001)) / 0.002;

        if (ddx1 !== 0) {
            // We want to shift *visually* perpendicular to the tangent line,
            // so if the graph has different x and y scales, perpslope isn't
            // quite as simple as (-1/slope)
            perpslope = (-1 / (ddx1 * (graph.scale[1] / graph.scale[0]))) / (graph.scale[1] / graph.scale[0]);

            // Second derivative tells us if the curve is concave up or down, thus which way to
            // shift the tangent line to "get away" from the curve. If perpslope is negative,
            // everything is reversed.
            if ((ddx2 > 0 && perpslope > 0) || (ddx2 < 0 && perpslope < 0)) {
                // atan(perpslope) is the direction to shift; cos() of that gives the x component; the rest of the mess normalizes for different x- and y-scales
                xshift = xval + Math.cos(Math.atan(perpslope * (graph.scale[1] / graph.scale[0]))) * KhanUtil.TANGENT_SHIFT / (2 * graph.scale[0]);
                yshift = perpslope * (xshift - xval) + yval;
            } else if ((ddx2 < 0 && perpslope > 0) || (ddx2 > 0 && perpslope < 0)) {
                xshift = xval - Math.cos(Math.atan(perpslope * (graph.scale[1] / graph.scale[0]))) * KhanUtil.TANGENT_SHIFT / (2 * graph.scale[0]);
                yshift = perpslope * (xshift - xval) + yval;
            }
        } else {
            // Slope is 0, so perpslope is undefined. Just shift up or down based on concavity
            if (ddx2 < 0) {
                yshift = yval - (KhanUtil.TANGENT_SHIFT / (2 * graph.scale[1]));
            } else if (ddx2 > 0) {
                yshift = yval + (KhanUtil.TANGENT_SHIFT / (2 * graph.scale[1]));
            }
        }

        // at last the slightly nudged line is ready to draw
        graph.style({
            stroke: KhanUtil.TANGENT_COLOR,
            strokeWidth: 2
        }, function() {
            graph.tangentLines[index] = graph.line(
                    [xshift - KhanUtil.TANGENT_LINE_LENGTH / (2 * graph.scale[0]), yshift],
                    [xshift + KhanUtil.TANGENT_LINE_LENGTH / (2 * graph.scale[0]), yshift]);
        });
    },


    plotTangentPoint: function(index) {
        var graph = KhanUtil.currentGraph;
        var xval = KhanUtil.points[index];

        graph.style({
            fill: KhanUtil.FN_COLOR,
            stroke: KhanUtil.FN_COLOR
        }, function() {
            graph.tangentPoints[index] = graph.ellipse([xval, KhanUtil.fnx(xval)], [4 / graph.scale[0], 4 / graph.scale[1]]);
        });
    },


    plotSlopePoint: function(index) {
        var graph = KhanUtil.currentGraph;
        var xval = KhanUtil.points[index];

        graph.style({
            fill: KhanUtil.DDX_COLOR,
            stroke: KhanUtil.DDX_COLOR
        }, function() {
            graph.slopePoints[index] = graph.ellipse([xval, 0], [4 / graph.scale[0], 4 / graph.scale[1]]);
        });

        // the invisible shape in front of each point that gets mouse events
        graph.mouseTargets[index] = graph.mouselayer.circle(
                (xval - graph.range[0][0]) * graph.scale[0],
                (graph.range[1][1] - 0) * graph.scale[1], 15);
        graph.mouseTargets[index].attr({fill: "#000", "opacity": 0.0});

        $(graph.mouseTargets[index][0]).css("cursor", "move");
        $(graph.mouseTargets[index][0]).bind("vmousedown vmouseover vmouseout", function(event) {
            event.preventDefault();
            var graph = KhanUtil.currentGraph;
            if (event.type === "vmouseover") {
                KhanUtil.highlight = true;
                if (!KhanUtil.dragging) {
                    graph.slopePoints[index].animate({ scale: 2 }, 50);
                    graph.tangentLines[index].animate({ "stroke": KhanUtil.DDX_COLOR }, 100);
                }

            } else if (event.type === "vmouseout") {
                KhanUtil.highlight = false;
                if (!KhanUtil.dragging) {
                    graph.slopePoints[index].animate({ scale: 1 }, 50);
                    graph.tangentLines[index].animate({ "stroke": KhanUtil.TANGENT_COLOR }, 100);
                }

            } else if (event.type === "vmousedown" && (event.which === 1 || event.which === 0)) {
                event.preventDefault();
                graph.tangentLines[index].toFront();
                graph.tangentPoints[index].toFront();
                graph.slopePoints[index].toFront();
                graph.tangentLines[index].animate({ scale: KhanUtil.TANGENT_GROWTH_FACTOR }, 200);
                KhanUtil.dragging = true;

                $(document).bind("vmousemove vmouseup", function(event) {
                    event.preventDefault();

                    // mouseY is in pixels relative to the SVG; coordY is the scaled y-coordinate value
                    var mouseY = event.pageY - $("#ddxplot").offset().top;
                    mouseY = Math.max(10, Math.min(graph.ypixels - 10, mouseY));
                    var coordY = graph.range[1][1] - mouseY / graph.scale[1];

                    if (event.type === "vmousemove") {
                        $($("div#solutionarea :text")[index]).val(KhanUtil.roundTo(2, coordY));
                        $($("div#solutionarea .answer-label")[index]).text(KhanUtil.roundTo(2, coordY));
                        graph.tangentLines[index].rotate(-Math.atan(coordY * (graph.scale[1] / graph.scale[0])) * (180 / Math.PI), true);
                        graph.slopePoints[index].attr("cy", mouseY);
                        graph.mouseTargets[index].attr("cy", mouseY);

                    } else if (event.type === "vmouseup") {
                        $(document).unbind("vmousemove vmouseup");

                        KhanUtil.setSlope(index, coordY);

                        KhanUtil.dragging = false;

                        graph.tangentLines[index].animate({ scale: 1 }, 200);
                        if (!KhanUtil.highlight) {
                            graph.slopePoints[index].animate({ scale: 1 }, 200);
                            graph.tangentLines[index].animate({ "stroke": KhanUtil.TANGENT_COLOR }, 100);
                        }

                        // If all the points are in the right place, reveal the derivative function
                        var answers = $.map($("div#solutionarea .answer-label"), function(x) {
                            return parseFloat($(x).text());
                        });
                        var correct = $.map(KhanUtil.points, function(x) {
                            return KhanUtil.roundTo(2, KhanUtil.ddx(x));
                        });
                        if (answers.join() === correct.join()) {
                            KhanUtil.revealDerivative(400);
                        }
                    }
                });
            }
        });

    },


    // Set the slope for one point. Snap to the right answer if we're close enough.
    setSlope: function(index, coordY) {
        var graph = KhanUtil.currentGraph;
        var answer = KhanUtil.ddx(KhanUtil.points[index]);
        var degreesOff = Math.abs(Math.atan(answer * graph.scale[1] / graph.scale[0]) -
                Math.atan(coordY * graph.scale[1] / graph.scale[0])) * (180 / Math.PI);

        // How far off you're allowed to be
        if (degreesOff < 7) {
            coordY = answer;
        }

        $($("div#solutionarea :text")[index]).val(KhanUtil.roundTo(2, coordY));
        $($("div#solutionarea .answer-label")[index]).text(KhanUtil.roundTo(2, coordY));
        graph.tangentLines[index].rotate(-Math.atan(coordY * (graph.scale[1] / graph.scale[0])) * (180 / Math.PI), true);
        graph.slopePoints[index].attr("cy", (graph.range[1][1] - coordY) * graph.scale[1]);
        graph.mouseTargets[index].attr("cy", (graph.range[1][1] - coordY) * graph.scale[1]);
    },


    // Shows the derivative plot and equation
    // Called when all the points are in the right place or as a hint
    revealDerivative: function(duration) {
        if (!KhanUtil.ddxShown) {
            var graph = KhanUtil.currentGraph;
            var ddxplot;
            duration = duration || 0;
            graph.style({
                stroke: KhanUtil.DDX_COLOR,
                strokeWidth: 1,
                opacity: duration === 0 ? 1 : 0
            }, function() {
                ddxplot = graph.plot(function(x) {
                    return KhanUtil.ddx(x);
                }, KhanUtil.tmpl.getVAR("XRANGE"));
            });

            $("span#ddxspan").show();  // for IE
            $("span#ddxspan").fadeTo(duration, 1);

            ddxplot.animate({ opacity: 1 }, duration);
            KhanUtil.ddxShown = true;
        }
    }

});
