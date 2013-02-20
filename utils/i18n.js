/**
 * Simple i18n method with sprintf-like %s replacement
 */
jQuery._ = function(str) {
    var replaces = Array.prototype.slice.call(arguments, 1);
    var obj = replaces[0] || {};

    str = str.replace(/%s/g, function(all) {
        var retVal = replaces.shift();
        return retVal === undefined ? all : retVal;
    });

    return str.replace(/%\(([\w_]+)\)s/g, function(all, name) {
        var retVal = obj[name];
        return retVal === undefined ? all : retVal;
    });
};

jQuery.ngettext = function(single, plural, num) {
    var replaces = Array.prototype.slice.call(arguments, 2);
    var obj = replaces[1] || {};

    // TODO(jeresig): i18n: Replace this with real i18n logic, likely from Jed
    var str = num === 1 ? single : plural;

    str = str.replace(/%s/g, function(all) {
        var retVal = replaces.shift();
        return retVal === undefined ? all : retVal;
    });

    return str.replace(/%\(([\w_]+)\)s/g, function(all, name) {
        var retVal = obj[name] || num;
        return retVal === undefined ? all : retVal;
    });
};

