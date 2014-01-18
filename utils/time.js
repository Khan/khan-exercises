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
