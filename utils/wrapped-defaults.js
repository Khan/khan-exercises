/* TODO(csilvers): fix these lint errors (http://eslint.org/docs/rules): */
/* eslint-disable comma-dangle, indent, no-undef, no-var, prefer-spread, space-before-function-paren */
/* To fix, remove an entry above, run ka-lint, and fix errors. */

/*
 * This file was copied from Perseus and shouldn't be modified directly.
 */
define(function(require) {

var objective_ = require("./objective_.js");
var kvector = require("./kvector.js");
require("./transform-helpers.js");

/*
 * These functions, when called on the wrapped object, simply pass the
 * arguments to the underlying Raphael object.
 */
var PASS_TO_RAPHAEL = [
    "attr",
    "animate"
];

var WrappedDefaults = _.extend({
    transform: function(transformation) {
        var prefixedTransform = KhanUtil.getPrefixedTransform();
        this.wrapper.style[prefixedTransform] = transformation;
    },

    toFront: function () {
        var parentNode = this.wrapper.parentNode;
        // XXX(joel/emily/charlie)
        if (parentNode) {
            parentNode.appendChild(this.wrapper);
        }
    },

    toBack: function () {
        var parentNode = this.wrapper.parentNode;
        if (parentNode.firstChild !== this.wrapper) {
            parentNode.insertBefore(
                this.wrapper,
                parentNode.firstChild
            );
        }
    },

    remove: function() {
        this.visibleShape.remove();
        $(this.wrapper).remove();
    },

    getMouseTarget: function() {
        return this.visibleShape[0];
    },

    moveTo: function(point) {
        var delta = kvector.subtract(
            this.graphie.scalePoint(point),
            this.graphie.scalePoint(this.initialPoint)
        );
        var do3dTransform = KhanUtil.getCanUse3dTransform();
        var transformation = "translateX(" + delta[0] + "px) " +
                             "translateY(" + delta[1] + "px)" +
                             (do3dTransform ? " translateZ(0)" : "");
        this.transform(transformation);
    },

    hide: function() {
        this.visibleShape.hide();
    },

    show: function() {
        this.visibleShape.show();
    }
}, objective_.mapObjectFromArray(PASS_TO_RAPHAEL, function(attribute) {
    return function() {
        this.visibleShape[attribute].apply(this.visibleShape, arguments);
    };
}));

return WrappedDefaults;

});
