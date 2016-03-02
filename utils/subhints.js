/* TODO(csilvers): fix these lint errors (http://eslint.org/docs/rules): */
/* eslint-disable comma-dangle, indent, max-len, no-undef, no-var */
/* To fix, remove an entry above, run ka-lint, and fix errors. */

define(function(require) {

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
        // write to KALOG capturing the subhint-expand
        // click
        $(Exercises).trigger("subhintExpand", [$(this).data("subhint")]);
        $(this).text(hiddenText);
    }

    var $el = $("#" + $(this).data("subhint"));
    $el.toggle(200, function() {
        // TODO(alpert): This flashes when the subhint is revealed.
        // Flashing is better than the alternative, though:
        // https://uploads.hipchat.com/6574/33523/6qxvb1j5sh88vjv/upload.png
        $el.find("code").each(function(i, code) {
            KhanUtil.processMath(code, null, true);
        });
    });

    return false;
});

$(document).on("mouseenter mouseleave", "a.show-definition", function(event) {
    $("#" + $(this).data("definition")).toggle(200);
    return false;
});

$(document).on("click", "a.show-definition", function(e) {
    e.preventDefault();
});

$.extend(KhanUtil, {
    getSubHints: getSubHints
});

});
