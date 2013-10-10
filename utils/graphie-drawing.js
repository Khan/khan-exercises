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

var normalStyle = {
    stroke: KhanUtil.BLACK,
    strokeWidth: 2,
    strokeOpacity: 1,
    strokeDasharray: "",
    fill: KhanUtil.BLACK,
    fillOpacity: 0,
    color: KhanUtil.BLACK
};

var labelStyle = _.extend({}, normalStyle, {
    strokeWidth: 1
});

// Return a copy of the object with all camelCase keys converted to dashed-case
function toDashed(obj) {
    var keys = _.map(_.keys(obj), function(key) {
        return key.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
    });
    return _.object(keys, _.values(obj));
}

// Return the normal and label styles for a given options object
function getStyles(options) {
    // Color overrides stroke and fill if not present
    if (_.has(options, "color")) {
        _.defaults(options, {
            stroke: options.color,
            fill: options.color
        });
    }

    // Dasharray can combine dashes and dots
    if (options.dashed && options.dotted) {
        options.strokeDasharray = "- .";
    } else if (options.dashed) {
        options.strokeDasharray = "- ";
    } else if (options.dotted) {
        options.strokeDasharray = ". ";
    }

    return {
        normalStyle: toDashed(_.extend({}, normalStyle, options)),
        labelStyle: toDashed(_.extend({}, labelStyle, options))
    };
}

$.extend(KhanUtil.Graphie.prototype, {

    drawPoint: function(options) {
        var graphie = this;

        _.defaults(options, {
            point: [0, 0],
            label: ""
        });

        var styles = getStyles(options);

        return graphie.addMovablePoint({
            coord: options.point,
            constraints: {fixed: true},
            vertexLabel: options.label,
            normalStyle: _.extend(styles.normalStyle, {"fill-opacity": 1}),
            labelStyle: styles.labelStyle
        });
    },

    drawSegment: function(options) {
        var graphie = this;

        // Instead of two points, can specify a point and an angle/radius
        if (_.has(options, "point")) {
            var radius = options.radius || 5;
            var angle = options.angle || 0;
            var offset = graphie.polar(radius, angle);
            options.points = [
                options.point,
                graphie.addPoints(options.point, offset)
            ];
        }

        _.defaults(options, {
            points: [[-5, 0], [5, 0]],
            sideLabel: "",
            vertexLabels: "",
            showPoints: false,
            line: false,
            ray: false
        });

        expandKeys(options, ["vertexLabels", "showPoints"], 2);

        var styles = getStyles(options);

        _.each(options.showPoints, function(showPoint, i) {
            if (showPoint) {
                graphie.drawPoint(_.extend(options, {
                    point: options.points[i]
                }));
            }
        });

        return graphie.addMovableLineSegment({
            coordA: options.points[0],
            coordZ: options.points[1],
            fixed: true,
            extendLine: options.line,
            extendRay: options.ray,
            sideLabel: options.sideLabel,
            vertexLabels: options.vertexLabels,
            normalStyle: styles.normalStyle,
            labelStyle: styles.labelStyle
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
            points: [[3, -2], [0, 4], [-3, -2]]
        });
        
        expandKeys(options, _.keys(defaults), options.points.length);

        var styles = getStyles(_.omit(options, "arrows"));

        _.each(options.showPoints, function(showPoint, i) {
            if (showPoint) {
                graphie.drawPoint(_.extend(options, {
                    point: options.points[i]
                }));
            }
        });

        return graphie.addMovablePolygon(_.extend(options, {
            fixed: true,
            numArcs: options.arcs,
            numArrows: options.arrows,
            numTicks: options.ticks,
            normalStyle: styles.normalStyle,
            labelStyle: styles.labelStyle
        }));
    },

    drawArc: function(options) {
        var graphie = this;

        if (_.has(options, "radius")) {
            _.defaults(options, {
                radii: options.radius
            });
        }

        _.defaults(options, {
            center: [0, 0],
            radii: 5,
            start: 45,
            end: 135,
            sector: false
        });

        // Fill arcs by drawing an unstroked sector
        if (!options.sector && options.fillOpacity !== 0) {
            graphie.drawSector(_.extend({}, options, {
                strokeOpacity: 0
            }));
            options.fillOpacity = 0;
        }

        var styles = getStyles(options);

        return graphie.arc(
            options.center,
            options.radii,
            options.start,
            options.end,
            options.sector,
            styles.normalStyle
        );
    },

    drawSector: function(options) {
        return this.drawArc(_.extend(options, {
            sector: true
        }));
    },

    drawEllipse: function(options) {
        var graphie = this;

        if (_.has(options, "radius")) {
            _.defaults(options, {
                radii: options.radius
            });
        }

        _.defaults(options, {
            center: [0, 0],
            radii: [2, 5]
        });

        var styles = getStyles(options);

        return graphie.ellipse(
            options.center,
            options.radii,
            styles.normalStyle
        );
    },

    drawCircle: function(options) {
        _.defaults(options, {
            radius: 5
        });

        return this.drawEllipse(options);
    },

    drawAngleLabel: function(options) {
        var graphie = this;

        _.defaults(options, {
            points: [],
            label: "",
            distance: 0,
            arcs: 1
        });

        var styles = getStyles(options);

        return graphie.labelAngle({
            point1: options.points[0],
            vertex: options.points[1],
            point3: options.points[2],
            clockwise: true,
            text: options.label,
            numArcs: options.arcs,
            pushOut: options.distance,
            style: styles.labelStyle
        });
    }

    // TODO(alex): drawPolyline(), drawSpokes(), labelSegment()
});