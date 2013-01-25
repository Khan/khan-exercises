/**
 * Simple i18n method with sprintf-like %s replacement
 */
jQuery._ = function(str) {
    var replaces = Array.prototype.slice.call(arguments, 1);

    return str.replace(/%s/g, function() {
        return replaces.shift();
    });
};

jQuery.n_ = function(single, plural, num) {
    var replaces = Array.prototype.slice.call(arguments, 3);

    // TODO(jeresig): i18n: Replace this with real i18n logic, likely from Jed
    var str = num === 1 ? single : plural;

    return str.replace(/%s/g, function() {
        return replaces.shift();
    });
};