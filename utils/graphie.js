(function() {
    var Graphie = KhanUtil.Graphie = function() {
    };

    _.extend(Graphie.prototype, {
        cartToPolar: cartToPolar,
        polar: polar
    });

    /* Convert cartesian coordinates [x, y] to polar coordinates [r,
     * theta], with theta in degrees, or in radians if angleInRadians is
     * specified.
     */
    function cartToPolar(coord, angleInRadians) {
        var r = Math.sqrt(Math.pow(coord[0], 2) + Math.pow(coord[1], 2));
        var theta = Math.atan2(coord[1], coord[0]);
        // convert angle range from [-pi, pi] to [0, 2pi]
        if (theta < 0) {
            theta += 2 * Math.PI;
        }
        if (!angleInRadians) {
            theta = theta * 180 / Math.PI;
        }
        return [r, theta];
    }

    function polar(r, th) {
        if (typeof r === "number") {
            r = [r, r];
        }
        th = th * Math.PI / 180;
        return [r[0] * Math.cos(th), r[1] * Math.sin(th)];
    }

    var labelDirections = {
        "center": [-0.5, -0.5],
        "above": [-0.5, -1.0],
        "above right": [0.0, -1.0],
        "right": [0.0, -0.5],
        "below right": [0.0, 0.0],
        "below": [-0.5, 0.0],
        "below left": [-1.0, 0.0],
        "left": [-1.0, -0.5],
        "above left": [-1.0, -1.0]
    };

    KhanUtil.createGraphie = function(el) {
        var xScale = 40, yScale = 40, xRange, yRange;
        var needsLabelTypeset = false;

        $(el).css("position", "relative");
        var raphael = Raphael(el);

        // For a sometimes-reproducible IE8 bug; doesn't affect SVG browsers at all
        $(el).children("div").css("position", "absolute");

        // Set up some reasonable defaults
        var currentStyle = {
            "stroke-width": 2,
            "fill": "none"
        };

        var scaleVector = function(point) {
            if (typeof point === "number") {
                return scaleVector([point, point]);
            }

            var x = point[0], y = point[1];
            return [x * xScale, y * yScale];
        };

        var scalePoint = function scalePoint(point) {
            if (typeof point === "number") {
                return scalePoint([point, point]);
            }

            var x = point[0], y = point[1];
            return [(x - xRange[0]) * xScale, (yRange[1] - y) * yScale];
        };

        var unscalePoint = function(point) {
            var x = point[0], y = point[1];
            return [x / xScale + xRange[0], yRange[1] - y / yScale];
        };

        var unscaleVector = function(point) {
            return [point[0] / xScale, point[1] / yScale];
        };

        var setLabelMargins = function(span, size) {
            var $span = $(span);
            var direction = $span.data("labelDirection");
            $span.css("visibility", "");

            if (typeof direction === "number") {
                var x = Math.cos(direction);
                var y = Math.sin(direction);

                var scale = Math.min(
                    size[0] / 2 / Math.abs(x),
                    size[1] / 2 / Math.abs(y));

                $span.css({
                    marginLeft: (-size[0] / 2) + x * scale,
                    marginTop: (-size[1] / 2) - y * scale
                });
            } else {
                var multipliers = labelDirections[direction || "center"];
                $span.css({
                    marginLeft: Math.round(size[0] * multipliers[0]),
                    marginTop: Math.round(size[1] * multipliers[1])
                });
            }
        };

        var doLabelTypeset = function() {};

        var setNeedsLabelTypeset = function() {
            if (needsLabelTypeset) {
                return;
            }

            needsLabelTypeset = true;

            // This craziness is essentially
            //     _.defer(function() {
            //         needsLabelTypeset = false; typesetLabels();
            //     })
            // except that if you do run a setNeedsLabelTypeset() followed
            // immediately by a MathJax.Hub.Queue, the labels should all have
            // been typeset by the time the queued function runs.
            doLabelTypeset = _.once(function() {
                needsLabelTypeset = false;
                typesetLabels();
            });
            MathJax.Hub.Queue(function() {
                if (!needsLabelTypeset) {
                    return;
                }
                var done = MathJax.Callback(function() {});
                _.defer(function() {
                    doLabelTypeset();
                    done();
                });
                return done;
            });
        }

        var typesetLabels = function() {
            var spans = $(el).children(".graphie-label").get();
            if (!spans.length) {
                return;
            }

            MathJax.Hub.Queue(["Process", MathJax.Hub, el]);
            MathJax.Hub.Queue(function() {
                // If the graphie div is detached for some reason, the
                // dimensions will all just be 0 anyway so don't bother trying
                // to reposition.
                if (!$.contains(document.body, el)) {
                    return;
                }

                var callback = MathJax.Callback(function() {});

                // Wait for the browser to render the labels
                var tries = 0;
                (function check() {
                    var allRendered = true;

                    // Iterate in reverse so we can delete while iterating
                    for (var i = spans.length; i-- > 0;) {
                        var span = spans[i];
                        if (!$.contains(el, span) ||
                                span.style.display === "none") {
                            spans.splice(i, 1);
                            continue;
                        }
                        var width = span.scrollWidth;
                        var height = span.scrollHeight;

                        // Heuristic to guess if the font has kicked in so we
                        // have box metrics (magic number ick, but this seems
                        // to work mostly-consistently)
                        if (height > 18 || tries >= 10) {
                            setLabelMargins(span, [width, height]);

                            // Remove the span from the list so we don't look
                            // at it a second time
                            spans.splice(i, 1);
                        } else {
                            // Avoid an icky flash
                            $(span).css("visibility", "hidden");
                        }
                    }

                    if (spans.length) {
                        // Some spans weren't ready -- wait a bit and try again
                        tries++;
                        setTimeout(check, 100);
                    } else {
                        // We're done!
                        callback();
                    }
                })();

                return callback;
            });
        };

        var svgPath = function(points) {
            // Bound a number by 1e-6 and 1e20 to avoid exponents after toString
            function boundNumber(num) {
                if (num === 0) {
                    return num;
                } else if (num < 0) {
                    return -boundNumber(-num);
                } else {
                    return Math.max(1e-6, Math.min(num, 1e20));
                }
            }

            return $.map(points, function(point, i) {
                if (point === true) {
                    return "z";
                } else {
                    var scaled = scalePoint(point);
                    return (i === 0 ? "M" : "L") + boundNumber(scaled[0]) + " " + boundNumber(scaled[1]);
                }
            }).join("");
        };

        var processAttributes = function(attrs) {
            var transformers = {
                scale: function(scale) {
                    if (typeof scale === "number") {
                        scale = [scale, scale];
                    }

                    xScale = scale[0];
                    yScale = scale[1];

                    // Update the canvas size
                    raphael.setSize((xRange[1] - xRange[0]) * xScale, (yRange[1] - yRange[0]) * yScale);
                },

                clipRect: function(pair) {
                    var point = pair[0], size = pair[1];
                    point[1] += size[1]; // because our coordinates are flipped

                    return { "clip-rect": scalePoint(point).concat(scaleVector(size)).join(" ") };
                },

                strokeWidth: function(val) {
                    return { "stroke-width": parseFloat(val) };
                },

                rx: function(val) {
                    return { rx: scaleVector([val, 0])[0] };
                },

                ry: function(val) {
                    return { ry: scaleVector([0, val])[1] };
                },

                r: function(val) {
                    var scaled = scaleVector([val, val]);
                    return { rx: scaled[0], ry: scaled[1] };
                }
            };

            var processed = {};
            $.each(attrs || {}, function(key, value) {
                var transformer = transformers[key];

                if (typeof transformer === "function") {
                    $.extend(processed, transformer(value));
                } else {
                    var dasherized = key.replace(/([A-Z]+)([A-Z][a-z])/g, "$1-$2")
                        .replace(/([a-z\d])([A-Z])/g, "$1-$2")
                        .toLowerCase();
                    processed[dasherized] = value;
                }
            });

            return processed;
        };

        var addArrowheads = function arrows(path) {
            var type = path.constructor.prototype;

            if (type === Raphael.el) {
                if (path.type === "path" && typeof path.arrowheadsDrawn === "undefined") {
                    var w = path.attr("stroke-width"), s = 0.6 + 0.4 * w;
                    var l = path.getTotalLength();

                    if (l < 0.75 * s) {
                        // You're weird because that's a *really* short path
                        // Giving up now before I get more confused

                    } else {
                        // This makes a lot more sense
                        var set = raphael.set();
                        var head = raphael.path("M-3 4 C-2.75 2.5 0 0.25 0.75 0C0 -0.25 -2.75 -2.5 -3 -4");
                        var end = path.getPointAtLength(l - 0.4);
                        var almostTheEnd = path.getPointAtLength(l - 0.75 * s);
                        var angle = Math.atan2(end.y - almostTheEnd.y, end.x - almostTheEnd.x) * 180 / Math.PI;
                        var attrs = path.attr();
                        delete attrs.path;

                        var subpath = path.getSubpath(0, l - 0.75 * s);
                        subpath = raphael.path(subpath).attr(attrs);
                        subpath.arrowheadsDrawn = true;
                        path.remove();

                        head.rotate(angle, 0.75, 0).scale(s, s, 0.75, 0)
                            .translate(almostTheEnd.x, almostTheEnd.y).attr(attrs)
                            .attr({ "stroke-linejoin": "round", "stroke-linecap": "round" });
                        head.arrowheadsDrawn = true;
                        set.push(subpath);
                        set.push(head);
                        return set;
                    }
                }
            } else if (type === Raphael.st) {
                for (var i = 0, l = path.items.length; i < l; i++) {
                    arrows(path.items[i]);
                }
            }
            return path;
        };

        var drawingTools = {
            circle: function(center, radius) {
                return raphael.ellipse.apply(raphael, scalePoint(center).concat(scaleVector([radius, radius])));
            },

            // (x, y) is coordinate of bottom left corner
            rect: function(x, y, width, height) {
                // Raphael needs (x, y) to be coordinate of upper left corner
                var corner = scalePoint([x, y + height]);
                var dims = scaleVector([width, height]);
                return raphael.rect.apply(raphael, corner.concat(dims));
            },

            ellipse: function(center, radii) {
                return raphael.ellipse.apply(raphael, scalePoint(center).concat(scaleVector(radii)));
            },

            arc: function(center, radius, startAngle, endAngle, sector) {
                startAngle = (startAngle % 360 + 360) % 360;
                endAngle = (endAngle % 360 + 360) % 360;

                var cent = scalePoint(center);
                var radii = scaleVector(radius);
                var startVector = polar(radius, startAngle);
                var endVector = polar(radius, endAngle);

                var startPoint = scalePoint([center[0] + startVector[0], center[1] + startVector[1]]);
                var endPoint = scalePoint([center[0] + endVector[0], center[1] + endVector[1]]);

                var largeAngle = ((endAngle - startAngle) % 360 + 360) % 360 > 180;

                return raphael.path(
                    "M" + startPoint.join(" ") +
                    "A" + radii.join(" ") +
                    " 0 " + // ellipse rotation
                    (largeAngle ? 1 : 0) +
                    " 0 " + // sweep flag
                    endPoint.join(" ") +
                    (sector ? "L" + cent.join(" ") + "z" : ""));
            },

            path: function(points) {
                var p = raphael.path(svgPath(points));
                p.graphiePath = points;
                return p;
            },

            line: function(start, end) {
                return this.path([start, end]);
            },

            grid: function(xr, yr) {
                var step = currentStyle.step || [1, 1];
                var set = raphael.set();

                var x = step[0] * Math.ceil(xr[0] / step[0]);
                for (; x <= xr[1]; x += step[0]) {
                    set.push(this.line([x, yr[0]], [x, yr[1]]));
                }

                var y = step[1] * Math.ceil(yr[0] / step[1]);
                for (; y <= yr[1]; y += step[1]) {
                    set.push(this.line([xr[0], y], [xr[1], y]));
                }

                return set;
            },

            label: function(point, text, direction, latex) {
                latex = (typeof latex === "undefined") || latex;

                var $span = $("<span>").addClass("graphie-label");

                if (latex) {
                    var $script = $("<script type='math/tex'>").text(text);
                    $span.append($script);
                } else {
                    $span.html(text);
                }

                var pad = currentStyle["label-distance"];

                // TODO(alpert): Isn't currentStyle applied afterwards
                // automatically since this is a 'drawing tool'?
                $span
                    .css($.extend({}, currentStyle, {
                            position: "absolute",
                            padding: (pad != null ? pad : 7) + "px"
                        }))
                    .data("labelDirection", direction)
                    .appendTo(el);
                $span.setPosition = function(point) {
                    var scaledPoint = scalePoint(point);
                    $span.css({
                        left: scaledPoint[0],
                        top: scaledPoint[1]
                    });
                };
                $span.setPosition(point);

                setNeedsLabelTypeset();
                return $span;
            },

            plotParametric: function(fn, range) {
                currentStyle.strokeLinejoin || (currentStyle.strokeLinejoin = "round");
                currentStyle.strokeLinecap || (currentStyle.strokeLinecap = "round");

                var min = range[0], max = range[1];
                var step = (max - min) / (currentStyle["plot-points"] || 800);

                var paths = raphael.set(), points = [], lastVal = fn(min);

                for (var t = min; t <= max; t += step) {
                    var funcVal = fn(t);

                    if (
                        // if there is an asymptote here, meaning that the graph switches signs and has a large difference
                        ((funcVal[1] < 0) !== (lastVal[1] < 0)) && Math.abs(funcVal[1] - lastVal[1]) > 2 * yScale ||
                        // or the function value gets really high (which breaks raphael)
                        Math.abs(funcVal[1]) > 1e7
                       ) {
                        // split the path at this point, and draw it
                        paths.push(this.path(points));
                        // restart the path, excluding this point
                        points = [];

                    } else {
                        // otherwise, just add the point to the path
                        points.push(funcVal);
                    }

                    lastVal = funcVal;
                }

                paths.push(this.path(points));

                return paths;
            },

            plotPolar: function(fn, range) {
                var min = range[0], max = range[1];

                // There is probably a better heuristic for this
                currentStyle["plot-points"] || (currentStyle["plot-points"] = 2 * (max - min) * xScale);

                return this.plotParametric(function(th) {
                    return polar(fn(th), th * 180 / Math.PI);
                }, range);
            },

            plot: function(fn, range) {
                var min = range[0], max = range[1];
                currentStyle["plot-points"] || (currentStyle["plot-points"] = 2 * (max - min) * xScale);

                return this.plotParametric(function(x) {
                    return [x, fn(x)];
                }, range);
            },

            /**
             * Given a piecewise function, return a Raphael set of paths that
             * can be used to draw the function, e.g. using style().
             * Calls plotParametric.
             *
             * @param  {[]} fnArray    array of functions which when called
             *                         with a parameter i return the value of
             *                         the function at i
             * @param  {[]} rangeArray array of ranges over which the
             *                         corresponding functions are defined
             * @return {Raphael set}
             */
            plotPiecewise: function(fnArray, rangeArray) {
                var paths = raphael.set();
                var self = this;
                _.times(fnArray.length, function(i) {
                    var fn = fnArray[i];
                    var range = rangeArray[i];
                    var fnPaths = self.plotParametric(function(x) {
                        return [x, fn(x)];
                    }, range);
                    _.each(fnPaths, function(fnPath) {
                        paths.push(fnPath);
                    });
                });

                return paths;
            },

            /**
             * Given an array of coordinates of the form [x, y], create and
             * return a Raphael set of Raphael circle objects at those
             * coordinates
             *
             * @param  {Array of arrays} endpointArray
             * @return {Raphael set}
             */
            plotEndpointCircles: function(endpointArray) {
                var circles = raphael.set();
                var self = this;

                _.each(endpointArray, function(coord, i) {
                    circles.push(self.circle(coord, 0.15));
                });

                return circles;
            },

            plotAsymptotes: function(fn, range) {
                var min = range[0], max = range[1];
                var step = (max - min) / (currentStyle["plot-points"] || 800);

                var asymptotes = raphael.set(), lastVal = fn(min);

                for (var t = min; t <= max; t += step) {
                    var funcVal = fn(t);

                    if (((funcVal < 0) !== (lastVal < 0)) && Math.abs(funcVal - lastVal) > 2 * yScale) {
                        asymptotes.push(
                            this.line([t, yScale], [t, -yScale])
                        );
                    }

                    lastVal = funcVal;
                }

                return asymptotes;
            }
        };

        var graphie = new Graphie();
        _.extend(graphie, {
            raphael: raphael,

            init: function(options) {
                var scale = options.scale || [40, 40];
                scale = (typeof scale === "number" ? [scale, scale] : scale);

                xScale = scale[0];
                yScale = scale[1];

                if (options.range == null) {
                    return Khan.error("range should be specified in graph init");
                }

                xRange = options.range[0];
                yRange = options.range[1];

                var w = (xRange[1] - xRange[0]) * xScale, h = (yRange[1] - yRange[0]) * yScale;
                raphael.setSize(w, h);
                $(el).css({
                    "width": w,
                    "height": h
                });

                return this;
            },

            style: function(attrs, fn) {
                var processed = processAttributes(attrs);

                if (typeof fn === "function") {
                    var oldStyle = currentStyle;
                    currentStyle = $.extend({}, currentStyle, processed);
                    var result = fn.call(graphie);
                    currentStyle = oldStyle;
                    return result;
                } else {
                    $.extend(currentStyle, processed);
                }
            },

            scalePoint: scalePoint,
            scaleVector: scaleVector,

            unscalePoint: unscalePoint,
            unscaleVector: unscaleVector,

            forceLabelTypeset: function() {
                doLabelTypeset();
            }
        });

        $.each(drawingTools, function(name) {
            graphie[name] = function() {
                var last = arguments[arguments.length - 1];
                var oldStyle = currentStyle;
                var result;

                // The last argument is probably trying to change the style
                if (typeof last === "object" && !$.isArray(last)) {
                    currentStyle = $.extend({}, currentStyle, processAttributes(last));

                    var rest = [].slice.call(arguments, 0, arguments.length - 1);
                    result = drawingTools[name].apply(drawingTools, rest);
                } else {
                    currentStyle = $.extend({}, currentStyle);

                    result = drawingTools[name].apply(drawingTools, arguments);
                }

                // Bad heuristic for recognizing Raphael elements and sets
                var type = result.constructor.prototype;
                if (type === Raphael.el || type === Raphael.st) {
                    result.attr(currentStyle);

                    if (currentStyle.arrows) {
                        result = addArrowheads(result);
                    }
                } else if (result instanceof $) {
                    result.css(currentStyle);
                }

                currentStyle = oldStyle;
                return result;
            };
        });


        // Initializes graphie settings for a graph and draws the basic graph
        // features (axes, grid, tick marks, and axis labels)
        // Options expected are:
        // - range: [[a, b], [c, d]] or [a, b]
        // - scale: [a, b] or number
        // - gridOpacity: number (0 - 1)
        // - gridStep: [a, b] or number (relative to units)
        // - tickStep: [a, b] or number (relative to grid steps)
        // - tickLen: [a, b] or number (in pixels)
        // - labelStep: [a, b] or number (relative to tick steps)
        // - yLabelFormat: fn to format label string for y-axis
        // - xLabelFormat: fn to format label string for x-axis
        // - smartLabelPositioning: true or false to ignore minus sign
        graphie.graphInit = function(options) {

            options = options || {};

            $.each(options, function(prop, val) {

                // allow options to be specified by a single number for shorthand if
                // the horizontal and vertical components are the same
                if (!prop.match(/.*Opacity$/) && prop !== "range" &&
                    typeof val === "number") {
                    options[prop] = [val, val];
                }

                // allow symmetric ranges to be specified by the absolute values
                if (prop === "range" || prop === "gridRange") {
                    if (val.constructor === Array) {
                        if (val[0].constructor !== Array) {  // but don't mandate symmetric ranges
                            options[prop] = [[-val[0], val[0]], [-val[1], val[1]]];
                        }
                    } else if (typeof val === "number") {
                        options[prop] = [[-val, val], [-val, val]];
                    }
                }

            });

            var range = options.range || [[-10, 10], [-10, 10]],
                gridRange = options.gridRange || options.range,
                scale = options.scale || [20, 20],
                grid = options.grid != null ? options.grid : true,
                gridOpacity = options.gridOpacity || 0.1,
                gridStep = options.gridStep || [1, 1],
                axes = options.axes != null ? options.axes : true,
                axisArrows = options.axisArrows || "",
                axisOpacity = options.axisOpacity || 1.0,
                axisCenter = options.axisCenter || [
                    Math.min(Math.max(range[0][0], 0), range[0][1]),
                    Math.min(Math.max(range[1][0], 0), range[1][1])
                ],
                ticks = options.ticks != null ? options.ticks : true,
                tickStep = options.tickStep || [2, 2],
                tickLen = options.tickLen || [5, 5],
                tickOpacity = options.tickOpacity || 1.0,
                labels = options.labels || options.labelStep || false,
                labelStep = options.labelStep || [1, 1],
                labelOpacity = options.labelOpacity || 1.0,
                unityLabels = options.unityLabels || false,
                labelFormat = options.labelFormat || function(a) { return a; },
                xLabelFormat = options.xLabelFormat || labelFormat,
                yLabelFormat = options.yLabelFormat || labelFormat,
                smartLabelPositioning = options.smartLabelPositioning != null ?
                    options.smartLabelPositioning : true,
                realRange = [
                    [range[0][0] - (range[0][0] > 0 ? 1 : 0),
                     range[0][1] + (range[0][1] < 0 ? 1 : 0)],
                    [range[1][0] - (range[1][0] > 0 ? 1 : 0),
                     range[1][1] + (range[1][1] < 0 ? 1 : 0)]
                ];

            if (smartLabelPositioning) {
                var minusIgnorer = function(lf) { return function(a) {
                    return (lf(a) + "").replace(/-(\d)/g, "\\llap{-}$1");
                }; };

                xLabelFormat = minusIgnorer(xLabelFormat);
                yLabelFormat = minusIgnorer(yLabelFormat);
            }

            this.init({
                range: realRange,
                scale: scale
            });

            // draw grid
            if (grid) {
                this.grid(gridRange[0], gridRange[1], {
                    stroke: "#000000",
                    opacity: gridOpacity,
                    step: gridStep
                });
            }

            // draw axes
            if (axes) {

                // this is a slight hack until <-> arrowheads work
                if (axisArrows === "<->" || true) {
                    this.style({
                        stroke: "#000000",
                        opacity: axisOpacity,
                        strokeWidth: 2,
                        arrows: "->"
                    }, function() {
                        if (range[1][0] < 0 && range[1][1] > 0) {
                            this.path([axisCenter, [gridRange[0][0], axisCenter[1]]]);
                            this.path([axisCenter, [gridRange[0][1], axisCenter[1]]]);
                        }
                        if (range[0][0] < 0 && range[0][1] > 0) {
                            this.path([axisCenter, [axisCenter[0], gridRange[1][0]]]);
                            this.path([axisCenter, [axisCenter[0], gridRange[1][1]]]);
                        }
                    });

                // also, we don't support "<-" arrows yet, but why you
                // would want that on your graph is beyond me.
                } else if (axisArrows === "->" || axisArrows === "") {
                    this.style({
                        stroke: "#000000",
                        opacity: axisOpacity,
                        strokeWidth: 2,
                        arrows: axisArrows
                    }, function() {
                        this.path([[gridRange[0][0], axisCenter[1]], [gridRange[0][1], axisCenter[1]]]);
                        this.path([[axisCenter[0], gridRange[1][0]], [axisCenter[0], gridRange[1][1]]]);
                    });

                }

            }

            // draw tick marks
            if (ticks) {
                this.style({
                    stroke: "#000000",
                    opacity: tickOpacity,
                    strokeWidth: 1
                }, function() {

                    // horizontal axis
                    var step = gridStep[0] * tickStep[0],
                        len = tickLen[0] / scale[1],
                        start = gridRange[0][0],
                        stop = gridRange[0][1];

                    if (range[1][0] < 0 && range[1][1] > 0) {
                        for (var x = step + axisCenter[0]; x <= stop; x += step) {
                            if (x < stop || !axisArrows) {
                                this.line([x, -len + axisCenter[1]], [x, len + axisCenter[1]]);
                            }
                        }

                        for (var x = -step + axisCenter[0]; x >= start; x -= step) {
                            if (x > start || !axisArrows) {
                                this.line([x, -len + axisCenter[1]], [x, len + axisCenter[1]]);
                            }
                        }
                    }

                    // vertical axis
                    step = gridStep[1] * tickStep[1];
                    len = tickLen[1] / scale[0];
                    start = gridRange[1][0];
                    stop = gridRange[1][1];

                    if (range[0][0] < 0 && range[0][1] > 0) {
                        for (var y = step + axisCenter[1]; y <= stop; y += step) {
                            if (y < stop || !axisArrows) {
                                this.line([-len + axisCenter[0], y], [len + axisCenter[0], y]);
                            }
                        }

                        for (var y = -step + axisCenter[1]; y >= start; y -= step) {
                            if (y > start || !axisArrows) {
                                this.line([-len + axisCenter[0], y], [len + axisCenter[0], y]);
                            }
                        }
                    }

                });
            }

            // draw axis labels
            if (labels) {
                this.style({
                    stroke: "#000000",
                    opacity: labelOpacity
                }, function() {

                    // horizontal axis
                    var step = gridStep[0] * tickStep[0] * labelStep[0],
                        start = gridRange[0][0],
                        stop = gridRange[0][1],
                        xAxisPosition = (axisCenter[0] < 0) ? "above" : "below",
                        yAxisPosition = (axisCenter[0] < 0) ? "right" : "left",
                        xShowZero = axisCenter[0] === 0 && axisCenter[1] !== 0,
                        yShowZero = axisCenter[0] !== 0 && axisCenter[1] === 0,
                        showUnity = unityLabels || axisCenter[0] !== 0 || axisCenter[1] !== 0;

                    // positive x-axis
                    for (var x = (xShowZero ? 0 : step) + axisCenter[0]; x <= stop; x += step) {
                        if (x < stop || !axisArrows) {
                            this.label([x, axisCenter[1]], xLabelFormat(x), xAxisPosition);
                        }
                    }

                    // negative x-axis
                    for (var x = -step * (showUnity ? 1 : 2) + axisCenter[0]; x >= start; x -= step) {
                        if (x > start || !axisArrows) {
                            this.label([x, axisCenter[1]], xLabelFormat(x), xAxisPosition);
                        }
                    }

                    step = gridStep[1] * tickStep[1] * labelStep[1];
                    start = gridRange[1][0];
                    stop = gridRange[1][1];

                    // positive y-axis
                    for (var y = (yShowZero ? 0 : step) + axisCenter[1]; y <= stop; y += step) {
                        if (y < stop || !axisArrows) {
                            this.label([axisCenter[0], y], yLabelFormat(y), yAxisPosition);
                        }
                    }

                    // negative y-axis
                    for (var y = -step * (showUnity ? 1 : 2) + axisCenter[1]; y >= start; y -= step) {
                        if (y > start || !axisArrows) {
                            this.label([axisCenter[0], y], yLabelFormat(y), yAxisPosition);
                        }
                    }
                });
            }

        };

        return graphie;
    };

    $.fn.graphie = function(problem) {
        if (Khan.query.nographie != null) {
            return;
        }
        return this.find(".graphie, script[type='text/graphie']").addBack().filter(".graphie, script[type='text/graphie']").each(function() {
            // Grab code for later execution
            var code = $(this).text(), graphie;

            // Ignore code that isn't really code
            if (code.match(/Created with Rapha\xebl/)) {
                return;
            }

            // Remove any of the code that's in there
            $(this).empty();

            // Initialize the graph
            if ($(this).data("update")) {
                var id = $(this).data("update");
                $(this).remove();

                // Graph could be in either of these
                var area = $("#problemarea").add(problem);
                graphie = area.find("#" + id + ".graphie").data("graphie");
            } else {
                var el = this;
                if ($(this).filter("script")[0] != null) {
                    el = $("<div>").addClass("graphie")
                        .attr("id", $(this).attr("id")).insertAfter(this)[0];
                    $(this).remove();
                }
                graphie = KhanUtil.createGraphie(el);
                $(el).data("graphie", graphie);
            }

            // So we can write graph.bwahahaha = 17 to save stuff between updates
            if (typeof graphie.graph === "undefined") {
                graphie.graph = {};
            }

            code = "(function() {" + code + "})()";

            // Execute the graph-specific code
            KhanUtil.currentGraph = graphie;
            $.tmpl.getVAR(code, graphie);
            // delete KhanUtil.currentGraph;
        }).end();
    };
})();
