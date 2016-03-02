/* TODO(csilvers): fix these lint errors (http://eslint.org/docs/rules): */
/* eslint-disable comma-dangle, indent, no-undef, no-var */
/* To fix, remove an entry above, run ka-lint, and fix errors. */

/*
 * This file was copied from Perseus and shouldn't be modified directly.
 */
define(function(require) {

/**
 * A work-in-progress of _ methods for objects.
 * That is, they take an object as a parameter,
 * and return an object instead of an array.
 *
 * TODO(aria): Move this out of interactive2
 */

/**
 * Does a pluck on keys inside objects in an object
 *
 * Ex:
 * tools = {
 *     translation: {
 *         enabled: true
 *     },
 *     rotation: {
 *         enabled: false
 *     }
 * };
 * pluckObject(tools, "enabled") returns {
 *     translation: true
 *     rotation: false
 * }
 */
var pluck = function(table, subKey) {
    return _.object(_.map(table, function(value, key) {
        return [key, value[subKey]];
    }));
};

/**
 * Maps an object to an object
 *
 * > mapObject({a: '1', b: '2'}, (value, key) => {
 *       return value + 1;
 *   });
 * {a: 2, b: 3}
 */
var mapObject = function(obj, lambda) {
    var result = {};
    _.each(_.keys(obj), function(key) {
        result[key] = lambda(obj[key], key);
    });
    return result;
};

/**
 * Maps an array to an object
 *
 * > mapObjectFromArray(['a', 'b'], function(elem) {
 *       return elem + elem;
 *   });
 * {a: 'aa', b: 'bb'}
 */
var mapObjectFromArray = function(arr, lambda) {
    var result = {};
    _.each(arr, function(elem) {
        result[elem] = lambda(elem);
    });
    return result;
};

return {
    pluck: pluck,
    mapObject: mapObject,
    mapObjectFromArray: mapObjectFromArray
};

});
