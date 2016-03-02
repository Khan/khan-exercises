/* TODO(csilvers): fix these lint errors (http://eslint.org/docs/rules): */
/* eslint-disable comma-dangle, indent, no-undef, no-var */
/* To fix, remove an entry above, run ka-lint, and fix errors. */

/*
 * This file was copied from Perseus and shouldn't be modified directly.
 */
define(function(require) {

/**
 * Compute the correct vendor-prefixed `transform`.
 */
var prefixedTransform = null;
function computePrefixedTransform() {
    // Temporary element for testing prefix validity
    var el = document.createElement("div");

    var prefixes = ["transform", "msTransform", "MozTransform",
        "WebkitTransform", "OTransform"];
    var correctPrefix = null;
    _.each(prefixes, function(prefix) {
        if (typeof el.style[prefix] !== 'undefined') {
            correctPrefix = prefix;
        }
    });
    return correctPrefix;
}

/**
 * Compute whether the browser can use 3d transforms by trying to use the
 * translateZ transformation.
 */
var canUse3dTransform = null;
function computeCanUse3dTransform() {
    var el = document.createElement("div");

    var prefix = KhanUtil.getPrefixedTransform();

    el.style[prefix] = "translateZ(0px)";
    return !!el.style[prefix];
}

$.extend(KhanUtil, {
    /**
     * Get the correct vendor-prefixed `transform`.
     */
    getPrefixedTransform: function() {
        // Cache result to avoid re-computation
        prefixedTransform = prefixedTransform || computePrefixedTransform();
        return prefixedTransform;
    },

    /**
     * Get whether the browser can use 3d transforms.
     */
    getCanUse3dTransform: function() {
        if (canUse3dTransform == null) {
            canUse3dTransform = computeCanUse3dTransform();
        }
        return canUse3dTransform;
    }
});

});
