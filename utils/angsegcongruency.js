$.extend(KhanUtil, {
    Angles: function(x1, x2, y1, y2, angle) {
        var graph = KhanUtil.currentGraph;

        // draw the parallel lines
        graph.line([x1, y1], [x2, y1]);
        graph.line([x1, y2], [x2, y2]);

        var slope = Math.tan(KhanUtil.toRadians(angle));
        var middle = [(x2 - x1) / 2, (y1 + y2) / 2];

        // takes a y position, and returns the x position of the point
        var invfunc = function(y) {
            return (y - middle[1]) / slope + middle[0];
        };

        var bottomIntersect = [invfunc(y1), y1];
        var topIntersect    = [invfunc(y2), y2];

        // scale = -1: returns end
        // scale =  0: returns (start + end) / 2
        // scale =  1: returns start
        var scaleLine = function(start, end, scale) {
            return [(scale / 2 + 0.5) * start[0] + (0.5 - scale / 2) * end[0],
                    (scale / 2 + 0.5) * start[1] + (0.5 - scale / 2) * end[1]];
        };

        // draw the diagonal line
        graph.line(scaleLine(bottomIntersect, topIntersect,  1.6),
                   scaleLine(bottomIntersect, topIntersect, -1.6));

        // add an arc to the diagram
        var addArc = function(position, radius, startAng, endAng) {
            // create the initial arc
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
            // increase the point's size
            arc.point.mouseTarget.attr({ r: 30.0 });
            // make it not move
            arc.point.onMove = function(x, y) {
                return pointPos;
            };

            // replace the shape with our arc
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

            // set the default styles
            arc.point.normalStyle = arc.unsetNormal;
            arc.point.highlightStyle = arc.unsetHighlight;

            // remake the arc (meaning removing and re-creating it)
            arc.remake = function(radius) {
                this.radius = radius;
                this.arc.remove();
                this.arc = graph.arc(this.position, this.radius, this.start, this.end);
                this.arc.attr(this.point.highlightStyle);
                this.point.visibleShape = this.arc;
            };

            // toggle between set and not-set
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

            // add a click event
            $(arc.point.mouseTarget[0]).bind("vmousedown", function(event) {
                arc.toggle();
            });

            // force the arc to be set, for a pre-given point
            arc.force = function() {
                this.point.highlightStyle = this.forceHighlight;
                this.remake(0.8);
                // remove the mouse target entirely
                $(this.point.mouseTarget[0]).unbind();
                this.point.mouseTarget.remove();
            };

            arc.hint = function(color) {
                this.unsetNormal.stroke = color;
                this.unsetNormal.opacity = 0.3;
                this.arc.attr(this.unsetNormal);
            }

            return arc;
        };

        // the default style
        graph.style({ stroke: KhanUtil.GRAY, opacity: 0.1 });


        // Add all four angles, and store in an array
        this.angles = [];

        this.angles.push(addArc(bottomIntersect, 0.6, 0, angle));
        this.angles.push(addArc(bottomIntersect, 0.6, angle, 180));
        this.angles.push(addArc(bottomIntersect, 0.6, 180, 180+angle));
        this.angles.push(addArc(bottomIntersect, 0.6, 180+angle, 360));

        this.angles.push(addArc(topIntersect, 0.6, 0, angle));
        this.angles.push(addArc(topIntersect, 0.6, angle, 180));
        this.angles.push(addArc(topIntersect, 0.6, 180, 180+angle));
        this.angles.push(addArc(topIntersect, 0.6, 180+angle, 360));

        // exposed function to force setting of arcs
        this.setAngle = function(index) {
            this.angles[index].force();
        };

        // exposed function for checking if angles are set
        this.isSet = function(index) {
            return this.angles[index].set;
        };

        this.hint = function(index, color) {
            this.angles[index].hint(color);
        };

        return this;
    }
});
