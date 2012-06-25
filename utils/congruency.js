$.extend(KhanUtil, {
    /*
     * Add a congruency object, which contains all the information
     * for creating and using congruency diagrams
     */
    addCongruency: function(options) {
        var congruency = $.extend(true, {
            x1: 0,
            x2: 10,
            y1: 0,
            y2: 3
        }, options);

        // ensure that x1 < x2, y1 < y2
        if (congruency.x1 > congruency.x2) {
            var hold = congruency.x1;
            congruency.x1 = congruency.x2;
            congruency.x2 = hold;
        }
        if (congruency.y1 > congruency.y2) {
            var hold = congruency.y1;
            congruency.y1 = congruency.y2;
            congruency.y2 = hold;
        }

        var graph = KhanUtil.currentGraph;

        congruency.lines = {};
        congruency.angles = {};
        congruency.points = {};

        congruency.addPoint = function(name, position) {
            var point = {
                name: name,
                pos: position,
                angles: [],
                arcs: []
            };

            point.angleTo = function(p) {
                return Math.atan2(p.pos[1] - point.pos[1],
                                  p.pos[0] - point.pos[0]);
            };

            congruency.points[name] = point;

            return point;
        };

        congruency.addLine = function(options) {
            var line = $.extend(true, {
                start: [0, 0],
                extend: false,
                clickable: false,
                state: 0,
                max: 1,
                tickDiff: 0.15,
                tickLength: 0.2
            }, options);

            if (typeof(line.start) === "string") {
                line.startPt = congruency.points[line.start];
                line.start = line.startPt.pos;
            }

            if (typeof(line.end) === "string") {
                line.endPt = congruency.points[line.end];
                line.end = line.endPt.pos;
            }

            if (line.end != null) {
                line.radAngle = Math.atan2(line.end[1] - line.start[1],
                                           line.end[0] - line.start[0]);
                line.angle = KhanUtil.toDegrees(line.radAngle);
            } else if (line.angle != null) {
                line.radAngle = KhanUtil.toRadians(line.angle);
                line.end = [Math.cos(line.radAngle) + line.start[0],
                            Math.sin(line.radAngle) + line.start[1]];
            }

            line.slope = (line.end[1] - line.start[1]) /
                         (line.end[0] - line.start[0]);

            line.slope = Math.max(-999999, Math.min(999999, line.slope));

            line.func = function(x) {
                return line.start[1] + line.slope * (x - line.start[0]);
            };

            line.invfunc = function(y) {
                return line.start[0] + (y - line.start[1]) / line.slope;
            };

            if (line.extend === true) {
                var order = (line.start[0] < line.end[0]);

                var left = null;
                var right = null;

                var y1int = line.func(congruency.x1);

                if (y1int >= congruency.y1 && y1int <= congruency.y2) {
                    left = [congruency.x1, y1int];
                } else if (y1int > congruency.y2) {
                    left = [line.invfunc(congruency.y2), congruency.y2];
                } else {
                    left = [line.invfunc(congruency.y1), congruency.y1];
                }

                var y2int = line.func(congruency.x2);

                if (y2int >= congruency.y1 && y2int <= congruency.y2) {
                    right = [congruency.x2, y2int];
                } else if (y2int > congruency.y2) {
                    right = [line.invfunc(congruency.y2), congruency.y2];
                } else {
                    right = [line.invfunc(congruency.y1), congruency.y1];
                }

                if (order) {
                    line.start = left;
                    line.end = right;
                } else {
                    line.end = left;
                    line.start = right;
                }
            }

            if (line.placeAtStart != null) {
                line.startPt = congruency.addPoint(line.placeAtStart,
                                                   line.start);
            }

            if (line.placeAtEnd != null) {
                line.endPt = congruency.addPoint(line.placeAtEnd, line.end);
            }

            if (line.startPt != null &&
                line.endPt != null) {
                congruency.lines[line.startPt.name+line.endPt.name] = line;
                congruency.lines[line.endPt.name+line.startPt.name] = line;
            }

            if (line.startPt != null && line.endPt != null) {
                line.startPt.angles.push(line.endPt);
                line.endPt.angles.push(line.startPt);
            }

            line.draw = function() {
                if (this.line != null) {
                    this.line.remove();
                }

                this.line = graph.raphael.set();

                var startDiff = this.tickDiff * (this.state - 1) / 2;

                var direction = [Math.cos(this.radAngle), Math.sin(this.radAngle)];
                var normalDir = [-direction[1]*this.tickLength,
                                  direction[0]*this.tickLength];

                var midpoint = [(this.start[0] + this.end[0]) / 2,
                                (this.start[1] + this.end[1]) / 2];

                var startPos = [midpoint[0] - startDiff * direction[0],
                                midpoint[1] - startDiff * direction[1]];

                for (var curr = 0; curr < this.state; curr += 1) {
                    var currPos = [startPos[0] + curr * direction[0] * this.tickDiff,
                                   startPos[1] + curr * direction[1] * this.tickDiff];
                    var start = [currPos[0] + normalDir[0],
                                 currPos[1] + normalDir[1]];
                    var end = [currPos[0] - normalDir[0],
                               currPos[1] - normalDir[1]];

                    this.line.push(graph.line(start, end));
                }

                this.line.push(graph.line(this.start, this.end));

                this.line.attr(this.normal);

                this.point.visibleShape = this.line;
            };

            var pointPos = [(line.start[0] + line.end[0]) / 2,
                            (line.start[1] + line.end[1]) / 2];

            line.point = KhanUtil.addMovablePoint({
                coord: pointPos
            });
            // Make it not move
            line.point.onMove = function(x, y) {
                return false;
            };

            line.point.mouseTarget.attr({ r: graph.scale[0] * 0.7 });

            line.point.visibleShape.remove();

            line.point.visibleShape = line.line;

            line.normal = {
                stroke: "black",
                "stroke-width": 2
            };
            line.highlight = {
                stroke: "black",
                "stroke-width": 3
            };

            line.point.normalStyle = line.normal;
            line.point.highlightStyle = line.highlight;

            line.highlightStyle = function(options) {
                $.extend(true, this.highlight, options);
                this.draw();
            };

            line.normalStyle = function(options) {
                $.extend(true, this.normal, options);
                this.draw();
            };

            line.draw();

            line.set = function(state) {
                this.state = state;

                this.draw();
            };

            line.click = function(event) {
                line.set((line.state === line.max) ? 0 : line.state + 1);
            };

            $(line.point.mouseTarget[0]).bind("vmouseup", line.click);

            line.stick = function() {
                line.point.mouseTarget.remove();
            };

            if (!line.clickable) {
                line.stick();
            }

            return line;
        };

        congruency.addAngles = function(point, options) {
            var pt = congruency.points[point];

            var sortAngs = _.sortBy(pt.angles, function(ang) {
                return pt.angleTo(ang);
            });

            pt.addArc = function(pos, radius, start, end) {
                var arc = {
                    pos: pos,
                    radius: radius,
                    start: start,
                    end: end,
                    state: 0,
                    max: 3,
                    shown: false,
                    stuck: false,
                    stateDiff: 0.15
                };

                if (arc.start > arc.end) {
                    var hold = arc.start;
                    arc.start = arc.end;
                    arc.end = hold;
                }

                arc.angle = arc.end - arc.start;

                // Add a movable point for clicking
                var aveAngle = KhanUtil.toRadians((arc.start + arc.end) / 2);

                var pointPos = arc.pos.slice();
                pointPos[0] += Math.cos(aveAngle) * arc.radius;
                pointPos[1] += Math.sin(aveAngle) * arc.radius;

                arc.point = KhanUtil.addMovablePoint({
                    coord: pointPos
                });
                // Make it not move
                arc.point.onMove = function(x, y) {
                    return false;
                };

                // Make a clicky pointer
                $(arc.point.mouseTarget[0]).css("cursor", "pointer");

                // Increase the point's size
                var pointRadius = Math.sin(KhanUtil.toRadians(arc.angle) / 2)
                                  * arc.radius * graph.scale[0];
                arc.point.mouseTarget.attr({ r: pointRadius });

                // Replace the shape with our arc
                arc.point.visibleShape.remove();

                // Styles for different mouse-over states
                // TODO: come up with a way to set different styles
                // for normal/highlight
                arc.unsetNormal = {
                    stroke: KhanUtil.GRAY,
                    "stroke-width": 2,
                    opacity: 0.1
                };
                arc.unsetHighlight = {
                    stroke: KhanUtil.GRAY,
                    "stroke-width": 2,
                    opacity: 0.4
                };
                arc.setNormal = {
                    stroke: "black",
                    "stroke-width": 3,
                    opacity: 0.9
                };
                arc.setHighlight = {
                    stroke: "black",
                    "stroke-width": 3,
                    opacity: 1.0
                };

                // Set the default styles
                arc.point.normalStyle = arc.unsetNormal;
                arc.point.highlightStyle = arc.unsetHighlight;

                // Draw the arc(s)
                arc.draw = function() {
                    // Remove any left over arcs
                    if (this.arc != null) {
                        this.arc.remove();
                    }

                    // Count how many arcs there should be
                    var arcs = (this.state === 0) ? 1 : this.state;
                    var startRad = this.radius - this.stateDiff * (arcs - 1) / 2;

                    // Create a raphael set
                    this.arc = graph.raphael.set();

                    // Put all the arcs in the set
                    for (var curr = 0; curr < arcs; curr += 1) {
                        var currRad = startRad + this.stateDiff * curr;
                        this.arc.push(graph.arc(this.pos, currRad,
                                                this.start, this.end));
                    }
                    // Attach it and style correctly
                    this.point.visibleShape = this.arc;
                    this.arc.attr(this.point.normalStyle);
                };

                // Ensure the arc gets drawn on creation
                arc.draw();

                // Set the state of an arc
                arc.set = function(state) {
                    arc.state = state;

                    if (arc.state === 0) {
                        arc.point.normalStyle = arc.unsetNormal;
                        arc.point.highlightStyle = arc.unsetHighlight;
                    } else {
                        arc.point.normalStyle = arc.setNormal;
                        arc.point.highlightStyle = arc.setHighlight;
                    }

                    arc.draw();
                }

                // Function called upon clicking
                arc.click = function(event) {
                    arc.set((arc.state === arc.max) ? 0 : arc.state + 1);
                };

                // Bind mouseclick
                $(arc.point.mouseTarget[0]).bind("vmouseup", arc.click);

                // Make an arc stick in its current state
                // by removing the clicky part
                arc.stick = function() {
                    $(arc.point.mouseTarget[0]).unbind();
                    this.point.mouseTarget.remove();
                };

                // Set the style of arcs when unset
                arc.styleUnset = function(options) {
                    $.extend(true, this.unsetNormal, options);
                    $.extend(true, this.unsetHighlight, options);
                    this.draw();
                };

                // Set the style of arcs when set
                arc.styleSet = function(options) {
                    $.extend(true, this.setNormal, options);
                    $.extend(true, this.setHighlight, options);
                    this.draw();
                };

                return arc;
            };

            var numAngs = sortAngs.length;

            for (var i = 0; i < numAngs; i += 1) {
                var pt1 = sortAngs[i];
                var pt2 = sortAngs[(i + 1) % numAngs];

                var ang1 = pt.angleTo(pt1);
                var ang2 = pt.angleTo(pt2);
                if (i + 1 === numAngs) {
                    ang2 += Math.PI * 2;
                }

                if (ang2 - ang1 >= Math.PI) {
                    continue;
                }

                var arc = pt.addArc(pt.pos, 0.6,
                                    KhanUtil.toDegrees(ang1),
                                    KhanUtil.toDegrees(ang2));

                var name = pt1.name + pt.name + pt2.name;
                congruency.angles[name] = arc;

                name = pt2.name + pt.name + pt1.name;
                congruency.angles[name] = arc;
            }

        };

        congruency.intersect = function(line1, line2, options) {
            if (line1.slope === line2.slope) {
                return false;
            }

            var point = null;

            if (options.addPoint != null) {
                coord = [0, 0];

                coord[0] = (line1.slope * line1.start[0]
                            - line2.slope * line2.start[0]
                            + line2.start[1] - line1.start[1]) /
                           (line1.slope - line2.slope);
                coord[1] = line1.func(coord[0]);

                point = congruency.addPoint(options.addPoint, coord);
            } else if (options.point) {
                point = congruency.points[options.point];
            }

            point.angles.push(line1.startPt);
            point.angles.push(line1.endPt);
            point.angles.push(line2.startPt);
            point.angles.push(line2.endPt);

            congruency.addAngles(point.name);
        };

        congruency.addLabel = function(point, position) {
            var p = congruency.points[point];
            graph.label(p.pos, point, position);
        };

        congruency.getGuess = function() {
            var guess = {};

            _.each(congruency.lines, function(line, name) {
                guess[name] = line.state;
            });

            _.each(congruency.angles, function(angle, name) {
                guess[name] = angle.state;
            });

            return guess;
        };

        congruency.showGuess = function(guess) {
            _.each(guess, function(t, g) {
                console.log(g);
                if (g.length === 2) {
                    congruency.lines[g].set(t);
                } else {
                    congruency.angles[g].set(t);
                }
            });
        };

        return congruency;
    }
});