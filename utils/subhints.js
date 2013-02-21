(function() {
    var getSubHints = function(id, title, subHints) {
        var str = "[<a href='#' class='show-subhint' data-subhint='" + id + "'>" + title + "</a>]</p>";
        str += "<div class='subhint' id='" + id + "'>";
        for (var iHint = 0; iHint < subHints.length; iHint++) {
            str += "<p>" + subHints[iHint] + "</p>";
        }
        str += "</div>";
        return str;
    };

    $(document).on("click", "a.show-subhint", function(event) {
        var subhint = $("#" + $(this).data("subhint"));
        var visibleText = $(this).data("visible-text") || $(this).text();
        var hiddenText = $(this).data("hidden-text") || "Hide explanation";
        $(this).data({ "visible-text": visibleText, "hidden-text": hiddenText });

        if (subhint.is(":visible")) {
            $(this).text(visibleText);
        } else {
            $(this).text(hiddenText);
        }
        $("#" + $(this).data("subhint")).toggle(200);
        return false;
    });

    $(document).on("mouseenter mouseleave", "a.show-definition", function(event) {
        $("#" + $(this).data("definition")).toggle(200);
        return false;
    });

    $.extend(KhanUtil, {
        getSubHints: getSubHints
    });
})();
