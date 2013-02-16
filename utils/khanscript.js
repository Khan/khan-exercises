(function() {
    $.fn.khanscript = function(problem) {
        return this.find("script[type='text/khanscript']").each(function() {
            var code = $(this).text();
            code = "(function() {" + code + "})()";
            $.tmpl.getVAR(code);
        }).end();
    };
})();
