$.extend(KhanUtil, {
    drawHintLine: function(pt1, pt2, ticks) {
        var graphie = KhanUtil.currentGraph;

        var length = KhanUtil.eDist(pt1, pt2);
        var midpoint = [(pt1[0] + pt2[0]) / 2, (pt1[1] + pt2[1]) / 2];
        var angle = Math.atan2(pt2[1] - pt1[1], pt2[0] - pt1[0]);
        var transform = function(point) {
            var matrix = KhanUtil.makeMatrix([
                [Math.cos(angle), -Math.sin(angle), midpoint[0]],
                [Math.sin(angle), Math.cos(angle), midpoint[1]],
                [0, 0, 1]
            ]);
            var vector = KhanUtil.makeMatrix([[point[0]], [point[1]], [1]]);
            var prod = KhanUtil.matrixMult(matrix, vector);
            return [prod[0], prod[1]];
        };

        var hintLine = graphie.raphael.set();

        hintLine.push(graphie.line(transform([-length / 2, 0]),
            transform([length / 2, 0]), {
                stroke: KhanUtil.BLUE,
                strokeWidth: 1,
                strokeDasharray: "- "
            }));
        graphie.style({
            stroke: KhanUtil.BLUE,
            strokeWidth: 1,
        }, function() {
            if (ticks === 1) {
                hintLine.push(graphie.line(
                    transform(graphie.unscaleVector([0, 6])),
                    transform(graphie.unscaleVector([0, -6]))));
            } else if (ticks === 2) {
                hintLine.push(graphie.line(
                    transform(graphie.unscaleVector([-3, 6])),
                    transform(graphie.unscaleVector([-3, -6]))));
                hintLine.push(graphie.line(
                    transform(graphie.unscaleVector([3, 6])),
                    transform(graphie.unscaleVector([3, -6]))));
            } else if (ticks === 3) {
                hintLine.push(graphie.line(
                    transform(graphie.unscaleVector([-6, 6])),
                    transform(graphie.unscaleVector([-6, -6]))));
                hintLine.push(graphie.line(
                    transform(graphie.unscaleVector([0, 6])),
                    transform(graphie.unscaleVector([0, -6]))));
                hintLine.push(graphie.line(
                    transform(graphie.unscaleVector([6, 6])),
                    transform(graphie.unscaleVector([6, -6]))));
            }
        });
        return hintLine;
    },

    construction: {},

    // Useful for diagnostics: type "KhanUtil.showSnapPts()" in the console
    showSnapPts: function() {
        var graphie = KhanUtil.currentGraph;
        var set = graphie.raphael.set();
        _.each(KhanUtil.construction.interPoints, function(pt) {
            set.push(graphie.circle(pt, 0.1, {
                stroke: KhanUtil.PINK,
                fill: KhanUtil.PINK
            }));
        });
        _.each(KhanUtil.construction.snapPoints, function(pt) {
            set.push(graphie.circle(pt.coord, 0.1, {
                stroke: KhanUtil.RED,
                fill: KhanUtil.RED
            }));
        });
        _.delay(function() { set.remove(); }, 500);
    },

    // initialize the construction object, giving it a reference to the
    // graphie it should refer to (so that the KhanUtil.currentGraph
    // pointer can change without screwing everything up)
    addConstruction: function(graphieId) {
        var graphie = $("#" + graphieId).data("graphie");
        var construction = KhanUtil.construction = {
            tools: [], // a list of all compasses/straightedges on the graph
            tool: {}, // the latest tool added
            snapPoints: [], // "special" points all other points should snap to
            interPoints: [], // "special" points all other points should snap to
            snapLines: [] // points should also snap to lines
        };

        // add a compass tool to the graph
        // the compass has the following fields:
        // center: movable point
        // radius: int
        // circ: graphie circle
        // perim: invisible mouse target for dragging/changing radius
        construction.addCompass = function() {
            var start = [Math.random() * 4 - 2, Math.random() * 4 - 2];
            var startRadius = Math.random() + 1.5;
            construction.tool = {
                interType: "circle",
                center: graphie.addMovablePoint({
                        graph: graphie,
                        coord: start,
                        normalStyle: {
                            stroke: KhanUtil.BLUE,
                            fill: KhanUtil.BLUE
                        }
                    }),
                radius: startRadius,
                circ: graphie.circle(start, startRadius, {
                        stroke: KhanUtil.BLUE,
                        strokeDasharray: "- ",
                        fill: KhanUtil.ORANGE,
                        fillOpacity: 0
                    }),
                perim: graphie.mouselayer.circle(
                        graphie.scalePoint(start)[0],
                        graphie.scalePoint(start)[1],
                        graphie.scaleVector(startRadius)[0]).attr({
                            "stroke-width": 20,
                            "opacity": 0.0
                        })
            };

            var t = construction.tool;

            $(t.center.mouseTarget[0]).bind(
                "vmouseover vmouseout", function(event) {
                    if (t.center.highlight) {
                        t.circ.animate({
                            stroke: KhanUtil.ORANGE,
                            "fill-opacity": 0.05
                        }, 50);
                    } else {
                        t.circ.animate({
                            stroke: KhanUtil.BLUE,
                            "fill-opacity": 0
                        }, 50);
                    }
                });

            // add this tool to the graph's set
            construction.tools.push(t);

            // add new points that all other points should snap to
            construction.snapPoints.push(t.center);



            t.center.onMove = function(x, y) {
                t.circ.toFront();
                t.perim.toFront();
                t.center.visibleShape.toFront();
                t.center.mouseTarget.toFront();
                t.circ.attr({
                    cx: graphie.scalePoint(x)[0],
                    cy: graphie.scalePoint(y)[1],
                });
                t.perim.attr({
                    cx: graphie.scalePoint(x)[0],
                    cy: graphie.scalePoint(y)[1],
                });
            };

            t.center.onMoveEnd = function(x, y) {
                _.each(construction.snapLines, function(line) {
                    var distIntersect = KhanUtil.lDist(t.center.coord, line);
                    if (distIntersect[0] < 0.25) {
                        t.center.onMove(distIntersect[1][0],
                            distIntersect[1][1]);
                        t.center.setCoord(distIntersect[1]);
                    }
                });

                // keep track of all the possible snap points,
                // and snap to the closest one
                var myPossibleSnaps = [];
                _.each(construction.snapPoints, function(point) {
                    if (KhanUtil.eDist(t.center.coord, point.coord) < 0.25 &&
                            t.center.coord !== point.coord) {
                        myPossibleSnaps.push(point.coord);
                    }
                });

                // before checking to see if we've moved onto an
                // intersection of lines/circles, update these
                // intersections
                construction.updateIntersections();
                _.each(construction.interPoints, function(point) {
                    if (KhanUtil.eDist(t.center.coord, point) < 0.3 &&
                            t.center.coord !== point) {
                        myPossibleSnaps.push(point);
                    }
                });

                // Now, snap to closest possible snap Point
                var mySnapPoint = [];
                var mySnapDist = null;
                _.each(myPossibleSnaps, function(sCoord) {
                    if (mySnapDist == null ||
                            KhanUtil.eDist(sCoord, t.center.coord) <
                            mySnapDist) {
                        mySnapPoint = sCoord;
                        mySnapDist = KhanUtil.eDist(sCoord, t.center.coord);
                    }
                });

                if (mySnapPoint.length > 0) {
                    t.center.onMove(mySnapPoint[0], mySnapPoint[1]);
                    t.center.setCoord(mySnapPoint);
                }
            };

            t.center.mouseTarget.dblclick(function() {
                construction.removeTool(t, true);
            });

            $(t.perim[0]).css("cursor", "move");
            $(t.perim[0]).bind(
                "vmouseover vmouseout vmousedown", function(event) {
                    if (event.type === "vmouseover") {
                        t.highlight = true;
                        if (!KhanUtil.dragging) {
                            t.circ.animate({
                                stroke: KhanUtil.ORANGE,
                                "fill-opacity": 0.05
                            }, 50);
                            t.center.visibleShape.animate({
                                stroke: KhanUtil.ORANGE,
                                fill: KhanUtil.ORANGE
                            }, 50);
                        }

                    } else if (event.type === "vmouseout") {
                        t.highlight = false;
                        if (!t.dragging) {
                            t.circ.animate({
                                stroke: KhanUtil.BLUE,
                                "fill-opacity": 0
                            }, 50);
                            t.center.visibleShape.animate({
                                stroke: KhanUtil.BLUE,
                                fill: KhanUtil.BLUE
                            }, 50);
                        }

                    } else if (event.type === "vmousedown" &&
                            (event.which === 1 || event.which === 0)) {
                        event.preventDefault();
                        var data = t;
                        data.circ.toFront();
                        data.perim.toFront();
                        data.center.visibleShape.toFront();
                        data.center.mouseTarget.toFront();

                        $(document).bind("vmousemove vmouseup", function(event) {
                            event.preventDefault();
                            data.dragging = true;
                            KhanUtil.dragging = true;

                            if (event.type === "vmousemove") {
                                var mouseX = event.pageX -
                                    $(graphie.raphael.canvas.parentNode).offset().left;
                                var mouseY = event.pageY -
                                    $(graphie.raphael.canvas.parentNode).offset().top;

                                data.radius = KhanUtil.eDist(data.center.coord,
                                    graphie.unscalePoint([mouseX, mouseY]));
                                data.perim.attr({
                                    r: graphie.scaleVector(data.radius)[0],
                                });
                                data.circ.attr({
                                    rx: graphie.scaleVector(data.radius)[0],
                                    ry: graphie.scaleVector(data.radius)[1]
                                });

                            } else if (event.type === "vmouseup") {
                                $(document).unbind("vmousemove vmouseup");
                                data.dragging = false;
                                KhanUtil.dragging = false;
                                construction.updateIntersections();
                            }
                        });
                    }
            });
            construction.updateIntersections();
        };

        // add a straightedge object
        // the straightedge object has the following fields
        // first, second: movable endpoints
        // edge: movable line segment
        construction.addStraightedge = function() {
            construction.tool = {
                interType: "line",
                first: graphie.addMovablePoint({
                        graph: graphie,
                        coordX: -1, coordY: Math.random() * 2,
                        normalStyle: {
                            stroke: KhanUtil.BLUE,
                            fill: KhanUtil.BLUE
                        }
                    }),
                second: graphie.addMovablePoint({
                        graph: graphie,
                        coordX: 1, coordY: Math.random() * 2,
                        normalStyle: {
                            stroke: KhanUtil.BLUE,
                            fill: KhanUtil.BLUE
                        }
                    })
            };

            // this is a bit confusing: "graph: graphie" refers
            // to the movableLineSegment's graph field, whereas
            // "construction.tool.etc" refers to the KhanUtil.construction
            // object being built in this util
            construction.tool.edge = graphie.addMovableLineSegment({
                    graph: graphie,
                    pointA: construction.tool.first,
                    pointZ: construction.tool.second,
                    normalStyle: {
                        stroke: KhanUtil.BLUE,
                        "stroke-width": 2
                    },
                    highlightStyle: {
                        stroke: KhanUtil.ORANGE,
                        "stroke-width": 3
                    },
                    extendLine: true
                });

            $(construction.tool.first.mouseTarget[0]).bind(
                "vmouseover vmouseout", construction.tool, function(event) {
                    if (event.data.first.highlight) {
                        event.data.edge.visibleLine.animate({
                            stroke: KhanUtil.ORANGE
                        }, 50);
                        event.data.second.visibleShape.animate({
                            stroke: KhanUtil.ORANGE,
                            fill: KhanUtil.ORANGE
                        }, 50);
                    } else {
                        event.data.edge.visibleLine.animate({
                            stroke: KhanUtil.BLUE
                        }, 50);
                        event.data.second.visibleShape.animate({
                            stroke: KhanUtil.BLUE,
                            fill: KhanUtil.BLUE
                        }, 50);
                    }
                });
            $(construction.tool.second.mouseTarget[0]).bind(
                "vmouseover vmouseout", construction.tool, function(event) {
                    if (event.data.second.highlight) {
                        event.data.edge.visibleLine.animate({
                            stroke: KhanUtil.ORANGE
                        }, 50);
                        event.data.first.visibleShape.animate({
                            stroke: KhanUtil.ORANGE,
                            fill: KhanUtil.ORANGE
                        }, 50);
                    } else {
                        event.data.edge.visibleLine.animate({
                            stroke: KhanUtil.BLUE
                        }, 50);
                        event.data.first.visibleShape.animate({
                            stroke: KhanUtil.BLUE,
                            fill: KhanUtil.BLUE
                        }, 50);
                    }
                });
            $(construction.tool.edge.mouseTarget[0]).bind(
                "vmouseover vmouseout", construction.tool, function(event) {
                    if (event.data.edge.highlight) {
                        event.data.first.visibleShape.animate({
                            stroke: KhanUtil.ORANGE,
                            fill: KhanUtil.ORANGE
                        }, 50);
                        event.data.second.visibleShape.animate({
                            stroke: KhanUtil.ORANGE,
                            fill: KhanUtil.ORANGE
                        }, 50);
                    } else {
                        event.data.first.visibleShape.animate({
                            stroke: KhanUtil.BLUE,
                            fill: KhanUtil.BLUE
                        }, 50);
                        event.data.second.visibleShape.animate({
                            stroke: KhanUtil.BLUE,
                            fill: KhanUtil.BLUE
                        }, 50);
                    }
                });

            // add new tool object to graph's collection
            construction.tools.push(construction.tool);

            // keep track of all the points/lines that points
            // should snap to
            construction.snapPoints.push(construction.tool.first);
            construction.snapPoints.push(construction.tool.second);

            construction.snapLines.push(construction.tool.edge);

            var t = construction.tool;

            //t.edge.toBack();

            t.edge.onMove = function(dX, dY) {
                t.first.setCoord([t.first.coord[0] + dX,
                    t.first.coord[1] + dY]);
                t.second.setCoord([t.second.coord[0] + dX,
                    t.second.coord[1] + dY]);
            };

            t.edge.onMoveEnd = function(dX, dY) {
                t.edge.visibleLine.toFront();
                t.edge.mouseTarget.toFront();
                t.first.visibleShape.toFront();
                t.first.mouseTarget.toFront();
                t.second.visibleShape.toFront();
                t.second.mouseTarget.toFront();
                t.first.onMoveEnd(t.first.coord[0], t.first.coord[1]);
                t.second.onMoveEnd(t.second.coord[0], t.second.coord[1]);
            };

            endpointMoveEnd = function(x, y, end) {
                _.each(construction.snapLines, function(line) {
                    distIntersect = KhanUtil.lDist(end.coord, line);
                    if (distIntersect[0] < 0.25) {
                        end.setCoord(distIntersect[1]);
                        end.updateLineEnds();
                    }
                });

                // keep track of all the possible snap points,
                // and snap to the closest one
                var myPossibleSnaps = [];
                _.each(construction.snapPoints, function(point) {
                    if (KhanUtil.eDist(end.coord, point.coord) < 0.25 &&
                            end.coord !== point.coord) {
                        myPossibleSnaps.push(point.coord);
                    }
                });

                // before checking to see if we've moved onto an
                // intersection of lines/circles, update these
                // intersections
                construction.updateIntersections();
                _.each(construction.interPoints, function(point) {
                    if (KhanUtil.eDist(end.coord, point) < 0.3 &&
                            end.coord !== point) {
                        myPossibleSnaps.push(point);
                    }
                });

                // Now, snap to closest possible snap Point
                var mySnapPoint = [];
                var mySnapDist = null;
                _.each(myPossibleSnaps, function(sCoord) {
                    if (mySnapDist == null ||
                            KhanUtil.eDist(sCoord, end.coord) < mySnapDist) {
                        mySnapPoint = sCoord;
                        mySnapDist = KhanUtil.eDist(sCoord, end.coord);
                    }
                });

                if (mySnapPoint.length > 0) {
                    end.setCoord(mySnapPoint);
                    end.updateLineEnds();
                }
                t.edge.visibleLine.toFront();
                t.edge.mouseTarget.toFront();
                t.first.visibleShape.toFront();
                t.first.mouseTarget.toFront();
                t.second.visibleShape.toFront();
                t.second.mouseTarget.toFront();
            };

            t.first.onMoveEnd = function(x, y) {
                endpointMoveEnd(x, y, t.first);
            };
            t.second.onMoveEnd = function(x, y) {
                endpointMoveEnd(x, y, t.second);
            };

            $(t.first.mouseTarget[0]).bind("dblclick", function() {
                construction.removeTool(t, true);
            });

            $(t.second.mouseTarget[0]).bind("dblclick", function() {
                construction.removeTool(t, true);
            });

            $(t.edge.mouseTarget[0]).bind("dblclick", function() {
                construction.removeTool(t, true);
            });
            construction.updateIntersections();
        };


        construction.removeTool = function(tool, updateTools) {
            _.each(_.keys(tool), function(key) {
                if (key === "center" || key === "perimeter"
                || key === "first" || key === "second")
                {
                    tool[key].visibleShape.remove();
                    tool[key].visible = false;
                    $(tool[key].mouseTarget[0]).remove();
                }
                else if (key === "circ")
                {
                    tool[key].remove();
                }
                else if (key === "edge") {
                    tool[key].visibleLine.remove();
                    tool[key].visible = false;
                    $(tool[key].mouseTarget[0]).remove();
                }
            });

            if (updateTools) {
                construction.tools.splice(_.indexOf(construction.tools, tool), 1);
            }
        };


        // remove ALL the tools
        construction.removeAllTools = function() {
            staticTools = [];
            _.each(construction.tools, function(tool) {
                if (tool.dummy) {
                    staticTools.push(tool);
                } else {
                    construction.removeTool(tool, false);
                }
            });

            construction.tools = staticTools;
            construction.snapPoints = []
            construction.interPoints = []
            construction.snapLines = []
        };

        // detect intersections between existing circles,
        // lines, so that new points can snap to these intersections
        construction.updateIntersections = function() {
            construction.interPoints = [];
            _.each(construction.tools, function(tool1) {
                _.each(construction.tools, function(tool2) {
                    if (tool1 !== tool2) {
                        // two lines
                        if (tool1.interType === "line" &&
                            tool2.interType === "line") {
                            construction.interPoints.push(
                                findIntersection([tool1.first.coord,
                                    tool1.second.coord],
                                [tool2.first.coord, tool2.second.coord])
                                .slice(0, 2));
                        }
                        // a line and a circle
                        else if (tool1.interType === "line" &&
                                tool2.interType === "circle") {

                            m = (tool1.second.coord[1]
                              - tool1.first.coord[1]) /
                                (tool1.second.coord[0]
                              - tool1.first.coord[0]);
                            yint = tool1.first.coord[1]
                                 - m * tool1.first.coord[0];


                            // solve for x-values of intersections
                            // (x - cX)^2 + (y - cY)^2 = radius
                            var cX = tool2.center.coord[0];
                            var cY = tool2.center.coord[1];
                            var rad = tool2.radius;

                            // baby why you gotta play me like that
                            var a = 1 + Math.pow(m, 2);
                            var b = (-2 * cX + 2 * m * yint - 2 * cY * m);
                            var c = (Math.pow(yint, 2) - 2 * yint * cY +
                                Math.pow(cY, 2) + Math.pow(cX, 2) -
                                Math.pow(rad, 2));

                            var x1 = (-b + Math.sqrt(Math.pow(b, 2) -
                                4 * a * c)) / (2 * a);
                            var x2 = (-b - Math.sqrt(Math.pow(b, 2) -
                                4 * a * c)) / (2 * a);


                            if (!isNaN(x1)) {
                                y1 = m * x1 + yint;
                                construction.interPoints.push([x1, y1]);
                            }
                            if (!isNaN(x2)) {
                                y2 = m * x2 + yint;
                                construction.interPoints.push([x2, y2]);
                            }
                        }
                        else if (tool1.center != null && tool2.center != null) {
                            var a = tool1.center.coord[0];
                            var b = tool1.center.coord[1];
                            var c = tool2.center.coord[0];
                            var d = tool2.center.coord[1];
                            var r = tool1.radius;
                            var s = tool2.radius;

                            var e = c - a;
                            var f = d - b;
                            var p = Math.sqrt(Math.pow(e, 2) + Math.pow(f, 2));
                            var k = (Math.pow(p, 2) + Math.pow(r, 2)
                               - Math.pow(s, 2)) / (2 * p);

                            var x1 = a + e * k / p + (f / p) *
                                Math.sqrt(Math.pow(r, 2) - Math.pow(k, 2));
                            var y1 = b + f * k / p - (e / p) *
                                Math.sqrt(Math.pow(r, 2) - Math.pow(k, 2));

                            var x2 = a + e * k / p - (f / p) *
                                Math.sqrt(Math.pow(r, 2) - Math.pow(k, 2));
                            var y2 = b + f * k / p + (e / p) *
                                Math.sqrt(Math.pow(r, 2) - Math.pow(k, 2));

                            if (!isNaN(x1)) {
                                construction.interPoints.push([x1, y1]);
                            }
                            if (!isNaN(x2)) {
                                construction.interPoints.push([x2, y2]);
                            }
                        }
                    }
                });
            });
        };

    },

    // add non-interactive straightedge
    addDummyStraightedge: function(coord1, coord2, extend) {
        var construction = KhanUtil.construction;
        extend = extend == null ? true : extend;
        construction.tool = {
            interType: "line",
            dummy: true,
            first: {coord: [coord1, coord2]},
            second: {coord: [coord1, coord2]},
            edge: KhanUtil.currentGraph.addMovableLineSegment({
                coordA: coord1,
                coordZ: coord2,
                normalStyle: {stroke: "black", "stroke-width": 2},
                highlightStyle: {stroke: KhanUtil.BLUE, "stroke-width": 3},
                extendLine: extend,
                fixed: true
            })
        };
        // not sure about execution order here (vis-a-vis addConstruction),
        // so be careful
        if (construction.tools == null) {
            construction.tools = [construction.tool];
        } else {
            construction.tools.push(construction.tool);
        }
        if (construction.snapLines == null) {
            construction.snapLines = [construction.tool.edge];
        } else {
            construction.snapLines.push(construction.tool.edge);
        }
        KhanUtil.construction.updateIntersections();
    },


    // add non-interactive point (can't just use circle or snapping
    // won't work)
    addDummyPoint: function(coordinates) {
        var dummy = {coord: coordinates};
        KhanUtil.currentGraph.circle(coordinates,
                                {r: 0.08, fill: "black", stroke: "none"});

        var graph = KhanUtil.construction;
        if (construction.snapPoints == null) {
            construction.snapPoints = [dummy];
        } else {
            construction.snapPoints.push(dummy);
        }
        KhanUtil.construction.updateIntersections();
    },

    // add non-interactive ray
    addDummyRay: function(end, other) {
        var construction = KhanUtil.construction;
        construction.tool = {interType: "line", dummy: true,
                      first: {coord: end},
                      second: {coord: other},
                      edge: {coordA: end, coordZ: other}};

        KhanUtil.currentGraph.line(end, other,
            {stroke: "black", "stroke-width": 2, arrows: "->"});

        KhanUtil.addDummyPoint(end);

        // not sure about execution order here (vis-a-vis addConstruction),
        // so be careful
        if (construction.tools == null) {
            construction.tools = [construction.tool];
        } else {
            construction.tools.push(construction.tool);
        }
        if (construction.snapLines == null) {
            construction.snapLines = [construction.tool.edge];
        } else {
            construction.snapLines.push(construction.tool.edge);
        }
        KhanUtil.construction.updateIntersections();
    },

    constructionGuess: null,

    // show guess, given pruned tools which
    // only store coordinates of important
    // points
    showConstructionGuess: function(guessTools) {
        var graph = KhanUtil.currentGraph;
        if (KhanUtil.constructionGuess != null) {
            KhanUtil.constructionGuess.remove();
        }
        KhanUtil.constructionGuess = graph.raphael.set();
        _.each(guessTools, function(tool) {
            if (tool.first != null) {
                KhanUtil.constructionGuess.push(graph.addMovableLineSegment({
                    coordA: tool.first.coord,
                    coordZ: tool.second.coord,
                    normalStyle: {
                        stroke: KhanUtil.BLUE,
                        "stroke-width": 2
                    },
                    extendLine: true,
                    fixed: true
                }).visibleLine);
                KhanUtil.constructionGuess.push(graph.circle(
                    tool.first.coord, 0.1, {
                        fill: KhanUtil.BLUE,
                        stroke: null
                    }));
                KhanUtil.constructionGuess.push(graph.circle(
                    tool.second.coord, 0.1, {
                        fill: KhanUtil.BLUE,
                        stroke: null
                    }));
            } else if (tool.center != null) {
                KhanUtil.constructionGuess.push(graph.circle(
                    tool.center.coord, 0.1, {
                        fill: KhanUtil.BLUE,
                        stroke: null
                    }));
                KhanUtil.constructionGuess.push(graph.circle(
                    tool.center.coord, tool.radius, {
                        fill: "none",
                        stroke: KhanUtil.BLUE,
                        strokeDasharray: "- "
                    }));
            }
        });
    },

    // shorthand for euclidean distance
    // maybe I value brevity too much?
    eDist: function(coords1, coords2) {
        return Math.sqrt(Math.pow(coords1[0] - coords2[0], 2)
                       + Math.pow(coords1[1] - coords2[1], 2));
    },

    // distance from a point to a line, measured
    // as the distance along a perpendicular
    lDist: function(coord, line) {
        var slope = (line.coordZ[1] - line.coordA[1]) /
                (line.coordZ[0] - line.coordA[0]);
        var perpSlope = slope === 0 ? "vert" : -1 / slope;
        if (perpSlope === "vert") {
            var coord2 = [coord[0], coord[1] + 1];
        } else {
            var coord2 = [coord[0] + 1, coord[1] + perpSlope];
        }

        var intersect = findIntersection([coord, coord2],
                                     [line.coordA, line.coordZ]);

        return [KhanUtil.eDist(intersect, coord), intersect];
    }
});
