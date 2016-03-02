/* TODO(csilvers): fix these lint errors (http://eslint.org/docs/rules): */
/* eslint-disable comma-dangle, indent, max-len, no-redeclare, no-undef, no-var, one-var, prefer-spread, space-infix-ops, space-unary-ops */
/* To fix, remove an entry above, run ka-lint, and fix errors. */

define(function(require) {

require("../third_party/jquery.mobile.vmouse.js");

require("./graphie.js");
var kvector = require("./kvector.js");
var kpoint = require("./kpoint.js");
var kline = require("./kline.js");
var WrappedEllipse = require("./wrapped-ellipse.js");
var WrappedLine = require("./wrapped-line.js");
var WrappedPath = require("./wrapped-path.js");

function sum(array) {
    return _.reduce(array, function(memo, arg) { return memo + arg; }, 0);
}

function clockwise(points) {
    var segments = _.zip(points, points.slice(1).concat(points.slice(0, 1)));
    var areas = _.map(segments, function(segment) {
        var p1 = segment[0], p2 = segment[1];
        return (p2[0] - p1[0]) * (p2[1] + p1[1]);
    });
    return sum(areas) > 0;
}

/* vector-add multiple [x, y] coords/vectors */
function addPoints() {
    var points = _.toArray(arguments);
    var zipped = _.zip.apply(_, points);
    return _.map(zipped, sum);
}

function reverseVector(vector) {
    return _.map(vector, function(coord) {
        return coord * -1;
    });
}

function scaledDistanceFromAngle(angle) {
    // constants based on the magic numbers from graphie.addTriangle()
    var a = 3.51470560176242 * 20;
    var b = 0.5687298702748785 * 20;
    var c = -0.037587715462826674;
    return (a - b) * Math.exp(c * angle) + b;
}

function scaledPolarRad(radius, radians) {
    return [
        radius * Math.cos(radians),
        radius * Math.sin(radians) * -1 // SVG flips y axis
    ];
}

function scaledPolarDeg(radius, degrees) {
    var radians = degrees * Math.PI / 180;
    return scaledPolarRad(radius, radians);
}


$.extend(KhanUtil, {
    // Fill opacity for inequality shading
    FILL_OPACITY: 0.3,

    // TODO(alpert): Should this be a global?
    dragging: false,

    createSorter: function() {
        var sorter = {};
        var list;

        sorter.hasAttempted = false;

        sorter.init = function(element) {
            list = $("[id=" + element + "]").last();
            var container = list.wrap("<div>").parent();
            var placeholder = $("<li>");
            placeholder.addClass("placeholder");
            container.addClass("sortable ui-helper-clearfix");

            list.find("li").each(function(tileNum, tile) {
                $(tile).bind("vmousedown", function(event) {
                    if (event.type === "vmousedown" && (event.which === 1 || event.which === 0)) {
                        event.preventDefault();
                        $(tile).addClass("dragging");
                        var tileIndex = $(this).index();
                        placeholder.insertAfter(tile);
                        placeholder.width($(tile).width());
                        $(this).css("z-index", 100);
                        var offset = $(this).offset();
                        var click = {
                            left: event.pageX - offset.left - 3,
                            top: event.pageY - offset.top - 3
                        };
                        $(tile).css({ position: "absolute" });
                        $(tile).offset({
                            left: offset.left,
                            top: offset.top
                        });

                        $(document).bind("vmousemove.tile vmouseup.tile", function(event) {
                            event.preventDefault();
                            if (event.type === "vmousemove") {
                                sorter.hasAttempted = true;
                                $(tile).offset({
                                    left: event.pageX - click.left,
                                    top: event.pageY - click.top
                                });
                                var leftEdge = list.offset().left;
                                var midWidth = $(tile).offset().left - leftEdge;
                                var index = 0;
                                var sumWidth = 0;
                                list.find("li").each(function() {
                                    if (this === placeholder[0] || this === tile) {
                                        return;
                                    }
                                    if (midWidth > sumWidth + $(this).outerWidth(true) / 2) {
                                        index += 1;
                                    }
                                    sumWidth += $(this).outerWidth(true);
                                });
                                if (index !== tileIndex) {
                                    tileIndex = index;
                                    if (index === 0) {
                                        placeholder.prependTo(list);
                                        $(tile).prependTo(list);
                                    } else {
                                        placeholder.detach();
                                        $(tile).detach();
                                        var preceeding = list.find("li")[index - 1];
                                        placeholder.insertAfter(preceeding);
                                        $(tile).insertAfter(preceeding);
                                    }
                                }
                            } else if (event.type === "vmouseup") {
                                $(document).unbind(".tile");
                                var position = $(tile).offset();
                                $(position).animate(placeholder.offset(), {
                                    duration: 150,
                                    step: function(now, fx) {
                                        position[fx.prop] = now;
                                        $(tile).offset(position);
                                    },
                                    complete: function() {
                                        $(tile).css("z-index", 0);
                                        placeholder.detach();
                                        $(tile).css({ position: "static" });
                                        $(tile).removeClass("dragging");
                                    }
                                });
                            }
                        });
                    }
                });
            });
        };

        sorter.getContent = function() {
            var content = [];
            list.find("li").each(function(tileNum, tile) {
                content.push($.trim($(tile).find(".sort-key").text()));
            });
            return content;
        };

        sorter.setContent = function(content) {
            var tiles = [];
            $.each(content, function(n, sortKey) {
                var tile = list.find("li .sort-key").filter(function() {
                    // sort-key must match exactly
                    return $(this).text() === sortKey;
                }).closest("li").get(0);
                $(tile).detach();  // remove matched tile so you can have duplicates
                tiles.push(tile);
            });
            list.append(tiles);
        };


        return sorter;
    },

    // Useful for shapes that are only sometimes drawn. If a shape isn't
    // needed, it can be replaced with bogusShape which just has stub methods
    // that successfully do nothing.
    // The alternative would be 'if..typeof' checks all over the place.
    bogusShape: {
        animate: function() {},
        attr: function() {},
        remove: function() {}
    }
});

$.extend(KhanUtil.Graphie.prototype, {
    // Wrap graphInit to create a fixed-size graph automatically scaled to the given range
    initAutoscaledGraph: function(range, options) {
        var graph = this;
        options = $.extend({
            xpixels: 500,
            ypixels: 500,
            xdivisions: 20,
            ydivisions: 20,
            labels: true,
            unityLabels: true,
            range: (range === undefined ? [[-10, 10], [-10, 10]] : range)
        }, options);

        options.scale = [
            options.xpixels / (options.range[0][1] - options.range[0][0]),
            options.ypixels / (options.range[1][1] - options.range[1][0])
        ];
        options.gridStep = [
            (options.range[0][1] - options.range[0][0]) / options.xdivisions,
            (options.range[1][1] - options.range[1][0]) / options.ydivisions
        ];

        // Attach the resulting metrics to the graph for later reference
        graph.xpixels = options.xpixels;
        graph.ypixels = options.ypixels;
        graph.range = options.range;
        graph.scale = options.scale;

        graph.graphInit(options);
    },

    // graphie puts text spans on top of the SVG, which looks good, but gets
    // in the way of mouse events. This adds another SVG element on top
    // of everything else where we can add invisible shapes with mouse
    // handlers wherever we want.
    addMouseLayer: function(options) {
        var graph = this;
        options = _.extend({
            allowScratchpad: false
        }, options);

        var mouselayerZIndex = 2;
        graph.mouselayer = Raphael(graph.raphael.canvas.parentNode, graph.xpixels, graph.ypixels);
        $(graph.mouselayer.canvas).css("z-index", mouselayerZIndex);
        if (options.onClick || options.onMouseDown || options.onMouseMove ||
                options.onMouseOver || options.onMouseOut) {
            var canvasClickTarget = graph.mouselayer.rect(
                    0, 0, graph.xpixels, graph.ypixels).attr({
                fill: "#000",
                opacity: 0
            });
            var isClickingCanvas = false;

            $(graph.mouselayer.canvas).on("vmousedown", function(e) {
                if (e.target === canvasClickTarget[0]) {
                    if (options.onMouseDown) {
                        options.onMouseDown(graph.getMouseCoord(e));
                    }
                    isClickingCanvas = true;

                    if (options.onMouseMove) {
                        $(document).bind("vmousemove.mouseLayer", function(e) {
                            if (isClickingCanvas) {
                                e.preventDefault();
                                options.onMouseMove(graph.getMouseCoord(e));
                            }
                        });
                    }

                    $(document).bind("vmouseup.mouseLayer", function(e) {
                        $(document).unbind(".mouseLayer");

                        // Only register clicks that started on the canvas, and not
                        // on another mouseLayer target
                        if (isClickingCanvas && options.onClick) {
                            options.onClick(graph.getMouseCoord(e));
                        }
                        isClickingCanvas = false;
                    });
                }
            });
            if (options.onMouseOver) {
                $(graph.mouselayer.canvas).on("vmouseover", function(e) {
                    options.onMouseOver(graph.getMouseCoord(e));
                });
            }
            if (options.onMouseOut) {
                $(graph.mouselayer.canvas).on("vmouseout", function(e) {
                    options.onMouseOut(graph.getMouseCoord(e));
                });
            }
        }
        if (!options.allowScratchpad) {
            Khan.scratchpad.disable();
        }

        // Add mouse and visible wrapper layers for DOM-node-wrapped movables
        graph._mouselayerWrapper = document.createElement("div");
        $(graph._mouselayerWrapper).css({
            position: "absolute",
            left: 0,
            top: 0,
            zIndex: mouselayerZIndex
        });

        graph._visiblelayerWrapper = document.createElement("div");
        $(graph._visiblelayerWrapper).css({
            position: "absolute",
            left: 0,
            top: 0
        });

        var el = graph.raphael.canvas.parentNode;
        el.appendChild(graph._visiblelayerWrapper);
        el.appendChild(graph._mouselayerWrapper);

        // Add functions for adding to wrappers
        graph.addToMouseLayerWrapper = function(el) {
            this._mouselayerWrapper.appendChild(el);
        };
        graph.addToVisibleLayerWrapper = function(el) {
            this._visiblelayerWrapper.appendChild(el);
        };
    },

    /**
     * Get mouse coordinates in pixels
     */
    getMousePx: function(event) {
        var graphie = this;

        // mouse{X|Y} is in pixels relative to the SVG
        var mouseX = event.pageX - $(graphie.raphael.
            canvas.parentNode).offset().left;
        var mouseY = event.pageY - $(graphie.raphael.
            canvas.parentNode).offset().top;

        return [mouseX, mouseY];
    },

    /**
     * Get mouse coordinates in graph coordinates
     */
    getMouseCoord: function(event) {
        return this.unscalePoint(this.getMousePx(event));
    },

    // Draw angle arcs
    drawArcs: function(point1, vertex, point3, numArcs) {
        var startAngle = KhanUtil.findAngle(point1, vertex);
        var endAngle = KhanUtil.findAngle(point3, vertex);
        if (((endAngle - startAngle) % 360 + 360) % 360 > 180) {
            var temp = startAngle;
            startAngle = endAngle;
            endAngle = temp;
        }

        var radius = 0.3;
        // smaller angles need a bigger radius
        if ((((endAngle - startAngle) % 360 + 360) % 360) < 75) {
            radius = (-0.6 / 90) * (((endAngle - startAngle) % 360 + 360) % 360) + 0.8;
        }

        var arcset = [];
        for (var arc = 0; arc < numArcs; ++arc) {
            arcset.push(this.arc(vertex, radius + (0.15 * arc), startAngle, endAngle));
        }
        return arcset;
    },

    /**
     * Unlike all other Graphie-related code, the following three functions use
     * a lot of scaled coordinates (so that labels appear the same size
     * regardless of current shape/figure scale). These are prefixed with 's'.
     */
    labelAngle: function(options) {
        var graphie = this;

        _.defaults(options, {
            point1: [0, 0],
            vertex: [0, 0],
            point3: [0, 0],
            label: null,
            numArcs: 1,
            showRightAngleMarker: true,
            pushOut: 0,
            clockwise: false,
            style: {}
        });

        // Allow null text to hide the 90 degree angle marker
        var text = (options.text === undefined) ? "" : options.text;

        var vertex = options.vertex;
        var sVertex = graphie.scalePoint(vertex);

        var p1, p3;
        if (options.clockwise) {
            p1 = options.point1;
            p3 = options.point3;
        } else {
            p1 = options.point3;
            p3 = options.point1;
        }

        // TODO(alex): more spacing if >= 100 degrees (due to +1 character)
        // also take into account angle vs. text orientation, if possible

        // Calculate angles
        var startAngle = KhanUtil.findAngle(p1, vertex);
        var endAngle = KhanUtil.findAngle(p3, vertex);
        var angle = (endAngle + 360 - startAngle) % 360;
        var halfAngle = (startAngle + angle / 2) % 360;

        // Calculate distance from angle
        var sPadding = 5 * options.pushOut;
        var sRadius = sPadding + scaledDistanceFromAngle(angle);

        var temp = [];

        if (Math.abs(angle - 90) < 1e-9 && options.showRightAngleMarker) {
            // Draw right angle box
            var v1 = addPoints(sVertex, scaledPolarDeg(sRadius, startAngle));
            var v2 = addPoints(sVertex, scaledPolarDeg(sRadius, endAngle));

            sRadius *= Math.SQRT2;
            var v3 = addPoints(sVertex, scaledPolarDeg(sRadius, halfAngle));

            _.each([v1, v2], function(v) {
                temp.push(graphie.scaledPath([v, v3], options.style));
            });
        } else {
            // Draw arcs
            _.times(options.numArcs, function(i) {
                temp.push(graphie.arc(
                    vertex,
                    graphie.unscaleVector(sRadius),
                    startAngle,
                    endAngle,
                    options.style
                ));
                sRadius += 3;
            });
        }

        if (text) {
            // Update label text

            // Substitute actual angle measure for "$deg"
            var match = text.match(/\$deg(\d)?/);
            if (match) {
                var precision = match[1] || 1;
                text = text.replace(
                    match[0],
                    KhanUtil.toFixedApprox(angle, precision) + "^{\\circ}"
                );
            }

            // Calculate label position
            var sOffset = scaledPolarDeg(sRadius + 15, halfAngle);
            var sPosition = addPoints(sVertex, sOffset);
            var position = graphie.unscalePoint(sPosition);

            // Reuse label if possible
            if (options.label) {
                options.label.setPosition(position);
                options.label.processMath(text, /* force */ true);
            } else {
                graphie.label(position, text, "center", options.style);
            }
        }

        return temp;
    },

    labelSide: function(options) {
        var graphie = this;

        _.defaults(options, {
            point1: [0, 0],
            point2: [0, 0],
            label: null,
            text: "",
            numTicks: 0,
            numArrows: 0,
            clockwise: false,
            style: {}
        });

        var p1, p2;
        if (options.clockwise) {
            p1 = options.point1;
            p2 = options.point2;
        } else {
            p1 = options.point2;
            p2 = options.point1;
        }

        var midpoint = [(p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2];
        var sMidpoint = graphie.scalePoint(midpoint);

        var parallelAngle = Math.atan2(p2[1] - p1[1], p2[0] - p1[0]);
        var perpendicularAngle = parallelAngle + Math.PI / 2;

        var temp = [];
        var sCumulativeOffset = 0;

        if (options.numTicks) {
            // Draw ticks
            var n = options.numTicks;

            var sSpacing = 5;
            var sHeight = 5;

            var style = _.extend({}, options.style, {
                strokeWidth: 2
            });

            _.times(n, function(i) {
                var sOffset = sSpacing * (i - (n - 1) / 2);

                var sOffsetVector = scaledPolarRad(sOffset, parallelAngle);
                var sHeightVector = scaledPolarRad(sHeight, perpendicularAngle);

                var sPath = [
                    addPoints(sMidpoint, sOffsetVector, sHeightVector),
                    addPoints(sMidpoint, sOffsetVector,
                              reverseVector(sHeightVector))
                ];

                temp.push(graphie.scaledPath(sPath, style));
            });

            sCumulativeOffset += sSpacing * (n - 1) + 15;
        }

        if (options.numArrows) {
            // Draw arrows
            var n = options.numArrows;

            // Arrows always point up, unless horizontal (if so, point right)
            var start = [p1, p2].sort(function(a, b) {
                if (a[1] === b[1]) {
                    return a[0] - b[0];
                } else {
                    return a[1] - b[1];
                }
            })[0];
            var sStart = graphie.scalePoint(start);

            var style = _.extend({}, options.style, {
                arrows: "->",
                strokeWidth: 2
            });

            var sSpacing = 5;

            _.times(n, function(i) {
                var sOffset = sCumulativeOffset + sSpacing * i;
                var sOffsetVector = scaledPolarRad(sOffset, parallelAngle);

                if (start !== p1) {
                    sOffsetVector = reverseVector(sOffsetVector);
                }

                var sEnd = addPoints(sMidpoint, sOffsetVector);

                temp.push(graphie.scaledPath([sStart, sEnd], style));
            });
        }

        var text = options.text;
        if (text) {
            // Update label text

            // Substitute actual side length for "$len"
            var match = text.match(/\$len(\d)?/);
            if (match) {
                var distance = KhanUtil.getDistance(p1, p2);
                var precision = match[1] || 1;
                text = text.replace(
                    match[0],
                    KhanUtil.toFixedApprox(distance, precision)
                );
            }

            // Calculate label position

            // distance needs to take into account length of label
            // and perhaps orientation, to be smart about it
            var sOffset = 20;
            var sOffsetVector = scaledPolarRad(sOffset, perpendicularAngle);
            var sPosition = addPoints(sMidpoint, sOffsetVector);
            var position = graphie.unscalePoint(sPosition);

            // Reuse label if possible
            if (options.label) {
                options.label.setPosition(position);
                options.label.processMath(text, /* force */ true);
            } else {
                graphie.label(position, text, "center", options.style);
            }
        }

        return temp;
    },

    /* Can also be used to label points that aren't vertices */
    labelVertex: function(options) {
        var graphie = this;

        _.defaults(options, {
            point1: null,
            vertex: [0, 0],
            point3: null,
            label: null,
            text: "",
            clockwise: false,
            style: {}
        });

        if (!options.text) {
            return;
        }

        var vertex = options.vertex;
        var sVertex = graphie.scalePoint(vertex);

        var p1, p3;
        if (options.clockwise) {
            p1 = options.point1;
            p3 = options.point3;
        } else {
            p1 = options.point3;
            p3 = options.point1;
        }

        // Calculate label angle relative to vertex
        var angle = 135;
        var halfAngle;
        if (p1 && p3) {
            // Point within a polygon
            var startAngle = KhanUtil.findAngle(p1, vertex);
            var endAngle = KhanUtil.findAngle(p3, vertex);
            angle = (endAngle + 360 - startAngle) % 360;
            halfAngle = (startAngle + angle / 2 + 180) % 360;
        } else if (p1) {
            // Point on a line/segment
            var parallelAngle = KhanUtil.findAngle(vertex, p1);
            halfAngle = parallelAngle + 90;
        } else if (p3) {
            var parallelAngle = KhanUtil.findAngle(p3, vertex);
            halfAngle = parallelAngle + 90;
        } else {
            // Standalone point
            halfAngle = 135;
        }

        // Calculate label position
        var sRadius = 10 + scaledDistanceFromAngle(360 - angle);
        var sOffsetVector = scaledPolarDeg(sRadius, halfAngle);
        var sPosition = addPoints(sVertex, sOffsetVector);
        var position = graphie.unscalePoint(sPosition);

        // Reuse label if possible
        if (options.label) {
            options.label.setPosition(position);
            options.label.processMath(options.text, /* force */ true);
        } else {
            graphie.label(position, options.text, "center", options.style);
        }
    },


    // Add a point to the graph that can be dragged around.
    // It allows automatic constraints on its movement as well as automatically
    // managing line segments that terminate at the point.
    //
    // Options can be set to control how the point behaves:
    //   coord[]:
    //     The initial position of the point
    //   snapX, snapY:
    //     The minimum increment the point can be moved
    //
    // The return value is an object that can be used to manipulate the point:
    //   The coordX and coordY properties tell you the current position
    //
    //   By adding an onMove() method to the returned object, you can install an
    //   event handler that gets called every time the user moves the point.
    //
    //   The returned object also provides a moveTo(x,y) method that will move
    //   the point to a specific coordinate
    //
    // Constraints can be set on the on the returned object:
    //
    //  - Set point to be immovable:
    //        movablePoint.constraints.fixed = true
    //
    //  - Constrain point to a fixed distance from another point. The resulting
    //    point will move in a circle:
    //        movablePoint.fixedDistance = {
    //           dist: 2,
    //           point: point1
    //        }
    //
    //  - Constrain point to a line defined by a fixed angle between it and
    //    two other points:
    //        movablePoint.fixedAngle = {
    //           angle: 45,
    //           vertex: point1,
    //           ref: point2
    //        }
    //
    //  - Confined the point to traveling in a vertical or horizontal line,
    //    respectively
    //        movablePoint.constrainX = true;
    //        movablePoint.constrainY = true;
    //
    //  - Connect a movableLineSegment to a movablePoint. The point is attached
    //    to a specific end of the line segment by adding the segment either to
    //    the list of lines that start at the point or the list of lines that
    //    end at the point (movableLineSegment can do this for you):
    //        movablePoint.lineStarts.push(movableLineSegment);
    //          - or -
    //        movablePoint.lineEnds.push(movableLineSegment);
    //
    //  - Connect a movablePolygon to a movablePoint in exacty the same way:
    //        movablePoint.polygonVertices.push(movablePolygon);
    //
    addMovablePoint: function(options) {
        // The state object that gets returned
        var movablePoint = $.extend(true, {
            graph: this,
            coord: [0, 0],
            snapX: 0,
            snapY: 0,
            pointSize: 4,
            highlight: false,
            dragging: false,
            visible: true,
            bounded: true,
            constraints: {
                fixed: false,
                constrainX: false,
                constrainY: false,
                fixedAngle: {},
                fixedDistance: {}
            },
            lineStarts: [],
            lineEnds: [],
            polygonVertices: [],
            normalStyle: {},
            highlightStyle: {
                fill: KhanUtil.INTERACTING,
                stroke: KhanUtil.INTERACTING
            },
            labelStyle: {
                color: KhanUtil.INTERACTIVE
            },
            vertexLabel: "",
            mouseTarget: null
        }, options);

        var normalColor = (movablePoint.constraints.fixed) ?
                                  KhanUtil.DYNAMIC
                                : KhanUtil.INTERACTIVE;
        movablePoint.normalStyle = _.extend({}, {
            "fill": normalColor,
            "stroke": normalColor
        }, options.normalStyle);

        // deprecated: don't use coordX/coordY; use coord[]
        if (options.coordX !== undefined) {
            movablePoint.coord[0] = options.coordX;
        }
        if (options.coordY !== undefined) {
            movablePoint.coord[1] = options.coordY;
        }

        var graph = movablePoint.graph;

        var applySnapAndConstraints = function(coord) {
            // coord should be the scaled coordinate

            // move point away from edge of graph unless it's invisible or fixed
            if (movablePoint.visible &&
                    movablePoint.bounded &&
                    !movablePoint.constraints.fixed) {
                // can't go beyond 10 pixels from the edge
                coord = graph.constrainToBounds(coord, 10);
            }

            var coordX = coord[0];
            var coordY = coord[1];

            // snap coordinates to grid
            if (movablePoint.snapX !== 0) {
                coordX = Math.round(coordX / movablePoint.snapX) * movablePoint.snapX;
            }
            if (movablePoint.snapY !== 0) {
                coordY = Math.round(coordY / movablePoint.snapY) * movablePoint.snapY;
            }

            // snap to points around circle
            if (movablePoint.constraints.fixedDistance.snapPoints) {
                var mouse = graph.scalePoint(coord);
                var mouseX = mouse[0];
                var mouseY = mouse[1];

                var snapRadians = 2 * Math.PI / movablePoint.constraints.fixedDistance.snapPoints;
                var radius = movablePoint.constraints.fixedDistance.dist;

                // get coordinates relative to the fixedDistance center
                var centerCoord = movablePoint.constraints.fixedDistance.point;
                var centerX = (centerCoord[0] - graph.range[0][0]) * graph.scale[0];
                var centerY = (-centerCoord[1] + graph.range[1][1]) * graph.scale[1];

                var mouseXrel = mouseX - centerX;
                var mouseYrel = -mouseY + centerY;
                var radians = Math.atan(mouseYrel / mouseXrel);
                var outsideArcTanRange = mouseXrel < 0;

                // adjust so that angles increase from 0 to 2 pi as you go around the circle
                if (outsideArcTanRange) {
                    radians += Math.PI;
                }

                // perform the snap
                radians = Math.round(radians / snapRadians) * snapRadians;

                // convert from radians back to pixels
                mouseXrel = radius * Math.cos(radians);
                mouseYrel = radius * Math.sin(radians);
                // convert back to coordinates relative to graphie canvas
                mouseX = mouseXrel + centerX;
                mouseY = - mouseYrel + centerY;
                coordX = KhanUtil.roundTo(5, mouseX / graph.scale[0] + graph.range[0][0]);
                coordY = KhanUtil.roundTo(5, graph.range[1][1] - mouseY / graph.scale[1]);
            }

            // apply any constraints on movement
            var result = movablePoint.applyConstraint([coordX, coordY]);
            return result;
        };

        // Using the passed coordinates, apply any constraints and return the closest coordinates
        // that match the constraints.
        movablePoint.applyConstraint = function(coord, extraConstraints, override) {
            var newCoord = coord.slice();
            // use the configured constraints for the point plus any passed-in constraints; use only passed-in constraints if override is set
            var constraints = {};
            if (override) {
                $.extend(constraints, {
                    fixed: false,
                    constrainX: false,
                    constrainY: false,
                    fixedAngle: {},
                    fixedDistance: {}
                }, extraConstraints);
            } else {
                $.extend(constraints, this.constraints, extraConstraints);
            }

            // constrain to vertical movement
            if (constraints.constrainX) {
                newCoord = [this.coord[0], coord[1]];

            // constrain to horizontal movement
            } else if (constraints.constrainY) {
                newCoord = [coord[0], this.coord[1]];

            // both distance and angle are constrained
            } else if (typeof constraints.fixedAngle.angle === "number" && typeof constraints.fixedDistance.dist === "number") {
                var vertex = constraints.fixedAngle.vertex.coord || constraints.fixedAngle.vertex;
                var ref = constraints.fixedAngle.ref.coord || constraints.fixedAngle.ref;
                var distPoint = constraints.fixedDistance.point.coord || constraints.fixedDistance.point;

                var constrainedAngle = (constraints.fixedAngle.angle + KhanUtil.findAngle(ref, vertex)) * Math.PI / 180;
                var length = constraints.fixedDistance.dist;
                newCoord[0] = length * Math.cos(constrainedAngle) + distPoint[0];
                newCoord[1] = length * Math.sin(constrainedAngle) + distPoint[1];

            // angle is constrained
            } else if (typeof constraints.fixedAngle.angle === "number") {
                var vertex = constraints.fixedAngle.vertex.coord || constraints.fixedAngle.vertex;
                var ref = constraints.fixedAngle.ref.coord || constraints.fixedAngle.ref;

                // constrainedAngle is the angle from vertex to the point with reference to the screen
                var constrainedAngle = (constraints.fixedAngle.angle + KhanUtil.findAngle(ref, vertex)) * Math.PI / 180;
                // angle is the angle from vertex to the mouse with reference to the screen
                var angle = KhanUtil.findAngle(coord, vertex) * Math.PI / 180;
                var distance = KhanUtil.getDistance(coord, vertex);
                var length = distance * Math.cos(constrainedAngle - angle);
                length = length < 1.0 ? 1.0 : length;
                newCoord[0] = length * Math.cos(constrainedAngle) + vertex[0];
                newCoord[1] = length * Math.sin(constrainedAngle) + vertex[1];

            // distance is constrained
            } else if (typeof constraints.fixedDistance.dist === "number") {
                var distPoint = constraints.fixedDistance.point.coord || constraints.fixedDistance.point;

                var angle = KhanUtil.findAngle(coord, distPoint);
                var length = constraints.fixedDistance.dist;
                angle = angle * Math.PI / 180;
                newCoord[0] = length * Math.cos(angle) + distPoint[0];
                newCoord[1] = length * Math.sin(angle) + distPoint[1];

            // point is fixed
            } else if (constraints.fixed) {
                newCoord = movablePoint.coord;
            }
            return newCoord;
        };

        movablePoint.coord = applySnapAndConstraints(movablePoint.coord);

        var highlightScale = 2;

        if (movablePoint.visible) {
            graph.style(movablePoint.normalStyle, function() {
                var radii = [
                    movablePoint.pointSize / graph.scale[0],
                    movablePoint.pointSize / graph.scale[1]
                ];
                var options = {
                    maxScale: highlightScale
                };
                movablePoint.visibleShape = new WrappedEllipse(graph,
                    movablePoint.coord, radii, options);
                movablePoint.visibleShape.attr(_.omit(movablePoint.normalStyle, "scale"));
                movablePoint.visibleShape.toFront();
            });
        }
        movablePoint.normalStyle.scale = 1;
        movablePoint.highlightStyle.scale = highlightScale;

        if (movablePoint.vertexLabel) {
            movablePoint.labeledVertex = this.label([0, 0], "", "center", movablePoint.labelStyle);
        }

        movablePoint.drawLabel = function() {
            if (movablePoint.vertexLabel) {
                movablePoint.graph.labelVertex({
                    vertex: movablePoint.coord,
                    label: movablePoint.labeledVertex,
                    text: movablePoint.vertexLabel,
                    style: movablePoint.labelStyle
                });
            }
        };

        movablePoint.drawLabel();

        movablePoint.grab = function() {
            $(document).bind("vmousemove.point vmouseup.point", function(event) {
                event.preventDefault();
                movablePoint.dragging = true;
                KhanUtil.dragging = true;

                var coord = graph.getMouseCoord(event);

                coord = applySnapAndConstraints(coord);
                var coordX = coord[0];
                var coordY = coord[1];
                var mouseX;
                var mouseY;

                if (event.type === "vmousemove") {
                    var doMove = true;
                    // The caller has the option of adding an onMove() method to the
                    // movablePoint object we return as a sort of event handler
                    // By returning false from onMove(), the move can be vetoed,
                    // providing custom constraints on where the point can be moved.
                    // By returning array [x, y], the move can be overridden
                    if (_.isFunction(movablePoint.onMove)) {
                        var result = movablePoint.onMove(coordX, coordY);
                        if (result === false) {
                            doMove = false;
                        }
                        if (_.isArray(result)) {
                            coordX = result[0];
                            coordY = result[1];
                        }
                    }
                    // coord{X|Y} may have been modified by constraints or onMove handler; adjust mouse{X|Y} to match
                    mouseX = (coordX - graph.range[0][0]) * graph.scale[0];
                    mouseY = (-coordY + graph.range[1][1]) * graph.scale[1];

                    if (doMove) {
                        var point = graph.unscalePoint([mouseX, mouseY]);
                        movablePoint.visibleShape.moveTo(point);
                        movablePoint.mouseTarget.moveTo(point);
                        movablePoint.coord = [coordX, coordY];
                        movablePoint.updateLineEnds();
                        $(movablePoint).trigger("move");
                    }

                    movablePoint.drawLabel();

                } else if (event.type === "vmouseup") {
                    $(document).unbind(".point");
                    movablePoint.dragging = false;
                    KhanUtil.dragging = false;
                    if (_.isFunction(movablePoint.onMoveEnd)) {
                        var result = movablePoint.onMoveEnd(coordX, coordY);
                        if (_.isArray(result)) {
                            coordX = result[0];
                            coordY = result[1];
                            mouseX = (coordX - graph.range[0][0]) * graph.scale[0];
                            mouseY = (-coordY + graph.range[1][1]) * graph.scale[1];
                            var point = graph.unscalePoint([mouseX, mouseY]);
                            movablePoint.visibleShape.moveTo(point);
                            movablePoint.mouseTarget.moveTo(point);
                            movablePoint.coord = [coordX, coordY];
                        }
                    }
                    if (!movablePoint.highlight) {
                        movablePoint.visibleShape.animate(movablePoint.normalStyle, 50);
                        if (movablePoint.onUnhighlight) {
                            movablePoint.onUnhighlight();
                        }
                    }
                }
            });
        };

        if (movablePoint.visible && !movablePoint.constraints.fixed) {
            // the invisible shape in front of the point that gets mouse events
            if (!movablePoint.mouseTarget) {
                var radii = graph.unscaleVector(15);
                var options = {
                    mouselayer: true
                };
                movablePoint.mouseTarget = new WrappedEllipse(graph,
                    movablePoint.coord, radii, options);
                movablePoint.mouseTarget.attr({fill: "#000", opacity: 0.0});
            }

            var $mouseTarget = $(movablePoint.mouseTarget.getMouseTarget());
            $mouseTarget.css("cursor", "move");
            $mouseTarget.bind("vmousedown vmouseover vmouseout", function(event) {
                if (event.type === "vmouseover") {
                    movablePoint.highlight = true;
                    if (!KhanUtil.dragging) {
                        movablePoint.visibleShape.animate(movablePoint.highlightStyle, 50);
                        if (movablePoint.onHighlight) {
                            movablePoint.onHighlight();
                        }
                    }

                } else if (event.type === "vmouseout") {
                    movablePoint.highlight = false;
                    if (!movablePoint.dragging && !KhanUtil.dragging) {
                        movablePoint.visibleShape.animate(movablePoint.normalStyle, 50);
                        if (movablePoint.onUnhighlight) {
                            movablePoint.onUnhighlight();
                        }
                    }

                } else if (event.type === "vmousedown" && (event.which === 1 || event.which === 0)) {
                    event.preventDefault();

                    movablePoint.grab();
                }
            });
        }

        // Method to let the caller animate the point to a new position. Useful
        // as part of a hint to show the user the correct place to put the point.
        movablePoint.moveTo = function(coordX, coordY, updateLines) {
            // find distance in pixels to move
            var distance = KhanUtil.getDistance(this.graph.scalePoint([coordX, coordY]), this.graph.scalePoint(this.coord));

            // 5ms per pixel seems good
            var time = distance * 5;

            // Update the line on each step of the animation, if necessary
            var cb = updateLines && function(coord) {
                movablePoint.coord = coord;
                movablePoint.updateLineEnds();
            };
            this.visibleShape.animateTo([coordX, coordY], time, cb);
            this.mouseTarget.animateTo([coordX, coordY], time, cb);
            this.coord = [coordX, coordY];
            if (_.isFunction(this.onMove)) {
                this.onMove(coordX, coordY);
            }
        };


        // After moving the point, call this to update all line segments terminating at the point
        movablePoint.updateLineEnds = function() {
            $(this.lineStarts).each(function() {
                this.coordA = movablePoint.coord;
                this.transform();
            });
            $(this.lineEnds).each(function() {
                this.coordZ = movablePoint.coord;
                this.transform();
            });
            $(this.polygonVertices).each(function() {
                this.transform();
            });
        };

        // Put the point at a new position without any checks, animation, or callbacks
        movablePoint.setCoord = function(coord) {
            if (this.visible) {
                this.visibleShape.moveTo(coord);
                if (this.mouseTarget != null) {
                    this.mouseTarget.moveTo(coord);
                }
            }
            this.coord = coord.slice();
        };

        // Put the point at the new position, checking that it is within the graph's bounds
        movablePoint.setCoordConstrained = function(coord) {
            this.setCoord(applySnapAndConstraints(coord));
        };

        // Change z-order to back
        movablePoint.toBack = function() {
            if (this.visible) {
                if (this.mouseTarget != null) {
                    this.mouseTarget.toBack();
                }
                this.visibleShape.toBack();
            }
        };

        // Change z-order to front
        movablePoint.toFront = function() {
            if (this.visible) {
                if (this.mouseTarget != null) {
                    this.mouseTarget.toFront();
                }
                this.visibleShape.toFront();
            }
        };

        movablePoint.remove = function() {
            if (this.visibleShape) {
                this.visibleShape.remove();
            }
            if (this.mouseTarget) {
                this.mouseTarget.remove();
            }
            if (this.labeledVertex) {
                this.labeledVertex.remove();
            }
        };

        return movablePoint;
    },

    // Plot a function that allows the user to mouse over points on the function.
    // * currently, the function must be continuous
    //
    // The return value is an object:
    //   By adding an onMove() method to the returned object, you can install an
    //   event handler that gets called every time the user moves the mouse over
    //   the function.
    //
    //   By adding an onLeave() method to the returned object, you can install an
    //   event handler that gets called when the mouse moves away from the function.
    //
    addInteractiveFn: function(fn, options) {
        var graph = this;
        options = $.extend({
            graph: graph,
            snap: 0,
            range: [graph.range[0][0], graph.range[0][1]]
        }, options);
        var interactiveFn = {
            highlight: false
        };

        // Plot the function
        graph.style({
            stroke: KhanUtil.BLUE
        }, function() {
            interactiveFn.visibleShape = graph.plot(fn, options.range, options.swapAxes);
        });

        // Draw a circle that will be used to highlight the point on the function the mouse is closest to
        graph.style({
            fill: KhanUtil.BLUE,
            stroke: KhanUtil.BLUE
        }, function() {
            interactiveFn.cursorPoint = graph.ellipse([0, fn(0)], [4 / graph.scale[0], 4 / graph.scale[1]]);
        });
        // Hide the point for now
        interactiveFn.cursorPoint.attr("opacity", 0.0);

        // We want the mouse target to be much wider than the line itself, so you don't
        // have to hit a 2px target. Ideally, this would be done with an invisible
        // line following the same path, but with a really big strokeWidth. That
        // mostly works, but unfortunately there seem to be some bugs in Firefox
        // where it gets a bit confused about whether the mouse is or isn't over
        // a really thick curved line :(
        //
        // So instead, we have to use a polygon.
        var mouseAreaWidth = 30;
        var points = [];
        var step = (options.range[1] - options.range[0]) / 100;

        var addScaledPoint = function(x, y) {
            if (options.swapAxes) {
                points.push([(y - graph.range[0][0]) * graph.scale[0], (graph.range[1][1] - x) * graph.scale[1]]);
            } else {
                points.push([(x - graph.range[0][0]) * graph.scale[0], (graph.range[1][1] - y) * graph.scale[1]]);
            }
        };

        // Draw a curve parallel to, but (mouseAreaWidth/2 pixels) above the function
        for (var x = options.range[0]; x <= options.range[1]; x += step) {
            var ddx = (fn(x - 0.001) - fn(x + 0.001)) / 0.002;
            var x1 = x;
            var y1 = fn(x) + (mouseAreaWidth / (2 * graph.scale[1]));

            if (ddx !== 0) {
                var normalslope = (-1 / (ddx * (graph.scale[1] / graph.scale[0]))) / (graph.scale[1] / graph.scale[0]);
                if (ddx < 0) {
                    x1 = x - Math.cos(-Math.atan(normalslope * (graph.scale[1] / graph.scale[0]))) * mouseAreaWidth / (2 * graph.scale[0]);
                    y1 = normalslope * (x - x1) + fn(x);
                } else if (ddx > 0) {
                    x1 = x + Math.cos(-Math.atan(normalslope * (graph.scale[1] / graph.scale[0]))) * mouseAreaWidth / (2 * graph.scale[0]);
                    y1 = normalslope * (x - x1) + fn(x);
                }
            }
            addScaledPoint(x1, y1);
        }
        // Draw a curve parallel to, but (mouseAreaWidth/2 pixels) below the function
        for (var x = options.range[1]; x >= options.range[0]; x -= step) {
            var ddx = (fn(x - 0.001) - fn(x + 0.001)) / 0.002;
            var x1 = x;
            var y1 = fn(x) - (mouseAreaWidth / (2 * graph.scale[1]));

            if (ddx !== 0) {
                var normalslope = (-1 / (ddx * (graph.scale[1] / graph.scale[0]))) / (graph.scale[1] / graph.scale[0]);
                if (ddx < 0) {
                    x1 = x + Math.cos(-Math.atan(normalslope * (graph.scale[1] / graph.scale[0]))) * mouseAreaWidth / (2 * graph.scale[0]);
                    y1 = normalslope * (x - x1) + fn(x);
                } else if (ddx > 0) {
                    x1 = x - Math.cos(-Math.atan(normalslope * (graph.scale[1] / graph.scale[0]))) * mouseAreaWidth / (2 * graph.scale[0]);
                    y1 = normalslope * (x - x1) + fn(x);
                }
            }
            addScaledPoint(x1, y1);
        }

        // plot the polygon and make it invisible
        interactiveFn.mouseTarget = graph.mouselayer.path(KhanUtil.unscaledSvgPath(points));
        interactiveFn.mouseTarget.attr({ fill: "#000", "opacity": 0.0 });

        // Add mouse handlers to the polygon
        $(interactiveFn.mouseTarget[0]).bind("vmouseover vmouseout vmousemove", function(event) {
            event.preventDefault();
            var mouseX = event.pageX - $(graph.raphael.canvas.parentNode).offset().left;
            var mouseY = event.pageY - $(graph.raphael.canvas.parentNode).offset().top;
            // can't go beyond 10 pixels from the edge
            mouseX = Math.max(10, Math.min(graph.xpixels - 10, mouseX));
            mouseY = Math.max(10, Math.min(graph.ypixels - 10, mouseY));
            // snap to grid
            if (options.snap) {
                mouseX = Math.round(mouseX / (graph.scale[0] * options.snap)) * (graph.scale[0] * options.snap);
            }
            // coord{X|Y} are the scaled coordinate values
            var coordX = mouseX / graph.scale[0] + graph.range[0][0];
            var coordY = graph.range[1][1] - mouseY / graph.scale[1];

            // Find the closest point on the curve to the mouse (by brute force)
            var findDistance = function(coordX, coordY) {
                var closestX = 0;
                var minDist = Math.sqrt((coordX) * (coordX) + (coordY) * (coordY));
                for (var x = options.range[0]; x < options.range[1]; x += ((options.range[1] - options.range[0]) / graph.xpixels)) {
                    if (Math.sqrt((x - coordX) * (x - coordX) + (fn(x) - coordY) * (fn(x) - coordY)) < minDist) {
                        closestX = x;
                        minDist = Math.sqrt((x - coordX) * (x - coordX) + (fn(x) - coordY) * (fn(x) - coordY));
                    }
                }
                return closestX;
            };

            if (options.swapAxes) {
                var closestX = findDistance(coordY, coordX);
                coordX = fn(closestX);
                coordY = closestX;
            } else {
                var closestX = findDistance(coordX, coordY);
                coordX = closestX;
                coordY = fn(closestX);
            }

            interactiveFn.cursorPoint.attr("cx", (graph.range[0][1] + coordX) * graph.scale[0]);
            interactiveFn.cursorPoint.attr("cy", (graph.range[1][1] - coordY) * graph.scale[1]);

            // If the caller wants to be notified when the user points to the function
            if (_.isFunction(interactiveFn.onMove)) {
                interactiveFn.onMove(coordX, coordY);
            }

            if (event.type === "vmouseover") {
                interactiveFn.cursorPoint.animate({ opacity: 1.0 }, 50);
                interactiveFn.highlight = true;

            } else if (event.type === "vmouseout") {
                interactiveFn.highlight = false;
                interactiveFn.cursorPoint.animate({ opacity: 0.0 }, 50);
                // If the caller wants to be notified when the user stops pointing to the function
                if (_.isFunction(interactiveFn.onLeave)) {
                    interactiveFn.onLeave(coordX, coordY);
                }
            }
        });

        interactiveFn.mouseTarget.toBack();
        return interactiveFn;
    },


    // MovableLineSegment is a line segment that can be dragged around the
    // screen. By attaching a smartPoint to each (or one) end, the ends can be
    // manipulated individually.
    //
    // To use with smartPoints, add the smartPoints first, then:
    //   addMovableLineSegment({ pointA: smartPoint1, pointZ: smartPoint2 });
    // Or just one end:
    //   addMovableLineSegment({ pointA: smartPoint, coordZ: [0, 0] });
    //
    // Include "fixed: true" in the options if you don't want the entire line
    // to be draggable (you can still use points to make the endpoints
    // draggable)
    //
    // The returned object includes the following properties/methods:
    //
    //   - lineSegment.coordA / lineSegment.coordZ
    //         The coordinates of each end of the line segment
    //
    //   - lineSegment.transform(syncToPoints)
    //         Repositions the line segment. Call after changing coordA and/or
    //         coordZ, or pass syncToPoints = true to use the current position
    //         of the corresponding smartPoints, if the segment was defined using
    //         smartPoints
    //
    addMovableLineSegment: function(options) {
        var lineSegment = $.extend({
            graph: this,
            coordA: [0, 0],
            coordZ: [1, 1],
            snapX: 0,
            snapY: 0,
            fixed: false,
            ticks: 0,
            normalStyle: {},
            highlightStyle: {
                "stroke": KhanUtil.INTERACTING,
                "stroke-width": 6
            },
            labelStyle: {
                "stroke": KhanUtil.INTERACTIVE,
                "color": KhanUtil.INTERACTIVE
            },
            highlight: false,
            dragging: false,
            tick: [],
            extendLine: false,
            extendRay: false,
            constraints: {
                fixed: false,
                constrainX: false,
                constrainY: false
            },
            sideLabel: "",
            vertexLabels: [],
            numArrows: 0,
            numTicks: 0,
            movePointsWithLine: false
        }, options);

        var normalColor = (lineSegment.fixed) ? KhanUtil.DYNAMIC
                                              : KhanUtil.INTERACTIVE;
        lineSegment.normalStyle = _.extend({}, {
            "stroke-width": 2,
            "stroke": normalColor
        }, options.normalStyle);
        // arrowStyle should be kept in sync with styling of the line
        lineSegment.arrowStyle = _.extend({}, lineSegment.normalStyle, {
            "color": lineSegment.normalStyle.stroke
        });

        // If the line segment is defined by movablePoints, coordA/coordZ are
        // owned by the points, otherwise they're owned by us
        if (options.pointA !== undefined) {
            lineSegment.coordA = options.pointA.coord;
            lineSegment.pointA.lineStarts.push(lineSegment);
        } else if (options.coordA !== undefined) {
            lineSegment.coordA = options.coordA.slice();
        }

        if (options.pointZ !== undefined) {
            lineSegment.coordZ = options.pointZ.coord;
            lineSegment.pointZ.lineEnds.push(lineSegment);
        } else if (options.coordA !== undefined) {
            lineSegment.coordA = lineSegment.coordA.slice();
        }

        var graph = lineSegment.graph;

        graph.style(lineSegment.normalStyle);
        for (var i = 0; i < lineSegment.ticks; ++i) {
            lineSegment.tick[i] = KhanUtil.bogusShape;
        }
        var path = KhanUtil.unscaledSvgPath([[0, 0], [1, 0]]);
        for (var i = 0; i < lineSegment.ticks; ++i) {
            var tickoffset = 0.5 - ((lineSegment.ticks - 1) + (i * 2)) / graph.scale[0];
            path += KhanUtil.unscaledSvgPath([[tickoffset, -7], [tickoffset, 7]]);
        }

        // Create and style visible shape
        var options = {
            thickness: Math.max(
                lineSegment.normalStyle["stroke-width"],
                lineSegment.highlightStyle["stroke-width"]
            )
        };
        lineSegment.visibleLine = new WrappedLine(graph, [0, 0], [1, 0],
            options);
        lineSegment.visibleLine.attr(lineSegment.normalStyle);

        // Add mouse target
        if (!lineSegment.fixed) {
            var options = {
                thickness: 30,
                mouselayer: true
            };
            lineSegment.mouseTarget = new WrappedLine(graph, [0, 0], [1, 0],
                options);
            lineSegment.mouseTarget.attr({fill: "#000", "opacity": 0.0});
        }

        // Reposition the line segment. Call after changing coordA and/or
        // coordZ, or pass syncToPoints = true to use the current position of
        // the corresponding movablePoints, if the segment was defined using
        // movablePoints
        lineSegment.transform = function(syncToPoints) {
            if (syncToPoints) {
                if (typeof this.pointA === "object") {
                    this.coordA = this.pointA.coord;
                }
                if (typeof this.pointZ === "object") {
                    this.coordZ = this.pointZ.coord;
                }
            }

            // Given a line, find the angle between the endpoints
            var getScaledAngle = function(line) {
                var scaledA = line.graph.scalePoint(line.coordA);
                var scaledZ = line.graph.scalePoint(line.coordZ);
                return kvector.polarDegFromCart(
                    kvector.subtract(
                        scaledZ,
                        scaledA
                    )
                )[1];
            };

            // Given `coord` and `angle`, find the point where a line extended
            // from `coord` in the direction of `angle` would be clipped by the
            // edge of the graphie canvas.
            var getClipPoint = function(graph, coord, angle) {
                var graph = lineSegment.graph;
                // Actually put the arrowheads 4px from the edge so they have
                // a bit of room
                var xExtent = graph.range[0][1] - graph.range[0][0];
                var yExtent = graph.range[1][1] - graph.range[1][0];

                // shoot a point off into the distance ...
                var distance = xExtent + yExtent;
                // we need to scale the point according to the scale of the axes
                var angleVec = graph.unscaleVector(
                    kvector.cartFromPolarDeg([1, angle])
                );
                var distVec = kvector.scale(
                    kvector.normalize(angleVec),
                    distance
                );
                var farCoord = kvector.add(coord, distVec);
                var scaledAngle = kvector.polarDegFromCart(angleVec)[1];
                // ... and then bring it back
                var clipPoint = graph.constrainToBoundsOnAngle(farCoord, 4,
                                              scaledAngle * Math.PI / 180);
                return clipPoint;
            };

            var angle = getScaledAngle(this);
            var start = this.coordA;
            var end = this.coordZ;

            // Extend start, end if necessary (i.e., if not a line segment)
            if (this.extendLine) {
                start = getClipPoint(graph, start, 360 - angle);
                end = getClipPoint(graph, end, (540 - angle) % 360);
            } else if (this.extendRay) {
                end = getClipPoint(graph, start, 360 - angle);
            }

            var elements = [this.visibleLine];
            if (!this.fixed) {
                elements.push(this.mouseTarget);
            }
            _.each(elements, function(element) {
                element.moveTo(start, end);
            });

            // Draw an arrowhead at the end of the line
            var createArrow = function(graph, style) {
                // Points that define the arrowhead
                var center = [0.75, 0];
                var points = [
                    [-3, 4],
                    [-2.75, 2.5],
                    [0, 0.25],
                    center,
                    [0, -0.25],
                    [-2.75, -2.5],
                    [-3, -4]
                ];

                // Scale points by 1.4 around (0.75, 0)
                var scale = 1.4;
                points = _.map(points, function(point) {
                    var pv = kvector.subtract(point, center);
                    var pvScaled = kvector.scale(pv, scale);
                    return kvector.add(center, pvScaled);
                });

                // We can't just pass in a path to `graph.fixedPath` as we need to modify
                // the points in some way, so instead we provide a function for creating
                // the path once the points have been transformed
                var createCubicPath = function(points) {
                    var path = "M" + points[0][0] + " " + points[0][1];
                    for (var i = 1; i < points.length; i += 3) {
                        path += "C" + points[i][0] + " " + points[i][1] + " " +
                                      points[i + 1][0] + " " + points[i + 1][1] + " " +
                                      points[i + 2][0] + " " + points[i + 2][1];
                    }
                    return path;
                };

                // Create arrowhead
                var unscaledPoints = _.map(points, graph.unscalePoint);
                var options = {
                    center: graph.unscalePoint(center),
                    createPath: createCubicPath
                };
                var arrowHead = new WrappedPath(graph, unscaledPoints, options);
                arrowHead.attr(_.extend({
                    "stroke-linejoin": "round",
                    "stroke-linecap": "round",
                    "stroke-dasharray": ""
                }, style));

                // Add custom function for transforming arrowheads that accounts for
                // center, scaling, etc.
                arrowHead.toCoordAtAngle = function(coord, angle) {
                    var clipPoint = graph.scalePoint(getClipPoint(graph, coord, angle));
                    var do3dTransform = KhanUtil.getCanUse3dTransform();
                    arrowHead.transform(
                        "translateX(" + (clipPoint[0] + scale * center[0]) + "px) " +
                        "translateY(" + (clipPoint[1] + scale * center[1]) + "px) " +
                        (do3dTransform ? "translateZ(0) " : "") +
                        "rotate(" + (360 - KhanUtil.bound(angle)) + "deg)");
                };

                return arrowHead;
            };

            // Add arrows
            if (this._arrows == null) {
                this._arrows = [];

                if (this.extendLine) {
                    this._arrows.push(createArrow(
                        graph, this.normalStyle));
                    this._arrows.push(createArrow(
                        graph, this.normalStyle));
                } else if (this.extendRay) {
                    this._arrows.push(createArrow(
                        graph, this.normalStyle));
                }
            }

            // Move and rotate arrows to appropriate coordinate and angle
            var coordForArrow = [this.coordA, this.coordZ];
            var angleForArrow = [360 - angle, (540 - angle) % 360];
            _.each(this._arrows, function(arrow, i) {
                arrow.toCoordAtAngle(coordForArrow[i], angleForArrow[i]);
            });

            // Temporary objects: array of SVG nodes that get recreated on drag
            _.invoke(this.temp, "remove");
            this.temp = [];

            // Labels are always above line, unless vertical (if so, on right)
            // probably want to add an option to flip this at will!
            var isClockwise = (this.coordA[0] < this.coordZ[0]) ||
                (this.coordA[0] === this.coordZ[0] &&
                this.coordA[1] > this.coordZ[1]);

            // Update side label
            if (this.sideLabel) {
                this.temp.push(this.graph.labelSide({
                    point1: this.coordA,
                    point2: this.coordZ,
                    label: this.labeledSide,
                    text: this.sideLabel,
                    numArrows: this.numArrows,
                    numTicks: this.numTicks,
                    clockwise: isClockwise,
                    style: this.labelStyle
                }));
            }

            // Update vertex labels
            if (this.vertexLabels.length) {
                this.graph.labelVertex({
                    vertex: this.coordA,
                    point3: this.coordZ,
                    label: this.labeledVertices[0],
                    text: this.vertexLabels[0],
                    clockwise: isClockwise,
                    style: this.labelStyle
                });

                this.graph.labelVertex({
                    point1: this.coordA,
                    vertex: this.coordZ,
                    label: this.labeledVertices[1],
                    text: this.vertexLabels[1],
                    clockwise: isClockwise,
                    style: this.labelStyle
                });
            }

            this.temp = _.flatten(this.temp);
        };

        // Change z-order to back;
        lineSegment.toBack = function() {
            if (!lineSegment.fixed) {
                lineSegment.mouseTarget.toBack();
            }
            lineSegment.visibleLine.toBack();
        };

        // Change z-order to front
        lineSegment.toFront = function() {
            if (!lineSegment.fixed) {
                lineSegment.mouseTarget.toFront();
            }
            lineSegment.visibleLine.toFront();
        };

        lineSegment.remove = function() {
            if (!lineSegment.fixed) {
                lineSegment.mouseTarget.remove();
            }
            lineSegment.visibleLine.remove();
            if (lineSegment.labeledSide) {
                lineSegment.labeledSide.remove();
            }
            if (lineSegment.labeledVertices) {
                _.invoke(lineSegment.labeledVertices, "remove");
            }
            if (lineSegment._arrows) {
                _.invoke(lineSegment._arrows, "remove");
            }
            if (lineSegment.temp.length) {
                _.invoke(lineSegment.temp, "remove");
            }
        };

        lineSegment.hide = function() {
            lineSegment.visibleLine.hide();
            if (lineSegment.temp.length) {
                _.invoke(lineSegment.temp, "hide");
            }
            if (lineSegment._arrows) {
                _.invoke(lineSegment._arrows, "hide");
            }
        };

        lineSegment.show = function() {
            lineSegment.visibleLine.show();
            if (lineSegment.temp.length) {
                _.invoke(lineSegment.temp, "show");
            }
            if (lineSegment._arrows) {
                _.invoke(lineSegment._arrows, "show");
            }
        };

        if (lineSegment.sideLabel) {
            lineSegment.labeledSide = this.label([0, 0], "", "center", lineSegment.labelStyle);
        }

        if (lineSegment.vertexLabels.length) {
            lineSegment.labeledVertices = _.map(lineSegment.vertexLabels, function(label) {
                return this.label([0, 0], "", "center", lineSegment.labelStyle);
            }, this);
        }

        if (!lineSegment.fixed && !lineSegment.constraints.fixed) {
            var $mouseTarget = $(lineSegment.mouseTarget.getMouseTarget());
            $mouseTarget.css("cursor", "move");
            $mouseTarget.bind("vmousedown vmouseover vmouseout", function(event) {
                if (event.type === "vmouseover") {
                    if (!KhanUtil.dragging) {
                        lineSegment.highlight = true;
                        lineSegment.visibleLine.animate(lineSegment.highlightStyle, 50);
                        lineSegment.arrowStyle = _.extend({}, lineSegment.arrowStyle, {
                            "color": lineSegment.highlightStyle.stroke,
                            "stroke": lineSegment.highlightStyle.stroke
                        });
                        lineSegment.transform();
                    }

                } else if (event.type === "vmouseout") {
                    lineSegment.highlight = false;
                    if (!lineSegment.dragging) {
                        lineSegment.visibleLine.animate(lineSegment.normalStyle, 50);
                        lineSegment.arrowStyle = _.extend({}, lineSegment.arrowStyle, {
                            "color": lineSegment.normalStyle.stroke,
                            "stroke": lineSegment.normalStyle.stroke
                        });
                        lineSegment.transform();
                    }

                } else if (event.type === "vmousedown" && (event.which === 1 || event.which === 0)) {
                    event.preventDefault();
                    // coord{X|Y} are the scaled coordinate values of the mouse position
                    var coordX = (event.pageX - $(graph.raphael.canvas.parentNode).offset().left) / graph.scale[0] + graph.range[0][0];
                    var coordY = graph.range[1][1] - (event.pageY - $(graph.raphael.canvas.parentNode).offset().top) / graph.scale[1];
                    if (lineSegment.snapX > 0) {
                        coordX = Math.round(coordX / lineSegment.snapX) * lineSegment.snapX;
                    }
                    if (lineSegment.snapY > 0) {
                        coordY = Math.round(coordY / lineSegment.snapY) * lineSegment.snapY;
                    }
                    // Offsets between the mouse and each end of the line segment
                    var mouseOffsetA = [lineSegment.coordA[0] - coordX, lineSegment.coordA[1] - coordY];
                    var mouseOffsetZ = [lineSegment.coordZ[0] - coordX, lineSegment.coordZ[1] - coordY];

                    // Figure out how many pixels of the bounding box of the line segment lie to each direction of the mouse
                    var offsetLeft = -Math.min(graph.scaleVector(mouseOffsetA)[0], graph.scaleVector(mouseOffsetZ)[0]);
                    var offsetRight = Math.max(graph.scaleVector(mouseOffsetA)[0], graph.scaleVector(mouseOffsetZ)[0]);
                    var offsetTop = Math.max(graph.scaleVector(mouseOffsetA)[1], graph.scaleVector(mouseOffsetZ)[1]);
                    var offsetBottom = -Math.min(graph.scaleVector(mouseOffsetA)[1], graph.scaleVector(mouseOffsetZ)[1]);

                    $(document).bind("vmousemove.lineSegment vmouseup.lineSegment", function(event) {
                        event.preventDefault();
                        lineSegment.dragging = true;
                        KhanUtil.dragging = true;

                        // mouse{X|Y} are in pixels relative to the SVG
                        var mouseX = event.pageX - $(graph.raphael.canvas.parentNode).offset().left;
                        var mouseY = event.pageY - $(graph.raphael.canvas.parentNode).offset().top;
                        // no part of the line segment can go beyond 10 pixels from the edge
                        mouseX = Math.max(offsetLeft + 10, Math.min(graph.xpixels - 10 - offsetRight, mouseX));
                        mouseY = Math.max(offsetTop + 10, Math.min(graph.ypixels - 10 - offsetBottom, mouseY));

                        // coord{X|Y} are the scaled coordinate values
                        var coordX = mouseX / graph.scale[0] + graph.range[0][0];
                        var coordY = graph.range[1][1] - mouseY / graph.scale[1];
                        if (lineSegment.snapX > 0) {
                            coordX = Math.round(coordX / lineSegment.snapX) * lineSegment.snapX;
                        }
                        if (lineSegment.snapY > 0) {
                            coordY = Math.round(coordY / lineSegment.snapY) * lineSegment.snapY;
                        }

                        if (event.type === "vmousemove") {
                            if (lineSegment.constraints.constrainX) {
                                coordX = lineSegment.coordA[0] - mouseOffsetA[0];
                            }
                            if (lineSegment.constraints.constrainY) {
                                coordY = lineSegment.coordA[1] - mouseOffsetA[1];
                            }
                            var dX = coordX + mouseOffsetA[0] - lineSegment.coordA[0];
                            var dY = coordY + mouseOffsetA[1] - lineSegment.coordA[1];
                            lineSegment.coordA = [coordX + mouseOffsetA[0], coordY + mouseOffsetA[1]];
                            lineSegment.coordZ = [coordX + mouseOffsetZ[0], coordY + mouseOffsetZ[1]];
                            lineSegment.transform();

                            if (lineSegment.movePointsWithLine) {
                                // If the points are movablePoints, adjust
                                // their coordinates when the line itself is
                                // dragged
                                if (typeof lineSegment.pointA === "object") {
                                    lineSegment.pointA.setCoord([
                                            lineSegment.pointA.coord[0] + dX,
                                            lineSegment.pointA.coord[1] + dY
                                    ]);
                                }
                                if (typeof lineSegment.pointZ === "object") {
                                    lineSegment.pointZ.setCoord([
                                            lineSegment.pointZ.coord[0] + dX,
                                            lineSegment.pointZ.coord[1] + dY
                                    ]);
                                }
                            }

                            if (_.isFunction(lineSegment.onMove)) {
                                lineSegment.onMove(dX, dY);
                            }

                        } else if (event.type === "vmouseup") {
                            $(document).unbind(".lineSegment");
                            lineSegment.dragging = false;
                            KhanUtil.dragging = false;
                            if (!lineSegment.highlight) {
                                lineSegment.visibleLine.animate(lineSegment.normalStyle, 50);
                                lineSegment.arrowStyle = _.extend({}, lineSegment.arrowStyle, {
                                    "color": lineSegment.normalStyle.stroke,
                                    "stroke": lineSegment.normalStyle.stroke
                                });
                                lineSegment.transform();
                            }
                            if (_.isFunction(lineSegment.onMoveEnd)) {
                                lineSegment.onMoveEnd();
                            }

                        }

                        $(lineSegment).trigger("move");
                    });
                }
            });
        }


        if (lineSegment.pointA !== undefined) {
            lineSegment.pointA.toFront();
        }
        if (lineSegment.pointZ !== undefined) {
            lineSegment.pointZ.toFront();
        }
        lineSegment.transform();
        return lineSegment;
    },

    // MovablePolygon is a polygon that can be dragged around the screen.
    // By attaching a smartPoint to each vertex, the points can be
    // manipulated individually.
    //
    // To use with smartPoints, add the smartPoints first, then:
    //   addMovablePolygon({points: [...]});
    //
    // Include "fixed: true" in the options if you don't want the entire
    // polygon to be draggable (you can still use points to make the
    // vertices draggable)
    //
    // The returned object includes the following properties/methods:
    //
    //   - polygon.points
    //         The polygon's dynamic smartPoints and static coordinates, mixed.
    //
    //   - polygon.coords
    //         The polygon's current coordinates (generated, don't edit).
    //
    //   - polygon.transform()
    //         Repositions the polygon. Call after changing any points.
    //
    addMovablePolygon: function(options) {
        var graphie = this;

        var polygon = $.extend({
            snapX: 0,
            snapY: 0,
            fixed: false,
            constrainToGraph: true,
            normalStyle: {},
            highlightStyle: {
                "stroke": KhanUtil.INTERACTING,
                "stroke-width": 2,
                "fill": KhanUtil.INTERACTING,
                "fill-opacity": 0.05
            },
            pointHighlightStyle: {
                "fill": KhanUtil.INTERACTING,
                "stroke": KhanUtil.INTERACTING
            },
            labelStyle: {
                "stroke": KhanUtil.DYNAMIC,
                "stroke-width": 1,
                "color": KhanUtil.DYNAMIC
            },
            angleLabels: [],
            showRightAngleMarkers: [],
            sideLabels: [],
            vertexLabels: [],
            numArcs: [],
            numArrows: [],
            numTicks: [],
            updateOnPointMove: true,
            closed: true
        }, _.omit(options, "points"));

        var normalColor = (polygon.fixed) ? KhanUtil.DYNAMIC
                                          : KhanUtil.INTERACTIVE;
        polygon.normalStyle = _.extend({
            "stroke-width": 2,
            "fill-opacity": 0,
            "fill": normalColor,
            "stroke": normalColor
        }, options.normalStyle);

        // don't deep copy the points array with $.extend;
        // we may want to append to it later for click-to-add-points
        polygon.points = options.points;

        var isPoint = function(coordOrPoint) {
            return !_.isArray(coordOrPoint);
        };

        polygon.update = function() {
            var n = polygon.points.length;

            // Update coords
            polygon.coords = _.map(polygon.points, function(coordOrPoint, i) {
                if (isPoint(coordOrPoint)) {
                    return coordOrPoint.coord;
                } else {
                    return coordOrPoint;
                }
            });

            // Calculate bounding box
            polygon.left = _.min(_.pluck(polygon.coords, 0));
            polygon.right = _.max(_.pluck(polygon.coords, 0));
            polygon.top = _.max(_.pluck(polygon.coords, 1));
            polygon.bottom = _.min(_.pluck(polygon.coords, 1));

            // Calculate scaled coords
            var scaledCoords = _.map(polygon.coords, function(coord) {
                return graphie.scalePoint(coord);
            });

            // Create path
            if (polygon.closed) {
                scaledCoords.push(true);
            } else {
                // For open polygons, concatenate a reverse of the path,
                // to remove the inside area of the path, which would
                // otherwise be clickable (even if the closing line segment
                // wasn't drawn
                scaledCoords = scaledCoords.concat(
                    _.clone(scaledCoords).reverse()
                );
            }
            polygon.path = KhanUtil.unscaledSvgPath(scaledCoords);

            // Temporary objects
            _.invoke(polygon.temp, "remove");
            polygon.temp = [];

            // Check which direction coordinates wind
            var isClockwise = clockwise(polygon.coords);

            // Update angle labels
            if (polygon.angleLabels.length ||
                    polygon.showRightAngleMarkers.length) {
                _.each(polygon.labeledAngles, function(label, i) {
                    polygon.temp.push(graphie.labelAngle({
                        point1: polygon.coords[(i - 1 + n) % n],
                        vertex: polygon.coords[i],
                        point3: polygon.coords[(i + 1) % n],
                        label: label,
                        text: polygon.angleLabels[i],
                        showRightAngleMarker: polygon.showRightAngleMarkers[i],
                        numArcs: polygon.numArcs[i],
                        clockwise: isClockwise,
                        style: polygon.labelStyle
                    }));
                });
            }

            // Update side labels
            if (polygon.sideLabels.length) {
                _.each(polygon.labeledSides, function(label, i) {
                    polygon.temp.push(graphie.labelSide({
                        point1: polygon.coords[i],
                        point2: polygon.coords[(i + 1) % n],
                        label: label,
                        text: polygon.sideLabels[i],
                        numArrows: polygon.numArrows[i],
                        numTicks: polygon.numTicks[i],
                        clockwise: isClockwise,
                        style: polygon.labelStyle
                    }));
                });
            }

            // Update vertex labels
            if (polygon.vertexLabels.length) {
                _.each(polygon.labeledVertices, function(label, i) {
                    graphie.labelVertex({
                        point1: polygon.coords[(i - 1 + n) % n],
                        vertex: polygon.coords[i],
                        point3: polygon.coords[(i + 1) % n],
                        label: label,
                        text: polygon.vertexLabels[i],
                        clockwise: isClockwise,
                        style: polygon.labelStyle
                    });
                });
            }

            polygon.temp = _.flatten(polygon.temp);
        };

        polygon.transform = function() {
            polygon.update();

            polygon.visibleShape.attr({path: polygon.path});

            if (!polygon.fixed) {
                polygon.mouseTarget.attr({path: polygon.path});
            }
        };

        polygon.remove = function() {
            polygon.visibleShape.remove();

            if (!polygon.fixed) {
                polygon.mouseTarget.remove();
            }

            if (polygon.labeledAngles) {
                _.invoke(polygon.labeledAngles, "remove");
            }

            if (polygon.labeledSides) {
                _.invoke(polygon.labeledSides, "remove");
            }

            if (polygon.labeledVertices) {
                _.invoke(polygon.labeledVertices, "remove");
            }

            if (polygon.temp.length) {
                _.invoke(polygon.temp, "remove");
            }
        };

        polygon.toBack = function() {
            if (!polygon.fixed) {
                polygon.mouseTarget.toBack();
            }

            polygon.visibleShape.toBack();
        };

        polygon.toFront = function() {
            if (!polygon.fixed) {
                polygon.mouseTarget.toFront();
            }

            polygon.visibleShape.toFront();
        };

        // Setup

        if (polygon.updateOnPointMove) {
            _.each(_.filter(polygon.points, isPoint), function(coordOrPoint) {
                coordOrPoint.polygonVertices.push(polygon);
            });
        }

        polygon.coords = new Array(polygon.points.length);

        if (polygon.angleLabels.length) {
            polygon.labeledAngles = _.times(Math.max(
                        polygon.angleLabels.length,
                        polygon.showRightAngleMarkers.length
                    ), function() {
                return this.label([0, 0], "", "center", polygon.labelStyle);
            }, this);
        }

        if (polygon.sideLabels.length) {
            polygon.labeledSides = _.map(polygon.sideLabels, function(label) {
                return this.label([0, 0], "", "center", polygon.labelStyle);
            }, this);
        }

        if (polygon.vertexLabels.length) {
            polygon.labeledVertices = _.map(polygon.vertexLabels, function(label) {
                return this.label([0, 0], "", "center", polygon.labelStyle);
            }, this);
        }

        polygon.update();

        polygon.visibleShape = graphie.raphael.path(polygon.path);
        polygon.visibleShape.attr(polygon.normalStyle);

        if (!polygon.fixed) {
            polygon.mouseTarget = graphie.mouselayer.path(polygon.path);
            polygon.mouseTarget.attr({fill: "#000", opacity: 0, cursor: "move"});

            $(polygon.mouseTarget[0]).bind("vmousedown vmouseover vmouseout", function(event) {
                if (event.type === "vmouseover") {
                    if (!KhanUtil.dragging || polygon.dragging) {
                        polygon.highlight = true;
                        polygon.visibleShape.animate(polygon.highlightStyle, 50);
                        _.each(_.filter(polygon.points, isPoint), function(point) {
                            point.visibleShape.animate(polygon.pointHighlightStyle, 50);
                        });
                    }

                } else if (event.type === "vmouseout") {
                    polygon.highlight = false;
                    if (!polygon.dragging) {
                        polygon.visibleShape.animate(polygon.normalStyle, 50);
                        var points = _.filter(polygon.points, isPoint);
                        if (!_.any(_.pluck(points, "dragging"))) {
                            _.each(points, function(point) {
                                point.visibleShape.animate(point.normalStyle, 50);
                            });
                        }
                    }

                } else if (event.type === "vmousedown" && (event.which === 1 || event.which === 0)) {
                    event.preventDefault();

                    _.each(_.filter(polygon.points, isPoint), function(point) {
                        point.dragging = true;
                    });

                    // start{X|Y} are the scaled coordinate values of the starting mouse position
                    var startX = (event.pageX - $(graphie.raphael.canvas.parentNode).offset().left) / graphie.scale[0] + graphie.range[0][0];
                    var startY = graphie.range[1][1] - (event.pageY - $(graphie.raphael.canvas.parentNode).offset().top) / graphie.scale[1];
                    if (polygon.snapX > 0) {
                        startX = Math.round(startX / polygon.snapX) * polygon.snapX;
                    }
                    if (polygon.snapY > 0) {
                        startY = Math.round(startY / polygon.snapY) * polygon.snapY;
                    }
                    var lastX = startX;
                    var lastY = startY;

                    var polygonCoords = polygon.coords.slice();

                    // Figure out how many pixels of the bounding box of the polygon lie to each direction of the mouse
                    var offsetLeft = (startX - polygon.left) * graphie.scale[0];
                    var offsetRight = (polygon.right - startX) * graphie.scale[0];
                    var offsetTop = (polygon.top - startY) * graphie.scale[1];
                    var offsetBottom = (startY - polygon.bottom) * graphie.scale[1];

                    $(document).bind("vmousemove.polygon vmouseup.polygon", function(event) {
                        event.preventDefault();

                        polygon.dragging = true;
                        KhanUtil.dragging = true;

                        // mouse{X|Y} are in pixels relative to the SVG
                        var mouseX = event.pageX - $(graphie.raphael.canvas.parentNode).offset().left;
                        var mouseY = event.pageY - $(graphie.raphael.canvas.parentNode).offset().top;

                        // no part of the polygon can go beyond 10 pixels from the edge
                        if (polygon.constrainToGraph) {
                            mouseX = Math.max(
                                offsetLeft + 10,
                                Math.min(
                                    graphie.xpixels - 10 - offsetRight,
                                    mouseX
                                )
                            );
                            mouseY = Math.max(
                                offsetTop + 10,
                                Math.min(
                                    graphie.ypixels - 10 - offsetBottom,
                                    mouseY
                                )
                            );
                        }

                        // current{X|Y} are the scaled coordinate values of the current mouse position
                        var currentX = mouseX / graphie.scale[0] + graphie.range[0][0];
                        var currentY = graphie.range[1][1] - mouseY / graphie.scale[1];
                        if (polygon.snapX > 0) {
                            currentX = Math.round(currentX / polygon.snapX) * polygon.snapX;
                        }
                        if (polygon.snapY > 0) {
                            currentY = Math.round(currentY / polygon.snapY) * polygon.snapY;
                        }

                        if (event.type === "vmousemove") {
                            var dX = currentX - startX;
                            var dY = currentY - startY;

                            // The caller has the option of adding an onMove()
                            // method to the movablePolygon object we return as
                            // a sort of event handler. By returning false from
                            // onMove(), the move can be vetoed, providing
                            // custom constraints on where the point can be
                            // moved. By returning array [dX, dY], the move can
                            // be overridden.
                            var doMove = true;
                            if (_.isFunction(polygon.onMove)) {
                                var onMoveResult = polygon.onMove(dX, dY);
                                if (onMoveResult === false) {
                                    doMove = false;
                                } else if (_.isArray(onMoveResult)) {
                                    dX = onMoveResult[0];
                                    dY = onMoveResult[1];
                                    currentX = startX + dX;
                                    currentY = startY + dY;
                                }
                            }

                            var increment = function(i) {
                                return [
                                    polygonCoords[i][0] + dX,
                                    polygonCoords[i][1] + dY
                                ];
                            };

                            if (doMove) {
                                _.each(polygon.points, function(coordOrPoint, i) {
                                    if (isPoint(coordOrPoint)) {
                                        coordOrPoint.setCoord(increment(i));
                                    } else {
                                        polygon.points[i] = increment(i);
                                    }
                                });

                                polygon.transform();

                                $(polygon).trigger("move");

                                lastX = currentX;
                                lastY = currentY;
                            }

                        } else if (event.type === "vmouseup") {
                            $(document).unbind(".polygon");

                            var points = _.filter(polygon.points, isPoint);
                            _.each(points, function(point) {
                                point.dragging = false;
                            });

                            polygon.dragging = false;
                            KhanUtil.dragging = false;
                            if (!polygon.highlight) {
                                polygon.visibleShape.animate(polygon.normalStyle, 50);

                                _.each(points, function(point) {
                                    point.visibleShape.animate(point.normalStyle, 50);
                                });
                            }
                            if (_.isFunction(polygon.onMoveEnd)) {
                                polygon.onMoveEnd(lastX - startX, lastY - startY);
                            }
                        }
                    });
                }
            });
        }

        // Bring any movable points to the front
        _.invoke(_.filter(polygon.points, isPoint), "toFront");

        return polygon;
    },

    /**
     * Constrain a point to be within the graph (including padding).
     * If outside graph, point's x and y coordinates are clamped within
     * the graph.
     */
    constrainToBounds: function(point, padding) {
        var lower = this.unscalePoint([padding, this.ypixels - padding]);
        var upper = this.unscalePoint([this.xpixels - padding, padding]);
        var coordX = Math.max(lower[0], Math.min(upper[0], point[0]));
        var coordY = Math.max(lower[1], Math.min(upper[1], point[1]));
        return [coordX, coordY];
    },

    /**
     * Constrain a point to be within the graph (including padding).
     * If outside graph, point is moved along the ray specified by angle
     * until inside graph.
     */
    constrainToBoundsOnAngle: function(point, padding, angle) {
        var lower = this.unscalePoint([padding, this.ypixels - padding]);
        var upper = this.unscalePoint([this.xpixels - padding, padding]);

        var result = point.slice();

        if (result[0] < lower[0]) {
            result = [lower[0], result[1] + (lower[0] - result[0]) * Math.tan(angle)];
        } else if (result[0] > upper[0]) {
            result = [upper[0], result[1] - (result[0] - upper[0]) * Math.tan(angle)];
        }

        if (result[1] < lower[1]) {
            result = [result[0] + (lower[1] - result[1]) / Math.tan(angle), lower[1]];
        } else if (result[1] > upper[1]) {
            result = [result[0] - (result[1] - upper[1]) / Math.tan(angle), upper[1]];
        }

        return result;
    },

    // MovableAngle is an angle that can be dragged around the screen.
    // By attaching a smartPoint to the vertex and ray control points, the
    // rays can be manipulated individually.
    //
    // Use only with smartPoints; add the smartPoints first, then:
    //   addMovableAngle({points: [...]});
    //
    // The rays can be controlled to snap on degrees (more useful than snapping
    // on coordinates) by setting snapDegrees to a positive integer.
    //
    // The returned object includes the following properties/methods:
    //
    //   - movableAngle.points
    //         The movableAngle's dynamic smartPoints.
    //
    //   - movableAngle.coords
    //         The movableAngle's current coordinates (generated, don't edit).
    //
    addMovableAngle: function(options) {
        return new MovableAngle(this, options);
    },

    addArrowWidget: function(options) {
        var arrowWidget = $.extend({
            graph: this,
            direction: "up",
            coord: [0, 0],
            onClick: function() {}
        }, options);
        var graph = arrowWidget.graph;

        if (arrowWidget.direction === "up") {
            arrowWidget.visibleShape = graph.path([
                    [arrowWidget.coord[0], arrowWidget.coord[1] - 4 / graph.scale[1]],
                    [arrowWidget.coord[0] - 4 / graph.scale[0], arrowWidget.coord[1] - 4 / graph.scale[1]],
                    [arrowWidget.coord[0], arrowWidget.coord[1] + 4 / graph.scale[1]],
                    [arrowWidget.coord[0] + 4 / graph.scale[0], arrowWidget.coord[1] - 4 / graph.scale[1]],
                    [arrowWidget.coord[0], arrowWidget.coord[1] - 4 / graph.scale[1]]
                    ], { stroke: "", fill: KhanUtil.INTERACTIVE });
        } else if (arrowWidget.direction === "down") {
            arrowWidget.visibleShape = graph.path([
                    [arrowWidget.coord[0], arrowWidget.coord[1] + 4 / graph.scale[1]],
                    [arrowWidget.coord[0] - 4 / graph.scale[0], arrowWidget.coord[1] + 4 / graph.scale[1]],
                    [arrowWidget.coord[0], arrowWidget.coord[1] - 4 / graph.scale[1]],
                    [arrowWidget.coord[0] + 4 / graph.scale[0], arrowWidget.coord[1] + 4 / graph.scale[1]],
                    [arrowWidget.coord[0], arrowWidget.coord[1] + 4 / graph.scale[1]]
                    ], { stroke: "", fill: KhanUtil.INTERACTIVE });
        }

        // You might think we JUST NOW set the style when we drew this. But
        // does IE8 care? No! Of course not! It was too busy being slow and
        // obnoxious. So apparently we have to set the style again, later, when
        // it's paying attention. Or something.
        _.defer(function() {
            arrowWidget.visibleShape.attr({stroke: "", fill: KhanUtil.INTERACTIVE});
        });

        arrowWidget.mouseTarget = graph.mouselayer.circle(
                graph.scalePoint(arrowWidget.coord)[0], graph.scalePoint(arrowWidget.coord)[1], 15);
        arrowWidget.mouseTarget.attr({fill: "#000", "opacity": 0.0});

        $(arrowWidget.mouseTarget[0]).css("cursor", "pointer");
        $(arrowWidget.mouseTarget[0]).bind("vmousedown vmouseover vmouseout", function(event) {
            if (event.type === "vmouseover") {
                arrowWidget.visibleShape.animate({ scale: 2, fill: KhanUtil.INTERACTING }, 20);
            } else if (event.type === "vmouseout") {
                arrowWidget.visibleShape.animate({ scale: 1, fill: KhanUtil.INTERACTING }, 20);
            } else if (event.type === "vmousedown" && (event.which === 1 || event.which === 0)) {
                if (!arrowWidget.hidden) {
                    arrowWidget.onClick();
                }
                return false;
            }
        });

        arrowWidget.hide = function() {
            arrowWidget.visibleShape.hide();
            arrowWidget.hidden = true;
            $(arrowWidget.mouseTarget[0]).css("cursor", "default");
        };

        arrowWidget.show = function() {
            arrowWidget.visibleShape.show();
            arrowWidget.hidden = false;
            $(arrowWidget.mouseTarget[0]).css("cursor", "pointer");
        };

        return arrowWidget;
    },


    addRectGraph: function(options) {
        // settings
        var rect = $.extend(true, {
            x: 0,
            y: 0,
            width: 1,
            height: 1,
            normalStyle: {
                points: {
                    stroke: KhanUtil.INTERACTIVE,
                    fill: KhanUtil.INTERACTIVE,
                    opacity: 1
                },
                edges: {
                    stroke: KhanUtil.INTERACTIVE,
                    opacity: 1,
                    "stroke-width": 1
                },
                area: {
                    fill: KhanUtil.INTERACTIVE,
                    "fill-opacity": 0.1,
                    "stroke-width": 0
                }
            },
            hoverStyle: {
                points: {
                    color: KhanUtil.INTERACTING,
                    opacity: 1,
                    width: 2
                },
                edges: {
                    stroke: KhanUtil.INTERACTING,
                    opacity: 1,
                    "stroke-width": 1
                },
                area: {
                    fill: KhanUtil.INTERACTING,
                    "fill-opacity": 0.2,
                    "stroke-width": 0
                }
            },
            fixed: {
                // if true, users cannot move the edge independently
                edges: [false, false, false, false],

                // if true, users cannot move the point independently
                points: [false, false, false, false]
            },
            constraints: {
                constrainX: false, // limit movement to y axis
                constrainY: false, // limit movement to x axis

                // bounds for translations
                xmin: null,
                xmax: null,
                ymin: null,
                ymax: null
            },
            snapX: 0,
            snapY: 0,

            // this function will be called whenever .translate(), .snap(), or
            // .moveTo() are called
            onMove: function() {}
        }, options);


        // functions
        rect = $.extend({
            initialized: function() {
                return rect.points && rect.points.length;
            },
            x2: function() {
                return this.x + this.width;
            },
            y2: function() {
                return this.y + this.height;
            },
            getX: function() {
                if (rect.initialized()) {
                    return rect.points[0].coord[0];
                }
                return rect.x;
            },
            getY: function() {
                if (rect.initialized()) {
                    return rect.points[0].coord[1];
                }
                return rect.y;
            },
            getX2: function() {
                return rect.getX() + rect.getWidth();
            },
            getY2: function() {
                return rect.getY() + rect.getHeight();
            },
            getXLims: function() {
                var x = rect.getX();
                return [x, x + rect.getWidth()];
            },
            getYLims: function() {
                var y = rect.getY();
                return [y, y + rect.getHeight()];
            },
            getWidth: function() {
                if (rect.initialized()) {
                    var x0 = rect.points[1].coord[0];
                    var x1 = rect.points[2].coord[0];
                    return x1 - x0;
                }
                return rect.width;
            },
            getHeight: function() {
                if (rect.initialized()) {
                    var y0 = rect.points[0].coord[1];
                    var y1 = rect.points[1].coord[1];
                    return y1 - y0;
                }
                return rect.height;
            },
            getCoord: function() {
                return [rect.getX(), rect.getY()];
            },
            getRaphaelParamsArr: function() {
                var width = rect.getWidth();
                var height = rect.getHeight();
                var x = rect.getX();
                var y = rect.getY();
                var point = graphie.scalePoint([x, y + height]);
                var dims = graphie.scaleVector([width, height]);
                return point.concat(dims);
            },
            getRaphaelParams: function() {
                var arr = rect.getRaphaelParamsArr();
                return {
                    x: arr[0],
                    y: arr[1],
                    width: arr[2],
                    height: arr[3]
                };
            }
        }, rect);

        var graphie = this;



        // ADD RECTANGLE AND MOUSE TARGET

        rect.fillArea = graphie.rect().attr(rect.normalStyle.area);
        rect.mouseTarget = graphie.mouselayer.rect()
            .attr({
                fill: "#000",
                opacity: 0,
                "fill-opacity": 0
            });

        rect.render = function() {
            rect.fillArea.attr(rect.getRaphaelParams());
            rect.mouseTarget.attr(rect.getRaphaelParams());
        };

        rect.render(); // initialize



        // ADD POINTS

        rect.points = [];

        var coords = [[rect.x, rect.y], [rect.x, rect.y2()], [rect.x2(), rect.y2()], [rect.x2(), rect.y]];
        var sames = [[1, 3], [0, 2], [3, 1], [2, 0]];
        var moveLimits = [[1, 1], [1, 0], [0, 0], [0, 1]];


        function adjustNeighboringPoints(x, y, sameX, sameY) {
            rect.points[sameX].setCoord([x, rect.points[sameX].coord[1]]);
            rect.points[sameY].setCoord([rect.points[sameY].coord[0], y]);
            rect.points[sameX].updateLineEnds();
            rect.points[sameY].updateLineEnds();
        }

        function coordInBounds(limit, newVal, checkIsGreater) {
            return checkIsGreater ? newVal < limit : newVal > limit;
        }

        function moveIsInBounds(index, newX, newY) {
            var xlims = rect.getXLims();
            var ylims = rect.getYLims();

            var i = moveLimits[index];

            var xInBounds = coordInBounds(xlims[i[0]], newX, i[0] === 1);
            var yInBounds = coordInBounds(ylims[i[1]], newY, i[1] === 1);

            return xInBounds && yInBounds;
        }

        _.times(4, function(i) {
            var sameX = sames[i][0];
            var sameY = sames[i][1];
            var coord = coords[i];

            var point = graphie.addMovablePoint({
                graph: graphie,
                coord: coord,
                normalStyle: rect.normalStyle.points,
                hoverStyle: rect.hoverStyle.points,
                snapX: rect.snapX,
                snapY: rect.snapY,
                visible: !rect.fixed.points[i],
                constraints: {
                    fixed: rect.fixed.points[i]
                },
                onMove: function(x, y) {
                    if (!moveIsInBounds(i, x, y)) {
                        return false;
                    }
                    adjustNeighboringPoints(x, y, sameX, sameY);
                    rect.render();
                }
            });

            rect.points.push(point);
        });



        // ADD EDGES

        rect.edges = [];

        rect.moveEdge = function(dx, dy, edgeIndex) {
            var a = rect.edges[edgeIndex].pointA;
            var z = rect.edges[edgeIndex].pointZ;
            a.setCoord([a.coord[0] + dx, a.coord[1] + dy]);
            z.setCoord([z.coord[0] + dx, z.coord[1] + dy]);
            a.updateLineEnds();
            z.updateLineEnds();
        };

        _.times(4, function(i) {
            var pointA = rect.points[i];
            var pointZ = rect.points[(i + 1) % 4]; // next point
            var constrainX = (i % 2); // odd edges have X constrained
            var constrainY = ((i + 1) % 2); // even edges have Y constrained

            var edge = graphie.addMovableLineSegment({
                graph: graphie,
                pointA: pointA,
                pointZ: pointZ,
                normalStyle: rect.normalStyle.edges,
                hoverStyle: rect.hoverStyle.edges,
                snapX: rect.snapX,
                snapY: rect.snapY,
                fixed: rect.fixed.edges[i],
                constraints: {
                    constrainX: constrainX,
                    constrainY: constrainY
                },
                onMove: function(dx, dy) {
                    rect.moveEdge(dx, dy, i);
                    rect.render();
                }
            });

            rect.edges.push(edge);
        });



        // CREATE COLLECTION OF ALL ELEMENTS (used in toFront)
        var elems = [rect.fillArea, rect.mouseTarget];
        rect.elems = elems.concat(rect.edges).concat(rect.points);



        // MOVING FUNCTIONS

        function constrainTranslation(dx, dy) {
            var xC = rect.constraints.constrainX;
            var xLT = rect.getX() + dx < rect.constraints.xmin;
            var xGT = rect.getX2() + dx > rect.constraints.xmax;
            var yC = rect.constraints.constrainY;
            var yLT = rect.getY() + dy < rect.constraints.ymin;
            var yGT = rect.getY2() + dy > rect.constraints.ymax;

            dx = xC || xLT || xGT ? 0 : dx;
            dy = yC || yLT || yGT ? 0 : dy;

            return [dx, dy];
        }

        rect.translate = function(dx, dy) {
            if (rect.constraints.constrainX && rect.constraints.constrainY) {
                return;
            }
            var d = constrainTranslation(dx, dy);
            dx = d[0];
            dy = d[1];

            _.each(rect.points, function(point, i) {
                var x = point.coord[0] + dx;
                var y = point.coord[1] + dy;
                // move points
                point.setCoord([x, y]);
                // move edges
                point.updateLineEnds();
            });

            // move rectangle & mouseTarget
            rect.render();

            // fire "on move" event with the new xlims and ylims
            rect.onMove(dx, dy);
        };

        rect.moveTo = function(x, y) {
            var dx = x - rect.getX();
            var dy = y - rect.getY();
            rect.translate(dx, dy);
        };

        rect.snap = function() {
            var dx;
            var dy;
            _.each(rect.points, function(point, i) {
                var x0 = point.coord[0];
                var y0 = point.coord[1];
                var x1 = x0;
                var y1 = y0;

                if (rect.snapX) {
                    x1 = KhanUtil.roundToNearest(rect.snapX, x0);
                }
                if (rect.snapY) {
                    y1 = KhanUtil.roundToNearest(rect.snapY, y0);
                }

                if (!dx || !dy) {
                    dx = x1 - x0;
                    dy = y1 - y0;
                }

                // move points
                point.setCoord([x1, y1]);
                // move edges
                point.updateLineEnds();
            });

            // move rectangle & mouseTarget
            rect.render();

            // fire "on move" event with the new xlims and ylims
            rect.onMove(dx, dy);
        };

        // TODO(stephanie): confirm this works
        rect.toFront = function() {
            _.each(rect.elems, function(elem) {
                elem.toFront();
            });
        };

        rect.hide = function(speed) {
            if (rect.hidden) {
                return;
            }

            speed = speed || 100;

            rect.fillArea.animate({
                "fill-opacity": 0
            }, speed);
            $(rect.mouseTarget[0]).css("display", "none");

            rect.hidden = true;
        };

        rect.show = function(speed) {
            if (!rect.hidden) {
                return;
            }

            speed = speed || 100;

            rect.fillArea.animate(rect.normalStyle.area, speed);
            $(rect.mouseTarget[0]).css("display", "block");

            rect.hidden = false;
        };

        rect.enableHoverStyle = function() {
            rect.highlight = true;
            if (!KhanUtil.dragging) {
                rect.fillArea.animate(rect.hoverStyle.area, 100);
            }
        };

        rect.enableNormalStyle = function() {
            rect.highlight = false;
            if (!rect.dragging) {
                rect.fillArea.animate(rect.normalStyle.area, 100);
            }
        };

        // tie actual translation events to the translate function
        var bindTranslation = function() {
            $(rect.mouseTarget[0]).css("cursor", "move");
            $(rect.mouseTarget[0]).on(
                "vmouseover vmouseout vmousedown", function(event) {
                    if (event.type === "vmouseover") {
                        rect.enableHoverStyle();

                    } else if (event.type === "vmouseout") {
                        rect.enableNormalStyle();

                    } else if (event.type === "vmousedown" &&
                            (event.which === 1 || event.which === 0)) {
                        event.preventDefault();
                        rect.toFront();
                        rect.prevCoord = graphie.getMouseCoord(event);

                        rect.enableHoverStyle();

                        $(document).on("vmousemove vmouseup", function(event) {
                            event.preventDefault();
                            rect.dragging = true;
                            KhanUtil.dragging = true;

                            if (event.type === "vmousemove") {
                                var currCoord = graphie.getMouseCoord(event);

                                if (rect.prevCoord && rect.prevCoord.length === 2) {
                                    var diff = KhanUtil.coordDiff(rect.prevCoord, currCoord);
                                    rect.translate(diff[0], diff[1]);
                                }

                                rect.prevCoord = currCoord;

                            } else if (event.type === "vmouseup") {
                                $(document).off("vmousemove vmouseup");
                                rect.dragging = false;
                                KhanUtil.dragging = false;

                                var currCoord = graphie.getMouseCoord(event);
                                if (currCoord[0] < rect.getX() ||
                                    currCoord[0] > rect.getX2() ||
                                    currCoord[1] < rect.getY() ||
                                    currCoord[1] > rect.getY2()) {
                                        rect.enableNormalStyle();
                                }

                                // snap to grid
                                rect.snap();
                            }
                        });
                    }
            });
        };

        bindTranslation();

        return rect;
    },

    // center: movable point
    // radius: int
    // circ: graphie circle
    // perim: invisible mouse target for dragging/changing radius
    addCircleGraph: function(options) {
        var graphie = this;
        var circle = $.extend({
            center: [0, 0],
            radius: 2,
            snapX: 0.5,
            snapY: 0.5,
            snapRadius: 0.5,
            minRadius: 1,
            centerConstraints: {},
            centerNormalStyle: {},
            centerHighlightStyle: {
                stroke: KhanUtil.INTERACTING,
                fill: KhanUtil.INTERACTING
            },
            circleNormalStyle: {
                stroke: KhanUtil.INTERACTIVE,
                "fill-opacity": 0
            },
            circleHighlightStyle: {
                stroke: KhanUtil.INTERACTING,
                fill: KhanUtil.INTERACTING,
                "fill-opacity": 0.05
            }
        }, options);

        // Set normal styling based on interactability
        var normalColor = (circle.centerConstraints.fixed) ?
                                  KhanUtil.DYNAMIC
                                : KhanUtil.INTERACTIVE;
        var centerNormalStyle = (options) ? options.centerNormalStyle : null;
        circle.centerNormalStyle = _.extend({}, {
            "fill": normalColor,
            "stroke": normalColor
        }, centerNormalStyle);

        circle.centerPoint = graphie.addMovablePoint({
            graph: graphie,
            coord: circle.center,
            normalStyle: circle.centerNormalStyle,
            snapX: circle.snapX,
            snapY: circle.snapY,
            constraints: circle.centerConstraints
        });
        circle.circ = graphie.circle(circle.center, circle.radius,
                circle.circleNormalStyle);
        circle.perim = graphie.mouselayer.circle(
            graphie.scalePoint(circle.center)[0],
            graphie.scalePoint(circle.center)[1],
            graphie.scaleVector(circle.radius)[0]).attr({
                "stroke-width": 20,
                "opacity": 0.002  // This is as close to 0 as MSIE will allow
            });

        // Highlight circle circumference on center point hover
        if (!circle.centerConstraints.fixed) {
            $(circle.centerPoint.mouseTarget.getMouseTarget()).on("vmouseover vmouseout",
                    function(event) {
                if (circle.centerPoint.highlight ||
                        circle.centerPoint.dragging) {
                    circle.circ.animate(circle.circleHighlightStyle, 50);
                } else {
                    circle.circ.animate(circle.circleNormalStyle, 50);
                }
            });
        }

        circle.toFront = function() {
            circle.circ.toFront();
            circle.perim.toFront();
            circle.centerPoint.visibleShape.toFront();
            if (!circle.centerConstraints.fixed) {
                circle.centerPoint.mouseTarget.toFront();
            }
        };

        circle.centerPoint.onMove = function(x, y) {
            circle.toFront();
            circle.circ.attr({
                cx: graphie.scalePoint(x)[0],
                cy: graphie.scalePoint(y)[1]
            });
            circle.perim.attr({
                cx: graphie.scalePoint(x)[0],
                cy: graphie.scalePoint(y)[1]
            });
            if (circle.onMove) {
                circle.onMove(x, y);
            }
        };

        $(circle.centerPoint).on("move", function() {
            circle.center = this.coord;
            $(circle).trigger("move");
        });

        // circle.setCenter(x, y) moves the circle to the specified
        // x, y coordinate as if the user had dragged it there.
        circle.setCenter = function(x, y) {
            circle.centerPoint.setCoord([x, y]);
            circle.centerPoint.onMove(x, y);
            circle.center = [x, y];
        };

        // circle.setRadius(r) sets the circle's radius to the specified
        // value as if the user had dragged it there.
        circle.setRadius = function(r) {
            circle.radius = r;

            circle.perim.attr({
                r: graphie.scaleVector(r)[0]
            });
            circle.circ.attr({
                rx: graphie.scaleVector(r)[0],
                ry: graphie.scaleVector(r)[1]
            });
        };

        circle.remove = function() {
            circle.centerPoint.remove();
            circle.circ.remove();
            circle.perim.remove();
        };

        $(circle.perim[0]).css("cursor", "move");
        $(circle.perim[0]).on(
            "vmouseover vmouseout vmousedown", function(event) {
                if (event.type === "vmouseover") {
                    circle.highlight = true;
                    if (!KhanUtil.dragging) {
                        // TODO(jack): Figure out why this doesn't work
                        // for circleHighlightStyle's that change
                        // stroke-dasharray
                        circle.circ.animate(circle.circleHighlightStyle, 50);
                        circle.centerPoint.visibleShape.animate(
                            circle.centerHighlightStyle,
                            50
                        );
                    }

                } else if (event.type === "vmouseout") {
                    circle.highlight = false;
                    if (!circle.dragging && !circle.centerPoint.dragging) {
                        circle.circ.animate(circle.circleNormalStyle, 50);
                        circle.centerPoint.visibleShape.animate(
                            circle.centerNormalStyle,
                            50
                        );
                    }

                } else if (event.type === "vmousedown" &&
                        (event.which === 1 || event.which === 0)) {
                    event.preventDefault();
                    circle.toFront();
                    var startRadius = circle.radius;

                    $(document).on("vmousemove vmouseup", function(event) {
                        event.preventDefault();
                        circle.dragging = true;
                        KhanUtil.dragging = true;

                        if (event.type === "vmousemove") {
                            // can't go beyond 10 pixels from the edge
                            // coord is the scaled coordinate
                            var coord = graphie.constrainToBounds(
                                graphie.getMouseCoord(event), 10);

                            var radius = KhanUtil.getDistance(
                                circle.centerPoint.coord, coord);
                            radius = Math.max(circle.minRadius,
                                Math.round(radius / circle.snapRadius) *
                                circle.snapRadius);
                            var oldRadius = circle.radius;
                            var doResize = true;
                            if (circle.onResize) {
                                var onResizeResult = circle.onResize(radius, oldRadius);
                                if (_.isNumber(onResizeResult)) {
                                    radius = onResizeResult;
                                } else if (onResizeResult === false) {
                                    doResize = false;
                                }
                            }
                            if (doResize) {
                                circle.setRadius(radius);
                                $(circle).trigger("move");
                            }
                        } else if (event.type === "vmouseup") {
                            $(document).off("vmousemove vmouseup");
                            circle.dragging = false;
                            KhanUtil.dragging = false;
                            if (circle.onResizeEnd) {
                                circle.onResizeEnd(circle.radius, startRadius);
                            }
                        }
                    });
                }
        });

        return circle;
    },

    interactiveEllipse: function(options) {
        var graphie = this;
        var ellipse = $.extend({
            center: [0, 0],
            radius: 2,
            xRadius: 2,
            yRadius: 2,
            ellipseNormalStyle: {
                stroke: KhanUtil.BLUE,
                "fill-opacity": 0
            },
            ellipseBoundaryHideStyle: {
                "fill-opacity": 0,
                "stroke-width": 0
            },
            ellipseBoundaryShowStyle: {
                "fill-opacity": 1,
                fill: KhanUtil.BLUE
            },
            onMove: function(coordX, coordY) { /* Here to be overriden */ },
            onLeave: function(coordX, coordY) { /* Here to be overriden */ }
        }, options);

        ellipse.circ = graphie.ellipse(ellipse.center, [ellipse.xRadius, ellipse.yRadius], ellipse.ellipseNormalStyle);
        ellipse.perim = graphie.mouselayer.ellipse(
            graphie.scalePoint(ellipse.center)[0],
            graphie.scalePoint(ellipse.center)[1],
            graphie.scaleVector(ellipse.xRadius)[0],
            graphie.scaleVector(ellipse.yRadius)[0]).attr({
                "stroke-width": 30,
                "opacity": 0.002  // This is as close to 0 as MSIE will allow
        });

        ellipse.boundaryPoint = graphie.circle(ellipse.center, 0.4, ellipse.ellipseBoundaryHideStyle);

        ellipse.remove = function() {
            ellipse.circ.remove();
            ellipse.perim.remove();
        };

        ellipse.showPoint = function(event) {
            // Fix to ellipse boundary by finding angle and adjusting the radius
            var coord = graphie.constrainToBounds(graphie.getMouseCoord(event), 10);
            var dx = ellipse.yRadius * (ellipse.center[0] - coord[0]);
            var dy = ellipse.xRadius * (ellipse.center[1] - coord[1]);
            var angle = Math.atan2(dy, dx);

            coord[0] = ellipse.center[0] - ellipse.xRadius * Math.cos(angle);
            coord[1] = ellipse.center[1] - ellipse.yRadius * Math.sin(angle);

            var scaledPoint = graphie.scalePoint(coord);
            ellipse.boundaryPoint.attr({ cx: scaledPoint[0] });
            ellipse.boundaryPoint.attr({ cy: scaledPoint[1] });
            ellipse.boundaryPoint.animate(ellipse.ellipseBoundaryShowStyle, 50);

            ellipse.onMove(coord[0], coord[1]);
        };

        $(ellipse.perim[0]).on(
            "vmouseover vmouseout vmousemove", function(event) {
                if (event.type === "vmouseover") {
                    ellipse.showPoint(event);
                } else if (event.type === "vmouseout") {
                    ellipse.boundaryPoint.animate(ellipse.ellipseBoundaryHideStyle, 50);
                    ellipse.onLeave();
                } else if (event.type === "vmousemove") {
                    ellipse.showPoint(event);
                }
        });

        return ellipse;
    },

    addRotateHandle: (function() {
        var drawRotateHandle = function(graphie, center, radius, halfWidth,
                lengthAngle, angle, interacting) {
            // Get a point on the arrow, given an angle offset and a distance
            // from the "midline" of the arrow (ROTATE_HANDLE_DIST away from
            // the rotation point).
            var getRotateHandlePoint = function(offset,
                    distanceFromArrowMidline) {
                var distFromRotationCenter = radius + distanceFromArrowMidline;
                var vec = KhanUtil.kvector.cartFromPolarDeg([
                    distFromRotationCenter,
                    angle + offset
                ]);
                var absolute = KhanUtil.kvector.add(center, vec);
                var pixels = graphie.scalePoint(absolute);
                return pixels[0] + "," + pixels[1];
            };

            // Inner and outer radii for the curved part of the arrow
            var innerR = graphie.scaleVector(radius - halfWidth);
            var outerR = graphie.scaleVector(radius + halfWidth);

            // Draw the double-headed arrow thing that shows users where to
            // click and drag to rotate
            return graphie.raphael.path(
                // upper arrowhead
                " M" + getRotateHandlePoint(lengthAngle, -halfWidth) +
                " L" + getRotateHandlePoint(lengthAngle, -3 * halfWidth) +
                " L" + getRotateHandlePoint(2 * lengthAngle, 0) +
                " L" + getRotateHandlePoint(lengthAngle, 3 * halfWidth) +
                " L" + getRotateHandlePoint(lengthAngle, halfWidth) +
                // outer arc
                " A" + outerR[0] + "," + outerR[1] + ",0,0,1," +
                    getRotateHandlePoint(-lengthAngle, halfWidth) +
                // lower arrowhead
                " L" + getRotateHandlePoint(-lengthAngle, 3 * halfWidth) +
                " L" + getRotateHandlePoint(-2 * lengthAngle, 0) +
                " L" + getRotateHandlePoint(-lengthAngle, -3 * halfWidth) +
                " L" + getRotateHandlePoint(-lengthAngle, -halfWidth) +
                // inner arc
                " A" + innerR[0] + "," + innerR[1] + ",0,0,0," +
                    getRotateHandlePoint(lengthAngle, -halfWidth) +
                " Z"
            ).attr({
                stroke: null,
                fill: (interacting) ? KhanUtil.INTERACTING
                                    : KhanUtil.INTERACTIVE
            });
        };

        return function(options) {
            var graph = this;

            var rotatePoint = options.center;
            var radius = options.radius;
            var lengthAngle = options.lengthAngle || 30;
            var hideArrow = options.hideArrow || false;
            var mouseTarget = options.mouseTarget;
            var id = _.uniqueId("rotateHandle");

            // Normalize rotatePoint into something that always looks
            // like a movablePoint
            if (_.isArray(rotatePoint)) {
                rotatePoint = {
                    coord: rotatePoint
                };
            }

            var rotateHandle = graph.addMovablePoint({
                coord: KhanUtil.kpoint.addVector(
                    rotatePoint.coord,
                    KhanUtil.kvector.cartFromPolarDeg(
                        radius,
                        options.angleDeg || 0
                )),
                constraints: {
                    fixedDistance: {
                        dist: radius,
                        point: rotatePoint
                    }
                },
                mouseTarget: mouseTarget
            });

            // move the rotatePoint in front of the rotateHandle to avoid
            // confusing clicking/scaling of the rotateHandle when the user
            // intends to click on the rotatePoint
            rotatePoint.toFront();

            // The logic below in onMove handlers is to make sure we
            // move rotateHandle with rotatePoint
            var rotatePointPrevCoord = rotatePoint.coord;
            var rotateHandlePrevCoord = rotateHandle.coord;
            var rotateHandleStartCoord = rotateHandlePrevCoord;
            var isRotating = false;
            var isHovering = false;
            var drawnRotateHandle;

            var redrawRotateHandle = function(handleCoord) {
                if (hideArrow) {
                    return; // Don't draw anything!
                }

                var handleVec = KhanUtil.kvector.subtract(handleCoord,
                        rotatePoint.coord);
                var handlePolar = KhanUtil.kvector.polarDegFromCart(handleVec);
                var angle = handlePolar[1];

                if (drawnRotateHandle) {
                    drawnRotateHandle.remove();
                }

                drawnRotateHandle = drawRotateHandle(
                    graph,
                    rotatePoint.coord,
                    options.radius,
                    (isRotating || isHovering ?
                        options.hoverWidth / 2 :
                        options.width / 2
                    ),
                    lengthAngle,
                    angle,
                    isRotating || isHovering
                );
            };


            // when the rotation center moves, we need to move
            // the rotationHandle as well, or it will end up out
            // of sync
            $(rotatePoint).on("move." + id, function() {
                var delta = KhanUtil.kvector.subtract(
                    rotatePoint.coord,
                    rotatePointPrevCoord
                );

                rotateHandle.setCoord(KhanUtil.kvector.add(
                    rotateHandle.coord,
                    delta
                ));

                redrawRotateHandle(rotateHandle.coord);

                rotatePointPrevCoord = rotatePoint.coord;
                rotateHandle.constraints.fixedDistance.point = rotatePoint;
                rotateHandlePrevCoord = rotateHandle.coord;
            });

            // Rotate polygon with rotateHandle
            rotateHandle.onMove = function(x, y) {
                if (!isRotating) {
                    rotateHandleStartCoord = rotateHandlePrevCoord;
                    isRotating = true;
                }

                var coord = [x, y];

                if (options.onMove) {
                    var oldPolar = KhanUtil.kvector.polarDegFromCart(
                        KhanUtil.kvector.subtract(
                            rotateHandlePrevCoord,
                            rotatePoint.coord
                        )
                    );
                    var newPolar = KhanUtil.kvector.polarDegFromCart(
                        KhanUtil.kvector.subtract(coord, rotatePoint.coord)
                    );

                    var oldAngle = oldPolar[1];
                    var newAngle = newPolar[1];
                    var result = options.onMove(newAngle, oldAngle);
                    if (result != null && result !== true) {
                        if (result === false) {
                            result = oldAngle;
                        }
                        coord = KhanUtil.kvector.add(
                            rotatePoint.coord,
                            KhanUtil.kvector.cartFromPolarDeg(
                                [oldPolar[0], result]
                            )
                        );
                    }
                }

                redrawRotateHandle(coord);

                rotateHandlePrevCoord = coord;
                return coord;
            };

            rotateHandle.onMoveEnd = function() {
                isRotating = false;
                redrawRotateHandle(rotateHandle.coord);
                if (options.onMoveEnd) {
                    var oldPolar = KhanUtil.kvector.polarDegFromCart(
                        KhanUtil.kvector.subtract(
                            rotateHandleStartCoord,
                            rotatePoint.coord
                        )
                    );
                    var newPolar = KhanUtil.kvector.polarDegFromCart(
                        KhanUtil.kvector.subtract(
                            rotateHandle.coord,
                            rotatePoint.coord
                        )
                    );
                    options.onMoveEnd(newPolar[1], oldPolar[1]);
                }
            };

            // Remove the default dot added by the movablePoint since we have
            // our double-arrow thing
            rotateHandle.visibleShape.remove();

            if (!mouseTarget) {
                // Make the default mouse target bigger to encompass the whole
                // area around the double-arrow thing
                rotateHandle.mouseTarget.attr({scale: 2});
            }

            // Make the arrow-thing grow and shrink with mouseover/out
            var $mouseTarget = $(rotateHandle.mouseTarget.getMouseTarget());
            $mouseTarget.bind("vmouseover", function(e) {
                isHovering = true;
                redrawRotateHandle(rotateHandle.coord);
            });
            $mouseTarget.bind("vmouseout", function(e) {
                isHovering = false;
                redrawRotateHandle(rotateHandle.coord);
            });

            redrawRotateHandle(rotateHandle.coord);

            var oldRemove = rotateHandle.remove;
            rotateHandle.remove = function() {
                oldRemove.call(rotateHandle);
                if (drawnRotateHandle) {
                    drawnRotateHandle.remove();
                }
                $(rotatePoint).off("move." + id);
            };

            rotateHandle.update = function() {
                redrawRotateHandle(rotateHandle.coord);
            };

            return rotateHandle;
        };
    })(),

    addReflectButton: (function() {
        var drawButton = function(
                graphie,
                buttonCoord,
                lineCoords,
                size,
                distanceFromCenter,
                leftStyle,
                rightStyle) {

            // Avoid invalid lines
            if (kpoint.equal(lineCoords[0], lineCoords[1])) {
                lineCoords = [
                    lineCoords[0],
                    kpoint.addVector(lineCoords[0], [1, 1])
                ];
            }

            var lineDirection = kvector.normalize(
                kvector.subtract(lineCoords[1], lineCoords[0])
            );

            var lineVec = kvector.scale(
                lineDirection,
                size/2
            );

            // Calculate the offset the center points should be placed at
            var centerVec = kvector.scale(lineDirection, distanceFromCenter);
            var leftCenterVec = kvector.rotateDeg(centerVec, 90);
            var rightCenterVec = kvector.rotateDeg(centerVec, -90);

            // Calculate the offsets for the far points
            var negLineVec = kvector.negate(lineVec);
            var leftVec = kvector.rotateDeg(lineVec, 90);
            var rightVec = kvector.rotateDeg(lineVec, -90);

            // Calculate the center point locations
            var leftCenter = kpoint.addVectors(buttonCoord, leftCenterVec);
            var rightCenter = kpoint.addVectors(buttonCoord, rightCenterVec);

            // Calculate the far point locations
            var leftCoord1 = kpoint.addVectors(buttonCoord, leftCenterVec, lineVec, leftVec);
            var leftCoord2 = kpoint.addVectors(buttonCoord, leftCenterVec, negLineVec, leftVec);
            var rightCoord1 = kpoint.addVectors(buttonCoord, rightCenterVec, lineVec, rightVec);
            var rightCoord2 = kpoint.addVectors(buttonCoord, rightCenterVec, negLineVec, rightVec);

            var leftButton = graphie.path(
                [leftCenter, leftCoord1, leftCoord2, true],
                leftStyle
            );
            var rightButton = graphie.path(
                [rightCenter, rightCoord1, rightCoord2, true],
                rightStyle
            );

            return {
                remove: function() {
                    leftButton.remove();
                    rightButton.remove();
                }
            };
        };

        return function(options) {
            var graphie = this;

            var line = options.line;

            var button = graphie.addMovablePoint({
                constraints: options.constraints,
                coord: kline.midpoint([
                    line.pointA.coord,
                    line.pointZ.coord
                ]),
                snapX: graphie.snap[0],
                snapY: graphie.snap[1],
                onMove: function(x, y) {
                    // Don't allow the button to actually move. This is a hack
                    // around the inability to both set a point as fixed AND
                    // allow it to be clicked.
                    return false;
                },
                onMoveEnd: function(x, y) {
                    if (options.onMoveEnd) {
                        options.onMoveEnd.call(this, x, y);
                    }
                }
            });

            var isHovering = false;
            var isFlipped = false;
            var currentlyDrawnButton;

            var isHighlight = function() {
                return isHovering;
            };

            var styles = _.map([0, 1], function(isHighlight) {
                var baseStyle = isHighlight ?
                        options.highlightStyle :
                        options.normalStyle;

                return _.map([0, 1], function(opacity) {
                    return _.defaults({
                        "fill-opacity": opacity
                    }, baseStyle);
                });
            });

            var getStyle = function(isRight) {
                if (isFlipped) {
                    isRight = !isRight;
                }
                return styles[+isHighlight()][+isRight];
            };

            var redraw = function(coord, lineCoords) {
                if (currentlyDrawnButton) {
                    currentlyDrawnButton.remove();
                }
                currentlyDrawnButton = drawButton(
                    graphie,
                    coord,
                    lineCoords,
                    isHighlight() ? options.size * 1.5 : options.size,
                    isHighlight() ? options.size * 0.125 : 0.25,
                    getStyle(0),
                    getStyle(1)
                );
            };

            // Keep the button's position in-sync with the line
            var update = function(coordA, coordZ) {
                coordA = coordA || line.pointA.coord;
                coordZ = coordZ || line.pointZ.coord;

                var buttonCoord = kline.midpoint([coordA, coordZ]);
                button.setCoord(buttonCoord);

                redraw(buttonCoord, [coordA, coordZ]);
            };

            $(line).on("move", _.bind(update, button, null, null));

            // Add click handling
            var $mouseTarget = $(button.mouseTarget.getMouseTarget());
            $mouseTarget.on("vclick", function() {
                var result = options.onClick();
                if (result !== false) {
                    isFlipped = !isFlipped;
                    redraw(button.coord,
                        [line.pointA.coord, line.pointZ.coord]);
                }
            });

            // Bring the reflection line handles in front of the button, so
            // that if we drag the reflectPoints really close together, we can
            // still move the handles away from each other, rather than only
            // being able to apply the reflection.
            line.pointA.toFront();
            line.pointZ.toFront();

            // Replace the visual point with the double triangle thing
            button.visibleShape.remove();
            // Resize the hidden point to cover the size of the visual point
            var pointScale = graphie.scaleVector(options.size)[0] / 20;
            button.mouseTarget.attr({scale: 1.5 * pointScale});
            $mouseTarget.css("cursor", "pointer");

            // Make the arrow-thing grow and shrink with mouseover/out
            $mouseTarget.bind("vmouseover", function(e) {
                isHovering = true;
                redraw(button.coord, [line.pointA.coord, line.pointZ.coord]);
            });
            $mouseTarget.bind("vmouseout", function(e) {
                isHovering = false;
                redraw(button.coord, [line.pointA.coord, line.pointZ.coord]);
            });

            var oldButtonRemove = button.remove;
            button.remove = function() {
                currentlyDrawnButton.remove();
                oldButtonRemove.call(button);
            };

            button.update = update;
            button.isFlipped = function() {
                return isFlipped;
            };

            update();
            return button;
        };
    })(),

    protractor: function(center) {
        return new Protractor(this, center);
    },

    ruler: function(options) {
        return new Ruler(this, options || {});
    },

    addPoints: addPoints
});


function Protractor(graph, center) {
    this.set = graph.raphael.set();

    this.cx = center[0];
    this.cy = center[1];
    var pro = this;

    var r = graph.unscaleVector(180.5)[0];
    var imgPos = graph.scalePoint([this.cx - r, this.cy + r - graph.unscaleVector(10.5)[1]]);
    this.set.push(graph.mouselayer.image(
            "https://ka-perseus-graphie.s3.amazonaws.com/e9d032f2ab8b95979f674fbfa67056442ba1ff6a.png",
            imgPos[0], imgPos[1], 360, 180));


    // Customized polar coordinate thingie to make it easier to draw the double-headed arrow thing.
    // angle is what you'd expect -- use that big protractor on your screen :)
    // pixels from edge is relative to the edge of the protractor; it's not the full radius
    var arrowHelper = function(angle, pixelsFromEdge) {
        var scaledRadius = graph.scaleVector(r);
        scaledRadius[0] -= 16;
        scaledRadius[1] -= 16;
        var scaledCenter = graph.scalePoint(center);
        var x = Math.sin((angle + 90) * Math.PI / 180) * (scaledRadius[0] + pixelsFromEdge) + scaledCenter[0];
        var y = Math.cos((angle + 90) * Math.PI / 180) * (scaledRadius[1] + pixelsFromEdge) + scaledCenter[1];
        return x + "," + y;
    };

    // Draw the double-headed arrow thing that shows users where to click and drag to rotate
    var arrow = graph.raphael.path(
        " M" + arrowHelper(180, 6) +
        " L" + arrowHelper(180, 2) +
        " L" + arrowHelper(183, 10) +
        " L" + arrowHelper(180, 18) +
        " L" + arrowHelper(180, 14) +
        " A" + (graph.scaleVector(r)[0] + 10) + "," + (graph.scaleVector(r)[1] + 10) + ",0,0,1," + arrowHelper(170, 14) +
        " L" + arrowHelper(170, 18) +
        " L" + arrowHelper(167, 10) +
        " L" + arrowHelper(170, 2) +
        " L" + arrowHelper(170, 6) +
        " A" + (graph.scaleVector(r)[0] + 10) + "," + (graph.scaleVector(r)[1] + 10) + ",0,0,0," + arrowHelper(180, 6) +
        " Z"
    ).attr({
        "stroke": null,
        "fill": KhanUtil.INTERACTIVE
    });

    // add it to the set so it translates with everything else
    this.set.push(arrow);

    this.centerPoint = graph.addMovablePoint({
        coord: center,
        visible: false
    });

    // Use a movablePoint for rotation
    this.rotateHandle = graph.addMovablePoint({
        coord: [
            Math.sin(275 * Math.PI / 180) * (r + 0.5) + this.cx,
            Math.cos(275 * Math.PI / 180) * (r + 0.5) + this.cy
        ],
        onMove: function(x, y) {
            var angle = Math.atan2(pro.centerPoint.coord[1] - y, pro.centerPoint.coord[0] - x) * 180 / Math.PI;
            pro.rotate(-angle - 5, true);
        }
    });

    // Add a constraint so the point moves in a circle
    this.rotateHandle.constraints.fixedDistance.dist = r + 0.5;
    this.rotateHandle.constraints.fixedDistance.point = this.centerPoint;

    // Remove the default dot added by the movablePoint since we have our double-arrow thing
    this.rotateHandle.visibleShape.remove();
    // Make the mouse target bigger to encompass the whole area around the double-arrow thing
    this.rotateHandle.mouseTarget.attr({ scale: 2.0 });

    // Make the arrow-thing grow and shrink with mouseover/out
    var isDragging = false;
    var isHovering = false;
    var isHighlight = function() {
        return isHovering || isDragging;
    };

    var self = this;
    var $mouseTarget = $(self.rotateHandle.mouseTarget.getMouseTarget());
    $mouseTarget.bind("vmousedown", function(event) {
        isDragging = true;
        arrow.animate({ scale: 1.5, fill: KhanUtil.INTERACTING }, 50);

        $(document).bind("vmouseup.rotateHandle", function(event) {
            isDragging = false;

            if (!isHighlight()) {
                arrow.animate({ scale: 1.0, fill: KhanUtil.INTERACTIVE }, 50);
            }

            $(document).unbind("vmouseup.rotateHandle");
        });
    });

    $mouseTarget.bind("vmouseover", function(event) {
        isHovering = true;
        arrow.animate({ scale: 1.5, fill: KhanUtil.INTERACTING }, 50);
    });
    $mouseTarget.bind("vmouseout", function(event) {
        isHovering = false;
        if (!isHighlight()) {
            arrow.animate({ scale: 1.0, fill: KhanUtil.INTERACTIVE }, 50);
        }
    });

    var setNodes = $.map(this.set, function(el) { return el.node; });
    this.makeTranslatable = function makeTranslatable() {
        $(setNodes).css("cursor", "move");

        $(setNodes).bind("vmousedown", function(event) {
            event.preventDefault();
            var startx = event.pageX - $(graph.raphael.canvas.parentNode).offset().left;
            var starty = event.pageY - $(graph.raphael.canvas.parentNode).offset().top;

            $(document).bind("vmousemove.protractor", function(event) {
                // mouse{X|Y} are in pixels relative to the SVG
                var mouseX = event.pageX - $(graph.raphael.canvas.parentNode).offset().left;
                var mouseY = event.pageY - $(graph.raphael.canvas.parentNode).offset().top;
                // can't go beyond 10 pixels from the edge
                mouseX = Math.max(10, Math.min(graph.xpixels - 10, mouseX));
                mouseY = Math.max(10, Math.min(graph.ypixels - 10, mouseY));

                var dx = mouseX - startx;
                var dy = mouseY - starty;

                $.each(pro.set.items, function() {
                    this.translate(dx, dy);
                });
                pro.centerPoint.setCoord([pro.centerPoint.coord[0] + dx / graph.scale[0], pro.centerPoint.coord[1] - dy / graph.scale[1]]);
                pro.rotateHandle.setCoord([pro.rotateHandle.coord[0] + dx / graph.scale[0], pro.rotateHandle.coord[1] - dy / graph.scale[1]]);
                startx = mouseX;
                starty = mouseY;
            });

            $(document).one("vmouseup", function(event) {
                $(document).unbind("vmousemove.protractor");
            });
        });
    };


    this.rotation = 0;

    this.rotate = function(offset, absolute) {
        var center = graph.scalePoint(this.centerPoint.coord);

        if (absolute) {
            this.rotation = 0;
        }

        this.set.rotate(this.rotation + offset, center[0], center[1]);
        this.rotation = this.rotation + offset;

        return this;
    };

    this.moveTo = function moveTo(x, y) {
        var start = graph.scalePoint(pro.centerPoint.coord);
        var end = graph.scalePoint([x, y]);
        var time = KhanUtil.getDistance(start, end) * 2;  // 2ms per pixel

        $({ x: start[0], y: start[1] }).animate({ x: end[0], y: end[1] }, {
            duration: time,
            step: function(now, fx) {
                var dx = 0;
                var dy = 0;
                if (fx.prop === "x") {
                    dx = now - graph.scalePoint(pro.centerPoint.coord)[0];
                } else if (fx.prop === "y") {
                    dy = now - graph.scalePoint(pro.centerPoint.coord)[1];
                }
                $.each(pro.set.items, function() {
                    this.translate(dx, dy);
                });
                pro.centerPoint.setCoord([pro.centerPoint.coord[0] + dx / graph.scale[0], pro.centerPoint.coord[1] - dy / graph.scale[1]]);
                pro.rotateHandle.setCoord([pro.rotateHandle.coord[0] + dx / graph.scale[0], pro.rotateHandle.coord[1] - dy / graph.scale[1]]);
            }
        });
    };

    this.rotateTo = function rotateTo(angle) {
        if (Math.abs(this.rotation - angle) > 180) {
            this.rotation += 360;
        }
        var time = Math.abs(this.rotation - angle) * 5;  // 5ms per deg
        $({ 0: this.rotation }).animate({ 0: angle }, {
            duration: time,
            step: function(now, fx) {
                pro.rotate(now, true);
                pro.rotateHandle.setCoord([
                    Math.sin((now + 275) * Math.PI / 180) * (r + 0.5) + pro.centerPoint.coord[0],
                    Math.cos((now + 275) * Math.PI / 180) * (r + 0.5) + pro.centerPoint.coord[1]
                ]);
            }
        });
    };

    this.remove = function() {
        this.set.remove();
    };

    this.makeTranslatable();
    return this;
}

function Ruler(graphie, options) {
    _.defaults(options, {
        center: [0, 0],
        pixelsPerUnit: 40,
        ticksPerUnit: 10,   // 10 or power of 2
        units: 10,          // the length the ruler can measure
        label: "",          // e.g "cm" (the shorter, the better)
        style: {
            fill: null,
            stroke: KhanUtil.GRAY
        }
    });

    var light = _.extend({}, options.style, {strokeWidth: 1});
    var bold  = _.extend({}, options.style, {strokeWidth: 2});

    // Ruler dimensions in pixels
    var width = options.units * options.pixelsPerUnit;
    var height = 50;        // arbitrary, but looks good

    // Bottom left corner of the ruler in graphie units
    var leftBottom = graphie.unscalePoint(
        kvector.subtract(
            graphie.scalePoint(options.center),
            kvector.scale([width, -height], 0.5)
        )
    );

    var graphieUnitsPerUnit = options.pixelsPerUnit / graphie.scale[0];
    var graphieUnitsHeight = height / graphie.scale[0];

    // Top right corner of the ruler in graphie units
    var rightTop = kvector.add(
        leftBottom,
        [options.units * graphieUnitsPerUnit, graphieUnitsHeight]
    );

    var tickHeight = 1.0;   // percent of ruler height
    var tickHeightMap;      // mapping of tick frequency to tick height
                            // {n: h} means every n-th tick will have height h

    if (options.ticksPerUnit === 10) {
        // decimal, as on a centimeter ruler
        tickHeightMap = {
            10: tickHeight,
            5:  tickHeight * 0.55,
            1:  tickHeight * 0.35
        };
    } else {
        // powers of 2, as on an inch ruler
        var sizes = [1, 0.6, 0.45, 0.3];

        tickHeightMap = {};
        for (var i = options.ticksPerUnit; i >= 1; i /= 2) {
            tickHeightMap[i] = tickHeight * (sizes.shift() || 0.2);
        }
    }

    var tickFrequencies = _.keys(tickHeightMap).sort(function(a, b) {
        return b - a;
    });

    function getTickHeight(i) {
        for (var k = 0; k < tickFrequencies.length; k++) {
            var key = tickFrequencies[k];
            if (i % key === 0) {
                return tickHeightMap[key];
            }
        }
    }

    // Draw the ruler
    var left = leftBottom[0];
    var bottom = leftBottom[1];
    var right = rightTop[0];
    var top = rightTop[1];

    var numTicks = options.units * options.ticksPerUnit + 1;

    var set = graphie.raphael.set();

    var px = 1 / graphie.scale[0]; // one pixel
    set.push(graphie.line([left - px, bottom], [right + px, bottom], bold));
    set.push(graphie.line([left - px, top], [right + px, top], bold));

    _.times(numTicks, function(i) {
        var n = i / options.ticksPerUnit;
        var x = left + n * graphieUnitsPerUnit;
        var height = getTickHeight(i) * graphieUnitsHeight;

        var style = (i === 0 || i === numTicks - 1) ? bold : light;
        set.push(graphie.line([x, bottom], [x, bottom + height], style));

        if (n % 1 === 0) {
            // Graphie labels are difficult to rotate in IE8,
            // so use raphael.text() instead
            var coord = graphie.scalePoint([x, top]);
            var text;
            var offset;

            if (n === 0) {
                // Unit label
                text = options.label;
                offset = {
                    mm: 13,
                    cm: 11,
                    m: 8,
                    km: 11,
                    in: 8,
                    ft: 8,
                    yd: 10,
                    mi: 10
                }[text] || (3 * text.toString().length);
            } else {
                // Tick label
                text = n;
                offset = -3 * (n.toString().length + 1);
            }
            var label = graphie.raphael.text(
                coord[0] + offset,
                coord[1] + 10,
                text
            );
            label.attr({
                "font-family": "KaTeX_Main",
                "font-size": "12px",
                "color": "#444"
            });
            set.push(label);
        }
    });

    // Add a mouse target
    var mouseTarget = graphie.mouselayer.path(KhanUtil.svgPath([
        leftBottom, [left, top], rightTop, [right, bottom], /* closed */ true
    ]));
    mouseTarget.attr({
        fill: "#000",
        opacity: 0,
        stroke: "#000",
        "stroke-width": 2
    });
    set.push(mouseTarget);

    var setNodes = $.map(set, function(el) { return el.node; });
    $(setNodes).css("cursor", "move");

    $(setNodes).bind("vmousedown", function(event) {
        event.preventDefault();
        var startx = event.pageX - $(graphie.raphael.canvas.parentNode).offset().left;
        var starty = event.pageY - $(graphie.raphael.canvas.parentNode).offset().top;

        $(document).bind("vmousemove.ruler", function(event) {
            // mouse{X|Y} are in pixels relative to the SVG
            var mouseX = event.pageX - $(graphie.raphael.canvas.parentNode).offset().left;
            var mouseY = event.pageY - $(graphie.raphael.canvas.parentNode).offset().top;
            // can't go beyond 10 pixels from the edge
            mouseX = Math.max(10, Math.min(graphie.xpixels - 10, mouseX));
            mouseY = Math.max(10, Math.min(graphie.ypixels - 10, mouseY));

            var dx = mouseX - startx;
            var dy = mouseY - starty;

            set.translate(dx, dy);
            leftBottomHandle.setCoord([leftBottomHandle.coord[0] + dx / graphie.scale[0], leftBottomHandle.coord[1] - dy / graphie.scale[1]]);
            rightBottomHandle.setCoord([rightBottomHandle.coord[0] + dx / graphie.scale[0], rightBottomHandle.coord[1] - dy / graphie.scale[1]]);

            startx = mouseX;
            starty = mouseY;
        });

        $(document).one("vmouseup", function(event) {
            $(document).unbind("vmousemove.ruler");
        });
    });

    // Handles for rotation
    var leftBottomHandle = graphie.addMovablePoint({
        coord: leftBottom,
        normalStyle: {
            fill: KhanUtil.INTERACTIVE,
            "fill-opacity": 0,
            stroke: KhanUtil.INTERACTIVE
        },
        highlightStyle: {
            fill: KhanUtil.INTERACTING,
            "fill-opacity": 0.1,
            stroke: KhanUtil.INTERACTING
        },
        pointSize: 6, // or 8 maybe?
        onMove: function(x, y) {
            var dy = rightBottomHandle.coord[1] - y;
            var dx = rightBottomHandle.coord[0] - x;
            var angle = Math.atan2(dy, dx) * 180 / Math.PI;
            var center = kvector.scale(kvector.add([x, y], rightBottomHandle.coord), 0.5);
            var scaledCenter = graphie.scalePoint(center);
            var oldCenter = kvector.scale(kvector.add(leftBottomHandle.coord, rightBottomHandle.coord), 0.5);
            var scaledOldCenter = graphie.scalePoint(oldCenter);
            var diff = kvector.subtract(scaledCenter, scaledOldCenter);
            set.rotate(-angle, scaledOldCenter[0], scaledOldCenter[1]);
            set.translate(diff[0], diff[1]);
        }
    });
    var rightBottomHandle = graphie.addMovablePoint({
        coord: [right, bottom],
        normalStyle: {
            fill: KhanUtil.INTERACTIVE,
            "fill-opacity": 0,
            stroke: KhanUtil.INTERACTIVE
        },
        highlightStyle: {
            fill: KhanUtil.INTERACTING,
            "fill-opacity": 0.1,
            stroke: KhanUtil.INTERACTING
        },
        pointSize: 6, // or 8 maybe?
        onMove: function(x, y) {
            var dy = y - leftBottomHandle.coord[1];
            var dx = x - leftBottomHandle.coord[0];
            var angle = Math.atan2(dy, dx) * 180 / Math.PI;
            var center = kvector.scale(kvector.add([x, y], leftBottomHandle.coord), 0.5);
            var scaledCenter = graphie.scalePoint(center);
            var oldCenter = kvector.scale(kvector.add(leftBottomHandle.coord, rightBottomHandle.coord), 0.5);
            var scaledOldCenter = graphie.scalePoint(oldCenter);
            var diff = kvector.subtract(scaledCenter, scaledOldCenter);
            set.rotate(-angle, scaledOldCenter[0], scaledOldCenter[1]);
            set.translate(diff[0], diff[1]);
        }
    });

    // Make each handle rotate the ruler about the other one
    leftBottomHandle.constraints.fixedDistance.dist = width / graphie.scale[0];
    leftBottomHandle.constraints.fixedDistance.point = rightBottomHandle;
    rightBottomHandle.constraints.fixedDistance.dist = width / graphie.scale[0];
    rightBottomHandle.constraints.fixedDistance.point = leftBottomHandle;

    this.remove = function() {
        set.remove();
        leftBottomHandle.remove();
        rightBottomHandle.remove();
    };

    return this;
}

function MovableAngle(graphie, options) {
    this.graphie = graphie;

    // TODO(alex): Move standard colors from math.js to somewhere else
    // so that they are available when this file is first parsed
    _.extend(this, options);
    _.defaults(this, {
        normalStyle: {
            "stroke": KhanUtil.INTERACTIVE,
            "stroke-width": 2,
            "fill": KhanUtil.INTERACTIVE
        },
        highlightStyle: {
            "stroke": KhanUtil.INTERACTING,
            "stroke-width": 2,
            "fill": KhanUtil.INTERACTING
        },
        labelStyle: {
            "stroke": KhanUtil.DYNAMIC,
            "stroke-width": 1,
            "color": KhanUtil.DYNAMIC
        },
        angleStyle: {
            "stroke": KhanUtil.DYNAMIC,
            "stroke-width": 1,
            "color": KhanUtil.DYNAMIC
        },
        allowReflex: true // not on MovableAngle.prototype so that
                          // it is not overridden by undefined
    });

    if (!this.points || this.points.length !== 3) {
        throw new Error("MovableAngle requires 3 points");
    }

    // Handle coordinates that are not MovablePoints (i.e. [2, 4])
    this.points = _.map(options.points, function(point) {
        if (_.isArray(point)) {
            return graphie.addMovablePoint({
                coord: point,
                visible: false,
                constraints: {
                    fixed: true
                },
                normalStyle: this.normalStyle
            });
        } else {
            return point;
        }
    }, this);
    this.coords = _.pluck(this.points, "coord");
    if (this.reflex == null) {
        if (this.allowReflex) {
            this.reflex = (this._getClockwiseAngle(this.coords) > 180);
        } else {
            this.reflex = false;
        }
    }

    this.rays = _.map([0, 2], function(i) {
        return graphie.addMovableLineSegment({
            pointA: this.points[1],
            pointZ: this.points[i],
            fixed: true,
            extendRay: true
        });
    }, this);

    this.temp = [];
    this.labeledAngle = graphie.label([0, 0], "", "center", this.labelStyle);

    if (!this.fixed) {
        this.addMoveHandlers();
        this.addHighlightHandlers();
    }
    this.update();
}

_.extend(MovableAngle.prototype, {
    points: [],
    snapDegrees: 0,
    snapOffsetDeg: 0,
    angleLabel: "",
    numArcs: 1,
    pushOut: 0,
    fixed: false,

    addMoveHandlers: function() {
        var graphie = this.graphie;

        function tooClose(point1, point2) {
            // Vertex and ray points can't be closer than this many pixels
            var safeDistance = 30;
            var distance = KhanUtil.getDistance(
                graphie.scalePoint(point1),
                graphie.scalePoint(point2)
            );
            return distance < safeDistance;
        }

        var points = this.points;

        // Drag the vertex to move the entire angle
        points[1].onMove = function(x, y) {
            var oldVertex = points[1].coord;
            var newVertex = [x, y];
            var delta = addPoints(newVertex, reverseVector(oldVertex));

            var valid = true;
            var newPoints = {};
            _.each([0, 2], function(i) {
                var oldPoint = points[i].coord;
                var newPoint = addPoints(oldPoint, delta);

                // Constrain ray points to stay the same angle from vertex
                var angle = KhanUtil.findAngle(newVertex, newPoint);
                angle *= Math.PI / 180;
                newPoint = graphie.constrainToBoundsOnAngle(newPoint, 10, angle);
                newPoints[i] = newPoint;

                if (tooClose(newVertex, newPoint)) {
                    valid = false;
                }
            });

            // Only move points if all new positions are valid
            if (valid) {
                _.each(newPoints, function(newPoint, i) {
                    points[i].setCoord(newPoint);
                });
            }
            return valid;
        };

        var snap = this.snapDegrees;
        var snapOffset = this.snapOffsetDeg;

        // Drag ray control points to move each ray individually
        _.each([0, 2], function(i) {
            points[i].onMove = function(x, y) {
                var newPoint = [x, y];
                var vertex = points[1].coord;

                if (tooClose(vertex, newPoint)) {
                    return false;
                } else if (snap) {
                    var angle = KhanUtil.findAngle(newPoint, vertex);
                    angle = Math.round((angle - snapOffset) / snap) * snap +
                            snapOffset;
                    var distance = KhanUtil.getDistance(newPoint, vertex);
                    return addPoints(vertex, graphie.polar(distance, angle));
                } else {
                    return true;
                }
            };
        });

        // Expose only a single move event
        $(points).on("move", function() {
            this.update();
            $(this).trigger("move");
        }.bind(this));
    },

    addHighlightHandlers: function() {
        var vertex = this.points[1];

        vertex.onHighlight = function() {
            _.each(this.points, function(point) {
                point.visibleShape.animate(this.highlightStyle, 50);
            }, this);
            _.each(this.rays, function(ray) {
                ray.visibleLine.animate(this.highlightStyle, 50);
                ray.arrowStyle = _.extend({}, ray.arrowStyle, {
                    "color": this.highlightStyle.stroke,
                    "stroke": this.highlightStyle.stroke
                });
            }, this);

            this.angleStyle = _.extend({}, this.angleStyle, {
                "color": this.highlightStyle.stroke,
                "stroke": this.highlightStyle.stroke
            });
            this.update();

        }.bind(this);

        vertex.onUnhighlight = function() {
            _.each(this.points, function(point) {
                point.visibleShape.animate(this.normalStyle, 50);
            }, this);
            _.each(this.rays, function(ray) {
                ray.visibleLine.animate(ray.normalStyle, 50);
                ray.arrowStyle = _.extend({}, ray.arrowStyle, {
                    "color": ray.normalStyle.stroke,
                    "stroke": ray.normalStyle.stroke
                });
            }, this);

            this.angleStyle = _.extend({}, this.angleStyle, {
                "color": KhanUtil.DYNAMIC,
                "stroke": KhanUtil.DYNAMIC
            });
            this.update();

        }.bind(this);
    },

    /**
     * Returns the angle in [0, 360) degrees created by the
     * coords when interpreted in a clockwise direction.
     */
    _getClockwiseAngle: function(coords) {
        // TODO(jack): Add this to a kangle.js
        var clockwiseAngle = (KhanUtil.findAngle(
            // The order of these is "weird" to match what a clockwise
            // order is in graphie.labelAngle
            coords[2], // from the second point
            coords[0], // clockwise to the first point
            coords[1] // the vertex parameter is last
        ) + 360) % 360;

        return clockwiseAngle;
    },

    isReflex: function() {
        return this.reflex;
    },

    isClockwise: function() {
        var clockwiseReflexive = (this._getClockwiseAngle(this.coords) > 180);
        return clockwiseReflexive === this.reflex;
    },

    getClockwiseCoords: function() {
        if (this.isClockwise()) {
            return _.clone(this.coords);
        } else {
            return _.clone(this.coords).reverse();
        }
    },

    update: function(shouldChangeReflexivity) {
        // Update coords
        var prevCoords = this.coords;
        this.coords = _.pluck(this.points, "coord");

        // Update lines
        _.invoke(this.points, "updateLineEnds");

        var prevAngle = this._getClockwiseAngle(prevCoords);
        var angle = this._getClockwiseAngle(this.coords);
        var prevClockwiseReflexive = (prevAngle > 180);
        var clockwiseReflexive = (angle > 180);

        if (this.allowReflex) {
            if (shouldChangeReflexivity == null) {
                shouldChangeReflexivity =
                        (prevClockwiseReflexive !== clockwiseReflexive) &&
                        (Math.abs(angle - prevAngle) < 180);
            }

            if (shouldChangeReflexivity) {
                this.reflex = !this.reflex;
            }
        }

        _.invoke(this.temp, "remove");
        this.temp = this.graphie.labelAngle({
            point1: this.coords[0],
            vertex: this.coords[1],
            point3: this.coords[2],
            label: this.labeledAngle,
            text: this.angleLabel,
            numArcs: this.numArcs,
            pushOut: this.pushOut,
            clockwise: this.reflex === clockwiseReflexive,
            style: this.angleStyle
        });
    },

    remove: function() {
        _.invoke(this.rays, "remove");
        _.invoke(this.temp, "remove");
        this.labeledAngle.remove();
    }
});

});
