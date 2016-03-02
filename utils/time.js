/* TODO(csilvers): fix these lint errors (http://eslint.org/docs/rules): */
/* eslint-disable brace-style, comma-dangle, comma-spacing, indent, max-len, no-undef, no-var, space-before-function-paren, space-infix-ops */
/* To fix, remove an entry above, run ka-lint, and fix errors. */

define(function(require) {

$.extend(KhanUtil, {
    addAnalogClock: function(options) {
        var analogClock = $.extend(true, {
            graph: KhanUtil.currentGraph,
            set: KhanUtil.currentGraph.raphael.set(),
            hands: KhanUtil.currentGraph.raphael.set(),
            center: [0, 0],
            radius: 3.5,
            showLabels: true,
            hour: null,
            minute: null
        }, options);

        analogClock.drawLabels = function() {
            var self = this;
            _(12).times(function(n) {
                n += 1;
                var coord = self.graph.scalePoint([
                        self.center[0] + 0.78 * self.radius * Math.sin(2 * Math.PI * n / 12),
                        self.center[1] + 0.78 * self.radius * Math.cos(2 * Math.PI * n / 12)]);
                // Use raphael text rather than mathjax labels so the hands can
                // be drawn on top. Also, the sans-serif font better fits the
                // stylish look of this sleek, modern clock.
                var lbl = self.graph.raphael.text(coord[0], coord[1], n);
                lbl.attr({
                    color: KhanUtil.GRAY,
                    fill: KhanUtil.GRAY,
                    "font-size": 14
                });
                self.set.push(lbl);
            });
            self.hands.toFront();
        };

        analogClock.drawHands = function() {
            var self = this;
            self.graph.style({
                fill: "#333",
                stroke: "none"
            }, function() {
                var hourHand = self.graph.path([
                        [self.center[0] - 0.15 * self.radius, self.center[1] + 0.035 * self.radius],
                        [self.center[0] + 0.45 * self.radius, self.center[1] + 0.020 * self.radius],
                        [self.center[0] + 0.45 * self.radius, self.center[1] - 0.020 * self.radius],
                        [self.center[0] - 0.15 * self.radius, self.center[1] - 0.035 * self.radius],
                        true]);
                hourHand.rotate(-KhanUtil.timeToDegrees((self.hour + self.minute/60) * 5),
                        self.graph.scalePoint(self.center)[0], self.graph.scalePoint(self.center)[1]);
                self.hands.push(hourHand);

                var minuteHand = self.graph.path([
                        [self.center[0] - 0.15 * self.radius, self.center[0] + 0.035 * self.radius],
                        [self.center[0] + 0.85 * self.radius, self.center[0] + 0.017 * self.radius],
                        [self.center[0] + 0.85 * self.radius, self.center[0] - 0.017 * self.radius],
                        [self.center[0] - 0.15 * self.radius, self.center[0] - 0.035 * self.radius],
                        true]);
                minuteHand.rotate(-KhanUtil.timeToDegrees(self.minute),
                        self.graph.scalePoint(self.center)[0], self.graph.scalePoint(self.center)[1]);
                self.hands.push(minuteHand);
            });
            self.set.push(self.hands);
        };

        analogClock.draw = function() {
            var self = this;
            self.graph.style({
                stroke: KhanUtil.GRAY,
                fill: "#fff",
                strokeWidth: 5
            }, function() {
                self.set.push(self.graph.circle(self.center, self.radius));
            });
            self.graph.style({
                stroke: KhanUtil.GRAY,
                strokeWidth: 4
            }, function() {
                _(12).times(function(n) {
                    var tick = self.graph.line(
                            [self.center[0] + self.radius - 4 / self.graph.scale[0], self.center[1]],
                            [self.center[0] + self.radius - 8 / self.graph.scale[0], self.center[1]]);
                    tick.rotate(n * 30, self.graph.scalePoint(self.center)[0], self.graph.scalePoint(self.center)[1]);
                    self.set.push(tick);
                });
            });
            self.graph.style({
                stroke: KhanUtil.GRAY,
                strokeWidth: 1
            }, function() {
                _(60).times(function(n) {
                    var tick = self.graph.line(
                            [self.center[0] + self.radius - 4 / self.graph.scale[0], self.center[1]],
                            [self.center[0] + self.radius - 8 / self.graph.scale[0], self.center[1]]);
                    tick.rotate(n * 6, self.graph.scalePoint(self.center)[0], self.graph.scalePoint(self.center)[1]);
                    self.set.push(tick);
                });
            });
            if (self.showLabels) {
                self.drawLabels();
            }
            if (self.hour != null && self.minute != null) {
                self.drawHands();
            }
            return self.set;
        };

        return analogClock;
    },

    addInteractiveAnalogClock: function(options) {
        options = $.extend(true, {
            minuteSnapPoints: 12,
            minuteIncrement: 5,
            minuteStartAngle: 90,
            hourStartAngle: 60
        }, options);

        var interactiveAnalogClock = KhanUtil.addAnalogClock(options);
        var graph = interactiveAnalogClock.graph;

        var hourSnapPoints = 12 * 60 / interactiveAnalogClock.minuteIncrement;
        var outerPointRadius = interactiveAnalogClock.radius * 1.10;
        interactiveAnalogClock.minuteRadius = interactiveAnalogClock.radius * 0.65;
        interactiveAnalogClock.hourRadius = interactiveAnalogClock.radius * 0.45;

        var minuteSnapDegrees = 360 / interactiveAnalogClock.minuteSnapPoints;
        var hourSnapDegrees = 360 / hourSnapPoints;

        interactiveAnalogClock.draw();
        graph.addMouseLayer();

        var redStyle = { fill: KhanUtil.RED, stroke: KhanUtil.RED };
        var blueStyle = { fill: KhanUtil.BLUE, stroke: KhanUtil.BLUE };

        var movePartnerPoint = function (options) {
            var x = options.x;
            var y = options.y;
            var point = options.point;
            var outerPoint = options.outerPoint;
            var isOuterPoint = options.isOuterPoint;

            var ratio = outerPoint.constraints.fixedDistance.dist / point.constraints.fixedDistance.dist;

            if (isOuterPoint) {
                ratio = 1 / ratio;
                point.setCoord([x * ratio , y * ratio]);
                outerPoint.setCoord([x, y]);
            } else {
                point.setCoord([x, y]);
                outerPoint.setCoord([x * ratio, y * ratio]);
            }

            point.updateLineEnds();
            return true;
        };

        interactiveAnalogClock.minutePoint = graph.addMovablePoint({
            graph: graph,
            coord: graph.polar(interactiveAnalogClock.minuteRadius, interactiveAnalogClock.minuteStartAngle),
            constraints: {
                fixedDistance: {
                    dist: interactiveAnalogClock.minuteRadius,
                    point: [0, 0],
                    snapPoints: 12
                }
            },
            onMove: function(x, y) {
                return movePartnerPoint({
                    x: x,
                    y: y,
                    point: this,
                    outerPoint: interactiveAnalogClock.outerMinutePoint,
                    isOuterPoint: false
                });
            },
            normalStyle: redStyle,
            highlightStyle: redStyle
        });

        interactiveAnalogClock.outerMinutePoint = graph.addMovablePoint({
            graph: graph,
            coord: graph.polar(outerPointRadius, interactiveAnalogClock.minuteStartAngle),
            constraints: {
                fixedDistance: {
                    dist: outerPointRadius,
                    point: [0, 0],
                    snapPoints: 12
                }
            },
            onMove: function(x, y) {
                return movePartnerPoint({
                    x: x,
                    y: y,
                    point: interactiveAnalogClock.minutePoint,
                    outerPoint: this,
                    isOuterPoint: true
                });
            },
            normalStyle: redStyle,
            highlightStyle: redStyle
        });

        interactiveAnalogClock.hourPoint = graph.addMovablePoint({
            graph: graph,
            coord: graph.polar(interactiveAnalogClock.hourRadius, interactiveAnalogClock.hourStartAngle),
            constraints: {
                fixedDistance: {
                    dist: interactiveAnalogClock.hourRadius,
                    point: [0, 0],
                    snapPoints: hourSnapPoints
                }
            },
            onMove: function(x, y) {
                return movePartnerPoint({
                    x: x,
                    y: y,
                    point: this,
                    outerPoint: interactiveAnalogClock.outerHourPoint,
                    isOuterPoint: false
                });
            },
            normalStyle: blueStyle,
            highlightStyle: blueStyle
        });

        interactiveAnalogClock.outerHourPoint = graph.addMovablePoint({
            graph: graph,
            coord: graph.polar(outerPointRadius, interactiveAnalogClock.hourStartAngle),
            constraints: {
                fixedDistance: {
                    dist: outerPointRadius,
                    point: [0, 0],
                    snapPoints: hourSnapPoints
                }
            },
            onMove: function(x, y) {
                return movePartnerPoint({
                    x: x,
                    y: y,
                    point: interactiveAnalogClock.hourPoint,
                    outerPoint: this,
                    isOuterPoint: true
                });
            },
            normalStyle: blueStyle,
            highlightStyle: blueStyle
        });

        interactiveAnalogClock.minuteHand = graph.addMovableLineSegment({
            graph: graph,
            pointA: interactiveAnalogClock.minutePoint,
            coordZ: [0, 0],
            fixed: true,
            normalStyle: {
                stroke: KhanUtil.RED,
                "stroke-width": 10
            }
        });

        interactiveAnalogClock.hourHand = graph.addMovableLineSegment({
            graph: graph,
            pointA: interactiveAnalogClock.hourPoint,
            coordZ: [0, 0],
            fixed: true,
            normalStyle: {
                stroke: KhanUtil.BLUE,
                "stroke-width": 10
            }
        });

        graph.addMovablePoint({
            graph: graph,
            coord: [0, 0],
            constraints: {
                fixed: true
            },
            normalStyle: {
                fill: "#fff",
                stroke: "#000",
                "stroke-width": 2
            }
        });

        // Return the position of the minute and hour hands
        interactiveAnalogClock.getHandPositions = function() {
            return [interactiveAnalogClock.minutePoint.coord, interactiveAnalogClock.hourPoint.coord];
        };

        // Test whether the clock is set to correctMinute and correctHour
        interactiveAnalogClock.validate = function(guess, correctMinute, correctHour) {
            var minuteAngle = graph.cartToPolar(guess[0])[1];
            var hourAngle = graph.cartToPolar(guess[1])[1];

            minuteAngle = KhanUtil.roundToNearest(minuteSnapDegrees, minuteAngle);
            hourAngle = KhanUtil.roundToNearest(hourSnapDegrees, hourAngle);

            // If hands have not been moved, return `""`
            if (minuteAngle === interactiveAnalogClock.minuteStartAngle && hourAngle === interactiveAnalogClock.hourStartAngle) {
                return "";
            }

            var correctMinuteAngle = KhanUtil.timeToDegrees(correctMinute);
            var correctHourAngle = KhanUtil.timeToDegrees(5 * (correctHour + correctMinute / 60));
            correctMinuteAngle = KhanUtil.roundToNearest(minuteSnapDegrees, correctMinuteAngle);
            correctHourAngle = KhanUtil.roundToNearest(hourSnapDegrees, correctHourAngle);

            if ((minuteAngle !== correctMinuteAngle) || (hourAngle !== correctHourAngle)) {
                if ((minuteAngle === correctHourAngle) && (hourAngle === correctMinuteAngle)) {
                    return i18n._("Remember the hour hand is the short hand and the minute hand is the long hand");
                }
                else if ((minuteAngle === correctMinuteAngle) && (hourAngle !== correctHourAngle) &&
                         (hourAngle === KhanUtil.roundToNearest(hourSnapDegrees, KhanUtil.timeToDegrees(5 * correctHour)))) {
                    return i18n._("Remember the hour hand needs to move over the course of the hour");
                }
                return false;
            }
            return true;
        };

        // Show semi-transparent hands set at the correct time
        interactiveAnalogClock.showCorrectTime = function(correctMinute, correctHour) {
            var correctMinuteAngle = KhanUtil.timeToDegrees(correctMinute);
            var correctHourAngle = KhanUtil.timeToDegrees(5 * (correctHour + correctMinute / 60));
            correctMinuteAngle = KhanUtil.roundToNearest(minuteSnapDegrees, correctMinuteAngle);
            correctHourAngle = KhanUtil.roundToNearest(hourSnapDegrees, correctHourAngle);

            var minuteCoord = graph.polar(interactiveAnalogClock.minuteRadius, correctMinuteAngle);
            var hourCoord = graph.polar(interactiveAnalogClock.hourRadius, correctHourAngle);

            var dotOpacity = 0.4;
            var handOpacity = 0.3;

            interactiveAnalogClock.graph.addMovableLineSegment({
                coordA: minuteCoord,
                coordZ: [0, 0],
                fixed: true,
                normalStyle: {
                    stroke: KhanUtil.RED,
                    "stroke-width": 10,
                    "stroke-dasharray": ".",
                    "stroke-linecap": "round",
                    "stroke-opacity": dotOpacity
                }
            });

            interactiveAnalogClock.graph.addMovableLineSegment({
                coordA: minuteCoord,
                coordZ: [0, 0],
                fixed: true,
                normalStyle: {
                    stroke: KhanUtil.RED,
                    "stroke-width": 10,
                    "stroke-linecap": "round",
                    "stroke-opacity": handOpacity
                }
            });

            interactiveAnalogClock.graph.addMovableLineSegment({
                coordA: hourCoord,
                coordZ: [0, 0],
                fixed: true,
                normalStyle: {
                    stroke: KhanUtil.BLUE,
                    "stroke-width": 10,
                    "stroke-dasharray": ".",
                    "stroke-linecap": "round",
                    "stroke-opacity": dotOpacity
                }
            });

            interactiveAnalogClock.graph.addMovableLineSegment({
                coordA: hourCoord,
                coordZ: [0, 0],
                fixed: true,
                normalStyle: {
                    stroke: KhanUtil.BLUE,
                    "stroke-width": 10,
                    "stroke-linecap": "round",
                    "stroke-opacity": handOpacity
                }
            });

            interactiveAnalogClock.graph.addMovablePoint({
                coord: [0, 0],
                constraints: {
                    fixed: true
                },
                normalStyle: {
                    fill: "#fff",
                    stroke: "#000",
                    "stroke-dasharray": "",
                    "stroke-width": 2,
                    "stroke-opacity": 1
                }
            });
        };

        return interactiveAnalogClock;
    },

    /* Map time in minutes to angle in degrees
     * - Minutes start at positive y-axis and increase clockwise
     * - Angle starts at positive x-axis and increases counterclockwise
     * - (e.g., 0 minutes => 90 degrees; 15 minutes => 0 degrees;
     *   30 minutes => 270 degrees; 45 minutes => 180 degrees)
     * - Will return angle in radians if `angleInRadians` is specified as
     *   truthy.
     */
    timeToDegrees: function(minutes, angleInRadians) {
        // p is the proportion of total time
        var p = minutes / 60;
        var angleProportion;

        if (p <= 0.25) {
            angleProportion = (0.25 - p);
        } else {
            angleProportion = (1.25 - p);
        }

        if (angleInRadians) {
            return 2 * Math.PI * angleProportion;
        }
        return 360 * angleProportion;
    }
});

});
