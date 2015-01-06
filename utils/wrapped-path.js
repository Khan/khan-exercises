/*
 * This file was copied from Perseus and shouldn't be modified directly.
 */
define(function(require) {

var WrappedDefaults = require("./wrapped-defaults.js");

var DEFAULT_OPTIONS = {
    center: null, // gets ignored in `graphie.fixedPath` if `null`
    createPath: null, // gets defaulted in `graphie.fixedPath` if `null`
    mouselayer: false
};

var WrappedPath = function(graphie, points, options) {
    options = _.extend({}, DEFAULT_OPTIONS, options);

    // Add `wrapper` and `visibleShape`
    _.extend(this, graphie.fixedPath(points, options.center,
        options.createPath));

    // Add remaining properties
    _.extend(this, {
        graphie: graphie,
        initialPoint: graphie.scalePoint(_.head(points))
    });

    // Add to appropriate graphie layer
    if (options.mouselayer) {
        this.graphie.addToMouseLayerWrapper(this.wrapper);
    } else {
        this.graphie.addToVisibleLayerWrapper(this.wrapper);
    }
};

_.extend(WrappedPath.prototype, WrappedDefaults);

return WrappedPath;

});
