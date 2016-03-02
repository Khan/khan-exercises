/* TODO(csilvers): fix these lint errors (http://eslint.org/docs/rules): */
/* eslint-disable comma-dangle, indent, no-undef, no-var */
/* To fix, remove an entry above, run ka-lint, and fix errors. */

/*
 * This file was copied from Perseus and shouldn't be modified directly.
 */
define(function(require) {

var WrappedDefaults = require("./wrapped-defaults.js");
var kvector = require("./kvector.js");

var DEFAULT_OPTIONS = {
    maxScale: 1,
    mouselayer: false
};

var WrappedEllipse = function(graphie, center, radii, options) {
    options = _.extend({}, DEFAULT_OPTIONS, options);

    // Add `wrapper`, `visibleShape`, and remaining properties
    _.extend(this, graphie.fixedEllipse(center, radii, options.maxScale), {
        graphie: graphie,
        initialPoint: center
    });

    // Add to appropriate graphie layer
    if (options.mouselayer) {
        this.graphie.addToMouseLayerWrapper(this.wrapper);
    } else {
        this.graphie.addToVisibleLayerWrapper(this.wrapper);
    }
};

_.extend(WrappedEllipse.prototype,  {
    animateTo: function(point, time, cb) {
        var delta = kvector.subtract(
            this.graphie.scalePoint(point),
            this.graphie.scalePoint(this.initialPoint)
        );
        var do3dTransform = KhanUtil.getCanUse3dTransform();

        // Animate with step function
        var self = this;
        var prevX = null;
        var prevY = null;
        $(this.wrapper).animate({
            cx: delta[0],
            cy: delta[1]
        }, {
            duration: time,
            step: function(now, fx) {
                prevX = (fx.prop === "cx" && now) ||
                            (prevX != null && prevX) ||
                            (fx.prop === "cx" && fx.start);
                prevY = (fx.prop === "cy" && now) ||
                            (prevY != null && prevY) ||
                            (fx.prop === "cy" && fx.start);
                var transformation = "translateX(" + prevX + "px) " +
                                     "translateY(" + prevY + "px)" +
                                     (do3dTransform ? " translateZ(0)" : "");
                self.transform(transformation);

                // Pass in unscaled coord for callback
                var unscaledPoint = self.graphie.unscalePoint(kvector.add(
                    self.graphie.scalePoint(self.initialPoint),
                    [prevX, prevY]
                ));
                cb && cb(unscaledPoint);
            }
        });
    }
}, WrappedDefaults);

return WrappedEllipse;

});
