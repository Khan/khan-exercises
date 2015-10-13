/* TODO(csilvers): fix these lint errors (http://eslint.org/docs/rules): */
/* eslint-disable indent, no-unused-vars, prefer-template */
/* To fix, remove an entry above, run ka-lint, and fix errors. */

define(function(require) {

$.fn.khanscript = function(problem) {
    return this.find("script[type='text/khanscript']").each(function() {
        var code = $(this).text();
        code = "(function() {" + code + "})()";
        $.tmpl.getVAR(code);
    }).end();
};

});
