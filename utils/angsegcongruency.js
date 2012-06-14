$.extend(KhanUtil, {
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

        congruency.addLine = function(options) {
            var line = $.extend(true, {
                start: [0, 0],
                extend: true
            }, options);

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

            line.func = function(x) {
                return line.start[1] + line.slope * (x - line.start[0]);
            };

            line.invfunc = function(y) {
                return line.start[0] + (y - line.start[1]) / line.slope;
            };

            if (line.extend === true) {
                var y1int = line.func(congruency.x1);

                if (y1int >= congruency.y1 && y1int <= congruency.y2) {
                    line.start = [congruency.x1, y1int];
                } else if (y1int > congruency.y2) {
                    line.start = [line.invfunc(congruency.y2), congruency.y2];
                } else {
                    line.start = [line.invfunc(congruency.y1), congruency.y1];
                }

                var y2int = line.func(congruency.x2);

                if (y2int >= congruency.y1 && y2int <= congruency.y2) {
                    line.end = [congruency.x2, y2int];
                } else if (y2int > congruency.y2) {
                    line.end = [line.invfunc(congruency.y2), congruency.y2];
                } else {
                    line.end = [line.invfunc(congruency.y1), congruency.y1];
                }
            }

            graph.line(line.start, line.end);

            return line;
        };

        congruency.intersect = function(line1, line2, options) {
            var ang = $.extend(true, {
                line1: line1,
                line2: line2,
                radius: 0.6,
                show: [true, true, true, true]
            }, options);

            if (ang.line1.slope === ang.line2.slope) {
                return false;
            }

            ang.coord = [0, 0];

            ang.coord[0] = (ang.line1.slope * ang.line1.start[0]
                            - ang.line2.slope * ang.line2.start[0]
                            + ang.line2.start[1] - ang.line1.start[1]) /
                           (ang.line1.slope - ang.line2.slope);
            ang.coord[1] = ang.line1.func(ang.coord[0]);

            ang.addArc = function(pos, radius, start, end) {
                var arc = {
                    pos: pos,
                    radius: radius,
                    start: start,
                    end: end,
                    state: 0,
                    max: 1,
                    shown: false,
                    stuck: false
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
                    return pointPos;
                };

                // Make a clicky pointer
                $(arc.point.mouseTarget[0]).css("cursor", "pointer");

                // Increase the point's size
                var pointRadius = Math.sin(KhanUtil.toRadians(arc.angle) / 2)
                                  * arc.radius * graph.scale[0];
                arc.point.mouseTarget.attr({ r: pointRadius });

                // replace the shape with our arc
                arc.point.visibleShape.remove();

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
                    stroke: KhanUtil.BLUE,
                    "stroke-width": 3,
                    opacity: 0.9
                };
                arc.setHighlight = {
                    stroke: KhanUtil.BLUE,
                    "stroke-width": 3,
                    opacity: 1.0
                };

                arc.point.normalStyle = arc.unsetNormal;
                arc.point.highlightStyle = arc.unsetHighlight;

                arc.draw = function() {
                    if (this.arc != null) {
                        this.arc.remove();
                    }
                    this.arc = graph.arc(this.pos, this.radius,
                                         this.start, this.end);
                    this.point.visibleShape = this.arc;
                    this.arc.attr(this.point.normalStyle);
                };

                arc.draw();

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

                arc.click = function(event) {
                    arc.set((arc.state === arc.max) ? 0 : arc.state + 1);
                };

                $(arc.point.mouseTarget[0]).bind("vmouseup", arc.click);

                arc.stick = function() {
                    $(arc.point.mouseTarget[0]).unbind();
                    this.point.mouseTarget.remove();
                };

                arc.styleUnset = function(options) {
                    $.extend(true, this.unsetNormal, options);
                    $.extend(true, this.unsetHighlight, options);
                    this.draw();
                };

                arc.styleSet = function(options) {
                    $.extend(true, this.setNormal, options);
                    $.extend(true, this.setHighlight, options);
                    this.draw();
                };

                return arc;
            };

            var startAngle = ang.line1.angle;
            var diffAngle = ang.line2.angle - ang.line1.angle;

            ang.ang = [];

            if (ang.show[0]) {
                ang.ang[0] = ang.addArc(ang.coord, ang.radius,
                                        startAngle,
                                        startAngle + diffAngle);
            }
            if (ang.show[1]) {
                ang.ang[1] = ang.addArc(ang.coord, ang.radius,
                                        startAngle + diffAngle,
                                        startAngle + 180);
            }
            if (ang.show[2]) {
                ang.ang[2] = ang.addArc(ang.coord, ang.radius,
                                        startAngle + 180,
                                        startAngle + 180 + diffAngle);
            }
            if (ang.show[3]) {
                ang.ang[3] = ang.addArc(ang.coord, ang.radius,
                                        startAngle + 180 + diffAngle,
                                        startAngle + 360);
            }

            return ang;
        };

        return congruency;
    }
});
