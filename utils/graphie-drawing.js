/**
 * Provides a concise API for drawing static versions of the 2D
 * geometrical constructs found in interactive.js, consistent with
 * the originals in style.
 */

// Expand an object's whitelisted non-array keys into arrays of length n
// e.g. expandKeys({foo: 1, bar: 2}, ["foo"], 3) -> {foo: [1, 1, 1], bar: 2}
function expandKeys(obj, keys, n) {
    _.each(keys, function(key) {
        var value = obj[key];
        if (!_.isArray(value)) {
            obj[key] = _.times(n, function() {
                return value;
            });
        }
    });
}

$.extend(KhanUtil.Graphie.prototype, {

    drawPoint: function(options) {
        var graphie = this;

        _.defaults(options, {
            point: [0, 0],
            color: KhanUtil.BLACK,
            label: ""
        });

        return graphie.addMovablePoint({
            coord: options.point,
            constraints: {
                fixed: true
            },
            normalStyle: {
                "stroke": options.color,
                "fill": options.color
            },
            labelStyle: {
                "color": options.color
            },
            vertexLabel: options.label
        });
    },

    drawSegment: function(options) {
        var graphie = this;

        // Instead of two points, can specify a point and an angle/radius
        if ("point" in options && "angle" in options) {
            var radius = options.radius || 5;
            var offset = graphie.polar(options.radius, options.angle);
            options.points = [
                options.point,
                [
                    options.point[0] + offset[0],
                    options.point[1] + offset[1]
                ]
            ];
        }

        _.defaults(options, {
            points: [[-5, 0], [5, 0]],
            color: KhanUtil.BLACK,
            sideLabel: "",
            vertexLabels: "",
            showPoints: false,
            line: false,
            ray: false,
            dashed: false,
            dotted: false
        });

        expandKeys(options, ["vertexLabels", "showPoints"], 2);

        _.each(options.showPoints, function(showPoint, i) {
            if (showPoint) {
                graphie.drawPoint({
                    point: options.points[i],
                    color: options.color
                });
            }
        });

        var dasharray;
        if (options.dashed && options.dotted) {
            dasharray = "- .";
        } else if (options.dashed) {
            dasharray = "- ";
        } else if (options.dotted) {
            dasharray = ". ";
        } else /* solid line */ {
            dasharray = "";
        }

        return graphie.addMovableLineSegment({
            coordA: options.points[0],
            coordZ: options.points[1],
            fixed: true,
            extendLine: options.line,
            extendRay: options.ray,
            normalStyle: {
                "stroke": options.color,
                "stroke-width": 2,
                "stroke-dasharray": dasharray
            },
            labelStyle: {
                "stroke": options.color,
                "color": options.color
            },
            sideLabel: options.sideLabel,
            vertexLabels: options.vertexLabels
        });
    },


    drawLine: function(options) {
        return this.drawSegment(_.extend(options, {
            line: true,
            ray: false
        }));
    },

    drawRay: function(options) {
        return this.drawSegment(_.extend(options, {
            line: false,
            ray: true
        }));
    },

    drawPolygon: function(options) {
        var graphie = this;

        // Shorthand defaults for all per angle/side/vertex properties
        var defaults = {
            angleLabels: "",
            sideLabels: "",
            vertexLabels: "",
            arcs: 0,
            arrows: 0,
            ticks: 0,
            showPoints: false
        };

        _.defaults(options, defaults, {
            points: [[3, -2], [0, 4], [-3, -2]],
            color: KhanUtil.BLACK,
            strokeOpacity: 1,
            fillOpacity: 0
        });
        
        expandKeys(options, _.keys(defaults), options.points.length);

        _.each(options.showPoints, function(showPoint, i) {
            if (showPoint) {
                graphie.drawPoint({
                    point: options.points[i],
                    color: options.color
                });
            }
        });

        return graphie.addMovablePolygon(_.extend(options, {
            fixed: true,
            normalStyle: {
                "stroke": options.color,
                "stroke-width": 2,
                "stroke-opacity": options.strokeOpacity,
                "fill": options.color,
                "fill-opacity": options.fillOpacity
            },
            labelStyle: {
                "stroke": options.color,
                "stroke-width": 1,
                "stroke-opacity": options.strokeOpacity,
                "color": options.color
            },
            numArcs: options.arcs,
            numArrows: options.arrows,
            numTicks: options.ticks
        }));
    },

    drawArc: function(options) {
        var graphie = this;

        _.defaults(options, {
            center: [0, 0],
            radius: 5,
            start: 45,
            end: 135,
            color: KhanUtil.BLACK
        });

        return graphie.arc(
            options.center,
            options.radius,
            options.start,
            options.end,
            {
                "stroke": options.color,
                "stroke-width": 2
            }
        );
    },

    drawEllipse: function(options) {
        var graphie = this;

        _.defaults(options, {
            center: [0, 0],
            radii: [2, 5],
            color: KhanUtil.BLACK,
            strokeOpacity: 1,
            fillOpacity: 0
        });

        return graphie.ellipse(
            options.center,
            options.radii,
            {
                "stroke": options.color,
                "stroke-width": 2,
                "stroke-opacity": options.strokeOpacity,
                "fill": options.color,
                "fill-opacity": options.fillOpacity
            }
        );
    },

    drawCircle: function(options) {
        return this.drawEllipse(_.extend(options, {
            radii: options.radius || 5
        }));
    },

    drawAngleLabel: function(options) {
        var graphie = this;

        _.defaults(options, {
            points: [],
            label: "",
            distance: 0,
            color: KhanUtil.BLACK,
            arcs: 1
        });

        return graphie.labelAngle({
            point1: options.points[0],
            vetex: options.points[1],
            point3: options.points[2],
            clockwise: true,
            text: options.label,
            numArcs: options.arcs,
            pushOut: options.distance,
            style: {
                "stroke": options.color,
                "stroke-width": 1,
                "color": options.color
            }
        });
    }

    // TODO(alex): drawPolyline(), drawSpokes(), labelSegment()
});