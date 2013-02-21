$.extend(KhanUtil, {

    updateMean: function(mean) {
        var graph = KhanUtil.currentGraph;

        $(graph.graph.meanValueLabel).html(mean).tmpl();

        graph.graph.meanArrow.translate((mean * graph.scale[0]) - graph.graph.meanArrow.attr("translation").x, 0);
        graph.graph.meanValueLabel.remove();
        graph.graph.meanValueLabel = graph.label([mean, 0.8],
            (mean + "").replace(/-(\d)/g, "\\llap{-}$1"),
            "above",
            { color: KhanUtil.BLUE }
        );

        graph.graph.meanLabel.remove();
        graph.graph.meanLabel = graph.label([mean, 1.3], $._("\\text{mean}"),
            "above", { color: KhanUtil.BLUE });

        graph.graph.mean = mean;
    },


    updateMedian: function(median) {
        var graph = KhanUtil.currentGraph;

        graph.graph.medianArrow.translate((median * graph.scale[0]) - graph.graph.medianArrow.attr("translation").x, 0);
        graph.graph.medianValueLabel.remove();
        graph.graph.medianValueLabel = graph.label([median, -1.2],
            (median + "").replace(/-(\d)/g, "\\llap{-}$1"),
            "below",
            { color: KhanUtil.GREEN }
        );

        graph.graph.medianLabel.remove();
        graph.graph.medianLabel = graph.label([median, -1.7],
            $._("\\text{median}"), "below", { color: KhanUtil.GREEN });

        graph.graph.median = median;
    },

    updateMeanAndMedian: function() {
        var points = KhanUtil.currentGraph.graph.points;
        var mean = KhanUtil.mean($.map(points, function(el) { return el.coord[0]; }));
        var median = KhanUtil.median($.map(points, function(el) { return el.coord[0]; }));

        KhanUtil.updateMean(KhanUtil.roundTo(2, mean));
        KhanUtil.updateMedian(KhanUtil.roundTo(2, median));
    },

    updateMeanAndStddev: function() {
        var graph = KhanUtil.currentGraph;
        var points = KhanUtil.currentGraph.graph.points;
        var mean = KhanUtil.mean($.map(points, function(el) { return el.coord[0]; }));
        var stddev = KhanUtil.stdDev($.map(points, function(el) { return el.coord[0]; }));

        mean = KhanUtil.roundTo(1, mean);
        stddev = KhanUtil.roundTo(1, stddev);

        graph.graph.stddevLeft.translate(((mean) * graph.scale[0]) - graph.graph.stddevLeft.attr("translation").x, 0);
        graph.graph.stddevRight.translate(((mean + stddev) * graph.scale[0]) - graph.graph.stddevRight.attr("translation").x, 0);
        graph.graph.stddevLine.translate(((mean) * graph.scale[0]) - graph.graph.stddevLine.attr("translation").x, 0);
        graph.graph.stddevLine.scale(stddev, 1, graph.graph.stddevLine.attr("path")[0][1], graph.graph.stddevLine.attr("path")[0][2]);

        graph.graph.stddevValueLabel.remove();
        graph.graph.stddevValueLabel = graph.label([stddev / 2 + mean, -1.3], "s \\approx " + stddev, "below", { color: KhanUtil.GREEN });

        if (stddev > 0) {

            graph.style({ strokeWidth: 2, stroke: "#bbb", fill: null, "plot-points": 100 }, function() {
                graph.graph.pdf.remove();
                graph.graph.pdf = graph.plot(function(x) {
                    return KhanUtil.gaussianPDF(mean, stddev, x) * 5 - 0.2;
                }, [-7, 7]).toBack();
            });

            graph.style({ strokeWidth: 2, stroke: KhanUtil.BLUE, fill: null }, function() {
                graph.graph.meanLine.remove();
                graph.graph.meanLine = graph.line([mean, -0.2], [mean, KhanUtil.gaussianPDF(mean, stddev, mean) * 5 - 0.2]).toBack();
            });

            graph.graph.meanValueLabel.remove();
            graph.graph.meanValueLabel = graph.label(
                [mean, KhanUtil.gaussianPDF(mean, stddev, mean) * 5 - 0.2],
                "\\bar{x} \\approx " + mean, "above", { color: KhanUtil.BLUE }
            );

            var points = [];

            points.push([mean - stddev, -0.2]);
            points.push([mean - stddev, KhanUtil.gaussianPDF(mean, stddev, mean - stddev) * 5 - 0.2]);
            var step = stddev / 50;
            for (var x = mean - stddev; x <= mean + stddev; x += step) {
                points.push([x, KhanUtil.gaussianPDF(mean, stddev, x) * 5 - 0.2]);
            }
            points.push([mean + stddev, KhanUtil.gaussianPDF(mean, stddev, mean + stddev) * 5 - 0.2]);
            points.push([mean + stddev, -0.2]);

            graph.style({ strokeWidth: 0, stroke: null, fill: KhanUtil.GREEN, opacity: 0.3 }, function() {
                graph.graph.stddevArea.remove();
                graph.graph.stddevArea = graph.path(points).toBack();
            });

        } else {
            graph.graph.pdf.remove();
            graph.graph.pdf = KhanUtil.bogusShape;
        }


        graph.graph.mean = mean;
        graph.graph.stddev = stddev;
    },


    onMovePoint: function(point, x, y, updateFunction) {
        var points = KhanUtil.currentGraph.graph.points;

        // don't allow the point to move past the bounds
        x = Math.min(Math.max(-7, x), 7);

        // Don't do anything unless the point actually moved
        if (point.coord[0] !== x) {

            point.coord = [x, 0];

            // Figure out which points are at the same position
            var positions = {};
            // The point being dragged is always at the bottom of the pile
            positions[Math.round(x * 2) / 2] = [point];

            $.each(points, function() {
                if (this !== point) {
                    var pos = Math.round(this.coord[0] * 2) / 2;
                    if (!$.isArray(positions[pos])) {
                        positions[pos] = [];
                    }
                    positions[pos].push(this);
                }
            });

            if ($.isFunction(updateFunction)) {
                updateFunction();
            }

            // Adjust the y-value of each point in case points are stacked
            $.each(positions, function(value, points) {
                points = points.sort(function(a, b) { return a.coord[1] - b.coord[1]; });
                $.each(points, function(i, point) {
                    if (updateFunction !== undefined) {
                        point.moveTo(point.coord[0], 0.3 * i);
                    } else {
                        point.setCoord([point.coord[0], 0.3 * i]);
                    }
                });
            });

            return [x, 0];
        }
    },


    arrangePointsAroundMedian: function() {
        var graph = KhanUtil.currentGraph;
        var points = graph.graph.points;
        var targetMedian = graph.graph.targetMedian;
        var numPoints = graph.graph.numPoints;
        var maxWidth = Math.min(Math.abs(-7 - targetMedian), Math.abs(7 - targetMedian));

        var distance = 0.5;
        var newValues = [];
        if (numPoints % 2 === 0) {
            newValues.push(targetMedian + distance);
            newValues.push(targetMedian - distance);
            distance += 0.5;
        } else {
            newValues.push(targetMedian);
        }

        while (newValues.length < points.length) {
            newValues.push(targetMedian + distance);
            newValues.push(targetMedian - distance);
            if (distance >= maxWidth) {
                distance = 0.5;
            } else {
                distance += 0.5;
            }
        }
        return KhanUtil.sortNumbers(newValues);
    },


    animatePoints: function(oldValues, newValues, newMedian, newMean) {
        var graph = KhanUtil.currentGraph;
        var points = graph.graph.points;
        var sortedPoints = points.sort(function(a, b) { return a.coord[0] - b.coord[0]; });

        $.each(oldValues, function(i, oldValue) {
            $({ 0: oldValue }).animate({ 0: newValues[i] }, {
                duration: 500,
                step: function(now, fx) {
                    KhanUtil.onMovePoint(sortedPoints[i], now, 0);
                }
            });
        });

        $({ median: graph.graph.median, mean: graph.graph.mean }).animate({
            median: newMedian, mean: newMean
        }, {
            duration: 500,
            step: function(now, fx) {
                if (fx.prop === "median") {
                    KhanUtil.updateMedian(KhanUtil.roundTo(2, now));
                } else if (fx.prop === "mean") {
                    KhanUtil.updateMean(KhanUtil.roundTo(2, now));
                }
            }
        });
    },


    showMedianExample: function(onComplete) {
        var points = KhanUtil.currentGraph.graph.points;
        var targetMedian = KhanUtil.currentGraph.graph.targetMedian;
        var maxWidth = Math.min(Math.abs(-7 - targetMedian), Math.abs(7 - targetMedian));
        var sortedPoints = points.sort(function(a, b) { return a.coord[0] - b.coord[0]; });
        var oldValues = [];
        $.each(sortedPoints, function(i, point) {
            oldValues.push(point.coord[0]);
        });
        var newValues = KhanUtil.arrangePointsAroundMedian();

        KhanUtil.animatePoints(oldValues, newValues, targetMedian, targetMedian);
        KhanUtil.currentGraph.graph.moved = true;
    },


    showMeanExample: function() {
        var graph = KhanUtil.currentGraph;
        var points = graph.graph.points;

        var calculateMean = function(values) {
            var mean = 0;
            $.each(values, function() {
                mean += this;
            });
            mean /= values.length;
            return mean;
        };

        var sortedPoints = points.sort(function(a, b) { return a.coord[0] - b.coord[0]; });
        var oldValues = [];
        var newValues = [];
        $.each(sortedPoints, function(i, point) {
            oldValues.push(point.coord[0]);
        });

        var newValues = KhanUtil.arrangePointsAroundMedian();

        // Keep moving outlier points further away from the median until
        // we get to the right mean
        var mean = calculateMean(newValues);
        while (mean != graph.graph.targetMean) {
            if (mean < graph.graph.targetMean) {
                // Start by moving the right-most point further to the right, then the next, etc.
                var pointToMove = newValues.length - 1;
                while (newValues[pointToMove] === 7 && pointToMove > (points.length / 2)) {
                    --pointToMove;
                }
                // If we move all the points on the right of the median all the way to the right
                // and we still don't have the right mean, start moving points on the left
                // closer to the median
                if (pointToMove <= (points.length / 2)) {
                    pointToMove = 0;
                }
                newValues[pointToMove] += 0.5;
            } else {
                // Start by moving the left-most point further to the left, then the next, etc.
                var pointToMove = 0;
                while (newValues[pointToMove] === -7 && pointToMove < (points.length / 2 - 1)) {
                    ++pointToMove;
                }
                // If we move all the points on the left of the median all the way to the left
                // and we still don't have the right mean, start moving points on the right
                // closer to the median
                if (pointToMove >= (points.length / 2 - 1)) {
                    pointToMove = newValues.length - 1;
                }
                newValues[pointToMove] -= 0.5;
            }
            mean = calculateMean(newValues);
            newValues = KhanUtil.sortNumbers(newValues);
        }

        KhanUtil.animatePoints(oldValues, newValues, graph.graph.targetMedian, graph.graph.targetMean);
        KhanUtil.currentGraph.graph.moved = true;
    },

    showStddevExample: function() {
        var points = KhanUtil.currentGraph.graph.points;
        var targetStddev = KhanUtil.currentGraph.graph.targetStddev;
        var sortedPoints = points.sort(function(a, b) { return a.coord[0] - b.coord[0]; });
        var oldValues = [];
        $.each(sortedPoints, function(i, point) {
            oldValues.push(point.coord[0]);
        });
        var newValues = new Array(points.length);

        // brute force answer finder :(
        var loopCount = 0;
        do {
            newValues = $.map(newValues, function() {
                return KhanUtil.roundToNearest(0.5, KhanUtil.randGaussian() * targetStddev);
            });
            newValues = KhanUtil.sortNumbers(newValues);
            ++loopCount;
        } while (loopCount < 1000 && (
            KhanUtil.roundTo(1, KhanUtil.mean(newValues) !== 0) ||
            KhanUtil.roundTo(1, KhanUtil.stdDev(newValues)) !== targetStddev ||
            _.isEqual(oldValues, newValues)
        ));
        if (loopCount === 1000) {
            // better this than an infinte loop
            newValues = oldValues.slice();
        }


        $.each(oldValues, function(i, oldValue) {
            $({ 0: oldValue }).animate({ 0: newValues[i] }, {
                duration: 500,
                step: function(now, fx) {
                    KhanUtil.onMovePoint(sortedPoints[i], now, 0);
                }
            });
        });
        $({ 0: 0 }).animate({ 0: 1 }, {
            duration: 600,
            step: function(now, fx) {
                KhanUtil.updateMeanAndStddev();
            }
        });
        KhanUtil.currentGraph.graph.moved = true;
    }

});
