(function ($) {
    // from http://stackoverflow.com/questions/1891444/how-can-i-get-cursor-position-in-a-textarea?rq=1
    $.fn.getCursorPosition = function() {
        var el = $(this).get(0);
        var pos = 0;
        if ("selectionStart" in el) {
            pos = el.selectionStart;
        } else if ("selection" in document) {
            el.focus();
            var sel = document.selection.createRange();
            var selLength = document.selection.createRange().text.length;
            sel.moveStart("character", -el.value.length);
            pos = sel.text.length - selLength;
        }
        return pos;
    };

    $.fn.isCursorFirst = function() {
        var pos = $(this).getCursorPosition();
        return pos === 0;
    };

    $.fn.isCursorLast = function() {
        var pos = $(this).getCursorPosition();
        var last = $(this).val().length;
        return pos === last;
    };
})(jQuery);
