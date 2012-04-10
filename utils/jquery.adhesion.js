(function($) {
    $.fn.adhere = function(options) {
        options = $.extend({
            container: null,
            topMargin: 0,
            bottomMargin: 0
        }, options);

        var container = $(options.container).eq(0);

        $(this).each(function() {
            var el = $(this);
            var data = el.data("adhesion");
            var updateDimensions = (data != null);

            if (data == null) {
                data = {};
                el.data("adhesion", data);
            }

            var shim = data.shim != null ? data.shim : $("<div>");

            shim.css({
                margin: 0,
                padding: 0,
                border: 0
            });

            if (updateDimensions) {
                if (data.scrollHandler != null) {
                    data.scrollHandler();
                }

                return;
            }

            el.before(shim);
            el.parent().css("position", "relative");
            var state = "unstuck";
            var height;

            var stick = function(update) {
                if (state === "stuck" && update !== true) return;

                shim.height(height);
                el.parent().height("auto");

                el.css({
                    position: "fixed",
                    top: options.topMargin,
                    bottom: "auto",
                    left: el.parent().offset().left,
                    width: shim.width()
                });

                state = "stuck";
            };

            var unstick = function() {
                if (state === "unstuck") return;

                shim.height(0);
                el.parent().height("auto");

                el.css({
                    position: "static",
                    width: "auto"
                });

                state = "unstuck";
            };

            var bottom = function() {
                if (state === "bottom") return;

                shim.height(0);
                el.parent().height(container.height());

                el.css({
                    position: "absolute",
                    top: "auto",
                    bottom: 0,
                    left: "auto",
                    width: shim.width()

                });

                state = "bottom";
            };

            var scrollHandler = function(update) {
                var scrollTop = $(window).scrollTop();
                var windowHeight = $(window).height();
                var containerOffset = container.offset();
                var containerHeight = container.outerHeight();
                height = el.outerHeight(true);

                var containerScrolledTop = containerOffset.top - scrollTop;
                var containerScrolledBottom = containerScrolledTop + containerHeight;

                var elFixedBottom = height + options.topMargin + options.bottomMargin;
                var shimRight = shim.offset().left + shim.outerWidth();

                if (elFixedBottom < windowHeight && containerScrolledTop - options.topMargin < 0 && shimRight <= $(window).width()) {
                    if (elFixedBottom < containerScrolledBottom) {
                        stick(update);
                    } else {
                        bottom();
                    }
                } else {
                    unstick();
                }
            };

            var resizeHandler = function() {
                scrollHandler(true);
            };

            data.scrollHandler = scrollHandler;

            $(window).scroll(scrollHandler);
            $(window).resize(resizeHandler);
        });
    };
})(jQuery);
