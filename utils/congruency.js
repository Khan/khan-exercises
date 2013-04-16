$.extend(KhanUtil, {
    // Add a "congruency" object that stores data about the
    // points, lines, and angles that you added to the congruency
    // figure
    //
    // options that can be added to modify:
    //
    // - x1, y1, x2, y2: the bounds of the object, which controls
    //      where an extended line gets extended to
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

        // store the current graph
        var graph = KhanUtil.currentGraph;

        // where the lines, angles, and points are stored
        congruency.lines = {};
        congruency.angles = {};
        congruency.points = {};

        congruency.getPoint = function(pt) {
            if (typeof pt === "string") {
                return congruency.points[pt];
            } else {
                return pt;
            }
        };

        // Add a point to the congruency figure
        //
        // - name is a one-character string
        // - position is a two-element array
        congruency.addPoint = function(name, position) {
            var point = {
                name: name,
                pos: position,
                connected: [],
                arcs: []
            };

            // calculate the angle of the point to another point
            point.angleTo = function(p) {
                p = congruency.getPoint(p);

                return Math.atan2(p.pos[1] - point.pos[1],
                                  p.pos[0] - point.pos[0]);
            };

            // store the point in the congruency variable
            congruency.points[name] = point;

            return point;
        };

        // add a line to the congruency diagram
        //
        // there are two ways to specify the line:
        //
        // - provide a start point and an angle
        //
        //      This creates a line starting at the start
        //      point and extending in the direction of the
        //      given angle for one unit
        //
        // - provide a start and end point
        //
        //      This creates a line starting at the start
        //      point and ending at the end point
        //
        // other options:
        //
        // - extend:
        //      makes the line extend in both directions
        //      until it hits the congruency boundary
        //
        // - clickable:
        //      makes the line able to be clicked on to change
        //      the number of ticks on it
        //
        // - state:
        //      the starting number of ticks on the line
        //
        // - maxState:
        //      the maximum number of ticks that can be added
        //      by clicking
        //
        // - tickDiff:
        //      the distance between the ticks on the line
        //
        // - tickLength:
        //      the length of each tick mark
        //
        // - placeAtStart:
        //      A string name of a point to be placed at the
        //      beginning of the line, after extending
        //
        // - placeAtEnd:
        //      A string name of a point to be placed at the
        //      end of the line, after extending
        congruency.addLine = function(options) {
            var line = $.extend(true, {
                start: [0, 0],
                extend: false,
                clickable: false,
                state: 0,
                maxState: 1,
                tickDiff: 0.15,
                tickLength: 0.2,
                highlighted: false
            }, options);

            // look up the start and end points, if they are
            // given as strings
            if (typeof line.start === "string") {
                line.startPt = congruency.points[line.start];
                line.start = line.startPt.pos;
            }
            if (typeof line.end === "string") {
                line.endPt = congruency.points[line.end];
                line.end = line.endPt.pos;
            }

            // check how the line is defined, and calculate the other
            // variables based on those
            if (line.end != null) {
                line.radAngle = Math.atan2(line.end[1] - line.start[1],
                                           line.end[0] - line.start[0]);
                line.angle = KhanUtil.toDegrees(line.radAngle);
            } else if (line.angle != null) {
                line.radAngle = KhanUtil.toRadians(line.angle);
                line.end = [Math.cos(line.radAngle) + line.start[0],
                            Math.sin(line.radAngle) + line.start[1]];
            }

            // calculate and bound the slope;
            line.slope = (line.end[1] - line.start[1]) /
                         (line.end[0] - line.start[0]);
            line.slope = Math.max(-999999, Math.min(999999, line.slope));

            // a function which represents the line
            line.func = function(x) {
                return line.start[1] + line.slope * (x - line.start[0]);
            };

            // the inverse function of the line
            line.invfunc = function(y) {
                var slope = (line.slope === 0) ? 0.00001 : line.slope
                return line.start[0] + (y - line.start[1]) / slope;
            };

            // extend the line if specified
            if (line.extend) {
                // check which orientation the points are currently in
                var order = (line.start[0] < line.end[0]);

                // the new 'left' and 'right' points
                var left, right;

                // check to see where the 'left' side of
                // the line intersects
                var y1int = line.func(congruency.x1);

                if (y1int >= congruency.y1 && y1int <= congruency.y2) {
                    left = [congruency.x1, y1int];
                } else if (y1int > congruency.y2) {
                    left = [line.invfunc(congruency.y2), congruency.y2];
                } else {
                    left = [line.invfunc(congruency.y1), congruency.y1];
                }

                // check to see where the 'right' side of
                // the line intersects
                var y2int = line.func(congruency.x2);

                if (y2int >= congruency.y1 && y2int <= congruency.y2) {
                    right = [congruency.x2, y2int];
                } else if (y2int > congruency.y2) {
                    right = [line.invfunc(congruency.y2), congruency.y2];
                } else {
                    right = [line.invfunc(congruency.y1), congruency.y1];
                }

                // re-store the points in the correct positions
                if (order) {
                    line.start = left;
                    line.end = right;
                } else {
                    line.end = left;
                    line.start = right;
                }
            }

            // do placeAtStart and placeAtEnd
            if (line.placeAtStart != null) {
                line.startPt = congruency.addPoint(line.placeAtStart,
                                                   line.start);
            }
            if (line.placeAtEnd != null) {
                line.endPt = congruency.addPoint(line.placeAtEnd, line.end);
            }

            // if startPt and endPt exist (i.e. they are both named
            // points) add the name of our line to the congruency
            if (line.startPt != null &&
                line.endPt != null) {
                congruency.lines[line.startPt.name + line.endPt.name] = line;
                congruency.lines[line.endPt.name + line.startPt.name] = line;
            }

            // if the points are named, add the other end of the line
            // to the connected points, so they can calculate what angles
            // they create
            if (line.startPt != null && line.endPt != null) {
                line.startPt.connected.push(line.endPt);
                line.endPt.connected.push(line.startPt);
            }

            // actually draw the line with the current styles
            line.draw = function() {
                if (this.line != null) {
                    this.line.remove();
                }

                // create a set
                this.line = graph.raphael.set();

                // do a bunch of tick calculations
                var startDiff = this.tickDiff * (this.state - 1) / 2;

                var direction = [Math.cos(this.radAngle), Math.sin(this.radAngle)];
                var normalDir = [-direction[1] * this.tickLength,
                                  direction[0] * this.tickLength];

                var midpoint = [(this.start[0] + this.end[0]) / 2,
                                (this.start[1] + this.end[1]) / 2];

                var startPos = [midpoint[0] - startDiff * direction[0],
                                midpoint[1] - startDiff * direction[1]];

                // add each of the ticks
                for (var curr = 0; curr < this.state; curr += 1) {
                    var currPos = [startPos[0] + curr * direction[0] * this.tickDiff,
                                   startPos[1] + curr * direction[1] * this.tickDiff];
                    var start = [currPos[0] + normalDir[0],
                                 currPos[1] + normalDir[1]];
                    var end = [currPos[0] - normalDir[0],
                               currPos[1] - normalDir[1]];

                    this.line.push(graph.line(start, end));
                }

                // add our line
                this.line.push(graph.line(this.start, this.end));

                // set the attributes
                this.line.attr(this.point.normalStyle);
                this.point.visibleShape = this.line;
            };

            // calculate our midpoint, for where the clickable
            // point should go
            var pointPos = [(line.start[0] + line.end[0]) / 2,
                            (line.start[1] + line.end[1]) / 2];

            // add a movable point
            line.point = KhanUtil.addMovablePoint({
                coord: pointPos
            });
            // Make it not move
            line.point.onMove = function(x, y) {
                return false;
            };

            // make the mouse target pretty big
            line.point.mouseTarget.attr({ r: graph.scale[0] * 0.7 });

            // remove the original visible shape
            line.point.visibleShape.remove();

            // the original styles
            line.normal = {
                stroke: "black",
                "stroke-width": 2
            };
            line.hover = {
                stroke: "black",
                "stroke-width": 3
            };
            line.highlight = {};

            // set the styles depending on the state
            line.setStyles = function() {
                if (this.highlighted) {
                    this.point.normalStyle = this.highlight;
                    this.point.highlightStyle = this.highlight;
                } else {
                    this.point.normalStyle = this.normal;
                    this.point.highlightStyle = this.hover;
                }
            };

            // functions to change the styling of the line
            line.setSelectedStyle = function(style) {
                $.extend(true, this.hover, style);
                this.draw();
            };
            line.setUnselectedStyle = function(style) {
                $.extend(true, this.normal, style);
                this.draw();
            };

            // change and set highlight
            line.setHighlighted = function(style) {
                $.extend(true, this.highlight, style);
                this.highlighted = true;
                this.setStyles();
                this.draw();
            };
            line.unsetHighlighted = function() {
                this.highlighted = false;
                this.setStyles();
                this.draw();
            };

            // set the default styles
            line.setStyles();

            // draw the line
            line.draw();

            // function to change the current state
            line.setState = function(state) {
                this.state = state;

                this.draw();
            };

            // make the clickable point change the state
            $(line.point.mouseTarget[0]).bind("vmouseup", function(event) {
                line.setState((line.state === line.maxState) ? 0 : line.state + 1);
            });

            // make the line stick in the state it is in currently,
            // and remove the clickable part
            line.stick = function() {
                line.point.mouseTarget.remove();
            };

            // if we shouldn't be clickable, stick right now
            if (!line.clickable) {
                line.stick();
            }

            return line;
        };

        congruency.addAngle = function(name, options) {
            var angle = $.extend({
                radius: 0.7,
                state: 0,
                maxState: 1,
                shown: false,
                clickable: true,
                arcDiff: 0.15,
                highlighted: false
            }, options);

            angle.center = name[1];
            angle.left = name[0];
            angle.right = name[2];

            angle.centerPt = congruency.getPoint(angle.center);
            angle.leftPt = congruency.getPoint(angle.left);
            angle.rightPt = congruency.getPoint(angle.right);

            angle.pos = angle.centerPt.pos;
            angle.start = KhanUtil.toDegrees(angle.centerPt.angleTo(angle.leftPt));
            angle.end = KhanUtil.toDegrees(angle.centerPt.angleTo(angle.rightPt));

            while (angle.start > angle.end) {
                angle.start -= 360;
            }

            angle.angle = angle.end - angle.start;

            // Add a movable point for clicking
            var aveAngle = KhanUtil.toRadians((angle.start + angle.end) / 2);

            var pointPos = angle.pos.slice();
            pointPos[0] += Math.cos(aveAngle) * angle.radius;
            pointPos[1] += Math.sin(aveAngle) * angle.radius;

            angle.point = KhanUtil.addMovablePoint({
                coord: pointPos
            });
            // Make it not move
            angle.point.onMove = function(x, y) {
                return false;
            };

            // Make a clicky pointer
            $(angle.point.mouseTarget[0]).css("cursor", "pointer");

            // Increase the point's size
            var pointRadius = Math.sin(KhanUtil.toRadians(angle.angle) / 2)
                              * angle.radius * graph.scale[0];
            angle.point.mouseTarget.attr({ r: pointRadius });

            // Replace the shape with our angle
            angle.point.visibleShape.remove();

            // Styles for different mouse-over states
            angle.unselected = {
                stroke: KhanUtil.GRAY,
                "stroke-width": 2,
                opacity: 0.1
            };
            angle.unselectedHover = {
                stroke: KhanUtil.GRAY,
                "stroke-width": 2,
                opacity: 0.4
            };
            angle.selected = {
                stroke: KhanUtil.BLUE,
                "stroke-width": 3,
                opacity: 0.9
            };
            angle.selectedHover = {
                stroke: KhanUtil.BLUE,
                "stroke-width": 3,
                opacity: 1.0
            };
            angle.highlight = {};

            // Draw the arc(s)
            angle.draw = function() {
                // Remove any left over arcs
                if (this.arc != null) {
                    this.arc.remove();
                }

                // Count how many arcs there should be
                var arcs = (this.state === 0) ? 1 : this.state;
                var startRad = this.radius - this.arcDiff * (arcs - 1) / 2;

                // Create a raphael set
                this.arc = graph.raphael.set();

                // Put all the arcs in the set
                for (var curr = 0; curr < arcs; curr += 1) {
                    var currRad = startRad + this.arcDiff * curr;
                    this.arc.push(graph.arc(this.pos, currRad,
                                            this.start, this.end));
                }
                // Attach it and style correctly
                this.point.visibleShape = this.arc;
                this.arc.attr(this.point.normalStyle);
            };

            // Set the styles according to the current state
            angle.setStyles = function() {
                if (this.highlighted) {
                    this.point.normalStyle = this.highlight;
                    this.point.highlightStyle = this.highlight;
                } else if (this.state === 0) {
                    this.point.normalStyle = this.unselected;
                    this.point.highlightStyle = this.unselectedHover;
                } else {
                    this.point.normalStyle = this.selected;
                    this.point.highlightStyle = this.selectedHover;
                }
            };

            // Set the state of an angle
            angle.setState = function(state) {
                this.state = state;

                this.setStyles();

                this.draw();
            }

            // setup the original styles
            angle.setStyles();

            // Ensure the angle gets drawn on creation
            angle.draw();

            // Bind mouseclick
            $(angle.point.mouseTarget[0]).bind("vmouseup", function(event) {
                angle.setState((angle.state === angle.maxState) ? 0 : angle.state + 1);
            });

            // Make an angle stick in its current state
            // by removing the clicky part
            angle.stick = function() {
                $(this.point.mouseTarget[0]).unbind();
                this.point.mouseTarget.remove();
            };

            if (!angle.clickable) {
                angle.stick();
            }

            // Set the style of angles when state == 0
            angle.setUnselectedStyle = function(style) {
                $.extend(true, this.unselected, style);
                $.extend(true, this.unselectedHover, style);
                this.draw();
            };

            // Set the style of angles when state > 0
            angle.setSelectedStyle = function(style) {
                $.extend(true, this.selected, style);
                $.extend(true, this.selectedHover, style);
                this.draw();
            };

            // Add a highlighting style and highlight an angle
            angle.setHighlighted = function(style) {
                $.extend(true, this.highlight, style);
                this.highlighted = true;
                this.setStyles();
                this.draw();
            };

            // Unhighlight an angle
            angle.unsetHighlighted = function() {
                this.highlighted = false;
                this.setStyles();
                this.draw();
            };

            // add the angle to the angles hash
            var name = angle.left + angle.center + angle.right;
            congruency.angles[name] = angle;

            name = angle.right + angle.center + angle.left;
            congruency.angles[name] = angle;

            return angle;
        };

        // add all of the angles at a specific point
        congruency.addAngles = function(point, options) {
            var pt = congruency.getPoint(point);

            // sort the angles that are coming out of
            // the given point by the angle they make to the point
            var sortConnected = _.sortBy(pt.connected, function(cpt) {
                return pt.angleTo(cpt);
            });

            var numAngs = sortConnected.length;

            // go through the connected points in order and add
            // the angles between them
            for (var i = 0; i < numAngs; i += 1) {
                var pt1 = sortConnected[i];
                var pt2 = sortConnected[(i + 1) % numAngs];

                var ang1 = pt.angleTo(pt1);
                var ang2 = pt.angleTo(pt2);

                // make sure the last angle is correct
                if (i + 1 === numAngs) {
                    ang2 += Math.PI * 2;
                }

                // don't make angles that are more than 180
                if (ang2 - ang1 >= Math.PI) {
                    continue;
                }

                // add the angle
                congruency.addAngle(pt1.name + pt.name + pt2.name, options);
            }
        };

        // intersect two lines, and add a point at the intersection
        // of those two
        congruency.intersect = function(line1, line2, pointName, addAngles) {
            if (line1.slope === line2.slope) {
                return false;
            }

            var point = null;

            coord = [];

            coord[0] = (line1.slope * line1.start[0]
                        - line2.slope * line2.start[0]
                        + line2.start[1] - line1.start[1]) /
                       (line1.slope - line2.slope);
            coord[1] = line1.func(coord[0]);

            point = congruency.addPoint(pointName, coord);

            point.connected.push(line1.startPt);
            point.connected.push(line1.endPt);
            point.connected.push(line2.startPt);
            point.connected.push(line2.endPt);

            if (addAngles) {
                congruency.addAngles(point.name);
            }
        };

        // add a label next to a point, in the given direction
        congruency.addLabel = function(point, position) {
            var p = congruency.getPoint(point);
            graph.label(p.pos, point, position);
        };

        // get a hash of all states of the arcs and lines,
        // for storage in guesses and lookup
        congruency.getGuess = function() {
            var guess = {};

            // store all the lines' states
            _.each(congruency.lines, function(line, name) {
                guess[name] = line.state;
            });

            // store all the angles' states
            _.each(congruency.angles, function(angle, name) {
                guess[name] = angle.state;
            });

            return guess;
        };

        // take a guess, and reset all of the angles and
        // lines to their states
        congruency.showGuess = function(guess) {
            _.each(guess, function(t, g) {
                if (g.length === 2) {
                    congruency.lines[g].setState(t);
                } else {
                    congruency.angles[g].setState(t);
                }
            });
        };

        return congruency;
    }
});
