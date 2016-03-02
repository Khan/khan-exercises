/* TODO(csilvers): fix these lint errors (http://eslint.org/docs/rules): */
/* eslint-disable comma-dangle, indent, max-len */
/* To fix, remove an entry above, run ka-lint, and fix errors. */

define(function(require) {

$.extend(KhanUtil, {
    tabulate: function(fn, n) {
        // Return an array, [fn(), fn(), ...] of length n if fn does not take arguments
        // or the array [fn(0), fn(1), ..., fn(n - 1)] if it does
        return $.map(new Array(n), function(val, i) {
            return [fn(i)];
        });
    }
});

});
