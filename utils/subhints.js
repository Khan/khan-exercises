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

    jQuery( "a.show-subhint" ).live( "click", function( event ) {
        var subhint = jQuery( "#" + jQuery( this ).data( "subhint" ) );
        var visibleText = jQuery( this ).data( "visible-text" ) || jQuery( this ).text();
        var hiddenText = jQuery( this ).data( "hidden-text" ) || "Hide explanation";
        jQuery( this ).data({ "visible-text": visibleText, "hidden-text": hiddenText });

        if ( subhint.is( ":visible" ) ) {
            jQuery( this ).text( visibleText );
        } else {
            jQuery( this ).text( hiddenText );
        }
        jQuery( "#" + jQuery( this ).data( "subhint" ) ).toggle( 200 );
        return false;
    });

    $.extend(KhanUtil, {
        getSubHints:getSubHints,
    });
})();
