$.extend(KhanUtil, {
    addAngles: function(options) {
        var angles = $.extend(true, {
            x1: 0,
            x2: 10,
            y1: 0,
            y2: 3,
            angle: 60
        }, options);
        var graph = KhanUtil.currentGraph;

        // Draw the parallel lines
        graph.line([angles.x1, angles.y1], [angles.x2, angles.y1]);
        graph.line([angles.x1, angles.y2], [angles.x2, angles.y2]);

        var slope = Math.tan(KhanUtil.toRadians(angles.angle));
        var middle = [(angles.x2 - angles.x1) / 2, (angles.y1 + angles.y2) / 2];

        // Takes a y position, and returns the x position of the point
        var invfunc = function(y) {
            return (y - middle[1]) / slope + middle[0];
        };

        var bottomIntersect = [invfunc(angles.y1), angles.y1];
        var topIntersect    = [invfunc(angles.y2), angles.y2];

        // scale = -1: returns end
        // scale =  0: returns (start + end) / 2
        // scale =  1: returns start
        var scaleLine = function(start, end, scale) {
            return [(scale / 2 + 0.5) * start[0] + (0.5 - scale / 2) * end[0],
                    (scale / 2 + 0.5) * start[1] + (0.5 - scale / 2) * end[1]];
        };

        // Draw the diagonal line
        graph.line(scaleLine(bottomIntersect, topIntersect,  1.6),
                   scaleLine(bottomIntersect, topIntersect, -1.6));

        // Add an arc to the diagram
        var addArc = function(position, radius, startAng, endAng) {
            // Create the initial arc
            var arc = {
                arc: graph.arc(position, radius, startAng, endAng),
                position: position,
                radius: radius,
                start: startAng,
                end: endAng,
                set: false
            };

            // Add a movable point for clicking
            var aveAngle = KhanUtil.toRadians((endAng + startAng) / 2);

            var pointPos = position.slice();
            pointPos[0] += Math.cos(aveAngle) * 0.8;
            pointPos[1] += Math.sin(aveAngle) * 0.8;

            arc.point = KhanUtil.addMovablePoint({
                            coord: pointPos,
                        });
            // Increase the point's size
            arc.point.mouseTarget.attr({ r: 30.0 });
            // Make it not move
            arc.point.onMove = function(x, y) {
                return pointPos;
            };

            // Replace the shape with our arc
            arc.point.visibleShape.remove();
            arc.point.visibleShape = arc.arc;

            // Colors for different states
            arc.unsetNormal = {
                stroke: KhanUtil.GRAY,
                opacity: 0.1
            };
            arc.unsetHighlight = {
                stroke: KhanUtil.BLUE,
                opacity: 0.4
            };
            arc.setNormal = {
                stroke: KhanUtil.BLUE,
                opacity: 0.9
            };
            arc.setHighlight = {
                stroke: KhanUtil.BLUE,
                opacity: 1.0
            };
            arc.forceHighlight = {
                stroke: KhanUtil.ORANGE,
                opacity: 1.0
            };

            // Set the default styles
            arc.point.normalStyle = arc.unsetNormal;
            arc.point.highlightStyle = arc.unsetHighlight;

            // Remake the arc (meaning removing and re-creating it)
            arc.remake = function(radius) {
                this.radius = radius;
                this.arc.remove();
                this.arc = graph.arc(this.position, this.radius, this.start, this.end);
                this.arc.attr(this.point.highlightStyle);
                this.point.visibleShape = this.arc;
            };

            // Toggle between set and not-set
            arc.toggle = function() {
                if (this.set) {
                    this.point.normalStyle = this.unsetNormal;
                    this.point.highlightStyle = this.unsetHighlight;
                    this.remake(0.6);
                } else {
                    this.point.normalStyle = this.setNormal;
                    this.point.highlightStyle = this.setHighlight;
                    this.remake(0.8);
                }
                this.set = !this.set;
            };

            // Add a click event
            $(arc.point.mouseTarget[0]).bind("vmousedown", function(event) {
                arc.toggle();
            });

            // Force the arc to be set, for a pre-given point
            arc.force = function() {
                this.point.highlightStyle = this.forceHighlight;
                this.remake(0.8);
                // Remove the mouse target entirely
                $(this.point.mouseTarget[0]).unbind();
                this.point.mouseTarget.remove();
            };

            // Hint an angle by changing its unset color
            arc.hint = function(color) {
                this.unsetNormal.stroke = color;
                this.unsetNormal.opacity = 0.4;
                this.unsetHighlight.opacity = 0.5;
                this.arc.attr(this.unsetNormal);
            }

            return arc;
        };

        // The default style
        graph.style({ stroke: KhanUtil.GRAY, opacity: 0.1 });


        // Add all eight angles, and store in an array
        angles.angles = [];

        angles.angles.push(addArc(bottomIntersect, 0.6, 0, angles.angle));
        angles.angles.push(addArc(bottomIntersect, 0.6, angles.angle, 180));
        angles.angles.push(addArc(bottomIntersect, 0.6, 180, 180+angles.angle));
        angles.angles.push(addArc(bottomIntersect, 0.6, 180+angles.angle, 360));

        angles.angles.push(addArc(topIntersect, 0.6, 0, angles.angle));
        angles.angles.push(addArc(topIntersect, 0.6, angles.angle, 180));
        angles.angles.push(addArc(topIntersect, 0.6, 180, 180+angles.angle));
        angles.angles.push(addArc(topIntersect, 0.6, 180+angles.angle, 360));

        // Exposed function to force setting of arcs
        angles.setAngle = function(index) {
            this.angles[index].force();
        };

        // Exposed function for checking if angles are set
        angles.isSet = function(index) {
            return this.angles[index].set;
        };

        // Exposed function for hinting an angle
        angles.hint = function(index, color) {
            this.angles[index].hint(color);
        };

        return angles;
    }
});
