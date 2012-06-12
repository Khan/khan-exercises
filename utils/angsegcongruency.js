$.extend(KhanUtil, {
    Angles: function(x1, x2, y1, diff, angle) {
        var graph = KhanUtil.currentGraph;

        // draw the parallel lines
        graph.line([x1, y1],        [x2, y1]);
        graph.line([x1, y1 + diff], [x2, y1 + diff]);

        // converts degrees to radians
        var toRadians = function(angle) {
            return Math.PI * angle / 180;
        };

        var slope = Math.tan(toRadians(angle));
        var middle = [(x2 - x1) / 2, y1 + diff / 2];

        // takes a y position, and returns the x position of the point
        var invfunc = function(y) {
            return (y - middle[1]) / slope + middle[0];
        };

        var bottomIntersect = [invfunc(y1),        y1];
        var topIntersect    = [invfunc(y1 + diff), y1 + diff];

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
            var aveAngle = toRadians((endAng + startAng) / 2);

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
            var unsetNormal = {
                stroke: KhanUtil.GRAY,
                opacity: 0.1
            };
            var unsetHighlight = {
                stroke: KhanUtil.BLUE,
                opacity: 0.4
            };
            var setNormal = {
                stroke: KhanUtil.BLUE,
                opacity: 0.9
            };
            var setHighlight = {
                stroke: KhanUtil.BLUE,
                opacity: 1.0
            };
            var forceHighlight = {
                stroke: KhanUtil.ORANGE,
                opacity: 1.0
            };

            // set the default styles
            arc.point.normalStyle = unsetNormal;
            arc.point.highlightStyle = unsetHighlight;

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
                    this.point.normalStyle = unsetNormal;
                    this.point.highlightStyle = unsetHighlight;
                    this.remake(0.6);
                } else {
                    this.point.normalStyle = setNormal;
                    this.point.highlightStyle = setHighlight;
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
                this.point.highlightStyle = forceHighlight;
                this.remake(0.8);
                // remove the mouse target entirely
                $(this.point.mouseTarget[0]).unbind();
                this.point.mouseTarget.remove();
            };

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

        return this;
    }
});
